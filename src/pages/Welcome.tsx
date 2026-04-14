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
        fontFamily: "'Manrope', sans-serif",
        background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 40%, #0d1b2a 70%, #0a0a1a 100%)",
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            <MaterialIcon name="auto_awesome" className="text-white text-sm" filled />
          </div>
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c4b5fd" }}
          >
            APACHE
          </span>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(124, 58, 237, 0.15)" }}
        >
          <MaterialIcon name="account_circle" className="text-[#c4b5fd] text-xl" />
        </button>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center px-5 pb-8"
      >
        {/* Hero Icon */}
        <div className="mt-6 mb-5 relative">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(168, 85, 247, 0.15))",
              border: "2px solid rgba(124, 58, 237, 0.4)",
              boxShadow: "0 0 40px rgba(124, 58, 237, 0.2), inset 0 0 30px rgba(124, 58, 237, 0.1)",
            }}
          >
            <MaterialIcon name="psychology_alt" className="text-[#c4b5fd] text-5xl" />
          </div>
          {/* Star badge */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              border: "2px solid #1a0a2e",
            }}
          >
            <MaterialIcon name="star" className="text-amber-400 text-sm" filled />
          </div>
        </div>

        {/* Welcome Text */}
        <h1
          className="text-2xl font-bold mb-1 text-center"
          style={{ fontFamily: "'Cinzel', serif", color: "#e9e5f5" }}
        >
          ¡Saludos, {userName}!
        </h1>
        <p
          className="text-[10px] uppercase tracking-[0.2em] mb-4 text-center"
          style={{ color: "#a78bfa" }}
        >
          Tu Senda Espiritual
        </p>

        {/* Info */}
        <div className="text-center space-y-1 mb-8">
          <p className="text-base font-semibold" style={{ color: "#c4b5fd" }}>
            Luna <span style={{ color: "#818cf8" }}>{currentDay}</span> de {totalDays}
          </p>
          <p className="text-xs italic" style={{ color: "#8b7faa" }}>
            {formatDate(today)}
          </p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "#6b5f8a" }}>
            <span className="font-semibold" style={{ color: "#fbbf24" }}>{daysSinceRegistration} soles</span>{" "}
            desde tu despertar
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 flex-1">
          {/* Empieza tu Ritual */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={handleStart}
            className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2"
            style={{
              background: "rgba(124, 58, 237, 0.12)",
              border: "1.5px solid rgba(124, 58, 237, 0.5)",
              color: "#e9e5f5",
              boxShadow: "0 4px 20px rgba(124, 58, 237, 0.15)",
            }}
          >
            <MaterialIcon name="auto_fix_high" className="text-base" />
            Empieza tu Ritual
          </motion.button>

          {/* Continuar & Repasar row */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              onClick={handleContinue}
              className="py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5"
              style={{
                background: "rgba(124, 58, 237, 0.08)",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                color: "#c4b5fd",
              }}
            >
              <MaterialIcon name="play_arrow" className="text-xl" />
              <span className="text-xs font-semibold uppercase tracking-wider">Continuar</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              onClick={handleReview}
              className="py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 relative"
              style={{
                background: "rgba(124, 58, 237, 0.08)",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                color: "#c4b5fd",
              }}
            >
              <MaterialIcon name="replay" className="text-xl" />
              <span className="text-xs font-semibold uppercase tracking-wider">Repasar</span>
              {reviewPendingCount > 0 && (
                <span
                  className="absolute top-2 right-3 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
                >
                  {reviewPendingCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full flex justify-center gap-10 mt-6">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#6b5f8a" }}>
              Nivel
            </p>
            <p className="text-sm font-semibold italic" style={{ color: "#c4b5fd" }}>
              Aprendiz
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#6b5f8a" }}>
              Energía
            </p>
            <p className="text-sm font-bold" style={{ color: "#a855f7" }}>
              80%
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
