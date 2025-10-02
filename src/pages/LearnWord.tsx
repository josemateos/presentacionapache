import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Volume2, Check, RotateCcw, Sparkles, Eye, EyeOff } from "lucide-react";
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
  const spanish = searchParams.get("spanish") || "";
  const english = searchParams.get("english") || "";
  const note = searchParams.get("note") || "";

  const [currentModule, setCurrentModule] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const modules: LearningModule[] = [
    { id: 0, title: "Introducción", completed: false },
    { id: 1, title: "Escuchar", completed: false },
    { id: 2, title: "Escribir", completed: false },
    { id: 3, title: "Pronunciar", completed: false },
    { id: 4, title: "Significado", completed: false },
  ];

  const [moduleProgress, setModuleProgress] = useState(modules);
  const progress = (moduleProgress.filter(m => m.completed).length / modules.length) * 100;

  const handlePlayAudio = () => {
    toast({
      title: "Reproduciendo audio",
      description: `Pronunciación de "${english}"`,
    });
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
          setShowAnswer(false);
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
      setShowAnswer(false);
      setAttempts(0);
    } else {
      toast({
        title: "¡Palabra aprendida! 🎉",
        description: "Has completado todos los módulos",
      });
      setTimeout(() => navigate("/vocabulario-dia-1"), 1500);
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
              {note && (
                <p className="text-sm text-primary/80 italic mt-3 bg-primary/5 p-3 rounded-lg">
                  {note}
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

      case 1: // Escuchar
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-primary">
                Escucha la pronunciación
              </h3>
              <p className="text-muted-foreground mb-6">
                Presiona el botón para escuchar cómo se pronuncia la palabra
              </p>
              
              <Button
                size="lg"
                variant="outline"
                className="w-32 h-32 rounded-full mb-6 hover:bg-primary/10"
                onClick={handlePlayAudio}
              >
                <Volume2 className="w-12 h-12 text-primary" />
              </Button>
              
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
                Escribe la palabra en inglés
              </h3>
              <p className="text-muted-foreground mb-6">
                Traduce: <span className="font-bold text-foreground">{spanish}</span>
              </p>
              
              <div className="space-y-4">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Escribe aquí..."
                  className="text-center text-xl h-14"
                  onKeyDown={(e) => e.key === "Enter" && handleCheckAnswer()}
                />
                
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="min-w-[120px]"
                  >
                    {showAnswer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showAnswer ? "Ocultar" : "Ver respuesta"}
                  </Button>
                  
                  <Button
                    onClick={handleCheckAnswer}
                    className="gradient-animated min-w-[120px]"
                    disabled={!userInput.trim()}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Verificar
                  </Button>
                </div>
                
                <AnimatePresence>
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-primary/5 p-4 rounded-lg"
                    >
                      <p className="text-lg font-medium text-primary">
                        {english}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        );

      case 3: // Pronunciar
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-primary">
                Practica la pronunciación
              </h3>
              <p className="text-muted-foreground mb-6">
                Escucha y repite en voz alta
              </p>
              
              <div className="space-y-6">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-32 h-32 rounded-full hover:bg-primary/10"
                  onClick={handlePlayAudio}
                >
                  <Volume2 className="w-12 h-12 text-primary" />
                </Button>
                
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl">
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {english.charAt(0).toUpperCase() + english.slice(1)}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    {spanish}
                  </p>
                </div>
                
                <div className="bg-card/60 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Consejo: Repite la palabra varias veces en voz alta
                  </p>
                </div>
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

      case 4: // Significado
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-primary">
                Asocia el significado
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="gradient-card p-6 rounded-xl border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Español</p>
                    <p className="text-2xl font-bold text-foreground">
                      {spanish.charAt(0).toUpperCase() + spanish.slice(1)}
                    </p>
                  </div>
                  
                  <div className="gradient-card p-6 rounded-xl border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">English</p>
                    <p className="text-2xl font-bold text-foreground">
                      {english.charAt(0).toUpperCase() + english.slice(1)}
                    </p>
                  </div>
                </div>
                
                {note && (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-sm font-medium text-primary">
                      📝 {note}
                    </p>
                  </div>
                )}
                
                <div className="gradient-card p-6 rounded-xl border border-border">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary animate-pulse-subtle" />
                  <p className="text-lg font-semibold mb-2 gradient-text-primary">
                    ¡Excelente trabajo!
                  </p>
                  <p className="text-muted-foreground">
                    Has completado el aprendizaje de esta palabra
                  </p>
                </div>
              </div>
            </Card>
            
            <Button
              size="lg"
              className="gradient-animated w-full max-w-xs"
              onClick={handleNextModule}
            >
              <Check className="w-5 h-5 mr-2" />
              Finalizar
            </Button>
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
              setShowAnswer(false);
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
