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
}

const LearnConnector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const connector = location.state?.connector as Connector;

  const [currentStep, setCurrentStep] = useState(1);
  const [isStepComplete, setIsStepComplete] = useState(false);

  // Paso 1: Escuchar (audio)
  const [listenCount, setListenCount] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Paso 2: Elegir significado correcto en inglés
  const [selectedEnglishMeaning, setSelectedEnglishMeaning] = useState("");

  // Paso 3: Ordenar letras
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [randomizedLetters, setRandomizedLetters] = useState<string[]>([]);

  // Paso 4: Elegir significado correcto en español
  const [selectedSpanishMeaning, setSelectedSpanishMeaning] = useState("");

  // Opciones para paso 2 (significado en inglés)
  const getEnglishOptions = () => {
    const distractors = ["Before", "Against", "Through"];
    return [connector?.english || "", ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  };

  // Opciones para paso 4 (significado en español)
  const getSpanishOptions = () => {
    const distractors = ["Antes de", "A través de", "En contra de"];
    return [connector?.spanish || "", ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  };

  const [englishOptions] = useState(getEnglishOptions());
  const [spanishOptions] = useState(getSpanishOptions());

  useEffect(() => {
    if (!connector) {
      navigate("/auxiliaries/conectores-ing");
      return;
    }

    // Inicializar letras para paso 3 con dos letras distractoras
    const letters = connector.english.toUpperCase().split("");
    const distractorLetters = ["Z", "Q"];
    const allLetters = [...letters, ...distractorLetters];
    setRandomizedLetters([...allLetters].sort(() => Math.random() - 0.5));
  }, [connector, navigate]);

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = playbackRate;
    
    const voices = window.speechSynthesis.getVoices();
    const latinaVoice = voices.find(voice => 
      (voice.lang.includes("es") || voice.lang.includes("en")) && 
      (voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman"))
    );
    
    if (latinaVoice) {
      utterance.voice = latinaVoice;
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setIsStepComplete(false);
      
      if (currentStep === 1) {
        setSelectedEnglishMeaning("");
      } else if (currentStep === 2) {
        setUserLetters([]);
      } else if (currentStep === 3) {
        setSelectedSpanishMeaning("");
      }
    } else {
      toast({
        title: "¡Completado!",
        description: `Has completado el aprendizaje de "${connector.spanish}"`,
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

  // Paso 2: Verificar significado en inglés
  const handleVerifyEnglishMeaning = () => {
    if (selectedEnglishMeaning === connector.english) {
      setIsStepComplete(true);
      toast({
        title: "¡Correcto!",
        description: "Has seleccionado el significado correcto",
        className: "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300",
      });
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
      });
    }
  };

  // Paso 3: Ordenar letras
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
          className: "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300",
        });
      } else {
        toast({
          title: "Incorrecto",
          description: "Intenta nuevamente",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Incompleto",
        description: "Debes completar la palabra antes de verificar",
        variant: "destructive",
      });
    }
  };

  // Paso 4: Verificar significado en español
  const handleVerifySpanishMeaning = () => {
    if (selectedSpanishMeaning === connector.spanish) {
      setIsStepComplete(true);
      toast({
        title: "¡Correcto!",
        description: "Has seleccionado el significado correcto",
        className: "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300",
      });
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
      });
    }
  };

  const progressPercent = (currentStep / 4) * 100;

  if (!connector) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/auxiliaries/conectores-ing")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-foreground">
                  {connector.spanish}
                </h1>
                <div className="text-right">
                  <span className="text-sm font-normal text-muted-foreground block">
                    {currentStep} de 4
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="h-8 w-8"
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
      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <AnimatePresence mode="wait">
          {/* Paso 1: Escuchar audio */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-center">
                    Paso 1: Escucha la pronunciación
                  </h2>
                  <p className="text-center text-lg font-medium text-muted-foreground">
                    Escucha al menos 3 veces
                  </p>
                  <p className="text-center text-2xl font-bold text-foreground">
                    {connector.english}
                  </p>

                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => playAudio(connector.english)}
                      variant="default"
                      className="gap-2"
                      size="lg"
                    >
                      <Volume2 className="h-5 w-5" />
                      Escuchar
                    </Button>
                    <Button
                      onClick={togglePlaybackSpeed}
                      variant="outline"
                      className="gap-2"
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

          {/* Paso 2: Elegir significado en inglés */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-center">
                    Paso 2: Elige el significado correcto en inglés
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
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          selectedEnglishMeaning === option
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedEnglishMeaning("")}
                      variant="outline"
                      className="flex-1"
                      disabled={!selectedEnglishMeaning}
                    >
                      Borrar
                    </Button>
                    <Button
                      onClick={handleVerifyEnglishMeaning}
                      className="flex-1"
                      disabled={!selectedEnglishMeaning}
                    >
                      Verificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 3: Ordenar letras */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-center">
                    Paso 3: Forma la palabra en inglés
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
                            className="px-4 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-md font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleRemoveLetter}
                      variant="outline"
                      className="flex-1"
                      disabled={userLetters.length === 0}
                    >
                      Borrar
                    </Button>
                    <Button
                      onClick={handleVerifyLetters}
                      className="flex-1"
                    >
                      Verificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 4: Elegir significado en español */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-center">
                    Paso 4: Elige el significado correcto en español
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
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          selectedSpanishMeaning === option
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedSpanishMeaning("")}
                      variant="outline"
                      className="flex-1"
                      disabled={!selectedSpanishMeaning}
                    >
                      Borrar
                    </Button>
                    <Button
                      onClick={handleVerifySpanishMeaning}
                      className="flex-1"
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
          className="w-full"
          size="lg"
        >
          {currentStep === 4 ? "Finalizar" : "Siguiente"}
        </Button>
      </main>
    </div>
  );
};

export default LearnConnector;
