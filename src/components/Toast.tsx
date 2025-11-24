import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white flex items-center gap-3 transition-all duration-300 ${bgColor} ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <span>{message}</span>
      <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="hover:bg-white/20 rounded p-1">
        <X size={16} />
      </button>
    </div>
  );
}

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
const toastListeners: ((toast: ToastMessage) => void)[] = [];

export const toast = {
  success: (message: string) => {
    const id = toastId++;
    toastListeners.forEach(listener => listener({ id, message, type: 'success' }));
  },
  error: (message: string) => {
    const id = toastId++;
    toastListeners.forEach(listener => listener({ id, message, type: 'error' }));
  },
  info: (message: string) => {
    const id = toastId++;
    toastListeners.forEach(listener => listener({ id, message, type: 'info' }));
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
    };
    toastListeners.push(listener);
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      {toasts.map((t, index) => (
        <div key={t.id} style={{ top: `${1 + index * 5}rem` }}>
          <Toast message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        </div>
      ))}
    </>
  );
}
