import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Volume2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Connector {
  english: string;
  spanish: string;
}

interface ExampleSentence {
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

  // Paso 1: Escuchar
  const [listenCount, setListenCount] = useState(0);

  // Paso 2: Ordenar frase
  const [userAttemptSpanish, setUserAttemptSpanish] = useState<string[]>([]);
  const [randomizedBank, setRandomizedBank] = useState<string[]>([]);

  // Paso 3: Traducir al inglés
  const [userTranslation, setUserTranslation] = useState("");

  // Paso 4: Pronunciar
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [pronunciationFeedback, setPronunciationFeedback] = useState("");

  // Ejemplos de frases (en una app real, estos vendrían de una base de datos)
  const exampleSentences: ExampleSentence[] = [
    {
      english: `I'm thinking ${connector.english.toLowerCase()} traveling.`,
      spanish: `Estoy pensando en viajar. (${connector.spanish})`,
    },
  ];

  const currentExample = exampleSentences[0];

  useEffect(() => {
    if (!connector) {
      navigate("/auxiliaries/conectores-ing");
      return;
    }

    // Inicializar banco de palabras para paso 2
    const words = currentExample.spanish.split(" ");
    setRandomizedBank([...words].sort(() => Math.random() - 0.5));
  }, [connector, navigate]);

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
    setListenCount((prev) => prev + 1);

    if (listenCount >= 2 && currentStep === 1) {
      setIsStepComplete(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setIsStepComplete(false);
      
      // Reset estados
      if (currentStep === 1) {
        setUserAttemptSpanish([]);
      } else if (currentStep === 2) {
        setUserTranslation("");
      } else if (currentStep === 3) {
        setTranscribedText("");
        setPronunciationFeedback("");
      }
    } else {
      toast({
        title: "¡Completado!",
        description: `Has completado el aprendizaje de "${connector.english}"`,
      });
      navigate("/auxiliaries/conectores-ing");
    }
  };

  // Paso 2: Ordenar palabras
  const handleWordClick = (word: string) => {
    if (!isStepComplete) {
      const newAttempt = [...userAttemptSpanish, word];
      setUserAttemptSpanish(newAttempt);

      // Verificar si está completo
      if (newAttempt.length === randomizedBank.length) {
        const userSentence = newAttempt.join(" ");
        const correctSentence = currentExample.spanish;
        
        if (userSentence === correctSentence) {
          setIsStepComplete(true);
          toast({
            title: "¡Correcto!",
            description: "Has ordenado la frase correctamente",
          });
        }
      }
    }
  };

  const handleRemoveWord = (index: number) => {
    const newAttempt = userAttemptSpanish.filter((_, i) => i !== index);
    setUserAttemptSpanish(newAttempt);
  };

  // Paso 3: Traducir
  const handleCheckTranslation = () => {
    const userText = userTranslation.trim().toLowerCase();
    const correctText = currentExample.english.toLowerCase();
    
    if (userText === correctText) {
      setIsStepComplete(true);
      toast({
        title: "¡Correcto!",
        description: "Tu traducción es correcta",
      });
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta nuevamente",
        variant: "destructive",
      });
    }
  };

  // Paso 4: Pronunciar
  const handleStartRecording = () => {
    setIsRecording(true);
    setPronunciationFeedback("");

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscribedText(transcript);
      checkPronunciation(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast({
        title: "Error",
        description: "No se pudo capturar el audio",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const checkPronunciation = (transcript: string) => {
    const userWords = transcript.toLowerCase().split(" ");
    const correctWords = currentExample.english.toLowerCase().split(" ");

    if (
      userWords.length === correctWords.length &&
      userWords.every((word, i) => word === correctWords[i])
    ) {
      setPronunciationFeedback("¡Excelente pronunciación!");
      setIsStepComplete(true);
    } else {
      setPronunciationFeedback("Aún hay palabras por corregir en la pronunciación.");
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
              <h1 className="text-xl font-bold text-foreground">
                {connector.english}
              </h1>
              <p className="text-sm text-muted-foreground">
                {connector.spanish}
              </p>
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <AnimatePresence mode="wait">
          {/* Paso 1: Escuchar */}
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
                    Paso 1: Escucha la frase
                  </h2>
                  <p className="text-center text-muted-foreground">
                    Escucha al menos 3 veces
                  </p>

                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => playAudio(currentExample.english)}
                      className="gap-2"
                    >
                      <Volume2 className="h-5 w-5" />
                      Reproducir
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Reproducciones: {listenCount}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 2: Ordenar frase */}
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
                    Paso 2: Ordena la frase en español
                  </h2>

                  {/* Área de construcción */}
                  <div className="bg-muted/30 rounded-lg p-4 min-h-[80px] border-2 border-dashed border-border">
                    <div className="flex flex-wrap gap-2">
                      {userAttemptSpanish.map((word, index) => (
                        <button
                          key={index}
                          onClick={() => handleRemoveWord(index)}
                          className="px-3 py-2 bg-primary text-primary-foreground rounded-md font-medium"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Banco de palabras */}
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {randomizedBank.map((word, index) => {
                        const isUsed = userAttemptSpanish.includes(word);
                        return (
                          <button
                            key={index}
                            onClick={() => handleWordClick(word)}
                            disabled={isStepComplete || isUsed}
                            className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 3: Traducir */}
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
                    Paso 3: Traduce al inglés
                  </h2>
                  <p className="text-center text-muted-foreground">
                    {currentExample.spanish}
                  </p>

                  <input
                    type="text"
                    value={userTranslation}
                    onChange={(e) => setUserTranslation(e.target.value)}
                    placeholder="Escribe la traducción..."
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isStepComplete}
                  />

                  <Button
                    onClick={handleCheckTranslation}
                    className="w-full"
                    disabled={!userTranslation.trim() || isStepComplete}
                  >
                    Verificar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 4: Pronunciar */}
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
                    Paso 4: Pronuncia la frase
                  </h2>
                  <p className="text-center text-muted-foreground">
                    {currentExample.english}
                  </p>

                  <Button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Volume2 className="h-5 w-5" />
                    {isRecording ? "Grabando..." : "Iniciar Grabación"}
                  </Button>

                  {transcribedText && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Texto detectado:
                      </p>
                      <p className="font-medium">{transcribedText}</p>
                    </div>
                  )}

                  {pronunciationFeedback && (
                    <div
                      className={`rounded-lg p-4 flex items-center gap-2 ${
                        isStepComplete
                          ? "bg-green-500/20 text-green-700 dark:text-green-300"
                          : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {isStepComplete ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                      <p className="font-medium">{pronunciationFeedback}</p>
                    </div>
                  )}
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
