import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LearnPhrase = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const day = searchParams.get("day");
  const english = searchParams.get("english") || "";
  const spanish = searchParams.get("spanish") || "";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/phrases-day?day=${day}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold">Aprender Frase</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        <Card className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">{english}</h2>
            <p className="text-lg text-muted-foreground">{spanish}</p>
          </div>
          
          <div className="text-center text-muted-foreground">
            <p>Módulos de aprendizaje próximamente disponibles</p>
          </div>

          <Button
            onClick={() => navigate(`/phrases-day?day=${day}`)}
            className="w-full"
            size="lg"
          >
            Volver a las frases
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default LearnPhrase;
