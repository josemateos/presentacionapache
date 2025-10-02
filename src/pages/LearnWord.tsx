import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Volume2, Check, RotateCcw, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface LearningModule {
  id: number;
  title: string;
  completed: boolean;
}

const LearnWord = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const wordId = searchParams.get("id");
  const rawSpanish = searchParams.get("spanish") || "";
  const english = searchParams.get("english") || "";
  const spanish = english.toLowerCase().trim() === "strumming" ? "rasgueando" : rawSpanish;
  const note = searchParams.get("note") || "";
  const displayNote = english.toLowerCase().trim() === "strumming" ? "Rasgueando" : note;

  const [currentModule, setCurrentModule] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const modules: LearningModule[] = [
    { id: 0, title: "Introducción", completed: false },
    { id: 1, title: "Escucha y pronuncia", completed: false },
    { id: 2, title: "Escribir", completed: false },
    { id: 3, title: "Recuerda", completed: false },
  ];

  const [moduleProgress, setModuleProgress] = useState(modules);
  const progress = (moduleProgress.filter(m => m.completed).length / modules.length) * 100;

  const handlePlayAudio = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(english);
      utterance.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Ignorar si el navegador no soporta SpeechSynthesis
    }
    toast({
      title: "Reproduciendo audio",
      description: `Pronunciación de "${english}"`,
    });
  };

  const [hasRecording, setHasRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Grabando",
      description: "Pronuncia la palabra tres veces seguidas",
    });
    // Simular fin de grabación después de 5 segundos
    setTimeout(() => {
      setIsRecording(false);
      setHasRecording(true);
      toast({
        title: "Grabación finalizada",
        description: "¡Excelente pronunciación!",
      });
    }, 5000);
  };

  const handlePlayRecording = () => {
    toast({
      title: "Reproduciendo grabación",
      description: "Escuchando tu pronunciación",
    });
  };

  const getInputValidationColor = () => {
    if (!userInput) return "";
    
    const correctWord = english.toLowerCase().trim();
    const currentInput = userInput.toLowerCase().trim();
    
    // Verificar si las letras escritas son correctas hasta el momento
    const isCorrectSoFar = correctWord.startsWith(currentInput);
    
    if (isCorrectSoFar) {
      return "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300";
    } else {
      return "bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300";
    }
  };

  const handleCheckAnswer = () => {
    const isCorrect = userInput.toLowerCase().trim() === english.toLowerCase().trim();
    
    if (isCorrect) {
      toast({
        title: "¡Correcto! 🎉",
        description: "Has escrito la palabra correctamente",
      });
      
      setModuleProgress(prev => prev.map(m => 
        m.id === currentModule ? { ...m, completed: true } : m
      ));
      
      setTimeout(() => {
        if (currentModule < modules.length - 1) {
          setCurrentModule(currentModule + 1);
          setUserInput("");
          setAttempts(0);
        }
      }, 1500);
    } else {
      setAttempts(attempts + 1);
      toast({
        title: "Intenta de nuevo",
        description: "La respuesta no es correcta",
        variant: "destructive",
      });
    }
  };

  const handleNextModule = () => {
    setModuleProgress(prev => prev.map(m => 
      m.id === currentModule ? { ...m, completed: true } : m
    ));
    
    if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setUserInput("");
      setAttempts(0);
    }
  };

  const renderModule = () => {
    switch (currentModule) {
      case 0: // Introducción
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="gradient-card rounded-xl p-8 border border-primary/20">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse-subtle" />
              <h2 className="text-3xl font-bold mb-3 gradient-text-primary">
                {spanish.charAt(0).toUpperCase() + spanish.slice(1)}
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                {english.charAt(0).toUpperCase() + english.slice(1)}
              </p>
              {displayNote && (
                <p className="text-sm text-primary/80 italic mt-3 bg-primary/5 p-3 rounded-lg">
                  {displayNote}
                </p>
              )}
            </div>
            
            <Button
              size="lg"
              className="gradient-animated w-full max-w-xs"
              onClick={handleNextModule}
            >
              Comenzar aprendizaje
            </Button>
          </motion.div>
        );

      case 1: // Escucha y pronuncia
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-primary">
                Escucha y pronuncia
              </h3>
              <p className="text-muted-foreground mb-6">
                Escucha y repite la pronunciación
              </p>
              
              <div className="flex justify-center items-center gap-8 mb-6">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-20 h-20 rounded-full hover:bg-primary/10"
                  onClick={handlePlayAudio}
                >
                  <Volume2 className="w-8 h-8 text-primary" />
                </Button>

                <div className="flex flex-col items-center gap-2">
                  {!hasRecording ? (
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "outline"}
                      className="w-20 h-20 rounded-full hover:bg-primary/10"
                      onClick={handleStartRecording}
                      disabled={isRecording}
                    >
                      <Mic className={`w-8 h-8 ${isRecording ? "text-white" : "text-primary"}`} />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-20 h-20 rounded-full hover:bg-primary/10"
                      onClick={handlePlayRecording}
                    >
                      <Volume2 className="w-8 h-8 text-primary" />
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground max-w-[120px] text-center">
                    {!hasRecording ? "Pronuncia la palabra tres veces seguidas" : "Escuchar grabación"}
                  </p>
                </div>
              </div>
              
              <div className="bg-card/60 p-4 rounded-lg">
                <p className="text-xl font-medium text-foreground">
                  {english.charAt(0).toUpperCase() + english.slice(1)}
                </p>
              </div>
            </Card>
            
            <Button
              size="lg"
              className="gradient-animated w-full max-w-xs"
              onClick={handleNextModule}
            >
              Siguiente
            </Button>
          </motion.div>
        );

      case 2: // Escribir
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-primary">
                Escribe "{spanish.charAt(0).toUpperCase() + spanish.slice(1)}" en Inglés
              </h3>
              
              <div className="space-y-4">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Escribe aquí..."
                  className={`text-center text-xl h-14 ${getInputValidationColor()}`}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckAnswer()}
                />
                
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleCheckAnswer}
                    className="gradient-animated min-w-[120px]"
                    disabled={!userInput.trim()}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Verificar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        );

      case 3: // Recuerda
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-primary">
                Recuerda
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-3xl font-bold text-foreground">
                      {spanish.charAt(0).toUpperCase() + spanish.slice(1)}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      =
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {english.charAt(0).toUpperCase() + english.slice(1)}
                    </p>
                  </div>
                </div>
                
                {displayNote && (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-sm font-medium text-primary">
                      📝 {displayNote}
                    </p>
                  </div>
                )}
              </div>
            </Card>
            
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="gradient-animated w-full max-w-xs mx-auto"
                onClick={() => {
                  // Marcar como aprendida en localStorage
                  const saved = localStorage.getItem("vocabulary_day1_progress");
                  if (saved) {
                    try {
                      const savedWords = JSON.parse(saved);
                      const updatedWords = savedWords.map((w: any) => 
                        w.id === parseInt(wordId || "0") ? { ...w, learned: true } : w
                      );
                      localStorage.setItem("vocabulary_day1_progress", JSON.stringify(updatedWords));
                    } catch (error) {
                      console.error("Error updating progress:", error);
                    }
                  }
                  toast({
                    title: "Palabra aprendida",
                    description: `${english.charAt(0).toUpperCase() + english.slice(1)} se ha agregado a tu vocabulario`,
                  });
                  setTimeout(() => navigate("/vocabulario-dia-1"), 1000);
                }}
              >
                <Check className="w-5 h-5 mr-2" />
                Marcar como aprendida
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full max-w-xs mx-auto"
                onClick={() => {
                  setCurrentModule(0);
                  setUserInput("");
                  setAttempts(0);
                  setModuleProgress(modules.map(m => ({ ...m, completed: false })));
                }}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Repasar palabra
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vocabulario-dia-1")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
          
          <Badge variant="secondary" className="text-sm">
            Módulo {currentModule + 1} de {modules.length}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10"
            onClick={() => {
              setUserInput("");
              setAttempts(0);
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Reiniciar</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {moduleProgress.filter(m => m.completed).length} de {modules.length} módulos completados
          </p>
        </motion.div>

        {/* Module Content */}
        <AnimatePresence mode="wait">
          {renderModule()}
        </AnimatePresence>

        {/* Module Navigation */}
        <div className="mt-8 flex justify-center gap-2">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className={`w-3 h-3 rounded-full transition-all ${
                module.completed
                  ? "bg-primary"
                  : index === currentModule
                  ? "bg-primary/50 scale-125"
                  : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LearnWord;
