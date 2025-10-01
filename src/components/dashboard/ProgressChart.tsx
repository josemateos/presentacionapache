import { motion } from "framer-motion";

interface ProgressChartProps {
  currentDay: number;
  totalDays: number;
}

export const ProgressChart = ({ currentDay, totalDays }: ProgressChartProps) => {
  const progress = Math.round((currentDay / totalDays) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg md:text-xl font-semibold">
          Progreso del Plan (90 Días)
        </h3>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-3xl font-bold gradient-text-primary"
        >
          {progress}%
        </motion.div>
      </div>

      {/* Progress bar container */}
      <div className="relative h-8 bg-secondary rounded-full overflow-hidden shadow-inner">
        {/* Animated progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-full gradient-animated rounded-full relative"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
        
        {/* Progress text inside bar */}
        {progress > 15 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute inset-0 flex items-center px-4"
          >
            <span className="text-white font-semibold text-sm">
              {currentDay} de {totalDays} días
            </span>
          </motion.div>
        )}
      </div>

      {/* Progress milestones */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-primary">{currentDay}</div>
          <div className="text-xs text-muted-foreground">Días completados</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-accent">{totalDays - currentDay}</div>
          <div className="text-xs text-muted-foreground">Días restantes</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-apache-purple">{totalDays}</div>
          <div className="text-xs text-muted-foreground">Total de días</div>
        </div>
      </div>
    </motion.section>
  );
};
