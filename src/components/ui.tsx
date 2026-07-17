import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} animate-slide-in-right sm:animate-scale-in`}>
        <div className="card max-h-[90vh] overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-600">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function Toast({
  show,
  message,
  tone = 'success',
}: {
  show: boolean;
  message: string;
  tone?: 'success' | 'error' | 'info';
}) {
  if (!show) return null;
  const toneCls =
    tone === 'success'
      ? 'bg-success-600'
      : tone === 'error'
      ? 'bg-error-600'
      : 'bg-secondary-600';
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-up">
      <div className={`rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-soft ${toneCls}`}>
        {message}
      </div>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer-bg animate-shimmer rounded-xl ${className}`} />;
}
