import { motion } from "framer-motion";
import { History, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Card } from "@/components/ui/card";

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
  const [showAuxiliaries, setShowAuxiliaries] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={onReviewClick}
          variant="outline"
          className="relative py-6 rounded-xl font-medium text-base border-2 hover:bg-muted justify-start"
        >
          <History className="w-5 h-5 mr-3 text-primary" />
          <span>MI REPASO</span>
          {reviewPendingCount && reviewPendingCount > 0 && (
            <Badge className="ml-auto bg-destructive text-destructive-foreground">
              {reviewPendingCount}
            </Badge>
          )}
        </Button>

        <Button
          onClick={() => setShowAuxiliaries(!showAuxiliaries)}
          className="gradient-gold text-gray-900 py-6 rounded-xl font-medium text-base hover:opacity-90 justify-start shadow-lg"
        >
          <Star className="w-5 h-5 mr-3" />
          <span>AUXILIARES CLAVE</span>
          <ChevronDown className={`w-5 h-5 ml-auto transition-transform ${showAuxiliaries ? "rotate-180" : ""}`} />
        </Button>
      </div>

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
    </motion.section>
  );
};
