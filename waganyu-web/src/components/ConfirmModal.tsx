import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}: ConfirmModalProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-500",
          confirmBtn: "bg-red-500 hover:bg-red-600",
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          confirmBtn: "bg-yellow-500 hover:bg-yellow-600 text-black",
        };
      case "info":
      default:
        return {
          icon: "text-blue-500",
          confirmBtn: "bg-blue-500 hover:bg-blue-600",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#282828] border border-[#404040] rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-[#B3B3B3] hover:text-white transition-colors rounded-xl hover:bg-[#404040]"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#191414] border border-[#404040] mx-auto mb-4">
                <AlertTriangle size={32} className={styles.icon} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {title}
              </h3>
              <p className="text-[#B3B3B3] text-center mb-6">
                {message}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#404040] text-white py-3 rounded-xl font-semibold hover:bg-[#555555] transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 ${styles.confirmBtn} text-white py-3 rounded-xl font-semibold transition-colors`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
