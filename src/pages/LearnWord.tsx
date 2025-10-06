import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Volume2, Check, RotateCcw, Sparkles, Mic, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Importar imágenes fijas
import frescas1 from '@/assets/words/frescas-1.jpg';
import frescas2 from '@/assets/words/frescas-2.jpg';
import frescas3 from '@/assets/words/frescas-3.jpg';
import frescas4 from '@/assets/words/frescas-4.jpg';
import mercado1 from '@/assets/words/mercado-1.jpg';
import mercado2 from '@/assets/words/mercado-2-new.jpg';
import mercado3 from '@/assets/words/mercado-3-new.jpg';
import mercado4 from '@/assets/words/mercado-4-new.jpg';
import quiero1 from '@/assets/words/quiero-1.jpg';
import quiero2 from '@/assets/words/quiero-2.jpg';
import quiero3 from '@/assets/words/quiero-3.jpg';
import quiero4 from '@/assets/words/quiero-4.jpg';
import pan1 from '@/assets/words/pan-1.jpg';
import pan2 from '@/assets/words/pan-2.jpg';
import pan3 from '@/assets/words/pan-3.jpg';
import pan4 from '@/assets/words/pan-4.jpg';
import el1 from '@/assets/words/el-1.jpg';
import el2 from '@/assets/words/el-2.jpg';
import el3 from '@/assets/words/el-3.jpg';
import el4 from '@/assets/words/el-4.jpg';
import frutas1 from '@/assets/words/frutas-1.jpg';
import frutas2 from '@/assets/words/frutas-2.jpg';
import frutas3 from '@/assets/words/frutas-3.jpg';
import frutas4 from '@/assets/words/frutas-4.jpg';
import verduras1 from '@/assets/words/verduras-1.jpg';
import verduras2 from '@/assets/words/verduras-2.jpg';
import verduras3 from '@/assets/words/verduras-3.jpg';
import verduras4 from '@/assets/words/verduras-4.jpg';
import comprar1 from '@/assets/words/comprar-1.jpg';
import comprar2 from '@/assets/words/comprar-2.jpg';
import comprar3 from '@/assets/words/comprar-3.jpg';
import comprar4 from '@/assets/words/comprar-4.jpg';
import en1 from '@/assets/words/en-1.jpg';
import en2 from '@/assets/words/en-2.jpg';
import en3 from '@/assets/words/en-3.jpg';
import en4 from '@/assets/words/en-4.jpg';
import carne1 from '@/assets/words/carne-1.jpg';
import carne2 from '@/assets/words/carne-2.jpg';
import carne3 from '@/assets/words/carne-3.jpg';
import carne4 from '@/assets/words/carne-4.jpg';

interface LearningModule {
  id: number;
  title: string;
  completed: boolean;
}

interface ImageOption {
  id: number;
  url: string;
  isCorrect: boolean;
}

