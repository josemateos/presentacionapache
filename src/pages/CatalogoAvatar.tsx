import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import osoJovenImg from "@/assets/avatar-oso-joven.png";

type Gender = "masculino" | "femenino";

const avatarsByGender: Record<Gender, { name: string; locked?: boolean; image?: string }[]> = {
  masculino: [
    { name: "Oso Joven", image: osoJovenImg },
    { name: "Águila Valiente" },
    { name: "Trueno Lejano" },
    { name: "Zorro Sabio" },
    { name: "Lobo Gris", locked: true },
    { name: "Halcón Rojo", locked: true },
    { name: "Bisonte Fuerte", locked: true },
    { name: "Cuervo Negro", locked: true },
  ],
  femenino: [
    { name: "Estrella Guía" },
    { name: "Nieve Eterna" },
    { name: "Garza Blanca" },
    { name: "Puma Silencioso" },
    { name: "Luna Plata", locked: true },
    { name: "Flor del Valle", locked: true },
    { name: "Río Sereno", locked: true },
    { name: "Aurora Boreal", locked: true },
  ],
};

const CatalogoAvatar = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState<Gender>("masculino");

  const avatars = avatarsByGender[gender];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Custom Header */}
      <header
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md flex items-center px-4 py-3 border-b border-accent/20"
        style={{
          background:
            "linear-gradient(90deg, hsl(265 60% 18% / 0.95), hsl(250 55% 14% / 0.95))",
          boxShadow: "0 4px 20px hsl(265 60% 8% / 0.4)",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <h1
          className="flex-1 text-center text-lg font-black text-secondary font-headline tracking-tight uppercase pr-10"
          style={{ textShadow: "0 0 15px hsl(42 100% 63% / 0.5)" }}
        >
          Catálogo de Avatar
        </h1>
      </header>

      <div className="pt-20 px-4 max-w-2xl mx-auto">
        {/* Gender selector — separate boxes */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setGender("masculino")}
            className={`py-3 rounded-2xl border-2 font-headline font-bold text-sm uppercase tracking-wide transition-all ${
              gender === "masculino"
                ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white border-pink-300 shadow-lg shadow-pink-500/30"
                : "bg-surface-container-high border-accent/20 text-on-surface/70 hover:text-on-surface hover:border-accent/40"
            }`}
          >
            Masculino
          </button>
          <button
            onClick={() => setGender("femenino")}
            className={`py-3 rounded-2xl border-2 font-headline font-bold text-sm uppercase tracking-wide transition-all ${
              gender === "femenino"
                ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white border-pink-300 shadow-lg shadow-pink-500/30"
                : "bg-surface-container-high border-accent/20 text-on-surface/70 hover:text-on-surface hover:border-accent/40"
            }`}
          >
            Femenino
          </button>
        </div>

        {/* Rango */}
        <div className="mb-6 text-left">
          <p className="text-xs font-headline font-bold uppercase tracking-widest text-muted-foreground">
            Rango
          </p>
          <p className="text-lg font-headline font-black text-amber-400 uppercase tracking-tight">
            Iniciado
          </p>
        </div>

        {/* Avatar grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {avatars.map((avatar, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <button
                disabled={avatar.locked}
                className={`relative aspect-square w-full rounded-2xl border-2 overflow-hidden transition-all ${
                  avatar.locked
                    ? "border-muted/30 bg-surface-container/50 opacity-60 cursor-not-allowed"
                    : "border-accent/40 bg-surface-container-high hover:border-accent hover:scale-[1.03] active:scale-95"
                }`}
              >
                {avatar.image ? (
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      avatar.locked
                        ? "bg-muted/20"
                        : "bg-gradient-to-br from-accent/20 to-secondary/10"
                    }`}
                  >
                    <User
                      className={`w-12 h-12 ${
                        avatar.locked ? "text-muted-foreground/50" : "text-accent"
                      }`}
                    />
                  </div>
                )}
                {avatar.locked && (
                  <span className="absolute top-2 right-2 text-lg">🔒</span>
                )}
              </button>
              <span
                className={`text-xs font-headline font-bold uppercase tracking-wide text-center ${
                  avatar.locked ? "text-muted-foreground" : "text-on-surface"
                }`}
              >
                {avatar.name}
              </span>
            </div>
          ))}
        </div>

        {/* Mensaje motivacional */}
        <div className="rounded-2xl bg-surface-container-high/50 border border-accent/20 p-4 mb-4">
          <p className="text-sm text-on-surface/80 font-body text-center leading-relaxed mb-3">
            Desbloquea nuevos avatares completando rituales de lenguaje. El{" "}
            <span className="text-amber-400 font-bold">Rango de Cazador</span>{" "}
            te espera más allá del horizonte.
          </p>
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-headline font-bold uppercase tracking-wide text-accent hover:text-secondary transition-colors">
            Ver Requisitos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Iconos de progreso */}
        <div className="flex items-center justify-center gap-4 text-2xl opacity-70">
          <span title="Racha">🔥</span>
          <span title="Herramientas">🛠️</span>
          <span title="Premio">🏆</span>
          <span title="Arquitectura">📐</span>
          <span title="Arte">🎨</span>
        </div>
      </div>
    </div>
  );
};

export default CatalogoAvatar;
