import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, RotateCcw } from "lucide-react";

interface WelcomeProps {
  userName?: string;
  currentDay?: number;
  totalDays?: number;
  registrationDate?: Date;
}

const Welcome = ({ 
  userName = "Carlos", 
  currentDay = 1, 
  totalDays = 90,
  registrationDate = new Date()
}: WelcomeProps) => {
  const navigate = useNavigate();
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - registrationDate.getTime());
  const daysSinceRegistration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const formatDate = (date: Date) => {
    const formatted = date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handleStart = () => {
    navigate("/dashboard");
  };

  const handleContinue = () => {
    // Lógica para continuar donde se quedó
    navigate("/vocabulario-dia-1");
  };

  const handleReview = () => {
    // Lógica para ir a repasos
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo/Branding */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl mx-auto mb-6">
            <span className="text-white font-bold text-3xl">A</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">APACHE</h1>
        </div>

        {/* Welcome Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-card border-2 border-border rounded-2xl p-6 space-y-3 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-foreground">
            ¡Bienvenido, {userName}!
          </h2>
          <p className="text-xl text-muted-foreground">
            Hoy: Día{" "}
            <span className="text-primary font-semibold">
              {currentDay}
            </span>{" "}
            de {totalDays}
          </p>
          <p className="text-base text-muted-foreground">
            {formatDate(today)}
          </p>
          <p className="text-base text-muted-foreground">
            Han transcurrido{" "}
            <span className="text-accent font-semibold">{daysSinceRegistration} días</span> desde tu registro
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            onClick={handleStart}
            className="w-full py-6 text-lg font-semibold rounded-xl shadow-lg gradient-animated hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Empezar
          </Button>

          <Button
            onClick={handleContinue}
            variant="outline"
            className="w-full py-6 text-lg font-semibold rounded-xl shadow-lg hover:bg-muted transition-all"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Continuar
          </Button>

          <Button
            onClick={handleReview}
            variant="outline"
            className="w-full py-6 text-lg font-semibold rounded-xl shadow-lg hover:bg-muted transition-all"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Repasar
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
