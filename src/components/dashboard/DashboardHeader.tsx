import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  onProfileClick: () => void;
  opacity?: number;
}

export const DashboardHeader = ({ onProfileClick, opacity = 1 }: DashboardHeaderProps) => {
  return (
    <header className="fixed top-0 z-50 w-full flex justify-between items-center px-6 py-4 bg-background/90 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center border border-white/10 shadow-lg overflow-hidden">
          <span className="text-white font-bold text-xl font-headline">A</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-extrabold tracking-tight text-white font-headline leading-none">APACHE</h1>
          <span className="text-[10px] font-bold text-accent tracking-widest uppercase mt-0.5">RANK: INITIATE</span>
        </div>
      </div>
      <button
        onClick={onProfileClick}
        className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/10 hover:scale-105 transition-transform"
      >
        <Bell className="w-5 h-5 text-white" />
      </button>
    </header>
  );
};
