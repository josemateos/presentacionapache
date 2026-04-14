import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface WelcomeProps {
  userName?: string;
  currentDay?: number;
  totalDays?: number;
  registrationDate?: Date;
  reviewPendingCount?: number;
}

const MaterialIcon = ({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Welcome = ({
  userName = "Carlos",
  currentDay = 1,
  totalDays = 90,
  registrationDate = new Date(),
  reviewPendingCount = 3,
}: WelcomeProps) => {
  const navigate = useNavigate();
  const today = new Date();
  const regDate = new Date(registrationDate);
  regDate.setDate(regDate.getDate() - 7);
  const diffTime = Math.abs(today.getTime() - regDate.getTime());
  const daysSinceRegistration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatDate = (date: Date) => {
    const formatted = date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handleStart = () => navigate("/dashboard");
  const handleContinue = () => navigate("/vocabulario-dia-1");
  const handleReview = () => navigate("/dashboard");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0d1b2a 60%, #0a0a1a 100%)",
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            <MaterialIcon name="auto_awesome" className="text-white text-lg" filled />
          </div>
          <span
            className="text-sm font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c4b5fd" }}
          >
            APACHE
          </span>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(124, 58, 237, 0.15)" }}>
          <MaterialIcon name="account_circle" className="text-[#c4b5fd] text-xl" />
        </button>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col px-5 pb-6"
      >
        {/* Welcome Section */}
        <div className="mt-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <MaterialIcon name="psychology_alt" className="text-[#a855f7] text-xl" />
            <MaterialIcon name="star" className="text-amber-400 text-sm" filled />
          </div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "'Cinzel', serif", color: "#e9e5f5" }}
          >
            ¡Saludos, {userName}!
          </h1>
          <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: "#a78bfa" }}>
            Tu Senda Espiritual
          </p>

          <div className="space-y-1.5">
            <p className="text-sm" style={{ color: "#c4b5fd" }}>
              <span className="font-semibold" style={{ color: "#818cf8" }}>Luna {currentDay}</span> de {totalDays}
            </p>
            <p className="text-xs" style={{ color: "#8b7faa" }}>
              {formatDate(today)}
            </p>
            <p className="text-xs" style={{ color: "#8b7faa" }}>
              <span className="font-semibold" style={{ color: "#fbbf24" }}>{daysSinceRegistration} soles</span> desde tu despertar
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 flex-1">
          {/* Empezar Ritual */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={handleStart}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%)",
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.3)",
            }}
          >
            <MaterialIcon name="auto_fix_high" className="text-lg" />
            Empieza tu Ritual
          </motion.button>

          {/* Continuar */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2"
            style={{
              background: "rgba(124, 58, 237, 0.08)",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              color: "#c4b5fd",
            }}
          >
            <MaterialIcon name="play_arrow" className="text-lg" />
            Continuar
          </motion.button>

          {/* Repasar */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={handleReview}
            className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 relative"
            style={{
              background: "rgba(124, 58, 237, 0.08)",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              color: "#c4b5fd",
            }}
          >
            <MaterialIcon name="replay" className="text-lg" />
            Repasar
            {reviewPendingCount > 0 && (
              <span
                className="absolute top-3 right-4 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
              >
                {reviewPendingCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: "rgba(124, 58, 237, 0.06)",
              border: "1px solid rgba(124, 58, 237, 0.15)",
            }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#8b7faa" }}>
              Nivel
            </p>
            <p className="text-sm font-semibold" style={{ color: "#c4b5fd" }}>
              Aprendiz
            </p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: "rgba(124, 58, 237, 0.06)",
              border: "1px solid rgba(124, 58, 237, 0.15)",
            }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#8b7faa" }}>
              Energía
            </p>
            <p className="text-sm font-semibold" style={{ color: "#a855f7" }}>
              80%
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
