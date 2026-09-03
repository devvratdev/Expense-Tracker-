import React from 'react';
import { LayoutDashboard, Receipt, Target, Landmark, BarChart3, Plus } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-area-pb shadow-lg"
    >
      <div className="max-w-xl mx-auto px-2 flex items-center justify-around h-16">
        {/* Dashboard */}
        <button
          id="nav-tab-dashboard"
          type="button"
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'dashboard'
              ? 'text-emerald-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[11px] leading-none">Dashboard</span>
        </button>

        {/* Transactions */}
        <button
          id="nav-tab-transactions"
          type="button"
          onClick={() => onTabChange('transactions')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'transactions'
              ? 'text-emerald-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[11px] leading-none">Activity</span>
        </button>

        {/* Quick Add Button Center */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            id="nav-quick-add-btn"
            type="button"
            onClick={onOpenAddModal}
            className="w-13 h-13 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
            aria-label="Add transaction"
            title="Add Transaction"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Budgets */}
        <button
          id="nav-tab-budgets"
          type="button"
          onClick={() => onTabChange('budgets')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'budgets'
              ? 'text-emerald-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[11px] leading-none">Budgets</span>
        </button>

        {/* Accounts */}
        <button
          id="nav-tab-accounts"
          type="button"
          onClick={() => onTabChange('accounts')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'accounts'
              ? 'text-emerald-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Landmark className="w-5 h-5" />
          <span className="text-[11px] leading-none">Accounts</span>
        </button>

        {/* Analytics */}
        <button
          id="nav-tab-analytics"
          type="button"
          onClick={() => onTabChange('analytics')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'analytics'
              ? 'text-emerald-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[11px] leading-none">Analytics</span>
        </button>
      </div>
    </nav>
  );
};
