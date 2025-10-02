import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, LogIn, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { useTheme } from "next-themes";

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
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
  });
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
      const validatedData = loginSchema.parse(formData);
      
      // Aquí se integrará con Supabase en el futuro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "¡Bienvenido de nuevo!",
        description: "Has iniciado sesión correctamente.",
      });
      
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
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-8 right-8 z-50"
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
            <h1 className="text-2xl md:text-3xl font-bold">Iniciar Sesión</h1>
          </div>

          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Continúa tu aprendizaje de inglés
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 bg-background hover:bg-muted border-2"
              disabled={isLoading}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Ingresar con Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full py-6 bg-background hover:bg-muted border-2"
              disabled={isLoading}
            >
              <FaApple className="w-5 h-5 mr-2" />
              Ingresar con Apple
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full py-6 bg-background hover:bg-muted border-2"
              disabled={isLoading}
            >
              <FaFacebook className="w-5 h-5 mr-2 text-[#1877F2]" />
              Ingresar con Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                O ingresa con email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 py-6 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Ingresar con Email"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => navigate("/registro")}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Regístrate
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