const LearnWord = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const wordId = searchParams.get("id");
  const rawSpanish = searchParams.get("spanish") || "";
  const english = searchParams.get("english") || "";
  const spanish = english.toLowerCase().trim() === "strumming" ? "rasgueando" : rawSpanish;
  const note = searchParams.get("note") || "";
  const displayNote = english.toLowerCase().trim() === "strumming" ? "Rasgueando" : note;

  const [currentModule, setCurrentModule] = useState(0);

  // Detectar el primer módulo no completado al cargar
  useEffect(() => {
    const saved = localStorage.getItem("vocabulary_day1_progress");
    if (saved && wordId) {
      try {
        const savedWords = JSON.parse(saved);
        const currentWord = savedWords.find((w: any) => w.id === parseInt(wordId));
        if (currentWord?.inProgress) {
          // Si está en progreso, ir al módulo 4 (pronunciación - ahora al final)
          setCurrentModule(4);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
  }, [wordId]);
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [selectedMeaningOption, setSelectedMeaningOption] = useState<string | null>(null);
  const [spellingAttempt, setSpellingAttempt] = useState("");
  const [jumbledLetters, setJumbledLetters] = useState<string[]>([]);
  const [usedLetterIndices, setUsedLetterIndices] = useState<number[]>([]);
  const [imageOptions, setImageOptions] = useState<ImageOption[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const verifyTimeoutRef = useRef<number | null>(null);
  const clearVerifyTimeout = () => {
    if (verifyTimeoutRef.current) {
      clearTimeout(verifyTimeoutRef.current);
      verifyTimeoutRef.current = null;
    }
  };
  const modules: LearningModule[] = [
    { id: 0, title: "Significado", completed: false },
    { id: 1, title: "Escritura", completed: false },
    { id: 2, title: "Ortografía", completed: false },
    { id: 3, title: "Imagen", completed: false },
    { id: 4, title: "Pronunciación", completed: false },
  ];

  const [moduleProgress, setModuleProgress] = useState(modules);
  const progress = (moduleProgress.filter(m => m.completed).length / modules.length) * 100;

  // Sonido de éxito
  const playSuccessSound = () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  };

  const handlePlayAudio = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(english);
      utterance.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Error playing audio:", e);
    }
  };

  // Funciones de grabación
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      // Configurar reconocimiento de voz en paralelo a la grabación
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "No soportado",
          description: "Tu navegador no soporta reconocimiento de voz",
          variant: "destructive",
        });
      } else {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          const targetWord = english.toLowerCase().trim();

          if (transcript === targetWord || transcript.includes(targetWord)) {
            playSuccessSound();
            toast({
              title: "¡Excelente pronunciación!",
              description: "Pronunciación correcta. Avanzando...",
              duration: 1500,
              className: "bg-green-500 text-white border-green-600",
            });

            setModuleProgress(prev => prev.map(m =>
              m.id === 4 ? { ...m, completed: true } : m
            ));

            setTimeout(() => {
              setCurrentModule(5);
              setRecordedAudio(null);
              setIsVerifying(false);
            }, 1000);
          } else {
            toast({
              title: "Intentar nuevamente",
              description: `Escuchamos: "${transcript}". Intenta pronunciar: "${english}"`,
              variant: "destructive",
              duration: 1500,
            });
            // Permitir repetir la grabación sin avanzar
            clearVerifyTimeout();
            setRecordedAudio(null);
            setIsVerifying(false);
          }
        };

        recognition.onerror = () => {
          toast({
            title: "Error",
            description: "No se pudo verificar la pronunciación. Intenta de nuevo",
            variant: "destructive",
            duration: 1500,
          });
          // Permitir repetir la grabación
          clearVerifyTimeout();
          setRecordedAudio(null);
          setIsVerifying(false);
        };

        recognition.onend = () => {
          // Si no llegó resultado, aseguramos reactivar el botón
          clearVerifyTimeout();
          setIsVerifying(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      }

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      setIsVerifying(true);
      mediaRecorder.stop();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      // Fallback para evitar que el botón quede deshabilitado si no llega resultado
      clearVerifyTimeout();
      verifyTimeoutRef.current = window.setTimeout(() => {
        setIsVerifying(false);
      }, 3000);
    }
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      const audioUrl = URL.createObjectURL(recordedAudio);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  // Verificación de pronunciación integrada al flujo de grabación con SpeechRecognition.


  // Generar opciones de significado
  const getMeaningOptions = () => {
    const distractors = ["always", "can", "get", "want", "yesterday", "all", "seem", "must", "time"];
    const filtered = distractors.filter(d => d !== english.toLowerCase());
    const randomDistractors = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
    return [english, ...randomDistractors].sort(() => Math.random() - 0.5);
  };

  // Generar letras desordenadas para ortografía
  const generateJumbledLetters = (word: string) => {
    const letters = word.toLowerCase().replace(/ /g, '').split('');
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const distractors: string[] = [];
    
    while (distractors.length < 3) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!letters.includes(randomLetter)) {
        distractors.push(randomLetter);
      }
    }
    
    return [...letters, ...distractors].sort(() => Math.random() - 0.5);
  };

  // Cargar imágenes fijas
  const loadFixedImages = () => {
    setIsLoadingImages(true);
    try {
      const wordImageSets: Record<string, string[]> = {
        'fresh': [frescas4, frescas1, frescas2, frescas3],
        'market': [mercado1, mercado2, mercado3, mercado4],
        'i want': [quiero1, quiero2, quiero3, quiero4],
        'bread': [pan1, pan2, pan3, pan4],
        'the': [el1, el2, el3, el4],
        'fruits': [frutas1, frutas2, frutas3, frutas4],
        'vegetables': [verduras1, verduras2, verduras3, verduras4],
        'to buy': [comprar1, comprar2, comprar3, comprar4],
        'in': [en3, en1, en2, en4],
        'at': [en2, en1, en3, en4],
        'meat': [carne1, carne2, carne3, carne4],
      };

      const wordKey = english.toLowerCase();
      const images = wordImageSets[wordKey] || [frescas1, frescas2, frescas3, frescas4];
      
      const imageOptions: ImageOption[] = images.map((url, index) => ({
        id: index,
        url,
        isCorrect: index === 0
      }));

      setImageOptions(imageOptions.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las imágenes",
        variant: "destructive",
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    return () => {
      clearVerifyTimeout();
    };
  }, []);

  useEffect(() => {
    if (currentModule === 2) {
      setJumbledLetters(generateJumbledLetters(english));
    } else if (currentModule === 3 && imageOptions.length === 0) {
      loadFixedImages();
    }
  }, [currentModule]);

  // Manejar selección de significado
  const handleMeaningSelection = (option: string) => {
    setSelectedMeaningOption(option);
    const isCorrect = option.toLowerCase() === english.toLowerCase();
    
    if (isCorrect) {
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Excelente trabajo",
        duration: 1500,
        className: "bg-green-500 text-white border-green-600",
      });
      
      setTimeout(() => {
        setModuleProgress(prev => prev.map(m => 
          m.id === currentModule ? { ...m, completed: true } : m
        ));
        setCurrentModule(currentModule + 1);
        setSelectedMeaningOption(null);
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 1500,
      });
      setTimeout(() => setSelectedMeaningOption(null), 1000);
    }
  };

  // Manejar verificación de escritura
  const handleCheckWriting = () => {
    const isCorrect = userInput.toLowerCase().trim() === english.toLowerCase().trim();
    
    if (isCorrect) {
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Excelente trabajo",
        duration: 1500,
        className: "bg-green-500 text-white border-green-600",
      });
      
      setTimeout(() => {
        setModuleProgress(prev => prev.map(m => 
          m.id === currentModule ? { ...m, completed: true } : m
        ));
        setCurrentModule(currentModule + 1);
        setUserInput("");
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  // Manejar botón de pronunciación
  const handlePronunciationButton = () => {
    if (isRecording) {
      handleStopRecording();
    } else if (recordedAudio) {
      handlePlayRecording();
    } else {
      handleStartRecording();
    }
  };

  // Manejar ortografía
  const handleLetterClick = (letter: string, index: number) => {
    if (!usedLetterIndices.includes(index)) {
      setSpellingAttempt(prev => prev + letter);
      setUsedLetterIndices(prev => [...prev, index]);
    }
  };

  const handleRemoveLastLetter = () => {
    if (spellingAttempt.length > 0) {
      setSpellingAttempt(prev => prev.slice(0, -1));
      setUsedLetterIndices(prev => prev.slice(0, -1));
    }
  };

  const handleCheckSpelling = () => {
    const isCorrect = spellingAttempt.toLowerCase() === english.toLowerCase().replace(/ /g, '');
    
    if (isCorrect) {
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Excelente trabajo",
        duration: 1500,
        className: "bg-green-500 text-white border-green-600",
      });
      
      setTimeout(() => {
        setModuleProgress(prev => prev.map(m => 
          m.id === currentModule ? { ...m, completed: true } : m
        ));
        setCurrentModule(currentModule + 1);
        setSpellingAttempt("");
        setUsedLetterIndices([]);
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  // Manejar selección de imagen
  const handleImageSelection = (imageId: number) => {
    setSelectedImageId(imageId);
    const selectedImage = imageOptions.find(img => img.id === imageId);
    
    if (selectedImage?.isCorrect) {
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Has identificado la imagen correcta",
        duration: 1500,
        className: "bg-green-500 text-white border-green-600",
      });
      
      setTimeout(() => {
        setModuleProgress(prev => prev.map(m => 
          m.id === currentModule ? { ...m, completed: true } : m
        ));
        // Este es el último módulo, ir a resumen
        setCurrentModule(currentModule + 1);
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 1500,
      });
      setTimeout(() => setSelectedImageId(null), 1000);
    }
  };

  const renderModule = () => {
    switch (currentModule) {
      case 0: // Significado
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2 text-center gradient-text-primary">
                ¿Qué significa?
              </h3>
              <p className="text-center text-3xl font-bold text-primary mb-8">
                {spanish.charAt(0).toUpperCase() + spanish.slice(1)}
              </p>
              
              {displayNote && (
                <p className="text-sm text-center text-muted-foreground italic mb-6 bg-primary/5 p-3 rounded-lg">
                  {displayNote}
                </p>
              )}
              
              <div className="space-y-3">
                {getMeaningOptions().map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full h-14 text-lg ${
                      selectedMeaningOption === option
                        ? option.toLowerCase() === english.toLowerCase()
                          ? "bg-green-500/20 border-green-500 hover:bg-green-500/30"
                          : "bg-red-500/20 border-red-500 hover:bg-red-500/30"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => handleMeaningSelection(option)}
                    disabled={selectedMeaningOption !== null}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        );

      case 1: // Escritura
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2 text-center gradient-text-primary">
                Escribe la palabra en Inglés
              </h3>
              <p className="text-center text-lg text-muted-foreground mb-6">
                ¿Cómo se dice "<span className="text-primary font-semibold">{spanish}</span>" en inglés?
              </p>
              
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Escribe aquí..."
                className="text-center text-xl h-14 mb-4"
                onKeyDown={(e) => e.key === "Enter" && handleCheckWriting()}
                autoComplete="off"
              />
              
              <Button
                onClick={handleCheckWriting}
                className="w-full h-12 gradient-animated"
                disabled={!userInput.trim()}
              >
                Verificar
              </Button>
            </Card>
          </motion.div>
        );

      case 2: // Ortografía
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2 text-center gradient-text-primary">
                Deletrea la palabra
              </h3>
              <p className="text-center text-lg text-muted-foreground mb-6">
                Forma la palabra: <span className="text-primary font-semibold">{english}</span>
              </p>
              
              {/* Área de respuesta */}
              <div className="min-h-[80px] bg-secondary/30 border-2 border-dashed border-border rounded-lg p-4 mb-6 flex items-center justify-center">
                <p className="text-2xl font-bold tracking-wider text-primary">
                  {spellingAttempt || " "}
                </p>
              </div>
              
              {/* Botones de letras */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {jumbledLetters.map((letter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-12 h-12 text-xl font-bold ${
                      usedLetterIndices.includes(index) ? "opacity-30" : ""
                    }`}
                    onClick={() => handleLetterClick(letter, index)}
                    disabled={usedLetterIndices.includes(index)}
                  >
                    {letter.toUpperCase()}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleRemoveLastLetter}
                  disabled={spellingAttempt.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Borrar Última
                </Button>
                <Button
                  className="flex-1 gradient-animated"
                  onClick={handleCheckSpelling}
                  disabled={spellingAttempt.length === 0}
                >
                  Verificar
                </Button>
              </div>
            </Card>
          </motion.div>
        );

      case 3: // Selección de imagen
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2 text-center gradient-text-primary">
                Selecciona la imagen correcta
              </h3>
              <p className="text-center text-lg text-muted-foreground mb-6">
                ¿Cuál imagen representa: <span className="text-primary font-semibold">{english}</span>?
              </p>
              
              {isLoadingImages ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-secondary/30 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {imageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleImageSelection(option.id)}
                      disabled={selectedImageId !== null}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageId === option.id
                          ? option.isCorrect
                            ? "border-green-500 ring-4 ring-green-500/20"
                            : "border-red-500 ring-4 ring-red-500/20"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <img
                        src={option.url}
                        alt={`Opción ${option.id + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        );

      case 4: // Pronunciación
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-center gradient-text-primary">
                Escucha y Pronuncia
              </h3>
              
              <div className="flex justify-center items-center gap-4 mb-8">
                <p className="text-3xl font-bold text-primary">
                  {english.charAt(0).toUpperCase() + english.slice(1)}
                </p>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-14 h-14 rounded-full hover:bg-primary/10"
                  onClick={handlePlayAudio}
                >
                  <Volume2 className="w-6 h-6 text-primary" />
                </Button>
              </div>
              
              <p className="text-center text-muted-foreground mb-6">
                {isVerifying
                  ? "Verificando tu pronunciación..."
                  : "Escucha la palabra y practica tu pronunciación"}
              </p>
              
              <Button
                onClick={handlePronunciationButton}
                disabled={isVerifying}
                className={`w-full h-12 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'gradient-animated'
                }`}
              >
                <Mic className="w-5 h-5 mr-2" />
                {isRecording 
                  ? 'Detener grabación' 
                  : 'Practica tu pronunciación'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  // Trackear visitas al módulo 4 (pronunciación ahora al final)
                  const visitKey = `module4_visits_word_${wordId}`;
                  const visits = parseInt(localStorage.getItem(visitKey) || "0");
                  const newVisits = visits + 1;
                  localStorage.setItem(visitKey, newVisits.toString());

                  // Marcar módulo como NO completado y guardar estado "en progreso"
                  const saved = localStorage.getItem("vocabulary_day1_progress");
                  if (saved) {
                    try {
                      const savedWords = JSON.parse(saved);
                      const updatedWords = savedWords.map((w: any) => 
                        w.id === parseInt(wordId || "0") 
                          ? { ...w, inProgress: true, learned: false } 
                          : w
                      );
                      localStorage.setItem("vocabulary_day1_progress", JSON.stringify(updatedWords));
                    } catch (error) {
                      console.error("Error updating progress:", error);
                    }
                  }

                  // Si es la 2da visita, ir a la lista
                  if (newVisits >= 2) {
                    navigate("/vocabulario-dia-1");
                  } else {
                    setCurrentModule(5);
                  }
                }}
                className="w-full h-12 mt-4"
              >
                Hacer después, continuar
              </Button>
            </Card>
          </motion.div>
        );

      case 5: // Resumen final
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-primary">
                ¡Palabra Aprendida!
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-3xl font-bold text-foreground">
                      {spanish.charAt(0).toUpperCase() + spanish.slice(1)}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      =
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {english.charAt(0).toUpperCase() + english.slice(1)}
                    </p>
                  </div>
                </div>
                
                {displayNote && (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-sm font-medium text-primary">
                      📝 {displayNote}
                    </p>
                  </div>
                )}
              </div>
            </Card>
            
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="gradient-animated w-full max-w-xs mx-auto"
                onClick={() => {
                  // Marcar palabra como aprendida solo cuando se completen todos los módulos
                  if (moduleProgress.every(m => m.completed)) {
                    playSuccessSound();
                    const saved = localStorage.getItem("vocabulary_day1_progress");
                    if (saved) {
                      try {
                        const savedWords = JSON.parse(saved);
                        const updatedWords = savedWords.map((w: any) => 
                          w.id === parseInt(wordId || "0") 
                            ? { ...w, learned: true, inProgress: false } 
                            : w
                        );
                        localStorage.setItem("vocabulary_day1_progress", JSON.stringify(updatedWords));
                      } catch (error) {
                        console.error("Error updating progress:", error);
                      }
                    }
                    const toastDiv = document.createElement('div');
                    toastDiv.className = 'fixed inset-0 flex items-center justify-center z-[100] bg-black/50';
                    toastDiv.innerHTML = `
                      <div class="bg-card border border-border rounded-xl p-8 shadow-2xl max-w-md mx-4 text-center">
                        <p class="text-lg text-muted-foreground mb-2">Palabra aprendida</p>
                        <p class="text-4xl font-bold gradient-text-primary my-4">${english.charAt(0).toUpperCase() + english.slice(1)}</p>
                        <p class="text-lg text-muted-foreground mt-2">se ha agregado a tu vocabulario</p>
                      </div>
                    `;
                    document.body.appendChild(toastDiv);
                    setTimeout(() => {
                      document.body.removeChild(toastDiv);
                      navigate("/vocabulario-dia-1");
                    }, 2000);
                  } else {
                    // Si no se completaron todos los módulos, solo volver sin marcar como aprendida
                    navigate("/vocabulario-dia-1");
                  }
                }}
              >
                {moduleProgress.every(m => m.completed) ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Marcar como aprendida
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Ir a la lista
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full max-w-xs mx-auto"
                onClick={() => setCurrentModule(4)}
              >
                <Mic className="w-5 h-5 mr-2" />
                Ir a Pronunciar
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full max-w-xs mx-auto"
                onClick={() => {
                  setCurrentModule(0);
                  setUserInput("");
                  setAttempts(0);
                  setSpellingAttempt("");
                  setUsedLetterIndices([]);
                  setSelectedImageId(null);
                  setImageOptions([]);
                  setModuleProgress(modules.map(m => ({ ...m, completed: false })));
                }}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Repasar palabra
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vocabulario-dia-1")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
          
          <Badge variant="secondary" className="text-sm">
            Módulo {currentModule + 1} de {modules.length}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10"
            onClick={() => {
              if (currentModule > 0) {
                setCurrentModule(currentModule - 1);
                setUserInput("");
                setAttempts(0);
                setSpellingAttempt("");
                setUsedLetterIndices([]);
                setSelectedImageId(null);
              }
            }}
            disabled={currentModule === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Anterior</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-8 max-w-4xl">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {moduleProgress.filter(m => m.completed).length} de {modules.length} módulos completados
          </p>
        </motion.div>

        {/* Module Content */}
        <AnimatePresence mode="wait">
          {renderModule()}
        </AnimatePresence>

        {/* Module Navigation */}
        <div className="mt-8 flex justify-center gap-2">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className={`w-3 h-3 rounded-full transition-all ${
                module.completed
                  ? "bg-primary"
                  : index === currentModule
                  ? "bg-primary/50 scale-125"
                  : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LearnWord;
