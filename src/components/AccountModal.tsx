import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Account, AccountType } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAccount?: Account | null;
}

const ACCOUNT_ICONS = [
  'Building2',
  'Wallet',
  'PiggyBank',
  'CreditCard',
  'Coins',
  'CircleDollarSign',
];

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  editingAccount,
}) => {
  const { addAccount, editAccount } = useFinanceStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');
  const [icon, setIcon] = useState('Building2');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (editingAccount) {
        setName(editingAccount.name);
        setType(editingAccount.type);
        setBalance(editingAccount.balance.toString());
        setIcon(editingAccount.icon || 'Building2');
      } else {
        setName('');
        setType('bank');
        setBalance('0.00');
        setIcon('Building2');
      }
      setError('');
    }
  }, [isOpen, editingAccount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an account name.');
      return;
    }
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) {
      setError('Please enter a valid numeric balance.');
      return;
    }

    if (editingAccount) {
      editAccount(editingAccount.id, {
        name: name.trim(),
        type,
        balance: numBalance,
        icon,
      });
    } else {
      addAccount({
        name: name.trim(),
        type,
        balance: numBalance,
        icon,
      });
    }

    onClose();
  };

  return (
    <div
      id="account-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div
        id="account-modal-card"
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingAccount ? 'Edit Account' : 'New Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {editingAccount ? 'Update account details' : 'Create a new wallet, bank or credit card'}
            </p>
          </div>
          <button
            id="close-account-modal-btn"
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
            <label htmlFor="account-name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Account Name
            </label>
            <input
              id="account-name"
              type="text"
              placeholder="e.g. Chase Premier Checking"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="account-type" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Account Type
            </label>
            <select
              id="account-type"
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
              className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="bank">Bank / Checking</option>
              <option value="cash">Cash / Physical</option>
              <option value="savings">Savings Account</option>
              <option value="credit">Credit Card</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="account-balance" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Balance ($)
            </label>
            <input
              id="account-balance"
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full min-h-[44px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select Icon
            </label>
            <div className="grid grid-cols-6 gap-2 pt-1">
              {ACCOUNT_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`min-h-[44px] flex items-center justify-center rounded-xl border transition-all ${
                    icon === iconName
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CategoryIcon name={iconName} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              id="cancel-account-btn"
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-account-btn"
              type="submit"
              className="flex-1 min-h-[44px] px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              {editingAccount ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
