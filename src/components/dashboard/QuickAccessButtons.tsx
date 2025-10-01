import { motion } from "framer-motion";
import { History, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
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
        onClick={onAuxiliariesClick}
        className="gradient-gold text-gray-900 py-6 rounded-xl font-medium text-base hover:opacity-90 justify-start shadow-lg"
      >
        <Star className="w-5 h-5 mr-3" />
        <span>AUXILIARES CLAVE</span>
      </Button>
    </motion.section>
  );
};
