import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles, RotateCcw, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/dashboard/BottomNav";

interface Word {
  id: number;
  spanish: string;
  english?: string;
  note?: string;
  learned: boolean;
  inProgress?: boolean;
  audioFileName?: string;
}

// Vocabulario inicial del día 1 - Palabras de las frases 1-5
const INITIAL_WORDS: Word[] = [
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
];

const VocabularyDay1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [words, setWords] = useState<Word[]>(INITIAL_WORDS);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [activeTab, setActiveTab] = useState("vocabulary");
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
          // Sincronizar con la lista inicial: agregar palabras nuevas que no están en el progreso guardado
          const syncedWords = INITIAL_WORDS.map(initialWord => {
            const savedWord = savedWords.find(sw => sw.id === initialWord.id);
            return savedWord || initialWord;
          });
          setWords(syncedWords);
        } catch (error) {
          console.error("Error loading saved progress:", error);
        }
      } else {
        // Si no hay progreso guardado, inicializar con la lista inicial
        setWords(INITIAL_WORDS);
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





  const inProgressCount = words.filter(w => w.inProgress && !w.learned).length;
  const pendingCount = words.length - learnedCount - inProgressCount;

  const completionMessage = learnedCount === words.length ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 px-4 glass-card border border-white/10 rounded-2xl"
    >
      <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary animate-pulse-subtle" />
      <h3 className="text-xl font-bold mb-2 text-primary">¡Felicitaciones!</h3>
      <p className="text-on-surface/70">Has completado el vocabulario del Día 1</p>
    </motion.div>
  ) : null;

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col selection:bg-accent/30">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-low/90 backdrop-blur-xl shadow-2xl border-b border-white/5">
        <div className="flex items-center px-6 py-5 w-full relative max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="absolute left-4 text-primary hover:bg-surface-container-high rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="mx-auto font-headline text-xl md:text-2xl font-extrabold tracking-tight text-primary">
            Vocabulario del Día 1
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetProgress}
            title="Reiniciar progreso"
            className="absolute right-4 text-on-surface/70 hover:bg-surface-container-high rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-32 px-6 max-w-2xl mx-auto w-full space-y-8">
        {/* Progreso General */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
          <div className="relative glass-card rounded-3xl p-6 border border-white/10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-accent text-xs uppercase tracking-widest mb-1 font-semibold">
                  Estado de la Misión
                </p>
                <h2 className="font-headline text-2xl font-extrabold tracking-tight">
                  Progreso General
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black gradient-text-primary">{learnedCount}</span>
                <span className="text-on-surface/60 font-bold"> / {words.length}</span>
              </div>
            </div>
            <div className="w-full h-3 bg-black rounded-full overflow-hidden p-[2px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(330 81% 70%) 100%)" }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 items-center text-[10px] font-semibold uppercase tracking-tighter text-on-surface/60">
              <span className="flex items-center gap-1 justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {learnedCount} APRENDIDAS
              </span>
              <span className="flex items-center gap-1 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> {inProgressCount} EN PROCESO
              </span>
              <span className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {pendingCount} PENDIENTES
              </span>
            </div>
          </div>
        </motion.section>

        {completionMessage}

        {/* Word List */}
        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {shuffledWords.map((word, index) => {
              const status: "learned" | "inProgress" | "pending" = word.learned
                ? "learned"
                : word.inProgress
                ? "inProgress"
                : "pending";

              const text = word.spanish.charAt(0).toUpperCase() + word.spanish.slice(1);
              const parenMatch = text.match(/^(.*?)(\([^)]+\))(.*)$/);

              return (
                <motion.div
                  key={word.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className={`bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 rounded-[2rem] p-6 group border ${
                    status === "inProgress"
                      ? "border-secondary/30 shadow-[0_0_25px_hsl(var(--secondary)/0.15)]"
                      : "border-white/5"
                  } cursor-pointer`}
                  onClick={() => handleLearnWord(word)}
                >
                  <div className="flex justify-between items-start mb-6 gap-3">
                    <h4 className="font-headline text-2xl md:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {parenMatch ? (
                        <>
                          <span>{parenMatch[1]}</span>
                          <span className="text-base font-normal text-on-surface/60">
                            {parenMatch[2]}
                          </span>
                          <span>{parenMatch[3]}</span>
                        </>
                      ) : (
                        text
                      )}
                    </h4>

                    {status === "learned" && (
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        Aprendida
                      </div>
                    )}
                    {status === "inProgress" && (
                      <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold border border-secondary/20 shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                        En curso
                      </div>
                    )}
                    {status === "pending" && (
                      <div className="flex items-center gap-1.5 bg-surface-container-highest text-on-surface/70 px-3 py-1 rounded-full text-xs font-bold border border-white/5 shrink-0">
                        Pendiente
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    {status === "learned" ? (
                      <Button
                        className="flex items-center gap-2 bg-surface-container-highest text-on-surface font-bold py-3 px-6 rounded-xl active:scale-95 transition-all hover:bg-surface-bright"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnWord(word);
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Repasar
                      </Button>
                    ) : status === "inProgress" ? (
                      <Button
                        className="flex items-center gap-2 bg-secondary text-secondary-foreground font-bold py-3 px-6 rounded-xl active:scale-95 transition-all hover:brightness-110 shadow-lg shadow-secondary/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnWord(word);
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Concluir
                      </Button>
                    ) : (
                      <Button
                        className="w-full flex items-center justify-center gap-2 text-on-primary font-black py-4 px-8 rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20"
                        style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(330 81% 70%) 100%)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnWord(word);
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Aprender
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Decorative footer */}
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
          <Sparkles className="w-8 h-8 text-primary" />
          <p className="text-xs uppercase tracking-[0.3em] text-on-surface/60">
            Sigue descodificando el camino
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isPremium={true} />
    </div>
  );
};

export default VocabularyDay1;
