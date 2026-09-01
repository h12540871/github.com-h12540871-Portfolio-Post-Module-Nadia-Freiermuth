import React from 'react';
import { Holding } from '../types';
import { TrendingUp, BarChart2, Activity, ShieldAlert, CheckCircle, PieChart } from 'lucide-react';

interface TradingSignalSummaryProps {
  holdings: Holding[];
}

export const TradingSignalSummary: React.FC<TradingSignalSummaryProps> = ({ holdings }) => {
  if (!holdings || holdings.length === 0) return null;

  const total = holdings.length;
  const bullishCrossovers = holdings.filter(h => h.macd_status === 'bullish_crossover').length;
  const bullish = holdings.filter(h => h.macd_status === 'bullish' || h.macd_status === 'bullish_crossover').length;
  const aboveSma = holdings.filter(h => h.trend_status === 'above_sma200').length;
  const overboughtOrNear = holdings.filter(h => h.rsi >= 70).length;
  const positiveSentiment = holdings.filter(h => h.sentiment_score >= 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Trend Status */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Trend Alignment</span>
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{aboveSma}</span>
          <span className="text-xs text-slate-500 font-medium">/ {total} above SMA-200</span>
        </div>
        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>{((aboveSma / total) * 100).toFixed(0)}% strict structural uptrend compliance</span>
        </div>
      </div>

      {/* Metric 2: MACD Momentum */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">MACD Momentum</span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <BarChart2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{bullishCrossovers}</span>
          <span className="text-xs text-slate-500 font-medium">Bullish Crossovers ({bullish} total bullish)</span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Active momentum acceleration signals
        </div>
      </div>

      {/* Metric 3: RSI Valuation */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">RSI Valuation</span>
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{overboughtOrNear}</span>
          <span className="text-xs text-slate-500 font-medium">Near / Overbought (&ge;70 RSI)</span>
        </div>
        <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" />
          <span>Monitored against the 75 strategy filter</span>
        </div>
      </div>

      {/* Metric 4: Sentiment Score */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Sentiment Health</span>
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{positiveSentiment}</span>
          <span className="text-xs text-slate-500 font-medium">/ {total} Positive Sentiment</span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Filtered above -0.15 divergence threshold
        </div>
      </div>
    </div>
  );
};
