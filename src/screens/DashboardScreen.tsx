import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Plus,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, MONTH_NAMES } from '../utils/formatters';
import { CategoryIcon } from '../components/CategoryIcon';
import { ActiveTab, Transaction } from '../types';

interface DashboardScreenProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateTab,
  onOpenAddModal,
  onEditTransaction,
}) => {
  const { accounts, transactions, categories, budgets } = useFinanceStore();

  // Total balance: sum of all account balances
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Current month transactions (Sept 2026 or active month)
  const now = new Date();
  const currentYear = 2026;
  const currentMonth = 9; // September

  const currentMonthTransactions = transactions.filter((t) => {
    if (!t.date) return false;
    const [y, m] = t.date.split('-').map(Number);
    return y === currentYear && m === currentMonth;
  });

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 5 Most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const currentMonthBudgets = budgets.filter((b) => b.month === currentMonth && b.year === currentYear);
  const totalBudgetLimit = currentMonthBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBudgetSpent = currentMonthBudgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div id="dashboard-screen-container" className="space-y-6 pb-8">
      {/* Top Header Card - Total Balance */}
      <div
        id="dashboard-balance-card"
        className="bg-emerald-700 text-white rounded-3xl p-6 shadow-md relative overflow-hidden"
      >
        {/* Background decorative circles */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-600/50 pointer-events-none blur-2xl" />
        <div className="absolute -bottom-16 -left-8 w-40 h-40 rounded-full bg-emerald-800/40 pointer-events-none blur-xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
              Total Net Balance
            </span>
            <span className="text-xs font-medium px-2.5 py-1 bg-emerald-800/80 rounded-full text-emerald-100">
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </span>
          </div>

          <div className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatCurrency(totalBalance)}
          </div>

          {/* Monthly Income vs Expense Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-emerald-600/60">
            {/* Income Card */}
            <div className="flex items-center gap-3 bg-emerald-800/50 backdrop-blur-xs p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-200 shrink-0">
                <ArrowDownLeft className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-emerald-200 font-medium">Income</p>
                <p className="text-base font-bold text-white truncate">
                  {formatCurrency(monthlyIncome)}
                </p>
              </div>
            </div>

            {/* Expense Card */}
            <div className="flex items-center gap-3 bg-emerald-800/50 backdrop-blur-xs p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-rose-500/30 flex items-center justify-center text-rose-200 shrink-0">
                <ArrowUpRight className="w-5 h-5 text-rose-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-emerald-200 font-medium">Expense</p>
                <p className="text-base font-bold text-white truncate">
                  {formatCurrency(monthlyExpense)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Balance Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Accounts Snapshot
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('accounts')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="min-w-[150px] p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs shrink-0 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CategoryIcon name={acc.icon} className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  {acc.type}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-slate-500 font-medium truncate">{acc.name}</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {formatCurrency(acc.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Budget Mini Summary (if any budgets exist) */}
      {totalBudgetLimit > 0 && (
        <div
          onClick={() => onNavigateTab('budgets')}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">Monthly Budget</span>
              <span className="text-xs text-slate-400">
                ({formatCurrency(totalBudgetSpent)} of {formatCurrency(totalBudgetLimit)})
              </span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                totalBudgetSpent > totalBudgetLimit
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {Math.round((totalBudgetSpent / totalBudgetLimit) * 100)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                totalBudgetSpent > totalBudgetLimit ? 'bg-rose-500' : 'bg-emerald-600'
              }`}
              style={{
                width: `${Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Recent Transactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Recent Transactions
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('transactions')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            See All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl">
            <Wallet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">No transactions yet</p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" /> Add your first transaction
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
            {recentTransactions.map((tx) => {
              const category = categories.find((c) => c.id === tx.categoryId);
              const account = accounts.find((a) => a.id === tx.accountId);
              const fromAccount = accounts.find((a) => a.id === tx.fromAccountId);
              const toAccount = accounts.find((a) => a.id === tx.toAccountId);

              const isExpense = tx.type === 'expense';
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';

              return (
                <div
                  key={tx.id}
                  onClick={() => onEditTransaction(tx)}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isTransfer
                          ? '#e0f2fe'
                          : category
                          ? `${category.color}20`
                          : '#f1f5f9',
                        color: isTransfer
                          ? '#0284c7'
                          : category
                          ? category.color
                          : '#64748b',
                      }}
                    >
                      {isTransfer ? (
                        <ArrowRightLeft className="w-5 h-5" />
                      ) : (
                        <CategoryIcon name={category?.icon || 'Tag'} className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {isTransfer
                          ? `Transfer: ${fromAccount?.name || 'Acc'} → ${toAccount?.name || 'Acc'}`
                          : category?.name || 'General'}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {tx.note || (account ? account.name : tx.date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <p
                      className={`text-sm font-bold ${
                        isExpense
                          ? 'text-slate-800'
                          : isIncome
                          ? 'text-emerald-600'
                          : 'text-sky-600'
                      }`}
                    >
                      {isExpense ? '-' : isIncome ? '+' : ''}
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tx.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button (in addition to bottom bar, matching requirement: Quick action floating button (+) to add a transaction) */}
      <button
        id="dashboard-floating-add-btn"
        type="button"
        onClick={onOpenAddModal}
        className="fixed bottom-20 right-4 sm:right-8 z-30 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 hover:bg-emerald-700 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
        aria-label="Add transaction"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
