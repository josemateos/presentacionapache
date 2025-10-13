import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const AuxiliariesHub = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const sections = [
    {
      id: "conectores",
      title: "Conectores",
      subsections: [
        {
          id: "conectores-ing",
          title: 'Conectores "ing"',
          description: "Preposiciones seguidas de gerundio",
          route: "/auxiliaries/conectores-ing",
        },
        {
          id: "conectores-temporales",
          title: "Conectores Temporales",
          description: "Próximamente disponible",
          route: null,
        },
        {
          id: "conectores-causales",
          title: "Conectores Causales",
          description: "Próximamente disponible",
          route: null,
        },
      ],
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
              Auxiliares Clave
            </h1>
            <p className="text-sm text-muted-foreground">
              Elementos fundamentales del inglés
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Collapsible
              open={openSection === section.id}
              onOpenChange={(isOpen) =>
                setOpenSection(isOpen ? section.id : null)
              }
            >
              <Card className="overflow-hidden">
                <CollapsibleTrigger className="w-full">
                  <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">
                        {section.title}
                      </h2>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        openSection === section.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4 space-y-2">
                    {section.subsections.map((subsection) => (
                      <Button
                        key={subsection.id}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4"
                        onClick={() => {
                          if (subsection.route) {
                            navigate(subsection.route);
                          }
                        }}
                        disabled={!subsection.route}
                      >
                        <div className="text-left w-full">
                          <div className="font-medium">{subsection.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {subsection.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default AuxiliariesHub;
