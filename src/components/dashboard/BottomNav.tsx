import { Compass, BookText, Target, ChefHat } from "lucide-react";
import TeepeeIcon from "@/components/icons/TeepeeIcon";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPremium: boolean;
}

export const BottomNav = ({ activeTab, onTabChange, isPremium }: BottomNavProps) => {
  const tabs = [
    { id: "today", icon: TeepeeIcon, locked: false },
    { id: "plan", icon: Compass, locked: false },
    { id: "vocabulary", icon: BookText, locked: false },
    { id: "ai", icon: Target, locked: false },
    { id: "practice", icon: ChefHat, locked: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-background/95 backdrop-blur-2xl border-t border-white/5 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isLocked = tab.locked;

        return (
          <button
            key={tab.id}
            onClick={() => !isLocked && onTabChange(tab.id)}
            disabled={isLocked}
            className={cn(
              "flex flex-col items-center justify-center transition-all cursor-pointer",
              isActive && tab.id === "today" && "text-accent",
              isActive && tab.id === "vocabulary" && "text-secondary",
              isActive && tab.id !== "today" && tab.id !== "vocabulary" && "text-primary",
              !isActive && !isLocked && "text-on-surface/40 hover:text-primary",
              isLocked && "opacity-30 cursor-not-allowed text-on-surface/40"
            )}
          >
            <Icon className={cn("w-7 h-7", isActive && tab.id === "today" && "w-8 h-8")} />
          </button>
        );
      })}
    </nav>
  );
};
