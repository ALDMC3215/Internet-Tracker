
import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  const selectId = id || props.name || `select-${Math.random()}`;
  return (
    <div>
      {label && <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <select
        id={selectId}
        className={`w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise-500 focus:border-turquoise-500 transition-colors`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;