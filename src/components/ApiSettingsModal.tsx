import React, { useState } from 'react';
import { X, Key, Save, CheckCircle2 } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fmpKey: string;
  setFmpKey: (key: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  fmpKey,
  setFmpKey,
  geminiKey,
  setGeminiKey,
}) => {
  const [localFmp, setLocalFmp] = useState(fmpKey);
  const [localGemini, setLocalGemini] = useState(geminiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFmpKey(localFmp);
    setGeminiKey(localGemini);
    localStorage.setItem('quant_fmp_key', localFmp);
    localStorage.setItem('quant_gemini_key', localGemini);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">API Configuration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure keys for live FMP quotes & Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Financial Modeling Prep (FMP) API Key
            </label>
            <input
              type="password"
              value={localFmp}
              onChange={(e) => setLocalFmp(e.target.value)}
              placeholder="e.g. fmp_api_key_..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Leave blank to use simulated live price ticks (great for testing).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={localGemini}
              onChange={(e) => setLocalGemini(e.target.value)}
              placeholder="e.g. AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Leave blank to use algorithmic quantitative commentary generator.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Keys</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
