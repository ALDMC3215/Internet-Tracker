
export interface Transaction {
  id: string;
  amount: number; // Stored in Rial
  title: string;
  type: 'expense' | 'income';
  date: string; // Jalali format 'YYYY/MM/DD'
  time: string; // 'HH:mm'
}
