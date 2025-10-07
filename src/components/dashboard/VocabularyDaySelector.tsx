import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";

interface VocabularyDaySelectorProps {
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export const VocabularyDaySelector = ({
  currentDay,
  onSelectDay,
}: VocabularyDaySelectorProps) => {
  const [showDays, setShowDays] = useState(false);
  const daysToShow = [1, 2, 3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="space-y-3"
    >
      <div
        onClick={() => setShowDays(!showDays)}
        className="cursor-pointer bg-card border border-border rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
      >
        <h2 className="text-lg font-bold text-center text-primary mb-2">
          Vocabulario por Día
        </h2>
        <p className="text-sm text-center text-muted-foreground">
          {showDays ? "Ocultar días" : "Mostrar días disponibles"}
        </p>
      </div>

      {showDays && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          {daysToShow.map((day) => {
            const isAccessible = day <= currentDay;
            const isCompleted = day < currentDay;

            return (
              <Card
                key={day}
                onClick={() => isAccessible && onSelectDay(day)}
                className={`p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isAccessible
                    ? "hover:shadow-lg hover:border-primary/50"
                    : "opacity-50 cursor-not-allowed"
                } ${
                  isCompleted
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border"
                }`}
              >
                <div className="text-2xl font-bold text-primary mb-1">
                  {day}
                </div>
                <div className="text-xs text-muted-foreground">
                  Día {day}
                </div>
                {isCompleted && (
                  <Check className="w-4 h-4 text-primary mt-2" />
                )}
              </Card>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};
