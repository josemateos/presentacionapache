import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const AuxiliariesHub = () => {
  const navigate = useNavigate();

  const conectores = [
    {
      id: "conectores-simples",
      title: "Conectores Simples",
      description: "Próximamente disponible",
      route: null,
    },
    {
      id: "conectores-causa-efecto",
      title: "Conectores Causa-Efecto",
      description: "Próximamente disponible",
      route: null,
    },
    {
      id: "conectores-ing",
      title: "Conectores ING",
      description: "Preposiciones seguidas de gerundio",
      route: "/auxiliaries/conectores-ing",
    },
    {
      id: "conectores-parrafos",
      title: "Conectores de Párrafos",
      description: "Próximamente disponible",
      route: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Conectores
            </h1>
            <p className="text-sm text-muted-foreground">
              Tipos de conectores en inglés
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-4">
        {conectores.map((conector, idx) => (
          <motion.div
            key={conector.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-4 border-0 hover:bg-muted"
                onClick={() => {
                  if (conector.route) {
                    navigate(conector.route);
                  }
                }}
                disabled={!conector.route}
              >
                <div className="text-left w-full">
                  <div className="font-semibold text-base">{conector.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {conector.description}
                  </div>
                </div>
              </Button>
            </Card>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default AuxiliariesHub;
