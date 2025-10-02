import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotateCcw, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const handleStartVocabulary = () => {
    navigate("/vocabulario-dia-1");
  };

  const handlePhrases = () => {
    navigate("/dashboard");
  };

  const handleReview = () => {
    navigate("/dashboard");
  };

  const handleAuxiliaries = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] via-[#2d1b4e] to-[#1a1f3a] flex flex-col p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col max-w-md mx-auto w-full"
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
          {/* Start Vocabulary - Gradient Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button
              onClick={handleStartVocabulary}
              className="w-full py-7 text-lg font-semibold rounded-2xl shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              Empezar Vocabulario del Día {currentDay}
            </Button>
          </motion.div>

          {/* Phrases - Outlined Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button
              onClick={handlePhrases}
              variant="outline"
              className="w-full py-7 text-lg font-semibold rounded-2xl border-2 border-blue-500/50 bg-blue-950/30 text-white hover:bg-blue-900/40"
            >
              MIS FRASES DEL DIA
            </Button>
          </motion.div>

          {/* Review - Outlined Button with Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="relative"
          >
            <Button
              onClick={handleReview}
              variant="outline"
              className="w-full py-7 text-lg font-semibold rounded-2xl border-2 border-blue-500/50 bg-blue-950/30 text-white hover:bg-blue-900/40 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              MI REPASO
            </Button>
            {reviewPendingCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center rounded-full bg-red-500 text-white font-bold"
              >
                {reviewPendingCount}
              </Badge>
            )}
          </motion.div>

          {/* Auxiliaries - Yellow Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button
              onClick={handleAuxiliaries}
              className="w-full py-7 text-lg font-semibold rounded-2xl shadow-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-0 flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              AUXILIARES CLAVE
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
