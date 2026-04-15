import { useNavigate } from "react-router-dom";
import apacheWarrior from "@/assets/apache-chief-index.png";

const MaterialIcon = ({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-tertiary selection:text-on-tertiary">
      {/* TopAppBar */}
      <header className="bg-background fixed top-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-b from-surface-container-low to-transparent">
          <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
            <div className="flex items-center gap-2">
              <MaterialIcon name="auto_awesome" className="text-primary text-2xl" />
              <h1 className="text-xl font-black text-primary tracking-widest font-headline uppercase">Apache System</h1>
            </div>
            <button className="hover:text-tertiary transition-colors duration-300 active:scale-95 text-on-surface">
              <MaterialIcon name="account_circle" className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-24 pb-12 px-6 flex flex-col max-w-screen-xl mx-auto overflow-x-hidden">
        {/* Hero Section */}
        <section className="mb-12 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
          <div className="absolute top-40 -right-20 w-80 h-80 bg-tertiary/10 blur-[120px] rounded-full" />

          <h2 className="font-headline text-4xl font-extrabold tracking-tighter leading-tight mb-8 relative z-10">
            ¿Has intentado aprender inglés de{" "}
            <span className="text-primary italic">muchas maneras</span>... pero sigues sin obtener resultados?
          </h2>

          {/* Bento Grid of Reality Cards */}
          <div className="grid grid-cols-1 gap-4 mb-12">
            {/* Card 1 */}
            <div className="bg-surface-container-high p-8 rounded-xl relative group hover:scale-[1.02] transition-transform duration-500">
              <div className="flex flex-col h-full justify-between gap-6">
                <MaterialIcon name="psychology" className="text-tertiary text-4xl" />
                <p className="font-headline text-xl font-bold leading-snug">
                  Memorizaste palabras que no sabes usar.
                </p>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <MaterialIcon name="spellcheck" className="text-5xl" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-high p-8 rounded-xl relative group hover:scale-[1.02] transition-transform duration-500">
              <div className="flex flex-col h-full justify-between gap-6">
                <MaterialIcon name="history_edu" className="text-primary text-4xl" />
                <p className="font-headline text-xl font-bold leading-snug">
                  Estudiaste reglas que nunca aplicas.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <MaterialIcon name="rule" className="text-5xl" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-high p-8 rounded-xl relative group hover:scale-[1.02] transition-transform duration-500">
              <div className="flex flex-col h-full justify-between gap-6">
                <MaterialIcon name="sync_problem" className="text-secondary text-4xl" filled />
                <p className="font-headline text-xl font-bold leading-snug">
                  Repites ejercicios sin aprender.
                </p>
              </div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
                <span className="text-8xl font-black">LOOP</span>
              </div>
            </div>
          </div>

          {/* Revelation Panel */}
          <div className="relative mt-16 group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-tertiary/20 blur-2xl rounded-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative bg-surface-container-lowest/60 backdrop-blur-3xl border border-outline-variant/20 p-8 rounded-3xl">
              <div className="flex flex-col items-center text-center gap-10">
                <div className="w-48 h-48 shrink-0 rounded-full overflow-hidden border-4 border-primary shadow-[0_0_30px_rgba(210,188,250,0.4)]">
                  <img
                    alt="Jefe Apache"
                    className="w-full h-full object-cover"
                    src={apacheWarrior}
                  />
                </div>
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold tracking-widest uppercase mb-4"
                    style={{ textShadow: "0 0 12px rgba(47, 217, 244, 0.6)" }}
                  >
                    Revelación
                  </span>
                  <h3 className="font-headline text-2xl font-extrabold text-on-surface leading-tight">
                    El problema es que nunca te han enseñado, que{" "}
                    <span className="text-secondary">tu Español es la base</span> para aprender Inglés.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/invitacion-2")}
            className="w-full max-w-md py-5 rounded-xl text-on-primary font-headline font-extrabold text-lg tracking-wider flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #ff00ff 100%)" }}
          >
            CONOCER LA SOLUCIÓN
            <MaterialIcon name="arrow_forward" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Index;
