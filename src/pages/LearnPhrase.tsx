import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Volume2, Lightbulb, Star, CheckCircle2, Lock, ChevronLeft, List, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  // DÍA 1
  1: {
    spanishWords: ["Quiero", "comprar", "frutas", "frescas", "en", "el", "mercado"],
    apacheSpanishBank: ["Yo", "Quiero", "comprar", "frutas", "fresca", "en", "el", "mercado", "querer", "frescas", "ahora"],
    apacheSpanishSolution: ["yo", "querer", "comprar", "fresca", "frutas", "en", "el", "mercado"],
    apacheEnglishSolution: ["I", "want", "buy", "fresh", "fruits", "at", "the", "market"],
    finalEnglishSolution: ["I", "want", "to", "buy", "fresh", "fruits", "at", "the", "market"],
    auxiliary: "to",
  },
  2: {
    spanishWords: ["Me", "gusta", "leer", "un", "libro", "antes", "de", "dormir"],
    apacheSpanishBank: ["A", "mí", "me", "gustar", "leer", "un", "libro", "antes", "de", "dormir", "gusta", "lectura"],
    apacheSpanishSolution: ["a", "mí", "me", "gustar", "leer", "un", "libro", "antes", "de", "dormir"],
    apacheEnglishSolution: ["I", "like", "read", "a", "book", "before", "sleep"],
    finalEnglishSolution: ["I", "like", "to", "read", "a", "book", "before", "sleeping"],
    auxiliary: "to",
  },
  3: {
    spanishWords: ["Tienes", "que", "ir", "a", "visitarnos"],
    apacheSpanishBank: ["Tú", "tener", "que", "ir", "a", "visitar", "nosotros", "nos", "casa", "tienes"],
    apacheSpanishSolution: ["tú", "tener", "que", "ir", "a", "visitar", "nos"],
    apacheEnglishSolution: ["you", "have", "go", "visit", "us"],
    finalEnglishSolution: ["you", "have", "to", "go", "visit", "us"],
    auxiliary: "to",
  },
  4: {
    spanishWords: ["Queremos", "invitarte", "a", "comer", "mañana"],
    apacheSpanishBank: ["Nosotros", "querer", "invitar", "tu", "a", "comer", "mañana", "te", "queremos", "comida"],
    apacheSpanishSolution: ["nosotros", "querer", "invitar", "tu", "a", "comer", "mañana"],
    apacheEnglishSolution: ["we", "want", "invite", "you", "eat", "tomorrow"],
    finalEnglishSolution: ["we", "want", "to", "invite", "you", "to", "eat", "tomorrow"],
    auxiliary: "to",
  },
  5: {
    spanishWords: ["Esta", "tarde", "tengo", "una", "reunión", "de", "trabajo", "importante"],
    apacheSpanishBank: ["Esta", "tarde", "yo", "tener", "un", "reunión", "de", "trabajo", "importante", "una", "tengo"],
    apacheSpanishSolution: ["esta", "tarde", "yo", "tener", "un", "reunión", "de", "trabajo", "importante"],
    apacheEnglishSolution: ["I", "have", "important", "work", "meeting", "this", "afternoon"],
    finalEnglishSolution: ["I", "have", "an", "important", "work", "meeting", "this", "afternoon"],
    auxiliary: "an",
  },
  // DÍA 2
  6: {
    spanishWords: ["Van", "a", "pedirnos", "que", "vayamos"],
    apacheSpanishBank: ["Ellos", "ir", "a", "pedir", "nos", "que", "nosotros", "ir", "van", "vayamos"],
    apacheSpanishSolution: ["ellos", "ir", "a", "pedir", "nos", "que", "nosotros", "ir"],
    apacheEnglishSolution: ["they", "go", "ask", "us", "go"],
    finalEnglishSolution: ["they", "are", "going", "to", "ask", "us", "to", "go"],
    auxiliary: "are",
  },
  7: {
    spanishWords: ["El", "próximo", "fin", "de", "semana", "visitaré", "a", "mi", "familia"],
    apacheSpanishBank: ["El", "próximo", "fin", "de", "semana", "yo", "visitar", "a", "mi", "familia", "visitaré", "findesemana"],
    apacheSpanishSolution: ["el", "próximo", "fin", "de", "semana", "yo", "visitar", "a", "mi", "familia"],
    apacheEnglishSolution: ["I", "visit", "my", "family", "next", "weekend"],
    finalEnglishSolution: ["I", "will", "visit", "my", "family", "next", "weekend"],
    auxiliary: "will",
  },
  8: {
    spanishWords: ["Necesito", "practicar", "inglés", "todos", "los", "días"],
    apacheSpanishBank: ["Yo", "necesitar", "practicar", "inglés", "todos", "el", "días", "necesito", "los", "día"],
    apacheSpanishSolution: ["yo", "necesitar", "practicar", "inglés", "todos", "el", "días"],
    apacheEnglishSolution: ["I", "need", "practice", "English", "every", "day"],
    finalEnglishSolution: ["I", "need", "to", "practice", "English", "every", "day"],
    auxiliary: "to",
  },
  9: {
    spanishWords: ["Ella", "siempre", "es", "cariñosa"],
    apacheSpanishBank: ["Ella", "siempre", "ser", "cariñoso", "es", "cariñosa", "muy"],
    apacheSpanishSolution: ["ella", "siempre", "ser", "cariñoso"],
    apacheEnglishSolution: ["she", "is", "always", "affectionate"],
    finalEnglishSolution: ["she", "is", "always", "affectionate"],
    auxiliary: "",
  },
  10: {
    spanishWords: ["Todas", "las", "mañanas", "tomo", "café", "en", "el", "trabajo"],
    apacheSpanishBank: ["Todas", "el", "mañanas", "yo", "tomar", "café", "en", "el", "trabajo", "las", "tomo"],
    apacheSpanishSolution: ["todas", "el", "mañanas", "yo", "tomar", "café", "en", "el", "trabajo"],
    apacheEnglishSolution: ["every", "morning", "I", "drink", "coffee", "work"],
    finalEnglishSolution: ["every", "morning", "I", "drink", "coffee", "at", "work"],
    auxiliary: "at",
  },
  // DÍA 3
  11: {
    spanishWords: ["Mi", "casa", "está", "cerca", "de", "la", "escuela"],
    apacheSpanishBank: ["Mi", "casa", "estar", "cerca", "de", "el", "escuela", "está", "la", "lejos"],
    apacheSpanishSolution: ["mi", "casa", "estar", "cerca", "de", "el", "escuela"],
    apacheEnglishSolution: ["my", "house", "is", "near", "the", "school"],
    finalEnglishSolution: ["my", "house", "is", "near", "the", "school"],
    auxiliary: "",
  },
  12: {
    spanishWords: ["Soy", "estudiante", "y", "trabajo", "los", "fines", "de", "semana"],
    apacheSpanishBank: ["Yo", "ser", "estudiante", "y", "trabajar", "el", "fines", "de", "semana", "los", "trabajo"],
    apacheSpanishSolution: ["yo", "ser", "estudiante", "y", "trabajar", "el", "fines", "de", "semana"],
    apacheEnglishSolution: ["I", "am", "student", "and", "I", "work", "weekends"],
    finalEnglishSolution: ["I", "am", "a", "student", "and", "I", "work", "on", "weekends"],
    auxiliary: "a",
  },
  13: {
    spanishWords: ["El", "siempre", "se", "va", "en", "su", "coche"],
    apacheSpanishBank: ["Él", "siempre", "irse", "en", "su", "coche", "se", "va", "auto"],
    apacheSpanishSolution: ["él", "siempre", "irse", "en", "su", "coche"],
    apacheEnglishSolution: ["he", "always", "leave", "in", "his", "car"],
    finalEnglishSolution: ["he", "always", "leaves", "in", "his", "car"],
    auxiliary: "",
  },
  14: {
    spanishWords: ["Soy", "de", "Mexico", "pero", "actualmente", "vivo", "en", "Australia"],
    apacheSpanishBank: ["Yo", "ser", "de", "Mexico", "pero", "actualmente", "vivir", "en", "Australia", "soy", "vivo"],
    apacheSpanishSolution: ["yo", "ser", "de", "mexico", "pero", "actualmente", "vivir", "en", "australia"],
    apacheEnglishSolution: ["I", "am", "from", "Mexico", "but", "I", "currently", "live", "in", "Australia"],
    finalEnglishSolution: ["I", "am", "from", "Mexico", "but", "I", "currently", "live", "in", "Australia"],
    auxiliary: "",
  },
  15: {
    spanishWords: ["Tengo", "que", "llevar", "el", "automovil", "al", "taller"],
    apacheSpanishBank: ["Yo", "tener", "que", "llevar", "el", "automovil", "a", "el", "taller", "tengo", "coche"],
    apacheSpanishSolution: ["yo", "tener", "que", "llevar", "el", "automovil", "a", "el", "taller"],
    apacheEnglishSolution: ["I", "have", "take", "the", "car", "the", "workshop"],
    finalEnglishSolution: ["I", "have", "to", "take", "the", "car", "to", "the", "workshop"],
    auxiliary: "to",
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
  const [randomizedBank, setRandomizedBank] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState<string[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [resultModal, setResultModal] = useState<{ open: boolean; success: boolean; title: string; message: string }>({
    open: false,
    success: false,
    title: "",
    message: "",
  });

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);
  const step6Ref = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string[]>([]);
  const recordingStoppedRef = useRef<boolean>(false);
  const resultEvaluatedRef = useRef<boolean>(false);
  const interimByIndexRef = useRef<Record<number, string>>({});
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioRafRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const playSuccessSound = () => {
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AC) return;
      const ctx = new AC();
      const now = ctx.currentTime;
      // Arpegio alegre: C5 - E5 - G5
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = now + i * 0.12;
        const end = start + 0.22;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(end + 0.02);
      });
      setTimeout(() => ctx.close().catch(() => {}), 800);
    } catch {}
  };

  const showResult = (success: boolean, title: string, message: string) => {
    setResultModal({ open: true, success, title, message });
    if (success) playSuccessSound();
  };

  const stopAudioMeter = () => {
    if (audioRafRef.current) {
      cancelAnimationFrame(audioRafRef.current);
      audioRafRef.current = null;
    }
    audioAnalyserRef.current = null;
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    setAudioLevel(0);
  };

  const exerciseData = phrasesExerciseData[phraseId] || phrasesExerciseData[1];

  // Randomizar banco de palabras al entrar en paso 2 (una sola vez por frase/paso)
  useEffect(() => {
    if (currentStep === 2) {
      const shuffled = [...exerciseData.apacheSpanishBank].sort(() => Math.random() - 0.5);
      setRandomizedBank(shuffled);
    }
    // Importante: NO depender de exerciseData.apacheSpanishBank (referencia nueva en cada render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, phraseId]);

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
      
      // Reproducir sonido de la palabra
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "es-ES";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
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
      setFeedback("");
      setIsStepComplete(true);
      showResult(true, "¡Correcto!", "Has ordenado la frase en Español Apache.");
    } else {
      showResult(false, "Incorrecto", "El orden de las palabras no es correcto. Intenta nuevamente.");
    }
  };

  const handleEnglishInputChange = (index: number, value: string) => {
    const newAttempt = [...userAttemptEnglish];
    newAttempt[index] = value;
    setUserAttemptEnglish(newAttempt);
  };

  const getInputColorClass = (index: number, value: string) => {
    if (!value) return "";
    const expected = exerciseData.apacheEnglishSolution[index];
    const isCorrect = value === expected;
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
    const userTrimmed = userAttemptEnglish.map(w => (w ?? "").trim());
    const isCorrect = JSON.stringify(userTrimmed) === JSON.stringify(exerciseData.apacheEnglishSolution);

    if (isCorrect) {
      setFeedback("");
      setIsStepComplete(true);
      showResult(true, "¡Perfecto!", "Has traducido correctamente al Inglés Apache.");
    } else {
      showResult(false, "Incorrecto", "Algunas palabras no son correctas. Revisa tu traducción.");
    }
  };
  const checkAuxiliary = () => {
    const isCorrect = userAuxiliary.toLowerCase().trim() === exerciseData.auxiliary.toLowerCase();

    if (isCorrect) {
      setFeedback("");
      setIsStepComplete(true);
      showResult(true, "¡Excelente!", "Has completado la frase en Inglés perfecto.");
    } else {
      showResult(false, "Incorrecto", "El auxiliar no es correcto. Intenta de nuevo.");
    }
  };

  const checkFinalPhrase = () => {
    const userTrimmed = finalPhrase.trim();
    const correctPhrase = exerciseData.finalEnglishSolution.join(" ");

    if (userTrimmed === correctPhrase) {
      setFeedback("");
      setIsStepComplete(true);
      showResult(true, "¡Perfecto!", "Ahora practica tu pronunciación.");
    } else {
      showResult(false, "Incorrecto", "Revisa tu respuesta o repasa los ejercicios.");
    }
  };

  const setupAudioMeter = (stream: MediaStream) => {
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AC) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      const context = audioCtxRef.current;
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.85;
      source.connect(analyser);
      audioAnalyserRef.current = analyser;
      const data = new Uint8Array(analyser.fftSize);
      const tick = () => {
        if (audioAnalyserRef.current !== analyser) return;
        analyser.getByteTimeDomainData(data);
        let sumSquares = 0;
        for (let i = 0; i < data.length; i++) {
          const n = (data[i] - 128) / 128;
          sumSquares += n * n;
        }
        const rms = Math.sqrt(sumSquares / data.length);
        setAudioLevel(Math.min(1, Math.max(0.04, rms * 7)));
        audioRafRef.current = window.requestAnimationFrame(tick);
      };
      if (context.state === "suspended") {
        context.resume().then(tick).catch(() => tick());
      } else {
        tick();
      }
    } catch (e) {
      console.warn("No se pudo iniciar medidor:", e);
    }
  };

  const startRecording = async () => {
    // Reset state SÍNCRONO antes de cualquier await
    transcriptRef.current = [];
    recordingStoppedRef.current = false;
    resultEvaluatedRef.current = false;
    interimByIndexRef.current = {};
    setRecordedTranscript([]);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "No soportado",
        description: "Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.",
        variant: "destructive",
      });
      return;
    }

    // Crear y arrancar SpeechRecognition SÍNCRONAMENTE dentro del gesto del usuario
    // (sin awaits previos) para evitar bloqueos por políticas del navegador.
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    const interimByIndex: Record<number, string> = {};

    recognition.onresult = (event: any) => {
      if (recordingStoppedRef.current) return;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = (res[0]?.transcript || '').trim();
        if (res.isFinal) {
          delete interimByIndex[i];
          if (text) {
            const words = text.split(/\s+/).filter((w: string) => w.length > 0);
            transcriptRef.current = [...transcriptRef.current, ...words];
          }
        } else {
          interimByIndex[i] = text;
        }
      }
      // Mostrar finales + interim en vivo para feedback inmediato
      const interimWords = Object.values(interimByIndex)
        .join(' ')
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      setRecordedTranscript([...transcriptRef.current, ...interimWords]);
    };

    recognition.onend = () => {
      // Solo se usa como fallback si stopRecording no logró evaluar a tiempo
      if (!resultEvaluatedRef.current) {
        if (transcriptRef.current.length === 0) {
          const interimText = Object.values(interimByIndex).join(' ').trim();
          if (interimText) {
            transcriptRef.current = interimText.split(/\s+/).filter((w: string) => w.length > 0);
          }
        }
        resultEvaluatedRef.current = true;
        checkPronunciation(transcriptRef.current);
      }
    };

    // Exponer interimByIndex para que stopRecording pueda usarlo de inmediato
    interimByIndexRef.current = interimByIndex;

    recognition.onerror = (e: any) => {
      console.warn('SpeechRecognition error:', e?.error);
      if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
        toast({
          title: "Permiso denegado",
          description: "Habilita el micrófono en la configuración del navegador.",
          variant: "destructive",
        });
        recordingStoppedRef.current = true;
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('No se pudo iniciar SpeechRecognition:', err);
      toast({
        title: "Error",
        description: "No se pudo iniciar la grabación. Intenta de nuevo.",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    setRecordingTime(0);

    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    recordingIntervalRef.current = window.setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 10) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // Medidor de audio visual: opcional. Si falla, la grabación sigue funcionando.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      setupAudioMeter(stream);
    } catch (error) {
      console.warn('No se pudo acceder al medidor de audio (la grabación continúa):', error);
    }
  };

  const stopRecording = () => {
    // Marcar como detenido ANTES de cualquier acción para descartar resultados tardíos
    recordingStoppedRef.current = true;

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    if (audioStreamRef.current) {
      try { audioStreamRef.current.getTracks().forEach(t => t.stop()); } catch {}
      audioStreamRef.current = null;
    }
    if (recognitionRef.current) {
      // Abortar (no esperar a onend) para evaluar de inmediato
      try { recognitionRef.current.abort(); } catch {
        try { recognitionRef.current.stop(); } catch {}
      }
    }
    stopAudioMeter();
    setIsRecording(false);

    // Evaluar de inmediato con lo que ya tenemos (final + interim) sin esperar a onend
    if (!resultEvaluatedRef.current) {
      if (transcriptRef.current.length === 0) {
        const interimText = Object.values(interimByIndexRef.current).join(' ').trim();
        if (interimText) {
          transcriptRef.current = interimText.split(/\s+/).filter((w: string) => w.length > 0);
        }
      }
      resultEvaluatedRef.current = true;
      checkPronunciation(transcriptRef.current);
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      recordingStoppedRef.current = true;
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      if (audioStreamRef.current) {
        try { audioStreamRef.current.getTracks().forEach(t => t.stop()); } catch {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      stopAudioMeter();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPronunciation = (transcriptOverride?: string[]) => {
    const transcript = transcriptOverride ?? transcriptRef.current;
    const correctPhrase = englishPhrase.toLowerCase().trim();
    const userPhrase = transcript.join(' ').toLowerCase().trim();

    if (!userPhrase || transcript.length === 0) {
      showResult(false, "No se escuchó nada", "No detectamos audio. Intenta grabar de nuevo.");
      return;
    }

    const userWords = userPhrase.split(/\s+/).filter((w) => w.length > 0);
    const correctWords = correctPhrase.split(/\s+/).filter((w) => w.length > 0);

    const freq = (arr: string[]) => arr.reduce<Record<string, number>>((acc, w) => {
      acc[w] = (acc[w] || 0) + 1;
      return acc;
    }, {});

    const correctFreq = freq(correctWords);
    const userFreq = freq(userWords);

    const missingRequired = Object.entries(correctFreq).some(([w, c]) => (userFreq[w] || 0) < c);
    const hasExtras = Object.keys(userFreq).some((w) => !correctFreq[w]);
    const isAllCorrect = !missingRequired && !hasExtras && userWords.length > 0;

    if (isAllCorrect) {
      setIsStepComplete(true);
      showResult(true, "¡Excelente pronunciación!", "Has completado la frase.");
      const savedKey = `phrases_day${day}_progress`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        const phrases = JSON.parse(saved);
        const updated = phrases.map((p: any) => (p.id === phraseId ? { ...p, learned: true, inProgress: false } : p));
        localStorage.setItem(savedKey, JSON.stringify(updated));
      }
    } else {
      showResult(false, "Pronunciación incorrecta", "Aún hay palabras por corregir. Vuelve a intentarlo.");
    }
  };

  useEffect(() => {
    if (currentStep > 1) {
      const savedKey = `phrases_day${day}_progress`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        try {
          const phrasesArr = JSON.parse(saved);
          const updated = phrasesArr.map((p: any) =>
            p.id === phraseId && !p.learned ? { ...p, inProgress: true } : p
          );
          localStorage.setItem(savedKey, JSON.stringify(updated));
        } catch {}
      }
    }
  }, [currentStep, day, phraseId]);

  const goToNextStep = () => {
    if (currentStep < 6) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setIsStepComplete(false);
      setFeedback("");
      
      // Inicializar el array de inglés cuando llegamos al paso 3
      if (currentStep === 2) {
        setUserAttemptEnglish(new Array(exerciseData.apacheEnglishSolution.length).fill(""));
      }

      // Limpiar transcripción al entrar al paso 6
      if (next === 6) {
        setRecordedTranscript([]);
        transcriptRef.current = [];
        interimByIndexRef.current = {};
        resultEvaluatedRef.current = false;
      }
      
      // Scroll to center the next step
      setTimeout(() => {
        const refs = [null, step1Ref, step2Ref, step3Ref, step4Ref, step5Ref, step6Ref];
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

  const goToPreviousStep = () => {
    if (currentStep <= 1) return;
    const prev = currentStep - 1;
    setCurrentStep(prev);
    setIsStepComplete(false);
    setFeedback("");
    if (prev <= 1) setUserAttemptSpanish([]);
    if (prev <= 2) setUserAttemptEnglish([]);
    if (prev <= 3) setUserAuxiliary("");
    if (prev <= 4) setFinalPhrase("");
    if (prev < 6) {
      setRecordedTranscript([]);
      transcriptRef.current = [];
      interimByIndexRef.current = {};
      resultEvaluatedRef.current = false;
    }
    setTimeout(() => {
      const refs = [null, step1Ref, step2Ref, step3Ref, step4Ref, step5Ref, step6Ref];
      const r = refs[prev];
      if (r?.current) r.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  const goToPreviousSteps = () => {
    setCurrentStep(1);
    setIsStepComplete(false);
    setFeedback("");
    setUserAttemptSpanish([]);
    setUserAttemptEnglish([]);
    setUserAuxiliary("");
    setFinalPhrase("");
    setRecordedTranscript([]);
    transcriptRef.current = [];
    interimByIndexRef.current = {};
    resultEvaluatedRef.current = false;
  };

  const TOTAL_STEPS = 6;
  const headerProgress = Math.min((currentStep / TOTAL_STEPS) * 100, 100);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col selection:bg-accent/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/phrases-day?day=${day}`)}
            className="hover:bg-primary/10"
            title="Volver a la lista de frases"
          >
            <List className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Lista</span>
          </Button>

          <Badge variant="secondary" className="text-sm">
            {isStepComplete ? "Excelente" : `Ejercicio ${currentStep} de ${TOTAL_STEPS}`}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10"
            title="Ejercicio anterior"
            onClick={goToPreviousStep}
            disabled={currentStep <= 1}
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Ejercicio anterior</span>
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Progress Bar */}
        <div className="mb-2">
          <Progress value={headerProgress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {Math.min(currentStep, TOTAL_STEPS)} de {TOTAL_STEPS} ejercicios
          </p>
        </div>

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
                <span key={index} className="px-3 py-2 bg-indigo-600 text-white rounded-md font-medium shadow-sm">
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
                  <span key={index} className="px-2 py-2 font-medium text-foreground underline underline-offset-4 decoration-2 decoration-foreground/60">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Banco de palabras */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4 border border-border">
              <div className="flex flex-wrap gap-2 justify-center">
                {randomizedBank.map((word, index) => {
                  const isUsed = userAttemptSpanish.includes(word);
                  return (
                    <button
                      key={index}
                      onClick={() => handleWordClick(word)}
                      disabled={isStepComplete || isUsed}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button variant="outline" onClick={removeLastWord} disabled={isStepComplete || currentStep > 2}>
                Borrar
              </Button>
              <Button onClick={() => setShowTipsModal(true)} className="gradient-yellow-animated border-0 font-semibold shadow-md hover:opacity-90">
                <Lightbulb className="w-4 h-4 mr-2" />
                Tips
              </Button>
              <Button onClick={checkSpanishSolution} disabled={isStepComplete || currentStep > 2} className="gradient-pink-animated border-0 font-semibold shadow-md hover:opacity-90">
                Verificar
              </Button>
            </div>


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
              <Button onClick={() => setShowTipsModal(true)} className="gradient-yellow-animated border-0 font-semibold shadow-md hover:opacity-90">
                <Lightbulb className="w-4 h-4 mr-2" />
                Tips
              </Button>
              <Button onClick={checkEnglishSolution} disabled={isStepComplete || currentStep > 3} className="flex-1 gradient-pink-animated border-0 font-semibold shadow-md hover:opacity-90">
                Verificar Frase
              </Button>
            </div>


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
                      <span className="px-3 py-2 bg-indigo-600 text-white rounded-md font-medium shadow-sm">
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
              <Button onClick={checkAuxiliary} disabled={isStepComplete || currentStep > 4} className="flex-1 gradient-pink-animated border-0 font-semibold shadow-md hover:opacity-90">
                Verificar
              </Button>
            </div>


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
              <Button onClick={checkFinalPhrase} disabled={isStepComplete} className="flex-1 gradient-pink-animated border-0 font-semibold shadow-md hover:opacity-90">
                Verificar Frase
              </Button>
            </div>


            {isStepComplete && currentStep === 5 && (
              <Button 
                onClick={goToNextStep} 
                className="w-full mt-4"
              >
                Continuar
              </Button>
            )}
          </Card>
        )}

        {/* Paso 6: Pronunciación */}
        {currentStep === 6 && (
          <Card ref={step6Ref} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">6</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Practica tu pronunciación</h2>
                <p className="text-sm text-muted-foreground">Graba tu pronunciación de la frase completa</p>
              </div>
            </div>

            {/* Frase en español */}
            <div className="bg-background/50 rounded-lg p-4 mb-4 border-2 border-border">
              <p className="text-center text-foreground font-medium text-lg">"{exerciseData.spanishWords.join(" ")}"</p>
            </div>

            {/* Palabras reconocidas */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4 border border-border h-40 overflow-y-auto">
              <p className="text-sm text-muted-foreground text-center mb-2">Palabras detectadas:</p>
              <div className="flex flex-wrap gap-2 justify-center content-start">
                {recordedTranscript.length > 0 ? (
                  recordedTranscript.map((word, index) => {
                    const wordLower = word.toLowerCase();
                    const correctWords = englishPhrase.toLowerCase().split(/\s+/).filter(w => w.length > 0);
                    const isCorrect = correctWords.includes(wordLower);
                    
                    return (
                      <span 
                        key={index} 
                        className={`px-3 py-1 rounded-md text-sm ${
                          isCorrect 
                            ? "bg-green-500/20 text-green-500 border border-green-500" 
                            : "bg-red-500/20 text-red-500 border border-red-500"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm">Las palabras aparecerán aquí mientras hablas...</p>
                )}
              </div>
            </div>

            {/* Controles de grabación */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} className="flex-1">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Iniciar Grabación
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive" className="flex-1">
                    Finalizar Grabación
                  </Button>
                )}
              </div>
              {!isRecording && !isStepComplete && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/phrases-day?day=${day}`)}
                  className="w-full"
                >
                  Dejar para más tarde
                </Button>
              )}
            </div>

            {/* Modal del ecualizador */}
            {isRecording && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">
                      Grabando... {recordingTime}s / 10s
                    </p>
                  </div>
                  <div className="flex items-end justify-center gap-1 h-20 px-4 py-2 bg-background/40 rounded-xl border border-border">
                    {Array.from({ length: 24 }).map((_, i) => {
                      const factor = 0.5 + Math.sin((i / 24) * Math.PI) * 0.8;
                      const base = 6;
                      const max = 56;
                      const height = Math.max(base, Math.round(base + audioLevel * factor * max));
                      return (
                        <span
                          key={i}
                          className="w-1.5 rounded-full bg-gradient-to-t from-primary to-accent transition-[height] duration-75"
                          style={{ height: `${height}px` }}
                        />
                      );
                    })}
                  </div>
                  <Button onClick={stopRecording} variant="destructive" className="w-full">
                    Finalizar Grabación
                  </Button>
                </div>
              </div>
            )}


            {isStepComplete && (
              <Button 
                onClick={goToNextStep} 
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
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
                  <li>En Ingles nunca se utiliza fresca<span className="text-cyan-400 font-bold">s</span>, rojo<span className="text-cyan-400 font-bold">s</span>, grande<span className="text-cyan-400 font-bold">s</span> solo se dice "fresca, rojo, grande"</li>
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

      {/* Modal de Resultado (Correcto / Incorrecto) */}
      <Dialog open={resultModal.open} onOpenChange={(open) => setResultModal((prev) => ({ ...prev, open }))}>
        <DialogContent className="bg-card text-foreground max-w-[280px] sm:max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle className={resultModal.success ? "text-green-500" : "text-red-500"}>
              {resultModal.success ? "✓ " : "✗ "}{resultModal.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              {resultModal.message}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              const wasSuccess = resultModal.success;
              setResultModal((prev) => ({ ...prev, open: false }));
              if (wasSuccess && currentStep < 6) {
                goToNextStep();
              }
            }}
            className={resultModal.success ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {resultModal.success ? "Continuar" : "Intentar de nuevo"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearnPhrase;
