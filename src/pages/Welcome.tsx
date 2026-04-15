import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronRight, BookOpen, TrendingUp, RotateCcw, Zap, Moon, Sun, Sparkles, Bell, Flame, Compass, BookText, Target, ChefHat } from "lucide-react";

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
  reviewPendingCount = 5,
}: WelcomeProps) => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>("vocabulary");

  const today = new Date();
  const regDate = new Date(registrationDate);
  regDate.setDate(regDate.getDate() - 8);
  const diffTime = Math.abs(today.getTime() - regDate.getTime());
  const daysSinceRegistration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} de ${monthNames[today.getMonth()]} de ${today.getFullYear()}`;

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handleSelectVocabularyDay = (day: number) => {
    const routes: Record<number, string> = {
      1: "/vocabulario-dia-1",
      2: "/vocabulario-dia-2",
      3: "/vocabulario-dia-3",
    };
    if (routes[day]) navigate(routes[day]);
  };

  const vocabDays = [
    { day: 1, icon: Moon, label: "DÍA 1", active: true },
    { day: 2, icon: Sun, label: "DÍA 2", active: false },
    { day: 3, icon: Sparkles, label: "DÍA 3", active: false },
  ];

  return (
    <div className="min-h-screen pb-32 overflow-x-hidden bg-background text-foreground">
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 w-full flex justify-between items-center px-6 py-4 bg-background/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center border border-white/10 shadow-lg overflow-hidden">
            <span className="text-white font-bold text-xl font-headline">A</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-extrabold tracking-tight text-white font-headline leading-none">APACHE</h1>
            <span className="text-[10px] font-bold text-accent tracking-widest uppercase mt-0.5">RANK: INITIATE</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/10">
          <Bell className="w-5 h-5 text-white" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-24 px-6 space-y-8">
        {/* Header Section */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-headline font-extrabold text-on-surface">
              ¡Bienvenido, {userName}!
            </h2>
            <div className="flex flex-col gap-1">
              <p className="text-on-surface/60 font-body text-lg">
                Hoy: Día <span className="text-accent font-bold">{currentDay}</span> de {totalDays}
              </p>
              <p className="text-on-surface/40 font-body text-sm">{dateStr}</p>
              <p className="text-on-surface/60 font-body text-sm mt-1">
                Han transcurrido <span className="text-secondary font-bold">{daysSinceRegistration} días</span> desde tu registro
              </p>
            </div>
          </div>
        </section>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {/* 1. VOCABULARIO DEL DÍA */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection("vocabulary")}
              className="w-full flex items-center justify-between p-5 rounded-2xl cyan-neon-gradient text-accent-foreground font-headline font-extrabold text-sm tracking-tight neon-glow-tertiary"
            >
              <span>Empezar Vocabulario del Día</span>
              {openSection === "vocabulary" ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            <AnimatePresence>
              {openSection === "vocabulary" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {vocabDays.map((vd) => {
                      const Icon = vd.icon;
                      return (
                        <button
                          key={vd.day}
                          onClick={() => handleSelectVocabularyDay(vd.day)}
                          className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                            vd.active
                              ? "bg-surface-container-highest border-2 border-accent shadow-[0_0_15px_hsl(187_90%_57%/0.3)]"
                              : "bg-surface-container-low border border-white/5 opacity-60 hover:opacity-80"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-1 ${vd.active ? "text-accent" : "text-on-surface/40"}`} />
                          <span className={`text-[10px] font-bold ${vd.active ? "text-on-surface" : "text-on-surface/40"}`}>
                            {vd.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Frases del Día */}
          <AccordionButton
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            label="MIS FRASES DEL DÍA"
            onClick={() => navigate(`/phrases-day?day=${currentDay}`)}
            chevron="down"
          />

          {/* 3. Mi Progreso Detallado */}
          <AccordionButton
            icon={<TrendingUp className="w-5 h-5 text-accent" />}
            label="Mi Progreso Detallado"
            onClick={() => {}}
            chevron="right"
          />

          {/* 4. Mi Repaso */}
          <AccordionButton
            icon={<RotateCcw className="w-5 h-5 text-primary" />}
            label="Mi Repaso"
            onClick={() => navigate("/review-day?day=1")}
            chevron="right"
            badge={
              reviewPendingCount > 0
                ? `${reviewPendingCount} PENDIENTES`
                : undefined
            }
          />

          {/* 5. Auxiliares Clave */}
          <div className="pt-2">
            <AccordionButton
              icon={<Zap className="w-5 h-5 text-secondary" />}
              label="Auxiliares Clave"
              onClick={() => navigate("/auxiliaries")}
              chevron="right"
              trailingIcon={
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-accent-foreground animate-pulse">
                  <Zap className="w-3 h-3" />
                </span>
              }
            />
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-background/95 backdrop-blur-2xl border-t border-white/5 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col items-center justify-center text-accent cursor-pointer">
          <Flame className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface/40 hover:text-primary transition-all cursor-pointer">
          <Compass className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-center justify-center text-secondary transition-all cursor-pointer">
          <BookText className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface/40 hover:text-primary transition-all cursor-pointer">
          <Target className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface/40 hover:text-primary transition-all cursor-pointer">
          <ChefHat className="w-6 h-6" />
        </div>
      </nav>
    </div>
  );
};

interface AccordionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  chevron: "down" | "right";
  badge?: string;
  trailingIcon?: React.ReactNode;
}

const AccordionButton = ({ icon, label, onClick, chevron, badge, trailingIcon }: AccordionButtonProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 rounded-2xl bg-surface-container-low border border-white/5 text-on-surface/80 font-headline font-semibold text-sm hover:bg-surface-container-high transition-all"
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="uppercase tracking-wide">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && (
        <span className="bg-primary/20 text-primary text-[9px] font-bold px-2 py-1 rounded-full tracking-widest">
          {badge}
        </span>
      )}
      {trailingIcon}
      {chevron === "right" ? (
        <ChevronRight className="w-5 h-5 opacity-40" />
      ) : (
        <ChevronDown className="w-5 h-5 opacity-40" />
      )}
    </div>
  </button>
);

export default Welcome;
