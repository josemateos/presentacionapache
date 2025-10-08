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
  correctPrompt: string;
  distractorPrompts: string[];
}

const WORDS_DATA: WordData[] = [
  {
    word: "yo",
    correctPrompt: "A person pointing to themselves with a friendly smile, clear self-reference gesture, ultra high resolution",
    distractorPrompts: [
      "A person pointing at someone else, ultra high resolution",
      "A group of people together, ultra high resolution",
      "A person waving goodbye, ultra high resolution"
    ]
  },
  {
    word: "querer",
    correctPrompt: "A person with heart symbols, showing affection or desire, warm loving expression, ultra high resolution",
    distractorPrompts: [
      "A person thinking with question marks, ultra high resolution",
      "A person refusing or saying no, ultra high resolution",
      "A person looking confused, ultra high resolution"
    ]
  },
  {
    word: "comprar",
    correctPrompt: "A person at a checkout counter paying for groceries with shopping bags, clear shopping scene, ultra high resolution",
    distractorPrompts: [
      "A person cooking in a kitchen, ultra high resolution",
      "A person eating at a restaurant, ultra high resolution",
      "A person reading a menu, ultra high resolution"
    ]
  },
  {
    word: "fresca",
    correctPrompt: "Fresh vegetables and fruits with water droplets, vibrant colors showing freshness, ultra high resolution",
    distractorPrompts: [
      "Cooked vegetables in a pot, ultra high resolution",
      "Dried fruits and nuts, ultra high resolution",
      "Canned vegetables on a shelf, ultra high resolution"
    ]
  },
  {
    word: "fruta",
    correctPrompt: "A colorful assortment of fresh fruits: apples, oranges, bananas, and grapes together, ultra high resolution",
    distractorPrompts: [
      "A plate of vegetables, ultra high resolution",
      "A basket of bread, ultra high resolution",
      "A bowl of nuts, ultra high resolution"
    ]
  },
  {
    word: "mercado",
    correctPrompt: "A vibrant farmers market with fresh produce stands, fruits, vegetables, and vendors, bustling outdoor market scene, ultra high resolution",
    distractorPrompts: [
      "A modern supermarket interior with aisles, ultra high resolution",
      "A restaurant kitchen, ultra high resolution",
      "A bakery shop, ultra high resolution"
    ]
  },
  {
    word: "gustar",
    correctPrompt: "A person enjoying food with a big smile, thumbs up, showing they like something, ultra high resolution",
    distractorPrompts: [
      "A person looking disgusted at food, ultra high resolution",
      "A person looking neutral or indifferent, ultra high resolution",
      "A person refusing food, ultra high resolution"
    ]
  },
  {
    word: "leer",
    correctPrompt: "A person sitting comfortably reading an open book, focused on the pages, ultra high resolution",
    distractorPrompts: [
      "A person writing in a notebook, ultra high resolution",
      "A person watching television, ultra high resolution",
      "A person listening to music with headphones, ultra high resolution"
    ]
  },
  {
    word: "libro",
    correctPrompt: "An open book with visible pages and text, laying on a table or being held, ultra high resolution",
    distractorPrompts: [
      "A closed notebook, ultra high resolution",
      "A magazine, ultra high resolution",
      "A newspaper, ultra high resolution"
    ]
  },
  {
    word: "antes",
    correctPrompt: "A clock showing earlier time with an arrow pointing backwards, or a 'before' timeline illustration, ultra high resolution",
    distractorPrompts: [
      "A clock showing later time with forward arrow, ultra high resolution",
      "A calendar showing today's date, ultra high resolution",
      "A clock showing current time, ultra high resolution"
    ]
  },
  {
    word: "dormir",
    correctPrompt: "A person peacefully sleeping in bed with closed eyes, pillow and blanket visible, ultra high resolution",
    distractorPrompts: [
      "A person wide awake and alert, ultra high resolution",
      "A person exercising, ultra high resolution",
      "A person eating breakfast, ultra high resolution"
    ]
  },
  {
    word: "tu",
    correctPrompt: "A person pointing towards another person (you), clear gesture indicating 'you', ultra high resolution",
    distractorPrompts: [
      "A person pointing to themselves, ultra high resolution",
      "A person pointing at multiple people, ultra high resolution",
      "A person pointing at an object, ultra high resolution"
    ]
  },
  {
    word: "tener",
    correctPrompt: "A person holding or possessing something in their hands, showing ownership or having, ultra high resolution",
    distractorPrompts: [
      "Empty hands reaching out, ultra high resolution",
      "A person giving something away, ultra high resolution",
      "A person looking for something, ultra high resolution"
    ]
  },
  {
    word: "ir",
    correctPrompt: "A person walking forward with luggage or backpack, showing movement and going somewhere, ultra high resolution",
    distractorPrompts: [
      "A person standing still, ultra high resolution",
      "A person sitting down, ultra high resolution",
      "A person lying down, ultra high resolution"
    ]
  },
  {
    word: "visitar",
    correctPrompt: "A person arriving at someone's house, ringing doorbell or being welcomed at the door, ultra high resolution",
    distractorPrompts: [
      "A person leaving their own house, ultra high resolution",
      "A person alone at home, ultra high resolution",
      "A person working in an office, ultra high resolution"
    ]
  },
  {
    word: "nos-complemento",
    correctPrompt: "Two or more people together with arrow pointing at the group, showing 'us' as object, ultra high resolution",
    distractorPrompts: [
      "One person alone, ultra high resolution",
      "Someone pointing at others (not including themselves), ultra high resolution",
      "A person pointing at one individual, ultra high resolution"
    ]
  },
  {
    word: "nosotros",
    correctPrompt: "A group of people pointing to themselves together, showing 'we', collective gesture, ultra high resolution",
    distractorPrompts: [
      "One person pointing to themselves alone, ultra high resolution",
      "A person pointing at others, ultra high resolution",
      "Two people pointing at each other, ultra high resolution"
    ]
  },
  {
    word: "invitar",
    correctPrompt: "A person welcoming others with open arms, or handing out invitations, showing invitation gesture, ultra high resolution",
    distractorPrompts: [
      "A person closing a door, ultra high resolution",
      "A person leaving alone, ultra high resolution",
      "A person waving goodbye, ultra high resolution"
    ]
  },
  {
    word: "comer",
    correctPrompt: "A person eating food with fork and knife at a table, actively consuming a meal, ultra high resolution",
    distractorPrompts: [
      "A person cooking food, ultra high resolution",
      "A person looking at food without eating, ultra high resolution",
      "A person drinking water, ultra high resolution"
    ]
  },
  {
    word: "manana",
    correctPrompt: "A sunrise or early morning scene with sun rising over horizon, morning coffee, ultra high resolution",
    distractorPrompts: [
      "A sunset scene with sun setting, ultra high resolution",
      "A night scene with moon and stars, ultra high resolution",
      "An afternoon scene with high sun, ultra high resolution"
    ]
  },
  {
    word: "importante",
    correctPrompt: "An exclamation mark with a star or highlighted document, showing priority or importance, ultra high resolution",
    distractorPrompts: [
      "A crossed-out document, ultra high resolution",
      "A trash can with paper, ultra high resolution",
      "A plain regular document, ultra high resolution"
    ]
  },
  {
    word: "reunion",
    correctPrompt: "A group of people sitting around a conference table in a meeting, discussing with laptops and papers, ultra high resolution",
    distractorPrompts: [
      "One person working alone at a desk, ultra high resolution",
      "People at a party or social gathering, ultra high resolution",
      "An empty conference room, ultra high resolution"
    ]
  },
  {
    word: "trabajo",
    correctPrompt: "A person at a desk working on a computer in an office setting, professional work environment, ultra high resolution",
    distractorPrompts: [
      "A person relaxing at home, ultra high resolution",
      "A person on vacation at the beach, ultra high resolution",
      "A person sleeping, ultra high resolution"
    ]
  },
  {
    word: "esta",
    correctPrompt: "A finger or arrow pointing at something specific nearby, demonstrating 'this' (feminine), ultra high resolution",
    distractorPrompts: [
      "A finger pointing at something far away, ultra high resolution",
      "Multiple items with no indication, ultra high resolution",
      "A general scene without focus, ultra high resolution"
    ]
  },
  {
    word: "tarde",
    correctPrompt: "An afternoon scene with sun in mid-descent, late afternoon lighting, clock showing 3-6 PM, ultra high resolution",
    distractorPrompts: [
      "A morning sunrise scene, ultra high resolution",
      "A night scene with darkness, ultra high resolution",
      "A noon scene with sun directly overhead, ultra high resolution"
    ]
  }
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
        const correctImg = await generateImage(wordData.correctPrompt);
        images.push(correctImg);
        completedImages++;
        setProgress((completedImages / totalImages) * 100);

        // Generate distractor images
        for (let i = 0; i < wordData.distractorPrompts.length; i++) {
          const distImg = await generateImage(wordData.distractorPrompts[i]);
          images.push(distImg);
          completedImages++;
          setProgress((completedImages / totalImages) * 100);
        }

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
            Esta herramienta generará 100 imágenes (25 palabras × 4 imágenes) para las primeras frases del Día 1.
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
