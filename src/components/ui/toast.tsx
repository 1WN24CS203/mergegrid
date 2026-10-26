'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  error: <AlertCircle className="w-4 h-4 text-red-600" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  info: <Info className="w-4 h-4 text-brand-600" />,
};

const toastStyles: Record<ToastType, string> = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info: 'border-brand-200 bg-brand-50',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timeout = setTimeout(onDismiss, toast.duration || 4000);
    return () => clearTimeout(timeout);
  }, [toast, onDismiss]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border shadow-md',
        'animate-slide-in-up',
        toastStyles[toast.type]
      )}
    >
      <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-neutral-600 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
