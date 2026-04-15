import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, Axe, Target, Feather, Sword } from "lucide-react";

const MaterialIcon = ({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

interface WelcomeProps {
  userName?: string;
}

const Welcome = ({ userName = "Carlos" }: WelcomeProps) => {
  const navigate = useNavigate();

  const handleStart = () => navigate("/dashboard");
  const handleContinue = () => navigate("/vocabulario-dia-1");
  const handleReview = () => navigate("/dashboard");

  return (
    <div className="min-h-screen pb-32 overflow-x-hidden bg-surface text-on-surface font-body">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden shadow-[0_0_10px_hsl(42_100%_63%/0.3)]">
            <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary/30 flex items-center justify-center">
              <MaterialIcon name="shield" className="text-primary text-xl" filled />
            </div>
          </div>
          <h1 className="text-xl font-black text-secondary font-headline tracking-tighter uppercase" style={{ textShadow: "0 0 15px hsl(42 100% 63% / 0.5)" }}>
            JEFE APACHE
          </h1>
        </div>
        <div className="text-primary p-2 rounded-full hover:bg-white/5 transition-colors active:scale-90 duration-200">
          <MaterialIcon name="military_tech" className="text-2xl" />
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-[40px] font-extrabold font-headline leading-[1.1] tracking-tight text-on-surface">
            Aprende Inglés <br />
            <span className="text-accent" style={{ textShadow: "0 0 15px hsl(187 90% 57% / 0.5)" }}>
              hablando Apache
            </span>
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-[90%] opacity-90">
            Desarmamos el inglés palabra por palabra para que tu cerebro lo asimile al instante.
          </p>
        </motion.section>

        {/* Apache Oracle Visualizer */}
        <section className="flex flex-col items-center justify-center py-4 relative">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Outer Glow Aura */}
            <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl animate-pulse-subtle" />

            {/* Circular Progress Track */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                className="text-white/5"
                cx="144" cy="144" r="120"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
              />
              <circle
                cx="144" cy="144" r="120"
                fill="transparent"
                stroke="url(#goldGradientWelcome)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="754"
                strokeDashoffset="260"
                style={{ filter: "drop-shadow(0 0 8px hsl(42 100% 63% / 0.6))" }}
              />
              <defs>
                <linearGradient id="goldGradientWelcome" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(42 100% 63%)" />
                  <stop offset="100%" stopColor="hsl(45 100% 80%)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Avatar */}
            <div className="relative w-56 h-56 rounded-full glass-card flex items-center justify-center overflow-hidden border-4 border-surface-container-highest shadow-2xl z-10">
              <img
                src="/src/assets/apache-warrior.png"
                alt="Guerrero Apache"
                className="w-full h-full object-cover object-top scale-[1.4] hover:scale-[1.3] transition-transform duration-700"
              />
            </div>

            {/* Floating Milestone Badge */}
            <div className="absolute -bottom-2 z-20 animate-float">
              <div
                className="bg-secondary text-surface px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20"
                style={{ boxShadow: "0 4px 20px hsl(42 100% 63% / 0.5)" }}
              >
                Próximo Atuendo: 65%
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-1">
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.25em] block opacity-80">
              Rango Actual
            </span>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              Guerrero Iniciado
            </h3>
          </div>
        </section>

        {/* Action Grid */}
        <section className="grid grid-cols-1 gap-5">
          {/* Primary Action */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={handleStart}
            className="w-full py-5 rounded-2xl font-headline font-black text-xl tracking-wider text-surface uppercase hover:brightness-110 active:scale-95 transition-all"
            style={{
              background: "linear-gradient(90deg, hsl(265 87% 86%), #ff00ff)",
              boxShadow: "0 0 25px hsl(265 87% 86% / 0.3)",
            }}
          >
            EMPEZAR AVENTURA
          </motion.button>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              onClick={handleContinue}
              className="flex flex-col items-center justify-center py-7 px-4 rounded-2xl glass-card group transition-all hover:bg-surface-container-high/40"
            >
              <MaterialIcon name="bolt" className="text-accent mb-3 text-3xl group-hover:scale-125 transition-transform duration-300" />
              <span className="text-[11px] font-bold text-on-surface uppercase tracking-widest leading-tight text-center">
                CONTINUAR<br />CAMINO
              </span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              onClick={handleReview}
              className="flex flex-col items-center justify-center py-7 px-4 rounded-2xl glass-card group transition-all hover:bg-surface-container-high/40"
            >
              <MaterialIcon name="auto_awesome" className="text-secondary mb-3 text-3xl group-hover:scale-125 transition-transform duration-300" />
              <span className="text-[11px] font-bold text-on-surface uppercase tracking-widest leading-tight text-center">
                RITO DE<br />REPASO
              </span>
            </motion.button>
          </div>
        </section>

        {/* Meta Diaria Card */}
        <section>
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-[inset_0_0_10px_hsl(187_90%_57%/0.1)]">
                <MaterialIcon name="verified" className="text-3xl" filled />
              </div>
              <div>
                <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1 opacity-80">Meta Diaria</p>
                <p className="text-on-surface font-headline font-extrabold text-lg">12 / 20 Palabras</p>
              </div>
            </div>
            <MaterialIcon name="chevron_right" className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-2xl flex justify-around px-6 pb-8 pt-4 border-t border-white/5 shadow-[0_-15px_40px_rgba(0,0,0,0.5)] items-center">
        <NavTab icon="flame" label="HOY" />
        <NavTab icon="axe" label="REPASOS" />
        <NavTab icon="target" label="IA" center filled />
        <NavTab icon="feather" label="PERFIL" />
        <NavTab icon="sword" label="PRÁCTICA" />
      </nav>
    </div>
  );
};

const NavTab = ({ icon, label, center, filled }: { icon: string; label: string; center?: boolean; filled?: boolean }) => {
  if (center) {
    return (
      <a className="flex flex-col items-center justify-center group relative -top-4" href="#">
        <div className="bg-secondary/20 text-secondary p-4 rounded-full mb-1 shadow-[0_0_20px_hsl(42_100%_63%/0.3)] group-active:scale-95 transition-all border border-secondary/30">
          <MaterialIcon name={icon} className="text-3xl" filled={filled} />
        </div>
        <span className="font-body text-[10px] font-black tracking-widest uppercase text-secondary">{label}</span>
      </a>
    );
  }
  return (
    <a className="flex flex-col items-center justify-center group opacity-60 hover:opacity-100 transition-opacity mb-1" href="#">
      <div className="p-2 mb-1 group-active:scale-90 transition-transform">
        <MaterialIcon name={icon} className="text-2xl" />
      </div>
      <span className="font-body text-[10px] font-semibold tracking-widest uppercase">{label}</span>
    </a>
  );
};

export default Welcome;
