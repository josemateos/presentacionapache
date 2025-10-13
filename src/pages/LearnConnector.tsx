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

  // Paso 3: Elegir significado correcto en inglés
  const [selectedEnglishMeaning, setSelectedEnglishMeaning] = useState("");

  // Paso 4: Ordenar letras
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [randomizedLetters, setRandomizedLetters] = useState<string[]>([]);

  // Paso 5: Elegir significado correcto en español
  const [selectedSpanishMeaning, setSelectedSpanishMeaning] = useState("");

  // Generar frase de ejemplo en inglés
  const generateEnglishPhrase = () => {
    const word = connector?.english || "";
    const phrases: { [key: string]: string } = {
      "About": "I am thinking about going there",
      "After": "She called me after finishing work",
      "Against": "They are fighting against corruption",
      "At": "He is good at speaking English",
      "Besides": "Besides studying I enjoy playing sports",
      "Before": "Check everything before leaving home",
      "By": "She learned English by watching movies",
      "Despite": "Despite raining we went outside",
      "For": "Thank you for helping me today",
      "From": "I come from learning new things",
      "In": "She is interested in learning languages",
      "Instead of": "Instead of complaining try helping",
      "Like": "It feels like flying in sky",
      "Of": "I am tired of waiting here",
      "On": "Keep on working hard everyday",
      "Since": "Since starting I have improved",
      "Through": "I succeeded through practicing daily",
      "Towards": "We are working towards achieving goals",
      "Upon": "Upon arriving she started working",
      "With": "Start with understanding the basics",
      "Without": "Without trying you cannot succeed",
    };
    return phrases[word] || `I am ${word.toLowerCase()} doing something`;
  };

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

  const [englishPhrase] = useState(generateEnglishPhrase());
  const [englishOptions] = useState(getEnglishOptions());
  const [spanishOptions] = useState(getSpanishOptions());

  useEffect(() => {
    if (!connector) {
      navigate("/auxiliaries/conectores-ing");
      return;
    }

    // Inicializar palabras para paso 2 con dos palabras distractoras
    const words = englishPhrase.split(" ");
    const distractorWords = ["yesterday", "quickly"];
    const allWords = [...words, ...distractorWords];
    setRandomizedWords([...allWords].sort(() => Math.random() - 0.5));

    // Inicializar letras para paso 4 con dos letras distractoras
    const letters = connector.english.toUpperCase().split("");
    const distractorLetters = ["Z", "Q"];
    const allLetters = [...letters, ...distractorLetters];
    setRandomizedLetters([...allLetters].sort(() => Math.random() - 0.5));
  }, [connector, navigate, englishPhrase]);

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
      } else if (currentStep === 2) {
        setSelectedEnglishMeaning("");
      } else if (currentStep === 3) {
        setUserLetters([]);
      } else if (currentStep === 4) {
        setSelectedSpanishMeaning("");
      }
    } else {
      toast({
        title: "¡Completado!",
        description: `Has completado el aprendizaje de "${connector.spanish}"`,
        duration: 1500,
      });
      navigate("/auxiliaries/conectores-ing");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsStepComplete(false);
    }
  };

  // Paso 2: Verificar orden de palabras
  const handleVerifyWords = () => {
    const userPhrase = userWords.join(" ");
    if (userPhrase === englishPhrase) {
      setIsStepComplete(true);
      toast({
        title: "¡Correcto!",
        description: "Has ordenado las palabras correctamente",
        className: "bg-green-500/80 border-green-500 text-white",
        duration: 1500,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
        duration: 1500,
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
      setUserWords(userWords.slice(0, -1));
    }
  };

  // Paso 3: Verificar significado en inglés
  const handleVerifyEnglishMeaning = () => {
    if (selectedEnglishMeaning === connector.english) {
      setIsStepComplete(true);
      toast({
        title: "¡Correcto!",
        description: "Has seleccionado el significado correcto",
        className: "bg-green-500/80 border-green-500 text-white",
        duration: 1500,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
        duration: 1500,
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
        toast({
          title: "¡Correcto!",
          description: "Has formado la palabra correctamente",
          className: "bg-green-500/80 border-green-500 text-white",
          duration: 1500,
        });
      } else {
        toast({
          title: "Incorrecto",
          description: "Intenta nuevamente",
          variant: "destructive",
          duration: 1500,
        });
      }
    } else {
      toast({
        title: "Incompleto",
        description: "Debes completar la palabra antes de verificar",
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  // Paso 5: Verificar significado en español
  const handleVerifySpanishMeaning = () => {
    if (selectedSpanishMeaning === connector.spanish) {
      setIsStepComplete(true);
      toast({
        title: "¡Correcto!",
        description: "Has seleccionado el significado correcto",
        className: "bg-green-500/80 border-green-500 text-white",
        duration: 1500,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
        duration: 1500,
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
          <Progress value={progressPercent} className="h-2" />
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
                    {englishPhrase}
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
                    <div className="flex flex-wrap gap-2 justify-center">
                      {userWords.map((word, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 bg-primary text-primary-foreground rounded-md font-bold text-base"
                        >
                          {word}
                        </div>
                      ))}
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
                      onClick={() => setSelectedEnglishMeaning("")}
                      variant="outline"
                      className="flex-1 border-border hover:bg-secondary/80"
                      disabled={!selectedEnglishMeaning}
                    >
                      Borrar
                    </Button>
                    <Button
                      onClick={handleVerifyEnglishMeaning}
                      className="flex-1 gradient-animated"
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
          className="w-full gradient-animated"
          size="lg"
        >
          {currentStep === 5 ? "Finalizar" : "Siguiente"}
        </Button>
      </main>
    </div>
  );
};

export default LearnConnector;
