
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export function Notification({ 
  type = 'success', // 'success', 'error', 'warning', 'info'
  message = '', 
  onClose,
  duration = 5000, // Duración en ms (0 = no auto-cerrar)
  position = 'top-right' // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Tiempo de animación de salida
  };

  if (!isVisible) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'from-green-900/90 to-green-800/90',
          borderColor: 'border-green-500/50',
          iconColor: 'text-green-400',
          textColor: 'text-green-100'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'from-red-900/90 to-red-800/90',
          borderColor: 'border-red-500/50',
          iconColor: 'text-red-400',
          textColor: 'text-red-100'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'from-yellow-900/90 to-yellow-800/90',
          borderColor: 'border-yellow-500/50',
          iconColor: 'text-yellow-400',
          textColor: 'text-yellow-100'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'from-blue-900/90 to-blue-800/90',
          borderColor: 'border-blue-500/50',
          iconColor: 'text-blue-400',
          textColor: 'text-blue-100'
        };
      default:
        return {
          icon: Info,
          bgColor: 'from-gray-900/90 to-gray-800/90',
          borderColor: 'border-gray-500/50',
          iconColor: 'text-gray-400',
          textColor: 'text-gray-100'
        };
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div 
      className={`fixed ${getPositionClass()} z-50 ${
        isExiting 
          ? 'animate-[slideOut_0.3s_ease-in-out_forwards]' 
          : 'animate-[slideIn_0.3s_ease-in-out]'
      }`}
    >
      <div 
        className={`bg-gradient-to-r ${config.bgColor} border ${config.borderColor} rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden min-w-[320px] max-w-md`}
      >
        <div className="p-4 flex items-start gap-3">
          {/* Icono */}
          <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
            <Icon size={24} />
          </div>

          {/* Mensaje */}
          <div className="flex-1">
            <p className={`${config.textColor} font-medium text-sm leading-relaxed`}>
              {message}
            </p>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className={`${config.iconColor} hover:bg-white/10 rounded-lg p-1 transition-colors flex-shrink-0`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de progreso (si hay duración) */}
        {duration > 0 && (
          <div className="h-1 bg-black/20">
            <div 
              className={`h-full ${
                type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== HOOK PERSONALIZADO PARA MANEJAR NOTIFICACIONES ====================
export function useNotification() {
  const [notifications, setNotifications] = useState([]);

  const showNotification = ({ type, message, duration = 5000, position = 'top-right' }) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, duration, position }]);
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return {
    notifications,
    showNotification,
    removeNotification
  };
}

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);

  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' }); // Feb
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return `${day} ${month} ${hours}:${minutes}:${seconds}`;
};