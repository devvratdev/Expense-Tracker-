import React, { useState } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import { ActiveTab, Transaction } from './types';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './screens/DashboardScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { AccountsScreen } from './screens/AccountsScreen';
import { BudgetsScreen } from './screens/BudgetsScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { TransactionModal } from './components/TransactionModal';
import { CircleDollarSign, RotateCcw, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { resetData } = useFinanceStore();

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all transactions, accounts and budgets to original sample data?')) {
      resetData();
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview';
      case 'transactions':
        return 'Transactions Activity';
      case 'budgets':
        return 'Monthly Budgets';
      case 'accounts':
        return 'My Accounts';
      case 'analytics':
        return 'Financial Analytics';
      default:
        return 'MyMoney';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex justify-center font-sans antialiased selection:bg-emerald-200">
      {/* Mobile-first centered app shell */}
      <div className="w-full max-w-lg bg-slate-50 min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200/60">
        {/* Top App Bar */}
        <header
          id="app-top-header"
          className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CircleDollarSign className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
                  MyMoney
                </h1>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Offline
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 leading-none">
                {getTabTitle()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleResetData}
              title="Reset to sample data"
              className="min-h-[40px] px-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </header>

        {/* Main Content View with padding for bottom nav */}
        <main className="flex-1 px-4 sm:px-5 pt-4 pb-24 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardScreen
              onNavigateTab={setActiveTab}
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsScreen
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
            />
          )}

          {activeTab === 'budgets' && <BudgetsScreen />}

          {activeTab === 'accounts' && <AccountsScreen />}

          {activeTab === 'analytics' && <AnalyticsScreen />}
        </main>

        {/* Bottom Tab Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Add / Edit Transaction Modal */}
        <TransactionModal
          isOpen={isTxModalOpen}
          onClose={() => {
            setIsTxModalOpen(false);
            setEditingTransaction(null);
          }}
          editingTransaction={editingTransaction}
        />
      </div>
    </div>
  );
}
