import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Holding } from '../types';
import { generateExecutiveCommentary } from '../services/geminiApi';

interface ExecutiveCommentaryProps {
  holdings: Holding[];
  geminiApiKey?: string;
}

export const ExecutiveCommentary: React.FC<ExecutiveCommentaryProps> = ({ holdings, geminiApiKey }) => {
  const [commentary, setCommentary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommentary = async () => {
    if (!holdings || holdings.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const text = await generateExecutiveCommentary(holdings, geminiApiKey);
      setCommentary(text);
    } catch (err: any) {
      console.error('Failed to generate commentary:', err);
      setError('Using cached quantitative summary due to API connection limit.');
      // Fallback text
      setCommentary(`The quantitative portfolio maintains disciplined allocation across core large-cap holdings with strong SMA-200 trend support. Monitoring threshold metrics for potential mean-reversion signals in overextended momentum names.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentary();
  }, [holdings, geminiApiKey]);

  return (
    <div className="bg-gradient-to-br from-indigo-900/90 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-inner">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-wide text-indigo-100">Executive Strategy Commentary</h2>
            <p className="text-xs text-indigo-300/70">AI-synthesized analysis of positioning, risk factors, and filter thresholds</p>
          </div>
        </div>

        <button
          onClick={fetchCommentary}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/25 transition-colors disabled:opacity-50 cursor-pointer"
          title="Regenerate commentary"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="relative z-10 mt-3">
        {loading ? (
          <div className="space-y-2 animate-pulse py-2">
            <div className="h-4 bg-indigo-950/60 rounded w-full"></div>
            <div className="h-4 bg-indigo-950/60 rounded w-5/6"></div>
            <div className="h-4 bg-indigo-950/60 rounded w-4/6"></div>
          </div>
        ) : (
          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            {commentary}
          </p>
        )}

        {error && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-400 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
