import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Word {
  id: number;
  spanish: string;
  english?: string;
  note?: string;
  learned: boolean;
  inProgress?: boolean;
}

const VocabularyDay2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blocked, setBlocked] = useState(false);

  // Guard: mostrar modal si no han completado el día 1
  useEffect(() => {
    try {
      const savedDay1Phrases = localStorage.getItem("phrases_day1_progress");
      const phrasesDay1: Array<{ learned: boolean }> = savedDay1Phrases ? JSON.parse(savedDay1Phrases) : [];
      const allDay1PhrasesLearned = phrasesDay1.length > 0 && phrasesDay1.every((p) => p.learned);
      
      if (!allDay1PhrasesLearned) {
        setBlocked(true);
      } else {
        setBlocked(false);
      }
    } catch {
      setBlocked(true);
    }
  }, []);

  // Vocabulario del día 2 - Palabras de las frases 6-10
  const [words, setWords] = useState<Word[]>([
    { id: 1, spanish: "Ellos", english: "They", learned: false },
    { id: 2, spanish: "Pedir", english: "Ask", learned: false },
    { id: 3, spanish: "Próximo", english: "Next", learned: false },
    { id: 4, spanish: "Fin de semana", english: "Weekend", learned: false },
    { id: 5, spanish: "Visita", english: "Visit", learned: false },
    { id: 6, spanish: "Mi", english: "My", learned: false },
    { id: 7, spanish: "Familia", english: "Family", learned: false },
    { id: 8, spanish: "Necesitar", english: "Need", learned: false },
    { id: 9, spanish: "Practicar", english: "Practice", learned: false },
    { id: 10, spanish: "Inglés", english: "English", learned: false },
    { id: 11, spanish: "Todos", english: "Every", learned: false },
    { id: 12, spanish: "Días", english: "Days", learned: false },
    { id: 13, spanish: "Ella", english: "She", learned: false },
    { id: 14, spanish: "Siempre", english: "Always", learned: false },
    { id: 15, spanish: "Ser", english: "Be", learned: false },
    { id: 16, spanish: "Cariñosa", english: "Affectionate", learned: false },
    { id: 17, spanish: "Todas", english: "All/Every", learned: false },
    { id: 18, spanish: "Mañanas", english: "Mornings", learned: false },
    { id: 19, spanish: "Tomar", english: "Take/Drink", learned: false },
    { id: 20, spanish: "Café", english: "Coffee", learned: false },
  ]);

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const learnedCount = words.filter(w => w.learned).length;
  const progress = (learnedCount / words.length) * 100;

  useEffect(() => {
    const saved = localStorage.getItem("vocabulary_day2_progress");
    if (saved) {
      try {
        const savedWords: Word[] = JSON.parse(saved);
        const merged = words.map(current => {
          const match = savedWords.find(w => w.spanish === current.spanish);
          return match ? { ...current, learned: match.learned, inProgress: match.inProgress } : current;
        });
        setWords(merged);
        localStorage.setItem("vocabulary_day2_progress", JSON.stringify(merged));
      } catch (error) {
        console.error("Error loading saved progress:", error);
        localStorage.setItem("vocabulary_day2_progress", JSON.stringify(words));
      }
    } else {
      localStorage.setItem("vocabulary_day2_progress", JSON.stringify(words));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vocabulary_day2_progress", JSON.stringify(words));
  }, [words]);

  const handleLearnWord = (word: Word) => {
    navigate(`/learn-word?id=${word.id}&spanish=${encodeURIComponent(word.spanish)}&english=${encodeURIComponent(word.english || '')}&note=${encodeURIComponent(word.note || '')}`);
  };

  const completionMessage = learnedCount === words.length ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 px-4 bg-card border border-border rounded-2xl"
    >
      <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary animate-pulse-subtle" />
      <h3 className="text-xl font-bold mb-2 text-primary">
        ¡Felicitaciones!
      </h3>
      <p className="text-muted-foreground">
        Has completado el vocabulario del Día 2
      </p>
    </motion.div>
  ) : null;

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
            Vocabulario del Día 2
          </h1>
          
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10"
            onClick={() => toast({ title: "Ajustes", description: "Próximamente" })}
          >
            <span className="hidden sm:inline mr-2">Ajustes</span>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {blocked && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Completa el Día 1</AlertDialogTitle>
              <AlertDialogDescription>
                Para acceder al vocabulario del día 2, primero debes completar todas las frases del día 1.
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-base font-semibold mb-4 text-center text-primary flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Progreso General
          </h2>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-center text-xs text-muted-foreground mt-2">
            {learnedCount} de {words.length} palabras aprendidas
          </p>
        </motion.div>

        {completionMessage}

        <div className="space-y-3 mt-6">
          <AnimatePresence mode="popLayout">
            {words.map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`p-5 transition-all duration-200 cursor-pointer hover:shadow-xl bg-card border-border ${
                    !word.learned 
                      ? "hover:border-primary/50" 
                      : "opacity-90"
                  }`}
                  onClick={() => handleLearnWord(word)}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {word.spanish.charAt(0).toUpperCase() + word.spanish.slice(1)}
                    </h3>
                  </div>

                  <div className="flex gap-3 items-center justify-center">
                    <Badge
                      variant={word.learned ? "default" : "secondary"}
                      className={`min-w-[110px] py-2 justify-center text-sm font-medium ${
                        word.learned 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-secondary-foreground border border-border"
                      }`}
                    >
                      {word.learned ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Aprendida
                        </>
                      ) : (
                        "Pendiente"
                      )}
                    </Badge>

                    <Button
                      size="sm"
                      className={`min-w-[110px] ${
                        word.learned
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          : word.inProgress
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "gradient-animated"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLearnWord(word);
                      }}
                    >
                      {word.learned ? "Repasar" : word.inProgress ? "Continuar" : "Aprender"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default VocabularyDay2;
