import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Connector {
  english: string;
  spanish: string;
}

const conectores: Connector[] = [
  { english: "About", spanish: "sobre/acerca de" },
  { english: "After", spanish: "después de" },
  { english: "Against", spanish: "en contra de" },
  { english: "At", spanish: "en, a" },
  { english: "Besides", spanish: "además de" },
  { english: "Before", spanish: "antes de" },
  { english: "By", spanish: "mediante, haciendo" },
  { english: "Despite", spanish: "a pesar de" },
  { english: "For", spanish: "para, por" },
  { english: "From", spanish: "de, desde" },
  { english: "In", spanish: "en, dentro de" },
  { english: "Instead of", spanish: "en lugar de" },
  { english: "Like", spanish: "como/comparación" },
  { english: "Of", spanish: "de" },
  { english: "On", spanish: "en, sobre" },
  { english: "Since", spanish: "desde" },
  { english: "Through", spanish: "a través de" },
  { english: "Towards", spanish: "hacia" },
  { english: "Upon", spanish: "al, tras" },
  { english: "With", spanish: "con" },
  { english: "Without", spanish: "sin" },
];

const ConectoresIng = () => {
  const navigate = useNavigate();
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(
    null
  );

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
              Preposiciones seguidas de gerundio
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {conectores.map((connector, idx) => (
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
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground mb-1">
                      {connector.english}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {connector.spanish}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ConectoresIng;
