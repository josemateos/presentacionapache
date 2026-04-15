import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { AlertModal } from "@/components/dashboard/AlertModal";
import { AIChat } from "@/components/ai/AIChat";
import { useToast } from "@/hooks/use-toast";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

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

  useEffect(() => {
    localStorage.removeItem("vocabulary_day1_progress");
  }, []);

  const [userProgress] = useState<UserProgress>({
    currentDay: 1,
    phrasesCompleted: 0,
    wordsMastered: 0,
    auxLearned: 0,
    streakDays: 0,
    phrasesToday: 0,
    newWordsToday: 0,
    isPremium: false,
    reviewPendingCount: 5,
  });

  const registrationDate = new Date();
  registrationDate.setDate(registrationDate.getDate() - 8);

  const [completedDays] = useState<Record<number, boolean>>({});

  const handleProfileClick = () => {
    toast({ title: "Notificaciones", description: "Función próximamente disponible" });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "ai" || tab === "today") return;
    const tabNames: Record<string, string> = {
      plan: "Plan de 90 Días",
      vocabulary: "Vocabulario",
      practice: "Práctica",
    };
    toast({ title: tabNames[tab], description: "Función próximamente disponible" });
  };

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      <DashboardHeader onProfileClick={handleProfileClick} />

      {activeTab === "ai" ? (
        <div className="flex-grow pb-24 mt-24">
          <AIChat />
        </div>
      ) : (
        <DashboardContent
          userProgress={userProgress}
          completedDays={completedDays}
          registrationDate={registrationDate}
          onAlertOpen={(msg) => setAlertModal({ isOpen: true, message: msg })}
        />
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
