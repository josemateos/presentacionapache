import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import logoApache from "@/assets/logo_apache.png";

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";


const registroSchema = z.object({
  nombre: z.string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "Por favor ingresa un email válido" })
    .max(255, { message: "El email no puede exceder 255 caracteres" }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(100, { message: "La contraseña no puede exceder 100 caracteres" }),
  terms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
});

type RegistroForm = z.infer<typeof registroSchema>;

const Registro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistroForm>({
    nombre: "",
    email: "",
    password: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegistroForm, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof RegistroForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, terms: checked }));
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = registroSchema.parse(formData);
      
      // Aquí se integrará con Supabase en el futuro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente.",
      });
      
      navigate("/bienvenida");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof RegistroForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof RegistroForm] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al crear tu cuenta. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Container */}
      <main className="w-full max-w-md z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/invitacion-3")}
          className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Header Section */}
        <header className="text-center mb-8 mt-8">
          <div className="flex flex-col items-center mb-2">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-primary/30 shadow-[0_0_24px_rgba(47,217,244,0.3)] mb-3 bg-[#2a1854]">
              <img src={logoApache} alt="Logo Apache" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface whitespace-nowrap">Sistema Apache</h1>
            <p className="text-on-surface-variant font-light tracking-[0.3em] uppercase text-[10px] mt-1">Habla Inglés utilizando tu Español</p>
          </div>
        </header>

        {/* Registration Card */}
        <div className="bg-surface-container-high p-8 rounded-[2rem] shadow-2xl border border-white/20">
          <div className="mb-8">
            <h2 className="font-headline font-bold text-2xl text-on-surface leading-tight">Registro</h2>
            <p className="text-on-surface-variant text-sm mt-1">Comienza tu viaje místico hoy.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1">
              <Label htmlFor="nombre" className="text-xs font-semibold text-tertiary ml-1 uppercase tracking-widest">
                Nombre Completo
              </Label>
              <div className={`relative flex items-center bg-surface-container-highest rounded-xl border shadow-lg transition-all duration-300 ${errors.nombre ? 'border-destructive' : 'border-white/20 focus-within:border-tertiary focus-within:shadow-[0_0_15px_rgba(47,217,244,0.3)]'}`}>
                <User className="absolute left-4 h-5 w-5 text-on-surface-variant" />
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 pl-12 pr-4 placeholder:text-on-surface-variant/40 h-auto"
                  disabled={isLoading}
                />
              </div>
              {errors.nombre && (
                <p className="text-xs text-destructive mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold text-tertiary ml-1 uppercase tracking-widest">
                Correo Electrónico
              </Label>
              <div className={`relative flex items-center bg-surface-container-highest rounded-xl border shadow-lg transition-all duration-300 ${errors.email ? 'border-destructive' : 'border-white/20 focus-within:border-tertiary focus-within:shadow-[0_0_15px_rgba(47,217,244,0.3)]'}`}>
                <Mail className="absolute left-4 h-5 w-5 text-on-surface-variant" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 pl-12 pr-4 placeholder:text-on-surface-variant/40 h-auto"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold text-tertiary ml-1 uppercase tracking-widest">
                Contraseña
              </Label>
              <div className={`relative flex items-center bg-surface-container-highest rounded-xl border shadow-lg transition-all duration-300 ${errors.password ? 'border-destructive' : 'border-white/20 focus-within:border-tertiary focus-within:shadow-[0_0_15px_rgba(47,217,244,0.3)]'}`}>
                <Lock className="absolute left-4 h-5 w-5 text-on-surface-variant" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 pl-12 pr-4 placeholder:text-on-surface-variant/40 h-auto"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 py-2">
              <div className="flex items-center h-5">
                <Checkbox
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onCheckedChange={handleCheckboxChange}
                  className="w-4 h-4 rounded border-outline-variant/30 bg-surface-container-lowest text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer"
                  disabled={isLoading}
                />
              </div>
              <div className="text-xs">
                <Label htmlFor="terms" className="text-on-surface-variant cursor-pointer">
                  Acepto los <a className="text-tertiary hover:underline" href="#">términos y condiciones</a> y la <a className="text-tertiary hover:underline" href="#">política de privacidad</a>
                </Label>
              </div>
            </div>
            {errors.terms && (
              <p className="text-xs text-destructive -mt-3">{errors.terms}</p>
            )}

            {/* CTA Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-[#ff00ff] text-on-primary font-headline font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(210,188,250,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 tracking-wider mt-4 h-auto"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "UNIRSE A LA TRIBU"}
            </Button>
          </form>

          {/* Social Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
            <span className="mx-4 text-xs font-medium text-on-surface-variant uppercase tracking-widest">O únete con</span>
            <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center bg-surface-container-highest hover:bg-surface-container-high transition-colors py-3 rounded-xl border border-white/20 hover:border-white/30 h-auto shadow-lg"
              onClick={() => toast({ title: "Próximamente", description: "Inicio de sesión con Google estará disponible pronto." })}
            >
              <FcGoogle className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center bg-surface-container-highest hover:bg-surface-container-high transition-colors py-3 rounded-xl border border-white/20 hover:border-white/30 h-auto shadow-lg"
              onClick={() => toast({ title: "Próximamente", description: "Inicio de sesión con Apple estará disponible pronto." })}
            >
              <FaApple className="w-5 h-5 text-on-surface" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center bg-surface-container-highest hover:bg-surface-container-high transition-colors py-3 rounded-xl border border-white/20 hover:border-white/30 h-auto shadow-lg"
              onClick={() => toast({ title: "Próximamente", description: "Inicio de sesión con Facebook estará disponible pronto." })}
            >
              <FaFacebook className="w-5 h-5 text-[#1877F2]" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-on-surface-variant text-sm">
            ¿Ya eres parte de la tribu?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:underline ml-1"
              disabled={isLoading}
            >
              Inicia Sesión
            </button>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Registro;
