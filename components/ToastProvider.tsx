
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return {
        success: (message: string) => context.addToast(message, 'success'),
        error: (message: string) => context.addToast(message, 'error'),
        info: (message: string) => context.addToast(message, 'info'),
        warning: (message: string) => context.addToast(message, 'warning'),
    };
};

const ToastContainer: React.FC<{ toasts: Toast[], removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
    const icons: { [key in ToastType]: React.ReactNode } = {
        success: <CheckCircleIcon className="h-6 w-6 text-success" />,
        error: <XCircleIcon className="h-6 w-6 text-error" />,
        info: <InformationCircleIcon className="h-6 w-6 text-primary" />,
        warning: <ExclamationTriangleIcon className="h-6 w-6 text-warning" />,
    };

    const bgColors: { [key in ToastType]: string } = {
        success: 'bg-success/10 border-success/20',
        error: 'bg-error/10 border-error/20',
        info: 'bg-primary/10 border-primary/20',
        warning: 'bg-warning/10 border-warning/20',
    };

    return (
        <div className="fixed top-5 right-5 z-50 space-y-3">
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className={`max-w-sm w-full bg-surface border shadow-lg rounded-xl pointer-events-auto overflow-hidden cursor-pointer ${bgColors[toast.type]}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <div className="p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {icons[toast.type]}
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-text-primary">{toast.message}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};
