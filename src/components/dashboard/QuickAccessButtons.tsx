import { motion } from "framer-motion";
import { History, Star, ChevronDown, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface QuickAccessButtonsProps {
  reviewPendingCount?: number;
  onReviewClick: () => void;
  onAuxiliariesClick: () => void;
}

export const QuickAccessButtons = ({
  reviewPendingCount,
  onReviewClick,
  onAuxiliariesClick,
}: QuickAccessButtonsProps) => {
  const navigate = useNavigate();
  const [showAuxiliaries, setShowAuxiliaries] = useState(false);
  const [showReviewDays, setShowReviewDays] = useState(false);
  const [completedReviewDays, setCompletedReviewDays] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("completed_review_days");
    if (saved) {
      setCompletedReviewDays(JSON.parse(saved));
    }
  }, []);

  const availableDays = [1, 2, 3];
  const pendingReviewDays = availableDays.filter(day => !completedReviewDays.includes(day)).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Button
            onClick={() => setShowReviewDays(!showReviewDays)}
            variant="outline"
            className="relative w-full py-6 rounded-xl font-medium text-base border-2 hover:bg-muted justify-start"
          >
            <RotateCcw className="w-5 h-5 mr-3 text-primary" />
            <span>MI REPASO</span>
            <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showReviewDays ? "rotate-180" : ""}`} />
            {pendingReviewDays > 0 && (
              <Badge className="ml-auto bg-red-500 text-white">
                {pendingReviewDays}
              </Badge>
            )}
          </Button>

          {showReviewDays && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableDays.map((day) => {
                    const isCompleted = completedReviewDays.includes(day);
                    return (
                      <Button
                        key={day}
                        onClick={() => navigate(`/review-day?day=${day}`)}
                        className={`py-6 rounded-xl font-medium text-base justify-center border-2 relative ${
                          isCompleted 
                            ? "bg-card border-border hover:bg-muted text-foreground" 
                            : "bg-red-500 border-red-600 hover:bg-red-600 text-white"
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
                        <span>Día {day}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setShowAuxiliaries(!showAuxiliaries)}
            className="gradient-gold text-gray-900 w-full py-6 rounded-xl font-medium text-base hover:opacity-90 justify-start shadow-lg"
          >
            <Star className="w-5 h-5 mr-3" />
            <span>AUXILIARES CLAVE</span>
            <ChevronDown className={`w-5 h-5 ml-auto transition-transform ${showAuxiliaries ? "rotate-180" : ""}`} />
          </Button>

          {showAuxiliaries && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-border rounded-xl p-4">
                <Button
                  onClick={onAuxiliariesClick}
                  variant="outline"
                  className="w-full py-6 rounded-xl font-medium text-base justify-start hover:bg-muted border-2"
                >
                  <Star className="w-5 h-5 mr-3 text-primary" />
                  <span>CONECTORES</span>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
