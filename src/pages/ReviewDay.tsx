import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Word {
  spanish: string;
  english: string;
}

interface Phrase {
  english: string;
  spanish: string;
}

// Datos de vocabulario por día
const vocabularyByDay: Record<number, Word[]> = {
  1: [
    { spanish: "Yo", english: "I" },
    { spanish: "Querer", english: "Want" },
    { spanish: "Comprar", english: "Buy" },
    { spanish: "Fresca", english: "Fresh" },
    { spanish: "Fruta", english: "Fruit" },
    { spanish: "Mercado", english: "Market" },
    { spanish: "Gustar", english: "Like" },
    { spanish: "Leer", english: "Read" },
    { spanish: "Libro", english: "Book" },
    { spanish: "Antes", english: "Before" },
    { spanish: "Dormir", english: "Sleep" },
    { spanish: "Tú", english: "You" },
    { spanish: "Tener", english: "Have" },
    { spanish: "Ir", english: "Go" },
    { spanish: "Visitar", english: "Visit" },
    { spanish: "Nos", english: "Us" },
    { spanish: "Nosotros", english: "We" },
    { spanish: "Invitar", english: "Invite" },
    { spanish: "Comer", english: "Eat" },
    { spanish: "Mañana", english: "Tomorrow" },
    { spanish: "Importante", english: "Important" },
    { spanish: "Reunión", english: "Meeting" },
    { spanish: "Trabajo", english: "Work" },
    { spanish: "Esta", english: "This" },
    { spanish: "Tarde", english: "Afternoon" },
    { spanish: "En", english: "In" },
    { spanish: "El", english: "The" },
    { spanish: "Un", english: "a/an" },
    { spanish: "De", english: "Of" },
    { spanish: "A", english: "To" },
    { spanish: "Tener que", english: "Have to" },
    { spanish: "Venir", english: "Come" },
  ],
  2: [
    { spanish: "Ellos", english: "They" },
    { spanish: "Pedir", english: "Ask" },
    { spanish: "Próximo", english: "Next" },
    { spanish: "Fin de semana", english: "Weekend" },
    { spanish: "Familia", english: "Family" },
    { spanish: "Necesitar", english: "Need" },
    { spanish: "Practicar", english: "Practice" },
    { spanish: "Inglés", english: "English" },
    { spanish: "Todos", english: "Every" },
    { spanish: "Días", english: "Days" },
    { spanish: "Ella", english: "She" },
  ],
  3: [
    { spanish: "Mi", english: "My" },
    { spanish: "Casa", english: "House" },
    { spanish: "Cerca", english: "Near" },
    { spanish: "Escuela", english: "School" },
  ],
};

// Datos de frases por día
const phrasesByDay: Record<number, Phrase[]> = {
  1: [
    { english: "I want TO buy fresh fruits at the market", spanish: "Quiero comprar frutas frescas en el mercado" },
    { english: "I like TO read a book before sleepING", spanish: "Me gusta leer un libro antes de dormir" },
    { english: "You have TO go visit us", spanish: "Tienes que ir a visitarnos" },
    { english: "We want TO invite you to eat tomorrow", spanish: "Queremos invitarte a comer mañana" },
    { english: "I have AN important work meeting this afternoon", spanish: "Esta tarde tengo una reunión de trabajo importante" },
  ],
  2: [
    { english: "They are goING TO ask us TO go", spanish: "Van a pedirnos que vayamos" },
    { english: "I WILL visit my family next weekend", spanish: "El próximo fin de semana visitaré a mi familia" },
    { english: "I need TO practice English every day", spanish: "Necesito practicar inglés todos los días" },
    { english: "She is always affectionate", spanish: "Ella siempre es cariñosa" },
    { english: "Every morning I drink coffee AT work", spanish: "Todas las mañanas tomo café en el trabajo" },
  ],
  3: [
    { english: "My house is near the school", spanish: "Mi casa está cerca de la escuela" },
    { english: "I am a student and I work on weekends", spanish: "Soy estudiante y trabajo los fines de semana" },
    { english: "He always leaveS in his car", spanish: "El siempre se va en su coche" },
    { english: "I am from Mexico but I currently live in Australia", spanish: "Soy de México pero actualmente vivo en Australia" },
    { english: "I have TO take the car to the workshop", spanish: "Tengo que llevar el automóvil al taller" },
  ],
};

