
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction } from './types';
import { LOCAL_STORAGE_KEYS } from './constants';
import SetupWizard from './components/SetupWizard';
import Dashboard from './components/Dashboard';
import { computeBalance, loadState, saveState, resetData } from './services/storageService';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSetupDone, setIsSetupDone] = useState<boolean>(false);
  const [initialBalanceRial, setInitialBalanceRial] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    const { setupDone, initialBalanceRial, transactions } = loadState();
    setIsSetupDone(setupDone);
    setInitialBalanceRial(initialBalanceRial);
    setTransactions(transactions);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveState({ setupDone: isSetupDone, initialBalanceRial, transactions });
    }
  }, [isSetupDone, initialBalanceRial, transactions, isLoaded]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, 'light');
    }
  }, [theme]);

  const finalBalanceRial = useMemo(() => {
    return computeBalance(initialBalanceRial, transactions);
  }, [initialBalanceRial, transactions]);

  const handleSetupComplete = useCallback((initialBalance: number, recentTransactions: Transaction[]) => {
    setInitialBalanceRial(initialBalance);
    setTransactions(recentTransactions);
    setIsSetupDone(true);
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    if (window.confirm('آیا از حذف این تراکنش مطمئن هستید؟')) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  }, []);
  
  const handleReset = useCallback(() => {
    if (window.confirm('هشدار! تمام داده‌های شما برای همیشه حذف خواهند شد. آیا مطمئن هستید؟')) {
      resetData();
      setIsSetupDone(false);
      setInitialBalanceRial(0);
      setTransactions([]);
    }
  }, []);
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      {!isSetupDone ? (
        <SetupWizard onSetupComplete={handleSetupComplete} />
      ) : (
        <Dashboard
          finalBalanceRial={finalBalanceRial}
          transactions={transactions}
          addTransaction={addTransaction}
          deleteTransaction={deleteTransaction}
          handleReset={handleReset}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
};

export default App;