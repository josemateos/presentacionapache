import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WordData {
  word: string;
  correctImage: string;
  distractor1: string;
  distractor2: string;
  distractor3: string;
}

const WORDS_DATA: WordData[] = [
  { word: "querer", correctImage: "Una persona mirando con deseo un objeto", distractor1: "Una piedra", distractor2: "Una escoba", distractor3: "Un río" },
  { word: "comprar", correctImage: "Una persona entregando dinero a cambio de un producto", distractor1: "Un pájaro volando", distractor2: "Una lámpara", distractor3: "Un zapato" },
  { word: "fruta", correctImage: "Una canasta con manzanas, plátanos y uvas", distractor1: "Un martillo", distractor2: "Un reloj", distractor3: "Un neumático" },
  { word: "fresca", correctImage: "Una lechuga con gotas de agua", distractor1: "Un neumático quemado", distractor2: "Un desierto seco", distractor3: "Un pan viejo" },
  { word: "en", correctImage: "Un punto de ubicación (pin) dentro de un mapa", distractor1: "Un signo de igual", distractor2: "Una flecha saliendo", distractor3: "Una línea recta" },
  { word: "el", correctImage: "Un dedo índice señalando un objeto específico", distractor1: "Varios objetos sin señalar", distractor2: "Un signo de interrogación", distractor3: "Una nube" },
  { word: "mercado", correctImage: "Un puesto de verduras con gente comprando", distractor1: "Un desierto", distractor2: "Un sofá", distractor3: "Un avión" },
  { word: "gustar", correctImage: "Un ícono de pulgar arriba (like)", distractor1: "Un clavo", distractor2: "Un sombrero", distractor3: "Una ventana" },
  { word: "leer", correctImage: "Una persona concentrada con un libro abierto", distractor1: "Una botella de agua", distractor2: "Un tenedor", distractor3: "Un teclado" },
  { word: "un", correctImage: "Un solo objeto (ej. una manzana)", distractor1: "Varios objetos (ej. tres manzanas)", distractor2: "Un objeto dividido", distractor3: "Un pastel partido" },
  { word: "libro", correctImage: "Un libro cerrado sobre una mesa", distractor1: "Una nube", distractor2: "Una pelota", distractor3: "Un teléfono" },
  { word: "antes", correctImage: "Una flecha apuntando a la izquierda en una línea de tiempo", distractor1: "Un reloj marcando el futuro", distractor2: "Un signo de play", distractor3: "Un trofeo" },
  { word: "de", correctImage: "Dos engranajes conectados, mostrando origen/relación", distractor1: "Dos engranajes separados", distractor2: "Un muro", distractor3: "Un puente roto" },
  { word: "dormir", correctImage: "Una persona acostada en una cama con los ojos cerrados", distractor1: "Un puente", distractor2: "Una persona saltando", distractor3: "Un micrófono" },
  { word: "tener", correctImage: "Una mano sosteniendo un objeto (ej. unas llaves)", distractor1: "Un camino de tierra", distractor2: "Un plato vacío", distractor3: "Un lápiz" },
  { word: "ir", correctImage: "Una persona subiendo al autobus", distractor1: "Un árbol", distractor2: "Un vaso", distractor3: "Un anillo" },
  { word: "a", correctImage: "Una flecha apuntando directamente a un destino", distractor1: "Una flecha en círculo", distractor2: "Una flecha rebotando", distractor3: "Una signo de infinito" },
  { word: "visitar", correctImage: "Dos personas saludándose alegremente en una puerta", distractor1: "Una hoja de papel", distractor2: "Una silla", distractor3: "Un pez" },
  { word: "nos-complemento", correctImage: "Una flecha apuntando hacia un grupo de personas", distractor1: "Una flecha apuntando a una sola persona", distractor2: "Una casa vacía", distractor3: "Un árbol solitario" },
  { word: "invitar", correctImage: "Una persona entregando una tarjeta de invitación", distractor1: "Un ladrillo", distractor2: "Unas tijeras", distractor3: "Una taza" },
  { word: "tu", correctImage: "Una mano señalando directamente al espectador", distractor1: "Un grupo de gente", distractor2: "Un animal", distractor3: "Un edificio" },
  { word: "comer", correctImage: "Una persona llevándose un tenedor con comida a la boca", distractor1: "Un guante", distractor2: "Un botón", distractor3: "Un barco" },
  { word: "manana-tiempo", correctImage: "Un sol saliendo en el horizonte", distractor1: "Una alfombra", distractor2: "Un helado", distractor3: "Un tornillo" },
  { word: "manana-dia", correctImage: "Un calendario pasando la hoja al dia siguiente", distractor1: "una luna", distractor2: "Un dia lluvioso", distractor3: "Un despertador" },
  { word: "esta", correctImage: "Una mano apuntando hacia abajo a un objeto cercano", distractor1: "Un telescopio", distractor2: "Un mapa del mundo", distractor3: "Un avión despegando" },
  { word: "tarde", correctImage: "Un sol anaranjado poniéndose en el horizonte", distractor1: "Un sol brillante en lo alto", distractor2: "Una luna llena", distractor3: "Un gallo cantando" },
  { word: "reunion", correctImage: "Un grupo de personas sentadas alrededor de una mesa de oficina", distractor1: "Una montaña", distractor2: "Un cepillo", distractor3: "Un candado" },
  { word: "trabajo", correctImage: "Una persona escribiendo en una computadora en un escritorio", distractor1: "Un globo", distractor2: "Una cuchara", distractor3: "Unas gafas de sol" },
  { word: "importante", correctImage: "Un documento con un sello de URGENTE", distractor1: "Un papel en blanco", distractor2: "Una caja de cartón", distractor3: "Una hoja seca" },
  { word: "pedir", correctImage: "Una persona pidiendo su comida en un restaurante", distractor1: "Una persona gritando", distractor2: "Una persona durmiendo", distractor3: "Una persona corriendo" },
  { word: "nosotros", correctImage: "Un grupo de personas juntas, tomándose una selfie", distractor1: "Una persona sola", distractor2: "Un paisaje sin gente", distractor3: "Un par de zapatos" },
  { word: "proximo", correctImage: "Una flecha apuntando a la derecha en una línea de tiempo", distractor1: "Una flecha hacia atrás", distractor2: "Un reloj antiguo", distractor3: "Una ruina" },
  { word: "findesemana", correctImage: "Un calendario con sábado y domingo resaltados", distractor1: "Un calendario con lunes a viernes resaltados", distractor2: "Un reloj de oficina", distractor3: "Un maletín" },
  { word: "mi", correctImage: "Una persona abrazando su automovil", distractor1: "Una persona entregando un paquete", distractor2: "Un letrero de Público", distractor3: "Una multitud" },
  { word: "familia", correctImage: "Una familia de papas e hijos", distractor1: "Un cohete", distractor2: "Dos amigas abrazandose", distractor3: "Un paraguas" },
  { word: "necesitar", correctImage: "Una persona en el desierto mirando un vaso de agua", distractor1: "Una persona sonriendo con un helado", distractor2: "Un niño jugando", distractor3: "Un gato durmiendo" },
  { word: "practicar", correctImage: "Una persona tocando la guitarra", distractor1: "Un salero", distractor2: "Un dado", distractor3: "Una vela" },
  { word: "ingles", correctImage: "La bandera del Reino Unido y la de Estados Unidos juntas", distractor1: "La bandera de Francia", distractor2: "La bandera de Japón", distractor3: "La bandera de Brasil" },
  { word: "todos", correctImage: "Un círculo que abarca a un grupo completo de personas", distractor1: "Un círculo sobre una sola persona", distractor2: "Una línea dividiendo un grupo", distractor3: "Un signo de interrogación" },
  { word: "dias", correctImage: "Las páginas de un calendario pasando rápidamente", distractor1: "Un reloj de arena", distractor2: "Un paisaje de noche", distractor3: "Una estación del año" },
  { word: "ella", correctImage: "La fotografia de una mujer", distractor1: "La silueta de un hombre", distractor2: "Un niño jugando", distractor3: "Un animal" },
  { word: "siempre", correctImage: "El símbolo de infinito (∞) en un reloj", distractor1: "Un cronómetro", distractor2: "Un calendario de un solo día", distractor3: "Un relámpago" },
  { word: "ser", correctImage: "Una persona levantando la mano y la otra mano señalandose a si misma", distractor1: "Un signo de más (+)", distractor2: "Un signo de resta (-)", distractor3: "Un par de dados" },
  { word: "carinosa", correctImage: "Una persona abrazando a un cachorro", distractor1: "Una persona enojada", distractor2: "Una persona indiferente", distractor3: "Una roca" },
  { word: "cafe", correctImage: "Una taza humeante de café", distractor1: "Un peine", distractor2: "Un escalera", distractor3: "Un baso con leche" },
  { word: "casa", correctImage: "Una casa con puerta, ventanas y techo", distractor1: "Un televisor", distractor2: "Un calcetín", distractor3: "Un castillo" },
  { word: "cerca", correctImage: "Dos objetos muy juntos, con una flecha corta entre ellos", distractor1: "Dos objetos muy separados", distractor2: "Un telescopio", distractor3: "Un horizonte lejano" },
  { word: "escuela", correctImage: "Un edificio con una bandera y un reloj (colegio)", distractor1: "Un diamante", distractor2: "Una galleta", distractor3: "Un hospital" },
  { word: "estudiante", correctImage: "Una persona joven con una mochila y libros", distractor1: "Un doctor con una bata", distractor2: "Un bombero con un casco", distractor3: "Un chef con un gorro" },
  { word: "y", correctImage: "El símbolo de suma (+)", distractor1: "El símbolo de resta (-)", distractor2: "El símbolo de división (÷)", distractor3: "El símbolo de multiplicación (×)" },
  { word: "ellos", correctImage: "Retrato de un hombre", distractor1: "La silueta de una mujer", distractor2: "Un animal", distractor3: "Un edificio" },
  { word: "su", correctImage: "Una persona apuntando a un objeto que le pertenece", distractor1: "Un objeto sin dueño", distractor2: "Un objeto compartido por muchos", distractor3: "Un letrero de Se vende" },
  { word: "automovil", correctImage: "Un automóvil en una carretera", distractor1: "Una bicicleta", distractor2: "Un barco", distractor3: "Un avión" },
  { word: "mexico", correctImage: "La bandera de México", distractor1: "La Muralla china", distractor2: "La Estatua de la Libertad", distractor3: "El Coliseo Romano" },
  { word: "pero", correctImage: "Dos flechas yendo en direcciones opuestas", distractor1: "Dos flechas en la misma dirección", distractor2: "Un signo de suma", distractor3: "Un signo de igual" },
  { word: "actualmente", correctImage: "Un calendario con el día de hoy circulado", distractor1: "Un reloj antiguo", distractor2: "Un libro de historia", distractor3: "Un mapa de Pangea" },
  { word: "australia", correctImage: "Un canguro o el Ópera de Sídney", distractor1: "Un oso polar", distractor2: "Un camello", distractor3: "La torre Eiffel" },
  { word: "llevar", correctImage: "Una persona caminando con un objeto en sus manos", distractor1: "Una persona recibiendo un objeto", distractor2: "Una persona sentada sin nada", distractor3: "Un objeto solo en una mesa" },
  { word: "taller", correctImage: "Un mecánico trabajando en un coche con herramientas", distractor1: "Un bosque", distractor2: "Un plato de sopa", distractor3: "Una cámara" }
];

