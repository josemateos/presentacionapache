import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProgressDetailsProps {
  currentDay: number;
  totalDays: number;
  phrasesCompleted: number;
  totalPhrases: number;
  wordsMastered: number;
  totalWords: number;
  auxLearned: number;
  totalAux: number;
}

export const ProgressDetails = ({
  currentDay,
  totalDays,
  phrasesCompleted,
  totalPhrases,
  wordsMastered,
  totalWords,
  auxLearned,
  totalAux,
}: ProgressDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const progressItems = [
    {
      label: "Días del Plan",
      current: currentDay,
      total: totalDays,
      icon: null,
    },
    {
      label: "Frases Completadas",
      current: phrasesCompleted,
      total: totalPhrases,
      icon: null,
    },
    {
      label: "Palabras Dominadas",
      current: wordsMastered,
      total: totalWords,
      icon: null,
    },
    {
      label: "Auxiliares Clave",
      current: auxLearned,
      total: totalAux,
      icon: <Gem className="w-3 h-3 text-accent ml-1" />,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-2"
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full py-6 rounded-xl font-semibold text-base border-2 hover:bg-muted"
      >
        <span>MI PROGRESO DETALLADO</span>
        <ChevronDown
          className={cn(
            "ml-auto w-5 h-5 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              {progressItems.map((item, index) => {
                const percentage = Math.round((item.current / item.total) * 100);
                return (
                  <div
                    key={index}
                    className="bg-secondary rounded-xl p-4 border border-border"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">
                        {item.label}
                      </span>
                      <span className="font-semibold text-foreground flex items-center">
                        {item.current}/{item.total}
                        {item.icon}
                      </span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="h-full gradient-primary rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
