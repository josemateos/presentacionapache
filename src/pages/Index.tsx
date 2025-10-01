import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Zap, Target, ArrowRight, CheckCircle2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      id: 0,
      icon: Brain,
      iconColor: "text-primary",
      title: "¿Por qué ninguna App logra que aprendas Inglés?",
      description: "Porque lo único que hacen es obligarte a repetir, repetir y memorizar, en vez de enseñarte a comprender la Lógica de su Funcionamiento.",
      highlight: '"Una vez que lo Comprendes lo Aprendes"',
      highlightColor: "bg-accent/10 border-accent/30 text-accent",
      buttonText: "Ver ejemplo"
    },
    {
      id: 1,
      icon: Zap,
      iconColor: "text-primary",
      title: "El Método Apache",
      subtitle: "Muy Fácil - 5 Pasos",
      steps: [
        { label: "Paso 1: Vocabulario", content: "quickly • rápidamente\nI • Yo\nEnglish • Inglés\nlearn • aprender\nspeak • hablar\nlike • gustar" },
        { label: "Paso 2: Frase en Español", content: "Me gustaría aprender hablar Inglés rápidamente" },
        { label: "Paso 3: Orden Apache", content: "Yo gustar aprender hablar Inglés rápidamente" },
        { label: "Paso 4: Traducción Directa", content: "I like to learn to speak English quickly" },
        { label: "Paso 5: Agrega el Auxiliar Clave", content: "I would like to learn to speak English quickly", highlight: "would" }
      ],
      buttonText: "Saber más"
    },
    {
      id: 2,
      icon: Target,
      iconColor: "text-accent",
      title: "Si tú lograr entender frase, entonces...",
      highlight: "APACHE SISTEMA",
      description: "poder hacer tú hablar Inglés 90 días.",
      highlightColor: "bg-primary/10 border-primary/30 text-primary",
      buttonText: "Entiendo la frase"
    },
    {
      id: 3,
      features: [
        { icon: CheckCircle2, title: "Método Comprobado", description: "Miles de estudiantes han logrado hablar inglés con fluidez" },
        { icon: Target, title: "90 Días", description: "Programa estructurado para resultados rápidos y efectivos" },
        { icon: Brain, title: "Sin Memorización", description: "Aprende la lógica del idioma, no reglas complicadas" }
      ],
      title: "¿Listo para Comenzar?",
      description: "Descubre una forma fácil y efectiva de dominar el inglés con nuestro método único.",
      showActions: true
    }
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const currentScreenData = screens[currentScreen];

  return (
    <div className="min-h-screen gradient-hero text-white flex flex-col">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={currentScreen === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 h-8 w-8"
          >
            ←
          </Button>
          
          <div className="flex items-center gap-1.5">
            {screens.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentScreen(index)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  index === currentScreen 
                    ? "w-6 bg-primary" 
                    : "w-1.5 bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentScreen === screens.length - 1}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 h-8 w-8"
          >
            →
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex flex-col px-4 py-6 overflow-y-auto">
        <div className="container mx-auto max-w-md flex-1 flex flex-col">
          {/* Screen 0: El Problema */}
          {currentScreen === 0 && (
            <div className="flex-1 flex flex-col justify-center text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-6 mx-auto animate-float">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              
              <Card className="bg-card border-2 border-border p-4 mb-4">
                <h1 className="text-xl font-bold leading-tight">{currentScreenData.title}</h1>
              </Card>
              
              <Card className="bg-card border border-border p-4 mb-4">
                <p className="text-sm text-blue-200 leading-relaxed">
                  {currentScreenData.description}
                </p>
              </Card>
              
              <Card className="bg-accent/10 border border-accent/30 p-4">
                <p className="text-base font-bold text-accent">{currentScreenData.highlight}</p>
              </Card>
            </div>
          )}

          {/* Screen 1: El Proceso */}
          {currentScreen === 1 && (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 mb-3 animate-float">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-1">{currentScreenData.title}</h1>
                <p className="text-sm text-muted-foreground">{currentScreenData.subtitle}</p>
              </div>
              
              <div className="space-y-2.5 overflow-y-auto flex-1">
                {currentScreenData.steps?.map((step, index) => (
                  <Card key={index} className="bg-card border border-border p-3">
                    <h3 className="text-xs font-semibold text-primary mb-1.5">{step.label}</h3>
                    <div className="bg-background/50 rounded-lg p-2.5">
                      {step.highlight ? (
                        <p className="text-sm whitespace-pre-line">
                          {step.content.split(step.highlight)[0]}
                          <span className="text-accent font-semibold">{step.highlight}</span>
                          {step.content.split(step.highlight)[1]}
                        </p>
                      ) : (
                        <p className="text-sm whitespace-pre-line">{step.content}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Screen 2: La Revelación */}
          {currentScreen === 2 && (
            <div className="flex-1 flex flex-col justify-center text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 mb-6 mx-auto animate-float">
                <Target className="w-10 h-10 text-accent" />
              </div>
              
              <Card className="bg-card border-2 border-border p-6">
                <div className="space-y-2">
                  <p className="text-lg leading-relaxed">{currentScreenData.title}</p>
                  <div className="my-4">
                    <p className="text-3xl font-bold text-accent">{currentScreenData.highlight}</p>
                  </div>
                  <p className="text-lg leading-relaxed">{currentScreenData.description}</p>
                </div>
              </Card>
            </div>
          )}

          {/* Screen 3: Features & CTA */}
          {currentScreen === 3 && (
            <div className="flex-1 flex flex-col justify-between animate-fade-in">
              <div>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">{currentScreenData.title}</h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentScreenData.description}
                  </p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {currentScreenData.features?.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <Card key={index} className="bg-card border border-border p-4">
                        <Icon className="w-6 h-6 text-primary mb-2" />
                        <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer with Action Button */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border p-4">
        <div className="container mx-auto max-w-md">
          {currentScreen < screens.length - 1 ? (
            <Button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-primary/90 py-6 text-base font-semibold"
            >
              {currentScreenData.buttonText}
            </Button>
          ) : (
            <div className="space-y-2.5">
              <Button
                onClick={() => navigate("/registro")}
                className="w-full bg-primary hover:bg-primary/90 py-6 text-base font-semibold"
              >
                Acceder Gratis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full py-6 text-base"
              >
                Iniciar Sesión
              </Button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Index;
