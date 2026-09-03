import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowRightLeft,
  Trash2,
  Edit2,
  Calendar,
  X,
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, formatDateGroup, MONTH_NAMES } from '../utils/formatters';
import { CategoryIcon } from '../components/CategoryIcon';
import { Transaction } from '../types';

interface TransactionsScreenProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  onOpenAddModal,
  onEditTransaction,
}) => {
  const { transactions, accounts, categories, deleteTransaction } = useFinanceStore();

  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or '2026-09'
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all'); // 'all' | 'income' | 'expense' | 'transfer'
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<Transaction | null>(null);

  // Available unique months from all transactions
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((tx) => {
      if (tx.date) {
        const parts = tx.date.split('-');
        if (parts.length >= 2) {
          set.add(`${parts[0]}-${parts[1]}`);
        }
      }
    });
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Month filter
      if (selectedMonth !== 'all' && !tx.date.startsWith(selectedMonth)) {
        return false;
      }

      // Account filter
      if (selectedAccount !== 'all') {
        if (tx.type === 'transfer') {
          if (tx.fromAccountId !== selectedAccount && tx.toAccountId !== selectedAccount) {
            return false;
          }
        } else if (tx.accountId !== selectedAccount) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const cat = categories.find((c) => c.id === tx.categoryId);
        const matchesNote = tx.note?.toLowerCase().includes(query);
        const matchesCat = cat?.name.toLowerCase().includes(query);
        const matchesAmount = tx.amount.toString().includes(query);
        if (!matchesNote && !matchesCat && !matchesAmount) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, selectedMonth, selectedAccount, selectedType, searchQuery, categories]);

  // Group filtered transactions by date
  const groupedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const groups: { [dateStr: string]: Transaction[] } = {};
    sorted.forEach((tx) => {
      if (!groups[tx.date]) {
        groups[tx.date] = [];
      }
      groups[tx.date].push(tx);
    });

    return groups;
  }, [filteredTransactions]);

  // Calculations for filtered period
  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this transaction? Account balance will be restored.')) {
      deleteTransaction(id);
      if (selectedTxForDetail?.id === id) {
        setSelectedTxForDetail(null);
      }
    }
  };

  return (
    <div id="transactions-screen-container" className="space-y-4 pb-12">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="tx-search-input"
            type="text"
            placeholder="Search notes, category, amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {/* Month filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Month
            </label>
            <select
              id="filter-month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full min-h-[44px] px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Months</option>
              {availableMonths.map((ym) => {
                const [year, month] = ym.split('-');
                const monthName = MONTH_NAMES[parseInt(month, 10) - 1];
                return (
                  <option key={ym} value={ym}>
                    {monthName} {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Account filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Account
            </label>
            <select
              id="filter-account-select"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full min-h-[44px] px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Type
            </label>
            <select
              id="filter-type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full min-h-[44px] px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
              <option value="transfer">Transfers Only</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Stats */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            {filteredTransactions.length} transaction{filteredTransactions.length === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold">
              +{formatCurrency(totalFilteredIncome)}
            </span>
            <span className="text-rose-600 font-semibold">
              -{formatCurrency(totalFilteredExpense)}
            </span>
          </div>
        </div>
      </div>

      {/* Grouped Transactions List */}
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No transactions match your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting filters or record a new transaction.</p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-4 min-h-[44px] px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
          >
            Add Transaction
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {(Object.entries(groupedTransactions) as [string, Transaction[]][]).map(([dateStr, txList]) => {
            const dayExpense = txList
              .filter((t) => t.type === 'expense')
              .reduce((s, t) => s + t.amount, 0);
            const dayIncome = txList
              .filter((t) => t.type === 'income')
              .reduce((s, t) => s + t.amount, 0);

            return (
              <div key={dateStr} className="space-y-1.5">
                {/* Date header */}
                <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
                  <span>{formatDateGroup(dateStr)}</span>
                  <div className="flex items-center gap-2 font-medium">
                    {dayIncome > 0 && (
                      <span className="text-emerald-600">+{formatCurrency(dayIncome)}</span>
                    )}
                    {dayExpense > 0 && (
                      <span className="text-slate-600">-{formatCurrency(dayExpense)}</span>
                    )}
                  </div>
                </div>

                {/* Items in this date */}
                <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
                  {txList.map((tx) => {
                    const category = categories.find((c) => c.id === tx.categoryId);
                    const account = accounts.find((a) => a.id === tx.accountId);
                    const fromAcc = accounts.find((a) => a.id === tx.fromAccountId);
                    const toAcc = accounts.find((a) => a.id === tx.toAccountId);

                    const isExpense = tx.type === 'expense';
                    const isIncome = tx.type === 'income';
                    const isTransfer = tx.type === 'transfer';

                    return (
                      <div
                        key={tx.id}
                        onClick={() => onEditTransaction(tx)}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
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
                                ? `Transfer: ${fromAcc?.name || 'Acc'} → ${toAcc?.name || 'Acc'}`
                                : category?.name || 'General'}
                            </p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {tx.note ? tx.note : account ? account.name : 'No note'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right shrink-0">
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
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {isTransfer ? 'Transfer' : account?.name}
                            </p>
                          </div>

                          {/* Quick delete button on hover/touch */}
                          <button
                            type="button"
                            onClick={(e) => handleDelete(tx.id, e)}
                            title="Delete transaction"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
