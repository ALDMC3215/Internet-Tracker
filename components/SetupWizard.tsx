
import React, { useState, useCallback } from 'react';
import { Transaction } from '../types';
import { tomanToRial, formatToman } from '../utils/currency';
import { getJalaliNow } from '../utils/date';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import JalaliDatePicker from './common/JalaliDatePicker';

interface SetupWizardProps {
  onSetupComplete: (initialBalance: number, recentTransactions: Transaction[]) => void;
}

const RecentTransactionForm: React.FC<{onAdd: (tx: Omit<Transaction, 'id'>) => void, onDone: () => void}> = ({onAdd, onDone}) => {
    const [title, setTitle] = useState('');
    const [amountToman, setAmountToman] = useState('');
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const { date: defaultDate, time: defaultTime } = getJalaliNow();
    const [date, setDate] = useState(defaultDate);
    const [time, setTime] = useState(defaultTime);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountRial = tomanToRial(parseFloat(amountToman.replace(/,/g, '')) || 0);
        if (!title || amountRial <= 0) {
            alert('لطفا عنوان و مبلغ معتبر وارد کنید.');
            return;
        }
        if (!/^\d{2}:\d{2}$/.test(time)) {
          alert('فرمت ساعت صحیح نیست (HH:MM)');
          return;
        }
        onAdd({ title, amount: amountRial, type, date, time });
        onDone();
    };

    return (
        <Card className="mt-4 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-center">افزودن تراکنش اخیر</h3>
            <Input label="عنوان" value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: خرید از سوپرمارکت" required />
            <Input label="مبلغ (تومان)" value={amountToman} onChange={e => setAmountToman(e.target.value.replace(/,/g, ''))} type="number" required />
            <div className="flex justify-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="form-radio text-expense" />
                برداشت
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="form-radio text-income" />
                واریز
              </label>
            </div>
            <JalaliDatePicker label="تاریخ" value={date} onChange={setDate} />
            <Input label="ساعت (HH:MM)" value={time} onChange={e => setTime(e.target.value)} placeholder="مثال: 14:30" required />

            <div className="flex gap-2">
              <Button type="button" onClick={onDone} className="w-full bg-gray-500 hover:bg-gray-600">لغو</Button>
              <Button type="submit" className="w-full">افزودن</Button>
            </div>
          </form>
        </Card>
    );
};

const SetupWizard: React.FC<SetupWizardProps> = ({ onSetupComplete }) => {
  const [currentBankBalanceToman, setCurrentBankBalanceToman] = useState<string>('');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const handleAddRecentTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `setup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
    setRecentTransactions(prev => [newTx, ...prev]);
  };

  const handleDeleteRecentTransaction = (id: string) => {
    setRecentTransactions(prev => prev.filter(tx => tx.id !== id));
  };
  
  const handleFinishSetup = () => {
    const currentBankBalanceRial = tomanToRial(parseFloat(currentBankBalanceToman.replace(/,/g, '')) || 0);

    const recentTxAdjustment = recentTransactions.reduce((acc, tx) => {
        return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
    }, 0);

    // Correct logic: Initial Balance = Current Balance - (Recent Incomes - Recent Expenses)
    // This establishes the balance *before* the recent transactions occurred.
    const initialRealBalanceRial = currentBankBalanceRial - recentTxAdjustment;

    onSetupComplete(initialRealBalanceRial, recentTransactions);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
      <div className="max-w-lg w-full mx-auto">
        <Card className="p-6 md:p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">راه‌اندازی اولیه</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">برای شروع، لطفا اطلاعات زیر را وارد کنید.</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="initialBalance" className="font-semibold">موجودی فعلی حساب بانکی (تومان)</label>
            <p className="text-sm text-gray-500 dark:text-gray-400">موجودی دقیق حساب خود را که هم‌اکنون در بانک دارید وارد کنید.</p>
            <Input
              id="initialBalance"
              type="text"
              inputMode="numeric"
              placeholder="مثلا: ۱,۵۰۰,۰۰۰"
              value={currentBankBalanceToman}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (!isNaN(Number(value))) {
                  setCurrentBankBalanceToman(new Intl.NumberFormat('en-US').format(Number(value)));
                }
              }}
              className="text-center text-xl"
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">تراکنش‌های اخیر (اختیاری)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">اگر تراکنشی داشته‌اید که اثر آن در موجودی بالا لحاظ شده، آن را اینجا اضافه کنید تا از شمارش دوباره جلوگیری شود.</p>
            
            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                {recentTransactions.map(tx => (
                   <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <div className='flex flex-col text-sm'>
                        <span>{tx.title}</span>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>{tx.date}</span>
                    </div>
                     <div className="flex items-center gap-3">
                       <span className={`font-semibold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>{formatToman(tx.amount)} تومان</span>
                       <button onClick={() => handleDeleteRecentTransaction(tx.id)} className="text-gray-500 hover:text-expense transition-colors">
                         <TrashIcon />
                       </button>
                     </div>
                   </div>
                ))}
            </div>
            
            {showForm ? (
                <RecentTransactionForm onAdd={handleAddRecentTransaction} onDone={() => setShowForm(false)} />
            ) : (
                <Button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 border-dashed border-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <PlusIcon />
                  افزودن تراکنش اخیر
                </Button>
            )}
          </div>

          <Button onClick={handleFinishSetup} disabled={!currentBankBalanceToman} className="w-full text-lg py-3">
            شروع و ذخیره
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SetupWizard;