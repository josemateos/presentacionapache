import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles, RotateCcw, GraduationCap, LoaderCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/dashboard/BottomNav";

interface Connector {
  english: string;
  spanish: string;
}

const CONNECTORS: Connector[] = [
  { english: "so", spanish: "Entonces / Así que" },
  { english: "because", spanish: "Porque" },
  { english: "could", spanish: "Podía / Podría" },
  { english: "by", spanish: "Por (autor)" },
  { english: "for", spanish: "Por / Para" },
  { english: "to", spanish: "A / Para" },
  { english: "may / might", spanish: "Puede que" },
  { english: "can", spanish: "Poder" },
  { english: "must", spanish: "Debes" },
  { english: "should", spanish: "Debería" },
  { english: "if", spanish: "Si (condicional)" },
];

const TOTAL_STEPS = 4; // pasos 2..5 del flujo de LearnConnector

const ConectoresCausaEfecto = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const loadState = () => {
    try {
      const c = localStorage.getItem("completedCausaEfecto");
      setCompleted(c ? JSON.parse(c) : []);
    } catch {
      setCompleted([]);
    }
    try {
      const p = localStorage.getItem("causaEfectoProgress");
      setProgressMap(p ? JSON.parse(p) : {});
    } catch {
      setProgressMap({});
    }
  };

  useEffect(() => {
    loadState();
    const onVis = () => { if (!document.hidden) loadState(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", loadState);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", loadState);
    };
  }, []);

  const handleSelect = (connector: Connector) => {
    navigate("/learn-connector", { state: { connector, source: "causa-efecto" } });
  };

  const handleReset = () => {
    localStorage.removeItem("completedCausaEfecto");
    localStorage.removeItem("causaEfectoProgress");
    setCompleted([]);
    setProgressMap({});
    toast({
      title: "Progreso reiniciado",
      description: "Todos los conectores están listos para aprender de nuevo",
    });
  };

  const learnedCount = completed.length;
  const inProgressCount = CONNECTORS.filter(
    c => !completed.includes(c.english) && progressMap[c.english] && progressMap[c.english] > 2
  ).length;
  const pendingCount = CONNECTORS.length - learnedCount - inProgressCount;
  const progress = (learnedCount / CONNECTORS.length) * 100;

  const completionMessage = learnedCount === CONNECTORS.length ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 px-4 glass-card border border-white/10 rounded-2xl"
    >
      <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary animate-pulse-subtle" />
      <h3 className="text-xl font-bold mb-2 text-primary">¡Felicitaciones!</h3>
      <p className="text-on-surface/70">Has completado los Conectores Causa-Efecto</p>
    </motion.div>
  ) : null;

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col selection:bg-accent/30">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-low/90 backdrop-blur-xl shadow-2xl border-b border-white/5">
        <div className="flex items-center px-6 py-5 w-full relative max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/auxiliaries")}
            className="absolute left-4 text-primary hover:bg-surface-container-high rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="mx-auto font-headline text-xl md:text-2xl font-extrabold tracking-tight text-primary">
            Conectores Causa-Efecto
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setResetDialogOpen(true)}
            title="Reiniciar progreso"
            className="absolute right-4 text-on-surface/70 hover:bg-surface-container-high rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex-grow pt-28 pb-32 px-6 max-w-2xl mx-auto w-full space-y-8">
        {/* Progreso General */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
          <div className="relative glass-card rounded-3xl p-6 border border-white/10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="font-headline text-2xl font-extrabold tracking-tight">
                  Progreso General
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black gradient-text-primary">{learnedCount}</span>
                <span className="text-on-surface/60 font-bold"> / {CONNECTORS.length}</span>
              </div>
            </div>
            <div className="w-full h-3 bg-black rounded-full overflow-hidden p-[2px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(330 81% 70%) 100%)" }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 items-center text-[10px] font-semibold uppercase tracking-tighter text-on-surface/60">
              <span className="flex items-center gap-1 justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {learnedCount} APRENDIDOS
              </span>
              <span className="flex items-center gap-1 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> {inProgressCount} EN PROCESO
              </span>
              <span className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {pendingCount} PENDIENTES
              </span>
            </div>
          </div>
        </motion.section>

        {completionMessage}

        {/* Connector List */}
        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {CONNECTORS.map((connector, index) => {
              const isLearned = completed.includes(connector.english);
              const stepProgress = progressMap[connector.english] || 0;
              const isInProgress = !isLearned && stepProgress > 2;
              const status: "learned" | "inProgress" | "pending" = isLearned
                ? "learned"
                : isInProgress
                ? "inProgress"
                : "pending";

              // step 2..5 → 0..3 completed steps shown as 0..100%
              const pct = isInProgress
                ? Math.min(100, Math.round(((stepProgress - 2) / TOTAL_STEPS) * 100))
                : 0;

              return (
                <motion.div
                  key={connector.english}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className={`bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 rounded-[2rem] p-6 group border ${
                    status === "inProgress"
                      ? "border-secondary/30 shadow-[0_0_25px_hsl(var(--secondary)/0.15)]"
                      : "border-white/5"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6 gap-3">
                    <h4 className="font-headline text-2xl md:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {connector.english}
                    </h4>

                    {status === "learned" && (
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        Aprendido
                      </div>
                    )}
                    {status === "inProgress" && (
                      <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold border border-secondary/20 shrink-0">
                        <LoaderCircle className="w-3.5 h-3.5" />
                        En curso
                      </div>
                    )}
                    {status === "pending" && (
                      <div className="flex items-center gap-1.5 bg-surface-container-highest text-on-surface/70 px-3 py-1 rounded-full text-xs font-bold border border-white/5 shrink-0">
                        Pendiente
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    {status === "learned" ? (
                      <Button
                        className="flex items-center gap-2 bg-surface-container-highest text-on-surface font-bold py-3 px-6 rounded-xl active:scale-95 transition-all hover:bg-surface-bright"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(connector);
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Repasar
                      </Button>
                    ) : status === "inProgress" ? (
                      <>
                        <div className="flex-1 h-2.5 bg-black rounded-full overflow-hidden border border-white/20 shadow-inner">
                          <div
                            className="h-full bg-secondary rounded-full shadow-[0_0_8px_hsl(var(--secondary)/0.5)] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <Button
                          className="flex items-center gap-2 bg-secondary text-secondary-foreground font-bold py-3 px-6 rounded-xl active:scale-95 transition-all hover:brightness-110 shadow-lg shadow-secondary/20 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(connector);
                          }}
                        >
                          <Rocket className="w-4 h-4" />
                          Concluir
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full flex items-center justify-center gap-2 text-white font-black py-4 px-8 rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20"
                        style={{ background: "linear-gradient(135deg, hsl(285 55% 45%) 0%, hsl(330 70% 50%) 100%)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(connector);
                        }}
                      >
                        <GraduationCap className="w-5 h-5" />
                        Aprender
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
          <Sparkles className="w-8 h-8 text-primary" />
          <p className="text-xs uppercase tracking-[0.3em] text-on-surface/60">
            Sigue descodificando el camino
          </p>
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isPremium={true} />

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Borrar todos los avances?</AlertDialogTitle>
            <AlertDialogDescription>
              Se reiniciará el progreso de todos los conectores Causa-Efecto. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, conservar avances</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, borrar avances
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConectoresCausaEfecto;
