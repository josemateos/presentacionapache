import { motion } from "framer-motion";

interface WelcomeSectionProps {
  userName: string;
  currentDay: number;
  totalDays: number;
  registrationDate: Date;
}

export const WelcomeSection = ({
  userName,
  currentDay,
  totalDays,
  registrationDate,
}: WelcomeSectionProps) => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - registrationDate.getTime());
  const daysSinceRegistration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
        {formatDate(today)}
      </p>
      <p className="text-sm md:text-base text-muted-foreground">
        Han transcurrido{" "}
        <span className="text-accent font-semibold">{daysSinceRegistration} días</span> desde tu registro
      </p>
    </motion.section>
  );
};
