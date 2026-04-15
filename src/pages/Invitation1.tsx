import { useNavigate } from "react-router-dom";

const MaterialIcon = ({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Invitation1 = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-tertiary selection:text-on-tertiary overflow-x-hidden">
      <main className="min-h-screen pt-8 pb-12 px-6 flex flex-col max-w-md mx-auto">

        {/* Hero Title */}
        <header className="mb-8 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="inline-flex items-center gap-2 mb-4">
            <MaterialIcon name="error" className="text-error text-2xl" filled />
            <span className="text-error font-headline font-bold text-sm uppercase tracking-widest">El Círculo Vicioso</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter leading-tight relative">
            ¿Has intentado aprender inglés de <span className="text-primary italic">muchas maneras</span>... pero sigues sin obtener resultados?
          </h1>
        </header>

        {/* Problem Cards */}
        <section className="space-y-4 mb-12">
          {/* Card 1 */}
          <div className="bg-surface-container-high/60 backdrop-blur-xl rounded-xl p-5 border-l-4 border-tertiary/50 relative group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-tertiary/10 rounded-lg shrink-0">
                <MaterialIcon name="psychology" className="text-tertiary text-2xl" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface mb-1">Memorizaste palabras que no sabes usar.</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Tienes el vocabulario, pero no sabes cómo conectarlo para hablar con fluidez.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-high/60 backdrop-blur-xl rounded-xl p-5 border-l-4 border-primary/50 relative group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <MaterialIcon name="history_edu" className="text-primary text-2xl" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface mb-1">Estudiaste reglas que nunca aplicas.</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">La gramática tradicional te frena. Entiendes la teoría, pero fallas en la práctica real.</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-high/60 backdrop-blur-xl rounded-xl p-5 border-l-4 border-secondary/50 relative group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
                <MaterialIcon name="sync_problem" className="text-secondary text-2xl" filled />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface mb-1">Repites ejercicios sin aprender.</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Completas huecos mecánicamente, pero tu cerebro no está asimilando la estructura del idioma.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Revelation Section */}
        <section className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-tertiary/10 blur-2xl rounded-3xl opacity-50" />
          <div className="relative bg-surface-container-lowest/60 backdrop-blur-xl border border-outline-variant/20 p-6 rounded-2xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <MaterialIcon name="auto_awesome" className="text-tertiary text-xl" filled />
              <span className="text-tertiary font-headline font-bold text-xs uppercase tracking-[0.2em]">La Gran Revelación</span>
            </div>
            <h3 className="font-headline text-xl font-extrabold text-on-surface leading-tight mb-3">
              El problema es que nunca te han enseñado, que <span className="text-secondary">tu Español es la base</span> para aprender Inglés.
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              El sistema tradicional ignora tu mayor activo: tu lengua materna. Es hora de dejar de pelear contra tu cerebro y empezar a decodificar el lenguaje.
            </p>

            {/* Quote */}
            <div className="border-l-2 border-primary/40 pl-4 py-2">
              <p className="text-primary-fixed-dim text-sm italic font-medium leading-relaxed">
                "El conocimiento aislado es una ilusión. La estructura es el verdadero poder."
              </p>
            </div>
          </div>
        </section>

        {/* CTA Button */}
        <div className="mt-auto space-y-4">
          <button
            onClick={() => navigate("/invitacion-2")}
            className="w-full py-5 rounded-2xl text-on-primary font-headline font-extrabold text-lg tracking-wider flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #ff00ff 100%)" }}
          >
            Conocer la Solución
            <MaterialIcon name="arrow_forward" />
          </button>

          <div className="flex items-center justify-center gap-2 text-on-surface-variant/50">
            <MaterialIcon name="lock" className="text-sm" />
            <span className="text-xs tracking-wider">Acceso seguro al Oráculo Apache</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-widest border border-outline-variant/20">Metodología Probada</span>
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-widest border border-outline-variant/20">Transferencia Lingüística</span>
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-widest border border-outline-variant/20">Aprendizaje Inmersivo</span>
        </div>
      </main>

      {/* Decorative */}
      <div className="fixed top-1/4 -right-20 w-64 h-64 bg-tertiary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
};

export default Invitation1;
