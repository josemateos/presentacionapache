import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadWordImage, clearImageCache } from "@/lib/imageLoader";

// Helper function to convert base64 to blob
const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([uInt8Array], { type: contentType });
};

// Import all existing images
import yo1 from "@/assets/words/yo-1.jpg";
import yo2 from "@/assets/words/yo-2.jpg";
import yo3 from "@/assets/words/yo-3.jpg";
import yo4 from "@/assets/words/yo-4.jpg";
import querer1 from "@/assets/words/querer-1.jpg";
import querer2 from "@/assets/words/querer-2.jpg";
import querer3 from "@/assets/words/querer-3.jpg";
import querer4 from "@/assets/words/querer-4.jpg";
import comprar1 from "@/assets/words/comprar-1.jpg";
import comprar2 from "@/assets/words/comprar-2.jpg";
import comprar3 from "@/assets/words/comprar-3.jpg";
import comprar4 from "@/assets/words/comprar-4.jpg";
import fruta1 from "@/assets/words/fruta-1.jpg";
import fruta2 from "@/assets/words/fruta-2.jpg";
import fruta3 from "@/assets/words/fruta-3.jpg";
import fruta4 from "@/assets/words/fruta-4.jpg";
import fresca1 from "@/assets/words/fresca-1.jpg";
import fresca2 from "@/assets/words/fresca-2.jpg";
import fresca3 from "@/assets/words/fresca-3.jpg";
import fresca4 from "@/assets/words/fresca-4.jpg";
import en1 from "@/assets/words/en-1.jpg";
import en2 from "@/assets/words/en-2.jpg";
import en3 from "@/assets/words/en-3.jpg";
import en4 from "@/assets/words/en-4.jpg";
import el1 from "@/assets/words/el-1.jpg";
import el2 from "@/assets/words/el-2.jpg";
import el3 from "@/assets/words/el-3.jpg";
import el4 from "@/assets/words/el-4.jpg";
import mercado1 from "@/assets/words/mercado-1.jpg";
import mercado2 from "@/assets/words/mercado-2-new.jpg";
import mercado3 from "@/assets/words/mercado-3-new.jpg";
import mercado4 from "@/assets/words/mercado-4-new.jpg";
import gustar1 from "@/assets/words/gustar-1.jpg";
import gustar2 from "@/assets/words/gustar-2.jpg";
import gustar3 from "@/assets/words/gustar-3.jpg";
import gustar4 from "@/assets/words/gustar-4.jpg";
import leer1 from "@/assets/words/leer-1.jpg";
import leer2 from "@/assets/words/leer-2.jpg";
import leer3 from "@/assets/words/leer-3.jpg";
import leer4 from "@/assets/words/leer-4.jpg";
import un1 from "@/assets/words/un-1.jpg";
import un2 from "@/assets/words/un-2.jpg";
import un3 from "@/assets/words/un-3.jpg";
import un4 from "@/assets/words/un-4.jpg";
import libro1 from "@/assets/words/libro-1.jpg";
import libro2 from "@/assets/words/libro-2.jpg";
import libro3 from "@/assets/words/libro-3.jpg";
import libro4 from "@/assets/words/libro-4.jpg";
import antes1 from "@/assets/words/antes-1.jpg";
import antes2 from "@/assets/words/antes-2.jpg";
import antes3 from "@/assets/words/antes-3.jpg";
import antes4 from "@/assets/words/antes-4.jpg";
import de1 from "@/assets/words/de-1.jpg";
import de2 from "@/assets/words/de-2.jpg";
import de3 from "@/assets/words/de-3.jpg";
import de4 from "@/assets/words/de-4.jpg";
import dormir1 from "@/assets/words/dormir-1.jpg";
import dormir2 from "@/assets/words/dormir-2.jpg";
import dormir3 from "@/assets/words/dormir-3.jpg";
import dormir4 from "@/assets/words/dormir-4.jpg";
import tener1 from "@/assets/words/tener-1.jpg";
import tener2 from "@/assets/words/tener-2.jpg";
import tener3 from "@/assets/words/tener-3.jpg";
import tener4 from "@/assets/words/tener-4.jpg";
import ir1 from "@/assets/words/ir-1.jpg";
import ir2 from "@/assets/words/ir-2.jpg";
import ir3 from "@/assets/words/ir-3.jpg";
import ir4 from "@/assets/words/ir-4.jpg";
import a1 from "@/assets/words/a-1.jpg";
import a2 from "@/assets/words/a-2.jpg";
import a3 from "@/assets/words/a-3.jpg";
import a4 from "@/assets/words/a-4.jpg";
import visitar1 from "@/assets/words/visitar-1.jpg";
import visitar2 from "@/assets/words/visitar-2.jpg";
import visitar3 from "@/assets/words/visitar-3.jpg";
import visitar4 from "@/assets/words/visitar-4.jpg";
import nosComplemento1 from "@/assets/words/nos-complemento-1.jpg";
import nosComplemento2 from "@/assets/words/nos-complemento-2.jpg";
import nosComplemento3 from "@/assets/words/nos-complemento-3.jpg";
import nosComplemento4 from "@/assets/words/nos-complemento-4.jpg";
import invitar1 from "@/assets/words/invitar-1.jpg";
import invitar2 from "@/assets/words/invitar-2.jpg";
import invitar3 from "@/assets/words/invitar-3.jpg";
import invitar4 from "@/assets/words/invitar-4.jpg";
import tu1 from "@/assets/words/tu-1.jpg";
import tu2 from "@/assets/words/tu-2.jpg";
import tu3 from "@/assets/words/tu-3.jpg";
import tu4 from "@/assets/words/tu-4.jpg";
import comer1 from "@/assets/words/comer-1.jpg";
import comer2 from "@/assets/words/comer-2.jpg";
import comer3 from "@/assets/words/comer-3.jpg";
import comer4 from "@/assets/words/comer-4.jpg";
import mananaTiempo1 from "@/assets/words/manana-tiempo-1.jpg";
import mananaTiempo2 from "@/assets/words/manana-tiempo-2.jpg";
import mananaTiempo3 from "@/assets/words/manana-tiempo-3.jpg";
import mananaTiempo4 from "@/assets/words/manana-tiempo-4.jpg";
import esta1 from "@/assets/words/esta-1.jpg";
import esta2 from "@/assets/words/esta-2.jpg";
import esta3 from "@/assets/words/esta-3.jpg";
import esta4 from "@/assets/words/esta-4.jpg";
import tarde1 from "@/assets/words/tarde-1.jpg";
import tarde2 from "@/assets/words/tarde-2.jpg";
import tarde3 from "@/assets/words/tarde-3.jpg";
import tarde4 from "@/assets/words/tarde-4.jpg";
import reunion1 from "@/assets/words/reunion-1.jpg";
import reunion2 from "@/assets/words/reunion-2.jpg";
import reunion3 from "@/assets/words/reunion-3.jpg";
import reunion4 from "@/assets/words/reunion-4.jpg";
import trabajo1 from "@/assets/words/trabajo-1.jpg";
import trabajo2 from "@/assets/words/trabajo-2.jpg";
import trabajo3 from "@/assets/words/trabajo-3.jpg";
import trabajo4 from "@/assets/words/trabajo-4.jpg";
import importante1 from "@/assets/words/importante-1.jpg";
import importante2 from "@/assets/words/importante-2.jpg";
import importante3 from "@/assets/words/importante-3.jpg";
import importante4 from "@/assets/words/importante-4.jpg";

