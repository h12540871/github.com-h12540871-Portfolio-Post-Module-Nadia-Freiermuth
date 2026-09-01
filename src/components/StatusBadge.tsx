import React from 'react';

interface StatusBadgeProps {
  type: 'macd' | 'trend' | 'rsi' | 'sentiment';
  value: string | number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  if (type === 'macd') {
    const val = String(value).toLowerCase();
    let bg = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    let label = String(value);

    if (val.includes('bullish_crossover')) {
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800';
      label = 'Bullish Crossover';
    } else if (val.includes('bullish')) {
      bg = 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800';
      label = 'Bullish';
    } else if (val.includes('bearish_crossover')) {
      bg = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800';
      label = 'Bearish Crossover';
    } else if (val.includes('bearish')) {
      bg = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800';
      label = 'Bearish';
    } else {
      label = 'Neutral';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg}`}>
        {label}
      </span>
    );
  }

  if (type === 'trend') {
    const val = String(value).toLowerCase();
    const isAbove = val.includes('above');
    const bg = isAbove
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800';
    const label = isAbove ? 'Above SMA-200' : 'Below SMA-200';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg}`}>
        {label}
      </span>
    );
  }

  if (type === 'rsi') {
    const rsiNum = Number(value);
    let bg = 'bg-slate-100 text-slate-700 border-slate-200';
    let isNearThreshold = false;

    if (rsiNum >= 70 && rsiNum <= 75) {
      bg = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700';
      isNearThreshold = true;
    } else if (rsiNum > 75) {
      bg = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800';
    } else if (rsiNum < 30) {
      bg = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800';
    } else {
      bg = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg}`} title={isNearThreshold ? 'Near overbought filter threshold (70-75)' : ''}>
        {value}
        {isNearThreshold && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
      </span>
    );
  }

  if (type === 'sentiment') {
    const score = Number(value);
    let bg = 'bg-slate-100 text-slate-700 border-slate-200';
    const isNearThreshold = score >= -0.10 && score <= -0.05;

    if (score > 0.05) {
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800';
    } else if (score < -0.05) {
      bg = isNearThreshold 
        ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700'
        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800';
    } else {
      bg = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }

    const formatted = score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2);

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg}`} title={isNearThreshold ? 'Near negative risk threshold (-0.05 to -0.10)' : ''}>
        {formatted}
        {isNearThreshold && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
      </span>
    );
  }

  return <span>{String(value)}</span>;
};
