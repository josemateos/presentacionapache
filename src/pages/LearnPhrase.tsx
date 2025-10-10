import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Volume2, Lightbulb, Star, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhraseData {
  spanishWords: string[];
  apacheSpanishSolution: string[];
  apacheSpanishBank: string[];
  apacheEnglishSolution: string[];
  finalEnglishSolution: string[];
  auxiliary: string;
}

// Datos de las frases con sus ejercicios
const phrasesExerciseData: Record<number, PhraseData> = {
  1: {
    spanishWords: ["Quiero", "comprar", "frutas", "frescas", "en", "el", "mercado"],
    apacheSpanishBank: ["Yo", "Quiero", "comprar", "frutas", "fresca", "en", "el", "mercado", "querer", "frescas", "ahora"],
    apacheSpanishSolution: ["yo", "querer", "comprar", "fresca", "frutas", "en", "el", "mercado"],
    apacheEnglishSolution: ["I", "want", "buy", "fresh", "fruits", "at", "the", "market"],
    finalEnglishSolution: ["I", "want", "to", "buy", "fresh", "fruits", "at", "the", "market"],
    auxiliary: "to",
  },
  2: {
    spanishWords: ["Rasgueando", "mi", "dolor", "con", "sus", "dedos"],
    apacheSpanishBank: ["Él", "Rasguear", "mi", "dolor", "con", "sus", "dedos", "rasgueando", "dedo"],
    apacheSpanishSolution: ["él", "rasguear", "mi", "dolor", "con", "sus", "dedos"],
    apacheEnglishSolution: ["he", "strum", "my", "pain", "with", "his", "fingers"],
    finalEnglishSolution: ["he", "is", "strumming", "my", "pain", "with", "his", "fingers"],
    auxiliary: "is",
  },
};

