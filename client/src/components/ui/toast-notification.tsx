interface ToastNotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export default function ToastNotification({ type, message, onClose }: ToastNotificationProps) {
  return (
    <div 
      className={`${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white rounded-lg shadow-lg px-4 py-3 mb-3 flex items-center justify-between max-w-xs`}
    >
      <div className="flex items-center">
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
        <span>{message}</span>
      </div>
      <button 
        className="ml-4 text-white focus:outline-none" 
        onClick={onClose}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}
