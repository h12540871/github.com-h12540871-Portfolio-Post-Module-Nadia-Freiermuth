import { useState, useEffect, useCallback } from 'react';
import { PortfolioSnapshot, Holding, QuoteData } from '../types';
import { fetchLiveQuotes } from '../services/fmpApi';

export function useLivePrices(fmpApiKey?: string) {
  const [snapshot, setSnapshot] = useState<PortfolioSnapshot | null>(null);
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchQuotesData = useCallback(async (currentHoldings: Holding[], apiKey?: string) => {
    if (!currentHoldings || currentHoldings.length === 0) return;
    const tickers = currentHoldings.map(h => h.ticker);
    
    try {
      const liveData = await fetchLiveQuotes(tickers, apiKey);
      setQuotes(liveData);
      setIsStale(false);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err: any) {
      console.warn('Live price poll failed, keeping last known prices:', err);
      setIsStale(true);
      // Don't overwrite existing quotes if we have them, so we degrade gracefully
    }
  }, []);

  // Load snapshot on mount
  useEffect(() => {
    let isMounted = true;
    async function loadSnapshot() {
      try {
        setLoading(true);
        let data: PortfolioSnapshot | null = null;
        try {
          const res = await fetch('https://raw.githubusercontent.com/h12540871/Portfolio-Post-Module-Nadia-Freiermuth/refs/heads/main/portfolio_output.json');
          if (res.ok) {
            data = await res.json();
          }
        } catch (e) {
          console.warn('Failed to fetch from GitHub raw URL, falling back to local snapshot:', e);
        }

        if (!data) {
          const resLocal = await fetch('/portfolio_output.json');
          if (!resLocal.ok) {
            throw new Error(`Failed to load portfolio snapshot: ${resLocal.status} ${resLocal.statusText}`);
          }
          data = await resLocal.json();
        }
        
        if (isMounted && data) {
          setSnapshot(data);
          // Initial live price fetch
          await fetchQuotesData(data.holdings, fmpApiKey);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error loading portfolio snapshot:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load portfolio snapshot');
          setLoading(false);
        }
      }
    }

    loadSnapshot();

    return () => {
      isMounted = false;
    };
  }, [fmpApiKey, fetchQuotesData]);

  // Set up 60-second polling interval for live prices
  useEffect(() => {
    if (!snapshot || !snapshot.holdings) return;

    const intervalId = setInterval(() => {
      fetchQuotesData(snapshot.holdings, fmpApiKey);
    }, 60000); // exactly 60 seconds

    return () => clearInterval(intervalId);
  }, [snapshot, fmpApiKey, fetchQuotesData]);

  // Merge snapshot holdings with live quotes
  const holdingsWithLive: Holding[] = (snapshot?.holdings || []).map(h => {
    const q = quotes[h.ticker];
    return {
      ...h,
      price: q ? q.price : undefined,
      changesPercentage: q ? q.changesPercentage : undefined,
      dayHigh: q ? q.dayHigh : undefined,
      dayLow: q ? q.dayLow : undefined,
      volume: q ? q.volume : undefined,
      marketCap: q ? q.marketCap : undefined,
      previousClose: q ? q.previousClose : undefined
    };
  });

  const refreshPrices = () => {
    if (snapshot && snapshot.holdings) {
      fetchQuotesData(snapshot.holdings, fmpApiKey);
    }
  };

  return {
    snapshot,
    holdings: holdingsWithLive,
    loading,
    error,
    isStale,
    lastUpdated,
    refreshPrices
  };
}
