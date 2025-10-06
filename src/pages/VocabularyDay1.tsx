import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Check, Sparkles } from "lucide-react";
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

  // Vocabulario del día 1 - 31 palabras
  const [words, setWords] = useState<Word[]>([
    { id: 1, spanish: "Querer", english: "To want", note: "verbo (ej: quiero)", learned: false, audioFileName: "querer.mp3" },
    { id: 2, spanish: "Comprar", english: "To buy", note: "verbo", learned: false, audioFileName: "comprar.mp3" },
    { id: 3, spanish: "Fruta", english: "Fruit", note: "sustantivo, fem. (frutas pl.)", learned: false, audioFileName: "fruta.mp3" },
    { id: 4, spanish: "Fresco", english: "Fresh", note: "adjetivo (fresca fem.)", learned: false, audioFileName: "fresco.mp3" },
    { id: 5, spanish: "Ahora", english: "Now", learned: false, audioFileName: "ahora.mp3" },
    { id: 6, spanish: "Gustar", english: "To like", note: "verbo (ej: me gusta)", learned: false, audioFileName: "gustar.mp3" },
    { id: 7, spanish: "Leer", english: "To read", note: "verbo", learned: false, audioFileName: "leer.mp3" },
    { id: 8, spanish: "Libro", english: "Book", note: "sustantivo, masc.", learned: false, audioFileName: "libro.mp3" },
    { id: 9, spanish: "Antes", english: "Before", learned: false, audioFileName: "antes.mp3" },
    { id: 10, spanish: "Dormir", english: "To sleep", note: "verbo", learned: false, audioFileName: "dormir.mp3" },
    { id: 11, spanish: "Tener", english: "To have", note: "verbo (ej: tengo)", learned: false, audioFileName: "tener.mp3" },
    { id: 12, spanish: "Reunión", english: "Meeting", note: "sustantivo, fem.", learned: false, audioFileName: "reunion.mp3" },
    { id: 13, spanish: "Importante", english: "Important", note: "adjetivo", learned: false, audioFileName: "importante.mp3" },
    { id: 14, spanish: "Hoy", english: "Today", learned: false, audioFileName: "hoy.mp3" },
    { id: 15, spanish: "Tarde", english: "Afternoon", note: "sustantivo, fem.", learned: false, audioFileName: "tarde.mp3" },
    { id: 16, spanish: "Próximo", english: "Next", note: "adjetivo (próxima fem.)", learned: false, audioFileName: "proximo.mp3" },
    { id: 17, spanish: "Fin", english: "End", note: "sustantivo, masc.", learned: false, audioFileName: "fin.mp3" },
    { id: 18, spanish: "Semana", english: "Week", note: "sustantivo, fem.", learned: false, audioFileName: "semana.mp3" },
    { id: 19, spanish: "Visitar", english: "To visit", note: "verbo (ej: visitaré)", learned: false, audioFileName: "visitar.mp3" },
    { id: 20, spanish: "Familia", english: "Family", note: "sustantivo, fem.", learned: false, audioFileName: "familia.mp3" },
    { id: 21, spanish: "Necesitar", english: "To need", note: "verbo (ej: necesito)", learned: false, audioFileName: "necesitar.mp3" },
    { id: 22, spanish: "Practicar", english: "To practice", note: "verbo", learned: false, audioFileName: "practicar.mp3" },
    { id: 23, spanish: "Inglés", english: "English", learned: false, audioFileName: "ingles.mp3" },
    { id: 24, spanish: "Cada", english: "Every/Each", learned: false, audioFileName: "cada.mp3" },
    { id: 25, spanish: "Día", english: "Day", note: "sustantivo, masc.", learned: false, audioFileName: "dia.mp3" },
    { id: 26, spanish: "Mejorar", english: "To improve", note: "verbo", learned: false, audioFileName: "mejorar.mp3" },
    { id: 27, spanish: "Agua", english: "Water", note: "sustantivo, fem.", learned: false, audioFileName: "agua.mp3" },
    { id: 28, spanish: "Trabajo", english: "Work", note: "empleo o tarea", learned: false, audioFileName: "trabajo.mp3" },
    { id: 29, spanish: "Escuela", english: "School", note: "sustantivo, fem.", learned: false, audioFileName: "escuela.mp3" },
    { id: 30, spanish: "Casa", english: "House", note: "edificio", learned: false, audioFileName: "casa.mp3" },
    { id: 31, spanish: "Ser", english: "To be", note: "verbo (esencia)", learned: false, audioFileName: "ser.mp3" },
  ]);

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const learnedCount = words.filter(w => w.learned).length;
  const progress = (learnedCount / words.length) * 100;

  useEffect(() => {
    // Cargar progreso guardado, conservando "learned" pero usando textos/notas actuales
    const saved = localStorage.getItem("vocabulary_day1_progress");
    if (saved) {
      try {
        const savedWords: Word[] = JSON.parse(saved);
        // Fusionar por "english": mantener estado aprendido del guardado y textos actuales
        const merged = words.map(current => {
          const match = savedWords.find(w => w.english === current.english);
          return match ? { ...current, learned: match.learned } : current;
        });
        setWords(merged);
        localStorage.setItem("vocabulary_day1_progress", JSON.stringify(merged));
      } catch (error) {
        console.error("Error loading saved progress:", error);
        localStorage.setItem("vocabulary_day1_progress", JSON.stringify(words));
      }
    } else {
      localStorage.setItem("vocabulary_day1_progress", JSON.stringify(words));
    }
  }, []);

  useEffect(() => {
    // Guardar progreso en localStorage
    localStorage.setItem("vocabulary_day1_progress", JSON.stringify(words));
  }, [words]);

  const handleLearnWord = (word: Word) => {
    if (word.learned) {
      // Modo repaso - ir a pantalla de aprendizaje
      navigate(`/learn-word?id=${word.id}&spanish=${encodeURIComponent(word.spanish)}&english=${encodeURIComponent(word.english)}&note=${encodeURIComponent(word.note || '')}`);
    } else {
      // Modo aprendizaje - navegar a pantalla de aprendizaje
      navigate(`/learn-word?id=${word.id}&spanish=${encodeURIComponent(word.spanish)}&english=${encodeURIComponent(word.english)}&note=${encodeURIComponent(word.note || '')}`);
    }
  };





  const completionMessage = learnedCount === words.length ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 px-4 bg-card border border-border rounded-2xl"
    >
      <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary animate-pulse-subtle" />
      <h3 className="text-xl font-bold mb-2 text-primary">
        ¡Felicitaciones!
      </h3>
      <p className="text-muted-foreground">
        Has completado el vocabulario del Día 1
      </p>
    </motion.div>
  ) : null;

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
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
          className="bg-card border border-border rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-lg font-semibold mb-3 text-center text-primary flex items-center justify-center gap-2">
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
                  className={`p-5 transition-all duration-200 cursor-pointer hover:shadow-xl bg-card border-border ${
                    !word.learned 
                      ? "hover:border-primary/50" 
                      : "opacity-90"
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
                          : "bg-secondary text-secondary-foreground border border-border"
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
