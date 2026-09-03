export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountType = 'cash' | 'bank' | 'savings' | 'credit';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string; // YYYY-MM-DD
  note: string;
  fromAccountId?: string;
  toAccountId?: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  spent: number;
  month: number; // 1-12
  year: number;  // e.g. 2026
}

export type ActiveTab = 'dashboard' | 'transactions' | 'budgets' | 'accounts' | 'analytics';
