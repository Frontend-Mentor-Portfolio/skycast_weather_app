import React, { useEffect, useState } from 'react';
import type { NotificationItem } from '../hooks/useNotifications';

interface NotificationToastProps {
    notifications: NotificationItem[];
    onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
    // We only show the latest 3 notifications to avoid clutter
    const visibleNotifications = notifications.slice(0, 3);

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm max-[405px]:max-w-[360px] w-full pointer-events-none">
            {visibleNotifications.map((notification) => (
                <ToastItem key={notification.id} notification={notification} onDismiss={onDismiss} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ notification: NotificationItem; onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay to trigger animation
        const timer = setTimeout(() => setIsVisible(true), 10);

        // Auto dismiss after 5 seconds
        const dismissTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(notification.id), 300); // Wait for exit animation
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(dismissTimer);
        };
    }, [notification.id, onDismiss]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => onDismiss(notification.id), 300);
    };

    const getBgColor = () => {
        switch (notification.type) {
            case 'warning': return 'bg-orange-500/90 border-orange-400';
            case 'alert': return 'bg-red-500/90 border-red-400';
            case 'success': return 'bg-green-500/90 border-green-400';
            default: return 'bg-blue-500/90 border-blue-400';
        }
    };

    return (
        <div
            className={`
        pointer-events-auto
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBgColor()}
        text-white p-4 rounded-lg shadow-lg border backdrop-blur-sm
        flex flex-col gap-1
      `}
            role="alert"
        >
            <div className="flex justify-between items-start gap-3">
                <h4 className="font-bold text-sm">{notification.title}</h4>
                <button
                    onClick={handleDismiss}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Dismiss"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p className="text-xs sm:text-sm text-white/95 leading-snug">{notification.message}</p>
        </div>
    );
};

export default NotificationToast;
