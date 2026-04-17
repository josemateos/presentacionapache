import { useNavigate } from "react-router-dom";

const MaterialIcon = ({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Invitation2 = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-tertiary/30 selection:text-tertiary overflow-x-hidden">
      <main className="flex-grow px-6 pt-8 pb-12 max-w-md mx-auto w-full relative">
        {/* Hero Section */}
        <header className="mb-12 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface leading-tight relative">
            Una solución basada en tu <span className="italic" style={{ color: '#2fd9f4' }}>idioma nativo</span>, el Español, no en la memoria.
          </h1>
        </header>

        {/* The Trilogy Module */}
        <section className="space-y-6 relative">
          <div className="absolute left-6 top-10 bottom-10 opacity-30" style={{ background: "linear-gradient(to bottom, transparent, #2fd9f4 20%, #2fd9f4 80%, transparent)", width: "2px" }} />

          {/* 1. Español Perfecto */}
          <div className="relative pl-12">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-on-surface/20 border border-on-surface/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-on-surface" />
            </div>
            <div className="bg-surface-container-high rounded-xl p-5 border border-white/20 shadow-lg">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#ff2d87' }}>Español Perfecto</label>
              <p className="text-xl font-medium tracking-tight" style={{ color: '#ff2d87' }}>Me gusta ir a la playa en verano.</p>
            </div>
          </div>

          {/* 2. Apache Simple */}
          <div className="relative pl-12">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary shadow-[0_0_10px_rgba(251,191,36,0.5)] flex items-center justify-center">
              <MaterialIcon name="psychology" className="text-[10px] text-on-secondary font-black" />
            </div>
            <div className="bg-surface-container-high backdrop-blur-xl rounded-xl p-5 border border-white/20 border-l-4 border-l-secondary shadow-xl">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">Apache Simple</label>
              <p className="text-xl font-headline font-bold text-secondary-fixed italic tracking-tight">Yo gustar ir la playa en verano.</p>
            </div>
          </div>

          {/* 3. Inglés Apache */}
          <div className="relative pl-12">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <MaterialIcon name="translate" className="text-[10px] text-on-primary-fixed" />
            </div>
            <div className="bg-surface-container-high rounded-xl p-5 border border-white/20 shadow-lg">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Inglés Apache</label>
              <p className="text-xl font-medium text-primary-fixed tracking-tight">I like go the beach in summer.</p>
            </div>
          </div>

          {/* 4. Inglés Perfecto */}
          <div className="relative pl-12">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-tertiary flex items-center justify-center">
              <MaterialIcon name="auto_stories" className="text-[10px] text-on-tertiary" filled />
            </div>
            <div className="bg-surface-container-high rounded-xl p-5 border border-white/20 shadow-lg">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary mb-2 block">Inglés Perfecto</label>
              <p className="text-xl font-medium text-tertiary-fixed tracking-tight">I like to go to the beach in summer.</p>
            </div>
          </div>
        </section>

        {/* Explanatory Panel */}
        <section className="mt-12 bg-surface-container-high rounded-2xl p-6 border border-white/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MaterialIcon name="architecture" className="text-6xl" />
          </div>
          <h3 className="font-headline text-lg font-bold mb-3 text-primary tracking-tight">¿Por qué funciona?</h3>
          <p className="text-on-surface-variant leading-relaxed text-sm">
            <span className="text-on-surface font-semibold">Estructura Directa.</span> El Sistema Apache reordena las palabras para que tu cerebro asocie español-inglés de forma natural. Sin rodeos.
          </p>
          <div className="mt-6 flex items-center gap-3 py-3 px-4 bg-tertiary-container/30 rounded-lg border-l-2 border-tertiary">
            <MaterialIcon name="tips_and_updates" className="text-tertiary text-xl" />
            <p className="text-xs text-tertiary-fixed-dim font-medium uppercase tracking-wider">Revelando la lógica interna</p>
          </div>
        </section>

        {/* Primary CTA */}
        <div className="mt-12 mb-8">
          <button
            onClick={() => navigate("/invitacion-3")}
            className="w-full py-5 text-white font-headline font-extrabold text-lg rounded-2xl active:scale-[0.98] transition-all duration-200 uppercase tracking-[0.2em]"
            style={{ background: "linear-gradient(90deg, #e91e63 0%, #9c27b0 100%)", boxShadow: "0 8px 32px rgba(233, 30, 99, 0.4)" }}
          >
            CONTINUAR
          </button>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 -right-20 w-64 h-64 bg-tertiary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
};

export default Invitation2;