interface WordReview {
  word: string;
  displayName: string;
  images: string[];
  descriptions: {
    correct: string;
    distractor1: string;
    distractor2: string;
    distractor3: string;
  };
}

const WORDS_REVIEW: WordReview[] = [
  {
    word: "yo",
    displayName: "YO",
    images: [yo1, yo2, yo3, yo4],
    descriptions: {
      correct: "Una persona frente a un espejo",
      distractor1: "Un grupo de personas",
      distractor2: "Un animal",
      distractor3: "Un paisaje"
    }
  },
  {
    word: "querer",
    displayName: "QUERER",
    images: [querer1, querer2, querer3, querer4],
    descriptions: {
      correct: "Una persona mirando con deseo una hamburguesa",
      distractor1: "Una piedra",
      distractor2: "Una escoba",
      distractor3: "Un río"
    }
  },
  {
    word: "comprar",
    displayName: "COMPRAR",
    images: [comprar1, comprar2, comprar3, comprar4],
    descriptions: {
      correct: "Una persona entregando dinero a cambio de un producto",
      distractor1: "Un pájaro volando",
      distractor2: "Una lámpara",
      distractor3: "Un zapato"
    }
  },
  {
    word: "fruta",
    displayName: "FRUTA",
    images: [fruta1, fruta2, fruta3, fruta4],
    descriptions: {
      correct: "Una canasta con manzanas, plátanos y uvas",
      distractor1: "Un martillo",
      distractor2: "Un reloj",
      distractor3: "Un neumático"
    }
  },
  {
    word: "fresca",
    displayName: "FRESCA",
    images: [fresca1, fresca2, fresca3, fresca4],
    descriptions: {
      correct: "Una lechuga con gotas de agua",
      distractor1: "Un neumático quemado",
      distractor2: "Un desierto seco",
      distractor3: "Un pan viejo"
    }
  },
  {
    word: "en",
    displayName: "EN",
    images: [en1, en2, en3, en4],
    descriptions: {
      correct: "Un punto de ubicación (pin) dentro de mapa",
      distractor1: "Un signo de igual",
      distractor2: "Una flecha saliendo",
      distractor3: "Una línea recta"
    }
  },
  {
    word: "el",
    displayName: "EL/LA",
    images: [el1, el2, el3, el4],
    descriptions: {
      correct: "Un dedo índice señalando un objeto específico",
      distractor1: "Varios objetos",
      distractor2: "Un signo de interrogación",
      distractor3: "Una nube"
    }
  },
  {
    word: "mercado",
    displayName: "MERCADO",
    images: [mercado1, mercado2, mercado3, mercado4],
    descriptions: {
      correct: "Un puesto de verduras con gente comprando",
      distractor1: "Un desierto",
      distractor2: "Un sofá",
      distractor3: "Un avión"
    }
  },
  {
    word: "gustar",
    displayName: "GUSTAR",
    images: [gustar1, gustar2, gustar3, gustar4],
    descriptions: {
      correct: "Un ícono de pulgar arriba (like)",
      distractor1: "Un clavo",
      distractor2: "Un sombrero",
      distractor3: "Una ventana"
    }
  },
  {
    word: "leer",
    displayName: "LEER",
    images: [leer1, leer2, leer3, leer4],
    descriptions: {
      correct: "Una persona concentrada con un libro abierto",
      distractor1: "Una botella de agua",
      distractor2: "Una persona comiendo",
      distractor3: "Un teclado"
    }
  },
  {
    word: "un",
    displayName: "UN/UNA",
    images: [un1, un2, un3, un4],
    descriptions: {
      correct: "Una mano con el dedo indice hacia arriba",
      distractor1: "Tres manzanas",
      distractor2: "Un objeto dividido",
      distractor3: "Una mano con dos dedos en \"V\""
    }
  },
  {
    word: "libro",
    displayName: "LIBRO",
    images: [libro1, libro2, libro3, libro4],
    descriptions: {
      correct: "Un libro cerrado sobre una mesa",
      distractor1: "Una nube",
      distractor2: "Una pelota",
      distractor3: "Un teléfono"
    }
  },
  {
    word: "antes",
    displayName: "ANTES",
    images: [antes1, antes2, antes3, antes4],
    descriptions: {
      correct: "Evolución humana: chimpancé a la izquierda, luego australopiteco con piel, luego homo erectus con piel normal cubierto completamente, luego humano moderno a la derecha. Una flecha recta horizontal apuntando de derecha a izquierda (←) ubicada arriba de todas las figuras sin taparlas. Todas las figuras con piel completa visible",
      distractor1: "Un reloj marcando el futuro",
      distractor2: "Un signo de \"play\"",
      distractor3: "Un trofeo"
    }
  },
  {
    word: "de",
    displayName: "DE (de algo)",
    images: [de1, de2, de3, de4],
    descriptions: {
      correct: "Un helado de chocolate, uno de fresa y uno de vainilla",
      distractor1: "Dos engranajes separados",
      distractor2: "Un muro",
      distractor3: "Un puente roto"
    }
  },
  {
    word: "dormir",
    displayName: "DORMIR",
    images: [dormir1, dormir2, dormir3, dormir4],
    descriptions: {
      correct: "Una persona acostada en una cama con los ojos cerrados",
      distractor1: "Un puente",
      distractor2: "Una flor",
      distractor3: "Un micrófono"
    }
  },
  {
    word: "tener",
    displayName: "TENER",
    images: [tener1, tener2, tener3, tener4],
    descriptions: {
      correct: "Una mano con la palma hacia arriba con unas llaves sobre ella",
      distractor1: "Un camino de tierra",
      distractor2: "Un plato vacío",
      distractor3: "Un lápiz"
    }
  },
  {
    word: "ir",
    displayName: "IR",
    images: [ir1, ir2, ir3, ir4],
    descriptions: {
      correct: "Una persona caminando sobre un camino",
      distractor1: "Un árbol",
      distractor2: "Un vaso",
      distractor3: "Un anillo"
    }
  },
  {
    word: "a",
    displayName: "A (lugar/direccion)",
    images: [a1, a2, a3, a4],
    descriptions: {
      correct: "Una señalización vial (flecha) apuntando a una dirección",
      distractor1: "Una flecha en círculo",
      distractor2: "Una flecha rebotando",
      distractor3: "Una signo de Infinito"
    }
  },
  {
    word: "visitar",
    displayName: "VISITAR",
    images: [visitar1, visitar2, visitar3, visitar4],
    descriptions: {
      correct: "Dos personas saludándose en la puerta de una casa, una de ellas con una maleta de equipaje",
      distractor1: "Una hoja de papel",
      distractor2: "Una silla",
      distractor3: "Un pez"
    }
  },
  {
    word: "nos-complemento",
    displayName: "NOS (complemento)",
    images: [nosComplemento1, nosComplemento2, nosComplemento3, nosComplemento4],
    descriptions: {
      correct: "Tres personas levantando la mano",
      distractor1: "Una flecha apuntando a una sola persona",
      distractor2: "Una casa vacía",
      distractor3: "Un árbol solitario"
    }
  },
  {
    word: "invitar",
    displayName: "INVITAR",
    images: [invitar1, invitar2, invitar3, invitar4],
    descriptions: {
      correct: "Una persona invitando a pasar a una casa",
      distractor1: "Un ladrillo",
      distractor2: "Unas tijeras",
      distractor3: "Un taza"
    }
  },
  {
    word: "tu",
    displayName: "TU",
    images: [tu1, tu2, tu3, tu4],
    descriptions: {
      correct: "Una persona señalando al observador de la imagen",
      distractor1: "Un grupo de gente",
      distractor2: "Un animal",
      distractor3: "Un edificio"
    }
  },
  {
    word: "comer",
    displayName: "COMER",
    images: [comer1, comer2, comer3, comer4],
    descriptions: {
      correct: "Una persona comiendo pizza",
      distractor1: "Un guante",
      distractor2: "Un botón",
      distractor3: "Un barco"
    }
  },
  {
    word: "manana-tiempo",
    displayName: "MAÑANA (parte del dia)",
    images: [mananaTiempo1, mananaTiempo2, mananaTiempo3, mananaTiempo4],
    descriptions: {
      correct: "Un calendario pasando de página (día siguiente)",
      distractor1: "Una playa",
      distractor2: "Una luna",
      distractor3: "Un reloj"
    }
  },
  {
    word: "esta",
    displayName: "ESTA (señalando)",
    images: [esta1, esta2, esta3, esta4],
    descriptions: {
      correct: "Una mano apuntando hacia abajo a un objeto cercano",
      distractor1: "Un telescopio",
      distractor2: "Un mapa del mundo",
      distractor3: "Un avión despegando"
    }
  },
  {
    word: "tarde",
    displayName: "TARDE (parte del dia)",
    images: [tarde1, tarde2, tarde3, tarde4],
    descriptions: {
      correct: "Un atardecer",
      distractor1: "Un paisaje de noche",
      distractor2: "Una luna llena",
      distractor3: "Un gallo cantando"
    }
  },
  {
    word: "reunion",
    displayName: "REUNIÓN",
    images: [reunion1, reunion2, reunion3, reunion4],
    descriptions: {
      correct: "Un grupo de personas sentadas alrededor de una mesa de oficina",
      distractor1: "Una montaña",
      distractor2: "Un cepillo",
      distractor3: "Un candado"
    }
  },
  {
    word: "trabajo",
    displayName: "TRABAJO",
    images: [trabajo1, trabajo2, trabajo3, trabajo4],
    descriptions: {
      correct: "Una persona escribiendo en una computadora en un escritorio",
      distractor1: "Un globo",
      distractor2: "Una cuchara",
      distractor3: "Unas gafas de sol"
    }
  },
  {
    word: "importante",
    displayName: "IMPORTANTE",
    images: [importante1, importante2, importante3, importante4],
    descriptions: {
      correct: "Un documento con un sello de \"URGENTE\"",
      distractor1: "Un papel en blanco",
      distractor2: "Una caja de cartón",
      distractor3: "Una hoja seca"
    }
  }
];

