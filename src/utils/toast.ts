import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export const useToastStore = create<ToastState>((set: any, get: any) => ({
  toasts: [],
  
  addToast: (toast: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };
    
    set((state: any) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    // 自动移除toast
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },
  
  removeToast: (id: any) => {
    set((state: any) => ({
      toasts: state.toasts.filter((toast: any) => toast.id !== id)
    }));
  },
  
  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));

// 便捷方法
export const toast = {
  success: (title: string, description?: string) => {
    useToastStore.getState().addToast({
      type: 'success',
      title,
      description,
    });
  },
  
  error: (title: string, description?: string) => {
    useToastStore.getState().addToast({
      type: 'error',
      title,
      description,
      duration: 7000, // 错误消息显示更长时间
    });
  },
  
  warning: (title: string, description?: string) => {
    useToastStore.getState().addToast({
      type: 'warning',
      title,
      description,
    });
  },
  
  info: (title: string, description?: string) => {
    useToastStore.getState().addToast({
      type: 'info',
      title,
      description,
    });
  },
  
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> => {
    const loadingToast = {
      type: 'info' as const,
      title: messages.loading,
      duration: 0, // 不自动消失
    };
    
    useToastStore.getState().addToast(loadingToast);
    
    return promise
      .then((result) => {
        useToastStore.getState().addToast({
          type: 'success',
          title: messages.success,
        });
        return result;
      })
      .catch((error) => {
        useToastStore.getState().addToast({
          type: 'error',
          title: messages.error,
          description: error.message,
        });
        throw error;
      });
  },
};
