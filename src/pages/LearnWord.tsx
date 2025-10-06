import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Volume2, Check, RotateCcw, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    { id: 2, title: "Pronunciación", completed: false },
    { id: 3, title: "Ortografía", completed: false },
    { id: 4, title: "Imagen", completed: false },
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
            });

            setModuleProgress(prev => prev.map(m =>
              m.id === 2 ? { ...m, completed: true } : m
            ));

            setTimeout(() => {
              setCurrentModule(3);
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

  // Generar imágenes con IA
  const generateImages = async () => {
    setIsLoadingImages(true);
    try {
      // Prompts específicos para cada palabra con imágenes relacionadas temáticamente
      const wordImageSets: Record<string, { correct: string; related: string[] }> = {
        'fresh': {
          correct: 'A pitcher of fresh cold water with ice cubes and lemon slices, colorful illustration, no text',
          related: [
            'Fresh lemons on a sunny wooden table, illustration style, no text',
            'A bright sunny day with clear blue sky and sun rays, illustration style, no text',
            'A person wiping sweat from forehead on a hot day, exhausted expression, illustration style, no text'
          ]
        },
        'market': {
          correct: 'A vibrant outdoor farmers market with colorful fruit and vegetable stalls, illustration style, no text',
          related: [
            'People shopping at a market with baskets full of produce, illustration style, no text',
            'Fresh vegetables displayed at a colorful market stall, illustration style, no text',
            'A fruit vendor arranging colorful fruits at a stand, illustration style, no text'
          ]
        },
        'i want': {
          correct: 'A person pointing at something they desire with excited expression, illustration style, no text',
          related: [
            'A child reaching for a toy with excitement and desire, illustration style, no text',
            'A person looking at something with longing desire, illustration style, no text',
            'Someone expressing a wish with hopeful gesture, illustration style, no text'
          ]
        },
        'bread': {
          correct: 'A loaf of artisan bread with crispy golden crust on cutting board, illustration style, no text',
          related: [
            'A baker pulling fresh bread from a stone oven, illustration style, no text',
            'Golden wheat stalks swaying in a sunny field, illustration style, no text',
            'Bread slices with butter on a breakfast table, illustration style, no text'
          ]
        },
        'the': {
          correct: 'An arrow pointing to a specific object highlighting selection, illustration style, no text',
          related: [
            'A pointing finger indicating one specific item, illustration style, no text',
            'A spotlight highlighting one object among many, illustration style, no text',
            'A hand gesture showing something specific, illustration style, no text'
          ]
        },
        'fruits': {
          correct: 'A colorful basket full of assorted fresh fruits - apples, oranges, bananas, grapes, illustration style, no text',
          related: [
            'An apple tree with ripe red apples hanging from branches, illustration style, no text',
            'Tropical fruits growing on palm trees in a sunny plantation, illustration style, no text',
            'A person picking fresh fruits from a tree with a basket, illustration style, no text'
          ]
        },
        'vegetables': {
          correct: 'A wooden crate filled with colorful fresh vegetables - carrots, tomatoes, lettuce, peppers, illustration style, no text',
          related: [
            'A vegetable garden with growing plants and green leaves, illustration style, no text',
            'A farmer harvesting vegetables from the garden, illustration style, no text',
            'Fresh vegetables being washed in clean water, illustration style, no text'
          ]
        },
        'to buy': {
          correct: 'Hands exchanging money for goods at a market, shopping scene, illustration style, no text',
          related: [
            'A shopping cart full of groceries in a store, illustration style, no text',
            'A person holding money and a shopping list, illustration style, no text',
            'A cashier scanning items at a register checkout, illustration style, no text'
          ]
        },
        'in': {
          correct: 'Objects inside a container or location, spatial relationship concept, illustration style, no text',
          related: [
            'Items placed within a wicker basket, illustration style, no text',
            'A person inside a cozy room, illustration style, no text',
            'Objects arranged inside a wooden cupboard, illustration style, no text'
          ]
        },
        'at': {
          correct: 'Person or object at a specific location with location marker, illustration style, no text',
          related: [
            'Someone waiting at a bus stop with a sign, illustration style, no text',
            'A person sitting at a wooden table, illustration style, no text',
            'Someone standing at a street corner intersection, illustration style, no text'
          ]
        },
        'meat': {
          correct: 'Fresh cuts of meat on a butcher block, illustration style, no text',
          related: [
            'A butcher shop with hanging meat cuts, illustration style, no text',
            'Grilled meat sizzling on a barbecue grill, illustration style, no text',
            'A chef preparing meat in a professional kitchen, illustration style, no text'
          ]
        },
      };

      const wordKey = english.toLowerCase();
      const imageSet = wordImageSets[wordKey] || {
        correct: `Visual representation of ${english} concept through objects and symbols, colorful illustration, no text`,
        related: [
          `Illustration related to ${english} theme, colorful style, no text`,
          `Illustration showing concept similar to ${english}, artistic style, no text`,
          `Illustration depicting ${english} related scene, simple style, no text`
        ]
      };

      const prompts = [imageSet.correct, ...imageSet.related];
      const generatedImages: ImageOption[] = [];
      
      for (let i = 0; i < 4; i++) {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { prompt: prompts[i] }
        });

        if (error) {
          console.error('Error generating image:', error);
          continue;
        }
        
        if (data?.imageUrl) {
          generatedImages.push({
            id: i,
            url: data.imageUrl,
            isCorrect: i === 0
          });
        }
      }

      if (generatedImages.length === 0) {
        throw new Error('No se pudieron generar las imágenes');
      }

      setImageOptions(generatedImages.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error('Error generating images:', error);
      toast({
        title: "Error",
        description: "No se pudieron generar las imágenes",
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
    if (currentModule === 3) {
      setJumbledLetters(generateJumbledLetters(english));
    } else if (currentModule === 4 && imageOptions.length === 0) {
      generateImages();
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

      case 2: // Pronunciación
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
            </Card>
          </motion.div>
        );

      case 3: // Ortografía
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

      case 4: // Selección de imagen
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
                  playSuccessSound();
                  const saved = localStorage.getItem("vocabulary_day1_progress");
                  if (saved) {
                    try {
                      const savedWords = JSON.parse(saved);
                      const updatedWords = savedWords.map((w: any) => 
                        w.id === parseInt(wordId || "0") ? { ...w, learned: true } : w
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
                }}
              >
                <Check className="w-5 h-5 mr-2" />
                Marcar como aprendida
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
              setUserInput("");
              setAttempts(0);
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Reiniciar</span>
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
