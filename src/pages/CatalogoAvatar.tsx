import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

type Gender = "masculino" | "femenino";

const avatarsByGender: Record<Gender, { name: string; locked?: boolean }[]> = {
  masculino: [
    { name: "Oso Joven" },
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
      <AppHeader />
      <div className="pt-20 px-4 max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface hover:text-accent transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body text-sm">arrow_back</span>
        </button>

        {/* Title */}
        <h1 className="text-2xl font-headline font-black text-secondary uppercase tracking-tight mb-5 text-center">
          Catálogo de Avatar
        </h1>

        {/* Gender selector */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-container-high border border-accent/20 mb-6">
          <button
            onClick={() => setGender("masculino")}
            className={`py-2.5 rounded-xl font-headline font-bold text-sm uppercase tracking-wide transition-all ${
              gender === "masculino"
                ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-lg"
                : "text-on-surface/70 hover:text-on-surface"
            }`}
          >
            Masculino
          </button>
          <button
            onClick={() => setGender("femenino")}
            className={`py-2.5 rounded-xl font-headline font-bold text-sm uppercase tracking-wide transition-all ${
              gender === "femenino"
                ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-lg"
                : "text-on-surface/70 hover:text-on-surface"
            }`}
          >
            Femenino
          </button>
        </div>

        {/* Rango actual */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 p-4 mb-6 text-center">
          <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-1">
            Rango Actual
          </p>
          <p className="text-xl font-headline font-black text-amber-400 uppercase tracking-tight">
            🔥 Iniciado
          </p>
        </div>

        {/* Avatar grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {avatars.map((avatar, idx) => (
            <button
              key={idx}
              disabled={avatar.locked}
              className={`relative rounded-2xl border-2 p-3 flex flex-col items-center gap-2 transition-all ${
                avatar.locked
                  ? "border-muted/30 bg-surface-container/50 opacity-60 cursor-not-allowed"
                  : "border-accent/40 bg-surface-container-high hover:border-accent hover:scale-[1.03] active:scale-95"
              }`}
            >
              <div
                className={`aspect-square w-full rounded-xl flex items-center justify-center ${
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
                {avatar.locked && (
                  <span className="absolute top-2 right-2 text-lg">🔒</span>
                )}
              </div>
              <span
                className={`text-xs font-headline font-bold uppercase tracking-wide text-center ${
                  avatar.locked ? "text-muted-foreground" : "text-on-surface"
                }`}
              >
                {avatar.name}
              </span>
            </button>
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
