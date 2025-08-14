
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import TransactionItem from './TransactionItem';
import { getJalaliWeekday } from '../utils/date';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  const groupedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      const dateComparison = b.date.localeCompare(a.date);
      if (dateComparison !== 0) return dateComparison;
      return b.time.localeCompare(a.time);
    });

    return sorted.reduce((acc, tx) => {
      const date = tx.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [transactions]);

  const sortedGroupKeys = Object.keys(groupedTransactions).sort().reverse();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold">هنوز تراکنشی ثبت نشده</h3>
        <p className="mt-1">اولین تراکنش خود را از پنل کناری اضافه کنید.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedGroupKeys.map(date => (
        <div key={date}>
          <div className="sticky top-0 bg-gray-100 dark:bg-gray-800 py-2 z-10">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {getJalaliWeekday(date)} - {date}
              </h2>
              <hr className="mt-2 border-gray-200 dark:border-gray-700"/>
          </div>
          <div className="space-y-3 mt-3">
            {groupedTransactions[date].map(tx => (
              <TransactionItem key={tx.id} transaction={tx} onDelete={onDeleteTransaction} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;