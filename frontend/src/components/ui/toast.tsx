"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="h-4 w-4 text-[#2f7d5b] shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-[#ba1a1a] shrink-0" />,
    info: <Info className="h-4 w-4 text-[#1a1a1a] shrink-0" />,
  };

  const bgColors: Record<ToastType, string> = {
    success: "bg-[#eaf5f0] border-[#2f7d5b]/20",
    error: "bg-[#fef2f2] border-[#ba1a1a]/20",
    info: "bg-[#f0eee9] border-[#1a1a1a]/20",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-[10px] border p-4 shadow-card animate-in slide-in-from-right-5 fade-in duration-300 ${bgColors[toast.type]}`}
            role="alert"
          >
            {icons[toast.type]}
            <p className="text-sm text-[#1a1c1b] leading-relaxed flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded-md p-0.5 text-[#6b6b66] hover:text-[#1a1c1b] transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
