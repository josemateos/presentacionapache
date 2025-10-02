import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Volume2, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Word {
  id: number;
  spanish: string;
  english: string;
  note?: string;
  learned: boolean;
  audioFileName?: string;
}

const VocabularyDay1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Palabras del día 1: 6 de la frase "Strumming my pain with his fingers" + 4 adicionales
  const [words, setWords] = useState<Word[]>([
    { id: 1, spanish: "rasguear", english: "strumming", note: "tocar la guitarra con los dedos", learned: false },
    { id: 2, spanish: "mi", english: "my", note: "posesivo", learned: false },
    { id: 3, spanish: "dolor", english: "pain", learned: false },
    { id: 4, spanish: "con", english: "with", learned: false },
    { id: 5, spanish: "su/sus", english: "his", note: "posesivo masculino", learned: false },
    { id: 6, spanish: "dedos", english: "fingers", learned: false },
    { id: 7, spanish: "cantar", english: "singing", note: "ando/endo = lo que se está haciendo", learned: false },
    { id: 8, spanish: "canción", english: "song", learned: false },
    { id: 9, spanish: "palabras", english: "words", learned: false },
    { id: 10, spanish: "vida", english: "life", learned: false },
  ]);

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const learnedCount = words.filter(w => w.learned).length;
  const progress = (learnedCount / words.length) * 100;

  useEffect(() => {
    // Cargar progreso guardado del localStorage
    const saved = localStorage.getItem("vocabulary_day1_progress");
    if (saved) {
      try {
        const savedWords = JSON.parse(saved);
        setWords(savedWords);
      } catch (error) {
        console.error("Error loading saved progress:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Guardar progreso en localStorage
    localStorage.setItem("vocabulary_day1_progress", JSON.stringify(words));
  }, [words]);

  const handleLearnWord = (word: Word) => {
    if (word.learned) {
      // Modo repaso - mostrar detalles
      setSelectedWord(word);
    } else {
      // Modo aprendizaje - simular navegación a pantalla de aprendizaje
      toast({
        title: "Aprendiendo palabra",
        description: `"${word.spanish}" - ${word.english}`,
      });
      
      // Marcar como aprendida después de un momento
      setTimeout(() => {
        setWords(prev => prev.map(w => 
          w.id === word.id ? { ...w, learned: true } : w
        ));
        toast({
          title: "¡Palabra aprendida! 🎉",
          description: `"${word.spanish}" ha sido agregada a tu vocabulario`,
        });
      }, 1500);
    }
  };

  const handlePlayAudio = (word: Word, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Reproduciendo audio",
      description: `Pronunciación de "${word.english}"`,
    });
    // Aquí iría la lógica real de reproducción de audio
  };

  const completionMessage = learnedCount === words.length ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 px-4 gradient-card rounded-xl border border-primary/20"
    >
      <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary animate-pulse-subtle" />
      <h3 className="text-xl font-bold mb-2 gradient-text-primary">
        ¡Felicitaciones!
      </h3>
      <p className="text-muted-foreground">
        Has completado el vocabulario del Día 1
      </p>
    </motion.div>
  ) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Inicio</span>
          </Button>
          
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            Vocabulario del Día 1
          </h1>
          
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10"
            onClick={() => toast({ title: "Ajustes", description: "Próximamente" })}
          >
            <span className="hidden sm:inline mr-2">Ajustes</span>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card rounded-xl p-6 mb-6 border border-border shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-3 text-center gradient-text-primary flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Progreso General
          </h2>
          <Progress value={progress} className="h-5 mb-2" />
          <p className="text-center text-sm text-muted-foreground mt-3">
            {learnedCount} de {words.length} palabras aprendidas
          </p>
        </motion.div>

        {/* Completion Message */}
        {completionMessage}

        {/* Word List */}
        <div className="space-y-3 mt-6">
          <AnimatePresence mode="popLayout">
            {words.map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`p-5 transition-all duration-200 cursor-pointer hover:shadow-xl border-border ${
                    !word.learned 
                      ? "hover:border-primary/50 hover:bg-card/80" 
                      : "bg-card/60"
                  }`}
                  onClick={() => handleLearnWord(word)}
                >
                  {/* Word Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {word.spanish.charAt(0).toUpperCase() + word.spanish.slice(1)}
                    </h3>
                    
                    <p className="text-base md:text-lg text-muted-foreground mb-1">
                      {word.english.charAt(0).toUpperCase() + word.english.slice(1)}
                    </p>
                    
                    {word.note && (
                      <p className="text-sm text-primary/80 italic mt-2">
                        {word.note}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 items-center justify-center">
                    <Badge
                      variant={word.learned ? "default" : "secondary"}
                      className={`min-w-[110px] py-2 justify-center text-sm font-medium ${
                        word.learned 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {word.learned ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Aprendida
                        </>
                      ) : (
                        "Pendiente"
                      )}
                    </Badge>

                    <Button
                      size="sm"
                      className={`min-w-[110px] ${
                        word.learned
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          : "gradient-animated"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLearnWord(word);
                      }}
                    >
                      {word.learned ? "Repasar" : "Aprender"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
};

export default VocabularyDay1;
