import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Volume2, Gauge, ChevronLeft, List, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Connector {
  english: string;
  spanish: string;
  englishPhrase?: string;
  spanishPhrase?: string;
}

const LearnConnector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const connector = location.state?.connector as Connector;
  const source = (location.state?.source as string) || "ing";
  const isCausaEfecto = source === "causa-efecto";
  const backRoute = isCausaEfecto
    ? "/auxiliaries/conectores-causa-efecto"
    : "/auxiliaries/conectores-ing";
  const storageKey = isCausaEfecto ? "completedCausaEfecto" : "completedConnectors";

  const isToConnector = isCausaEfecto && (location.state?.connector?.english?.toLowerCase?.() === "to");

  // Claves de progreso persistente para los ejercicios "To"
  const TO_PROGRESS_KEY = "toExerciseProgress_v1";
  const TO_EN_PROGRESS_KEY = "toEnExerciseProgress_v1";
  const TO_EN_ORDER_KEY = "toEnRandomOrder_v1";

  const loadProgressMap = (key: string): Record<number, { answers: string[]; verified: boolean }> => {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; }
  };
  const saveProgressEntry = (key: string, idx: number, answers: string[], verified: boolean) => {
    const map = loadProgressMap(key);
    map[idx] = { answers, verified };
    try { localStorage.setItem(key, JSON.stringify(map)); } catch {}
  };

  const [showIntro, setShowIntro] = useState(isToConnector);
  const [showToExercise, setShowToExercise] = useState(false);
  const [toExerciseIndex, setToExerciseIndex] = useState(0);
  const [toSelectedAnswers, setToSelectedAnswers] = useState<string[]>([]);
  const [toVerified, setToVerified] = useState(false);
  const [showToEnglishExercise, setShowToEnglishExercise] = useState(false);
  const [toEnExerciseIndex, setToEnExerciseIndex] = useState(0);
  const [toEnTypedAnswers, setToEnTypedAnswers] = useState<string[]>([]);
  const [toEnVerified, setToEnVerified] = useState(false);
  const [toEnRandomOrder, setToEnRandomOrder] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(2);
  const [isStepComplete, setIsStepComplete] = useState(false);
  // Sub-paso del Ejercicio 3 de 3 (Significado) — solo para "to" (5 sub-ejercicios)
  const [meaningSub, setMeaningSub] = useState(1);
  const [meaningChoice, setMeaningChoice] = useState("");
  const [meaningVerified, setMeaningVerified] = useState(false);

  // Ejercicios específicos para el conector "To"
  const TO_EXERCISES: { intro: string; sentence: string[]; answer: string[] }[] = [
    { intro: "Voy al gimnasio", sentence: ["Yo", "ir", "_", "gimnasio."], answer: ["al"] },
    { intro: "Trabajo para tener dinero", sentence: ["Yo", "trabajar", "_", "tener dinero."], answer: ["para"] },
    { intro: "Ellos quieren aprender", sentence: ["Ellos", "querer", "_", "aprender."], answer: ["a"] },
    { intro: "Ella va a la universidad", sentence: ["Ella", "ir", "_", "la universidad."], answer: ["a"] },
    { intro: "Corro para ser rápido", sentence: ["Yo", "correr", "_", "ser rápido."], answer: ["para"] },
    { intro: "Necesitas trabajar", sentence: ["Tú", "necesitar", "_", "trabajar."], answer: ["a"] },
    { intro: "Vamos al restaurante", sentence: ["Nosotros", "ir", "_", "restaurante."], answer: ["al"] },
    { intro: "Estudio para pasar el examen", sentence: ["Yo", "estudiar", "_", "pasar el examen."], answer: ["para"] },
    { intro: "Él va a la oficina", sentence: ["Él", "ir", "_", "la oficina."], answer: ["a"] },
    { intro: "Quiero ir a jugar", sentence: ["Yo", "querer", "_", "ir", "_", "jugar."], answer: ["a", "a"] },
    { intro: "Ellos practican para ganar", sentence: ["Ellos", "practicar", "_", "ganar."], answer: ["para"] },
    { intro: "Ella se alimenta bien para estar sana", sentence: ["Ella", "alimentarse bien", "_", "estar sana."], answer: ["para"] },
    { intro: "Intentas comer", sentence: ["Tú", "intentar", "_", "comer."], answer: ["a"] },
    { intro: "Él va al parque", sentence: ["Él", "ir", "_", "parque."], answer: ["al"] },
    { intro: "Ella empieza a estudiar", sentence: ["Ella", "empezar", "_", "estudiar."], answer: ["a"] },
  ];

  // Mismas frases en inglés — la respuesta es "to" o "to the" (cuando el español usa "al" = a+el)
  const TO_EN_EXERCISES: { intro: string; sentence: string[]; answers: string[] }[] = [
    { intro: "Voy al gimnasio.", sentence: ["I", "go", "_", "gym."], answers: ["to the"] },
    { intro: "Trabajo para tener dinero.", sentence: ["I", "work", "_", "have money."], answers: ["to"] },
    { intro: "Ellos quieren aprender.", sentence: ["They", "want", "_", "learn."], answers: ["to"] },
    { intro: "Ella va a la universidad.", sentence: ["She", "goes", "_", "university."], answers: ["to the"] },
    { intro: "Corro para ser rápido.", sentence: ["I", "run", "_", "be fast."], answers: ["to"] },
    { intro: "Necesitas trabajar.", sentence: ["You", "need", "_", "work."], answers: ["to"] },
    { intro: "Vamos al restaurante.", sentence: ["We", "go", "_", "restaurant."], answers: ["to the"] },
    { intro: "Estudio para pasar el examen.", sentence: ["I", "study", "_", "pass the exam."], answers: ["to"] },
    { intro: "Él va a la oficina.", sentence: ["He", "goes", "_", "office."], answers: ["to the"] },
    { intro: "Quiero ir a jugar.", sentence: ["I", "want", "_", "go", "_", "play."], answers: ["to", "to"] },
    { intro: "Ellos practican para ganar.", sentence: ["They", "practice", "_", "win."], answers: ["to"] },
    { intro: "Ella se alimenta bien para estar sana.", sentence: ["She", "eats well", "_", "be healthy."], answers: ["to"] },
    { intro: "Intentas comer.", sentence: ["You", "try", "_", "eat."], answers: ["to"] },
    { intro: "Él va al parque.", sentence: ["He", "goes", "_", "park."], answers: ["to the"] },
    { intro: "Ella empieza a estudiar.", sentence: ["She", "starts", "_", "study."], answers: ["to"] },
  ];

  // Paso 1: Escuchar frase en inglés (audio)
  const [listenCount, setListenCount] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Paso 2: Ordenar palabras en inglés
  const [userWords, setUserWords] = useState<string[]>([]);
  const [randomizedWords, setRandomizedWords] = useState<string[]>([]);
  const [ingToken, setIngToken] = useState<string | null>(null);

  // Paso 3: Elegir significado correcto en inglés
  const [selectedEnglishMeaning, setSelectedEnglishMeaning] = useState("");

  // Paso 4: Ordenar letras
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [randomizedLetters, setRandomizedLetters] = useState<string[]>([]);

  // Paso 5: Elegir significado correcto en español
  const [selectedSpanishMeaning, setSelectedSpanishMeaning] = useState("");

  // Frase de ejemplo en inglés y verbo después del conector (Conectores ING)
  const generateEnglishPhrase = () => {
    const word = connector?.english || "";

    // Para Causa-Efecto, usamos frases sin "ing"
    if (isCausaEfecto) {
      const ceMap: { [key: string]: string } = {
        "so": "So I went home",
        "because": "Because I am happy",
        "could": "I could run fast",
        "by": "The book was written by him",
        "for": "She wants for help",
        "to": "I want to buy",
        "may / might": "It might rain today",
        "can": "I can swim well",
        "must": "You must stop now",
        "should": "You should study more",
        "if": "If you come here",
      };
      return { phrase: ceMap[word] || `I ${word.toLowerCase()} go`, verbAfterConnector: "" };
    }

    const phrases: { [key: string]: { phrase: string; verbAfterConnector: string } } = {
      "About": { phrase: "I am thinking about going there", verbAfterConnector: "going" },
      "After": { phrase: "She called me after finishing work", verbAfterConnector: "finishing" },
      "Against": { phrase: "They are fighting against corruption", verbAfterConnector: "corruption" },
      "At": { phrase: "He is good at speaking English", verbAfterConnector: "speaking" },
      "Besides": { phrase: "Besides studying I enjoy playing sports", verbAfterConnector: "studying" },
      "Before": { phrase: "Check everything before leaving home", verbAfterConnector: "leaving" },
      "By": { phrase: "She learned English by watching movies", verbAfterConnector: "watching" },
      "Despite": { phrase: "Despite raining we went outside", verbAfterConnector: "raining" },
      "For": { phrase: "Thank you for helping me today", verbAfterConnector: "helping" },
      "From": { phrase: "I come from learning new things", verbAfterConnector: "learning" },
      "In": { phrase: "She is interested in learning languages", verbAfterConnector: "learning" },
      "Instead of": { phrase: "Instead of complaining try helping", verbAfterConnector: "complaining" },
      "Like": { phrase: "It feels like flying in sky", verbAfterConnector: "flying" },
      "Of": { phrase: "I am tired of waiting here", verbAfterConnector: "waiting" },
      "On": { phrase: "Keep on working hard everyday", verbAfterConnector: "working" },
      "Since": { phrase: "Since starting I have improved", verbAfterConnector: "starting" },
      "Through": { phrase: "I succeeded through practicing daily", verbAfterConnector: "practicing" },
      "Towards": { phrase: "We are working towards achieving goals", verbAfterConnector: "achieving" },
      "Upon": { phrase: "Upon arriving she started working", verbAfterConnector: "arriving" },
      "With": { phrase: "Start with understanding the basics", verbAfterConnector: "understanding" },
      "Without": { phrase: "Without trying you cannot succeed", verbAfterConnector: "trying" },
    };
    return phrases[word] || { phrase: `I am ${word.toLowerCase()} doing something`, verbAfterConnector: "doing" };
  };

  const [englishPhraseData] = useState(generateEnglishPhrase());
  const englishPhrase = englishPhraseData.phrase;
  const verbAfterConnector = englishPhraseData.verbAfterConnector;

  // Opciones para paso 3 (significado en inglés)
  const getEnglishOptions = () => {
    const distractors = isCausaEfecto
      ? ["because", "must", "should", "can", "if", "by"]
      : ["Before", "Against", "Through", "Besides"];
    const allOptions = [connector?.english || "", ...distractors];
    const uniqueOptions = Array.from(new Set(allOptions)).filter(opt => opt !== connector?.english);
    return [connector?.english || "", ...uniqueOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
  };

  // Opciones para paso 5 (significado en español)
  const getSpanishOptions = () => {
    const distractors = isCausaEfecto
      ? ["Porque", "Debes", "Debería", "Si (condicional)", "Poder", "Por (autor)"]
      : ["Antes de", "A través de", "En contra de", "Además de"];
    const allOptions = [connector?.spanish || "", ...distractors];
    const uniqueOptions = Array.from(new Set(allOptions)).filter(opt => opt !== connector?.spanish);
    return [connector?.spanish || "", ...uniqueOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
  };

  const [englishOptions] = useState(getEnglishOptions());
  const [spanishOptions] = useState(getSpanishOptions());

  // Ejemplo trilingüe (Español perfecto / Apache / Inglés perfecto) para Causa-Efecto
  const trilingualExample = (() => {
    if (!isCausaEfecto) return null;
    const word = connector?.english || "";
    const map: { [key: string]: { es: string; apache: string; en: string } } = {
      "to": { es: "Quiero comprar", apache: "Quiero a comprar", en: "Want to buy" },
      "so": { es: "Así que me fui", apache: "Entonces yo ir", en: "So I went" },
      "because": { es: "Porque estoy feliz", apache: "Porque yo estar feliz", en: "Because I am happy" },
      "could": { es: "Yo podía correr", apache: "Yo poder correr", en: "I could run" },
      "by": { es: "El libro fue escrito por él", apache: "El libro ser escrito → él", en: "The book was written by him" },
      "for": { es: "Ella quiere aprender", apache: "Ella querer a aprender", en: "She wants for learn" },
      "may / might": { es: "Puede que llueva", apache: "Eso poder llover", en: "It might rain" },
      "can": { es: "Yo puedo nadar", apache: "Yo poder nadar", en: "I can swim" },
      "must": { es: "Tú debes detenerte", apache: "Tú deber parar", en: "You must stop" },
      "should": { es: "Tú deberías estudiar", apache: "Tú deber estudiar", en: "You should study" },
      "if": { es: "Si tú vienes", apache: "Si tú venir", en: "If you come" },
    };
    return map[word] || null;
  })();

  useEffect(() => {
    if (!connector) {
      navigate(backRoute);
      return;
    }

    // Inicializar palabras para paso 2
    let words: string[];
    if (isCausaEfecto) {
      // Sin lógica de "ing"
      words = englishPhrase.split(" ");
    } else {
      // Eliminar "ing" del verbo después del conector
      words = englishPhrase.split(" ").map(word => {
        if (word.toLowerCase() === verbAfterConnector.toLowerCase()) {
          return word.slice(0, -3);
        }
        return word;
      });
    }
    const distractorWords = ["yesterday", "quickly"];
    const allWords = [...words, ...distractorWords];
    setRandomizedWords([...allWords].sort(() => Math.random() - 0.5));

    // Inicializar letras para paso 4 con dos letras distractoras
    const letters = connector.english.toUpperCase().split("");
    const distractorLetters = ["Z", "Q"];
    const allLetters = [...letters, ...distractorLetters];
    setRandomizedLetters([...allLetters].sort(() => Math.random() - 0.5));
  }, [connector, navigate, englishPhrase, verbAfterConnector, isCausaEfecto, backRoute]);

  // Guardar progreso del conector (paso actual) para mostrar "En curso" en la lista
  useEffect(() => {
    if (!connector) return;
    const progressKey = isCausaEfecto ? "causaEfectoProgress" : "ingProgress";
    try {
      const saved = localStorage.getItem(progressKey);
      const progressMap: Record<string, number> = saved ? JSON.parse(saved) : {};
      progressMap[connector.english] = currentStep;
      localStorage.setItem(progressKey, JSON.stringify(progressMap));
    } catch {}
  }, [currentStep, connector, isCausaEfecto]);

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = playbackRate;
    
    // Cargar voces si aún no están disponibles
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Buscar voz femenina en inglés (preferiblemente latina o española hablando inglés)
      const latinaVoice = voices.find(voice => 
        voice.lang.startsWith("en") && 
        (voice.name.toLowerCase().includes("female") || 
         voice.name.toLowerCase().includes("woman") ||
         voice.name.toLowerCase().includes("samantha") ||
         voice.name.toLowerCase().includes("victoria"))
      ) || voices.find(voice => voice.lang.startsWith("en"));
      
      if (latinaVoice) {
        utterance.voice = latinaVoice;
      }
    };

    // Esperar a que las voces se carguen
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    } else {
      loadVoices();
    }
    
    window.speechSynthesis.speak(utterance);
    
    if (currentStep === 1) {
      setListenCount(prev => prev + 1);
      if (listenCount + 1 >= 3) {
        setIsStepComplete(true);
      }
    }
  };

  const togglePlaybackSpeed = () => {
    setPlaybackRate(prev => prev === 1.0 ? 0.75 : 1.0);
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setIsStepComplete(false);
      
      if (currentStep === 1) {
        setUserWords([]);
        setIngToken(null);
      } else if (currentStep === 2) {
        setSelectedEnglishMeaning("");
      } else if (currentStep === 3) {
        setUserLetters([]);
      } else if (currentStep === 4) {
        setSelectedSpanishMeaning("");
      }
    } else {
      // Guardar conector completado
      const saved = localStorage.getItem(storageKey);
      const completed = saved ? JSON.parse(saved) : [];
      if (!completed.includes(connector.english)) {
        completed.push(connector.english);
        localStorage.setItem(storageKey, JSON.stringify(completed));
      }

      // Limpiar progreso "en curso" del conector
      try {
        const progressKey = isCausaEfecto ? "causaEfectoProgress" : "ingProgress";
        const savedProg = localStorage.getItem(progressKey);
        if (savedProg) {
          const progressMap: Record<string, number> = JSON.parse(savedProg);
          delete progressMap[connector.english];
          localStorage.setItem(progressKey, JSON.stringify(progressMap));
        }
      } catch {}
      
      toast({
        title: "¡Completado!",
        description: `Conector "${connector.english}" "${connector.spanish}" ha sido agregado a tu Vocabulario`,
        duration: 3000,
        className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md text-center text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-2xl p-6 rounded-xl",
      });
      setTimeout(() => {
        navigate(backRoute);
      }, 2000);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
      setIsStepComplete(false);
    }
  };

  // Sonido de éxito (mismo que en VocabularyDay1)
  const playSuccessSound = () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  };

  // Paso 2: Verificar orden de palabras
  const handleVerifyWords = () => {
    // En Conectores ING, validar fusión "ing"
    if (!isCausaEfecto) {
      const hasFusedIng = userWords.some(word => word.endsWith("ing"));
      if (!hasFusedIng) {
        toast({
          title: "Incompleto",
          description: "Debes fusionar 'ing' con el verbo correcto",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }
    }
    
    // Reconstruir la frase esperada
    const expectedPhrase = englishPhrase;
    const userPhrase = userWords.join(" ");
    
    if (userPhrase.toLowerCase() === expectedPhrase.toLowerCase()) {
      setIsStepComplete(true);
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Has ordenado las palabras correctamente",
        className: "bg-green-500/90 border-green-500 text-white",
        duration: 2000,
      });
      // Transición automática al siguiente paso
      setTimeout(() => {
        handleNextStep();
      }, 2500);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Paso 2: Manejar clic en palabra (incluyendo "ing")
  const handleWordClick = (word: string) => {
    if (!isStepComplete) {
      // Solo permitir si la palabra no ha sido usada aún
      const usedCount = userWords.filter(w => w === word || w === word + "ing").length;
      const totalCount = randomizedWords.filter(w => w === word).length;
      if (usedCount < totalCount) {
        setUserWords([...userWords, word]);
      }
    }
  };

  // Paso 2: Fusionar "ing" con la palabra anterior
  const handleFuseIng = () => {
    if (userWords.length > 0 && ingToken === null && !isStepComplete) {
      const lastIndex = userWords.length - 1;
      const lastWord = userWords[lastIndex];
      
      // Fusionar "ing" con la última palabra
      const newWords = [...userWords];
      newWords[lastIndex] = lastWord + "ing";
      setUserWords(newWords);
      setIngToken(lastIndex.toString());
    }
  };

  // Paso 2: Eliminar última palabra
  const handleRemoveWord = () => {
    if (userWords.length > 0) {
      const lastWord = userWords[userWords.length - 1];
      // Si la última palabra termina en "ing" y fue fusionada, remover solo "ing"
      if (lastWord.endsWith("ing") && ingToken !== null) {
        const newWords = [...userWords];
        newWords[newWords.length - 1] = lastWord.slice(0, -3);
        setUserWords(newWords);
        setIngToken(null);
      } else {
        setUserWords(userWords.slice(0, -1));
      }
    }
  };

  // Paso 3: Verificar significado en inglés
  const handleVerifyEnglishMeaning = () => {
    if (selectedEnglishMeaning === connector.english) {
      setIsStepComplete(true);
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Has seleccionado el significado correcto",
        className: "bg-green-500/90 border-green-500 text-white",
        duration: 2000,
      });
      // Transición automática al siguiente paso
      setTimeout(() => {
        handleNextStep();
      }, 2500);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Paso 4: Ordenar letras
  const handleLetterClick = (letter: string) => {
    if (!isStepComplete) {
      setUserLetters([...userLetters, letter]);
    }
  };

  const handleRemoveLetter = () => {
    if (userLetters.length > 0) {
      setUserLetters(userLetters.slice(0, -1));
    }
  };

  const handleVerifyLetters = () => {
    if (userLetters.length === connector.english.length) {
      const userWord = userLetters.join("");
      const correctWord = connector.english.toUpperCase();
      
      if (userWord === correctWord) {
        setIsStepComplete(true);
        playSuccessSound();
        toast({
          title: "¡Correcto!",
          description: "Has formado la palabra correctamente",
          className: "bg-green-500/90 border-green-500 text-white",
          duration: 2000,
        });
        // Transición automática al siguiente paso
        setTimeout(() => {
          if (isToConnector) {
            setMeaningSub(4);
            setMeaningChoice("");
            setMeaningVerified(false);
          }
          handleNextStep();
        }, 2500);
      } else {
        toast({
          title: "Incorrecto",
          description: "Intenta nuevamente",
          variant: "destructive",
          duration: 2000,
        });
      }
    } else {
      toast({
        title: "Incompleto",
        description: "Debes completar la palabra antes de verificar",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Paso 5: Verificar significado en español
  const handleVerifySpanishMeaning = () => {
    if (selectedSpanishMeaning === connector.spanish) {
      setIsStepComplete(true);
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Has seleccionado el significado correcto",
        className: "bg-green-500/90 border-green-500 text-white",
        duration: 2000,
      });
      // Transición automática al siguiente paso (finalización)
      setTimeout(() => {
        handleNextStep();
      }, 2500);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const progressPercent = (currentStep / 5) * 100;

  if (!connector) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3">
          {showToExercise || showToEnglishExercise || (isToConnector && currentStep === 3) || currentStep === 4 || currentStep === 5 ? (
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(backRoute)}
                className="hover:bg-primary/10"
                title="Volver"
              >
                <List className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Lista</span>
              </Button>

              <Badge variant="secondary" className="text-sm">
                {(currentStep === 3 || currentStep === 4 || currentStep === 5) && !showToExercise && !showToEnglishExercise
                  ? `Ejercicio 3 de 3`
                  : showToEnglishExercise
                  ? `2 de 3 - Ingles perfecto`
                  : `1 de 3 - Español Apache`}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10"
                title="Ejercicio anterior"
                onClick={() => {
                  if (isToConnector && (currentStep === 3 || currentStep === 4 || currentStep === 5)) {
                    // Navegación entre los 5 sub-ejercicios del Significado
                    setMeaningChoice("");
                    setMeaningVerified(false);
                    if (meaningSub === 5) {
                      setMeaningSub(4);
                    } else if (meaningSub === 4) {
                      setMeaningSub(3);
                      setCurrentStep(4);
                    } else if (meaningSub === 3) {
                      setMeaningSub(2);
                      setCurrentStep(3);
                    } else if (meaningSub === 2) {
                      setMeaningSub(1);
                    } else {
                      // meaningSub === 1 → volver al último ejercicio en inglés
                      const lastIdx = TO_EN_EXERCISES.length - 1;
                      const saved = loadProgressMap(TO_EN_PROGRESS_KEY)[lastIdx];
                      setCurrentStep(2);
                      setShowToEnglishExercise(true);
                      setToEnExerciseIndex(lastIdx);
                      setToEnTypedAnswers(saved?.answers || []);
                      setToEnVerified(!!saved?.verified);
                    }
                  } else if (currentStep === 5) {
                    setCurrentStep(4);
                  } else if (currentStep === 4) {
                    setCurrentStep(3);
                  } else if (showToEnglishExercise) {
                    if (toEnExerciseIndex > 0) {
                      const newIdx = toEnExerciseIndex - 1;
                      const saved = loadProgressMap(TO_EN_PROGRESS_KEY)[newIdx];
                      setToEnExerciseIndex(newIdx);
                      setToEnTypedAnswers(saved?.answers || []);
                      setToEnVerified(!!saved?.verified);
                    } else {
                      const lastIdx = TO_EXERCISES.length - 1;
                      const saved = loadProgressMap(TO_PROGRESS_KEY)[lastIdx];
                      setShowToEnglishExercise(false);
                      setShowToExercise(true);
                      setToExerciseIndex(lastIdx);
                      setToSelectedAnswers(saved?.answers || []);
                      setToVerified(!!saved?.verified);
                    }
                  } else {
                    if (toExerciseIndex > 0) {
                      const newIdx = toExerciseIndex - 1;
                      const saved = loadProgressMap(TO_PROGRESS_KEY)[newIdx];
                      setToExerciseIndex(newIdx);
                      setToSelectedAnswers(saved?.answers || []);
                      setToVerified(!!saved?.verified);
                    }
                  }
                }}
                disabled={currentStep !== 4 && currentStep !== 5 && !showToEnglishExercise && currentStep !== 3 && toExerciseIndex === 0}
              >
                <Undo2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Ejercicio anterior</span>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(backRoute)}
                  className="hover:bg-primary/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Atrás</span>
                </Button>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg md:text-xl font-bold text-foreground">
                      {isCausaEfecto ? connector.english : connector.spanish}
                    </h1>
                    {!showIntro && currentStep < 3 && (
                      <div className="text-right flex flex-col items-end">
                        <span className="text-sm font-normal text-muted-foreground">
                          {currentStep - 1} de 4
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handlePreviousStep}
                          disabled={currentStep === 2}
                          className="h-8 w-8 hover:bg-primary/10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!showIntro && (
                <div className="flex gap-1">
                  {[2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-2 rounded-full transition-colors ${
                        step <= currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Intro especial para "To" en Causa-Efecto */}
          {showIntro && (
            <motion.div
              key="intro-to"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 text-center">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
                    To = a/al/para
                  </h2>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold text-yellow-400">a</h3>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    En Inglés a partir del segundo verbo siempre se dice:
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    "Querer <span className="text-blue-400 font-bold">a</span> jugar, Ir <span className="text-blue-400 font-bold">a</span> comer, Necesitar <span className="text-blue-400 font-bold">a</span> trabajar, Gustar <span className="text-blue-400 font-bold">a</span> aprender" como si respondieran a "¿Qué vas hacer?" "<span className="text-blue-400 font-bold">a</span> jugar, <span className="text-blue-400 font-bold">a</span> comer, <span className="text-blue-400 font-bold">a</span> trabajar, <span className="text-blue-400 font-bold">a</span> aprender".
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Si quieres decir:
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Quiero intentar, empezar <span className="text-blue-400 font-bold">a</span> trabajar.
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Será
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Yo querer <span className="text-blue-400 font-bold">a</span> intentar <span className="text-blue-400 font-bold">a</span> empezar <span className="text-blue-400 font-bold">a</span> trabajar.
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    = I want <span className="text-blue-400 font-bold">to</span> try <span className="text-blue-400 font-bold">to</span> start <span className="text-blue-400 font-bold">to</span> work.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold text-yellow-400">al</h3>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Se agrega "<span className="text-blue-400 font-bold">al</span> o <span className="text-blue-400 font-bold">a</span>" para indicar el lugar, por ejemplo:
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Ellos ir <span className="text-blue-400 font-bold">al</span> parque = They go <span className="text-blue-400 font-bold">to the</span> park
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Yo ir <span className="text-blue-400 font-bold">al</span> gimnasio = I go <span className="text-blue-400 font-bold">to the</span> gym
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Ella va <span className="text-blue-400 font-bold">a la</span> universidad = She goes <span className="text-blue-400 font-bold">to the</span> university
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    El ir <span className="text-blue-400 font-bold">a la</span> ciudad = He goes <span className="text-blue-400 font-bold">to the</span> city
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold text-yellow-400">para</h3>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Se agrega para explicar el "para que" de la acción, por ejemplo:
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Yo alimentarme bien <span className="text-blue-400 font-bold">para</span> estar sano.
                    <br />
                    = I eat well <span className="text-blue-400 font-bold">to</span> stay healthy.
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Yo estudiar <span className="text-blue-400 font-bold">para</span> pasar el examen.
                    <br />
                    = I study <span className="text-blue-400 font-bold">to</span> pass the exam.
                  </p>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  const saved = loadProgressMap(TO_PROGRESS_KEY)[0];
                  setShowIntro(false);
                  setShowToExercise(true);
                  setToExerciseIndex(0);
                  setToSelectedAnswers(saved?.answers || []);
                  setToVerified(!!saved?.verified);
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg"
              >
                Siguiente
              </Button>
            </motion.div>
          )}

          {/* Ejercicio especial para "To" en Causa-Efecto */}
          {showToExercise && (
            <motion.div
              key="to-exercise"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="mb-2">
                <Progress value={((toExerciseIndex + 1) / TO_EXERCISES.length) * 100} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground text-center">{toExerciseIndex + 1} de {TO_EXERCISES.length}</p>
              </div>

              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-lg font-bold text-foreground">
                    Complementa la frase con el auxiliar correcto:
                  </h2>

                  <div className="text-center space-y-4">
                    <p className="text-base text-yellow-400">
                      {toExerciseIndex + 1}. {TO_EXERCISES[toExerciseIndex].intro}
                    </p>
                    <p className="text-2xl font-bold text-foreground flex flex-wrap justify-center items-center gap-2">
                      {(() => {
                        let blankIdx = -1;
                        const correct = TO_EXERCISES[toExerciseIndex].answer;
                        return TO_EXERCISES[toExerciseIndex].sentence.map((part, i) => {
                          if (part === "_") {
                            blankIdx++;
                            const filled = toSelectedAnswers[blankIdx];
                            const idx = blankIdx;
                            const isCorrect = toVerified && filled === correct[idx];
                            const isWrong = toVerified && filled && filled !== correct[idx];
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  if (filled) {
                                    const next = [...toSelectedAnswers];
                                    next.splice(idx, 1);
                                    setToSelectedAnswers(next);
                                    setToVerified(false);
                                  }
                                }}
                                className={`inline-block min-w-[80px] px-3 py-1 rounded border-b-2 font-bold ${
                                  isCorrect
                                    ? "text-green-400 border-green-400"
                                    : isWrong
                                    ? "text-red-400 border-red-400"
                                    : filled
                                    ? "text-yellow-400 border-yellow-400"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {filled || "____"}
                              </button>
                            );
                          }
                          return <span key={i}>{part}</span>;
                        });
                      })()}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {["a", "al", "para"].map((opt) => {
                      const totalBlanks = TO_EXERCISES[toExerciseIndex].sentence.filter(p => p === "_").length;
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            if (toSelectedAnswers.length < totalBlanks) {
                              setToSelectedAnswers([...toSelectedAnswers, opt]);
                            } else {
                              // Reemplazar el último blank seleccionado
                              const next = [...toSelectedAnswers];
                              next[next.length - 1] = opt;
                              setToSelectedAnswers(next);
                            }
                            setToVerified(false);
                          }}
                          className={`px-4 py-3 rounded-lg font-bold text-lg transition-all border bg-primary hover:bg-primary/80 text-primary-foreground border-primary`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => {
                      const correct = TO_EXERCISES[toExerciseIndex].answer;
                      const isCorrect =
                        toSelectedAnswers.length === correct.length &&
                        correct.every((c, i) => toSelectedAnswers[i] === c);
                      setToVerified(true);
                      if (isCorrect) {
                        saveProgressEntry(TO_PROGRESS_KEY, toExerciseIndex, toSelectedAnswers, true);
                        playSuccessSound();
                        toast({
                          title: "¡Correcto!",
                          description: "Excelente, sigue así",
                          className: "bg-green-500/90 border-green-500 text-white",
                          duration: 1500,
                        });
                        setTimeout(() => {
                          if (toExerciseIndex < TO_EXERCISES.length - 1) {
                            const newIdx = toExerciseIndex + 1;
                            const saved = loadProgressMap(TO_PROGRESS_KEY)[newIdx];
                            setToExerciseIndex(newIdx);
                            setToSelectedAnswers(saved?.answers || []);
                            setToVerified(!!saved?.verified);
                          } else {
                            // Pasar a los ejercicios en inglés con orden aleatorio (persistente)
                            let order: number[] = [];
                            try { order = JSON.parse(localStorage.getItem(TO_EN_ORDER_KEY) || "[]"); } catch {}
                            if (!Array.isArray(order) || order.length !== TO_EN_EXERCISES.length) {
                              order = [...Array(TO_EN_EXERCISES.length).keys()].sort(() => Math.random() - 0.5);
                              try { localStorage.setItem(TO_EN_ORDER_KEY, JSON.stringify(order)); } catch {}
                            }
                            setToEnRandomOrder(order);
                            const saved = loadProgressMap(TO_EN_PROGRESS_KEY)[0];
                            setToEnExerciseIndex(0);
                            setToEnTypedAnswers(saved?.answers || []);
                            setToEnVerified(!!saved?.verified);
                            setShowToExercise(false);
                            setShowToEnglishExercise(true);
                          }
                        }, 1500);
                      } else {
                        toast({
                          title: "Incorrecto",
                          description: "Intenta nuevamente",
                          variant: "destructive",
                          duration: 2000,
                        });
                      }
                    }}
                    disabled={toSelectedAnswers.length !== TO_EXERCISES[toExerciseIndex].sentence.filter(p => p === "_").length}
                    className={`w-full font-semibold py-5 text-white ${
                      toSelectedAnswers.length === TO_EXERCISES[toExerciseIndex].sentence.filter(p => p === "_").length
                        ? "bg-pink-500 hover:bg-pink-600"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    Verificar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Ejercicio en INGLÉS para "To" — escribe la respuesta */}
          {showToEnglishExercise && (() => {
            const realIdx = toEnRandomOrder[toEnExerciseIndex] ?? toEnExerciseIndex;
            const ex = TO_EN_EXERCISES[realIdx];
            const totalBlanks = ex.sentence.filter(p => p === "_").length;
            const allFilled = toEnTypedAnswers.filter(a => (a || "").trim().length > 0).length === totalBlanks;
            return (
              <motion.div
                key="to-en-exercise"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="mb-2">
                  <Progress value={((toEnExerciseIndex + 1) / TO_EN_EXERCISES.length) * 100} className="h-3 mb-2" />
                  <p className="text-sm text-muted-foreground text-center">{toEnExerciseIndex + 1} de {TO_EN_EXERCISES.length}</p>
                </div>

                <Card className="bg-card border-border shadow-md">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-lg font-bold text-foreground">
                      Completa la frase escribiendo la palabra correcta:
                    </h2>

                    <div className="text-center space-y-4">
                      <p className="text-base text-yellow-400">
                        {toEnExerciseIndex + 1}. {ex.intro}
                      </p>
                      <p className="text-2xl font-bold text-foreground flex flex-wrap justify-center items-center gap-2">
                        {(() => {
                          let blankIdx = -1;
                          return ex.sentence.map((part, i) => {
                            if (part === "_") {
                              blankIdx++;
                              const idx = blankIdx;
                              const expected = (ex.answers[idx] || "to").toLowerCase();
                              const value = toEnTypedAnswers[idx] || "";
                              const isCorrect = toEnVerified && value.trim().toLowerCase() === expected;
                              const isWrong = toEnVerified && value.trim().toLowerCase() !== expected;
                              return (
                                <input
                                  key={i}
                                  type="text"
                                  value={value}
                                  onChange={(e) => {
                                    const next = [...toEnTypedAnswers];
                                    next[idx] = e.target.value;
                                    setToEnTypedAnswers(next);
                                    setToEnVerified(false);
                                  }}
                                  className={`inline-block w-32 text-center px-2 py-1 rounded border-b-2 bg-transparent font-bold focus:outline-none ${
                                    isCorrect
                                      ? "text-green-400 border-green-400"
                                      : isWrong
                                      ? "text-red-400 border-red-400"
                                      : value
                                      ? "text-yellow-400 border-yellow-400"
                                      : "text-foreground border-muted-foreground"
                                  }`}
                                  placeholder="____"
                                  autoCapitalize="none"
                                  autoCorrect="off"
                                />
                              );
                            }
                            return <span key={i}>{part}</span>;
                          });
                        })()}
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        const isCorrect =
                          toEnTypedAnswers.length === totalBlanks &&
                          ex.answers.every((a, i) => (toEnTypedAnswers[i] || "").trim().toLowerCase() === a.toLowerCase());
                        setToEnVerified(true);
                        if (isCorrect) {
                          saveProgressEntry(TO_EN_PROGRESS_KEY, toEnExerciseIndex, toEnTypedAnswers, true);
                          playSuccessSound();
                          toast({
                            title: "¡Correcto!",
                            description: "Excelente, sigue así",
                            className: "bg-green-500/90 border-green-500 text-white",
                            duration: 1500,
                          });
                          setTimeout(() => {
                            if (toEnExerciseIndex < TO_EN_EXERCISES.length - 1) {
                              const newIdx = toEnExerciseIndex + 1;
                              const saved = loadProgressMap(TO_EN_PROGRESS_KEY)[newIdx];
                              setToEnExerciseIndex(newIdx);
                              setToEnTypedAnswers(saved?.answers || []);
                              setToEnVerified(!!saved?.verified);
                            } else {
                              // Terminó la fase en inglés → avanzar al siguiente ejercicio del flujo (Paso 3)
                              setShowToEnglishExercise(false);
                              setShowToExercise(false);
                              setShowIntro(false);
                              setIsStepComplete(false);
                              setSelectedEnglishMeaning("");
                              setCurrentStep(3);
                            }
                          }, 1500);
                        } else {
                          toast({
                            title: "Incorrecto",
                            description: "Intenta nuevamente",
                            variant: "destructive",
                            duration: 2000,
                          });
                        }
                      }}
                      disabled={!allFilled}
                      className={`w-full font-semibold py-5 text-white ${
                        allFilled ? "bg-pink-500 hover:bg-pink-600" : "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      Verificar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })()}

          {/* Paso 1 (Escuchar frase) eliminado — el flujo comienza en el Paso 2 */}

          {/* Paso 2: Ordenar palabras en inglés */}
          {currentStep === 2 && !showIntro && !showToExercise && !showToEnglishExercise && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      Forma la frase que escuchaste
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isCausaEfecto ? "Ordena las palabras correctamente" : "Conector, verbo+ing"}
                    </p>
                  </div>

                  {/* Área de construcción - ARRIBA con borde punteado */}
                  <div className="bg-[#1e3a54] rounded-xl p-4 min-h-[120px] border-2 border-dashed border-[#2e4a64]">
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                      {userWords.length === 0 ? (
                        <p className="text-white/50 text-sm">Haz clic en las palabras para formar la frase</p>
                      ) : (
                        userWords.map((word, index) => {
                          // Separar la palabra base y el "ing" fusionado para colorearlo
                          const hasIng = word.endsWith("ing") && ingToken === index.toString();
                          const baseWord = hasIng ? word.slice(0, -3) : word;
                          const ingPart = hasIng ? "ing" : "";
                          
                          return (
                            <div key={index} className="px-4 py-2.5 bg-[#2d4a6d] hover:bg-[#3d5a7d] text-white rounded-lg font-bold text-sm shadow-sm transition-all">
                              {baseWord}
                              {ingPart && <span className="text-yellow-400">{ingPart}</span>}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Banco de palabras - ABAJO con fondo más claro */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {randomizedWords.map((word, index) => {
                        const usedCount = userWords.filter(w => w === word || w === word + "ing").length;
                        const totalCount = randomizedWords.filter(w => w === word).length;
                        const isUsed = usedCount >= totalCount;
                        return (
                          <button
                            key={index}
                            onClick={() => handleWordClick(word)}
                            disabled={isStepComplete || isUsed}
                            className="px-4 py-2.5 bg-[#36537a] hover:bg-[#46638a] text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
                          >
                            {word}
                          </button>
                        );
                      })}
                      {/* Botón "ing" para fusionar (solo Conectores ING) */}
                      {!isCausaEfecto && (
                        <button
                          onClick={handleFuseIng}
                          disabled={ingToken !== null || userWords.length === 0 || isStepComplete}
                          className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-bold text-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
                        >
                          ing
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleRemoveWord}
                      variant="outline"
                      className="flex-1 border-border hover:bg-secondary/80 font-semibold"
                      disabled={userWords.length === 0}
                    >
                      Borrar
                    </Button>
                    <Button
                      onClick={handleVerifyWords}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold"
                    >
                      Verificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 3: Elegir significado en inglés */}
          {currentStep === 3 && !isToConnector && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      Elige el significado correcto
                    </h2>
                    <p className="text-sm text-muted-foreground">Selecciona la opción correcta</p>
                  </div>
                  <p className="text-center text-2xl font-bold text-yellow-400">
                    {connector.spanish}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {englishOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedEnglishMeaning(option)}
                        disabled={isStepComplete}
                        className={`px-4 py-3 rounded-lg font-bold text-lg transition-all border ${
                          selectedEnglishMeaning === option
                            ? "bg-primary/70 text-primary-foreground border-primary"
                            : "bg-primary hover:bg-primary/80 text-primary-foreground border-primary"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleVerifyEnglishMeaning}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-5"
                      disabled={!selectedEnglishMeaning}
                    >
                      Verificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Ejercicio 3 de 3 — Significado (camino "to"): 5 sub-ejercicios */}
          {isToConnector && (currentStep === 3 || currentStep === 5) && (() => {
            const subConfig: Record<number, { question: string; prompt: string; options: string[]; answer: string }> = {
              1: { question: "¿Cómo se dice en inglés?", prompt: "A / PARA", options: ["to", "for", "by", "in"], answer: "to" },
              2: { question: "¿Cómo se dice en inglés?", prompt: "AL", options: ["to the", "at the", "in the", "for the"], answer: "to the" },
              4: { question: "¿Qué significa en español?", prompt: "to", options: ["A / PARA", "AL", "DE", "CON"], answer: "A / PARA" },
              5: { question: "¿Qué significa en español?", prompt: "to the", options: ["AL", "A / PARA", "SOBRE", "CON"], answer: "AL" },
            };
            const cfg = subConfig[meaningSub];
            if (!cfg) return null;
            return (
              <motion.div
                key={`meaning-sub-${meaningSub}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-2">
                  <Progress value={(meaningSub / 5) * 100} className="h-3 mb-2" />
                  <p className="text-sm text-muted-foreground text-center">{meaningSub} de 5</p>
                </div>
                <Card className="bg-card border-border shadow-md">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white">{cfg.question}</h2>
                    <p className="text-center text-2xl font-bold text-yellow-400">{cfg.prompt}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {cfg.options.map((opt) => {
                        const selected = meaningChoice === opt;
                        const isCorrect = meaningVerified && selected && opt === cfg.answer;
                        const isWrong = meaningVerified && selected && opt !== cfg.answer;
                        return (
                          <button
                            key={opt}
                            onClick={() => { setMeaningChoice(opt); setMeaningVerified(false); }}
                            className={`px-4 py-3 rounded-lg font-bold text-lg transition-all border ${
                              isCorrect
                                ? "bg-green-500 text-white border-green-500"
                                : isWrong
                                ? "bg-red-500 text-white border-red-500"
                                : selected
                                ? "bg-primary/70 text-primary-foreground border-primary"
                                : "bg-primary hover:bg-primary/80 text-primary-foreground border-primary"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      onClick={() => {
                        setMeaningVerified(true);
                        if (meaningChoice === cfg.answer) {
                          playSuccessSound();
                          toast({
                            title: "¡Correcto!",
                            description: "Excelente, sigue así",
                            className: "bg-green-500/90 border-green-500 text-white",
                            duration: 1500,
                          });
                          setTimeout(() => {
                            setMeaningChoice("");
                            setMeaningVerified(false);
                            if (meaningSub === 1) {
                              setMeaningSub(2);
                            } else if (meaningSub === 2) {
                              setMeaningSub(3);
                              setCurrentStep(4);
                            } else if (meaningSub === 4) {
                              setMeaningSub(5);
                            } else if (meaningSub === 5) {
                              handleNextStep();
                            }
                          }, 1500);
                        } else {
                          toast({
                            title: "Incorrecto",
                            description: "Intenta nuevamente",
                            variant: "destructive",
                            duration: 2000,
                          });
                        }
                      }}
                      disabled={!meaningChoice}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-5"
                    >
                      Verificar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })()}

          {/* Paso 4: Ordenar letras */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="mb-2">
                <Progress value={isToConnector ? (3 / 5) * 100 : 100} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground text-center">{isToConnector ? "3 de 5" : "1 de 1"}</p>
              </div>
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      Deletrea la palabra
                    </h2>
                    <p className="text-sm text-muted-foreground">{connector.spanish}</p>
                  </div>

                  {/* Área de construcción */}
                  <div className="bg-muted/30 rounded-lg p-4 min-h-[80px] border-2 border-dashed border-border">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {userLetters.map((letter, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 bg-primary text-primary-foreground rounded-md font-bold text-lg"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Banco de letras */}
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {randomizedLetters.map((letter, index) => {
                        const usedCount = userLetters.filter(l => l === letter).length;
                        const totalCount = randomizedLetters.filter(l => l === letter).length;
                        const isUsed = usedCount >= totalCount;
                        return (
                          <button
                            key={index}
                            onClick={() => handleLetterClick(letter)}
                            disabled={isStepComplete || isUsed}
                            className="px-4 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-md font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-border"
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleRemoveLetter}
                      variant="outline"
                      className="flex-1 border-border hover:bg-secondary/80"
                      disabled={userLetters.length === 0}
                    >
                      Borrar
                    </Button>
                    <Button
                      onClick={handleVerifyLetters}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    >
                      Verificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 5: Elegir significado en español */}
          {currentStep === 5 && !isToConnector && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="mb-2">
                <Progress value={100} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground text-center">1 de 1</p>
              </div>
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      ¿Qué significa en español?
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {spanishOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSpanishMeaning(option)}
                        disabled={isStepComplete}
                        className={`px-4 py-3 rounded-lg font-medium transition-all border ${
                          selectedSpanishMeaning === option
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary hover:bg-secondary/80 text-foreground border-border"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleVerifySpanishMeaning}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      disabled={!selectedSpanishMeaning}
                    >
                      Verificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LearnConnector;
