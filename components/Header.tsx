
import React from 'react';
import { formatToman } from '../utils/currency';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface HeaderProps {
  balance: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ balance, theme, toggleTheme }) => {
  return (
    <header className="text-center mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">حسابدار شخصی</h1>
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">موجودی باقی‌مانده</p>
      <div className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-1">
        <span className="tabular-nums tracking-tight">{formatToman(balance)}</span>
        <span className="text-2xl ms-2 text-gray-500 dark:text-gray-400">تومان</span>
      </div>
    </header>
  );
};

export default Header;
