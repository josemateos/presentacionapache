import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, CheckCircle2, Mic, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: string;
  title: string;
  completed: boolean;
}

const LearnPhrase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const phraseId = searchParams.get("id");
  const day = searchParams.get("day");
  const english = searchParams.get("english") || "";
  const spanish = searchParams.get("spanish") || "";

  const [currentModule, setCurrentModule] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const modules: Module[] = [
    { id: "listen", title: "Escucha la frase", completed: false },
    { id: "write", title: "Escribe en inglés", completed: false },
    { id: "speak", title: "Pronuncia la frase", completed: false },
    { id: "remember", title: "Recuerda", completed: false },
  ];

  const [moduleProgress, setModuleProgress] = useState(modules);
  const progress = (moduleProgress.filter(m => m.completed).length / modules.length) * 100;

  const handlePlayAudio = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(english);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      toast({
        title: "Audio no disponible",
        description: "Tu navegador no soporta síntesis de voz",
        variant: "destructive",
      });
    }
  };

  const handleModuleComplete = () => {
    const updated = [...moduleProgress];
    updated[currentModule] = { ...updated[currentModule], completed: true };
    setModuleProgress(updated);

    if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setUserInput("");
      setIsRecording(false);
      setHasRecording(false);
    } else {
      toast({
        title: "¡Frase completada!",
        description: `"${english}" se ha agregado a tu vocabulario`,
      });
      setTimeout(() => {
        navigate(`/phrases-day?day=${day}`);
      }, 1500);
    }
  };

  const handleCheckAnswer = () => {
    const cleanInput = userInput.trim().toLowerCase();
    const cleanEnglish = english.trim().toLowerCase();
    
    if (cleanInput === cleanEnglish) {
      toast({
        title: "¡Correcto!",
        description: "Has escrito la frase correctamente",
      });
      handleModuleComplete();
    } else {
      toast({
        title: "Intenta de nuevo",
        description: "La frase no es correcta",
        variant: "destructive",
      });
    }
  };

  const handleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast({
        title: "Grabando...",
        description: "Pronuncia la frase en voz alta",
      });
      setTimeout(() => {
        setIsRecording(false);
        setHasRecording(true);
        toast({
          title: "Grabación completa",
          description: "Puedes escuchar tu pronunciación",
        });
      }, 3000);
    }
  };

  const handlePlayRecording = () => {
    toast({
      title: "Reproduciendo tu grabación",
      description: "Escucha cómo pronunciaste la frase",
    });
  };

  const renderModule = () => {
    const module = modules[currentModule];

    switch (module.id) {
      case "listen":
        return (
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Escucha y aprende</h3>
              <p className="text-xl text-foreground font-medium mb-4">
                {english}
              </p>
              <p className="text-lg text-muted-foreground">
                {spanish}
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handlePlayAudio}
                size="lg"
                className="gap-2 px-8"
              >
                <Volume2 className="w-5 h-5" />
                Escuchar frase
              </Button>
            </div>

            <Button
              onClick={handleModuleComplete}
              className="w-full"
              size="lg"
            >
              Continuar
            </Button>
          </Card>
        );

      case "write":
        return (
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Escribe "{spanish}" en inglés</h3>
              <Button
                onClick={handlePlayAudio}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Escuchar de nuevo
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Escribe la frase en inglés..."
                className="text-lg p-6"
                onKeyDown={(e) => e.key === "Enter" && handleCheckAnswer()}
              />

              <Button
                onClick={handleCheckAnswer}
                className="w-full"
                size="lg"
                disabled={!userInput.trim()}
              >
                Verificar
              </Button>
            </div>
          </Card>
        );

      case "speak":
        return (
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Escucha y pronuncia</h3>
              <p className="text-xl font-medium">{english}</p>
              
              <Button
                onClick={handlePlayAudio}
                variant="outline"
                className="gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Escuchar modelo
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Grabando tu pronunciación..." : hasRecording ? "Grabación lista" : "Toca el micrófono y pronuncia la frase"}
              </p>
              
              <div className="flex gap-3">
                {!hasRecording ? (
                  <Button
                    onClick={handleRecording}
                    size="lg"
                    className={`gap-2 px-8 ${isRecording ? 'animate-pulse bg-destructive' : ''}`}
                    disabled={isRecording}
                  >
                    <Mic className="w-5 h-5" />
                    {isRecording ? "Grabando..." : "Grabar mi voz"}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handlePlayRecording}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                    >
                      <Volume2 className="w-5 h-5" />
                      Escuchar grabación
                    </Button>
                    <Button
                      onClick={() => {
                        setHasRecording(false);
                        setIsRecording(false);
                      }}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Grabar de nuevo
                    </Button>
                  </>
                )}
              </div>
            </div>

            {hasRecording && (
              <Button
                onClick={handleModuleComplete}
                className="w-full"
                size="lg"
              >
                Continuar
              </Button>
            )}
          </Card>
        );

      case "remember":
        return (
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold">¡Recuerda esta frase!</h3>
              
              <div className="space-y-3 py-6">
                <p className="text-2xl font-bold text-primary">
                  {spanish}
                </p>
                <div className="text-4xl font-bold text-muted-foreground/40">=</div>
                <p className="text-2xl font-bold">
                  {english}
                </p>
              </div>

              <Button
                onClick={handlePlayAudio}
                variant="outline"
                className="gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Escuchar una vez más
              </Button>
            </div>

            <Button
              onClick={handleModuleComplete}
              className="w-full gap-2"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              Marcar como aprendida
            </Button>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/phrases-day?day=${day}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <span className="text-sm font-medium">
              Módulo {currentModule + 1} de {modules.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 grid grid-cols-4 gap-2">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className={`h-2 rounded-full transition-colors ${
                module.completed
                  ? "bg-primary"
                  : index === currentModule
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LearnPhrase;
