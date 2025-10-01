import { motion } from "framer-motion";

interface ProgressChartProps {
  currentDay: number;
  totalDays: number;
}

export const ProgressChart = ({ currentDay, totalDays }: ProgressChartProps) => {
  const progress = Math.round((currentDay / totalDays) * 100);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-md"
    >
      <h3 className="text-lg md:text-xl font-semibold mb-6 text-center">
        Progreso del Plan (90 Días)
      </h3>
      
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-64 h-64" viewBox="0 0 280 280">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="hsl(var(--border))"
            strokeWidth="20"
            fill="none"
            className="opacity-30"
          />
          
          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(217 91% 60%)" />
              <stop offset="50%" stopColor="hsl(271 81% 56%)" />
              <stop offset="100%" stopColor="hsl(45 93% 58%)" />
            </linearGradient>
          </defs>
          
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            stroke="url(#progressGradient)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <div className="text-6xl font-bold gradient-text-primary mb-2">
              {progress}%
            </div>
            <div className="text-sm text-muted-foreground">
              {currentDay} de {totalDays} días
            </div>
          </motion.div>
        </div>
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
