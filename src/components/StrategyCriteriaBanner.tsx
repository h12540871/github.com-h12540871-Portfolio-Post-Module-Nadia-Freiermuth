import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, BarChart2, Activity, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const StrategyCriteriaBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="bg-gradient-to-r from-indigo-900/10 via-indigo-900/5 to-purple-900/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/30 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 p-5 shadow-xs">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>AlphaQuant Multi-Factor Inclusion Criteria (The 3 Core Filters)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                100% Rule-Based
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              To be selected and weighted in the $25M strategy portfolio, equities must fulfill three rigorous quantitative filters:
            </p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/50 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Criterion 1: Trend Filter */}
          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/60 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                1. Trend Filter
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Price &gt; SMA-200 (Long-Term Uptrend)
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Equities must maintain a sustained upward price structure trading above their 200-day Simple Moving Average to filter out structural bear markets.
            </p>
          </div>

          {/* Criterion 2: Momentum Filter */}
          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/60 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                <BarChart2 className="w-3.5 h-3.5" />
                2. Momentum Filter
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Positive MACD / Crossover
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Moving Average Convergence Divergence (MACD) histogram must be positive or exhibit a bullish crossover confirmation over the signal line.
            </p>
          </div>

          {/* Criterion 3: Valuation & Sentiment Filter */}
          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/60 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                3. RSI & Sentiment Filter
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              RSI &lt; 75 &amp; Sentiment &gt; -0.15
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Ensures equities are not extremely overbought (RSI &lt; 75 filter) and have stable news/social sentiment without severe negative divergence.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