export default function ReviewWordImages() {
  const navigate = useNavigate();
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [updatedImages, setUpdatedImages] = useState<Record<string, string>>({});
  const [resolvedImages, setResolvedImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadAll = async () => {
      const entries = await Promise.all(
        WORDS_REVIEW.flatMap((w) =>
          w.images.map(async (fallback, index) => {
            const url = await loadWordImage(w.word, index + 1, fallback);
            const withTs = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
            return [`${w.word}-${index}`, withTs] as const;
          })
        )
      );
      setResolvedImages(Object.fromEntries(entries));
    };
    loadAll();
  }, []);

  const regenerateImage = async (word: string, imageIndex: number) => {
    const wordData = WORDS_REVIEW.find(w => w.word === word);
    if (!wordData) return;

    setRegenerating(`${word}-${imageIndex}`);

    try {
      let prompt = "";
      if (imageIndex === 0) {
        prompt = wordData.descriptions.correct;
      } else if (imageIndex === 1) {
        prompt = wordData.descriptions.distractor1;
      } else if (imageIndex === 2) {
        prompt = wordData.descriptions.distractor2;
      } else {
        prompt = wordData.descriptions.distractor3;
      }

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: `Fotografía realista de alta calidad: ${prompt}. Estilo: fotografía profesional, iluminación natural perfecta, fondo limpio y neutro, encuadre centrado, ultra alta resolución, detalles nítidos` 
        }
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error('No se recibió URL de imagen');

      // Convert base64 to blob
      const blob = base64ToBlob(data.imageUrl);
      
      // Upload to Supabase Storage
      const fileName = `${word}-${imageIndex + 1}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('word-images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('word-images')
        .getPublicUrl(fileName);

      // Cache-bust and update local state immediately
      const imageKey = `${word}-${imageIndex}`;
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
      clearImageCache();
      setResolvedImages(prev => ({ ...prev, [imageKey]: cacheBustedUrl }));
      setUpdatedImages(prev => ({ ...prev, [imageKey]: cacheBustedUrl }));

      toast.success(`Imagen regenerada: ${wordData.displayName} (${imageIndex === 0 ? 'Correcta' : 'Distractor ' + imageIndex})`);
    } catch (error) {
      console.error('Error regenerando imagen:', error);
      toast.error('Error al regenerar la imagen');
    } finally {
      setRegenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Revisar Imágenes de Vocabulario</h1>
          <p className="text-muted-foreground">
            Revisa cada imagen y regenera solo las que no sean correctas. Cada regeneración descargará automáticamente la nueva imagen.
          </p>
        </div>

        <div className="space-y-8">
          {WORDS_REVIEW.map((wordData) => (
            <Card key={wordData.word} className="p-6">
              <h2 className="text-2xl font-bold mb-4">{wordData.displayName}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wordData.images.map((img, index) => (
                  <div key={index} className="space-y-3">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src={updatedImages[`${wordData.word}-${index}`] || resolvedImages[`${wordData.word}-${index}`] || img}
                        alt={`${wordData.word}-${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">
                        {index === 0 ? "✓ Correcta" : `Distractor ${index}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {index === 0 
                          ? wordData.descriptions.correct
                          : index === 1 
                          ? wordData.descriptions.distractor1
                          : index === 2
                          ? wordData.descriptions.distractor2
                          : wordData.descriptions.distractor3
                        }
                      </p>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => regenerateImage(wordData.word, index)}
                        disabled={regenerating === `${wordData.word}-${index}`}
                      >
                        <RefreshCw className={`w-3 h-3 mr-2 ${regenerating === `${wordData.word}-${index}` ? 'animate-spin' : ''}`} />
                        {regenerating === `${wordData.word}-${index}` ? 'Regenerando...' : 'Regenerar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
