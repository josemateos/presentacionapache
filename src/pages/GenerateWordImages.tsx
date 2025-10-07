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
  { word: "fresca", correctImage: "Una lechuga con gotas de agua", distractor1: "Un neumático quemado", distractor2: "Un desierto seco", distractor3: "Un pan viejo" },
  { word: "antes", correctImage: "Una flecha apuntando a la izquierda en una línea de tiempo", distractor1: "Un reloj marcando el futuro", distractor2: "Un signo de play", distractor3: "Un trofeo" },
  { word: "nos", correctImage: "Una flecha apuntando hacia un grupo de personas", distractor1: "Una flecha apuntando a una sola persona", distractor2: "Una casa vacía", distractor3: "Un árbol solitario" },
  { word: "tu", correctImage: "Una mano señalando directamente al espectador", distractor1: "Un grupo de gente", distractor2: "Un animal", distractor3: "Un edificio" },
  { word: "importante", correctImage: "Un documento con un sello de URGENTE", distractor1: "Un papel en blanco", distractor2: "Una caja de cartón", distractor3: "Una hoja seca" },
  { word: "esta", correctImage: "Una mano apuntando hacia abajo a un objeto cercano", distractor1: "Un telescopio", distractor2: "Un mapa del mundo", distractor3: "Un avión despegando" },
  { word: "tarde", correctImage: "Un sol anaranjado poniéndose en el horizonte", distractor1: "Un sol brillante en lo alto", distractor2: "Una luna llena", distractor3: "Un gallo cantando" },
  { word: "ellos", correctImage: "Un grupo de tres o más personas a lo lejos", distractor1: "Una sola persona", distractor2: "Una pareja", distractor3: "Un objeto inanimado" },
  { word: "pedir", correctImage: "Una persona levantando la mano como para preguntar algo", distractor1: "Una persona gritando", distractor2: "Una persona durmiendo", distractor3: "Una persona corriendo" },
  { word: "nosotros", correctImage: "Un grupo de personas juntas tomándose una selfie", distractor1: "Una persona sola", distractor2: "Un paisaje sin gente", distractor3: "Un par de zapatos" },
  { word: "proximo", correctImage: "Una flecha apuntando a la derecha en una línea de tiempo", distractor1: "Una flecha hacia atrás", distractor2: "Un reloj antiguo", distractor3: "Una ruina" },
  { word: "findesemana", correctImage: "Un calendario con sábado y domingo resaltados", distractor1: "Un calendario con lunes a viernes resaltados", distractor2: "Un reloj de oficina", distractor3: "Un maletín" },
  { word: "mi", correctImage: "Una etiqueta de nombre con MI NOMBRE", distractor1: "Una etiqueta de Para Otro", distractor2: "Un letrero de Público", distractor3: "Una multitud" },
  { word: "necesitar", correctImage: "Una persona con sed mirando un vaso de agua", distractor1: "Una persona sonriendo con un helado", distractor2: "Un niño jugando", distractor3: "Un gato durmiendo" },
  { word: "ingles", correctImage: "La bandera del Reino Unido y la de Estados Unidos juntas", distractor1: "La bandera de Francia", distractor2: "La bandera de Japón", distractor3: "La bandera de Brasil" },
  { word: "todos", correctImage: "Un círculo que abarca a un grupo completo de personas", distractor1: "Un círculo sobre una sola persona", distractor2: "Una línea dividiendo un grupo", distractor3: "Un signo de interrogación" },
  { word: "dias", correctImage: "Las páginas de un calendario pasando rápidamente", distractor1: "Un reloj de arena", distractor2: "Una sola noche", distractor3: "Una estación del año" },
  { word: "ella", correctImage: "La silueta o retrato de una mujer", distractor1: "La silueta de un hombre", distractor2: "Un objeto", distractor3: "Un animal" },
  { word: "siempre", correctImage: "El símbolo de infinito", distractor1: "Un cronómetro", distractor2: "Un calendario de un solo día", distractor3: "Un relámpago" },
  { word: "ser", correctImage: "Un signo de igual", distractor1: "Un signo de más", distractor2: "Un signo de resta", distractor3: "Un signo de interrogación" },
  { word: "carinosa", correctImage: "Una persona abrazando a un cachorro", distractor1: "Una persona enojada", distractor2: "Una persona indiferente", distractor3: "Una roca" },
  { word: "tomar", correctImage: "Una mano agarrando una taza", distractor1: "Una mano soltando un objeto", distractor2: "Una persona empujando algo", distractor3: "Una persona corriendo" },
  { word: "estar", correctImage: "Un punto de ubicación en un mapa pin", distractor1: "Un signo de igual", distractor2: "Una ecuación matemática", distractor3: "Un corazón" },
  { word: "cerca", correctImage: "Dos objetos muy juntos con una flecha corta entre ellos", distractor1: "Dos objetos muy separados", distractor2: "Un telescopio", distractor3: "Un horizonte lejano" },
  { word: "estudiante", correctImage: "Una persona joven con una mochila y libros", distractor1: "Un doctor con una bata", distractor2: "Un bombero con un casco", distractor3: "Un chef con un gorro" },
  { word: "el", correctImage: "La silueta o retrato de un hombre", distractor1: "La silueta de una mujer", distractor2: "Un animal", distractor3: "Un edificio" },
  { word: "su", correctImage: "Una persona apuntando a un objeto que le pertenece", distractor1: "Un objeto sin dueño", distractor2: "Un objeto compartido por muchos", distractor3: "Un letrero de Se vende" },
  { word: "mexico", correctImage: "La bandera de México o el Ángel de la Independencia", distractor1: "La Torre Eiffel", distractor2: "La Estatua de la Libertad", distractor3: "El Coliseo Romano" },
  { word: "pero", correctImage: "Dos flechas yendo en direcciones opuestas", distractor1: "Dos flechas en la misma dirección", distractor2: "Un signo de suma", distractor3: "Un signo de igual" },
  { word: "actualmente", correctImage: "Un calendario con el día de hoy circulado", distractor1: "Un reloj antiguo", distractor2: "Un libro de historia", distractor3: "Un mapa de Pangea" },
  { word: "australia", correctImage: "Un canguro o la Ópera de Sídney", distractor1: "Un oso polar", distractor2: "Un camello", distractor3: "Un pingüino" },
  { word: "llevar", correctImage: "Una persona caminando con un objeto en sus manos", distractor1: "Una persona recibiendo un objeto", distractor2: "Una persona sentada sin nada", distractor3: "Un objeto solo en una mesa" },
  { word: "automovil", correctImage: "Un coche moderno", distractor1: "Una bicicleta", distractor2: "Un barco", distractor3: "Un avión" }
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
            Esta herramienta generará 132 imágenes (33 palabras × 4 imágenes) basadas en las descripciones del archivo Excel.
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
