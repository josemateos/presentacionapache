import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Zap, Target, ArrowRight, CheckCircle2, Users, Clock, Sparkles, Feather, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    if (location.state?.screen !== undefined) {
      setCurrentScreen(location.state.screen);
    }
  }, [location.state]);
  
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const screens = [
    {
      id: 0,
      icon: Brain,
      title: "¿Has intentado aprender inglés de muchas maneras...",
      subtitle: "pero sigues sin ver los resultados que deseas?",
      problem: "El problema es que nunca te han enseñado a comprender el funcionamiento lógico del inglés.",
      painPoints: [
        "📚 Memorizaste miles de palabras que no sabes usar",
        "📖 Estudiaste reglas gramaticales que nunca aplicas",
        "🔄 Repites ejercicios pero no mejoras tu fluidez"
      ],
      buttonText: "Conocer la solución"
    },
    {
      id: 1,
      icon: Feather,
      title: "Sistema Apache",
      subtitle: "5 pasos que definitivamente te enseñaran a comunicarte en Inglés",
      steps: [
        { 
          number: "1", 
          label: "Vocabulario Base", 
          content: "Las palabras esenciales que necesitas",
          example: {
            words: [
              { spanish: "Aprender", english: "Learn" },
              { spanish: "Rápidamente", english: "Quickly" },
              { spanish: "Yo", english: "I" },
              { spanish: "Inglés", english: "English" },
              { spanish: "Gustar", english: "Like" }
            ]
          }
        },
        { 
          number: "2", 
          label: "Tu Frase en Español", 
          content: "Lo que quieres decir naturalmente",
          example: {
            phrase: "Me gustaría aprender inglés rápidamente"
          }
        },
        { 
          number: "3", 
          label: "Orden Apache", 
          content: "El secreto: reorganizar en el orden del inglés",
          example: {
            phrase: "Yo gustar aprender inglés rápidamente"
          }
        },
        { 
          number: "4", 
          label: "Ingles entendible", 
          content: "Palabra por palabra al inglés",
          example: {
            phrase: "I like learn English quickly"
          }
        },
        { 
          number: "5", 
          label: "Ingles Perfecto", 
          content: "Agrega los Auxiliares Clave",
          example: {
            phrase: "I would like to learn English quickly",
            highlights: ["would", "to"]
          }
        }
      ],
      promise: "En 90 días estarás hablando con confianza",
      buttonText: "Continuar"
    },
    {
      id: 2,
      icon: Target,
      title: "Por qué Apache funciona",
      features: [
        { 
          icon: Users, 
          title: "+10,000 Estudiantes", 
          description: "Obteniendo resultados con nuestro sistema",
          stat: "10K+"
        },
        { 
          icon: Clock, 
          title: "Solo 90 Días", 
          description: "De no poder decir nada, a comunicarse con fluidez",
          stat: "90"
        },
        { 
          icon: Brain, 
          title: "Sin Memorizar", 
          description: "Comprendes la lógica, no memorizas reglas",
          stat: "0"
        }
      ],
      finalCall: "Únete a los miles que lo están logrando",
      guarantee: "Empieza gratis hoy mismo",
      showActions: true
    }
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
      setExpandedSteps([]);
      setVisibleSteps([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleStepOk = (currentIndex: number) => {
    if (!visibleSteps.includes(currentIndex)) {
      setVisibleSteps([...visibleSteps, currentIndex]);
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
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border-border hover:bg-background"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      
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
                <h1 className="text-2xl font-bold mb-3 leading-tight text-white">
                  {currentScreenData.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {currentScreenData.subtitle}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {currentScreenData.painPoints?.map((point, index) => (
                  <Card key={index} className="bg-card border-2 border-border p-4">
                    <p className="text-sm leading-relaxed text-card-foreground">{point}</p>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-card border-2 border-destructive/40 p-6">
                <p className="text-lg font-bold text-card-foreground text-center">
                  {currentScreenData.problem}
                </p>
              </Card>
            </div>
          )}

          {/* Screen 1: El Método */}
          {currentScreen === 1 && (
            <div className="flex-1 flex flex-col animate-fade-in py-4">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mb-4 animate-float">
                  <Feather className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-white">{currentScreenData.title}</h1>
                <p className="text-sm text-muted-foreground">{currentScreenData.subtitle}</p>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto mb-6">
                {currentScreenData.steps?.map((step, index) => {
                  const isVisible = index === 0 || visibleSteps.includes(index - 1);
                  
                  if (!isVisible) return null;
                  
                  return (
                    <Card key={index} className="bg-card border-2 border-primary/30 p-4 relative overflow-hidden animate-fade-in">
                      <div className="absolute top-2 right-2 w-9 h-9 rounded-full bg-yellow-400/40 border border-yellow-500/50 flex items-center justify-center">
                        <span className="text-base font-bold text-blue-600">{step.number}</span>
                      </div>
                      <div className="pr-12 mb-2">
                        <h3 className="text-sm font-bold text-primary mb-1">{step.label}</h3>
                        <p className="text-xs text-card-foreground">{step.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (expandedSteps.includes(index)) {
                              setExpandedSteps(expandedSteps.filter(i => i !== index));
                            } else {
                              setExpandedSteps([...expandedSteps, index]);
                            }
                          }}
                          className="text-xs bg-primary hover:bg-primary/90 text-white"
                        >
                          {expandedSteps.includes(index) ? "Ocultar" : "Ver"}
                        </Button>
                        {expandedSteps.includes(index) && index < currentScreenData.steps!.length - 1 && !visibleSteps.includes(index) && (
                          <Button
                            size="sm"
                            onClick={() => handleStepOk(index)}
                            className="text-xs bg-accent hover:bg-accent/90 text-white font-semibold"
                          >
                            Ok
                          </Button>
                        )}
                      </div>
                      
                      {expandedSteps.includes(index) && step.example && (
                        <div className="mt-4 pt-4 border-t border-border space-y-2 animate-fade-in">
                          {step.example.words && (
                            <div className="space-y-1">
                              {step.example.words.map((word: any, i: number) => (
                                <div key={i} className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">{word.spanish}</span>
                                  <span className="text-card-foreground font-medium">{word.english}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {step.example.phrase && !step.example.highlights && (
                            <p className="text-sm font-medium text-card-foreground bg-muted/50 p-3 rounded">
                              {step.example.phrase}
                            </p>
                          )}
                          {step.example.phrase && step.example.highlights && (
                            <p className="text-sm font-medium text-card-foreground bg-muted/50 p-3 rounded">
                              {step.example.phrase.split(' ').map((word: string, i: number) => {
                                const cleanWord = word.replace(/[.,!?]/, '');
                                const isHighlight = step.example.highlights.includes(cleanWord);
                                return (
                                  <span key={i}>
                                    <span className={isHighlight ? "text-accent font-bold" : ""}>
                                      {word}
                                    </span>
                                    {i < step.example.phrase.split(' ').length - 1 ? ' ' : ''}
                                  </span>
                                );
                              })}
                            </p>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
              
              {expandedSteps.includes(4) && (
                <Card className="relative overflow-hidden border-2 border-accent p-5 animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/50 via-primary/50 to-accent/50 animate-[gradient_3s_ease_infinite] bg-[length:200%_100%]"></div>
                  <p className="relative text-base font-bold text-center text-card-foreground">
                    {currentScreenData.promise}
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Screen 2: Prueba Social & CTA */}
          {currentScreen === 2 && (
            <div className="flex-1 flex flex-col justify-center animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 border-2 border-accent mb-6 animate-float">
                  <Target className="w-10 h-10 text-accent" />
                </div>
                <h1 className="text-2xl font-bold mb-3 text-white">{currentScreenData.title}</h1>
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
                <Card className="relative overflow-hidden border-2 border-accent p-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/50 via-primary/50 to-accent/50 animate-[gradient_3s_ease_infinite] bg-[length:200%_100%]"></div>
                  <p className="relative text-xl font-bold text-center mb-2 text-card-foreground">
                    {currentScreenData.finalCall}
                  </p>
                  <p className="relative text-lg font-bold text-center text-gray-900">
                    Empieza <span className="text-accent underline decoration-2">gratis</span> hoy mismo
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer with Action Button */}
      <footer className="p-4">
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
                className="w-full py-6 text-base bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold border-2 border-yellow-300"
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
