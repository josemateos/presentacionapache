import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Moon, Sun } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useTheme } from "next-themes";

const registroSchema = z.object({
  nombre: z.string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "Por favor ingresa un email válido" })
    .max(255, { message: "El email no puede exceder 255 caracteres" }),
});

type RegistroForm = z.infer<typeof registroSchema>;

const Registro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistroForm>({
    nombre: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegistroForm, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof RegistroForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
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
      
      navigate("/dashboard");
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
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 z-50"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
      <div className="w-full max-w-md">
        <Card className="bg-card border-2 border-border p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/", { state: { screen: 2 } })}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Crear Cuenta</h1>
          </div>

          <div className="mb-6 text-center">
            <p className="text-muted-foreground text-sm">
              Comienza tu viaje para dominar el inglés
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-base flex items-center justify-center gap-3"
              onClick={() => toast({ title: "Próximamente", description: "Inicio de sesión con Google estará disponible pronto." })}
            >
              <FcGoogle className="w-5 h-5" />
              Crear Cuenta con Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-base flex items-center justify-center gap-3"
              onClick={() => toast({ title: "Próximamente", description: "Inicio de sesión con Apple estará disponible pronto." })}
            >
              <FaApple className="w-5 h-5" />
              Crear Cuenta con Apple
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-base flex items-center justify-center gap-3"
              onClick={() => toast({ title: "Próximamente", description: "Inicio de sesión con Facebook estará disponible pronto." })}
            >
              <FaFacebook className="w-5 h-5 text-blue-600" />
              Crear Cuenta con Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`mt-1 ${errors.nombre ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.nombre && (
                <p className="text-xs text-destructive mt-1">{errors.nombre}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 ${errors.email ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 py-6 text-base flex items-center justify-center gap-3"
              disabled={isLoading}
            >
              <Mail className="w-5 h-5" />
              {isLoading ? "Creando cuenta..." : "Crear Cuenta con Correo"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Inicia Sesión
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Registro;
