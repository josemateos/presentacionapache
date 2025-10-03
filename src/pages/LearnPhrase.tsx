import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Volume2, Lightbulb, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    apacheSpanishBank: ["Yo", "Quiero", "comprar", "frutas", "frescas", "en", "el", "mercado", "querer", "fresca", "ahora"],
    apacheSpanishSolution: ["yo", "querer", "comprar", "fresca", "frutas", "en", "el", "mercado"],
    apacheEnglishSolution: ["i", "want", "buy", "fresh", "fruits", "in", "the", "market"],
    finalEnglishSolution: ["i", "want", "to", "buy", "fresh", "fruits", "in", "the", "market"],
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
  const [feedback, setFeedback] = useState("");
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showAuxModal, setShowAuxModal] = useState(false);
  const [isStepComplete, setIsStepComplete] = useState(false);

  const exerciseData = phrasesExerciseData[phraseId] || phrasesExerciseData[1];

  useEffect(() => {
    if (currentStep === 1) {
      const utterance = new SpeechSynthesisUtterance(spanishPhrase);
      utterance.lang = "es-ES";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentStep, spanishPhrase]);

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
      toast({
        title: "¡Excelente!",
        description: "Paso 2 completado",
      });
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
    
    // Validar en tiempo real
    if (value.toLowerCase() === exerciseData.apacheEnglishSolution[index]) {
      // Correcto
    }
  };

  const checkEnglishSolution = () => {
    const userLower = userAttemptEnglish.map(w => w.toLowerCase().trim());
    const isCorrect = JSON.stringify(userLower) === JSON.stringify(exerciseData.apacheEnglishSolution);
    
    if (isCorrect) {
      setFeedback("¡Perfecto! Has traducido correctamente al Inglés Apache");
      setIsStepComplete(true);
      toast({
        title: "¡Excelente!",
        description: "Paso 3 completado",
      });
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
    const isCorrect = userAuxiliary.toLowerCase().trim() === exerciseData.auxiliary;
    
    if (isCorrect) {
      setFeedback("¡Excelente! Has completado la frase en Inglés perfecto");
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
      
      toast({
        title: "¡Frase completada!",
        description: "Has dominado esta frase",
      });
    } else {
      setFeedback("El auxiliar no es correcto. Intenta de nuevo");
      toast({
        title: "Auxiliar incorrecto",
        description: "Revisa la lista de auxiliares",
        variant: "destructive",
      });
    }
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setIsStepComplete(false);
      setFeedback("");
      
      // Inicializar el array de inglés cuando llegamos al paso 3
      if (currentStep === 2) {
        setUserAttemptEnglish(new Array(exerciseData.apacheEnglishSolution.length).fill(""));
      }
      
      // Scroll to center the next step
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      navigate(`/phrases-day?day=${day}`);
    }
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
              className="gap-2"
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
        <Card className={`p-6 ${currentStep > 1 ? 'opacity-50' : ''}`}>
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

        {/* Paso 2: Español Apache */}
        {currentStep >= 2 && (
          <Card className={`p-6 ${currentStep > 2 ? 'opacity-50' : ''}`}>
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
              <Button variant="outline" onClick={removeLastWord} disabled={isStepComplete}>
                Borrar
              </Button>
              <Button variant="outline" onClick={() => setShowTipsModal(true)}>
                <Lightbulb className="w-4 h-4 mr-2" />
                Tips
              </Button>
              <Button onClick={checkSpanishSolution} disabled={isStepComplete}>
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
        {currentStep >= 3 && (
          <Card className={`p-6 ${currentStep > 3 ? 'opacity-50' : ''}`}>
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
                      className="w-24 text-center"
                      placeholder="..."
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={checkEnglishSolution} disabled={isStepComplete} className="w-full mb-4">
              Verificar Frase
            </Button>

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
        {currentStep >= 4 && (
          <Card className="p-6">
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
                {exerciseData.finalEnglishSolution.map((word, index) => (
                  word === exerciseData.auxiliary ? (
                    <Input
                      key={index}
                      value={userAuxiliary}
                      onChange={(e) => setUserAuxiliary(e.target.value)}
                      disabled={isStepComplete}
                      className="w-20 text-center"
                      placeholder="?"
                    />
                  ) : (
                    <span key={index} className="px-3 py-2 bg-secondary text-foreground rounded-md font-medium">
                      {word}
                    </span>
                  )
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button variant="outline" onClick={() => setShowAuxModal(true)}>
                <Star className="w-4 h-4 mr-2" />
                Auxiliares
              </Button>
              <Button onClick={checkAuxiliary} disabled={isStepComplete} className="flex-1">
                Verificar Auxiliar
              </Button>
            </div>

            {feedback && (
              <p className={`text-sm text-center ${feedback.includes("Excelente") ? "text-green-500" : "text-red-500"}`}>
                {feedback}
              </p>
            )}

            {isStepComplete && (
              <Button onClick={goToNextStep} className="w-full mt-4 bg-green-600 hover:bg-green-700">
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
            <DialogTitle className="text-accent">Tips para Español Apache</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>El orden correcto es: Persona, Verbo, Objeto</li>
                <li>En Ingles no existe "quiero, juego, aprendo" siempre se utiliza "querer, jugar, aprender"</li>
                <li>Frutas frescas, suéter rojo, mesa grande siempre se invierte por "Frescas frutas, rojo sueter, grande mesa"</li>
                <li>En Ingles nunca se utiliza fresca<span className="text-yellow-500">s</span>, rojo<span className="text-yellow-500">s</span>, grande<span className="text-yellow-500">s</span> solo se dice "fresca, rojo, grande"</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowTipsModal(false)}>Entendido</Button>
        </DialogContent>
      </Dialog>

      {/* Modal de Auxiliares */}
      <Dialog open={showAuxModal} onOpenChange={setShowAuxModal}>
        <DialogContent className="bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-accent">Auxiliares Clave</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              <p className="mt-4">Los auxiliares más comunes son:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>to</strong> - Para infinitivos (want to eat)</li>
                <li><strong>is/are</strong> - Para presente continuo (is eating)</li>
                <li><strong>do/does</strong> - Para preguntas y negaciones</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowAuxModal(false)}>Entendido</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearnPhrase;
