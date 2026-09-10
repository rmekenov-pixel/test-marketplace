import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, type ToastType } from '../../lib/toast/useToastStore';

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  info: <Info className="w-4 h-4 text-zinc-300 shrink-0" />,
};

const BORDERS: Record<ToastType, string> = {
  success: 'border-zinc-700',
  error: 'border-rose-900/60',
  warning: 'border-amber-900/60',
  info: 'border-zinc-700',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-zinc-950 text-zinc-100 rounded border ${BORDERS[toast.type]} shadow-xl transition-all animate-in fade-in duration-200`}
        >
          {ICONS[toast.type]}
          <p className="text-xs leading-relaxed flex-1 text-zinc-200">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-zinc-500 hover:text-zinc-200 transition-colors p-0.5"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </aside>
  );
};
