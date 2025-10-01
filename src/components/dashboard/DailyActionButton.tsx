import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface DailyActionButtonProps {
  currentDay: number;
  isCompleted: boolean;
  onClick: () => void;
}

export const DailyActionButton = ({
  currentDay,
  isCompleted,
  onClick,
}: DailyActionButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Button
        onClick={onClick}
        disabled={isCompleted}
        className={`w-full py-6 text-base md:text-lg font-semibold rounded-xl shadow-lg transition-all ${
          isCompleted
            ? "gradient-success opacity-70 cursor-not-allowed"
            : "gradient-primary hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Vocabulario Día {currentDay} ¡Listo!
          </>
        ) : (
          `Empezar Vocabulario del Día ${currentDay}`
        )}
      </Button>
    </motion.div>
  );
};
