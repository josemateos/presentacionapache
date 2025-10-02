import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotateCcw, User } from "lucide-react";

interface WelcomeProps {
  userName?: string;
  currentDay?: number;
  totalDays?: number;
  registrationDate?: Date;
  reviewPendingCount?: number;
}

const Welcome = ({ 
  userName = "Carlos", 
  currentDay = 1, 
  totalDays = 90,
  registrationDate = new Date(),
  reviewPendingCount = 3
}: WelcomeProps) => {
  const navigate = useNavigate();
  const today = new Date();
  registrationDate.setDate(registrationDate.getDate() - 7);
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
    // Primera vez - ir al dashboard completo
    navigate("/dashboard");
  };

  const handleContinue = () => {
    // Continuar donde se quedó - puede ser vocabulario o frases
    navigate("/vocabulario-dia-1");
  };

  const handleReview = () => {
    // Ir a repasos
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] via-[#2d1b4e] to-[#1a1f3a] flex flex-col">
      {/* Header with Logo and User Icon */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-white font-semibold text-lg">Apache</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <User className="w-6 h-6" />
        </Button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col max-w-md mx-auto w-full px-6"
      >
        {/* Welcome Header */}
        <div className="text-white space-y-2 mb-8 mt-4">
          <h1 className="text-3xl font-bold">
            ¡Bienvenido, {userName}!
          </h1>
          <p className="text-lg">
            Hoy: Día <span className="text-blue-400 font-semibold">{currentDay}</span> de {totalDays}
          </p>
          <p className="text-base text-gray-300">
            {formatDate(today)}
          </p>
          <p className="text-base text-gray-300">
            Han transcurrido <span className="text-yellow-400 font-semibold">{daysSinceRegistration} días</span> desde tu registro
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 flex-1">
          {/* Empezar Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button
              onClick={handleStart}
              className="w-full py-7 text-lg font-semibold rounded-2xl shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              Empezar
            </Button>
          </motion.div>

          {/* Continuar Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button
              onClick={handleContinue}
              variant="outline"
              className="w-full py-7 text-lg font-semibold rounded-2xl border-2 border-blue-500/50 bg-blue-950/30 text-white hover:bg-blue-900/40"
            >
              Continuar
            </Button>
          </motion.div>

          {/* Repasar Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button
              onClick={handleReview}
              variant="outline"
              className="w-full py-7 text-lg font-semibold rounded-2xl border-2 border-blue-500/50 bg-blue-950/30 text-white hover:bg-blue-900/40 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Repasar
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
