
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold text-white bg-turquoise-500 hover:bg-turquoise-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-turquoise-500 dark:focus:ring-offset-gray-900 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;