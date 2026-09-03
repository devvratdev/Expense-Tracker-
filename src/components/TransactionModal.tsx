import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction, TransactionType } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editingTransaction,
}) => {
  const { accounts, categories, addTransaction, editTransaction } = useFinanceStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [fromAccountId, setFromAccountId] = useState<string>('');
  const [toAccountId, setToAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setType(editingTransaction.type);
        setAmount(editingTransaction.amount.toString());
        setAccountId(editingTransaction.accountId || accounts[0]?.id || '');
        setFromAccountId(editingTransaction.fromAccountId || editingTransaction.accountId || accounts[0]?.id || '');
        setToAccountId(editingTransaction.toAccountId || accounts[1]?.id || '');
        setCategoryId(editingTransaction.categoryId || '');
        setDate(editingTransaction.date);
        setNote(editingTransaction.note || '');
      } else {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);

        setType('expense');
        setAmount('');
        const defaultAcc = accounts[0]?.id || '';
        setAccountId(defaultAcc);
        setFromAccountId(defaultAcc);
        setToAccountId(accounts[1]?.id || defaultAcc);

        const defaultExpenseCat = categories.find((c) => c.type === 'expense')?.id || '';
        setCategoryId(defaultExpenseCat);
        setNote('');
      }
      setError('');
    }
  }, [isOpen, editingTransaction, accounts, categories]);

  // When type changes to income or expense, adjust default category if mismatched
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType !== 'transfer') {
      const matchCat = categories.find((c) => c.type === newType);
      if (matchCat) {
        setCategoryId(matchCat.id);
      }
    }
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (type === 'transfer') {
      if (!fromAccountId || !toAccountId) {
        setError('Please select both source and destination accounts.');
        return;
      }
      if (fromAccountId === toAccountId) {
        setError('Source and destination accounts must be different.');
        return;
      }
    } else {
      if (!accountId) {
        setError('Please select an account.');
        return;
      }
      if (!categoryId) {
        setError('Please select a category.');
        return;
      }
    }

    if (!date) {
      setError('Please choose a transaction date.');
      return;
    }

    if (editingTransaction) {
      editTransaction(editingTransaction.id, {
        type,
        amount: numAmount,
        accountId: type === 'transfer' ? fromAccountId : accountId,
        fromAccountId: type === 'transfer' ? fromAccountId : undefined,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        categoryId: type === 'transfer' ? '' : categoryId,
        date,
        note: note.trim(),
      });
    } else {
      addTransaction({
        type,
        amount: numAmount,
        accountId: type === 'transfer' ? fromAccountId : accountId,
        fromAccountId: type === 'transfer' ? fromAccountId : undefined,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        categoryId: type === 'transfer' ? '' : categoryId,
        date,
        note: note.trim(),
      });
    }

    onClose();
  };

  return (
    <div
      id="transaction-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div
        id="transaction-modal-card"
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {editingTransaction ? 'Modify details and update balances' : 'Record income, expense or transfer'}
            </p>
          </div>
          <button
            id="close-transaction-modal-btn"
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Segmented Control */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl gap-1">
              <button
                id="type-expense-btn"
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`min-h-[44px] rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
                  type === 'expense'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expense
              </button>
              <button
                id="type-income-btn"
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`min-h-[44px] rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Income
              </button>
              <button
                id="type-transfer-btn"
                type="button"
                onClick={() => handleTypeChange('transfer')}
                className={`min-h-[44px] rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
                  type === 'transfer'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Transfer
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label htmlFor="tx-amount" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Amount ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-xl">
                $
              </div>
              <input
                id="tx-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 min-h-[48px] bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold text-slate-800 placeholder-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
                autoFocus={!editingTransaction}
              />
            </div>
          </div>

          {/* Account Selection */}
          {type === 'transfer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="tx-from-acc" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  From Account
                </label>
                <select
                  id="tx-from-acc"
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${acc.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="tx-to-acc" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  To Account
                </label>
                <select
                  id="tx-to-acc"
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${acc.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label htmlFor="tx-account" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Account
              </label>
              <select
                id="tx-account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.type}) — ${acc.balance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Selection (Only for Income & Expense) */}
          {type !== 'transfer' && (
            <div className="space-y-1.5">
              <label htmlFor="tx-category" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </label>
              <select
                id="tx-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {filteredCategories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label htmlFor="tx-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Note / Description */}
          <div className="space-y-1.5">
            <label htmlFor="tx-note" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Notes (Optional)
            </label>
            <input
              id="tx-note"
              type="text"
              placeholder="e.g. Dinner with friends, Grocery restock"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              id="cancel-transaction-btn"
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-transaction-btn"
              type="submit"
              className="flex-1 min-h-[44px] px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              {editingTransaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
