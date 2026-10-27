import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  color?: 'emerald' | 'teal' | 'navy' | 'amber' | 'rose';
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  color = 'emerald',
}: StatCardProps) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-400',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-600/20',
      border: 'border-emerald-100 dark:border-emerald-900/50',
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      text: 'text-teal-700 dark:text-teal-400',
      iconBg: 'bg-teal-600 text-white shadow-teal-600/20',
      border: 'border-teal-100 dark:border-teal-900/50',
    },
    navy: {
      bg: 'bg-slate-50 dark:bg-slate-900/50',
      text: 'text-slate-800 dark:text-slate-200',
      iconBg: 'bg-slate-900 text-white shadow-slate-900/20',
      border: 'border-slate-200 dark:border-slate-800',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-400',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
      border: 'border-amber-100 dark:border-amber-900/50',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-400',
      iconBg: 'bg-rose-600 text-white shadow-rose-600/20',
      border: 'border-rose-100 dark:border-rose-900/50',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`p-6 rounded-2xl bg-white dark:bg-slate-800/90 border ${scheme.border} shadow-xs hover:shadow-md transition-all`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scheme.bg} ${scheme.text}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${scheme.iconBg} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
