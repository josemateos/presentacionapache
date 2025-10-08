import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { DailyActionButton } from "@/components/dashboard/DailyActionButton";
import { DaySelector } from "@/components/dashboard/DaySelector";
import { QuickAccessButtons } from "@/components/dashboard/QuickAccessButtons";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { ProgressDetails } from "@/components/dashboard/ProgressDetails";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { AlertModal } from "@/components/dashboard/AlertModal";
import { AIChat } from "@/components/ai/AIChat";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface UserProgress {
  currentDay: number;
  phrasesCompleted: number;
  wordsMastered: number;
  auxLearned: number;
  streakDays: number;
  phrasesToday: number;
  newWordsToday: number;
  isPremium: boolean;
  reviewPendingCount: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("today");
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "" });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Estado simulado del usuario
  const [userProgress] = useState<UserProgress>({
    currentDay: 1,
    phrasesCompleted: 0,
    wordsMastered: 0,
    auxLearned: 0,
    streakDays: 0,
    phrasesToday: 0,
    newWordsToday: 0,
    isPremium: false,
    reviewPendingCount: 3,
  });

  // Fecha de registro simulada (7 días atrás)
  const registrationDate = new Date();
  registrationDate.setDate(registrationDate.getDate() - 7);

  // Estado de días completados (simulado)
  const [completedDays] = useState<Record<number, boolean>>({});

  const totalDays = 90;
  const totalPhrases = 450;
  const totalWords = 3000;
  const totalAux = 25;
  const totalPhrasesToday = 5;

  const handleDailyAction = () => {
    if (!completedDays[userProgress.currentDay]) {
      navigate("/vocabulario-dia-1");
    }
  };

  const handleSelectVocabularyDay = (day: number) => {
    const routes: Record<number, string> = {
      1: "/vocabulario-dia-1",
      2: "/vocabulario-dia-2",
      3: "/vocabulario-dia-3",
    };
    
    if (routes[day]) {
      navigate(routes[day]);
    }
  };

  const handleSelectDay = (day: number) => {
    if (day > userProgress.currentDay) {
      setAlertModal({
        isOpen: true,
        message: `Aún no has llegado al Día ${day}. ¡Sigue adelante!`,
      });
    } else {
      navigate(`/phrases-day?day=${day}`);
    }
  };

  const handleProfileClick = () => {
    toast({
      title: "Perfil",
      description: "Función próximamente disponible",
    });
  };

  const handleReviewClick = () => {
    toast({
      title: "Mi Repaso",
      description: "Accediendo a tus repasos pendientes",
    });
  };

  const handleAuxiliariesClick = () => {
    if (!userProgress.isPremium) {
      toast({
        title: "Auxiliares Clave",
        description: "Función premium - Próximamente disponible",
        variant: "default",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === "ai") {
      // No mostrar toast para AI ya que es funcional
      return;
    }
    
    const tabNames: Record<string, string> = {
      today: "Hoy",
      plan: "Plan de 90 Días",
      vocabulary: "Vocabulario",
      auxiliaries: "Auxiliares Clave",
      practice: "Práctica",
    };
    
    toast({
      title: tabNames[tab],
      description: "Función próximamente disponible",
    });
  };

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      <DashboardHeader
        onProfileClick={handleProfileClick}
        opacity={Math.max(0, 1 - scrollY / 200)}
      />

      {activeTab === "ai" ? (
        <div className="flex-grow pb-24">
          <AIChat />
        </div>
      ) : (
        <main className="flex-grow px-4 py-6 pb-24 space-y-6 md:space-y-8 container mx-auto max-w-4xl">
          <WelcomeSection
            userName="Carlos"
            currentDay={userProgress.currentDay}
            totalDays={totalDays}
            registrationDate={registrationDate}
          />

          <DailyActionButton
            currentDay={userProgress.currentDay}
            isCompleted={completedDays[userProgress.currentDay] || false}
            onClick={handleDailyAction}
            onSelectDay={handleSelectVocabularyDay}
          />

          <DaySelector
            currentDay={userProgress.currentDay}
            totalDays={totalDays}
            completedDays={completedDays}
            onSelectDay={handleSelectDay}
          />

          <QuickAccessButtons
            reviewPendingCount={userProgress.reviewPendingCount}
            onReviewClick={handleReviewClick}
            onAuxiliariesClick={handleAuxiliariesClick}
          />

          {/* Acceso directo para revisar imágenes */}
          <section className="grid grid-cols-1">
            <Button
              variant="outline"
              className="py-6 rounded-xl font-medium text-base justify-start"
              onClick={() => navigate('/review-word-images')}
            >
              Revisar Imágenes de Vocabulario
            </Button>
          </section>

          <ProgressChart
            currentDay={userProgress.currentDay}
            totalDays={totalDays}
          />

          <ProgressDetails
            currentDay={userProgress.currentDay}
            totalDays={totalDays}
            phrasesCompleted={userProgress.phrasesCompleted}
            totalPhrases={totalPhrases}
            wordsMastered={userProgress.wordsMastered}
            totalWords={totalWords}
            auxLearned={userProgress.auxLearned}
            totalAux={totalAux}
          />

          <QuickStats
            phrasesToday={userProgress.phrasesToday}
            totalPhrasesToday={totalPhrasesToday}
            newWordsToday={userProgress.newWordsToday}
            streakDays={userProgress.streakDays}
          />
        </main>
      )}

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isPremium={userProgress.isPremium}
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        onClose={() => setAlertModal({ isOpen: false, message: "" })}
      />
    </div>
  );
};

export default Dashboard;
