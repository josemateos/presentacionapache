import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Volume2, Gauge, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

  const [currentStep, setCurrentStep] = useState(1);
  const [isStepComplete, setIsStepComplete] = useState(false);

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

  // Generar frase de ejemplo en inglés y obtener el verbo después del conector
  const generateEnglishPhrase = () => {
    const word = connector?.english || "";
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
    const distractors = ["Before", "Against", "Through", "Besides"];
    const allOptions = [connector?.english || "", ...distractors];
    const uniqueOptions = Array.from(new Set(allOptions)).filter(opt => opt !== connector?.english);
    return [connector?.english || "", ...uniqueOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
  };

  // Opciones para paso 5 (significado en español)
  const getSpanishOptions = () => {
    const distractors = ["Antes de", "A través de", "En contra de", "Además de"];
    const allOptions = [connector?.spanish || "", ...distractors];
    const uniqueOptions = Array.from(new Set(allOptions)).filter(opt => opt !== connector?.spanish);
    return [connector?.spanish || "", ...uniqueOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
  };

  const [englishOptions] = useState(getEnglishOptions());
  const [spanishOptions] = useState(getSpanishOptions());

  useEffect(() => {
    if (!connector) {
      navigate("/auxiliaries/conectores-ing");
      return;
    }

    // Inicializar palabras para paso 2 - eliminar "ing" del verbo después del conector
    const words = englishPhrase.split(" ").map(word => {
      if (word.toLowerCase() === verbAfterConnector.toLowerCase()) {
        return word.slice(0, -3); // Eliminar "ing"
      }
      return word;
    });
    const distractorWords = ["yesterday", "quickly"];
    const allWords = [...words, ...distractorWords];
    setRandomizedWords([...allWords].sort(() => Math.random() - 0.5));

    // Inicializar letras para paso 4 con dos letras distractoras
    const letters = connector.english.toUpperCase().split("");
    const distractorLetters = ["Z", "Q"];
    const allLetters = [...letters, ...distractorLetters];
    setRandomizedLetters([...allLetters].sort(() => Math.random() - 0.5));
  }, [connector, navigate, englishPhrase, verbAfterConnector]);

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
      const saved = localStorage.getItem('completedConnectors');
      const completed = saved ? JSON.parse(saved) : [];
      if (!completed.includes(connector.english)) {
        completed.push(connector.english);
        localStorage.setItem('completedConnectors', JSON.stringify(completed));
      }
      
      toast({
        title: "¡Completado!",
        description: `Conector "${connector.english}" "${connector.spanish}" ha sido agregado a tu Vocabulario`,
        duration: 3000,
        className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md text-center text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-2xl p-6 rounded-xl",
      });
      setTimeout(() => {
        navigate("/auxiliaries/conectores-ing");
      }, 2000);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
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
    // Verificar que todas las palabras estén colocadas y que "ing" esté fusionado con alguna palabra
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
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auxiliaries/conectores-ing")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Atrás</span>
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-lg md:text-xl font-bold text-foreground">
                  {connector.spanish}
                </h1>
                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-normal text-muted-foreground">
                    {currentStep} de 5
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="h-8 w-8 hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Paso 1: Escuchar frase en audio */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    Escucha la frase
                  </h2>
                  <p className="text-center text-base text-muted-foreground">
                    Escucha al menos 3 veces
                  </p>
                  <p className="text-center text-2xl font-bold text-foreground">
                    {englishPhrase.split(' ').map((word, idx) => {
                      const lowerWord = word.toLowerCase();
                      const lowerConnector = connector.english.toLowerCase();
                      const isConnector = lowerWord === lowerConnector || 
                                         (connector.english.includes(' ') && englishPhrase.toLowerCase().includes(connector.english.toLowerCase()));
                      
                      if (lowerWord === verbAfterConnector.toLowerCase()) {
                        const base = word.slice(0, -3);
                        return (
                          <span key={idx}>
                            <span className={isConnector ? "underline decoration-yellow-500 decoration-2" : ""}>{base}</span>
                            <span className="text-yellow-500">ing</span>{' '}
                          </span>
                        );
                      }
                      
                      if (isConnector) {
                        return <span key={idx} className="underline decoration-yellow-500 decoration-2">{word} </span>;
                      }
                      
                      return <span key={idx}>{word} </span>;
                    })}
                  </p>

                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => playAudio(englishPhrase)}
                      className="gap-2 gradient-animated"
                      size="lg"
                    >
                      <Volume2 className="h-5 w-5" />
                      Escuchar
                    </Button>
                    <Button
                      onClick={togglePlaybackSpeed}
                      variant="outline"
                      className="gap-2 border-border hover:bg-secondary/80"
                    >
                      <Gauge className="h-5 w-5" />
                      {playbackRate === 1.0 ? "Normal" : "Lento"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Reproducido: {listenCount} {listenCount === 1 ? "vez" : "veces"}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 2: Ordenar palabras en inglés */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-white mb-1">
                        Forma la frase que escuchaste
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Conector, verbo+ing
                      </p>
                    </div>
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
                      {/* Botón "ing" para fusionar */}
                      <button
                        onClick={handleFuseIng}
                        disabled={ingToken !== null || userWords.length === 0 || isStepComplete}
                        className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-bold text-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
                      >
                        ing
                      </button>
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
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    Elige el significado correcto
                  </h2>
                  <p className="text-center text-2xl font-bold text-foreground">
                    {connector.spanish}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {englishOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedEnglishMeaning(option)}
                        disabled={isStepComplete}
                        className={`px-4 py-3 rounded-lg font-medium transition-all border ${
                          selectedEnglishMeaning === option
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
                      onClick={handleVerifyEnglishMeaning}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      disabled={!selectedEnglishMeaning}
                    >
                      Verificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 4: Ordenar letras */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    Deletrea la palabra
                  </h2>
                  <p className="text-center text-lg font-medium text-muted-foreground">
                    {connector.spanish}
                  </p>

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
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-card border-border shadow-md">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    ¿Qué significa en español?
                  </h2>
                  <p className="text-center text-2xl font-bold text-foreground">
                    {connector.english}
                  </p>

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

        {/* Botón siguiente */}
        <Button
          onClick={handleNextStep}
          disabled={!isStepComplete}
          className="w-full gradient-animated mt-6"
          size="lg"
        >
          {currentStep === 5 ? "Finalizar" : "Siguiente"}
        </Button>
      </main>
    </div>
  );
};

export default LearnConnector;
