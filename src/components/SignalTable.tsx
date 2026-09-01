import React, { useState } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Holding } from '../types';
import { StatusBadge } from './StatusBadge';
import { StockChartPanel } from './StockChartPanel';

interface SignalTableProps {
  holdings: Holding[];
  loading: boolean;
}

type SortField = 'weight' | 'ticker' | 'price' | 'changesPercentage' | 'rsi' | 'sentiment_score';
type SortOrder = 'asc' | 'desc';

export const SignalTable: React.FC<SignalTableProps> = ({ holdings, loading }) => {
  const [sortField, setSortField] = useState<SortField>('weight');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);
  const [weightMode, setWeightMode] = useState<'base' | 'optimized'>('base');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // Default desc for weight, price, rsi, sentiment; asc for ticker
      setSortOrder(field === 'ticker' ? 'asc' : 'desc');
    }
  };

  const toggleExpand = (ticker: string) => {
    setExpandedTicker(prev => prev === ticker ? null : ticker);
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    let aVal: any = a[sortField] ?? 0;
    let bVal: any = b[sortField] ?? 0;

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Check if stock is near filter thresholds (RSI 70-75 or Sentiment -0.05 to -0.10)
  const isNearThreshold = (h: Holding) => {
    const rsiNear = h.rsi >= 70 && h.rsi <= 75;
    const sentNear = h.sentiment_score >= -0.10 && h.sentiment_score <= -0.05;
    return rsiNear || sentNear;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-72 mt-2 animate-pulse"></div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div key={n} className="p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-36"></div>
                </div>
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Quantitative Strategy Holdings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Click any row to toggle technical indicator charts ({holdings.length} equities)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setWeightMode('base')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                weightMode === 'base'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Base Model Wts
            </button>
            <button
              onClick={() => setWeightMode('optimized')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                weightMode === 'optimized'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sharpe-Optimized Wts
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Amber rows: filter thresholds</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('ticker')}>
                <div className="flex items-center gap-1.5">
                  Ticker / Company
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 text-right" onClick={() => handleSort('weight')}>
                <div className="flex items-center justify-end gap-1.5">
                  {weightMode === 'optimized' ? 'Optimized Wt' : 'Base Weight'}
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 text-right" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end gap-1.5">
                  Live Price
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 text-right" onClick={() => handleSort('changesPercentage')}>
                <div className="flex items-center justify-end gap-1.5">
                  Daily Change
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4">MACD Signal</th>
              <th className="py-3.5 px-4">SMA-200 Trend</th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('rsi')}>
                <div className="flex items-center justify-end gap-1.5">
                  RSI (14)
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('sentiment_score')}>
                <div className="flex items-center justify-end gap-1.5">
                  Sentiment
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {sortedHoldings.map((holding) => {
              const nearThresh = isNearThreshold(holding);
              const changePct = holding.changesPercentage ?? 0;
              const isPositiveChange = changePct >= 0;
              const isExpanded = expandedTicker === holding.ticker;

              return (
                <React.Fragment key={holding.ticker}>
                  <tr 
                    onClick={() => toggleExpand(holding.ticker)}
                    className={`transition-colors cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/60 ${
                      isExpanded ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : ''
                    } ${
                      nearThresh 
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-l-4 border-l-amber-500' 
                        : ''
                    }`}
                    title="Click to toggle technical indicator charts"
                  >
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs shadow-sm">
                          {holding.ticker}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{holding.ticker}</span>
                            {nearThresh && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                                <AlertTriangle className="w-3 h-3" /> Threshold
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-normal truncate max-w-[180px]">
                            {holding.company} • <span className="text-slate-400 dark:text-slate-500">{holding.sector}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-900 dark:text-white">
                      {((weightMode === 'optimized' && holding.optimized_weight !== undefined ? holding.optimized_weight : holding.weight) * 100).toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                      {holding.price !== undefined ? `$${holding.price.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {holding.changesPercentage !== undefined ? (
                        <span className={`inline-flex items-center justify-end gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-md ${
                          isPositiveChange 
                            ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40' 
                            : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40'
                        }`}>
                          {isPositiveChange ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPositiveChange ? `+${changePct.toFixed(2)}%` : `${changePct.toFixed(2)}%`}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge type="macd" value={holding.macd_status} />
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge type="trend" value={holding.trend_status} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <StatusBadge type="rsi" value={holding.rsi} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <StatusBadge type="sentiment" value={holding.sentiment_score} />
                    </td>
                  </tr>

                  {/* Expanded Chart Panel Row */}
                  {isExpanded && (
                    <tr className="bg-slate-100/50 dark:bg-slate-900/80">
                      <td colSpan={8} className="p-6">
                        <StockChartPanel holding={holding} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

