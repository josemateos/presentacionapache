import { Calendar, BookOpen, Book, Mic, LayoutList, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPremium: boolean;
}

export const BottomNav = ({ activeTab, onTabChange, isPremium }: BottomNavProps) => {
  const tabs = [
    { id: "today", label: "Hoy", icon: Calendar, locked: false },
    { id: "plan", label: "Plan", icon: LayoutList, locked: false },
    { id: "vocabulary", label: "Vocabulario", icon: Book, locked: false },
    { id: "ai", label: "IA", icon: Bot, locked: false },
    { id: "auxiliaries", label: "Auxiliares", icon: BookOpen, locked: !isPremium },
    { id: "practice", label: "Práctica", icon: Mic, locked: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-50">
      <div className="flex justify-around max-w-xl mx-auto">
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
                "flex-1 py-3 px-2 text-center transition-all duration-200",
                isActive && "text-primary",
                !isActive && !isLocked && "text-muted-foreground hover:text-foreground",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon className={cn("w-5 h-5 mx-auto mb-1", isActive && "animate-pulse-subtle")} />
              <span className="text-xs font-medium block">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
