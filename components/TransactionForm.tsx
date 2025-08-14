
import React, { useState } from 'react';
import { Transaction } from '../types';
import { getJalaliNow } from '../utils/date';
import { tomanToRial } from '../utils/currency';
import Button from './common/Button';
import Input from './common/Input';
import JalaliDatePicker from './common/JalaliDatePicker';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [title, setTitle] = useState('');
  const [amountToman, setAmountToman] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const { date: defaultDate, time: defaultTime } = getJalaliNow();
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountRial = tomanToRial(parseFloat(amountToman) || 0);

    if (amountRial <= 0) {
      alert('مبلغ باید بزرگتر از صفر باشد.');
      return;
    }
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(date)) {
      alert('فرمت تاریخ صحیح نیست (YYYY/MM/DD)');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      alert('فرمت ساعت صحیح نیست (HH:MM)');
      return;
    }

    onAddTransaction({ title, amount: amountRial, type, date, time });
    
    // Reset form
    setTitle('');
    setAmountToman('');
    setType('expense');
    const { date: newDate, time: newTime } = getJalaliNow();
    setDate(newDate);
    setTime(newTime);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <h2 className="text-lg font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">ثبت تراکنش جدید</h2>
      
      <Input
        label="عنوان تراکنش"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="مثال: خرید از سوپرمارکت"
        required
      />
      
      <Input
        label="مبلغ (تومان)"
        type="number"
        value={amountToman}
        onChange={(e) => setAmountToman(e.target.value)}
        placeholder="مثال: ۷۵,۰۰۰"
        required
      />
      
      <div className="grid grid-cols-2 gap-2">
        <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${type === 'expense' ? 'border-expense bg-expense/10 dark:bg-expense/20' : 'border-gray-300 dark:border-gray-600'}`}>
          <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="sr-only" />
          برداشت
        </label>
        <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${type === 'income' ? 'border-income bg-income/10 dark:bg-income/20' : 'border-gray-300 dark:border-gray-600'}`}>
          <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="sr-only" />
          واریز
        </label>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-3">
            <JalaliDatePicker label="تاریخ" value={date} onChange={setDate} />
        </div>
        <div className="col-span-2">
            <Input label="ساعت" type="text" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <Button type="submit" className="w-full">ثبت تراکنش</Button>
    </form>
  );
};

export default TransactionForm;