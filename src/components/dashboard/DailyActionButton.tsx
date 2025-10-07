import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface DailyActionButtonProps {
  currentDay: number;
  isCompleted: boolean;
  onClick: () => void;
  onSelectDay?: (day: number) => void;
}

export const DailyActionButton = ({
  currentDay,
  isCompleted,
  onClick,
  onSelectDay,
}: DailyActionButtonProps) => {
  const [showDays, setShowDays] = useState(false);
  const daysToShow = [1, 2, 3];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-3"
    >
      <div className="relative">
        <Button
          onClick={() => setShowDays(!showDays)}
          className="w-full py-6 text-base md:text-lg font-semibold rounded-xl shadow-lg gradient-animated hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Empezar Vocabulario del Día
          <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showDays ? "rotate-180" : ""}`} />
        </Button>
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

            return (
              <Card
                key={day}
                onClick={() => isAccessible && onSelectDay && onSelectDay(day)}
                className={`p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isAccessible
                    ? "hover:shadow-lg hover:border-primary/50"
                    : "opacity-50 cursor-not-allowed"
                } ${
                  day === currentDay
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
              </Card>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};
