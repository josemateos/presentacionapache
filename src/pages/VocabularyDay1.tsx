import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Check, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Word {
  id: number;
  spanish: string;
  english?: string;
  note?: string;
  learned: boolean;
  inProgress?: boolean;
  audioFileName?: string;
}

const VocabularyDay1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vocabulario del día 1 - Palabras de las frases 1-5
  const [words, setWords] = useState<Word[]>([
    { id: 1, spanish: "Yo", english: "I", learned: false },
    { id: 2, spanish: "Querer", english: "Want", learned: false },
    { id: 3, spanish: "Comprar", english: "Buy", learned: false },
    { id: 4, spanish: "Fresca", english: "Fresh", learned: false },
    { id: 5, spanish: "Fruta", english: "Fruit", learned: false },
    { id: 6, spanish: "Mercado", english: "Market", learned: false },
    { id: 7, spanish: "Gustar", english: "Like", learned: false },
    { id: 8, spanish: "Leer", english: "Read", learned: false },
    { id: 9, spanish: "Libro", english: "Book", learned: false },
    { id: 10, spanish: "Antes", english: "Before", learned: false },
    { id: 11, spanish: "Dormir", english: "Sleep", learned: false },
    { id: 12, spanish: "Tú", english: "You", learned: false },
    { id: 13, spanish: "Tener", english: "Have", learned: false },
    { id: 14, spanish: "Ir", english: "Go", learned: false },
    { id: 15, spanish: "Visitar", english: "Visit", learned: false },
    { id: 16, spanish: "Nos (complemento)", english: "Us", learned: false },
    { id: 17, spanish: "Nosotros", english: "We", learned: false },
    { id: 18, spanish: "Invitar", english: "Invite", learned: false },
    { id: 19, spanish: "Comer", english: "Eat", learned: false },
    { id: 20, spanish: "Mañana (parte del día)", english: "Tomorrow", learned: false },
    { id: 21, spanish: "Importante", english: "Important", learned: false },
    { id: 22, spanish: "Reunión", english: "Meeting", learned: false },
    { id: 23, spanish: "Trabajo", english: "Work", learned: false },
    { id: 24, spanish: "Esta (señalando)", english: "This", learned: false },
    { id: 25, spanish: "Tarde (parte del día)", english: "Afternoon", learned: false },
    { id: 26, spanish: "En", english: "In", learned: false },
    { id: 27, spanish: "El, La, Los, Las", english: "The", learned: false },
    { id: 28, spanish: "Un/Una", english: "a/an", learned: false },
    { id: 29, spanish: "De (de algo)", english: "Of", learned: false },
    { id: 30, spanish: "A (lugar/dirección)", english: "To", learned: false },
    { id: 31, spanish: "Tener que (obligación)", english: "Have to", learned: false },
    { id: 32, spanish: "Venir", english: "Come", learned: false },
  ]);

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const learnedCount = words.filter(w => w.learned).length;
  const progress = (learnedCount / words.length) * 100;

  // Función para ordenar array: aprendidas primero
  const sortWords = (array: Word[]) => {
    return [...array].sort((a, b) => {
      // Aprendidas primero (true = 1, false = 0, queremos descendente)
      if (a.learned === b.learned) return 0;
      return a.learned ? -1 : 1;
    });
  };

  useEffect(() => {
    // Cargar progreso guardado al montar y cuando cambia la visibilidad
    const loadProgress = () => {
      const saved = localStorage.getItem("vocabulary_day1_progress");
      if (saved) {
        try {
          const savedWords: Word[] = JSON.parse(saved);
          // Sincronizar con la lista actual: agregar palabras nuevas que no están en el progreso guardado
          const currentWords = words;
          const syncedWords = currentWords.map(currentWord => {
            const savedWord = savedWords.find(sw => sw.id === currentWord.id);
            return savedWord || currentWord;
          });
          setWords(syncedWords);
          setShuffledWords(sortWords(syncedWords));
        } catch (error) {
          console.error("Error loading saved progress:", error);
        }
      }
    };

    loadProgress();

    // Recargar cuando la página se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProgress();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    // Guardar progreso en localStorage y actualizar sorted
    localStorage.setItem("vocabulary_day1_progress", JSON.stringify(words));
    setShuffledWords(sortWords(words));
  }, [words]);

  const handleLearnWord = (word: Word) => {
    navigate(`/learn-word?id=${word.id}&spanish=${encodeURIComponent(word.spanish)}&english=${encodeURIComponent(word.english || '')}&note=${encodeURIComponent(word.note || '')}`);
  };

  const handleResetProgress = () => {
    const resetWords = words.map(w => ({ ...w, learned: false, inProgress: false }));
    setWords(resetWords);
    localStorage.removeItem("vocabulary_day1_progress");
    toast({
      title: "Progreso reiniciado",
      description: "Todas las palabras están listas para aprender de nuevo",
    });
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
        Has completado el vocabulario del Día 1
      </p>
    </motion.div>
  ) : null;

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      {/* Header */}
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
            Vocabulario del Día 1
          </h1>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10"
              onClick={handleResetProgress}
              title="Reiniciar progreso"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        {/* Progress Section */}
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

        {/* Completion Message */}
        {completionMessage}

        {/* Word List */}
        <div className="space-y-3 mt-6">
          <AnimatePresence mode="popLayout">
            {shuffledWords.map((word, index) => (
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
                  {/* Word Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl md:text-2xl text-foreground mb-2">
                      {(() => {
                        const text = word.spanish.charAt(0).toUpperCase() + word.spanish.slice(1);
                        const parenMatch = text.match(/^(.*?)(\([^)]+\))(.*)$/);
                        
                        if (parenMatch) {
                          return (
                            <>
                              <span className="font-bold">{parenMatch[1]}</span>
                              <span className="text-base font-normal">{parenMatch[2]}</span>
                              <span className="font-bold">{parenMatch[3]}</span>
                            </>
                          );
                        }
                        return <span className="font-bold">{text}</span>;
                      })()}
                    </h3>
                  </div>


                  {/* Action Buttons */}
                  <div className="flex gap-3 items-center justify-center">
                    <Badge
                      variant={word.learned ? "default" : "secondary"}
                      className={`min-w-[110px] py-2 justify-center text-sm font-medium ${
                        word.learned 
                          ? "bg-green-600 text-white hover:bg-green-700" 
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

export default VocabularyDay1;
