import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Zap, Target, ArrowRight, CheckCircle2, Users, Clock, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      id: 0,
      icon: Brain,
      title: "¿Has intentado aprender inglés durante años...",
      subtitle: "pero sigues sin poder mantener una conversación?",
      problem: "El problema no eres tú.",
      reveal: "Es que nunca te enseñaron cómo funciona realmente el inglés.",
      painPoints: [
        "📚 Memorizaste miles de palabras que no sabes usar",
        "📖 Estudiaste reglas gramaticales que nunca aplicas",
        "🔄 Repites ejercicios pero no mejoras tu fluidez"
      ],
      buttonText: "Esto me pasa"
    },
    {
      id: 1,
      icon: Sparkles,
      title: "La Verdad que Nadie te Dice",
      bigIdea: "No necesitas MEMORIZAR más",
      highlight: "Necesitas COMPRENDER",
      explanation: "El inglés tiene una lógica simple. Una vez que la entiendes, todo hace click.",
      example: {
        step1: "Por ejemplo, si quieres decir:",
        phrase1: "Me gustaría aprender inglés rápidamente",
        step2: "Debes decir",
        phrase2: "Yo gustar aprender inglés rápidamente",
        step3: "En Inglés",
        phrase3: "I like learn English quickly",
        step4: "Agregas auxiliares clave",
        phrase4: "I would like to learn English quickly"
      },
      insight: "¿Viste cómo funciona? Es solo seguir el orden correcto.",
      buttonText: "Quiero entender"
    },
    {
      id: 2,
      icon: Zap,
      title: "El Método Apache",
      subtitle: "5 pasos que cambiarán tu forma de hablar inglés",
      steps: [
        { number: "1", label: "Vocabulario Base", content: "Las palabras esenciales que necesitas" },
        { number: "2", label: "Tu Frase en Español", content: "Lo que quieres decir naturalmente" },
        { number: "3", label: "Orden Apache", content: "El secreto: reorganizar en el orden del inglés" },
        { number: "4", label: "Traducción Directa", content: "Palabra por palabra al inglés" },
        { number: "5", label: "Auxiliar Mágico", content: "El toque final que lo hace perfecto" }
      ],
      promise: "En 90 días estarás hablando con confianza",
      buttonText: "Ver ejemplo completo"
    },
    {
      id: 3,
      icon: Target,
      title: "Por qué Apache funciona",
      features: [
        { 
          icon: Users, 
          title: "+10,000 Estudiantes", 
          description: "Ya dominan el inglés con este método",
          stat: "10K+"
        },
        { 
          icon: Clock, 
          title: "Solo 90 Días", 
          description: "De no poder decir nada a hablar con fluidez",
          stat: "90"
        },
        { 
          icon: Brain, 
          title: "Sin Memorizar", 
          description: "Comprendes la lógica, no memorizas reglas",
          stat: "0"
        }
      ],
      finalCall: "Únete a los miles que ya lo lograron",
      guarantee: "Empieza gratis hoy mismo",
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
      <main className="flex-1 flex flex-col px-4 py-8 overflow-y-auto">
        <div className="container mx-auto max-w-md flex-1 flex flex-col">
          {/* Screen 0: El Dolor */}
          {currentScreen === 0 && (
            <div className="flex-1 flex flex-col justify-center animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/20 border-2 border-destructive mb-6 animate-float">
                  <Brain className="w-10 h-10 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold mb-3 leading-tight text-foreground">
                  {currentScreenData.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {currentScreenData.subtitle}
                </p>
              </div>
              
              <Card className="bg-card border-2 border-destructive/40 p-6 mb-6">
                <p className="text-xl font-bold text-card-foreground mb-4">
                  {currentScreenData.problem}
                </p>
                <p className="text-lg text-primary font-semibold">
                  {currentScreenData.reveal}
                </p>
              </Card>
              
              <div className="space-y-3">
                {currentScreenData.painPoints?.map((point, index) => (
                  <Card key={index} className="bg-card border-2 border-border p-4">
                    <p className="text-sm leading-relaxed text-card-foreground">{point}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Screen 1: La Revelación */}
          {currentScreen === 1 && (
            <div className="flex-1 flex flex-col justify-center animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 border-2 border-accent mb-6 animate-float">
                  <Sparkles className="w-10 h-10 text-accent" />
                </div>
                <h1 className="text-2xl font-bold mb-4 text-foreground">{currentScreenData.title}</h1>
              </div>
              
              <Card className="bg-card border-2 border-primary/30 p-6 mb-6">
                <p className="text-lg text-muted-foreground mb-2 line-through">
                  {currentScreenData.bigIdea}
                </p>
                <p className="text-3xl font-bold text-accent mb-4">
                  {currentScreenData.highlight}
                </p>
                <p className="text-base text-card-foreground">
                  {currentScreenData.explanation}
                </p>
              </Card>
              
              <div className="space-y-3 mb-6">
                <Card className="bg-card border-2 border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">{currentScreenData.example?.step1}</p>
                  <p className="text-sm font-medium text-card-foreground">{currentScreenData.example?.phrase1}</p>
                </Card>
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <Card className="bg-card border-2 border-primary p-4">
                  <p className="text-xs text-primary mb-2 font-semibold">{currentScreenData.example?.step2}</p>
                  <p className="text-sm font-medium text-card-foreground">{currentScreenData.example?.phrase2}</p>
                </Card>
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <Card className="bg-card border-2 border-accent p-4">
                  <p className="text-xs text-accent mb-2 font-semibold">{currentScreenData.example?.step3}</p>
                  <p className="text-sm font-bold text-card-foreground">{currentScreenData.example?.phrase3}</p>
                </Card>
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent p-4">
                  <p className="text-xs text-accent mb-2 font-semibold">{currentScreenData.example?.step4}</p>
                  <p className="text-sm font-bold text-card-foreground">
                    I <span className="text-accent">would</span> like <span className="text-accent">to</span> learn English quickly
                  </p>
                </Card>
              </div>
              
              <Card className="bg-card border-2 border-primary/30 p-4">
                <p className="text-sm text-center text-card-foreground font-medium">
                  {currentScreenData.insight}
                </p>
              </Card>
            </div>
          )}

          {/* Screen 2: El Método */}
          {currentScreen === 2 && (
            <div className="flex-1 flex flex-col animate-fade-in py-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mb-4 animate-float">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-foreground">{currentScreenData.title}</h1>
                <p className="text-sm text-muted-foreground">{currentScreenData.subtitle}</p>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto mb-6">
                {currentScreenData.steps?.map((step, index) => (
                  <Card key={index} className="bg-card border-2 border-primary/30 p-4 relative overflow-hidden">
                    <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{step.number}</span>
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-1">{step.label}</h3>
                    <p className="text-xs text-card-foreground pr-12">{step.content}</p>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent p-5">
                <p className="text-base font-bold text-center text-card-foreground">
                  {currentScreenData.promise}
                </p>
              </Card>
            </div>
          )}

          {/* Screen 3: Prueba Social & CTA */}
          {currentScreen === 3 && (
            <div className="flex-1 flex flex-col justify-center animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 border-2 border-accent mb-6 animate-float">
                  <Target className="w-10 h-10 text-accent" />
                </div>
                <h1 className="text-2xl font-bold mb-3 text-foreground">{currentScreenData.title}</h1>
              </div>
              
              <div className="space-y-4 mb-8">
                {currentScreenData.features?.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="bg-card border-2 border-primary/30 p-5 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <h3 className="font-bold text-lg text-card-foreground">{feature.title}</h3>
                            <span className="text-2xl font-bold text-accent">{feature.stat}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-accent p-6">
                  <p className="text-xl font-bold text-center mb-2 text-card-foreground">
                    {currentScreenData.finalCall}
                  </p>
                  <p className="text-sm text-center text-muted-foreground">
                    {currentScreenData.guarantee}
                  </p>
                </Card>
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
