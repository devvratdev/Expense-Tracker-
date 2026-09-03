import React, { useState } from 'react';
import { Plus, Target, AlertTriangle, CheckCircle, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, MONTH_NAMES } from '../utils/formatters';
import { CategoryIcon } from '../components/CategoryIcon';
import { Budget } from '../types';
import { BudgetModal } from '../components/BudgetModal';

export const BudgetsScreen: React.FC = () => {
  const { budgets, categories, deleteBudget } = useFinanceStore();

  const [selectedMonth, setSelectedMonth] = useState<number>(9); // Sept 2026 default
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Active budgets for the selected month/year
  const activeBudgets = budgets.filter(
    (b) => b.month === selectedMonth && b.year === selectedYear
  );

  const totalLimit = activeBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = activeBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
  const isOverallExceeded = totalSpent > totalLimit;

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleOpenSetBudget = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (b: Budget) => {
    setEditingBudget(b);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = (id: string, name: string) => {
    if (window.confirm(`Delete budget for "${name}"?`)) {
      deleteBudget(id);
    }
  };

  return (
    <div id="budgets-screen-container" className="space-y-6 pb-12">
      {/* Month Switcher Navigation */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-xs flex items-center justify-between">
        <button
          id="budget-prev-month-btn"
          type="button"
          onClick={handlePrevMonth}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-sm font-extrabold text-slate-800">
            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Monthly Budget Plan</p>
        </div>

        <button
          id="budget-next-month-btn"
          type="button"
          onClick={handleNextMonth}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Total Budgeted
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {formatCurrency(totalLimit)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Total Spent
            </span>
            <div
              className={`text-2xl sm:text-3xl font-extrabold mt-1 ${
                isOverallExceeded ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {formatCurrency(totalSpent)}
            </div>
          </div>
        </div>

        {/* Big Overall Progress bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className={isOverallExceeded ? 'text-rose-600' : 'text-slate-600'}>
              {overallPercentage}% spent
            </span>
            <span className="text-slate-500">
              {isOverallExceeded
                ? `Over by ${formatCurrency(totalSpent - totalLimit)}`
                : `${formatCurrency(totalRemaining)} remaining`}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverallExceeded ? 'bg-rose-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Budgets List Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Category Budgets ({activeBudgets.length})
          </h2>
          <button
            id="open-budget-modal-btn"
            type="button"
            onClick={handleOpenSetBudget}
            className="min-h-[44px] px-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Set Budget
          </button>
        </div>

        {activeBudgets.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl">
            <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              No budgets set for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Set category limits to track and curb your expenses.
            </p>
            <button
              onClick={handleOpenSetBudget}
              className="mt-4 min-h-[44px] px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Set Category Budget
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBudgets.map((budget) => {
              const category = categories.find((c) => c.id === budget.categoryId);
              const percentage = Math.round((budget.spent / budget.limit) * 100);
              const isExceeded = budget.spent > budget.limit;
              const remaining = budget.limit - budget.spent;

              return (
                <div
                  key={budget.id}
                  className={`bg-white border rounded-2xl p-4 shadow-xs transition-all space-y-3 ${
                    isExceeded ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: category ? `${category.color}20` : '#f1f5f9',
                          color: category ? category.color : '#64748b',
                        }}
                      >
                        <CategoryIcon name={category?.icon || 'Tag'} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {category?.name || 'Category'}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Limit: {formatCurrency(budget.limit)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span
                          className={`text-sm font-bold ${
                            isExceeded ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {formatCurrency(budget.spent)}
                        </span>
                        <p
                          className={`text-[11px] font-semibold ${
                            isExceeded ? 'text-rose-600' : 'text-slate-400'
                          }`}
                        >
                          {isExceeded
                            ? `Over by ${formatCurrency(Math.abs(remaining))}`
                            : `${formatCurrency(remaining)} left`}
                        </p>
                      </div>

                      {/* Edit / Delete action icons */}
                      <button
                        type="button"
                        onClick={() => handleEditBudget(budget)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit budget"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBudget(budget.id, category?.name || 'Budget')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete budget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Crucial requirement: Progress bar turning RED if spent exceeds limit */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-400">
                      <span className={isExceeded ? 'text-rose-600 font-bold' : ''}>
                        {percentage}%
                      </span>
                      {isExceeded && (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Budget Exceeded!
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isExceeded ? 'bg-rose-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBudget={editingBudget}
        initialMonth={selectedMonth}
        initialYear={selectedYear}
      />
    </div>
  );
};
