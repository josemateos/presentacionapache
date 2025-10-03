import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Phrase {
  id: number;
  english: string;
  spanish: string;
  learned: boolean;
}

const phrasesData: Record<number, Phrase[]> = {
  1: [
    { id: 1, english: "I want buy fresh fruits in the market", spanish: "Quiero comprar frutas frescas en el mercado", learned: false },
    { id: 2, english: "Strumming my pain with his fingers", spanish: "Rasgueando mi dolor con sus dedos", learned: false },
    { id: 3, english: "I go to school, I come back at 3", spanish: "Voy a la escuela, regreso a las 3", learned: false },
    { id: 4, english: "I fall asleep to the sound of tears of the clown", spanish: "Me duermo con el sonido de las lágrimas del payaso", learned: false },
    { id: 5, english: "Excuse me, I don't understand you", spanish: "Disculpa, no te entiendo", learned: false },
  ],
  2: [
    { id: 6, english: "In a country where they turn back time", spanish: "En un país donde retroceden el tiempo", learned: false },
    { id: 7, english: "Let's go buy something to eat", spanish: "Vamos a comprar algo de comer", learned: false },
    { id: 8, english: "Hello darkness, my old friend", spanish: "Hola oscuridad, mi vieja amiga", learned: false },
    { id: 9, english: "Buy apples and lettuce for the salad", spanish: "Compra manzanas y lechuga para la ensalada", learned: false },
    { id: 10, english: "Our love is alive, and so we begin", spanish: "Nuestro amor está vivo, y así comenzamos", learned: false },
  ],
  3: [
    { id: 11, english: "I don't want to talk", spanish: "No quiero hablar", learned: false },
  ],
};

const PhrasesDay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const day = parseInt(searchParams.get("day") || "1");

  const [phrases, setPhrases] = useState<Phrase[]>([]);

  useEffect(() => {
    const savedKey = `phrases_day${day}_progress`;
    const saved = localStorage.getItem(savedKey);
    
    if (saved) {
      try {
        setPhrases(JSON.parse(saved));
      } catch (error) {
        setPhrases(phrasesData[day] || []);
      }
    } else {
      setPhrases(phrasesData[day] || []);
    }
  }, [day]);

  useEffect(() => {
    if (phrases.length > 0) {
      const savedKey = `phrases_day${day}_progress`;
      localStorage.setItem(savedKey, JSON.stringify(phrases));
    }
  }, [phrases, day]);

  const learnedCount = phrases.filter(p => p.learned).length;
  const progress = (learnedCount / phrases.length) * 100;


  const toggleLearned = (id: number) => {
    setPhrases(phrases.map(p => 
      p.id === id ? { ...p, learned: !p.learned } : p
    ));

    const phrase = phrases.find(p => p.id === id);
    if (phrase && !phrase.learned) {
      toast({
        title: "¡Frase aprendida!",
        description: `"${phrase.english}" se ha agregado a tu progreso`,
      });
    }
  };

  const handleLearnPhrase = (phrase: Phrase) => {
    navigate(`/learn-phrase?id=${phrase.id}&day=${day}&english=${encodeURIComponent(phrase.english)}&spanish=${encodeURIComponent(phrase.spanish)}`);
  };

  const handleFinish = () => {
    if (learnedCount === phrases.length) {
      toast({
        title: "¡Día completado!",
        description: `Has completado todas las frases del Día ${day}`,
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Frases pendientes",
        description: `Te faltan ${phrases.length - learnedCount} frases por aprender`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold">Frases del Día {day}</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Día {day}</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progreso</span>
              <span>{learnedCount} de {phrases.length}</span>
            </div>
            <Progress value={progress} className="h-3 bg-muted [&>div]:bg-accent" />
          </div>
        </Card>

        <div className="space-y-4">
          {phrases.map((phrase, index) => (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-5 transition-all ${phrase.learned ? 'border-primary bg-card/50' : 'bg-card border-border'}`}>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-primary">
                          Frase {index + 1}
                        </span>
                        {phrase.learned && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="text-lg font-medium mb-2">{phrase.english}</p>
                      <p className="text-muted-foreground">{phrase.spanish}</p>
                    </div>
                  </div>

                  {!phrase.learned && (
                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => handleLearnPhrase(phrase)}
                        variant="default"
                      >
                        Aprender
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full py-6 text-lg font-semibold"
          size="lg"
          variant="outline"
        >
          Continuar más tarde
        </Button>
      </main>
    </div>
  );
};

export default PhrasesDay;
