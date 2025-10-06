import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Phrase {
  id: number;
  english: string;
  spanish: string;
  learned: boolean;
}

const phrasesData: Record<number, Phrase[]> = {
  1: [
    { id: 1, english: "I want to buy fresh fruit now", spanish: "Quiero comprar fruta fresca ahora", learned: false },
    { id: 2, english: "I like to read a book before sleeping", spanish: "Me gusta leer un libro antes de dormir", learned: false },
    { id: 3, english: "I have an important meeting this afternoon", spanish: "Tengo una reunión importante hoy en la tarde", learned: false },
    { id: 4, english: "Next weekend I will visit my family", spanish: "El próximo fin de semana visitaré a mi familia", learned: false },
    { id: 5, english: "I need to practice English every day to improve", spanish: "Necesito practicar inglés cada día para mejorar", learned: false },
    { id: 6, english: "I drink water every morning at work", spanish: "Tomo agua cada mañana en el trabajo", learned: false },
    { id: 7, english: "My house is near the school", spanish: "Mi casa está cerca de la escuela", learned: false },
    { id: 8, english: "I am a student and I work on weekends", spanish: "Soy estudiante y trabajo los fines de semana", learned: false },
  ],
};

const PhrasesDay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const day = parseInt(searchParams.get("day") || "1");

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [blocked, setBlocked] = useState(false);

  // Guard: mostrar modal centrado si faltan palabras del vocabulario
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vocabulary_day1_progress");
      const list: Array<{ learned: boolean }> = saved ? JSON.parse(saved) : [];
      const allLearned = list.length > 0 && list.every((w) => w.learned);
      if (!allLearned) {
        setBlocked(true);
      } else {
        setBlocked(false);
      }
    } catch {
      setBlocked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const savedKey = `phrases_day${day}_progress`;
    const saved = localStorage.getItem(savedKey);
    
    if (saved) {
      try {
        const savedArr: Phrase[] = JSON.parse(saved);
        const base = phrasesData[day] || [];
        // Merge saved learned flags with latest base content to fix outdated phrases
        const merged = base.map((b) => {
          const existing = savedArr.find((s) => s.id === b.id);
          return existing ? { ...b, learned: !!existing.learned } : b;
        });
        setPhrases(merged);
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
    <div className="min-h-screen bg-background dark flex flex-col">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Inicio</span>
          </Button>
          
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            Frases del Día {day}
          </h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      {blocked && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Completa tu vocabulario</AlertDialogTitle>
              <AlertDialogDescription>
                Para acceder a tus frases del día {day}, primero debes completar tu vocabulario del día {day}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => navigate("/dashboard")}>
                Entendido
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-md mb-6"
        >
          <h2 className="text-lg font-semibold mb-3 text-center text-primary flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Progreso General
          </h2>
          <Progress value={progress} className="h-5 mb-2" />
          <p className="text-center text-sm text-muted-foreground mt-3">
            {learnedCount} de {phrases.length} frases aprendidas
          </p>
        </motion.div>

        {/* Phrases List */}
        <div className="space-y-3">
          {phrases.map((phrase, index) => (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`p-5 transition-all duration-200 cursor-pointer hover:shadow-xl bg-card border-border ${
                  phrase.learned 
                    ? "opacity-90 border-primary/50" 
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleLearnPhrase(phrase)}
              >
                {/* Phrase Content */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {index + 1}.
                    </span>
                    {phrase.learned && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  
                  <p className="text-base md:text-lg font-medium text-foreground mb-2">
                    {phrase.spanish}
                  </p>
                  
                  <p className="text-sm md:text-base text-muted-foreground italic">
                    {phrase.english}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <Button
                    size="sm"
                    className={`min-w-[140px] ${
                      phrase.learned
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        : "gradient-animated"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnPhrase(phrase);
                    }}
                  >
                    {phrase.learned ? (
                      <>
                        Repasar
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </>
                    ) : (
                      <>
                        Ir a la Frase
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PhrasesDay;
