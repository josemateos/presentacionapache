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
        description: `Conector ${connector.english} "${connector.spanish}" ha sido agregado a tu Vocabulario`,
        duration: 3000,
        className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-xl font-bold bg-green-500/90 text-white border-green-500",
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

  // Reproducir sonido de éxito
  const playSuccessSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVK/m7q1aGAc+lt7xwHAiBS2Ay/DajEEIGmm99+GVTgsRYrbn7KZTEwtJpd/yuWwfBTOK0/PYgTAHH3DO8OSaTgwOVbHm7bhfHAU8mdvvxG0hBSx/yO/akTsJF2S68+OUSwsSYbjn7qpUEQxHpOHxumseBS6Gzu7Ygzf7ImfD8eaaSg0NVrHl67dcGgY7mNvwxW8gBS1+x+/bkToJFmK48OGSTQwQYLnm7bBUFA1HouDyu2odBi6DzO/bjTf9I2nE8O2aSwwNVa/l7rdZHgU6l9nww3AdBSt8xu/cjzsJF2G28+aSTg0PX7nn77FTEw1IpN/xuWodBi2CzO7akzj+IWXB8OybSQ4NVq/m77VZHgU5l9rvxHAeBSp7x+7dkDoJFmC28uqRTw4OXrnn8LFSEw1IpN/wtmkdBSyBzO7ZkTj/I2bC8OybSQ4OVa/l77RaGQU5l9nvw3AfBSt7xe3dkToJFl+28OuSTg0OXrjn8LJSEw1IpODwuGkdBi2CzO7akzj/I2XB8OyaSg0OVa7l7rRYGgU4ltnww3EfBSp6xO3dkToJFV6179mRTQ4OXbfm8LFSFAxHo+DwuWkdBi2Cy+7akzj+I2TA8OyaSg0OVa7l7rNYGgU4ltnww3EfBSp6xO3dkToJFl628OuQTw4OXbfm77JTEw1HouDwuGodBiyByu7YkTf/ImXA8eybSQ0OVa3k7rJWGgQ4lNrvw3EdBSp5xO3djzsJFl608eqQTg4OW7bnbrNSEQ1HoeHvt2geByyAyO7YkDb/IW') ;
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // Paso 2: Verificar orden de palabras
  const handleVerifyWords = () => {
    const userPhrase = userWords.join(" ");
    // Reconstruir la frase esperada con "ing" añadido
    const expectedWords = englishPhrase.split(" ").map(word => {
      if (word.toLowerCase() === verbAfterConnector.toLowerCase()) {
        return word.slice(0, -3); // Sin "ing"
      }
      return word;
    });
    const userPhraseWithoutIng = userWords.filter(w => w !== "ing").join(" ");
    const expectedPhraseWithoutIng = expectedWords.join(" ");
    
    // Verificar que la frase esté ordenada correctamente Y que "ing" esté en el lugar correcto
    const verbIndex = userWords.findIndex(w => {
      const baseWord = w.replace(/ing$/, '');
      return baseWord.toLowerCase() === verbAfterConnector.toLowerCase().replace(/ing$/, '');
    });
    
    if (verbIndex !== -1 && ingToken !== null) {
      // Verificar si "ing" está después del verbo correcto
      const hasIngAfterVerb = userWords[verbIndex + 1] === "ing";
      const correctPhrase = userPhraseWithoutIng === expectedPhraseWithoutIng && hasIngAfterVerb;
      
      if (correctPhrase) {
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
          duration: 1000,
        });
      }
    } else {
      toast({
        title: "Incompleto",
        description: "Debes agregar 'ing' al verbo correcto",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  // Paso 2: Manejar clic en palabra
  const handleWordClick = (word: string) => {
    if (!isStepComplete) {
      setUserWords([...userWords, word]);
    }
  };

  // Paso 2: Eliminar última palabra
  const handleRemoveWord = () => {
    if (userWords.length > 0) {
      const lastWord = userWords[userWords.length - 1];
      if (lastWord === "ing") {
        setIngToken(null);
      }
      setUserWords(userWords.slice(0, -1));
    }
  };

  // Paso 2: Agregar "ing" a una palabra
  const handleAddIng = (index: number) => {
    if (ingToken === null && !isStepComplete) {
      const newWords = [...userWords];
      newWords.splice(index + 1, 0, "ing");
      setUserWords(newWords);
      setIngToken(index.toString());
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
        duration: 1000,
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
          duration: 1000,
        });
      }
    } else {
      toast({
        title: "Incompleto",
        description: "Debes completar la palabra antes de verificar",
        variant: "destructive",
        duration: 1000,
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
        duration: 1000,
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
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    Ordena las palabras correctamente
                  </h2>
                  <p className="text-center text-lg font-medium text-muted-foreground">
                    {connector.spanish}
                  </p>

                  {/* Área de construcción */}
                  <div className="bg-muted/30 rounded-lg p-4 min-h-[100px] border-2 border-dashed border-border">
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                      {userWords.map((word, index) => {
                        if (word === "ing") {
                          return (
                            <div
                              key={index}
                              className="px-3 py-2 bg-yellow-500 text-black rounded-md font-bold text-base"
                            >
                              {word}
                            </div>
                          );
                        }
                        return (
                          <div key={index} className="flex items-center gap-1">
                            <div className="px-4 py-3 bg-primary text-primary-foreground rounded-md font-bold text-base">
                              {word}
                            </div>
                            {!isStepComplete && ingToken === null && (
                              <button
                                onClick={() => handleAddIng(index)}
                                className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-xs font-bold"
                              >
                                +ing
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Banco de palabras */}
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {randomizedWords.map((word, index) => {
                        const usedCount = userWords.filter(w => w === word).length;
                        const totalCount = randomizedWords.filter(w => w === word).length;
                        const isUsed = usedCount >= totalCount;
                        return (
                          <button
                            key={index}
                            onClick={() => handleWordClick(word)}
                            disabled={isStepComplete || isUsed}
                            className="px-4 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-md font-medium text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-border"
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleRemoveWord}
                      variant="outline"
                      className="flex-1 border-border hover:bg-secondary/80"
                      disabled={userWords.length === 0}
                    >
                      Borrar
                    </Button>
                    <Button
                      onClick={handleVerifyWords}
                      className="flex-1 gradient-animated"
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
                      className="w-full gradient-animated"
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
                      className="flex-1 gradient-animated"
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
                      className="w-full gradient-animated"
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