export default function GenerateWordImages() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [generatedImages, setGeneratedImages] = useState<Record<string, string[]>>({});

  const generateImage = async (prompt: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt: `Fotografía/ilustración realista (sin dibujos ni caricaturas): ${prompt}. Estilo: fotografía realista, iluminación natural, fondo neutro, encuadre limpio, 1:1` }
    });

    if (error) throw error;
    if (!data?.imageUrl) throw new Error('No image URL returned');
    
    return data.imageUrl;
  };

  const downloadImage = (base64Data: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateAllImages = async () => {
    setGenerating(true);
    setProgress(0);
    const totalImages = WORDS_DATA.length * 4; // 4 images per word
    let completedImages = 0;

    const allGenerated: Record<string, string[]> = {};

    for (const wordData of WORDS_DATA) {
      setCurrentWord(wordData.word);
      const images: string[] = [];

      try {
        // Generate correct image
        const correctImg = await generateImage(wordData.correctImage);
        images.push(correctImg);
        completedImages++;
        setProgress((completedImages / totalImages) * 100);

        // Generate distractor 1
        const dist1 = await generateImage(wordData.distractor1);
        images.push(dist1);
        completedImages++;
        setProgress((completedImages / totalImages) * 100);

        // Generate distractor 2
        const dist2 = await generateImage(wordData.distractor2);
        images.push(dist2);
        completedImages++;
        setProgress((completedImages / totalImages) * 100);

        // Generate distractor 3
        const dist3 = await generateImage(wordData.distractor3);
        images.push(dist3);
        completedImages++;
        setProgress((completedImages / totalImages) * 100);

        allGenerated[wordData.word] = images;
        setGeneratedImages({ ...allGenerated });

      } catch (error) {
        console.error(`Error generating images for ${wordData.word}:`, error);
        toast.error(`Error generando imágenes para: ${wordData.word}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setGenerating(false);
    toast.success("¡Todas las imágenes generadas!");
  };

  const downloadAllImages = () => {
    Object.entries(generatedImages).forEach(([word, images]) => {
      images.forEach((img, index) => {
        downloadImage(img, `${word}-${index + 1}.jpg`);
      });
    });
    toast.success("Descarga iniciada para todas las imágenes");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Generador de Imágenes para Vocabulario</h1>
          <p className="text-muted-foreground mb-6">
            Esta herramienta generará 236 imágenes (59 palabras × 4 imágenes) basadas en las descripciones del archivo Excel.
          </p>

          <div className="space-y-4">
            <Button
              onClick={generateAllImages}
              disabled={generating}
              size="lg"
              className="w-full"
            >
              {generating ? "Generando imágenes..." : "Generar Todas las Imágenes"}
            </Button>

            {generating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generando: {currentWord}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {Object.keys(generatedImages).length > 0 && (
              <Button
                onClick={downloadAllImages}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Todas las Imágenes
              </Button>
            )}
          </div>
        </Card>

        {/* Preview of generated images */}
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(generatedImages).map(([word, images]) => (
            <Card key={word} className="p-4">
              <h3 className="font-bold text-lg mb-3 capitalize">{word}</h3>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="space-y-2">
                    <img
                      src={img}
                      alt={`${word}-${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <p className="text-xs text-center">
                      {index === 0 ? "✓ Correcta" : `Distractor ${index}`}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => downloadImage(img, `${word}-${index + 1}.jpg`)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
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
