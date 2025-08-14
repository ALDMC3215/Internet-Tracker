
import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 shadow-md rounded-xl ${className || ''}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default Card;