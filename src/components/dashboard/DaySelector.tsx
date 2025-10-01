import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DaySelectorProps {
  currentDay: number;
  totalDays: number;
  completedDays: Record<number, boolean>;
  onSelectDay: (day: number) => void;
}

export const DaySelector = ({
  currentDay,
  totalDays,
  completedDays,
  onSelectDay,
}: DaySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const daysToShow = Math.min(totalDays, currentDay + 5);

  const getDayStatus = (day: number) => {
    if (day === currentDay) return "current";
    if (completedDays[day]) return "completed";
    if (day < currentDay && !completedDays[day]) return "incomplete";
    return "locked";
  };

  const getDayClasses = (status: string) => {
    const base = "py-3 px-4 rounded-xl font-medium transition-all duration-200";
    switch (status) {
      case "current":
        return `${base} gradient-primary text-white shadow-lg`;
      case "completed":
        return `${base} gradient-success text-white`;
      case "incomplete":
        return `${base} gradient-danger text-white animate-pulse-subtle`;
      default:
        return `${base} bg-secondary text-muted-foreground border border-border`;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-2"
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full py-6 rounded-xl font-semibold text-base border-2 hover:bg-muted"
      >
        <span>MIS FRASES DEL DÍA</span>
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
            <div className="bg-card border border-border rounded-xl p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: daysToShow }, (_, i) => i + 1).map((day) => {
                  const status = getDayStatus(day);
                  return (
                    <Button
                      key={day}
                      onClick={() => onSelectDay(day)}
                      className={getDayClasses(status)}
                      disabled={status === "locked"}
                    >
                      Día {day}
                      {status === "incomplete" && (
                        <span className="block text-xs mt-1">
                          (Completa vocabulario)
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
