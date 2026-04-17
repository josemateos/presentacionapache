import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { useTheme } from "next-themes";
import logoApache from "@/assets/logo_apache.png";

const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Por favor ingresa un email válido" })
    .max(255, { message: "El email no puede exceder 255 caracteres" }),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginForm>({ email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      loginSchema.parse(formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/bienvenida");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof LoginForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof LoginForm] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast({
          title: "Error",
          description: "No se pudo iniciar sesión. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col items-center justify-center p-4 antialiased overflow-x-hidden relative">
      {/* Decorative background accents */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-tertiary/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/registro")}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground z-50"
        aria-label="Volver"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-secondary-fixed hover:bg-primary-container transition-all active:scale-95 z-50"
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main Content */}
      <main className="w-full max-w-md z-10">
        {/* Header Section - matches Registro */}
        <header className="text-center mb-8 mt-8">
          <div className="flex flex-col items-center mb-2">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-primary/30 shadow-[0_0_24px_rgba(47,217,244,0.3)] mb-3 bg-[#2a1854]">
              <img src={logoApache} alt="Logo Apache" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface whitespace-nowrap">Sistema Apache</h1>
            <p className="text-on-surface-variant font-light tracking-[0.3em] uppercase text-[10px] mt-1">Habla Inglés utilizando tu Español</p>
          </div>
        </header>

        {/* Glassmorphism Auth Card */}
        <div className="bg-surface-container-high p-8 rounded-[2rem] shadow-2xl border border-white/20 space-y-6">
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-surface leading-tight">Iniciar Sesión</h2>
            <p className="text-on-surface-variant text-sm mt-1">Bienvenido de vuelta a la tribu.</p>
          </div>
          {/* Social Access */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-surface-container-highest rounded-2xl border border-white/20 hover:bg-surface-container-high hover:border-white/30 transition-all active:scale-[0.98] group disabled:opacity-50 shadow-lg"
            >
              <FcGoogle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-wide">Ingresar con Google</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-surface-container-highest rounded-2xl border border-white/20 hover:bg-surface-container-high hover:border-white/30 transition-all active:scale-[0.98] group disabled:opacity-50 shadow-lg"
            >
              <FaApple className="w-5 h-5 text-on-surface group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-wide">Ingresar con Apple</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-surface-container-highest rounded-2xl border border-white/20 hover:bg-surface-container-high hover:border-white/30 transition-all active:scale-[0.98] group disabled:opacity-50 shadow-lg"
            >
              <FaFacebook className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-wide">Ingresar con Facebook</span>
            </button>
          </div>

          {/* Separator */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-outline-variant/20"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
              O ingresa con email
            </span>
            <div className="flex-grow border-t border-outline-variant/20"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-xs font-bold tracking-widest text-primary-fixed-dim uppercase ml-1">
                Correo Electrónico
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="email"
                  className={`w-full bg-surface-container-lowest border-0 rounded-2xl py-4 px-5 h-auto text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-1 focus-visible:ring-tertiary focus-visible:ring-offset-0 transition-all ${errors.email ? "ring-1 ring-destructive" : ""}`}
                />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-tertiary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full shadow-[0_0_12px_#2fd9f4]"></div>
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-[#ff00ff] text-on-primary text-sm font-black tracking-widest shadow-[0_8px_24px_rgba(210,188,250,0.3)] hover:shadow-[0_12px_32px_rgba(210,188,250,0.5)] transition-all active:scale-95 uppercase disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "INGRESANDO..." : "INGRESAR CON EMAIL"}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-on-surface-variant text-sm">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/registro")}
              disabled={isLoading}
              className="font-bold text-tertiary hover:text-tertiary/80 transition-colors ml-1 underline underline-offset-4 decoration-tertiary/30"
            >
              Regístrate
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
