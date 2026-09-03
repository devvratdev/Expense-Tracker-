import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Account, Budget, Category, Transaction } from '../types';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Main Checking',
    type: 'bank',
    balance: 4250.00,
    icon: 'Building2',
  },
  {
    id: 'acc-2',
    name: 'Cash Wallet',
    type: 'cash',
    balance: 240.00,
    icon: 'Wallet',
  },
  {
    id: 'acc-3',
    name: 'High-Yield Savings',
    type: 'savings',
    balance: 12850.50,
    icon: 'PiggyBank',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  // Expense categories
  { id: 'cat-food', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#f97316' },
  { id: 'cat-groceries', name: 'Groceries', type: 'expense', icon: 'ShoppingCart', color: '#10b981' },
  { id: 'cat-housing', name: 'Rent & Housing', type: 'expense', icon: 'Home', color: '#6366f1' },
  { id: 'cat-transport', name: 'Transportation', type: 'expense', icon: 'Car', color: '#0ea5e9' },
  { id: 'cat-utilities', name: 'Utilities & Bills', type: 'expense', icon: 'Zap', color: '#eab308' },
  { id: 'cat-entertainment', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#ec4899' },
  { id: 'cat-shopping', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#8b5cf6' },
  { id: 'cat-health', name: 'Health & Medical', type: 'expense', icon: 'HeartPulse', color: '#ef4444' },
  // Income categories
  { id: 'cat-salary', name: 'Salary & Wages', type: 'income', icon: 'Briefcase', color: '#059669' },
  { id: 'cat-freelance', name: 'Freelance & Side Gig', type: 'income', icon: 'Laptop', color: '#14b8a6' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 3800.00,
    categoryId: 'cat-salary',
    accountId: 'acc-1',
    date: '2026-09-01',
    note: 'Monthly tech salary deposit',
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 1200.00,
    categoryId: 'cat-housing',
    accountId: 'acc-1',
    date: '2026-09-02',
    note: 'Apartment rent payment',
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 142.50,
    categoryId: 'cat-groceries',
    accountId: 'acc-1',
    date: '2026-09-02',
    note: 'Whole Foods weekly grocery haul',
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 35.00,
    categoryId: 'cat-food',
    accountId: 'acc-2',
    date: '2026-09-03',
    note: 'Artisan bistro lunch with team',
  },
  {
    id: 'tx-5',
    type: 'transfer',
    amount: 500.00,
    categoryId: '',
    accountId: 'acc-1',
    fromAccountId: 'acc-1',
    toAccountId: 'acc-3',
    date: '2026-09-03',
    note: 'Automated savings transfer',
  },
  // Previous months for cash flow chart
  {
    id: 'tx-hist-1',
    type: 'income',
    amount: 3800,
    categoryId: 'cat-salary',
    accountId: 'acc-1',
    date: '2026-08-01',
    note: 'August Salary',
  },
  {
    id: 'tx-hist-2',
    type: 'expense',
    amount: 2150,
    categoryId: 'cat-housing',
    accountId: 'acc-1',
    date: '2026-08-04',
    note: 'August Rent & Expenses',
  },
  {
    id: 'tx-hist-3',
    type: 'income',
    amount: 4200,
    categoryId: 'cat-salary',
    accountId: 'acc-1',
    date: '2026-07-01',
    note: 'July Salary & Bonus',
  },
  {
    id: 'tx-hist-4',
    type: 'expense',
    amount: 2400,
    categoryId: 'cat-housing',
    accountId: 'acc-1',
    date: '2026-07-05',
    note: 'July Living expenses',
  },
  {
    id: 'tx-hist-5',
    type: 'income',
    amount: 3800,
    categoryId: 'cat-salary',
    accountId: 'acc-1',
    date: '2026-06-01',
    note: 'June Salary',
  },
  {
    id: 'tx-hist-6',
    type: 'expense',
    amount: 1980,
    categoryId: 'cat-housing',
    accountId: 'acc-1',
    date: '2026-06-08',
    note: 'June Expenses',
  },
  {
    id: 'tx-hist-7',
    type: 'income',
    amount: 3800,
    categoryId: 'cat-salary',
    accountId: 'acc-1',
    date: '2026-05-01',
    note: 'May Salary',
  },
  {
    id: 'tx-hist-8',
    type: 'expense',
    amount: 2100,
    categoryId: 'cat-housing',
    accountId: 'acc-1',
    date: '2026-05-06',
    note: 'May Expenses',
  },
  {
    id: 'tx-hist-9',
    type: 'income',
    amount: 3600,
    categoryId: 'cat-salary',
    accountId: 'acc-1',
    date: '2026-04-01',
    note: 'April Salary',
  },
  {
    id: 'tx-hist-10',
    type: 'expense',
    amount: 1850,
    categoryId: 'cat-housing',
    accountId: 'acc-1',
    date: '2026-04-10',
    note: 'April Expenses',
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    categoryId: 'cat-housing',
    limit: 1300,
    spent: 1200,
    month: 9,
    year: 2026,
  },
  {
    id: 'b-2',
    categoryId: 'cat-groceries',
    limit: 450,
    spent: 142.50,
    month: 9,
    year: 2026,
  },
  {
    id: 'b-3',
    categoryId: 'cat-food',
    limit: 250,
    spent: 35.00,
    month: 9,
    year: 2026,
  },
  {
    id: 'b-4',
    categoryId: 'cat-entertainment',
    limit: 150,
    spent: 0,
    month: 9,
    year: 2026,
  },
  {
    id: 'b-5',
    categoryId: 'cat-shopping',
    limit: 100,
    spent: 120, // Sample over-budget to demonstrate red progress bar immediately
    month: 9,
    year: 2026,
  },
];

// Helper to recalculate budget spent amounts given transactions
function recalculateBudgets(budgets: Budget[], transactions: Transaction[]): Budget[] {
  return budgets.map((b) => {
    const totalSpent = transactions
      .filter((t) => {
        if (t.type !== 'expense') return false;
        if (t.categoryId !== b.categoryId) return false;
        if (!t.date) return false;
        const [yearStr, monthStr] = t.date.split('-');
        const txYear = parseInt(yearStr, 10);
        const txMonth = parseInt(monthStr, 10);
        return txYear === b.year && txMonth === b.month;
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return {
      ...b,
      spent: Math.round(totalSpent * 100) / 100,
    };
  });
}

// Helper to apply transaction impact on account balances
function applyTransactionImpact(accounts: Account[], tx: Transaction, multiplier: 1 | -1): Account[] {
  const nextAccounts = [...accounts];
  const amt = Number(tx.amount || 0) * multiplier;

  if (tx.type === 'income') {
    const accIdx = nextAccounts.findIndex((a) => a.id === tx.accountId);
    if (accIdx !== -1) {
      nextAccounts[accIdx] = {
        ...nextAccounts[accIdx],
        balance: Math.round((nextAccounts[accIdx].balance + amt) * 100) / 100,
      };
    }
  } else if (tx.type === 'expense') {
    const accIdx = nextAccounts.findIndex((a) => a.id === tx.accountId);
    if (accIdx !== -1) {
      nextAccounts[accIdx] = {
        ...nextAccounts[accIdx],
        balance: Math.round((nextAccounts[accIdx].balance - amt) * 100) / 100,
      };
    }
  } else if (tx.type === 'transfer') {
    const fromId = tx.fromAccountId || tx.accountId;
    const toId = tx.toAccountId;

    if (fromId) {
      const fromIdx = nextAccounts.findIndex((a) => a.id === fromId);
      if (fromIdx !== -1) {
        nextAccounts[fromIdx] = {
          ...nextAccounts[fromIdx],
          balance: Math.round((nextAccounts[fromIdx].balance - amt) * 100) / 100,
        };
      }
    }

    if (toId) {
      const toIdx = nextAccounts.findIndex((a) => a.id === toId);
      if (toIdx !== -1) {
        nextAccounts[toIdx] = {
          ...nextAccounts[toIdx],
          balance: Math.round((nextAccounts[toIdx].balance + amt) * 100) / 100,
        };
      }
    }
  }

  return nextAccounts;
}

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];

  // Transaction CRUD
  addTransaction: (txData: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updated: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Account CRUD
  addAccount: (accountData: Omit<Account, 'id'>) => void;
  editAccount: (id: string, updated: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Category CRUD
  addCategory: (categoryData: Omit<Category, 'id'>) => void;

  // Budget CRUD
  setBudget: (budgetData: { categoryId: string; limit: number; month: number; year: number }) => void;
  deleteBudget: (id: string) => void;

  // Reset
  resetData: () => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      accounts: INITIAL_ACCOUNTS,
      categories: INITIAL_CATEGORIES,
      transactions: INITIAL_TRANSACTIONS,
      budgets: recalculateBudgets(INITIAL_BUDGETS, INITIAL_TRANSACTIONS),

      addTransaction: (txData) => {
        const id = 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        const newTx: Transaction = {
          ...txData,
          id,
          amount: Number(txData.amount),
        };

        const currentAccounts = get().accounts;
        const currentTransactions = get().transactions;
        const currentBudgets = get().budgets;

        // Apply balance update
        const updatedAccounts = applyTransactionImpact(currentAccounts, newTx, 1);
        const updatedTransactions = [newTx, ...currentTransactions];
        // Recalculate budgets
        const updatedBudgets = recalculateBudgets(currentBudgets, updatedTransactions);

        set({
          accounts: updatedAccounts,
          transactions: updatedTransactions,
          budgets: updatedBudgets,
        });
      },

      editTransaction: (id, updated) => {
        const currentTransactions = get().transactions;
        const existingTx = currentTransactions.find((t) => t.id === id);
        if (!existingTx) return;

        let accounts = get().accounts;

        // 1. Revert effect of the old transaction
        accounts = applyTransactionImpact(accounts, existingTx, -1);

        // 2. Build new transaction
        const modifiedTx: Transaction = {
          ...existingTx,
          ...updated,
          amount: updated.amount !== undefined ? Number(updated.amount) : existingTx.amount,
        };

        // 3. Apply effect of updated transaction
        accounts = applyTransactionImpact(accounts, modifiedTx, 1);

        const nextTransactions = currentTransactions.map((t) => (t.id === id ? modifiedTx : t));
        const updatedBudgets = recalculateBudgets(get().budgets, nextTransactions);

        set({
          accounts,
          transactions: nextTransactions,
          budgets: updatedBudgets,
        });
      },

      deleteTransaction: (id) => {
        const currentTransactions = get().transactions;
        const targetTx = currentTransactions.find((t) => t.id === id);
        if (!targetTx) return;

        // Revert transaction effect from account balances
        const updatedAccounts = applyTransactionImpact(get().accounts, targetTx, -1);
        const nextTransactions = currentTransactions.filter((t) => t.id !== id);
        const updatedBudgets = recalculateBudgets(get().budgets, nextTransactions);

        set({
          accounts: updatedAccounts,
          transactions: nextTransactions,
          budgets: updatedBudgets,
        });
      },

      addAccount: (accountData) => {
        const id = 'acc-' + Date.now();
        const newAccount: Account = {
          ...accountData,
          id,
          balance: Number(accountData.balance || 0),
        };
        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },

      editAccount: (id, updated) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id
              ? {
                  ...a,
                  ...updated,
                  balance: updated.balance !== undefined ? Number(updated.balance) : a.balance,
                }
              : a
          ),
        }));
      },

      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        }));
      },

      addCategory: (categoryData) => {
        const id = 'cat-' + Date.now();
        const newCat: Category = {
          ...categoryData,
          id,
        };
        set((state) => ({
          categories: [...state.categories, newCat],
        }));
      },

      setBudget: ({ categoryId, limit, month, year }) => {
        const currentBudgets = get().budgets;
        const currentTransactions = get().transactions;

        const existingIndex = currentBudgets.findIndex(
          (b) => b.categoryId === categoryId && b.month === month && b.year === year
        );

        let nextBudgets: Budget[];

        if (existingIndex !== -1) {
          nextBudgets = currentBudgets.map((b, idx) =>
            idx === existingIndex ? { ...b, limit: Number(limit) } : b
          );
        } else {
          const newBudget: Budget = {
            id: 'b-' + Date.now(),
            categoryId,
            limit: Number(limit),
            spent: 0,
            month,
            year,
          };
          nextBudgets = [...currentBudgets, newBudget];
        }

        // Recalculate spent values
        const recalculated = recalculateBudgets(nextBudgets, currentTransactions);
        set({ budgets: recalculated });
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      resetData: () => {
        set({
          accounts: INITIAL_ACCOUNTS,
          categories: INITIAL_CATEGORIES,
          transactions: INITIAL_TRANSACTIONS,
          budgets: recalculateBudgets(INITIAL_BUDGETS, INITIAL_TRANSACTIONS),
        });
      },
    }),
    {
      name: 'mymoney_finance_storage_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
