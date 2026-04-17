import { useNavigate } from "react-router-dom";
import apacheLogo from "@/assets/logo_apache.png";

const MaterialIcon = ({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Invitation3 = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-tertiary selection:text-on-tertiary">
      <main className="flex-1 w-full max-w-md px-6 pt-8 pb-32 flex flex-col gap-8">
        {/* Hero Section */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-5 mb-2">
            {/* Apache Logo in purple circle */}
            <div className="w-20 h-20 rounded-full bg-[#2a1854] border border-secondary/30 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(210,188,250,0.25)] flex-shrink-0">
              <img src={apacheLogo} alt="Logo Apache" className="w-full h-full object-cover" />
            </div>

            {/* Apache Arrow pointing right */}
            <svg viewBox="0 0 110 24" className="w-24 h-6 text-secondary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Feather fletching at tail (left), pointing back-left */}
              <path d="M10 12 L2 6 M10 12 L2 18 M14 12 L6 6 M14 12 L6 18" />
              {/* Shaft */}
              <line x1="10" y1="12" x2="94" y2="12" />
              {/* Binding lines near head */}
              <line x1="86" y1="9" x2="88" y2="15" />
              {/* Arrowhead */}
              <path d="M94 4 L108 12 L94 20 Z" fill="currentColor" />
            </svg>

            {/* Medal icon in circle */}
            <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-secondary-container/10 border border-secondary/20 flex-shrink-0">
              <MaterialIcon name="military_tech" className="text-secondary text-5xl" filled />
            </div>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter leading-tight">
            Únete a los miles que lo <span className="text-tertiary italic">están logrando.</span>
          </h1>
        </header>

        {/* Bento-style Confidence Cards */}
        <section className="grid grid-cols-1 gap-4">
          {/* Card 1: Students */}
          <div className="bg-surface-variant/40 backdrop-blur-xl p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-surface-container-lowest rounded-lg">
                <MaterialIcon name="groups" className="text-tertiary" />
              </div>
              <div>
                <h3 className="text-secondary font-headline font-bold text-xl">+10,000 Estudiantes</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">logrando comunicación efectiva en tiempo récord.</p>
              </div>
            </div>
          </div>

          {/* Card 2: 90 Days */}
          <div className="bg-surface-variant/40 backdrop-blur-xl p-6 rounded-xl relative overflow-hidden group border-l-2 border-secondary/30">
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-surface-container-lowest rounded-lg">
                <MaterialIcon name="calendar_month" className="text-secondary" filled />
              </div>
              <div>
                <h3 className="text-primary font-headline font-bold text-xl">Solo 90 Días</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">para comunicarte efectivamente con nuestro método.</p>
              </div>
            </div>
          </div>

          {/* Card 3: Practical Levels */}
          <div className="bg-surface-variant/40 backdrop-blur-xl p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-32 h-1 bg-tertiary/20 group-hover:w-full transition-all duration-700" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-surface-container-lowest rounded-lg">
                <MaterialIcon name="query_stats" className="text-tertiary" />
              </div>
              <div>
                <h3 className="text-on-surface font-headline font-bold text-xl">Niveles Prácticos</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">diseñados para resultados rápidos y tangibles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <div className="flex justify-center -space-x-3 mt-4">
          <div className="w-10 h-10 rounded-full border-2 border-surface overflow-hidden">
            <img className="w-full h-full object-cover" alt="Estudiante 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjQNuhdYnFPZv64B5QPzEGwO4POCk5jkNyX2anhCgh0NVQQ8yU6LN-TdvTf-qlGLBubTld0Go-RmqBJKldKC4Ode-__fVdjq37ZmkxBX6RWbDwT4WjuiA8ZS7xREA140Rwkn1Rq-dWsKHmQdsk56IhtJRBs5LDssf6ttac0KPkUlvqQTVhHakuGmYuW1fYT-ExKwFMQ9yFlGL0ho-l5Yxn1cMq92JXYeffJXrsWe9DBtuyeOWZuR4CnzLbVgQt7EG5DdSR9h1CD9SA" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-surface overflow-hidden">
            <img className="w-full h-full object-cover" alt="Estudiante 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0t9WJybROnPJMzmDEt2ZDuwU8Wc35_KJ-4lIDGTVl-uPr5PyHPvL-wRgAxi--wMFIwvibt7XV8hdj-eF56Z-Dqdfj7SVqgYwwJbO68RZKk5lSCdXffwauRGXLaFaC0onuUoyMQL0-5VtTlHke-MDHjESMPrZ9rB9YhAtV3CEkMA6-af4Cl_sE155-9obbG7-6TJpMDWTJcPlww3Aepd_WIStagrHzASSW5CHgKpLpxqpSuZXax0O97pv9obMWoEojwNf7KYdI307Q" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-surface overflow-hidden">
            <img className="w-full h-full object-cover" alt="Estudiante 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOkjIKoyBE0Gh9NQod4QU1PFjkpCKllLWr0MC_pEnPSSswQIENUBgHK5iZxcAlaCIdkXMcEmjg0CQ2gg7cXcdZeokdBxVq7QQ5X83tHF8AbjWwFSt39MfVopGCY-32b6Poy9Y33LhJi_j_WiXSdTAc85y5OU0PlUiEhqVVgOfm3kbxGpQ-LN025Fbt5lMyriYSSbunesKj7hLfHX5VONTaFxpq69MZPMTmNtheAbQkHLoAda70TIIC6bDcQAgcsitl1bJq17va_Jug" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center">
            <span className="text-[10px] font-bold text-secondary">+9k</span>
          </div>
        </div>

        {/* Action Section */}
        <footer className="mt-auto space-y-4 pt-8">
          <button
            onClick={() => navigate("/registro")}
            className="w-full py-5 rounded-xl text-on-primary font-headline font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(210,188,250,0.3)] active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #d2bcfa 0%, #ff00ff 100%)" }}
          >
            Conoce nuestro sistema, Gratis
            <MaterialIcon name="arrow_forward" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 rounded-xl border border-outline-variant/30 text-on-surface font-headline font-bold text-md hover:bg-surface-container-high transition-colors"
          >
            Iniciar Sesión
          </button>
        </footer>
      </main>
    </div>
  );
};

export default Invitation3;
