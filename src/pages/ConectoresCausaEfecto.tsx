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
  { english: "so", spanish: "Entonces / Así que" },
  { english: "because", spanish: "Porque" },
  { english: "could", spanish: "Podía / Podría" },
  { english: "by", spanish: "Por (autor)" },
  { english: "for", spanish: "Por / Para" },
  { english: "to", spanish: "A / Para" },
  { english: "may / might", spanish: "Puede que" },
  { english: "can", spanish: "Poder" },
  { english: "must", spanish: "Debes" },
  { english: "should", spanish: "Debería" },
  { english: "if", spanish: "Si (condicional)" },
];

const ConectoresCausaEfecto = () => {
  const navigate = useNavigate();
  const [completedConnectors, setCompletedConnectors] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("completedCausaEfecto");
    if (saved) {
      setCompletedConnectors(JSON.parse(saved));
    }
  }, []);

  const handleSelectConnector = (connector: Connector) => {
    navigate("/learn-connector", {
      state: { connector, source: "causa-efecto" },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-6">
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
              Conectores Causa-Efecto
            </h1>
            <p className="text-sm text-muted-foreground">
              Conectan una causa con su efecto o resultado
            </p>
          </div>
        </div>
      </header>

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
                          {connector.english}
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

export default ConectoresCausaEfecto;
