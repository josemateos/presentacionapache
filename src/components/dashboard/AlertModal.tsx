import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const AlertModal = ({ isOpen, message, onClose }: AlertModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-card border-2 border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary">¡Atención!</h3>
            </div>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button
              onClick={onClose}
              className="w-full gradient-primary py-6 text-base font-semibold"
            >
              Entendido
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
