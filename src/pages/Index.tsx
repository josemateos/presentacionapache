import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Zap, Target, ArrowRight, Check } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Brain,
      title: "¿Por qué fracasan otras apps?",
      description: "Las aplicaciones tradicionales te obligan a memorizar sin comprender la lógica del idioma",
      highlight: "Una vez que lo Comprendes, lo Aprendes",
      color: "text-primary"
    },
    {
      icon: Zap,
      title: "El Método Apache",
      description: "Aprende inglés entendiendo su estructura lógica, no memorizando reglas",
      highlight: "5 pasos simples para pensar en inglés",
      color: "text-accent"
    },
    {
      icon: Target,
      title: "Tu Objetivo",
      description: "Habla inglés con confianza en 90 días siguiendo nuestro sistema probado",
      highlight: "Resultados garantizados",
      color: "text-primary"
    }
  ];

  const exampleSteps = [
    { label: "Vocabulario", content: "I • Yo | learn • aprender | speak • hablar | English • Inglés" },
    { label: "Frase en Español", content: "Me gustaría aprender a hablar Inglés rápidamente" },
    { label: "Orden Apache", content: "Yo gustar aprender hablar Inglés rápidamente" },
    { label: "Traducción Directa", content: "I like to learn to speak English quickly" },
    { label: "Auxiliar Clave", content: "I would like to learn to speak English quickly" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen gradient-hero text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">APACHE</h1>
          <Button variant="ghost" size="sm" className="text-foreground">
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">El sistema más efectivo</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Aprende Inglés
              <br />
              <span className="text-primary text-shadow-glow">Comprendiendo</span>
              <br />
              no Memorizando
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Descubre el método Apache: la forma natural de dominar el inglés en 90 días
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                Comenzar Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                Ver Cómo Funciona
              </Button>
            </div>
          </div>

          {/* Steps Carousel */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <Card className="bg-card border-2 border-border p-8 md:p-12 animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ←
                </Button>
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep 
                          ? "w-8 bg-primary" 
                          : "w-2 bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="text-muted-foreground hover:text-foreground"
                >
                  →
                </Button>
              </div>

              <div className="text-center">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className={`transition-all duration-500 ${
                        index === currentStep ? "block" : "hidden"
                      }`}
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-6 animate-float">
                        <Icon className={`w-10 h-10 ${step.color}`} />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">{step.title}</h2>
                      <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                        {step.description}
                      </p>
                      <div className="inline-block bg-accent/10 border border-accent/30 rounded-lg px-6 py-3">
                        <p className="text-xl font-bold text-accent">{step.highlight}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Example Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Ejemplo del Método Apache
            </h2>
            <div className="space-y-4">
              {exampleSteps.map((step, index) => (
                <Card 
                  key={index}
                  className="bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-primary mb-2">{step.label}</h3>
                      <p className="text-muted-foreground">{step.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { title: "Método Comprobado", description: "Miles de estudiantes han logrado hablar inglés con fluidez" },
              { title: "90 Días", description: "Programa estructurado para resultados rápidos y efectivos" },
              { title: "Sin Memorización", description: "Aprende la lógica del idioma, no reglas complicadas" }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300"
              >
                <Check className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/50 p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para Comenzar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete a miles de estudiantes que ya están transformando su forma de aprender inglés
            </p>
            <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90">
              Acceder Gratis Ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground">
        <p>&copy; 2025 Apache. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
