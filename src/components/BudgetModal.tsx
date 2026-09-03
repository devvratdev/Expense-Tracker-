import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Budget } from '../types';
import { MONTH_NAMES } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBudget?: Budget | null;
  initialMonth?: number;
  initialYear?: number;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  editingBudget,
  initialMonth = 9,
  initialYear = 2026,
}) => {
  const { categories, setBudget } = useFinanceStore();

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (editingBudget) {
        setCategoryId(editingBudget.categoryId);
        setLimit(editingBudget.limit.toString());
        setMonth(editingBudget.month);
        setYear(editingBudget.year);
      } else {
        setCategoryId(expenseCategories[0]?.id || '');
        setLimit('');
        setMonth(initialMonth);
        setYear(initialYear);
      }
      setError('');
    }
  }, [isOpen, editingBudget, initialMonth, initialYear]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Please choose a category to budget for.');
      return;
    }
    const numLimit = parseFloat(limit);
    if (isNaN(numLimit) || numLimit <= 0) {
      setError('Please enter a valid budget limit greater than $0.');
      return;
    }

    setBudget({
      categoryId,
      limit: numLimit,
      month: Number(month),
      year: Number(year),
    });

    onClose();
  };

  return (
    <div
      id="budget-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div
        id="budget-modal-card"
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingBudget ? 'Edit Budget' : 'Set Category Budget'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set monthly spending target for a category
            </p>
          </div>
          <button
            id="close-budget-modal-btn"
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="budget-category" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Category
            </label>
            <select
              id="budget-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={!!editingBudget}
              className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-75"
            >
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="budget-limit" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Limit ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">
                $
              </span>
              <input
                id="budget-limit"
                type="number"
                step="1"
                min="1"
                placeholder="500"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full pl-8 pr-4 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="budget-month" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Month
              </label>
              <select
                id="budget-month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {MONTH_NAMES.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="budget-year" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Year
              </label>
              <select
                id="budget-year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {[2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              id="cancel-budget-btn"
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-budget-btn"
              type="submit"
              className="flex-1 min-h-[44px] px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              {editingBudget ? 'Update Budget' : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
