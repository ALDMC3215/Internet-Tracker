
import React from 'react';
import { Transaction } from '../types';
import { formatToman } from '../utils/currency';
import Card from './common/Card';
import TrashIcon from './icons/TrashIcon';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-income' : 'text-expense';
  
  return (
    <Card className="p-3 flex items-center gap-4 transition-transform transform hover:scale-[1.02]">
       <div className={`w-2 self-stretch rounded-full ${isIncome ? 'bg-income' : 'bg-expense'}`}></div>
       <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-gray-800 dark:text-gray-100">{transaction.title}</p>
          <p className={`font-bold text-lg ${amountColor} tabular-nums`}>
            {formatToman(transaction.amount)}
          </p>
        </div>
        <div className="flex justify-between items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>{transaction.time}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${isIncome ? 'bg-income/20 text-income' : 'bg-expense/20 text-expense'}`}
            >
              {isIncome ? 'واریز' : 'برداشت'}
            </span>
          </div>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1 rounded-full text-gray-400 hover:text-expense hover:bg-expense/10 transition-colors"
            aria-label={`حذف تراکنش ${transaction.title}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default TransactionItem;