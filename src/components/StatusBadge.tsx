import React from 'react';
import { ParticipationStatus } from '../types';
import { CheckCircle2, Clock, HelpCircle, XCircle, Sparkles, Building2, UtensilsCrossed } from 'lucide-react';

interface StatusBadgeProps {
  status: ParticipationStatus;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isVerified, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'ACTIVE_DONOR':
        return {
          label: '🍱 Active Donor',
          bg: 'bg-emerald-100 dark:bg-emerald-950/60',
          text: 'text-emerald-800 dark:text-emerald-300',
          border: 'border-emerald-300 dark:border-emerald-700',
          icon: UtensilsCrossed
        };
      case 'VERIFIED':
        return {
          label: '✅ Verified Partner',
          bg: 'bg-teal-100 dark:bg-teal-950/60',
          text: 'text-teal-800 dark:text-teal-300',
          border: 'border-teal-300 dark:border-teal-700',
          icon: CheckCircle2
        };
      case 'REGISTERED':
        return {
          label: '🟢 Registered',
          bg: 'bg-green-50 dark:bg-green-950/40',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800',
          icon: Building2
        };
      case 'INTERESTED':
        return {
          label: '🟠 Interested',
          bg: 'bg-amber-100 dark:bg-amber-950/50',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-300 dark:border-amber-700',
          icon: Sparkles
        };
      case 'CONTACTED':
        return {
          label: '🟡 Contacted',
          bg: 'bg-yellow-100 dark:bg-yellow-950/50',
          text: 'text-yellow-800 dark:text-yellow-300',
          border: 'border-yellow-300 dark:border-yellow-700',
          icon: Clock
        };
      case 'IDENTIFIED':
        return {
          label: '🔵 Identified',
          bg: 'bg-sky-100 dark:bg-sky-950/50',
          text: 'text-sky-800 dark:text-sky-300',
          border: 'border-sky-300 dark:border-sky-700',
          icon: HelpCircle
        };
      case 'NOT_INTERESTED':
        return {
          label: '❌ Not Interested',
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-600 dark:text-slate-400',
          border: 'border-slate-300 dark:border-slate-700',
          icon: XCircle
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          icon: HelpCircle
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  }[size];

  return (
    <div className="inline-flex items-center flex-wrap gap-1.5">
      <span className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="whitespace-nowrap">{config.label}</span>
      </span>
      {isVerified && status !== 'VERIFIED' && status !== 'ACTIVE_DONOR' && (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-emerald-600 text-white rounded-full">
          Verified
        </span>
      )}
    </div>
  );
};
