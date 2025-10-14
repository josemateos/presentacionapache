import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, CheckCircle2, AlertCircle, Sparkles, Undo2 } from "lucide-react";
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
  clarification?: string;
}

interface Phrase {
  english: string;
  spanish: string;
}

// Datos de vocabulario por día (solo vocabulario del día, sin auxiliares clave)
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
    { spanish: "Visita", english: "Visit" },
    { spanish: "Nos", english: "Us" },
    { spanish: "Nosotros", english: "We" },
    { spanish: "Invitar", english: "Invite" },
    { spanish: "Comer", english: "Eat" },
    { spanish: "Mañana", english: "Tomorrow", clarification: "(tiempo)" },
    { spanish: "Importante", english: "Important" },
    { spanish: "Reunión", english: "Meeting" },
    { spanish: "Trabajo", english: "Work" },
    { spanish: "Tarde", english: "Afternoon" },
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

type ExerciseStep = "spanish-to-english" | "english-to-spanish" | "phrase-translation" | "apache-translation" | "phrase-ordering" | "completed";

const isAuxiliaryWord = (word: string) => {
  const auxiliaries = ["to", "will"];
  return auxiliaries.includes(word.toLowerCase());
};

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
  const [spanishToEnglishWords, setSpanishToEnglishWords] = useState<Word[]>([]);
  const [englishToSpanishWords, setEnglishToSpanishWords] = useState<Word[]>([]);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const allWords = vocabularyByDay[day] || [];
    const allPhrases = phrasesByDay[day] || [];
    
    // Seleccionar 10 palabras aleatorias para español a inglés
    const shuffled1 = [...allWords].sort(() => Math.random() - 0.5);
    const selectedWords1 = shuffled1.slice(0, Math.min(10, allWords.length));
    
    // Seleccionar 10 palabras aleatorias diferentes para inglés a español
    const shuffled2 = [...allWords].sort(() => Math.random() - 0.5);
    const selectedWords2 = shuffled2.slice(0, Math.min(10, allWords.length));
    
    // Seleccionar 2 frases aleatorias
    const shuffledPhrases = [...allPhrases].sort(() => Math.random() - 0.5);
    const selectedPhrases = shuffledPhrases.slice(0, 2);
    
    setSpanishToEnglishWords(selectedWords1);
    setEnglishToSpanishWords(selectedWords2);
    setReviewWords(selectedWords1);
    setReviewPhrases(selectedPhrases);
    setVerified(false);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [day]);

  const normalizeText = (text: string, preserveI: boolean = false) => {
    const normalized = text.trim().replace(/[.,!?]/g, "");
    if (preserveI && normalized === "I") return normalized;
    return normalized.toLowerCase();
  };

  const verifyAnswers = () => {
    const newErrors: Record<number, boolean> = {};
    let allCorrect = true;

    reviewWords.forEach((word, index) => {
      const userAnswer = userAnswers[index] || "";
      const correctAnswer = step === "spanish-to-english" ? word.english : word.spanish;
      const isEnglishAnswer = step === "spanish-to-english";
      
      if (normalizeText(userAnswer, isEnglishAnswer) !== normalizeText(correctAnswer, isEnglishAnswer)) {
        newErrors[index] = true;
        allCorrect = false;
      }
    });

    setErrors(newErrors);
    setVerified(true);

    if (allCorrect) {
      if (step === "spanish-to-english") {
        setReviewWords(englishToSpanishWords);
        
        setTimeout(() => {
          setStep("english-to-spanish");
          setUserAnswers({});
          setErrors({});
          setVerified(false);
          window.scrollTo(0, 0);
        }, 2000);
        
        toast({
          title: "✓ Verificación correcta",
          description: "Pasando a la siguiente sección",
          className: "bg-green-500 text-white border-green-600",
          duration: 2000,
        });
      } else if (step === "english-to-spanish") {
        setTimeout(() => {
          setStep("phrase-translation");
          setCurrentPhraseIndex(0);
          setUserAnswers({});
          setErrors({});
          setVerified(false);
          window.scrollTo(0, 0);
        }, 2000);
        
        toast({
          title: "✓ Verificación correcta",
          description: "Pasando a la siguiente sección",
          className: "bg-green-500 text-white border-green-600",
          duration: 2000,
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
    
    if (normalizeText(userAnswer, false) === normalizeText(currentPhrase.spanish, false)) {
      setPhraseTranslationCorrect(true);
      setErrors({});
      
      setTimeout(() => {
        setStep("apache-translation");
        setUserAnswers({});
        window.scrollTo(0, 0);
      }, 2000);
      
      toast({
        title: "✓ Verificación correcta",
        description: "Pasando a la siguiente sección",
        className: "bg-green-500 text-white border-green-600",
        duration: 2000,
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

  const verifyApacheTranslation = () => {
    const currentPhrase = reviewPhrases[currentPhraseIndex];
    const userAnswer = userAnswers[0] || "";
    
    // Crear traducción literal esperada basada en la frase en inglés
    const englishWords = currentPhrase.english.split(" ");
    const literalTranslation = englishWords.map(word => {
      const cleanWord = word.replace(/[.,!?]/g, "").toLowerCase();
      
      // Mapeo de palabras a sus traducciones literales Apache
      const apacheMap: Record<string, string> = {
        "i": "yo",
        "want": "querer",
        "to": "a",
        "buy": "comprar",
        "fresh": "fresca",
        "fruits": "frutas",
        "at": "en",
        "the": "el",
        "market": "mercado",
        "like": "gustar",
        "read": "leer",
        "a": "un",
        "book": "libro",
        "before": "antes",
        "sleeping": "durmiendo",
        "sleep": "dormir",
        "you": "tú",
        "have": "tener",
        "go": "ir",
        "visit": "visita",
        "us": "nos",
        "we": "nosotros",
        "invite": "invitar",
        "eat": "comer",
        "tomorrow": "mañana",
        "an": "un",
        "important": "importante",
        "work": "trabajo",
        "meeting": "reunión",
        "this": "esta",
        "afternoon": "tarde",
        "they": "ellos",
        "are": "ser",
        "going": "yendo",
        "ask": "pedir",
        "will": "will",
        "my": "mi",
        "family": "familia",
        "next": "próximo",
        "weekend": "fin de semana",
        "need": "necesitar",
        "practice": "practicar",
        "english": "inglés",
        "every": "todos",
        "day": "día",
        "days": "días",
        "she": "ella",
        "is": "ser",
        "always": "siempre",
        "affectionate": "cariñosa",
        "morning": "mañana",
        "drink": "tomar",
        "coffee": "café",
        "house": "casa",
        "near": "cerca",
        "school": "escuela",
        "am": "ser",
        "student": "estudiante",
        "and": "y",
        "on": "en",
        "weekends": "fines de semana",
        "he": "él",
        "leaves": "va",
        "in": "en",
        "his": "su",
        "car": "coche",
        "from": "de",
        "mexico": "méxico",
        "but": "pero",
        "currently": "actualmente",
        "live": "vivir",
        "australia": "australia",
        "take": "llevar",
        "workshop": "taller",
      };
      
      return apacheMap[cleanWord] || cleanWord;
    }).join(" ");
    
    if (normalizeText(userAnswer, false) === normalizeText(literalTranslation, false)) {
      setErrors({});
      
      setTimeout(() => {
        setStep("phrase-ordering");
        setUserAnswers({});
        window.scrollTo(0, 0);
      }, 2000);
      
      toast({
        title: "✓ Verificación correcta",
        description: "Pasando a la siguiente sección",
        className: "bg-green-500 text-white border-green-600",
        duration: 2000,
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
    
    if (normalizeText(userSentence, true) === normalizeText(currentPhrase.english, true)) {
      if (currentPhraseIndex < reviewPhrases.length - 1) {
        setCurrentPhraseIndex(currentPhraseIndex + 1);
        setPhraseTranslationCorrect(false);
        setWordBankSelection([]);
        setUserAnswers({});
        
        setTimeout(() => {
          setStep("phrase-translation");
          window.scrollTo(0, 0);
        }, 2000);
        
        toast({
          title: "✓ Verificación correcta",
          description: "Pasando a la siguiente sección",
          className: "bg-green-500 text-white border-green-600",
          duration: 2000,
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

  const goToPreviousStep = () => {
    if (step === "english-to-spanish") {
      setReviewWords(spanishToEnglishWords);
      setStep("spanish-to-english");
      setUserAnswers({});
      setErrors({});
      setVerified(false);
      window.scrollTo(0, 0);
    } else if (step === "phrase-translation") {
      setReviewWords(englishToSpanishWords);
      setStep("english-to-spanish");
      setUserAnswers({});
      setErrors({});
      setVerified(false);
      window.scrollTo(0, 0);
    } else if (step === "apache-translation") {
      setStep("phrase-translation");
      setUserAnswers({});
      setErrors({});
      window.scrollTo(0, 0);
    } else if (step === "phrase-ordering") {
      setStep("apache-translation");
      setWordBankSelection([]);
      setUserAnswers({});
      window.scrollTo(0, 0);
    }
  };

  const speakPhrase = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = audioSpeed;
    speechSynthesis.speak(utterance);
  };

  const [wordBankOrder, setWordBankOrder] = useState<string[]>([]);

  useEffect(() => {
    if (step === "phrase-ordering" && reviewPhrases[currentPhraseIndex]) {
      const currentPhrase = reviewPhrases[currentPhraseIndex];
      const words = currentPhrase.english.split(" ");
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setWordBankOrder(shuffled);
    }
  }, [step, currentPhraseIndex, reviewPhrases]);

  const getWordBank = () => {
    return wordBankOrder;
  };

  const addWordToSelection = (word: string) => {
    // Si la palabra termina con "ING", fusionarla con la última palabra
    if (word === "ING" && wordBankSelection.length > 0) {
      const lastWord = wordBankSelection[wordBankSelection.length - 1];
      const updatedSelection = [...wordBankSelection];
      updatedSelection[updatedSelection.length - 1] = lastWord + word.toLowerCase();
      setWordBankSelection(updatedSelection);
    } else {
      setWordBankSelection([...wordBankSelection, word]);
    }
  };

  const removeLastWord = () => {
    if (wordBankSelection.length > 0) {
      setWordBankSelection(wordBankSelection.slice(0, -1));
    }
  };

  const removeWordFromSelection = (index: number) => {
    setWordBankSelection(wordBankSelection.filter((_, i) => i !== index));
  };

  const totalWords = reviewWords.length;
  const totalPhrases = reviewPhrases.length;
  const totalSteps = 2 + (totalPhrases * 3); // 2 word exercises + 3 steps per phrase (translation, apache, ordering)
  
  const getCurrentStep = () => {
    if (step === "spanish-to-english") return 1;
    if (step === "english-to-spanish") return 2;
    if (step === "phrase-translation") return 3 + (currentPhraseIndex * 3);
    if (step === "apache-translation") return 4 + (currentPhraseIndex * 3);
    if (step === "phrase-ordering") return 5 + (currentPhraseIndex * 3);
    return totalSteps;
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
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            Repaso Día {day}
          </h1>
          
          {step !== "spanish-to-english" && step !== "completed" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousStep}
              className="hover:bg-primary/10"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
          )}
          {(step === "spanish-to-english" || step === "completed") && <div className="w-20"></div>}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-md mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-primary">
              Progreso del Repaso
            </h2>
            <p className="text-sm text-muted-foreground">
              {getCurrentStep()} de {totalSteps}
            </p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`flex-1 h-2 rounded-full ${getCurrentStep() > index ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {step === "spanish-to-english" && "Traducción al Inglés"}
            {step === "english-to-spanish" && "Traducción al Español"}
            {step === "phrase-translation" && `Traducción de Frase ${currentPhraseIndex + 1} al Español`}
            {step === "apache-translation" && `Traducción de Frase ${currentPhraseIndex + 1} a Español Apache`}
            {step === "phrase-ordering" && `Traducción de Frase ${currentPhraseIndex + 1} al Inglés`}
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
                {step === "english-to-spanish" && (
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    *Tomar en cuenta los acentos
                  </p>
                )}
                
                <div className="space-y-6">
                  {reviewWords.map((word, index) => {
                    const userAnswer = userAnswers[index] || "";
                    const correctAnswer = step === "spanish-to-english" ? word.english : word.spanish;
                    const isCorrect = userAnswer && normalizeText(userAnswer, step === "spanish-to-english") === normalizeText(correctAnswer, step === "spanish-to-english");
                    const hasError = errors[index];
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-2xl font-semibold text-foreground">
                            {step === "spanish-to-english" ? word.spanish : word.english}
                          </p>
                          {word.clarification && (
                            <span className="text-sm text-muted-foreground">{word.clarification}</span>
                          )}
                        </div>
                        <Input
                          value={userAnswer}
                          onChange={(e) => setUserAnswers({ ...userAnswers, [index]: e.target.value })}
                          onFocus={() => {
                            if (errors[index]) {
                              setErrors({ ...errors, [index]: false });
                            }
                          }}
                          placeholder="Tu respuesta..."
                          className={`text-center text-lg ${
                            hasError ? "border-destructive text-destructive" : verified && isCorrect ? "text-green-500" : "text-white"
                          }`}
                        />
                        {hasError && (
                          <p className="text-sm text-destructive flex items-center justify-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Incorrecto. Intenta de nuevo.
                          </p>
                        )}
                      </div>
                    );
                  })}
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

          {(step === "phrase-translation" || step === "apache-translation") && reviewPhrases[currentPhraseIndex] && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-center text-foreground">
                  {step === "apache-translation" ? "Traduce a Español Apache" : "Traduce al Español"}
                </h3>
                
                <div className="text-center mb-4">
                  <p className="text-xl font-medium text-foreground mb-4">
                    {reviewPhrases[currentPhraseIndex].english}
                  </p>
                  
                  {step === "phrase-translation" && (
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
                  )}
                </div>

                <textarea
                  value={userAnswers[0] || ""}
                  onChange={(e) => setUserAnswers({ 0: e.target.value })}
                  onFocus={() => {
                    if (errors[0]) {
                      setErrors({ ...errors, 0: false });
                    }
                  }}
                  placeholder="Escribe la traducción en español..."
                  className={`w-full min-h-[100px] p-4 text-lg rounded-lg border ${
                    errors[0] ? "border-destructive" : "border-border"
                  } bg-background resize-none`}
                />
                
                {errors[0] && (
                  <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    Incorrecto. Intenta de nuevo.
                  </p>
                )}

                <Button
                  onClick={step === "apache-translation" ? verifyApacheTranslation : verifyPhraseTranslation}
                  className="w-full mt-6 gradient-animated"
                >
                  Verificar Traducción
                </Button>
              </Card>
            </motion.div>
          )}

          {step === "phrase-ordering" && reviewPhrases[currentPhraseIndex] && (
            <motion.div
              key="phrase-ordering"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-center text-foreground">
                  Ordena las palabras
                </h3>

                <div className="text-center mb-6">
                  <p className="text-xl font-medium text-foreground">
                    {reviewPhrases[currentPhraseIndex].spanish}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 min-h-[80px] mb-4">
                  <div className="flex flex-wrap gap-2">
                    {wordBankSelection.map((word, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        size="sm"
                        onClick={() => removeWordFromSelection(index)}
                        className={isAuxiliaryWord(word) ? "text-yellow-500" : ""}
                      >
                        {isAuxiliaryWord(word) ? word.toLowerCase() : word}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Banco de palabras:</p>
                  <div className="flex flex-wrap gap-2">
                    {getWordBank().map((word, index) => {
                      const selectedCount = wordBankSelection.filter(w => w === word).length;
                      const wordCount = getWordBank().filter(w => w === word).length;
                      const isFullySelected = selectedCount >= wordCount;
                      const isAuxiliary = isAuxiliaryWord(word);
                      const isING = word === "ING";
                      
                      return (
                        <Button
                          key={`${word}-${index}`}
                          variant="outline"
                          size="sm"
                          onClick={() => !isFullySelected && addWordToSelection(word)}
                          disabled={isFullySelected}
                          className={`${
                            isAuxiliary ? "text-yellow-500" : ""
                          } ${isFullySelected ? "opacity-30" : ""}`}
                        >
                          {isING ? word : isAuxiliary ? word.toLowerCase() : word}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={removeLastWord}
                    variant="outline"
                    className="flex-1"
                    disabled={wordBankSelection.length === 0}
                  >
                    Borrar
                  </Button>
                  <Button
                    onClick={verifyPhraseOrdering}
                    className="flex-1 gradient-animated"
                    disabled={wordBankSelection.length === 0}
                  >
                    Verificar Orden
                  </Button>
                </div>
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
