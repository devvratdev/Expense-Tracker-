import React from 'react';
import {
  Utensils,
  ShoppingCart,
  Home,
  Car,
  Zap,
  Film,
  ShoppingBag,
  HeartPulse,
  Briefcase,
  Laptop,
  Building2,
  Wallet,
  PiggyBank,
  CreditCard,
  Coins,
  ArrowRightLeft,
  CircleDollarSign,
  Coffee,
  Plane,
  Gift,
  GraduationCap,
  Sparkles,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Tag,
  Receipt,
  LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Utensils,
  ShoppingCart,
  Home,
  Car,
  Zap,
  Film,
  ShoppingBag,
  HeartPulse,
  Briefcase,
  Laptop,
  Building2,
  Wallet,
  PiggyBank,
  CreditCard,
  Coins,
  ArrowRightLeft,
  CircleDollarSign,
  Coffee,
  Plane,
  Gift,
  GraduationCap,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Tag,
  Receipt,
};

interface Props extends LucideProps {
  name?: string;
}

export const CategoryIcon: React.FC<Props> = ({ name, className = 'w-5 h-5', ...rest }) => {
  if (!name) {
    return <CircleDollarSign className={className} {...rest} />;
  }

  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} {...rest} />;
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);
