import { useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, Toast, ToastType } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';

// Toast图标映射
const toastIcons: Record<ToastType, any> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Toast样式映射
const toastStyles: Record<ToastType, string> = {
  success: 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100',
  error: 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
  info: 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100',
};

// Toast图标样式映射
const iconStyles: Record<ToastType, string> = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const Icon = toastIcons[toast.type];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={cn(
        'relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out cursor-pointer group',
        'animate-in slide-in-from-right-full hover:shadow-xl',
        toastStyles[toast.type]
      )}
      onClick={() => onRemove(toast.id)}
      title="点击关闭消息"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[toast.type])} />
      
      <div className="flex-1 space-y-1">
        <div className="font-medium">{toast.title}</div>
        {toast.description && (
          <div className="text-sm opacity-80">{toast.description}</div>
        )}
        {toast.action && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast.action?.onClick();
              }}
              className="h-7 text-xs"
            >
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}
