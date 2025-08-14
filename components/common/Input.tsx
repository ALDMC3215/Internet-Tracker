
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  const inputId = id || props.name || `input-${Math.random()}`;
  return (
    <div>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <input
        id={inputId}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise-500 focus:border-turquoise-500 transition-colors ${props.className}`}
        {...props}
      />
    </div>
  );
};

export default Input;