const LearnPhrase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const phraseId = parseInt(searchParams.get("id") || "1");
  const day = parseInt(searchParams.get("day") || "1");
  const englishPhrase = searchParams.get("english") || "";
  const spanishPhrase = searchParams.get("spanish") || "";

  const [currentStep, setCurrentStep] = useState(1);
  const [userAttemptSpanish, setUserAttemptSpanish] = useState<string[]>([]);
  const [userAttemptEnglish, setUserAttemptEnglish] = useState<string[]>([]);
  const [userAuxiliary, setUserAuxiliary] = useState("");
  const [finalPhrase, setFinalPhrase] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isStepComplete, setIsStepComplete] = useState(false);
  
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  const exerciseData = phrasesExerciseData[phraseId] || phrasesExerciseData[1];

  useEffect(() => {
    if (currentStep === 1) {
      const utterance = new SpeechSynthesisUtterance(spanishPhrase);
      utterance.lang = "es-ES";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentStep, spanishPhrase]);

  // Asegurar que el ejercicio 5 esté editable al llegar
  useEffect(() => {
    if (currentStep === 5) {
      setIsStepComplete(false);
      setFeedback("");
    }
  }, [currentStep]);

  const handleWordClick = (word: string) => {
    if (!isStepComplete) {
      setUserAttemptSpanish([...userAttemptSpanish, word]);
      setFeedback("");
    }
  };

  const removeLastWord = () => {
    if (userAttemptSpanish.length > 0) {
      setUserAttemptSpanish(userAttemptSpanish.slice(0, -1));
      setFeedback("");
    }
  };

  const checkSpanishSolution = () => {
    const userLower = userAttemptSpanish.map(w => w.toLowerCase());
    const isCorrect = JSON.stringify(userLower) === JSON.stringify(exerciseData.apacheSpanishSolution);
    
    if (isCorrect) {
      setFeedback("¡Correcto! Has ordenado la frase en Español Apache");
      setIsStepComplete(true);
      // Scroll para mostrar el botón de continuar
      setTimeout(() => {
        if (step2Ref.current) {
          step2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    } else {
      setFeedback("Intenta de nuevo. Revisa el orden de las palabras");
      toast({
        title: "Intenta nuevamente",
        description: "El orden no es correcto",
        variant: "destructive",
      });
    }
  };

  const handleEnglishInputChange = (index: number, value: string) => {
    const newAttempt = [...userAttemptEnglish];
    newAttempt[index] = value;
    setUserAttemptEnglish(newAttempt);
  };

  const getInputColorClass = (index: number, value: string) => {
    if (!value) return "";
    // Para "I" (yo), debe ser mayúscula exacta
    const isCorrect = value === exerciseData.apacheEnglishSolution[index];
    return isCorrect 
      ? "text-green-500 bg-green-500/20 border-green-500" 
      : "text-red-500 bg-red-500/20 border-red-500";
  };

  const getAuxiliaryColorClass = () => {
    if (!userAuxiliary) return "";
    const isCorrect = userAuxiliary.toLowerCase().trim() === exerciseData.auxiliary;
    return isCorrect 
      ? "text-green-500 bg-green-500/20 border-green-500" 
      : "text-red-500 bg-red-500/20 border-red-500";
  };

  const checkEnglishSolution = () => {
    // Validar con case-sensitive para "I" mayúscula
    const userTrimmed = userAttemptEnglish.map(w => w.trim());
    const isCorrect = JSON.stringify(userTrimmed) === JSON.stringify(exerciseData.apacheEnglishSolution);
    
    if (isCorrect) {
      setFeedback("¡Perfecto! Has traducido correctamente al Inglés Apache");
      setIsStepComplete(true);
      // Scroll para mostrar el botón de continuar
      setTimeout(() => {
        if (step3Ref.current) {
          step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    } else {
      setFeedback("Algunas palabras no son correctas. Revisa tu traducción");
      toast({
        title: "Revisa tu traducción",
        description: "Hay algunas palabras incorrectas",
        variant: "destructive",
      });
    }
  };

  const checkAuxiliary = () => {
    const isCorrect = userAuxiliary.toLowerCase().trim() === exerciseData.auxiliary.toLowerCase();
    
    if (isCorrect) {
      setFeedback("¡Excelente! Has completado la frase en Inglés perfecto");
      setIsStepComplete(true);
      setTimeout(() => {
        setCurrentStep(5);
        setIsStepComplete(false);
        setFeedback("");
      }, 500);
    } else {
      setFeedback("El auxiliar no es correcto. Intenta de nuevo");
    }
  };

  const checkFinalPhrase = () => {
    const userTrimmed = finalPhrase.trim();
    const correctPhrase = exerciseData.finalEnglishSolution.join(" ");
    
    if (userTrimmed === correctPhrase) {
      setFeedback("¡Perfecto! Has dominado esta frase completamente");
      setIsStepComplete(true);
      
      // Marcar como aprendida
      const savedKey = `phrases_day${day}_progress`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        const phrases = JSON.parse(saved);
        const updated = phrases.map((p: any) => 
          p.id === phraseId ? { ...p, learned: true } : p
        );
        localStorage.setItem(savedKey, JSON.stringify(updated));
      }
    } else {
      setFeedback("No es correcto. Revisa tu respuesta o repasa los ejercicios");
      toast({
        title: "Respuesta incorrecta",
        description: "Intenta nuevamente o repasa los pasos anteriores",
        variant: "destructive",
      });
    }
  };

  const goToNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setIsStepComplete(false);
      setFeedback("");
      
      // Inicializar el array de inglés cuando llegamos al paso 3
      if (currentStep === 2) {
        setUserAttemptEnglish(new Array(exerciseData.apacheEnglishSolution.length).fill(""));
      }
      
      // Scroll to center the next step
      setTimeout(() => {
        const refs = [null, step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];
        const nextRef = refs[currentStep + 1];
        if (nextRef?.current) {
          nextRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Fallback attempt after render settles
        setTimeout(() => {
          if (nextRef?.current) {
            nextRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      }, 120);
    } else {
      navigate(`/phrases-day?day=${day}`);
    }
  };

  const goToPreviousSteps = () => {
    setCurrentStep(1);
    setIsStepComplete(false);
    setFeedback("");
    setUserAttemptSpanish([]);
    setUserAttemptEnglish([]);
    setUserAuxiliary("");
    setFinalPhrase("");
  };

  return (
    <div className="min-h-screen bg-background dark">
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/phrases-day?day=${day}`)}
              className="gap-2 text-white hover:text-white/80"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Frase {phraseId}</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Paso 1: Frase en Español */}
        {currentStep >= 1 && currentStep < 5 && (
        <Card ref={step1Ref} className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">1</span>
            </div>
          <div>
              <h2 className="text-lg font-semibold text-foreground">Tu Frase en Español</h2>
              <p className="text-sm text-muted-foreground">Lo que quieres comunicar</p>
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4 mb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {exerciseData.spanishWords.map((word, index) => (
                <span key={index} className="px-3 py-2 bg-secondary text-foreground rounded-md font-medium">
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {currentStep === 1 && (
              <Button onClick={goToNextStep}>
                Entendido
              </Button>
            )}
          </div>
        </Card>
        )}

        {/* Paso 2: Español Apache */}
        {currentStep >= 2 && currentStep < 5 && (
          <Card ref={step2Ref} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Traduce a Español Apache</h2>
                <p className="text-sm text-muted-foreground">Haz clic en las palabras para formar la frase</p>
              </div>
            </div>

            {/* Área donde se forman las palabras */}
            <div className="bg-background/50 rounded-lg p-4 mb-4 min-h-24 border-2 border-dashed border-border">
              <div className="flex flex-wrap gap-2 justify-center">
                {userAttemptSpanish.map((word, index) => (
                  <span key={index} className="px-3 py-2 bg-secondary text-foreground rounded-md font-medium">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Banco de palabras */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4 border border-border">
              <div className="flex flex-wrap gap-2 justify-center">
                {exerciseData.apacheSpanishBank.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordClick(word)}
                    disabled={isStepComplete}
                    className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button variant="outline" onClick={removeLastWord} disabled={isStepComplete || currentStep > 2}>
                Borrar
              </Button>
              <Button variant="outline" onClick={() => setShowTipsModal(true)}>
                <Lightbulb className="w-4 h-4 mr-2" />
                Tips
              </Button>
              <Button onClick={checkSpanishSolution} disabled={isStepComplete || currentStep > 2}>
                Verificar
              </Button>
            </div>

            {feedback && (
              <p className={`text-sm text-center ${feedback.includes("Correcto") ? "text-green-500" : "text-red-500"}`}>
                {feedback}
              </p>
            )}

            {isStepComplete && currentStep === 2 && (
              <Button onClick={goToNextStep} className="w-full mt-4">
                Continuar
              </Button>
            )}
          </Card>
        )}

        {/* Paso 3: Inglés Apache */}
        {currentStep >= 3 && currentStep < 5 && (
          <Card ref={step3Ref} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Escribe en Inglés Apache</h2>
                <p className="text-sm text-muted-foreground">Escribe la traducción de cada palabra</p>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4 mb-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {exerciseData.apacheSpanishSolution.map((word, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">{word}</span>
                    <Input
                      value={userAttemptEnglish[index] || ""}
                      onChange={(e) => handleEnglishInputChange(index, e.target.value)}
                      disabled={isStepComplete}
                      className={`w-24 text-center transition-colors ${getInputColorClass(index, userAttemptEnglish[index] || "")}`}
                      placeholder="..."
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button variant="outline" onClick={() => setShowTipsModal(true)}>
                <Lightbulb className="w-4 h-4 mr-2" />
                Tips
              </Button>
              <Button onClick={checkEnglishSolution} disabled={isStepComplete || currentStep > 3} className="flex-1">
                Verificar Frase
              </Button>
            </div>

            {feedback && (
              <p className={`text-sm text-center ${feedback.includes("Perfecto") ? "text-green-500" : "text-red-500"}`}>
                {feedback}
              </p>
            )}

            {isStepComplete && currentStep === 3 && (
              <Button onClick={goToNextStep} className="w-full mt-4">
                Continuar
              </Button>
            )}
          </Card>
        )}

        {/* Paso 4: Inglés Perfecto */}
        {currentStep >= 4 && currentStep < 5 && (
          <Card ref={step4Ref} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">4</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">¡Inglés Perfecto!</h2>
                <p className="text-sm text-muted-foreground">Escribe el auxiliar que falta</p>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4 mb-4">
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {exerciseData.apacheEnglishSolution.map((word, index) => {
                  // Calcular dónde va el auxiliar. Si no está en finalEnglishSolution (p.ej. 'to'), usar heurística.
                  const aux = exerciseData.auxiliary?.toLowerCase();
                  const finalIndex = exerciseData.finalEnglishSolution.indexOf(exerciseData.auxiliary);
                  let insertAfterIndex = finalIndex > 0 ? finalIndex - 1 : -1;

                  if (insertAfterIndex === -1) {
                    if (aux === "to") {
                      const wantIdx = exerciseData.apacheEnglishSolution.indexOf("want");
                      const buyIdx = exerciseData.apacheEnglishSolution.indexOf("buy");
                      if (wantIdx !== -1 && buyIdx === wantIdx + 1) {
                        insertAfterIndex = wantIdx; // Insertar 'to' después de 'want'
                      }
                    } else if (aux === "is") {
                      const heIdx = exerciseData.apacheEnglishSolution.indexOf("he");
                      if (heIdx !== -1) insertAfterIndex = heIdx; // 'is' después de 'he'
                    }
                  }

                  const isAuxiliaryPosition = index === insertAfterIndex;
                  
                  return (
                    <span key={index} className="flex gap-2 items-center">
                      <span className="px-3 py-2 bg-secondary text-foreground rounded-md font-medium">
                        {word === "i" ? "I" : word}
                      </span>
                      {isAuxiliaryPosition && exerciseData.auxiliary !== "" && (
                        <Input
                          value={userAuxiliary}
                          onChange={(e) => setUserAuxiliary(e.target.value)}
                          disabled={isStepComplete || currentStep > 4}
                          className={`w-20 text-center transition-colors ${getAuxiliaryColorClass()}`}
                          placeholder="?"
                        />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPremiumModal(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Auxiliares clave
              </Button>
              <Button onClick={checkAuxiliary} disabled={isStepComplete || currentStep > 4} className="flex-1">
                Verificar
              </Button>
            </div>

            {feedback && (
              <p className={`text-sm text-center ${feedback.includes("Excelente") ? "text-green-500" : "text-red-500"}`}>
                {feedback}
              </p>
            )}

            {isStepComplete && currentStep === 4 && (
              <Button onClick={goToNextStep} className="w-full mt-4">
                Continuar
              </Button>
            )}
          </Card>
        )}

        {/* Paso 5: Escribe la frase completa */}
        {currentStep === 5 && (
          <Card ref={step5Ref} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">5</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Comprueba que sabes comunicar</h2>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4 mb-4">
              <p className="text-center text-foreground font-medium mb-2">"{exerciseData.spanishWords.join(" ")}"</p>
            </div>

            <Textarea
              value={finalPhrase}
              onChange={(e) => setFinalPhrase(e.target.value)}
              disabled={isStepComplete}
              className="w-full min-h-24 text-center text-foreground"
              placeholder="Escribe la frase en inglés aquí..."
            />

            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={goToPreviousSteps}
                disabled={isStepComplete}
              >
                Repasar ejercicios
              </Button>
              <Button onClick={checkFinalPhrase} disabled={isStepComplete} className="flex-1">
                Verificar Frase
              </Button>
            </div>

            {feedback && (
              <p className={`text-sm text-center mt-4 ${feedback.includes("Perfecto") ? "text-green-500" : "text-red-500"}`}>
                {feedback}
              </p>
            )}

            {isStepComplete && currentStep === 5 && (
              <Button 
                onClick={goToNextStep} 
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                disabled={!finalPhrase.trim()}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Ir a siguiente frase
              </Button>
            )}
          </Card>
        )}
      </main>

      {/* Modal de Tips */}
      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
        <DialogContent className="bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-accent">
              {currentStep === 2 && "Tips para Español Apache"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {currentStep === 2 ? (
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>El orden correcto es: Persona, Verbo, Objeto</li>
                  <li>En Ingles no existe "quiero, juego, aprendo" siempre se utiliza "querer, jugar, aprender"</li>
                  <li>Frutas frescas, suéter rojo, mesa grande siempre se invierte por "Frescas frutas, rojo sueter, grande mesa"</li>
                  <li>En Ingles nunca se utiliza fresca<span className="text-yellow-500">s</span>, rojo<span className="text-yellow-500">s</span>, grande<span className="text-yellow-500">s</span> solo se dice "fresca, rojo, grande"</li>
                </ul>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-foreground text-base">
                    Utiliza <strong>IN</strong> si vas a ubicar el objeto
                  </p>
                  <p className="text-foreground text-base">
                    Utiliza <strong>AT</strong> si vas a ubicar la acción.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowTipsModal(false)}>Entendido</Button>
        </DialogContent>
      </Dialog>

      {/* Modal de Premium */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className="bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-accent">Función Premium</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              <div className="mt-4 space-y-4">
                <p>La lista de auxiliares está disponible en la versión Premium.</p>
                <p className="text-sm">Con Premium obtendrás:</p>
                <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                  <li>Acceso a listas de auxiliares</li>
                  <li>Ejercicios adicionales</li>
                  <li>Contenido exclusivo</li>
                  <li>Sin anuncios</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPremiumModal(false)}>
              Cerrar
            </Button>
            <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
              Obtener Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearnPhrase;
