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
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: "radial-gradient(ellipse at 50% 40%, #2a1854 0%, #1a0e3e 30%, #100D2B 60%, #0a0818 100%)",
      }}
    >
      {/* Ambient glow effects */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Header - Glassmorphism */}
      <header
        className="flex justify-between items-center px-5 py-4 relative z-10"
        style={{
          background: "rgba(16, 13, 43, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            <MaterialIcon name="auto_awesome" className="text-white text-sm" filled />
          </div>
          <span
            className="text-xs font-bold tracking-[0.25em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c4b5fd" }}
          >
            APACHE
          </span>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(139, 92, 246, 0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          <MaterialIcon name="account_circle" className="text-[#c4b5fd] text-xl" />
        </button>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center px-5 pb-8 relative z-10"
      >
        {/* Hero Avatar with concentric rings */}
        <div className="mt-8 mb-6 relative">
          {/* Outer glow ring */}
          <div
            className="absolute inset-[-18px] rounded-full"
            style={{
              border: "1px solid rgba(139, 92, 246, 0.15)",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.08)",
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute inset-[-8px] rounded-full"
            style={{
              border: "1.5px solid rgba(139, 92, 246, 0.25)",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.1)",
            }}
          />
          {/* Main avatar circle */}
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(88, 28, 199, 0.2))",
              border: "2px solid rgba(139, 92, 246, 0.5)",
              boxShadow:
                "0 0 40px rgba(139, 92, 246, 0.25), 0 0 80px rgba(139, 92, 246, 0.1), inset 0 0 30px rgba(139, 92, 246, 0.15)",
            }}
          >
            <MaterialIcon name="psychology_alt" className="text-[#c4b5fd] text-5xl" />
          </div>
          {/* Star badge - bottom right */}
          <div
            className="absolute -bottom-1 right-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              border: "2.5px solid #100D2B",
              boxShadow: "0 0 12px rgba(124, 58, 237, 0.4)",
            }}
          >
            <MaterialIcon name="star" className="text-amber-400 text-base" filled />
          </div>
        </div>

        {/* Welcome Text - Neon effect */}
        <h1
          className="text-[22px] font-bold mb-1 text-center uppercase tracking-wide"
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#e2d4f5",
            textShadow:
              "0 0 10px rgba(192, 132, 252, 0.6), 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
          }}
        >
          ¡Saludos,{" "}
          <span
            style={{
              color: "#d8b4fe",
              textShadow:
                "0 0 10px rgba(216, 180, 254, 0.8), 0 0 20px rgba(192, 132, 252, 0.6), 0 0 40px rgba(168, 85, 247, 0.4), 0 0 60px rgba(139, 92, 246, 0.3)",
            }}
          >
            {userName}
          </span>
          !
        </h1>
        <p
          className="text-[10px] uppercase tracking-[0.25em] mb-5 text-center font-semibold"
          style={{ color: "#a78bfa" }}
        >
          Tu Senda Espiritual
        </p>

        {/* Info */}
        <div className="text-center space-y-1 mb-8">
          <p className="text-base font-bold" style={{ color: "#c4b5fd" }}>
            Luna <span style={{ color: "#818cf8" }}>{currentDay}</span> de {totalDays}
          </p>
          <p className="text-xs italic" style={{ color: "#8b7faa" }}>
            {formatDate(today)}
          </p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "#6b5f8a" }}>
            <span className="font-bold" style={{ color: "#fbbf24" }}>
              {daysSinceRegistration} soles
            </span>{" "}
            desde tu despertar
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 flex-1">
          {/* Empieza tu Ritual - CTA principal con borde brillante */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={handleStart}
            className="w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(88, 28, 199, 0.5), rgba(124, 58, 237, 0.3), rgba(67, 20, 163, 0.5))",
              border: "1.5px solid rgba(168, 85, 247, 0.6)",
              color: "#f0e6ff",
              boxShadow:
                "0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(124, 58, 237, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Shine sweep effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(168, 85, 247, 0.15) 45%, rgba(168, 85, 247, 0.25) 50%, rgba(168, 85, 247, 0.15) 55%, transparent 60%)",
              }}
            />
            <MaterialIcon name="auto_fix_high" className="text-lg relative z-10" />
            <span className="relative z-10">Empieza tu Ritual</span>
          </motion.button>

          {/* Continuar & Repasar - Glassmorphism */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              onClick={handleContinue}
              className="py-5 rounded-2xl flex flex-col items-center justify-center gap-2"
              style={{
                background: "rgba(16, 13, 43, 0.5)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                color: "#c4b5fd",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <MaterialIcon name="play_arrow" className="text-2xl" />
              <span className="text-xs font-bold uppercase tracking-[0.15em]">Continuar</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              onClick={handleReview}
              className="py-5 rounded-2xl flex flex-col items-center justify-center gap-2 relative"
              style={{
                background: "rgba(16, 13, 43, 0.5)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                color: "#c4b5fd",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <MaterialIcon name="replay" className="text-2xl" />
              <span className="text-xs font-bold uppercase tracking-[0.15em]">Repasar</span>
              {reviewPendingCount > 0 && (
                <span
                  className="absolute top-2.5 right-3 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #db2777)",
                    boxShadow: "0 0 8px rgba(236, 72, 153, 0.5)",
                  }}
                >
                  {reviewPendingCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full flex justify-center gap-12 mt-6">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider mb-0.5 font-semibold" style={{ color: "#6b5f8a" }}>
              Nivel
            </p>
            <p className="text-sm font-bold italic" style={{ color: "#c4b5fd" }}>
              Aprendiz
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider mb-0.5 font-semibold" style={{ color: "#6b5f8a" }}>
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
