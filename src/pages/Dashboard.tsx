import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, BookOpen, TrendingUp, Target } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Sistema Apache</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">¡Bienvenido al Dashboard!</h2>
          <p className="text-muted-foreground">
            Estás dentro del Sistema Apache de aprendizaje de inglés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Mis Lecciones</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Accede a tus lecciones y continúa aprendiendo
            </p>
            <Button className="w-full" variant="outline">
              Ver Lecciones
            </Button>
          </Card>

          <Card className="p-6 border-2 border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Mi Progreso</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Revisa tus estadísticas y avances
            </p>
            <Button className="w-full" variant="outline">
              Ver Progreso
            </Button>
          </Card>

          <Card className="p-6 border-2 border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Mis Objetivos</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Establece y sigue tus metas de aprendizaje
            </p>
            <Button className="w-full" variant="outline">
              Ver Objetivos
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
