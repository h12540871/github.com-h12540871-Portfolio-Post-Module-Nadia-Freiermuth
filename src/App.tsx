import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, RefreshCw, Settings, AlertTriangle, Layers } from 'lucide-react';
import { useLivePrices } from './hooks/useLivePrices';
import { SignalTable } from './components/SignalTable';
import { ExecutiveCommentary } from './components/ExecutiveCommentary';
import { StrategyCriteriaBanner } from './components/StrategyCriteriaBanner';
import { TradingSignalSummary } from './components/TradingSignalSummary';
import { ApiSettingsModal } from './components/ApiSettingsModal';

export default function App() {
  const [fmpApiKey, setFmpKey] = useState<string>(() => localStorage.getItem('quant_fmp_key') || '');
  const [geminiApiKey, setGeminiKey] = useState<string>(() => localStorage.getItem('quant_gemini_key') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const {
    snapshot,
    holdings,
    loading,
    error,
    isStale,
    lastUpdated,
    refreshPrices
  } = useLivePrices(fmpApiKey);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  {snapshot?.strategy_name || 'AlphaQuant Multi-Factor Equity Model'}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  v4.2 Production
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AUM: {snapshot?.total_strategy_aum ? `$${(snapshot.total_strategy_aum / 1000000).toFixed(1)}M` : '$25.0M'} • Daily Quantitative Pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshPrices}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              title="Poll live quotes now"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Poll Prices</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>API Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Non-blocking Stale / Error Banner */}
      {isStale && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-inner">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Live price feed connection delayed. Displaying last successfully fetched market prices. Auto-retrying every 60s.</span>
        </div>
      )}

      {error && !snapshot && (
        <div className="bg-rose-600 text-white px-4 py-3 text-sm font-medium text-center">
          <span>Failed to load portfolio snapshot: {error}. Please ensure `portfolio_output.json` exists in public/.</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Status Bar: As-of Date & Live Poll timestamp */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>R Pipeline Snapshot (As of):</span>
              <strong className="font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {snapshot?.as_of_date || '2026-08-29'}
              </strong>
            </div>
            
            <div className="hidden md:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Signals locked until next pipeline run</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Quote Poll (60s loop):</span>
              <strong className="font-mono text-slate-900 dark:text-white bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {lastUpdated || 'Connecting...'}
              </strong>
            </div>
          </div>
        </div>

        {/* Trading Signal Summary Cards */}
        <TradingSignalSummary holdings={holdings} />

        {/* Strategy Inclusion Criteria Banner */}
        <StrategyCriteriaBanner />

        {/* Executive Commentary Callout Box */}
        <ExecutiveCommentary holdings={holdings} geminiApiKey={geminiApiKey} />

        {/* Signal Table */}
        <SignalTable holdings={holdings} loading={loading} />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Quantitative Equity Strategy • Client-Side Static SPA (GitHub Pages Ready)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Signals: R Pipeline</span>
            <span>•</span>
            <span>Quotes: FMP API</span>
            <span>•</span>
            <span>Insights: Gemini AI</span>
          </div>
        </div>
      </footer>

      {/* API Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fmpKey={fmpApiKey}
        setFmpKey={setFmpKey}
        geminiKey={geminiApiKey}
        setGeminiKey={setGeminiKey}
      />
    </div>
  );
}
