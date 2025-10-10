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
    { id: 1, english: "I want TO buy fresh fruits in the market", spanish: "Quiero comprar frutas frescas en el mercado", learned: false },
    { id: 2, english: "I like TO read a book before sleepING", spanish: "Me gusta leer un libro antes de dormir", learned: false },
    { id: 3, english: "You have TO go visit us", spanish: "Tienes que ir a visitarnos", learned: false },
    { id: 4, english: "We want TO invite you to eat tomorrow", spanish: "Queremos invitarte a comer mañana", learned: false },
    { id: 5, english: "I have AN important work meeting this afternoon", spanish: "Esta tarde tengo una reunión de trabajo importante", learned: false },
  ],
  2: [
    { id: 6, english: "They are goING TO ask us TO go", spanish: "Van a pedirnos que vayamos", learned: false },
    { id: 7, english: "I WILL visit my family next weekend", spanish: "El próximo fin de semana visitaré a mi familia", learned: false },
    { id: 8, english: "I need TO practice English every day", spanish: "Necesito practicar inglés todos los días", learned: false },
    { id: 9, english: "She is always affectionate", spanish: "Ella siempre es cariñosa", learned: false },
    { id: 10, english: "Every morning I drink coffee AT work", spanish: "Todas las mañanas tomo café en el trabajo", learned: false },
  ],
  3: [
    { id: 11, english: "My house is near the school", spanish: "Mi casa está cerca de la escuela", learned: false },
    { id: 12, english: "I am a student and I work on weekends", spanish: "Soy estudiante y trabajo los fines de semana", learned: false },
    { id: 13, english: "He always leaveS in his car", spanish: "El siempre se va en su coche", learned: false },
    { id: 14, english: "I am from Mexico but I currently live in Australia", spanish: "Soy de Mexico pero actualmente vivo en Australia", learned: false },
    { id: 15, english: "I have TO take the car to the workshop", spanish: "Tengo que llevar el automovil al taller", learned: false },
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


      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-md mb-6"
        >
          <h2 className="text-base font-semibold mb-4 text-center text-primary flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            Progreso General
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-2">
            {learnedCount} de {phrases.length} frases practicadas
          </p>
          <Progress value={progress} className="h-2 mb-2" />
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
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  
                  <p className="text-base md:text-lg font-medium text-foreground mb-2">
                    {phrase.spanish}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <Button
                    size="sm"
                    className={`min-w-[140px] ${
                      phrase.learned
                        ? "bg-green-600 text-white hover:bg-green-700"
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
