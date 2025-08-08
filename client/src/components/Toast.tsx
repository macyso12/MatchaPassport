import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg mb-2 transform transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 mr-3" />
          )}
          <span className="text-gray-900">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-4"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
