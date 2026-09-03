import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Landmark, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from '../components/CategoryIcon';
import { Account } from '../types';
import { AccountModal } from '../components/AccountModal';

export const AccountsScreen: React.FC = () => {
  const { accounts, deleteAccount, transactions } = useFinanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const totalNetWorth = accounts.reduce((sum, acc) => {
    // If credit card balance is positive debt, adjust or sum
    return sum + acc.balance;
  }, 0);

  const totalAssets = accounts
    .filter((a) => a.balance >= 0)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const handleEdit = (acc: Account) => {
    setEditingAccount(acc);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleDelete = (acc: Account) => {
    const hasTx = transactions.some(
      (t) => t.accountId === acc.id || t.fromAccountId === acc.id || t.toAccountId === acc.id
    );
    const msg = hasTx
      ? `This account has recorded transactions. Are you sure you want to delete "${acc.name}"?`
      : `Delete account "${acc.name}"?`;

    if (window.confirm(msg)) {
      deleteAccount(acc.id);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'bank':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cash':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'savings':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'credit':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="accounts-screen-container" className="space-y-6 pb-12">
      {/* Top Net Worth Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Net Worth
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
            {accounts.length} Accounts
          </span>
        </div>

        <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(totalNetWorth)}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Assets</span>
            <span className="text-base font-bold text-emerald-600">
              {formatCurrency(totalAssets)}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Liabilities / Credit</span>
            <span className="text-base font-bold text-slate-700">
              {formatCurrency(totalLiabilities)}
            </span>
          </div>
        </div>
      </div>

      {/* Account Cards Header & Action */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            All Accounts
          </h2>
          <button
            id="create-new-account-btn"
            type="button"
            onClick={handleCreate}
            className="min-h-[44px] px-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl">
            <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No accounts configured</p>
            <button
              onClick={handleCreate}
              className="mt-3 min-h-[44px] px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              Add Your First Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <CategoryIcon name={acc.icon} className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-800 truncate">{acc.name}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${getTypeBadge(
                          acc.type
                        )}`}
                      >
                        {acc.type}
                      </span>
                    </div>
                    <p className="text-lg font-extrabold text-slate-900 mt-1">
                      {formatCurrency(acc.balance)}
                    </p>
                  </div>
                </div>

                {/* Edit & Delete actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(acc)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit account"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(acc)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingAccount={editingAccount}
      />
    </div>
  );
};
