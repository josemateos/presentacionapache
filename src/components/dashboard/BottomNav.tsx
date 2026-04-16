import { useState, useEffect, useRef } from "react";
import { Compass, BookText } from "lucide-react";
import TeepeeIcon from "@/components/icons/TeepeeIcon";
import RepasoIcon from "@/components/icons/RepasoIcon";
import HeaddressIcon from "@/components/icons/HeaddressIcon";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPremium: boolean;
}

export const BottomNav = ({ activeTab, onTabChange, isPremium }: BottomNavProps) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY <= 10 || currentY < lastScrollY.current);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { id: "today", icon: TeepeeIcon, label: "INICIO", locked: false },
    { id: "plan", icon: Compass, label: "PLAN", locked: false },
    { id: "vocabulary", icon: BookText, label: "VOCAB", locked: false },
    { id: "ai", icon: HeaddressIcon, label: "IA", locked: false },
    { id: "practice", icon: RepasoIcon, label: "REPASO", locked: true },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface/95 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] transition-transform duration-300",
        !visible && "translate-y-full"
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isLocked = tab.locked;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (isLocked) return;
              if (tab.id === "today") {
                navigate("/bienvenida");
                return;
              }
              onTabChange(tab.id);
            }}
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
            <Icon className={cn("w-5 h-5", isActive && tab.id === "today" && "w-6 h-6")} />
            <span className="text-[9px] font-bold tracking-widest uppercase mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
