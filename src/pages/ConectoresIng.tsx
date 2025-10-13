import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Connector {
  english: string;
  spanish: string;
}

const conectores: Connector[] = [
  { english: "About", spanish: "Sobre/Acerca de" },
  { english: "After", spanish: "Después de" },
  { english: "Against", spanish: "En contra de" },
  { english: "At", spanish: "En, a" },
  { english: "Besides", spanish: "Además de" },
  { english: "Before", spanish: "Antes de" },
  { english: "By", spanish: "Mediante, haciendo" },
  { english: "Despite", spanish: "A pesar de" },
  { english: "For", spanish: "Para, por" },
  { english: "From", spanish: "De, desde" },
  { english: "In", spanish: "En, dentro de" },
  { english: "Instead of", spanish: "En lugar de" },
  { english: "Like", spanish: "Como/comparación" },
  { english: "Of", spanish: "De" },
  { english: "On", spanish: "En, sobre" },
  { english: "Since", spanish: "Desde" },
  { english: "Through", spanish: "A través de" },
  { english: "Towards", spanish: "Hacia" },
  { english: "Upon", spanish: "Al, tras" },
  { english: "With", spanish: "Con" },
  { english: "Without", spanish: "Sin" },
];

const ConectoresIng = () => {
  const navigate = useNavigate();
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(
    null
  );
  const [completedConnectors, setCompletedConnectors] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('completedConnectors');
    if (saved) {
      setCompletedConnectors(JSON.parse(saved));
    }
  }, []);

  const handleSelectConnector = (connector: Connector) => {
    setSelectedConnector(connector);
    navigate("/learn-connector", { state: { connector } });
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/auxiliaries")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Conectores "ing"
            </h1>
            <p className="text-sm text-muted-foreground">
              Al verbo después del Conector siempre agrégale "ing"
            </p>
            <p className="text-xs text-muted-foreground">
              Conector, verbo+ing
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {conectores.map((connector, idx) => {
            const isCompleted = completedConnectors.includes(connector.english);
            return (
              <motion.div
                key={connector.english}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => handleSelectConnector(connector)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {idx + 1}.
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {connector.spanish}
                        </p>
                      </div>
                      {isCompleted && (
                        <div className="flex-shrink-0">
                          <Check className="h-6 w-6 text-green-500" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ConectoresIng;
