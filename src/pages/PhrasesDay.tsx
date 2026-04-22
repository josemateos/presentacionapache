import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Phrase {
  id: number;
  english: string;
  spanish: string;
  learned: boolean;
}

const phrasesData: Record<number, Phrase[]> = {
  1: [
    { id: 1, english: "I want TO buy fresh fruits at the market", spanish: "Quiero comprar frutas frescas en el mercado", learned: false },
    { id: 2, english: "I like TO read a book before sleepING", spanish: "Me gusta leer un libro antes de dormir", learned: false },
    { id: 3, english: "You have TO go visit us", spanish: "Tienes que ir a visitarnos", learned: false },
    { id: 4, english: "We want TO invite you to eat tomorrow", spanish: "Queremos invitarte a comer mañana", learned: false },
    { id: 5, english: "I have AN important work meeting this afternoon", spanish: "Esta tarde tengo una reunión de trabajo importante", learned: false },
  ],
  2: [
    { id: 6, english: "They are goING TO ask us TO go", spanish: "Van a pedirnos que vayamos", learned: false },
    { id: 7, english: "I WILL visit my family next weekend", spanish: "El próximo fin de semana visitaré a mi familia", learned: false },
    { id: 8, english: "I need TO practice English every day", spanish: "Necesito practicar inglés todos los días", learned: false },
    { id: 9, english: "She is always affectionate", spanish: "Ella siempre es cariñosa", learned: false },
    { id: 10, english: "Every morning I drink coffee AT work", spanish: "Todas las mañanas tomo café en el trabajo", learned: false },
  ],
  3: [
    { id: 11, english: "My house is near the school", spanish: "Mi casa está cerca de la escuela", learned: false },
    { id: 12, english: "I am a student and I work on weekends", spanish: "Soy estudiante y trabajo los fines de semana", learned: false },
    { id: 13, english: "He always leaveS in his car", spanish: "El siempre se va en su coche", learned: false },
    { id: 14, english: "I am from Mexico but I currently live in Australia", spanish: "Soy de Mexico pero actualmente vivo en Australia", learned: false },
    { id: 15, english: "I have TO take the car to the workshop", spanish: "Tengo que llevar el automovil al taller", learned: false },
  ],
};

const PhrasesDay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const day = parseInt(searchParams.get("day") || "1");

  const [phrases, setPhrases] = useState<Phrase[]>([]);

  useEffect(() => {
    const savedKey = `phrases_day${day}_progress`;
    const saved = localStorage.getItem(savedKey);

    if (saved) {
      try {
        const savedArr: Phrase[] = JSON.parse(saved);
        const base = phrasesData[day] || [];
        const merged = base.map((b) => {
          const existing = savedArr.find((s) => s.id === b.id);
          return existing ? { ...b, learned: !!existing.learned } : b;
        });
        setPhrases(merged);
      } catch {
        setPhrases(phrasesData[day] || []);
      }
    } else {
      setPhrases(phrasesData[day] || []);
    }
  }, [day]);

  useEffect(() => {
    if (phrases.length > 0) {
      const savedKey = `phrases_day${day}_progress`;
      localStorage.setItem(savedKey, JSON.stringify(phrases));
    }
  }, [phrases, day]);

  const learnedCount = phrases.filter((p) => p.learned).length;
  const progress = phrases.length > 0 ? (learnedCount / phrases.length) * 100 : 0;

  const handleLearnPhrase = (phrase: Phrase) => {
    navigate(
      `/learn-phrase?id=${phrase.id}&day=${day}&english=${encodeURIComponent(phrase.english)}&spanish=${encodeURIComponent(phrase.spanish)}`
    );
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-accent/30">


      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/70 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10 text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Inicio</span>
          </Button>

          <h1 className="font-headline text-lg md:text-xl font-extrabold tracking-tight text-foreground">
            Frases del Día {day}
          </h1>

          <div className="w-20" />
        </div>
      </header>

      <main className="relative flex-grow container mx-auto px-4 py-6 pb-24 max-w-4xl">
        {/* Progress / Codex card */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group mb-8"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
          <div className="relative glass-card rounded-3xl p-6 border border-white/10">
            <div className="flex justify-between items-end mb-4">
              <h2 className="font-headline text-2xl font-extrabold tracking-tight text-foreground">
                Progreso General
              </h2>
              <div className="text-right">
                <span className="text-3xl font-black gradient-text-primary">{learnedCount}</span>
                <span className="text-muted-foreground font-bold"> / {phrases.length}</span>
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

            <div className="mt-4 grid grid-cols-3 items-center text-[10px] font-semibold uppercase tracking-tighter text-muted-foreground">
              <span className="flex items-center gap-1 justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {learnedCount} APRENDIDAS
              </span>
              <span className="flex items-center gap-1 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> 0 EN PROCESO
              </span>
              <span className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {phrases.length - learnedCount} PENDIENTES
              </span>
            </div>
          </div>
        </motion.div>

        {/* Phrases list */}
        <div className="space-y-4">
          {phrases.map((phrase, index) => (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative group"
            >
              <div
                className={`absolute -inset-0.5 rounded-3xl blur transition duration-700 ${
                  phrase.learned
                    ? "bg-gradient-to-r from-accent/60 to-primary/60 opacity-25"
                    : "bg-gradient-to-r from-primary/40 to-accent/40 opacity-0 group-hover:opacity-20"
                }`}
              />
              <button
                onClick={() => handleLearnPhrase(phrase)}
                className="relative w-full text-left glass-card rounded-3xl p-5 border border-white/10 hover:border-accent/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Index badge */}
                  <div className="shrink-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-headline font-extrabold text-base border ${
                        phrase.learned
                          ? "bg-gradient-to-br from-accent/30 to-primary/30 border-accent/50 text-accent"
                          : "bg-white/5 border-white/10 text-muted-foreground"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {phrase.learned && (
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      )}
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80">
                        {phrase.learned ? "Practicada" : "Pendiente"}
                      </span>
                    </div>

                    <p className="text-base md:text-lg font-semibold text-foreground leading-snug mb-4">
                      {phrase.spanish}
                    </p>

                    <div className="flex justify-end">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide ${
                          phrase.learned
                            ? "bg-accent/15 text-accent border border-accent/30"
                            : "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        }`}
                      >
                        {phrase.learned ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            Repasar
                          </>
                        ) : (
                          <>
                            Ir a la Frase
                            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* End of codex */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <Sparkles className="w-5 h-5 text-accent" />
          <p className="font-headline text-sm uppercase tracking-[0.3em]">
            Fin del Códice Diario
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default PhrasesDay;
