import { motion } from "framer-motion";

interface WelcomeSectionProps {
  userName: string;
  currentDay: number;
  totalDays: number;
  currentStage: string;
}

export const WelcomeSection = ({
  userName,
  currentDay,
  totalDays,
  currentStage,
}: WelcomeSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        ¡Bienvenido, {userName}!
      </h2>
      <p className="text-xl text-muted-foreground">
        Hoy: Día{" "}
        <span className="text-primary font-semibold">
          {currentDay}
        </span>{" "}
        de {totalDays}
      </p>
      <p className="text-sm md:text-base text-muted-foreground">
        {currentStage}
      </p>
    </motion.section>
  );
};
