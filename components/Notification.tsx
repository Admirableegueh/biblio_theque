// components/Notification.tsx
interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Notification({ message, type = 'info', onClose }: NotificationProps) {
  const bgColor = {
    success: 'bg-green-200 text-green-800',
    error: 'bg-red-200 text-red-800',
    info: 'bg-blue-200 text-blue-800',
  }[type];

  return (
    <div className={`fixed top-4 right-4 p-4 rounded shadow ${bgColor} cursor-pointer`} onClick={onClose}>
      {message}
    </div>
  );
}
