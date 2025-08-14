
import { Transaction } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

interface AppState {
  setupDone: boolean;
  initialBalanceRial: number;
  transactions: Transaction[];
}

export const loadState = (): AppState => {
  try {
    const setupDone = localStorage.getItem(LOCAL_STORAGE_KEYS.SETUP_DONE) === 'true';
    const initialBalanceRial = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.INITIAL_BALANCE) || '0');
    const transactions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS) || '[]');
    return { setupDone, initialBalanceRial, transactions };
  } catch (error) {
    console.error("Failed to load state from localStorage", error);
    return { setupDone: false, initialBalanceRial: 0, transactions: [] };
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETUP_DONE, String(state.setupDone));
    localStorage.setItem(LOCAL_STORAGE_KEYS.INITIAL_BALANCE, JSON.stringify(state.initialBalanceRial));
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  } catch (error) {
    console.error("Failed to save state to localStorage", error);
    alert('خطا در ذخیره‌سازی اطلاعات. ممکن است حافظه مرورگر پر باشد.');
  }
};

export const resetData = (): void => {
  try {
    Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
      if(key !== LOCAL_STORAGE_KEYS.THEME) {
         localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Failed to reset data in localStorage", error);
  }
};

export const computeBalance = (initialBalanceRial: number, transactions: Transaction[]): number => {
  const totalAdjustments = transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
  }, 0);
  return initialBalanceRial + totalAdjustments;
};
