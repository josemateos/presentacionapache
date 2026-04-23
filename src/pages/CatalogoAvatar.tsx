import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

const avatars = Array.from({ length: 12 }, (_, i) => i + 1);

const CatalogoAvatar = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="pt-20 px-4 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body text-sm">Volver</span>
        </button>

        <h1 className="text-2xl font-headline font-black text-secondary uppercase tracking-tight mb-2">
          Catálogo de Avatar
        </h1>
        <p className="text-sm text-muted-foreground font-body mb-6">
          Elige un avatar para tu perfil
        </p>

        <div className="grid grid-cols-3 gap-4">
          {avatars.map((id) => (
            <button
              key={id}
              className="aspect-square rounded-2xl border-2 border-accent/30 bg-surface-container-high flex items-center justify-center hover:border-accent hover:scale-105 transition-all active:scale-95"
            >
              <User className="w-10 h-10 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogoAvatar;
