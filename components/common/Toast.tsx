
import React from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 bg-turquoise-500 text-white rounded-full shadow-lg animate-bounce">
      {message}
    </div>
  );
};

export default Toast;