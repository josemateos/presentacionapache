import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

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
      toast({
        title: "Iniciando Vocabulario",
        description: `Comenzando vocabulario del día ${userProgress.currentDay}`,
      });
      // Aquí navegarías a la pantalla de vocabulario
    }
  };

  const handleSelectDay = (day: number) => {
    if (!completedDays[day] && day <= userProgress.currentDay) {
      setAlertModal({
        isOpen: true,
        message: `Para acceder a tus frases del Día ${day}, primero completa tu vocabulario.`,
      });
    } else if (day > userProgress.currentDay) {
      setAlertModal({
        isOpen: true,
        message: `Aún no has llegado al Día ${day}. ¡Sigue adelante!`,
      });
    } else {
      toast({
        title: `Día ${day}`,
        description: "Accediendo a las frases del día",
      });
      // Aquí navegarías a las frases del día
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
      <DashboardHeader onProfileClick={handleProfileClick} />

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
