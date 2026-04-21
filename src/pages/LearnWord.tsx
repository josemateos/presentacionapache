import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { ArrowLeft, Volume2, Check, CheckCircle2, Circle, RotateCcw, Sparkles, Mic, ChevronLeft, List, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { loadWordImages } from "@/lib/imageLoader";

// Importar imágenes fijas para todas las palabras del vocabulario
import querer1 from '@/assets/words/querer-1.jpg';
import querer2 from '@/assets/words/querer-2.jpg';
import querer3 from '@/assets/words/querer-3.jpg';
import querer4 from '@/assets/words/querer-4.jpg';
import fruta1 from '@/assets/words/fruta-1.jpg';
import fruta2 from '@/assets/words/fruta-2.jpg';
import fruta3 from '@/assets/words/fruta-3.jpg';
import fruta4 from '@/assets/words/fruta-4.jpg';
import leer1 from '@/assets/words/leer-1.jpg';
import leer2 from '@/assets/words/leer-2.jpg';
import leer3 from '@/assets/words/leer-3.jpg';
import leer4 from '@/assets/words/leer-4.jpg';
import un1 from '@/assets/words/un-1.jpg';
import un2 from '@/assets/words/un-2.jpg';
import un3 from '@/assets/words/un-3.jpg';
import un4 from '@/assets/words/un-4.jpg';
import libro1 from '@/assets/words/libro-1.jpg';
import libro2 from '@/assets/words/libro-2.jpg';
import libro3 from '@/assets/words/libro-3.jpg';
import libro4 from '@/assets/words/libro-4.jpg';
import de1 from '@/assets/words/de-1.jpg';
import de2 from '@/assets/words/de-2.jpg';
import de3 from '@/assets/words/de-3.jpg';
import de4 from '@/assets/words/de-4.jpg';
import dormir1 from '@/assets/words/dormir-1.jpg';
import dormir2 from '@/assets/words/dormir-2.jpg';
import dormir3 from '@/assets/words/dormir-3.jpg';
import dormir4 from '@/assets/words/dormir-4.jpg';
import tener1 from '@/assets/words/tener-1.jpg';
import tener2 from '@/assets/words/tener-2.jpg';
import tener3 from '@/assets/words/tener-3.jpg';
import tener4 from '@/assets/words/tener-4.jpg';
import ir1 from '@/assets/words/ir-1.jpg';
import ir2 from '@/assets/words/ir-2.jpg';
import ir3 from '@/assets/words/ir-3.jpg';
import ir4 from '@/assets/words/ir-4.jpg';
import a1 from '@/assets/words/a-1.jpg';
import a2 from '@/assets/words/a-2.jpg';
import a3 from '@/assets/words/a-3.jpg';
import a4 from '@/assets/words/a-4.jpg';
import visitar1 from '@/assets/words/visitar-1.jpg';
import visitar2 from '@/assets/words/visitar-2.jpg';
import visitar3 from '@/assets/words/visitar-3.jpg';
import visitar4 from '@/assets/words/visitar-4.jpg';
import gustar1 from '@/assets/words/gustar-1.jpg';
import gustar2 from '@/assets/words/gustar-2.jpg';
import gustar3 from '@/assets/words/gustar-3.jpg';
import gustar4 from '@/assets/words/gustar-4.jpg';
import nosComplemento1 from '@/assets/words/nos-complemento-1.jpg';
import nosComplemento2 from '@/assets/words/nos-complemento-2.jpg';
import nosComplemento3 from '@/assets/words/nos-complemento-3.jpg';
import nosComplemento4 from '@/assets/words/nos-complemento-4.jpg';
import invitar1 from '@/assets/words/invitar-1.jpg';
import invitar2 from '@/assets/words/invitar-2.jpg';
import invitar3 from '@/assets/words/invitar-3.jpg';
import invitar4 from '@/assets/words/invitar-4.jpg';
import tuComplemento1 from '@/assets/words/tu-complemento-1.jpg';
import tuComplemento2 from '@/assets/words/tu-complemento-2.jpg';
import tuComplemento3 from '@/assets/words/tu-complemento-3.jpg';
import tuComplemento4 from '@/assets/words/tu-complemento-4.jpg';
import mananaTiempo1 from '@/assets/words/manana-tiempo-1.jpg';
import mananaTiempo2 from '@/assets/words/manana-tiempo-2.jpg';
import mananaTiempo3 from '@/assets/words/manana-tiempo-3.jpg';
import mananaTiempo4 from '@/assets/words/manana-tiempo-4.jpg';
import mananaDia1 from '@/assets/words/manana-dia-1.jpg';
import mananaDia2 from '@/assets/words/manana-dia-2.jpg';
import mananaDia3 from '@/assets/words/manana-dia-3.jpg';
import mananaDia4 from '@/assets/words/manana-dia-4.jpg';
import reunion1 from '@/assets/words/reunion-1.jpg';
import reunion2 from '@/assets/words/reunion-2.jpg';
import reunion3 from '@/assets/words/reunion-3.jpg';
import reunion4 from '@/assets/words/reunion-4.jpg';
import trabajo1 from '@/assets/words/trabajo-1.jpg';
import trabajo2 from '@/assets/words/trabajo-2.jpg';
import trabajo3 from '@/assets/words/trabajo-3.jpg';
import trabajo4 from '@/assets/words/trabajo-4.jpg';
import familia1 from '@/assets/words/familia-1.jpg';
import familia2 from '@/assets/words/familia-2.jpg';
import familia3 from '@/assets/words/familia-3.jpg';
import familia4 from '@/assets/words/familia-4.jpg';
import necesitar1 from '@/assets/words/necesitar-1.jpg';
import necesitar2 from '@/assets/words/necesitar-2.jpg';
import necesitar3 from '@/assets/words/necesitar-3.jpg';
import necesitar4 from '@/assets/words/necesitar-4.jpg';
import practicar1 from '@/assets/words/practicar-1.jpg';
import practicar2 from '@/assets/words/practicar-2.jpg';
import practicar3 from '@/assets/words/practicar-3.jpg';
import practicar4 from '@/assets/words/practicar-4.jpg';
import ingles1 from '@/assets/words/ingles-1.jpg';
import ingles2 from '@/assets/words/ingles-2.jpg';
import ingles3 from '@/assets/words/ingles-3.jpg';
import ingles4 from '@/assets/words/ingles-4.jpg';
import todos1 from '@/assets/words/todos-1.jpg';
import todos2 from '@/assets/words/todos-2.jpg';
import todos3 from '@/assets/words/todos-3.jpg';
import todos4 from '@/assets/words/todos-4.jpg';
import dias1 from '@/assets/words/dias-1.jpg';
import dias2 from '@/assets/words/dias-2.jpg';
import dias3 from '@/assets/words/dias-3.jpg';
import dias4 from '@/assets/words/dias-4.jpg';
import ella1 from '@/assets/words/ella-1.jpg';
import ella2 from '@/assets/words/ella-2.jpg';
import ella3 from '@/assets/words/ella-3.jpg';
import ella4 from '@/assets/words/ella-4.jpg';
import ellos1 from '@/assets/words/ellos-1.jpg';
import ellos2 from '@/assets/words/ellos-2.jpg';
import ellos3 from '@/assets/words/ellos-3.jpg';
import ellos4 from '@/assets/words/ellos-4.jpg';
import nosotros1 from '@/assets/words/nosotros-1.jpg';
import nosotros2 from '@/assets/words/nosotros-2.jpg';
import nosotros3 from '@/assets/words/nosotros-3.jpg';
import nosotros4 from '@/assets/words/nosotros-4.jpg';
import el1 from '@/assets/words/el-1.jpg';
import el2 from '@/assets/words/el-2.jpg';
import el3 from '@/assets/words/el-3.jpg';
import el4 from '@/assets/words/el-4.jpg';
import tu1 from '@/assets/words/tu-1.jpg';
import tu2 from '@/assets/words/tu-2.jpg';
import tu3 from '@/assets/words/tu-3.jpg';
import tu4 from '@/assets/words/tu-4.jpg';
import mi1 from '@/assets/words/mi-1.jpg';
import mi2 from '@/assets/words/mi-2.jpg';
import mi3 from '@/assets/words/mi-3.jpg';
import mi4 from '@/assets/words/mi-4.jpg';
import nos1 from '@/assets/words/nos-1.jpg';
import nos2 from '@/assets/words/nos-2.jpg';
import nos3 from '@/assets/words/nos-3.jpg';
import nos4 from '@/assets/words/nos-4.jpg';
import en1 from '@/assets/words/en-1.jpg';
import en2 from '@/assets/words/en-2.jpg';
import en3 from '@/assets/words/en-3.jpg';
import en4 from '@/assets/words/en-4.jpg';
import importante1 from '@/assets/words/importante-1.jpg';
import importante2 from '@/assets/words/importante-2.jpg';
import importante3 from '@/assets/words/importante-3.jpg';
import importante4 from '@/assets/words/importante-4.jpg';
import esta1 from '@/assets/words/esta-1.jpg';
import esta2 from '@/assets/words/esta-2.jpg';
import esta3 from '@/assets/words/esta-3.jpg';
import esta4 from '@/assets/words/esta-4.jpg';
import antes1 from '@/assets/words/antes-1.jpg';
import antes2 from '@/assets/words/antes-2.jpg';
import antes3 from '@/assets/words/antes-3.jpg';
import antes4 from '@/assets/words/antes-4.jpg';
import tarde1 from '@/assets/words/tarde-1.jpg';
import tarde2 from '@/assets/words/tarde-2.jpg';
import tarde3 from '@/assets/words/tarde-3.jpg';
import tarde4 from '@/assets/words/tarde-4.jpg';
import proximo1 from '@/assets/words/proximo-1.jpg';
import proximo2 from '@/assets/words/proximo-2.jpg';
import proximo3 from '@/assets/words/proximo-3.jpg';
import proximo4 from '@/assets/words/proximo-4.jpg';
import findesemana1 from '@/assets/words/findesemana-1.jpg';
import findesemana2 from '@/assets/words/findesemana-2.jpg';
import findesemana3 from '@/assets/words/findesemana-3.jpg';
import findesemana4 from '@/assets/words/findesemana-4.jpg';
import pedir1 from '@/assets/words/pedir-1.jpg';
import pedir2 from '@/assets/words/pedir-2.jpg';
import pedir3 from '@/assets/words/pedir-3.jpg';
import pedir4 from '@/assets/words/pedir-4.jpg';
import comprar1 from '@/assets/words/comprar-1.jpg';
import comprar2 from '@/assets/words/comprar-2.jpg';
import comprar3 from '@/assets/words/comprar-3.jpg';
import comprar4 from '@/assets/words/comprar-4.jpg';
import verduras1 from '@/assets/words/verduras-1.jpg';
import verduras2 from '@/assets/words/verduras-2.jpg';
import verduras3 from '@/assets/words/verduras-3.jpg';
import verduras4 from '@/assets/words/verduras-4.jpg';
import frutas1 from '@/assets/words/frutas-1.jpg';
import frutas2 from '@/assets/words/frutas-2.jpg';
import frutas3 from '@/assets/words/frutas-3.jpg';
import frutas4 from '@/assets/words/frutas-4.jpg';
import frescas1 from '@/assets/words/frescas-1.jpg';
import frescas2 from '@/assets/words/frescas-2.jpg';
import frescas3 from '@/assets/words/frescas-3.jpg';
import frescas4 from '@/assets/words/frescas-4.jpg';
import fresca1 from '@/assets/words/fresca-1.jpg';
import fresca2 from '@/assets/words/fresca-2.jpg';
import fresca3 from '@/assets/words/fresca-3.jpg';
import fresca4 from '@/assets/words/fresca-4.jpg';
import mercado1 from '@/assets/words/mercado-1.jpg';
import mercado2 from '@/assets/words/mercado-2-new.jpg';
import mercado3 from '@/assets/words/mercado-3-new.jpg';
import mercado4 from '@/assets/words/mercado-4-new.jpg';
import pan1 from '@/assets/words/pan-1.jpg';
import pan2 from '@/assets/words/pan-2.jpg';
import pan3 from '@/assets/words/pan-3.jpg';
import pan4 from '@/assets/words/pan-4.jpg';
import carne1 from '@/assets/words/carne-1.jpg';
import carne2 from '@/assets/words/carne-2.jpg';
import carne3 from '@/assets/words/carne-3.jpg';
import carne4 from '@/assets/words/carne-4.jpg';
import quiero1 from '@/assets/words/quiero-1.jpg';
import quiero2 from '@/assets/words/quiero-2.jpg';
import quiero3 from '@/assets/words/quiero-3.jpg';
import quiero4 from '@/assets/words/quiero-4.jpg';
import comer1 from '@/assets/words/comer-1.jpg';
import comer2 from '@/assets/words/comer-2.jpg';
import comer3 from '@/assets/words/comer-3.jpg';
import comer4 from '@/assets/words/comer-4.jpg';
import yo1 from '@/assets/words/yo-1.jpg';
import yo2 from '@/assets/words/yo-2.jpg';
import yo3 from '@/assets/words/yo-3.jpg';
import yo4 from '@/assets/words/yo-4.jpg';
import tenerQue1 from '@/assets/words/tener-que-1.jpg';
import tenerQue2 from '@/assets/words/tener-que-2.jpg';
import tenerQue3 from '@/assets/words/tener-que-3.jpg';
import tenerQue4 from '@/assets/words/tener-que-4.jpg';
import venir1 from '@/assets/words/venir-1.jpg';
import venir2 from '@/assets/words/venir-2.jpg';
import venir3 from '@/assets/words/venir-3.jpg';
import venir4 from '@/assets/words/venir-4.jpg';

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
  const [loadedImages, setLoadedImages] = useState<Record<string, [string, string, string, string]>>({});

  // Load images from storage or fallback to local
  useEffect(() => {
    const loadAllImages = async () => {
      // Map of word keys to their fallback images
      const imageMap: Record<string, [string, string, string, string]> = {
        "querer": [querer1, querer2, querer3, querer4],
        "fruta": [fruta1, fruta2, fruta3, fruta4],
        "leer": [leer1, leer2, leer3, leer4],
        "un": [un1, un2, un3, un4],
        "libro": [libro1, libro2, libro3, libro4],
        "de": [de1, de2, de3, de4],
        "dormir": [dormir1, dormir2, dormir3, dormir4],
        "tener": [tener1, tener2, tener3, tener4],
        "ir": [ir1, ir2, ir3, ir4],
        "a": [a1, a2, a3, a4],
        "visitar": [visitar1, visitar2, visitar3, visitar4],
        "gustar": [gustar1, gustar2, gustar3, gustar4],
        "nos-complemento": [nosComplemento1, nosComplemento2, nosComplemento3, nosComplemento4],
        "invitar": [invitar1, invitar2, invitar3, invitar4],
        "tu-complemento": [tuComplemento1, tuComplemento2, tuComplemento3, tuComplemento4],
        "manana-tiempo": [mananaTiempo1, mananaTiempo2, mananaTiempo3, mananaTiempo4],
        "manana-dia": [mananaDia1, mananaDia2, mananaDia3, mananaDia4],
        "reunion": [reunion1, reunion2, reunion3, reunion4],
        "trabajo": [trabajo1, trabajo2, trabajo3, trabajo4],
        "familia": [familia1, familia2, familia3, familia4],
        "necesitar": [necesitar1, necesitar2, necesitar3, necesitar4],
        "practicar": [practicar1, practicar2, practicar3, practicar4],
        "ingles": [ingles1, ingles2, ingles3, ingles4],
        "importante": [importante1, importante2, importante3, importante4],
        "findesemana": [findesemana1, findesemana2, findesemana3, findesemana4],
        "proximo": [proximo1, proximo2, proximo3, proximo4],
        "mi": [mi1, mi2, mi3, mi4],
        "nosotros": [nosotros1, nosotros2, nosotros3, nosotros4],
        "tu": [tu1, tu2, tu3, tu4],
        "el": [el1, el2, el3, el4],
        "ella": [ella1, ella2, ella3, ella4],
        "ellos": [ellos1, ellos2, ellos3, ellos4],
        "yo": [yo1, yo2, yo3, yo4],
        "comprar": [comprar1, comprar2, comprar3, comprar4],
        "fresca": [fresca1, fresca2, fresca3, fresca4],
        "frescas": [frescas1, frescas2, frescas3, frescas4],
        "frutas": [frutas1, frutas2, frutas3, frutas4],
        "en": [en1, en2, en3, en4],
        "mercado": [mercado1, mercado2, mercado3, mercado4],
        "antes": [antes1, antes2, antes3, antes4],
        "todos": [todos1, todos2, todos3, todos4],
        "dias": [dias1, dias2, dias3, dias4],
        "pedir": [pedir1, pedir2, pedir3, pedir4],
        "verduras": [verduras1, verduras2, verduras3, verduras4],
        "pan": [pan1, pan2, pan3, pan4],
        "carne": [carne1, carne2, carne3, carne4],
        "quiero": [quiero1, quiero2, quiero3, quiero4],
        "comer": [comer1, comer2, comer3, comer4],
        "esta": [esta1, esta2, esta3, esta4],
        "tarde": [tarde1, tarde2, tarde3, tarde4],
        "nos": [nos1, nos2, nos3, nos4],
        "tener-que": [tenerQue1, tenerQue2, tenerQue3, tenerQue4],
        "venir": [venir1, venir2, venir3, venir4],
      };

      const loaded: Record<string, [string, string, string, string]> = {};
      for (const [word, fallbacks] of Object.entries(imageMap)) {
        loaded[word] = await loadWordImages(word, fallbacks);
      }
      setLoadedImages(loaded);
    };

    loadAllImages();
  }, []);

  // Detectar el primer módulo no completado al cargar (basado en progreso por módulo guardado)
  useEffect(() => {
    if (!wordId) return;
    try {
      const savedModules = localStorage.getItem(`word_modules_${wordId}`);
      if (savedModules) {
        const completedIds: number[] = JSON.parse(savedModules);
        setModuleProgress(prev => prev.map(m => ({ ...m, completed: completedIds.includes(m.id) })));
        // Saltar al primer módulo no completado
        const firstPending = modules.findIndex(m => !completedIds.includes(m.id));
        if (firstPending >= 0) {
          setCurrentModule(firstPending);
        } else {
          setCurrentModule(6); // todos completados → resumen
        }
      }
    } catch (error) {
      console.error("Error loading module progress:", error);
    }
  }, [wordId]);
  const [userInput, setUserInput] = useState("");
  const [userInput1, setUserInput1] = useState("");
  const [userInput2, setUserInput2] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [selectedMeaningOption, setSelectedMeaningOption] = useState<string | null>(null);
  const [meaningVerified, setMeaningVerified] = useState(false);
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
    { id: 4, title: "Traducción", completed: false },
    { id: 5, title: "Pronunciación", completed: false },
  ];

  const [moduleProgress, setModuleProgress] = useState(modules);
  const progress = (moduleProgress.filter(m => m.completed).length / modules.length) * 100;

  // Persistir progreso por módulo de la palabra y marcar inProgress en la lista
  useEffect(() => {
    if (!wordId) return;
    const completedIds = moduleProgress.filter(m => m.completed).map(m => m.id);
    if (completedIds.length === 0) return; // nada que guardar aún
    try {
      localStorage.setItem(`word_modules_${wordId}`, JSON.stringify(completedIds));
      const allDone = completedIds.length === modules.length;
      const saved = localStorage.getItem("vocabulary_day1_progress");
      if (saved) {
        const savedWords = JSON.parse(saved);
        const updatedWords = savedWords.map((w: any) =>
          w.id === parseInt(wordId)
            ? { ...w, inProgress: !allDone && !w.learned }
            : w
        );
        localStorage.setItem("vocabulary_day1_progress", JSON.stringify(updatedWords));
      }
    } catch (error) {
      console.error("Error saving module progress:", error);
    }
  }, [moduleProgress, wordId]);

  // Efecto de fuegos artificiales al llegar al resumen final con todos los módulos completados
  useEffect(() => {
    if (currentModule >= modules.length && moduleProgress.every(m => m.completed)) {
      const duration = 3500;
      const animationEnd = Date.now() + duration;
      const colors = ["#22c55e", "#facc15", "#a78bfa", "#fb7185", "#38bdf8", "#f97316"];

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        // Cada ráfaga simula un fuego artificial: una explosión radial desde un punto aleatorio
        const burst = (origin: { x: number; y: number }) => {
          confetti({
            particleCount: 80,
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin,
            colors,
            shapes: ["circle"],
            scalar: 0.9,
            zIndex: 9999,
            gravity: 0.8,
          });
        };
        burst({ x: randomInRange(0.1, 0.9), y: randomInRange(0.15, 0.5) });
        if (Math.random() > 0.5) {
          burst({ x: randomInRange(0.1, 0.9), y: randomInRange(0.15, 0.5) });
        }
      }, 350);

      return () => clearInterval(interval);
    }
  }, [currentModule, moduleProgress]);

  // Verificar si todos los módulos están completados
  const checkIfAllModulesCompleted = (updatedProgress: LearningModule[]) => {
    return updatedProgress.every(m => m.completed);
  };

  // Marcar palabra como aprendida automáticamente
  const markWordAsLearned = () => {
    const saved = localStorage.getItem("vocabulary_day1_progress");
    if (saved && wordId) {
      try {
        const savedWords = JSON.parse(saved);
        const updatedWords = savedWords.map((w: any) =>
          w.id === parseInt(wordId)
            ? { ...w, learned: true, inProgress: false }
            : w
        );
        localStorage.setItem("vocabulary_day1_progress", JSON.stringify(updatedWords));
        // Limpiar progreso por módulo: la palabra está completada
        localStorage.removeItem(`word_modules_${wordId}`);
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  // Sonido de éxito (reutiliza un único AudioContext y lo reanuda si está suspendido)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playSuccessSound = () => {
    try {
      if (!audioCtxRef.current) {
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        audioCtxRef.current = new Ctx();
      }
      const context = audioCtxRef.current!;
      const playTone = () => {
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
      if (context.state === 'suspended') {
        context.resume().then(playTone).catch((e) => console.error('AudioContext resume failed:', e));
      } else {
        playTone();
      }
    } catch (e) {
      console.error('Error playing success sound:', e);
    }
  };

  const handlePlayAudio = () => {
    try {
      // Reanudar AudioContext si está suspendido (gesto de usuario) — ayuda a desbloquear el tono de éxito posterior
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      // Para la palabra "I" sola, varios motores TTS dicen "capital I". Forzamos pronunciación natural.
      const trimmed = english.trim();
      const textToSpeak = trimmed === "I" ? "I." : english;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Error playing audio:", e);
    }
  };

  // Funciones de grabación / reconocimiento de voz
  const handleStartRecording = async () => {
    try {
      // Limpiar la grabación previa para permitir un nuevo intento
      setRecordedAudio(null);

      // Pre-crear y reanudar AudioContext en el gesto del usuario para que el tono de éxito pueda sonar luego
      try {
        if (!audioCtxRef.current) {
          const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
          if (Ctx) audioCtxRef.current = new Ctx();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          await audioCtxRef.current.resume();
        }
      } catch (e) {
        console.warn('No se pudo inicializar AudioContext:', e);
      }

      // Verificar permiso de micrófono proactivamente (no soportado en Safari)
      try {
        if ((navigator as any).permissions?.query) {
          const status = await (navigator as any).permissions.query({ name: "microphone" as PermissionName });
          if (status.state === "denied") {
            toast({
              title: "Micrófono bloqueado",
              description: "Habilita el micrófono en los ajustes del navegador y recarga la página.",
              variant: "destructive",
              duration: 4000,
            });
            setIsRecording(false);
            setIsVerifying(false);
            return;
          }
        }
      } catch { /* Safari no soporta permissions.query para micrófono */ }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "No soportado",
          description: "Usa Chrome, Edge o Safari actualizado para el reconocimiento de voz.",
          variant: "destructive",
          duration: 3500,
        });
        setIsRecording(false);
        setIsVerifying(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 5;

      let resultReceived = false;
      let safetyTimer: number | null = null;

      recognition.onstart = () => {
        setIsRecording(true);
        // Tiempo máximo de escucha: 6s
        safetyTimer = window.setTimeout(() => {
          try { recognition.stop(); } catch {}
        }, 6000);
      };

      recognition.onerror = (event: any) => {
        console.error("Recognition error:", event.error);
        if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          toast({
            title: "Micrófono bloqueado",
            description: "Habilita el micrófono en los ajustes del navegador y recarga la página.",
            variant: "destructive",
            duration: 4000,
          });
        } else if (event.error === 'no-speech') {
          toast({
            title: "No se escuchó nada",
            description: "Acércate al micrófono y vuelve a intentarlo.",
            variant: "destructive",
            duration: 2500,
          });
        } else if (event.error === 'audio-capture') {
          toast({
            title: "Sin micrófono",
            description: "No se detectó un micrófono disponible.",
            variant: "destructive",
            duration: 3000,
          });
        } else if (event.error !== 'aborted') {
          toast({
            title: "Error",
            description: "No se pudo verificar la pronunciación. Intenta de nuevo.",
            variant: "destructive",
            duration: 2500,
          });
        }

        clearVerifyTimeout();
        setIsVerifying(false);
        setIsRecording(false);
      };

      recognition.onresult = (event: any) => {
        resultReceived = true;
        if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }

        // Recoger todas las alternativas (mayor tolerancia)
        const alternatives: string[] = [];
        for (let i = 0; i < event.results[0].length; i++) {
          alternatives.push(String(event.results[0][i].transcript || "").trim());
        }
        const transcript = alternatives[0] || "";
        const targetWord = english.trim();

        // Para "I" aceptamos variantes comunes que el motor suele devolver: "i", "I", "eye", "aye", "I."
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-záéíóúñü ]/gi, "").trim();
        const target = normalize(targetWord);
        const isMatch = targetWord === "I"
          ? alternatives.some(a => ["i", "eye", "aye"].includes(normalize(a)))
          : alternatives.some(a => normalize(a) === target);

        if (isMatch) {
          playSuccessSound();
          toast({
            title: "¡Excelente pronunciación!",
            description: "Pronunciación correcta. Avanzando...",
            duration: 2000,
            className: "bg-green-500 text-white border-green-600",
          });

          setModuleProgress(prev => prev.map(m =>
            m.id === 5 ? { ...m, completed: true } : m
          ));

          setTimeout(() => {
            clearVerifyTimeout();
            setCurrentModule(6);
            setIsVerifying(false);
            setIsRecording(false);
          }, 1500);
        } else {
          toast({
            title: "Intentar nuevamente",
            description: `Escuchamos: "${transcript}". Intenta pronunciar: "${english}"`,
            variant: "destructive",
            duration: 3000,
          });
          clearVerifyTimeout();
          setIsVerifying(false);
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
        clearVerifyTimeout();
        if (!resultReceived) {
          // onerror ya manejó los casos relevantes; aquí solo desbloqueamos
          setIsVerifying(false);
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
      setIsVerifying(true);
      try {
        recognition.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        toast({
          title: "Micrófono no disponible",
          description: "No se pudo iniciar el reconocimiento. Intenta de nuevo.",
          variant: "destructive",
          duration: 3000,
        });
        setIsVerifying(false);
        setIsRecording(false);
      }
    } catch (error: any) {
      console.error("Error starting recording:", error);
      const name = error?.name || "";
      let description = "No se pudo acceder al micrófono. Intenta de nuevo.";
      if (name === "NotAllowedError" || name === "SecurityError") {
        description = "Permiso de micrófono bloqueado. Habilítalo en los ajustes del navegador y recarga la página.";
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        description = "No se encontró un micrófono conectado.";
      } else if (name === "NotReadableError") {
        description = "El micrófono está siendo usado por otra aplicación.";
      }
      toast({
        title: "Micrófono no disponible",
        description,
        variant: "destructive",
        duration: 4000,
      });
      setIsRecording(false);
      setIsVerifying(false);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecording(false);
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      const audioUrl = URL.createObjectURL(recordedAudio);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  // Verificación de pronunciación integrada al flujo de grabación con SpeechRecognition.


  // Generar opciones de significado (Español -> Inglés)
  const getMeaningOptions = () => {
    // Special case for "En" word (id=26) - show "In/At" as the correct option
    if (wordId === "26") {
      const distractors = ["on", "with", "of"];
      return ["In/At", ...distractors].sort(() => Math.random() - 0.5);
    }
    
    const distractors = ["always", "can", "get", "want", "yesterday", "all", "seem", "must", "time"];
    const filtered = distractors.filter(d => d !== english.toLowerCase());
    const randomDistractors = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
    return [english, ...randomDistractors].sort(() => Math.random() - 0.5);
  };

  // Generar opciones de significado inverso (Inglés -> Español)
  const getReverseMeaningOptions = () => {
    const distractors = ["correr", "taza", "yo", "ella", "libro", "casa", "agua", "comer", "dormir"];
    const filtered = distractors.filter(d => d !== spanish.toLowerCase());
    const randomDistractors = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
    return [spanish, ...randomDistractors].sort(() => Math.random() - 0.5);
  };

  // Generar letras desordenadas para ortografía
  const generateJumbledLetters = (word: string) => {
    // Special case for "En" which needs letters for both "In" and "At"
    if (wordId === "26") {
      const letters = ['i', 'n', 'a', 't'];
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      const distractors: string[] = [];
      
      while (distractors.length < 3) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!letters.includes(randomLetter) && randomLetter !== ' ') {
          distractors.push(randomLetter);
        }
      }
      
      return [...letters, ...distractors].sort(() => Math.random() - 0.5);
    }
    
    const letters = word.split('');
    const normalizedLetters = letters.map((letter) => letter.toLowerCase());
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const distractors: string[] = [];
    
    while (distractors.length < 3) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!normalizedLetters.includes(randomLetter) && randomLetter !== ' ') {
        distractors.push(randomLetter);
      }
    }
    
    return [...letters, ...distractors].sort(() => Math.random() - 0.5);
  };

  // Cargar imágenes fijas - Mapeo completo según Excel de 33 palabras
  const loadFixedImages = async () => {
    setIsLoadingImages(true);
    try {
      // Orden: [imagen correcta, distractor1, distractor2, distractor3]
      const sets: Record<string, { slug: string; fallbacks: [string, string, string, string] }> = {
        'to want': { slug: 'querer', fallbacks: [querer1, querer2, querer3, querer4] },
        'fruit': { slug: 'fruta', fallbacks: [fruta1, fruta2, fruta3, fruta4] },
        'to read': { slug: 'leer', fallbacks: [leer1, leer2, leer3, leer4] },
        'a': { slug: 'un', fallbacks: [un1, un2, un3, un4] },
        'an': { slug: 'un', fallbacks: [un1, un2, un3, un4] },
        'book': { slug: 'libro', fallbacks: [libro1, libro2, libro3, libro4] },
        'of': { slug: 'de', fallbacks: [de1, de2, de3, de4] },
        'from': { slug: 'de', fallbacks: [de1, de2, de3, de4] },
        'to sleep': { slug: 'dormir', fallbacks: [dormir1, dormir2, dormir3, dormir4] },
        'to have': { slug: 'tener', fallbacks: [tener1, tener2, tener3, tener4] },
        'have to': { slug: 'tener-que', fallbacks: [tenerQue1, tenerQue2, tenerQue3, tenerQue4] },
        'to go': { slug: 'ir', fallbacks: [ir1, ir2, ir3, ir4] },
        'go': { slug: 'ir', fallbacks: [ir1, ir2, ir3, ir4] },
        'to': { slug: 'a', fallbacks: [a1, a2, a3, a4] },
        'to visit': { slug: 'visitar', fallbacks: [visitar1, visitar2, visitar3, visitar4] },
        'to like': { slug: 'gustar', fallbacks: [gustar1, gustar2, gustar3, gustar4] },
        'us (indirect)': { slug: 'nos-complemento', fallbacks: [nosComplemento1, nosComplemento2, nosComplemento3, nosComplemento4] },
        'to invite': { slug: 'invitar', fallbacks: [invitar1, invitar2, invitar3, invitar4] },
        'you (direct object)': { slug: 'tu-complemento', fallbacks: [tuComplemento1, tuComplemento2, tuComplemento3, tuComplemento4] },
        'tomorrow': { slug: 'manana-tiempo', fallbacks: [mananaTiempo1, mananaTiempo2, mananaTiempo3, mananaTiempo4] },
        'morning': { slug: 'manana-dia', fallbacks: [mananaDia1, mananaDia2, mananaDia3, mananaDia4] },
        'meeting': { slug: 'reunion', fallbacks: [reunion1, reunion2, reunion3, reunion4] },
        'work': { slug: 'trabajo', fallbacks: [trabajo1, trabajo2, trabajo3, trabajo4] },
        'family': { slug: 'familia', fallbacks: [familia1, familia2, familia3, familia4] },
        'to need': { slug: 'necesitar', fallbacks: [necesitar1, necesitar2, necesitar3, necesitar4] },
        'to practice': { slug: 'practicar', fallbacks: [practicar1, practicar2, practicar3, practicar4] },
        'english': { slug: 'ingles', fallbacks: [ingles1, ingles2, ingles3, ingles4] },
        'all': { slug: 'todos', fallbacks: [todos1, todos2, todos3, todos4] },
        'every': { slug: 'todos', fallbacks: [todos1, todos2, todos3, todos4] },
        'days': { slug: 'dias', fallbacks: [dias1, dias2, dias3, dias4] },
        'she': { slug: 'ella', fallbacks: [ella1, ella2, ella3, ella4] },
        'they': { slug: 'ellos', fallbacks: [ellos1, ellos2, ellos3, ellos4] },
        'we': { slug: 'nosotros', fallbacks: [nosotros1, nosotros2, nosotros3, nosotros4] },
        'the': { slug: 'el', fallbacks: [el1, el2, el3, el4] },
        'you': { slug: 'tu', fallbacks: [tu1, tu2, tu3, tu4] },
        'your': { slug: 'tu', fallbacks: [tu1, tu2, tu3, tu4] },
        'my': { slug: 'mi', fallbacks: [mi1, mi2, mi3, mi4] },
        'i': { slug: 'yo', fallbacks: [yo1, yo2, yo3, yo4] },
        'I': { slug: 'yo', fallbacks: [yo1, yo2, yo3, yo4] },
        'us': { slug: 'nos', fallbacks: [nos1, nos2, nos3, nos4] },
        'in': { slug: 'en', fallbacks: [en1, en2, en3, en4] },
        'on': { slug: 'en', fallbacks: [en1, en2, en3, en4] },
        'at': { slug: 'en', fallbacks: [en1, en2, en3, en4] },
        'important': { slug: 'importante', fallbacks: [importante1, importante2, importante3, importante4] },
        'this': { slug: 'esta', fallbacks: [esta1, esta2, esta3, esta4] },
        'is': { slug: 'esta', fallbacks: [esta1, esta2, esta3, esta4] },
        'before': { slug: 'antes', fallbacks: [antes1, antes2, antes3, antes4] },
        'afternoon': { slug: 'tarde', fallbacks: [tarde1, tarde2, tarde3, tarde4] },
        'evening': { slug: 'tarde', fallbacks: [tarde1, tarde2, tarde3, tarde4] },
        'late': { slug: 'tarde', fallbacks: [tarde1, tarde2, tarde3, tarde4] },
        'next': { slug: 'proximo', fallbacks: [proximo1, proximo2, proximo3, proximo4] },
        'weekend': { slug: 'findesemana', fallbacks: [findesemana1, findesemana2, findesemana3, findesemana4] },
        'to ask': { slug: 'pedir', fallbacks: [pedir1, pedir2, pedir3, pedir4] },
        'to order': { slug: 'pedir', fallbacks: [pedir1, pedir2, pedir3, pedir4] },
        'to buy': { slug: 'comprar', fallbacks: [comprar1, comprar2, comprar3, comprar4] },
        'vegetables': { slug: 'verduras', fallbacks: [verduras1, verduras2, verduras3, verduras4] },
        'fruits': { slug: 'frutas', fallbacks: [frutas1, frutas2, frutas3, frutas4] },
        'fresh (plural)': { slug: 'frescas', fallbacks: [frescas1, frescas2, frescas3, frescas4] },
        'fresh': { slug: 'fresca', fallbacks: [fresca1, fresca2, fresca3, fresca4] },
        'market': { slug: 'mercado', fallbacks: [mercado1, mercado2, mercado3, mercado4] },
        'bread': { slug: 'pan', fallbacks: [pan1, pan2, pan3, pan4] },
        'meat': { slug: 'carne', fallbacks: [carne1, carne2, carne3, carne4] },
        'i want': { slug: 'quiero', fallbacks: [quiero1, quiero2, quiero3, quiero4] },
        'want': { slug: 'querer', fallbacks: [querer1, querer2, querer3, querer4] },
        'to eat': { slug: 'comer', fallbacks: [comer1, comer2, comer3, comer4] },
        'come': { slug: 'venir', fallbacks: [venir1, venir2, venir3, venir4] },
        'to come': { slug: 'venir', fallbacks: [venir1, venir2, venir3, venir4] },
      };

      const wordKey = english.toLowerCase();
      const item = sets[wordKey];

      let images: [string, string, string, string];
      if (item) {
        images = await loadWordImages(item.slug, item.fallbacks);
      } else {
        // Try loading by Spanish slug as a fallback for unmapped words
        const slugFromSpanish = (spanish || '')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-');
        images = await loadWordImages(slugFromSpanish, [fresca1, fresca2, fresca3, fresca4]);
      }
      
      const options: ImageOption[] = images.map((url, index) => ({
        id: index,
        url,
        isCorrect: index === 0
      }));

      setImageOptions(options.sort(() => Math.random() - 0.5));
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

  // Manejar selección de significado (solo marca, no valida)
  const handleMeaningSelection = (option: string) => {
    if (meaningVerified) return;
    setSelectedMeaningOption(option);
  };

  // Verificar la opción seleccionada al pulsar VERIFICAR
  const handleVerifyMeaning = () => {
    if (!selectedMeaningOption || meaningVerified) return;
    const option = selectedMeaningOption;
    setMeaningVerified(true);
    const isCorrect = wordId === "26"
      ? option === "In/At"
      : option.toLowerCase() === english.toLowerCase();

    if (isCorrect) {
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Excelente trabajo",
        duration: 2000,
        className: "bg-green-500 text-white border-green-600",
      });

      // Marcar la palomita inmediatamente para feedback visual
      const updatedProgress = moduleProgress.map(m =>
        m.id === currentModule ? { ...m, completed: true } : m
      );
      setModuleProgress(updatedProgress);

      // Esperar antes de avanzar para que el usuario vea la palomita verde
      setTimeout(() => {
        if (checkIfAllModulesCompleted(updatedProgress)) {
          markWordAsLearned();
          setCurrentModule(6);
        } else {
          setCurrentModule(currentModule + 1);
        }
        setSelectedMeaningOption(null);
        setMeaningVerified(false);
      }, 1200);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 2000,
      });
      setTimeout(() => {
        setSelectedMeaningOption(null);
        setMeaningVerified(false);
      }, 1000);
    }
  };

  // Manejar selección de traducción inversa (Inglés -> Español)
  const handleReverseMeaningSelection = (option: string) => {
    setSelectedMeaningOption(option);
    const isCorrect = option.toLowerCase() === spanish.toLowerCase();
    
    if (isCorrect) {
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Excelente trabajo",
        duration: 2000,
        className: "bg-green-500 text-white border-green-600",
      });
      
      setTimeout(() => {
        const updatedProgress = moduleProgress.map(m => 
          m.id === currentModule ? { ...m, completed: true } : m
        );
        setModuleProgress(updatedProgress);
        
        if (checkIfAllModulesCompleted(updatedProgress)) {
          markWordAsLearned();
          setCurrentModule(6); // Ir al resumen
        } else {
          setCurrentModule(currentModule + 1);
        }
        setSelectedMeaningOption(null);
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 2000,
      });
      setTimeout(() => setSelectedMeaningOption(null), 1000);
    }
  };

  // Manejar verificación de escritura
  const handleCheckWriting = () => {
    // Special handling for "En" word (id=26)
    if (wordId === "26") {
      const correct1 = userInput1.trim().toLowerCase() === "in";
      const correct2 = userInput2.trim().toLowerCase() === "at";
      
      if (correct1 && correct2) {
        playSuccessSound();
        toast({
          title: "¡Correcto!",
          description: "Excelente trabajo",
          duration: 2000,
          className: "bg-green-500 text-white border-green-600",
        });
        
        setTimeout(() => {
          const updatedProgress = moduleProgress.map(m => 
            m.id === currentModule ? { ...m, completed: true } : m
          );
          setModuleProgress(updatedProgress);
          
          if (checkIfAllModulesCompleted(updatedProgress)) {
            markWordAsLearned();
            setCurrentModule(6);
          } else {
            setCurrentModule(currentModule + 1);
          }
          setUserInput1("");
          setUserInput2("");
        }, 1000);
      } else {
        toast({
          title: "Incorrecto",
          description: "Escribe 'In' en el primer campo y 'At' en el segundo",
          variant: "destructive",
          duration: 2000,
        });
      }
      return;
    }
    
    // Special handling for a/an
    if (english.toLowerCase() === "a/an") {
      const correct1 = userInput1.trim().toLowerCase() === "a";
      const correct2 = userInput2.trim().toLowerCase() === "an";
      
      if (correct1 && correct2) {
        playSuccessSound();
        toast({
          title: "¡Correcto!",
          description: "Excelente trabajo",
          duration: 2000,
          className: "bg-green-500 text-white border-green-600",
        });
        
        setTimeout(() => {
          const updatedProgress = moduleProgress.map(m => 
            m.id === currentModule ? { ...m, completed: true } : m
          );
          setModuleProgress(updatedProgress);
          
          if (checkIfAllModulesCompleted(updatedProgress)) {
            markWordAsLearned();
            setCurrentModule(5); // Ir al resumen
          } else {
            setCurrentModule(currentModule + 1);
          }
          setUserInput1("");
          setUserInput2("");
        }, 1000);
      } else {
        toast({
          title: "Incorrecto",
          description: "Escribe 'a' en el primer campo y 'an' en el segundo",
          variant: "destructive",
          duration: 2000,
        });
      }
      return;
    }
    
    const target = english.trim();
    const userTrimmed = userInput.trim();
    // Case-sensitive estricto para "I", flexible para el resto
    const isCorrect = target === "I"
      ? userTrimmed === "I"
      : userTrimmed.toLowerCase() === target.toLowerCase();
    
    if (isCorrect) {
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Excelente trabajo",
        duration: 2000,
        className: "bg-green-500 text-white border-green-600",
      });
      
      setTimeout(() => {
        const updatedProgress = moduleProgress.map(m => 
          m.id === currentModule ? { ...m, completed: true } : m
        );
        setModuleProgress(updatedProgress);
        
        if (checkIfAllModulesCompleted(updatedProgress)) {
          markWordAsLearned();
          setCurrentModule(6); // Ir al resumen
        } else {
          setCurrentModule(currentModule + 1);
        }
        setUserInput("");
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Manejar botón de pronunciación
  const handlePronunciationButton = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      // Siempre iniciar una nueva grabación; la reproducción se maneja en el botón separado
      handleStartRecording();
    }
  };

  // Manejar ortografía
  const handleLetterClick = (letter: string, index: number) => {
    if (!usedLetterIndices.includes(index)) {
      // Special handling for wordId 26 (In/At)
      if (wordId === "26") {
        // If userInput1 has less than 2 letters, add to userInput1
        if (userInput1.length < 2) {
          setUserInput1(prev => prev + letter);
        } else if (userInput2.length < 2) {
          // Otherwise add to userInput2
          setUserInput2(prev => prev + letter);
        }
      } else {
        setSpellingAttempt(prev => prev + letter);
      }
      setUsedLetterIndices(prev => [...prev, index]);
    }
  };

  const handleRemoveLastLetter = () => {
    if (wordId === "26") {
      // Remove from userInput2 first, then userInput1
      if (userInput2.length > 0) {
        setUserInput2(prev => prev.slice(0, -1));
        setUsedLetterIndices(prev => prev.slice(0, -1));
      } else if (userInput1.length > 0) {
        setUserInput1(prev => prev.slice(0, -1));
        setUsedLetterIndices(prev => prev.slice(0, -1));
      }
    } else {
      if (spellingAttempt.length > 0) {
        setSpellingAttempt(prev => prev.slice(0, -1));
        setUsedLetterIndices(prev => prev.slice(0, -1));
      }
    }
  };

  const handleCheckSpelling = () => {
    // Special handling for wordId 26 (In/At)
    if (wordId === "26") {
      const correct1 = userInput1.toLowerCase() === "in";
      const correct2 = userInput2.toLowerCase() === "at";
      
      if (correct1 && correct2) {
        playSuccessSound();
        toast({
          title: "¡Correcto!",
          description: "Excelente trabajo",
          duration: 2000,
          className: "bg-green-500 text-white border-green-600",
        });
        
        setTimeout(() => {
          const updatedProgress = moduleProgress.map(m => 
            m.id === currentModule ? { ...m, completed: true } : m
          );
          setModuleProgress(updatedProgress);
          
          if (checkIfAllModulesCompleted(updatedProgress)) {
            markWordAsLearned();
            setCurrentModule(6);
          } else {
            setCurrentModule(currentModule + 1);
          }
          setUserInput1("");
          setUserInput2("");
          setUsedLetterIndices([]);
        }, 1000);
      } else {
        toast({
          title: "Incorrecto",
          description: "Forma 'In' y 'At' con las letras disponibles",
          variant: "destructive",
          duration: 2000,
        });
      }
      return;
    }
    
    const targetSp = english.trim();
    const isCorrect = targetSp === "I"
      ? spellingAttempt.trim() === "I"
      : spellingAttempt.toLowerCase() === targetSp.toLowerCase();
    
    if (isCorrect) {
      playSuccessSound();
      toast({
        title: "¡Correcto!",
        description: "Excelente trabajo",
        duration: 2000,
        className: "bg-green-500 text-white border-green-600",
      });
      
      setTimeout(() => {
        const updatedProgress = moduleProgress.map(m => 
          m.id === currentModule ? { ...m, completed: true } : m
        );
        setModuleProgress(updatedProgress);
        
        if (checkIfAllModulesCompleted(updatedProgress)) {
          markWordAsLearned();
          setCurrentModule(6); // Ir al resumen
        } else {
          setCurrentModule(currentModule + 1);
        }
        setSpellingAttempt("");
        setUsedLetterIndices([]);
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 2000,
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
        duration: 2000,
        className: "bg-green-500 text-white border-green-600",
      });
      
      setTimeout(() => {
        const updatedProgress = moduleProgress.map(m => 
          m.id === currentModule ? { ...m, completed: true } : m
        );
        setModuleProgress(updatedProgress);
        
        if (checkIfAllModulesCompleted(updatedProgress)) {
          markWordAsLearned();
          setCurrentModule(6); // Ir al resumen
        } else {
          setCurrentModule(currentModule + 1);
        }
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
        duration: 2000,
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
            className="relative"
          >
            {/* Decorative glows */}
            <div className="pointer-events-none fixed top-1/4 -left-20 w-64 h-64 bg-primary/10 blur-[100px]" />
            <div className="pointer-events-none fixed bottom-1/4 -right-20 w-64 h-64 bg-tertiary/10 blur-[100px]" />

            <div className="flex flex-col items-center px-2 pt-1 pb-4">
              {/* Instructional header con icono lightbulb */}
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-5 h-5 text-tertiary" />
                <h2 className="font-headline font-extrabold text-xl md:text-2xl tracking-tight text-on-surface uppercase italic opacity-90">
                  ¿Cómo se traduce?
                </h2>
              </div>

              {/* Central highlight word */}
              <div className="relative group mb-9">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-3xl blur opacity-20" />
                <div className="relative glass-card rounded-3xl py-4 px-8 md:px-12 border border-white/10">
                  <h1 className="font-headline font-black text-3xl md:text-4xl text-on-surface text-shadow-glow text-center">
                    {spanish.charAt(0).toUpperCase() + spanish.slice(1)}
                  </h1>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-surface-container-low px-3 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[10px] text-cyan-400" style={{ fontSize: '12px' }}>language</span>
                    <span className="text-[10px] font-bold text-on-surface/70 tracking-tighter">ORIGEN: ESP</span>
                  </div>
                </div>
              </div>

              {displayNote && (
                <p className="text-sm text-center text-muted-foreground italic mb-6 bg-primary/5 p-3 rounded-lg max-w-xl">
                  {displayNote}
                </p>
              )}

              {/* Options bento grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
                {getMeaningOptions().map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const isSelected = selectedMeaningOption === option;
                  const isCorrect = wordId === "26" ? option === "In/At" : option.toLowerCase() === english.toLowerCase();
                  const showCorrect = meaningVerified && isSelected && isCorrect;
                  const showWrong = meaningVerified && isSelected && !isCorrect;
                  const isPicked = !meaningVerified && isSelected;
                  return (
                    <button
                      key={index}
                      onClick={() => handleMeaningSelection(option)}
                      disabled={meaningVerified}
                      className={`group relative flex items-center justify-between px-5 py-2 rounded-2xl text-left overflow-hidden transition-all duration-300 active:scale-95 disabled:active:scale-100 border-2 ${
                        showCorrect
                          ? "bg-emerald-500/15 border-emerald-500/60 shadow-[0_0_25px_hsl(142_76%_45%/0.2)]"
                          : showWrong
                          ? "bg-destructive/15 border-destructive/60 shadow-[0_0_25px_hsl(var(--destructive)/0.2)]"
                          : isPicked
                          ? "bg-cyan-500/10 border-cyan-400"
                          : "bg-surface-container-high hover:border-cyan-400 border-white/15"
                      }`}
                    >
                      <span className="font-headline text-xl font-bold text-on-surface">{option}</span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          showCorrect
                            ? "bg-tertiary"
                            : showWrong
                            ? "bg-destructive"
                            : isPicked
                            ? "border border-cyan-400"
                            : "border border-muted-foreground/40 group-hover:border-cyan-400"
                        }`}
                      >
                        {showCorrect ? (
                          <Check className="w-5 h-5 text-surface" strokeWidth={3} />
                        ) : showWrong ? (
                          <span className="text-base font-black text-destructive-foreground">✕</span>
                        ) : (
                          <span className={`text-xs font-bold ${isPicked ? 'text-cyan-400' : 'text-muted-foreground group-hover:text-cyan-400'}`}>{letter}</span>
                        )}
                      </div>
                      {showCorrect && (
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-tertiary/15 rounded-bl-lg">
                          <span className="text-[8px] font-black text-tertiary uppercase tracking-wider">Validado</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* CTA: VERIFICAR */}
              <button
                onClick={handleVerifyMeaning}
                disabled={selectedMeaningOption === null || meaningVerified}
                className="w-full max-w-2xl relative overflow-hidden rounded-2xl py-4 px-6 font-headline font-black tracking-wider uppercase text-base bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-[0_0_30px_hsl(330_85%_55%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                Verificar
              </button>
            </div>
          </motion.div>
        );

      case 1: // Escritura
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-6"
          >
            {/* Decorative glows (mismos colores del ejercicio 1) */}
            <div className="pointer-events-none fixed top-1/4 -left-20 w-64 h-64 bg-primary/10 blur-[100px]" />
            <div className="pointer-events-none fixed bottom-1/4 -right-20 w-64 h-64 bg-tertiary/10 blur-[100px]" />

            <div className="relative glass-card border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-on-surface">
                <span className="gradient-text-primary">Escribe </span>
                <span className="text-on-surface font-bold text-3xl">{spanish}</span>
                <span className="gradient-text-primary"> en Inglés</span>
              </h3>

              {wordId === "26" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-on-surface/70 mb-2">Ubicación del objeto</p>
                      <Input
                        value={userInput1}
                        onChange={(e) => setUserInput1(e.target.value)}
                        placeholder="..."
                        className="text-center text-xl h-14 w-32 bg-surface-container-high border-2 border-white/15 focus-visible:border-cyan-400 text-on-surface"
                        onKeyDown={(e) => e.key === "Enter" && handleCheckWriting()}
                        autoComplete="off"
                      />
                    </div>
                    <span className="text-2xl font-bold text-on-surface/60 mt-6">o</span>
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-on-surface/70 mb-2">Ubicación de la acción</p>
                      <Input
                        value={userInput2}
                        onChange={(e) => setUserInput2(e.target.value)}
                        placeholder="..."
                        className="text-center text-xl h-14 w-32 bg-surface-container-high border-2 border-white/15 focus-visible:border-cyan-400 text-on-surface"
                        onKeyDown={(e) => e.key === "Enter" && handleCheckWriting()}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCheckWriting}
                    disabled={!userInput1.trim() || !userInput2.trim()}
                    className="w-full relative overflow-hidden rounded-2xl py-4 px-6 font-headline font-black tracking-wider uppercase text-base bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-[0_0_30px_hsl(330_85%_55%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                  >
                    Verificar
                  </button>
                </div>
              ) : english.toLowerCase() === "a/an" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Input
                      value={userInput1}
                      onChange={(e) => setUserInput1(e.target.value)}
                      placeholder="..."
                      className="text-center text-xl h-14 w-32 bg-surface-container-high border-2 border-white/15 focus-visible:border-cyan-400 text-on-surface"
                      onKeyDown={(e) => e.key === "Enter" && handleCheckWriting()}
                      autoComplete="off"
                    />
                    <span className="text-2xl font-bold text-on-surface/60">o</span>
                    <Input
                      value={userInput2}
                      onChange={(e) => setUserInput2(e.target.value)}
                      placeholder="..."
                      className="text-center text-xl h-14 w-32 bg-surface-container-high border-2 border-white/15 focus-visible:border-cyan-400 text-on-surface"
                      onKeyDown={(e) => e.key === "Enter" && handleCheckWriting()}
                      autoComplete="off"
                    />
                  </div>

                  <button
                    onClick={handleCheckWriting}
                    disabled={!userInput1.trim() || !userInput2.trim()}
                    className="w-full relative overflow-hidden rounded-2xl py-4 px-6 font-headline font-black tracking-wider uppercase text-base bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-[0_0_30px_hsl(330_85%_55%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                  >
                    Verificar
                  </button>
                </div>
              ) : (
                <>
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Escribe aquí..."
                    className="text-center text-xl h-14 mb-4 bg-surface-container-high border-2 border-white/15 focus-visible:border-cyan-400 text-on-surface"
                    onKeyDown={(e) => e.key === "Enter" && handleCheckWriting()}
                    autoComplete="off"
                  />

                  <button
                    onClick={handleCheckWriting}
                    disabled={!userInput.trim()}
                    className="w-full relative overflow-hidden rounded-2xl py-4 px-6 font-headline font-black tracking-wider uppercase text-base bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-[0_0_30px_hsl(330_85%_55%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                  >
                    Verificar
                  </button>
                </>
              )}
            </div>
          </motion.div>
        );

      case 2: // Ortografía
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-6"
          >
            <div className="pointer-events-none fixed top-1/4 -left-20 w-64 h-64 bg-primary/10 blur-[100px]" />
            <div className="pointer-events-none fixed bottom-1/4 -right-20 w-64 h-64 bg-tertiary/10 blur-[100px]" />

            <div className="relative glass-card border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-2 text-center gradient-text-primary">
                Deletrea la palabra
              </h3>
              <p className="text-center text-lg text-on-surface/70 mb-6">
                <span className="text-on-surface font-bold text-4xl md:text-5xl">{spanish.charAt(0).toUpperCase() + spanish.slice(1)}</span>
                <span className="block text-base mt-1">en Inglés</span>
              </p>

              {wordId === "26" ? (
                <>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="min-h-[80px] w-32 bg-surface-container-high border-2 border-dashed border-white/20 rounded-lg p-4 flex items-center justify-center">
                      <p className="text-2xl font-bold tracking-wider text-on-surface">
                        {userInput1 || " "}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-on-surface/60">o</span>
                    <div className="min-h-[80px] w-32 bg-surface-container-high border-2 border-dashed border-white/20 rounded-lg p-4 flex items-center justify-center">
                      <p className="text-2xl font-bold tracking-wider text-on-surface">
                        {userInput2 || " "}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {jumbledLetters.map((letter, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-12 h-12 text-xl font-bold bg-surface-container-high border-white/15 text-on-surface hover:border-cyan-400 hover:bg-surface-container-high ${
                          usedLetterIndices.includes(index) ? "opacity-30" : ""
                        }`}
                        onClick={() => handleLetterClick(letter, index)}
                        disabled={usedLetterIndices.includes(index)}
                      >
                        {letter}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-surface-container-high border-white/15 text-on-surface hover:border-cyan-400 hover:bg-surface-container-high"
                      onClick={handleRemoveLastLetter}
                      disabled={userInput1.length === 0 && userInput2.length === 0}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Borrar Última
                    </Button>
                    <button
                      className="flex-1 relative overflow-hidden rounded-md py-2 px-4 font-headline font-black tracking-wider uppercase text-base bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-[0_0_30px_hsl(330_85%_55%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                      onClick={handleCheckSpelling}
                      disabled={userInput1.length === 0 || userInput2.length === 0}
                    >
                      Verificar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="min-h-[80px] bg-surface-container-high border-2 border-dashed border-white/20 rounded-lg p-4 mb-6 flex items-center justify-center">
                    <p className="text-2xl font-bold tracking-wider text-on-surface">
                      {spellingAttempt || " "}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {jumbledLetters.map((letter, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-12 h-12 text-xl font-bold bg-surface-container-high border-white/15 text-on-surface hover:border-cyan-400 hover:bg-surface-container-high ${
                          usedLetterIndices.includes(index) ? "opacity-30" : ""
                        }`}
                        onClick={() => handleLetterClick(letter, index)}
                        disabled={usedLetterIndices.includes(index)}
                      >
                        {letter}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-surface-container-high border-white/15 text-on-surface hover:border-cyan-400 hover:bg-surface-container-high"
                      onClick={handleRemoveLastLetter}
                      disabled={spellingAttempt.length === 0}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Borrar Última
                    </Button>
                    <button
                      className="flex-1 relative overflow-hidden rounded-md py-2 px-4 font-headline font-black tracking-wider uppercase text-base bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-[0_0_30px_hsl(330_85%_55%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                      onClick={handleCheckSpelling}
                      disabled={spellingAttempt.length === 0}
                    >
                      Verificar
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        );

      case 3: // Selección de imagen
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-6"
          >
            <div className="pointer-events-none fixed top-1/4 -left-20 w-64 h-64 bg-primary/10 blur-[100px]" />
            <div className="pointer-events-none fixed bottom-1/4 -right-20 w-64 h-64 bg-tertiary/10 blur-[100px]" />

            <div className="relative glass-card border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-2 text-center gradient-text-primary">
                Selecciona la imagen que representa
              </h3>
              <p className="text-center text-3xl md:text-4xl font-bold text-white mb-6">
                {wordId === "26" ? "In/At" : english}
              </p>

              {isLoadingImages ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-surface-container-high rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {imageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleImageSelection(option.id)}
                      disabled={selectedImageId !== null}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all bg-surface-container-high ${
                        selectedImageId === option.id
                          ? option.isCorrect
                            ? "border-emerald-500 ring-4 ring-emerald-500/20"
                            : "border-destructive ring-4 ring-destructive/20"
                          : "border-white/15 hover:border-cyan-400"
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
            </div>
          </motion.div>
        );

      case 4: // Traducción inversa (Inglés -> Español)
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-6"
          >
            <div className="pointer-events-none fixed top-1/4 -left-20 w-64 h-64 bg-primary/10 blur-[100px]" />
            <div className="pointer-events-none fixed bottom-1/4 -right-20 w-64 h-64 bg-tertiary/10 blur-[100px]" />

            <div className="relative glass-card border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-2 text-center gradient-text-primary">
                Elige el significado correcto
              </h3>
              <p className="text-center text-3xl font-bold text-on-surface mb-8">
                {wordId === "26" ? "In/At" : english.charAt(0).toUpperCase() + english.slice(1)}
              </p>

              <p className="text-sm text-center text-on-surface/70 mb-6">
                ¿Cuál es el significado en español?
              </p>

              <div className="space-y-3">
                {getReverseMeaningOptions().map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full h-14 text-lg bg-surface-container-high border-2 text-on-surface focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${
                      selectedMeaningOption === option
                        ? option.toLowerCase() === spanish.toLowerCase()
                          ? "bg-emerald-500/15 border-emerald-500/60 hover:bg-emerald-500/15"
                          : "bg-destructive/15 border-destructive/60 hover:bg-destructive/15"
                        : "border-white/15 hover:border-cyan-400 hover:bg-surface-container-high"
                    }`}
                    onClick={() => handleReverseMeaningSelection(option)}
                    disabled={selectedMeaningOption !== null}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 5: // Pronunciación
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-6"
          >
            <div className="pointer-events-none fixed top-1/4 -left-20 w-64 h-64 bg-primary/10 blur-[100px]" />
            <div className="pointer-events-none fixed bottom-1/4 -right-20 w-64 h-64 bg-tertiary/10 blur-[100px]" />

            <div className="relative glass-card border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-center gradient-text-primary">
                Escucha y Pronuncia
              </h3>

              <div className="flex justify-center items-center gap-4 mb-8">
                <p className="text-3xl font-bold text-on-surface">
                  {english.charAt(0).toUpperCase() + english.slice(1)}
                </p>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-14 h-14 rounded-full hover:bg-cyan-400/10"
                  onClick={handlePlayAudio}
                >
                  <Volume2 className="w-6 h-6 text-cyan-400" />
                </Button>
              </div>

              <p className="text-center text-on-surface/70 mb-6">
                {isVerifying
                  ? "Verificando tu pronunciación..."
                  : isRecording
                  ? "Habla ahora, te estamos escuchando"
                  : "Escucha la palabra y practica tu pronunciación"}
              </p>

              {isRecording && (
                <div
                  className="flex items-center justify-center gap-3 mb-4 py-3 px-4 rounded-lg bg-destructive/10 border border-destructive/40"
                  role="status"
                  aria-live="polite"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                  </span>
                  <span className="text-sm font-medium text-destructive">Capturando audio…</span>
                </div>
              )}

              <button
                onClick={handlePronunciationButton}
                disabled={isVerifying && !isRecording}
                className={`w-full h-12 rounded-md font-headline font-black tracking-wider uppercase text-base text-white flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
                  isRecording
                    ? 'bg-destructive hover:bg-destructive animate-pulse-subtle'
                    : 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-[0_0_30px_hsl(330_85%_55%/0.4)]'
                }`}
              >
                <Mic className="w-5 h-5 mr-2" />
                {isRecording
                  ? 'Terminar grabación'
                  : 'GRABAR'}
              </button>

              {recordedAudio && !isVerifying && (
                <Button
                  variant="outline"
                  onClick={handlePlayRecording}
                  className="w-full h-12 mt-2 bg-surface-container-high border-white/15 text-on-surface hover:border-cyan-400 hover:bg-surface-container-high"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Escuchar mi grabación
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  const visitKey = `module5_visits_word_${wordId}`;
                  const visits = parseInt(localStorage.getItem(visitKey) || "0");
                  const newVisits = visits + 1;
                  localStorage.setItem(visitKey, newVisits.toString());

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

                  if (newVisits >= 2) {
                    navigate("/vocabulario-dia-1");
                  } else {
                    setCurrentModule(6);
                  }
                }}
                className="w-full h-12 mt-4 bg-surface-container-high border-white/15 text-on-surface hover:border-cyan-400 hover:bg-surface-container-high"
              >
                Dejar para más tarde
              </Button>
            </div>
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
                ¿Cuál imagen representa: <span className="text-primary font-semibold">{wordId === "26" ? "In/At" : english}</span>?
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

      case 4: // Traducción inversa (Inglés -> Español)
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2 text-center gradient-text-primary">
                Elige el significado correcto
              </h3>
              <p className="text-center text-3xl font-bold text-primary mb-8">
                {wordId === "26" ? "In/At" : english.charAt(0).toUpperCase() + english.slice(1)}
              </p>
              
              <p className="text-sm text-center text-muted-foreground mb-6">
                ¿Cuál es el significado en español?
              </p>
              
              <div className="space-y-3">
                {getReverseMeaningOptions().map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full h-14 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${
                      selectedMeaningOption === option
                        ? option.toLowerCase() === spanish.toLowerCase()
                          ? "bg-green-500/20 border-green-500 hover:bg-green-500/30"
                          : "bg-red-500/20 border-red-500 hover:bg-red-500/30"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => handleReverseMeaningSelection(option)}
                    disabled={selectedMeaningOption !== null}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        );

      case 5: // Pronunciación
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
                  : isRecording
                  ? "Habla ahora, te estamos escuchando"
                  : "Escucha la palabra y practica tu pronunciación"}
              </p>

              {/* Indicador visual de grabación activa */}
              {isRecording && (
                <div
                  className="flex items-center justify-center gap-3 mb-4 py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/40"
                  role="status"
                  aria-live="polite"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-sm font-medium text-red-500">Capturando audio…</span>
                </div>
              )}

              <Button
                onClick={handlePronunciationButton}
                disabled={isVerifying && !isRecording}
                className={`w-full h-12 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse-subtle'
                    : 'gradient-animated'
                }`}
              >
                <Mic className="w-5 h-5 mr-2" />
                {isRecording
                  ? 'Terminar grabación'
                  : 'Practica tu pronunciación'}
              </Button>

              {recordedAudio && !isVerifying && (
                <Button
                  variant="outline"
                  onClick={handlePlayRecording}
                  className="w-full h-12 mt-2"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Escuchar mi grabación
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => {
                  // Trackear visitas al módulo 5 (pronunciación ahora al final)
                  const visitKey = `module5_visits_word_${wordId}`;
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
                    setCurrentModule(6);
                  }
                }}
                className="w-full h-12 mt-4"
              >
                Hacer después, continuar
              </Button>
            </Card>
          </motion.div>
        );

      case 6: // Resumen final
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
              {currentModule === 6 && moduleProgress.every(m => m.completed) ? (
                <Button
                  size="lg"
                  className="gradient-animated w-full max-w-xs mx-auto"
                  onClick={() => {
                    playSuccessSound();
                    markWordAsLearned();
                    const toastDiv = document.createElement('div');
                    toastDiv.className = 'fixed inset-0 flex items-center justify-center z-[100] bg-black/50';
                    toastDiv.innerHTML = `
                      <div class="bg-card border-2 border-green-500 rounded-xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
                        <div class="relative">
                          <div class="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <p class="text-lg text-green-600 font-semibold mb-2">Palabra aprendida</p>
                          <p class="text-4xl font-bold text-green-600 my-4">${english.charAt(0).toUpperCase() + english.slice(1)}</p>
                          <p class="text-lg text-muted-foreground mt-2">se ha agregado a tu vocabulario</p>
                        </div>
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
                  Agregar al Vocabulario
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="gradient-animated w-full max-w-xs mx-auto"
                    onClick={() => navigate("/vocabulario-dia-1")}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Ir a la lista
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
                </>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col selection:bg-accent/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vocabulario-dia-1")}
            className="hover:bg-primary/10"
            title="Volver a la lista de palabras"
          >
            <List className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Lista</span>
          </Button>
          
          <Badge variant="secondary" className="text-sm">
            {currentModule >= modules.length ? "Excelente" : `Ejercicio ${currentModule + 1} de ${modules.length}`}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10"
            title="Ejercicio anterior"
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
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Ejercicio anterior</span>
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
            {Math.min(currentModule + 1, modules.length)} de {modules.length} ejercicios
          </p>
        </motion.div>

        {/* Module Content */}
        <AnimatePresence mode="wait">
          {renderModule()}
        </AnimatePresence>

        {/* Module Navigation - íconos de palomita por módulo */}
        <div className="mt-8 flex justify-center gap-3">
          {moduleProgress.map((module, index) => {
            const isCompleted = module.completed;
            const isCurrent = index === currentModule;
            return (
              <div
                key={module.id}
                className={`transition-all ${isCurrent ? "scale-125" : ""}`}
                title={module.title}
                aria-label={`${module.title}${isCompleted ? " completado" : ""}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" strokeWidth={2.5} />
                ) : (
                  <Circle
                    className={`w-6 h-6 ${isCurrent ? "text-primary" : "text-muted-foreground/40"}`}
                    strokeWidth={2}
                  />
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default LearnWord;
