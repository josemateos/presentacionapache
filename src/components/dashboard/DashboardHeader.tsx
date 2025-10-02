import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onProfileClick: () => void;
  opacity?: number;
}

export const DashboardHeader = ({ onProfileClick, opacity = 1 }: DashboardHeaderProps) => {
  const translateY = (1 - opacity) * -20;
  
  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border shadow-md"
      style={{ 
        opacity, 
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out", 
        willChange: "opacity, transform" 
      }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">APACHE</h1>
        </div>
        <Button
          onClick={onProfileClick}
          size="icon"
          className="w-10 h-10 rounded-full gradient-primary shadow-lg hover:scale-105 transition-transform"
        >
          <User className="w-5 h-5 text-white" />
        </Button>
      </div>
    </header>
  );
};
