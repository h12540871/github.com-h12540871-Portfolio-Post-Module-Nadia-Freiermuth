import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid 
} from 'recharts';
import { Holding } from '../types';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

interface StockChartPanelProps {
  holding: Holding;
}

export const StockChartPanel: React.FC<StockChartPanelProps> = ({ holding }) => {
  const history = holding.history || [];

  if (history.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
        Chart data not available for {holding.ticker}.
      </div>
    );
  }

  // Calculate histogram for each record (macd minus macd_signal)
  const chartData = history.map(item => {
    const macdVal = item.macd ?? 0;
    const signalVal = item.macd_signal ?? 0;
    const histogram = Number((macdVal - signalVal).toFixed(4));
    return {
      ...item,
      histogram,
      // For coloring histogram bars in Recharts Bar chart, we can attach fill color or handle via Cell
      histogramColor: histogram >= 0 ? '#10b981' : '#f43f5e'
    };
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{holding.ticker}</span>
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">• Technical Indicator History</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Aligned daily date axis showing Price vs SMA-200, MACD momentum, and RSI overbought levels.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium">
            {history.length} Data Points
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Chart 1: Price + SMA-200 Overlay */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Price & SMA-200 Trend Overlay
            </span>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-indigo-600 inline-block"></span> Close Price</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span> SMA-200</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="close" stroke="#6366f1" strokeWidth={2} dot={false} name="Close Price" />
                <Line type="monotone" dataKey="sma200" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="SMA-200" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: MACD + Histogram */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <BarChart2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              MACD & Histogram
            </span>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-blue-500 inline-block"></span> MACD Line</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-purple-500 inline-block"></span> Signal Line</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-xs inline-block"></span> Bullish / <span className="w-2 h-2 bg-rose-500 rounded-xs inline-block"></span> Bearish Hist</span>
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />
                <Bar dataKey="histogram" fill="#10b981" name="MACD Histogram">
                  {chartData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.histogram >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={1.8} dot={false} name="MACD" />
                <Line type="monotone" dataKey="macd_signal" stroke="#a855f7" strokeWidth={1.5} dot={false} name="Signal" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: RSI (0-100 with ref lines at 70 and 75) */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Relative Strength Index (RSI 14)
            </span>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-rose-500 inline-block"></span> Overbought (75 Filter)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span> Warning (70)</span>
            </div>
          </div>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} ticks={[0, 30, 50, 70, 75, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Filter (75)', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Overbought (70)', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine y={30} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Oversold (30)', fill: '#3b82f6', fontSize: 10, position: 'insideBottomRight' }} />
                <Line type="monotone" dataKey="rsi" stroke="#06b6d4" strokeWidth={2} dot={false} name="RSI (14)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
