import React, { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, MONTH_NAMES } from '../utils/formatters';
import { CategoryIcon } from '../components/CategoryIcon';
import { PieChart as PieIcon, BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const FALLBACK_COLORS = [
  '#10b981',
  '#f97316',
  '#6366f1',
  '#0ea5e9',
  '#eab308',
  '#ec4899',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
  '#f43f5e',
];

export const AnalyticsScreen: React.FC = () => {
  const { transactions, categories } = useFinanceStore();

  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // 1. Expenses by Category for the selected month
  const categoryExpenses = useMemo(() => {
    const expenses = transactions.filter((t) => {
      if (t.type !== 'expense' || !t.date) return false;
      const [y, m] = t.date.split('-').map(Number);
      return y === selectedYear && m === selectedMonth;
    });

    const categoryMap: { [catId: string]: number } = {};
    expenses.forEach((tx) => {
      categoryMap[tx.categoryId] = (categoryMap[tx.categoryId] || 0) + tx.amount;
    });

    const data = Object.entries(categoryMap)
      .map(([catId, amount]) => {
        const cat = categories.find((c) => c.id === catId);
        return {
          id: catId,
          name: cat?.name || 'Uncategorized',
          value: Math.round(amount * 100) / 100,
          color: cat?.color || FALLBACK_COLORS[0],
          icon: cat?.icon || 'Tag',
        };
      })
      .sort((a, b) => b.value - a.value);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return { data, total };
  }, [transactions, categories, selectedMonth, selectedYear]);

  // 2. Cash Flow (Income vs Expense over the last 6 months)
  const cashFlowData = useMemo(() => {
    // Generate array of 6 months ending in selectedMonth/selectedYear
    const monthsList: { year: number; month: number; label: string; key: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      let m = selectedMonth - i;
      let y = selectedYear;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      monthsList.push({
        year: y,
        month: m,
        label: MONTH_NAMES[m - 1].substring(0, 3),
        key: `${y}-${String(m).padStart(2, '0')}`,
      });
    }

    return monthsList.map(({ year, month, label, key }) => {
      const monthTx = transactions.filter((t) => {
        if (!t.date) return false;
        const [ty, tm] = t.date.split('-').map(Number);
        return ty === year && tm === month;
      });

      const income = monthTx
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTx
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: label,
        fullName: `${MONTH_NAMES[month - 1]} ${year}`,
        income: Math.round(income * 100) / 100,
        expense: Math.round(expense * 100) / 100,
        net: Math.round((income - expense) * 100) / 100,
      };
    });
  }, [transactions, selectedMonth, selectedYear]);

  const total6MonthIncome = cashFlowData.reduce((sum, d) => sum + d.income, 0);
  const total6MonthExpense = cashFlowData.reduce((sum, d) => sum + d.expense, 0);
  const net6MonthSavings = total6MonthIncome - total6MonthExpense;
  const savingsRate = total6MonthIncome > 0 ? Math.round((net6MonthSavings / total6MonthIncome) * 100) : 0;

  return (
    <div id="analytics-screen-container" className="space-y-6 pb-12">
      {/* Month Filter Selector */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Analysis Period
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            id="analytics-month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="min-h-[40px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            id="analytics-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="min-h-[40px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6-Month Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            6-Mo Total Income
          </span>
          <p className="text-lg font-extrabold text-emerald-600 mt-1">
            {formatCurrency(total6MonthIncome)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            6-Mo Total Expense
          </span>
          <p className="text-lg font-extrabold text-slate-800 mt-1">
            {formatCurrency(total6MonthExpense)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Net Savings Rate
          </span>
          <p
            className={`text-lg font-extrabold mt-1 ${
              savingsRate >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {savingsRate}% ({formatCurrency(net6MonthSavings)})
          </p>
        </div>
      </div>

      {/* 1. Pie Chart: Expenses by Category for Selected Month */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Expenses by Category</h2>
              <p className="text-[11px] text-slate-400">
                {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-slate-900">
            Total: {formatCurrency(categoryExpenses.total)}
          </span>
        </div>

        {categoryExpenses.data.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No expenses recorded for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </div>
        ) : (
          <div>
            {/* Pie chart */}
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryExpenses.data.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatCurrency(Number(val) || 0), 'Spent']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown table / list */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              {categoryExpenses.data.map((cat, idx) => {
                const percentage =
                  categoryExpenses.total > 0
                    ? Math.round((cat.value / categoryExpenses.total) * 100)
                    : 0;

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            cat.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
                        }}
                      />
                      <CategoryIcon name={cat.icon} className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-800">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-800">
                        {formatCurrency(cat.value)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium w-9 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Bar Chart: Cash Flow (Income vs Expense over the last 6 months) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Cash Flow (Last 6 Months)</h2>
              <p className="text-[11px] text-slate-400">Income vs. Expense comparison</p>
            </div>
          </div>
        </div>

        <div className="h-[270px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cashFlowData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip
                formatter={(val, name) => [
                  formatCurrency(Number(val) || 0),
                  name === 'income' ? 'Income' : 'Expense',
                ]}
                labelFormatter={(label) => {
                  const item = cashFlowData.find((d) => d.name === label);
                  return item?.fullName || label;
                }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 500 }}
                formatter={(value) => (value === 'income' ? 'Income' : 'Expense')}
              />
              <Bar dataKey="income" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
