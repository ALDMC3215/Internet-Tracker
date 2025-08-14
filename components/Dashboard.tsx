
import React, { useState, useCallback } from 'react';
import { Transaction } from '../types';
import Header from './Header';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Button from './common/Button';
import Toast from './common/Toast';
import ExportIcon from './icons/ExportIcon';
import ImportIcon from './icons/ImportIcon';
import PromptDisplayModal from './PromptDisplayModal';
import { APP_CREATION_PROMPT } from '../constants/prompt';

interface DashboardProps {
  finalBalanceRial: number;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  handleReset: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  finalBalanceRial,
  transactions,
  addTransaction,
  deleteTransaction,
  handleReset,
  theme,
  toggleTheme
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddTransaction = (tx: Omit<Transaction, 'id'>) => {
    addTransaction(tx);
    showToast('تراکنش با موفقیت ثبت شد!');
  };

  const handleExport = () => {
    try {
        const state = JSON.parse(localStorage.getItem('pfm.transactions') || '[]');
        const initialBalance = JSON.parse(localStorage.getItem('pfm.initialRealBalanceRial') || '0');
        const dataStr = JSON.stringify({ initialBalanceRial: initialBalance, transactions: state }, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pfm_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('پشتیبان‌گیری با موفقیت انجام شد.');
    } catch(e) {
        showToast('خطا در ایجاد فایل پشتیبان.');
        console.error(e);
    }
  };

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target?.result as string);
                    if (data.initialBalanceRial !== undefined && Array.isArray(data.transactions)) {
                        if (window.confirm('آیا می‌خواهید داده‌های فعلی را با اطلاعات فایل جایگزین کنید؟ این عمل غیرقابل بازگشت است.')) {
                            localStorage.setItem('pfm.initialRealBalanceRial', JSON.stringify(data.initialBalanceRial));
                            localStorage.setItem('pfm.transactions', JSON.stringify(data.transactions));
                            localStorage.setItem('pfm.setupDone', 'true');
                            window.location.reload();
                        }
                    } else {
                        throw new Error('Invalid file format');
                    }
                } catch (err) {
                    showToast('فایل پشتیبان نامعتبر است.');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen max-h-screen">
        <aside className="w-full md:w-1/3 xl:w-1/4 p-4 md:p-6 bg-white dark:bg-gray-900 shadow-lg md:shadow-none flex flex-col border-b md:border-b-0 md:border-s border-gray-200 dark:border-gray-700">
          <Header balance={finalBalanceRial} theme={theme} toggleTheme={toggleTheme} />
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <footer className="mt-auto pt-4 text-center text-sm text-gray-500 dark:text-gray-400 space-y-3">
              <div className="flex justify-center gap-2">
                 <Button onClick={handleImport} className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center gap-1">
                   <ImportIcon /> درون‌ریزی
                 </Button>
                 <Button onClick={handleExport} className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center gap-1">
                   <ExportIcon /> برون‌بری
                 </Button>
              </div>
              <div className='flex items-center justify-center gap-4'>
                <button onClick={() => setShowPromptModal(true)} className="hover:text-turquoise-500 transition-colors">
                  مشاهده پرامپت ساخت
                </button>
                <button onClick={handleReset} className="hover:text-expense transition-colors">
                  بازنشانی اطلاعات
                </button>
              </div>
            </footer>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} />
        </main>

        {toastMessage && <Toast message={toastMessage} />}
      </div>
      {showPromptModal && <PromptDisplayModal promptText={APP_CREATION_PROMPT} onClose={() => setShowPromptModal(false)} />}
    </>
  );
};

export default Dashboard;