type ExerciseStep = "spanish-to-english" | "english-to-spanish" | "phrase-translation" | "phrase-ordering" | "completed";

const ReviewDay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const day = parseInt(searchParams.get("day") || "1");

  const [step, setStep] = useState<ExerciseStep>("spanish-to-english");
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [reviewPhrases, setReviewPhrases] = useState<Phrase[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, boolean>>({});
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [phraseTranslationCorrect, setPhraseTranslationCorrect] = useState(false);
  const [wordBankSelection, setWordBankSelection] = useState<string[]>([]);

  useEffect(() => {
    const allWords = vocabularyByDay[day] || [];
    const allPhrases = phrasesByDay[day] || [];
    
    // Seleccionar un tercio aleatorio de palabras
    const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);
    const wordCount = Math.ceil(allWords.length / 3);
    const selectedWords = shuffledWords.slice(0, wordCount);
    
    // Seleccionar 2 frases aleatorias
    const shuffledPhrases = [...allPhrases].sort(() => Math.random() - 0.5);
    const selectedPhrases = shuffledPhrases.slice(0, 2);
    
    setReviewWords(selectedWords);
    setReviewPhrases(selectedPhrases);
  }, [day]);

  const normalizeText = (text: string) => {
    return text.toLowerCase().trim().replace(/[.,!?]/g, "");
  };

  const verifyAnswers = () => {
    const newErrors: Record<number, boolean> = {};
    let allCorrect = true;

    reviewWords.forEach((word, index) => {
      const userAnswer = userAnswers[index] || "";
      const correctAnswer = step === "spanish-to-english" ? word.english : word.spanish;
      
      if (normalizeText(userAnswer) !== normalizeText(correctAnswer)) {
        newErrors[index] = true;
        allCorrect = false;
      }
    });

    setErrors(newErrors);

    if (allCorrect) {
      if (step === "spanish-to-english") {
        setStep("english-to-spanish");
        setUserAnswers({});
        setErrors({});
        toast({
          title: "¡Excelente!",
          description: "Pasando a la siguiente fase",
        });
      } else if (step === "english-to-spanish") {
        setStep("phrase-translation");
        setUserAnswers({});
        setErrors({});
        toast({
          title: "¡Palabras completadas!",
          description: "Ahora vamos con las frases",
        });
      }
    } else {
      toast({
        title: "Hay errores",
        description: "Revisa las palabras marcadas en rojo",
        variant: "destructive",
      });
    }
  };

  const verifyPhraseTranslation = () => {
    const currentPhrase = reviewPhrases[currentPhraseIndex];
    const userAnswer = userAnswers[0] || "";
    
    if (normalizeText(userAnswer) === normalizeText(currentPhrase.spanish)) {
      setPhraseTranslationCorrect(true);
      setErrors({});
      toast({
        title: "¡Correcto!",
        description: "Ahora ordena las palabras",
      });
    } else {
      setErrors({ 0: true });
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  const verifyPhraseOrdering = () => {
    const currentPhrase = reviewPhrases[currentPhraseIndex];
    const userSentence = wordBankSelection.join(" ");
    
    if (normalizeText(userSentence) === normalizeText(currentPhrase.english)) {
      if (currentPhraseIndex < reviewPhrases.length - 1) {
        setCurrentPhraseIndex(currentPhraseIndex + 1);
        setPhraseTranslationCorrect(false);
        setWordBankSelection([]);
        setUserAnswers({});
        toast({
          title: "¡Correcto!",
          description: "Siguiente frase",
        });
      } else {
        setStep("completed");
        const completedDays = JSON.parse(localStorage.getItem("completed_review_days") || "[]");
        if (!completedDays.includes(day)) {
          completedDays.push(day);
          localStorage.setItem("completed_review_days", JSON.stringify(completedDays));
        }
        setShowCompletionDialog(true);
      }
    } else {
      toast({
        title: "Orden incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  const speakPhrase = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = audioSpeed;
    speechSynthesis.speak(utterance);
  };

  const getWordBank = () => {
    const currentPhrase = reviewPhrases[currentPhraseIndex];
    return currentPhrase.english.split(" ").sort(() => Math.random() - 0.5);
  };

  const addWordToSelection = (word: string) => {
    setWordBankSelection([...wordBankSelection, word]);
  };

  const removeWordFromSelection = (index: number) => {
    setWordBankSelection(wordBankSelection.filter((_, i) => i !== index));
  };

  const progress = step === "spanish-to-english" ? 25 : 
                   step === "english-to-spanish" ? 50 :
                   step === "phrase-translation" ? 75 : 100;

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
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            Repaso Día {day}
          </h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-md mb-6"
        >
          <h2 className="text-base font-semibold mb-4 text-center text-primary">
            Progreso del Repaso
          </h2>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-center text-xs text-muted-foreground mt-2">
            {step === "spanish-to-english" && "Español → Inglés"}
            {step === "english-to-spanish" && "Inglés → Español"}
            {step === "phrase-translation" && "Traducción de Frases"}
            {step === "phrase-ordering" && "Ordenar Frases"}
            {step === "completed" && "¡Completado!"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {(step === "spanish-to-english" || step === "english-to-spanish") && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-center text-foreground">
                  {step === "spanish-to-english" ? "Escribe en Inglés" : "Escribe en Español"}
                </h3>
                
                <div className="space-y-4">
                  {reviewWords.map((word, index) => (
                    <div key={index} className="space-y-2">
                      <p className="font-medium text-foreground">
                        {step === "spanish-to-english" ? word.spanish : word.english}
                      </p>
                      <Input
                        value={userAnswers[index] || ""}
                        onChange={(e) => setUserAnswers({ ...userAnswers, [index]: e.target.value })}
                        placeholder="Tu respuesta..."
                        className={errors[index] ? "border-destructive" : ""}
                      />
                      {errors[index] && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Incorrecto. Intenta de nuevo.
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={verifyAnswers}
                  className="w-full mt-6 gradient-animated"
                >
                  Verificar Respuestas
                </Button>
              </Card>
            </motion.div>
          )}

          {step === "phrase-translation" && reviewPhrases[currentPhraseIndex] && (
            <motion.div
              key="phrase-translation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-center text-foreground">
                  Traduce al Español
                </h3>
                
                <div className="text-center mb-4">
                  <p className="text-xl font-medium text-foreground mb-4">
                    {reviewPhrases[currentPhraseIndex].english}
                  </p>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speakPhrase(reviewPhrases[currentPhraseIndex].english)}
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Escuchar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAudioSpeed(audioSpeed === 1 ? 0.7 : 1)}
                    >
                      Velocidad: {audioSpeed === 1 ? "Normal" : "Lenta"}
                    </Button>
                  </div>
                </div>

                <Input
                  value={userAnswers[0] || ""}
                  onChange={(e) => setUserAnswers({ 0: e.target.value })}
                  placeholder="Escribe la traducción en español..."
                  className={errors[0] ? "border-destructive" : ""}
                  disabled={phraseTranslationCorrect}
                />
                
                {errors[0] && (
                  <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    Incorrecto. Intenta de nuevo.
                  </p>
                )}

                {!phraseTranslationCorrect && (
                  <Button
                    onClick={verifyPhraseTranslation}
                    className="w-full mt-6 gradient-animated"
                  >
                    Verificar Traducción
                  </Button>
                )}

                {phraseTranslationCorrect && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <p className="text-center text-green-500 font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      ¡Correcto! Ahora ordena las palabras
                    </p>

                    <div className="bg-muted/50 rounded-lg p-4 min-h-[60px]">
                      <div className="flex flex-wrap gap-2">
                        {wordBankSelection.map((word, index) => (
                          <Button
                            key={index}
                            variant="secondary"
                            size="sm"
                            onClick={() => removeWordFromSelection(index)}
                          >
                            {word}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Banco de palabras:</p>
                      <div className="flex flex-wrap gap-2">
                        {getWordBank()
                          .filter(word => !wordBankSelection.includes(word))
                          .map((word, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => addWordToSelection(word)}
                            >
                              {word}
                            </Button>
                          ))}
                      </div>
                    </div>

                    <Button
                      onClick={verifyPhraseOrdering}
                      className="w-full gradient-animated"
                      disabled={wordBankSelection.length === 0}
                    >
                      Verificar Orden
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="w-6 h-6" />
              ¡Felicitaciones!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Repaso del Día {day} completado exitosamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate("/dashboard")}>
              Volver al Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReviewDay;
