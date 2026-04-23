import { useState, useEffect } from "react";
import { User, Sparkles } from "lucide-react";

interface AppHeaderProps {
  userName?: string;
  rankLabel?: string;
  userPoints?: number;
  hideOnScroll?: boolean;
}

export const AppHeader = ({
  userName = "Carlos",
  rankLabel = "INICIADO",
  userPoints = 0,
  hideOnScroll = true,
}: AppHeaderProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    if (!hideOnScroll) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY + 4 && y > 40) setShowHeader(false);
      else if (y < lastY - 4 || y <= 20) setShowHeader(true);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md flex justify-between items-center px-6 py-2 border-b border-accent/20 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background:
            "linear-gradient(90deg, hsl(265 60% 18% / 0.95), hsl(250 55% 14% / 0.95))",
          boxShadow: "0 4px 20px hsl(265 60% 8% / 0.4)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-lg border-2 border-accent/40 overflow-hidden bg-surface-container-highest flex items-center justify-center hover:border-accent transition-colors active:scale-95"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex flex-col leading-none">
            <span className="text-[9px] font-bold text-accent tracking-[0.25em] uppercase opacity-80 mb-[-2px]">
              Rank
            </span>
            <h1
              className="text-xl font-black text-secondary font-headline tracking-tighter uppercase"
              style={{ textShadow: "0 0 15px hsl(42 100% 63% / 0.5)" }}
            >
              {rankLabel}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-surface/40 border border-accent/30 rounded-full px-4 py-1.5">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-on-surface font-headline">
            {userPoints.toLocaleString()}
          </span>
        </div>
      </header>

      {showProfileMenu && (
        <div className="fixed top-[64px] left-4 right-4 z-50 bg-surface-container-high border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl max-w-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center border border-white/10">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-headline font-bold text-on-surface">{userName}</p>
              <p className="text-xs text-muted-foreground">Rango: Iniciado</p>
            </div>
          </div>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-on-surface hover:bg-white/5 transition-colors font-body">
              Mi Perfil
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-on-surface hover:bg-white/5 transition-colors font-body">
              Contraseña
            </button>
            <button
              onClick={() => {
                setShowProfileMenu(false);
                navigate("/catalogo-avatar");
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-on-surface hover:bg-white/5 transition-colors font-body"
            >
              Avatar
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors font-body">
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
      {showProfileMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
      )}
    </>
  );
};
