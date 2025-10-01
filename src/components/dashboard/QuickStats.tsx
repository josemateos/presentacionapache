import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface QuickStatsProps {
  phrasesToday: number;
  totalPhrasesToday: number;
  newWordsToday: number;
  streakDays: number;
}

export const QuickStats = ({
  phrasesToday,
  totalPhrasesToday,
  newWordsToday,
  streakDays,
}: QuickStatsProps) => {
  const stats = [
    {
      value: `${phrasesToday}/${totalPhrasesToday}`,
      label: "Frases Hoy",
    },
    {
      value: newWordsToday,
      label: "Palabras Nuevas",
    },
    {
      value: streakDays,
      label: "Días de Racha",
      icon: <Flame className="w-5 h-5 text-accent" />,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-md"
    >
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-secondary rounded-xl p-4 border border-border text-center"
          >
            <p className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-1">
              {stat.icon}
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
