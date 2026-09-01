import { QuoteData, Holding } from '../types';

// Fallback base prices for demo / mock mode when FMP key is missing or rate limited
const BASE_PRICES: Record<string, number> = {
  AAPL: 228.50,
  MSFT: 425.20,
  NVDA: 124.60,
  AMZN: 186.40,
  GOOGL: 178.10,
  META: 512.30,
  JPM: 215.80,
  LLY: 940.00,
  XOM: 118.25,
  TSLA: 222.10
};

export async function fetchLiveQuotes(tickers: string[], apiKey?: string): Promise<Record<string, QuoteData>> {
  const result: Record<string, QuoteData> = {};
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_FMP_API_KEY') {
    // Generate realistic slight random price fluctuations for demo mode
    for (const ticker of tickers) {
      const base = BASE_PRICES[ticker] || 150.0;
      // random daily change between -2.5% and +3.0%
      const changesPercentage = Number(((Math.random() * 5.5) - 2.2).toFixed(2));
      const price = Number((base * (1 + changesPercentage / 100)).toFixed(2));
      const change = Number((price - base).toFixed(2));
      
      result[ticker] = {
        symbol: ticker,
        price,
        changesPercentage,
        change,
        dayLow: Number((price * 0.99).toFixed(2)),
        dayHigh: Number((price * 1.01).toFixed(2)),
        yearHigh: Number((price * 1.3).toFixed(2)),
        yearLow: Number((price * 0.75).toFixed(2)),
        marketCap: base * 1000000000,
        priceAvg50: base * 0.98,
        priceAvg200: base * 0.92,
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        previousClose: base,
        open: base * 0.995
      };
    }
    return result;
  }

  try {
    const tickerString = tickers.join(',');
    const url = `https://financialmodelingprep.com/api/v3/quote/${tickerString}?apikey=${apiKey.trim()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item && item.symbol) {
          result[item.symbol] = {
            symbol: item.symbol,
            price: item.price ?? BASE_PRICES[item.symbol] ?? 100,
            changesPercentage: item.changesPercentage ?? 0,
            change: item.change ?? 0,
            dayLow: item.dayLow ?? item.price,
            dayHigh: item.dayHigh ?? item.price,
            yearHigh: item.yearHigh ?? item.price,
            yearLow: item.yearLow ?? item.price,
            marketCap: item.marketCap ?? 0,
            priceAvg50: item.priceAvg50 ?? item.price,
            priceAvg200: item.priceAvg200 ?? item.price,
            volume: item.volume ?? 0,
            previousClose: item.previousClose ?? item.price,
            open: item.open ?? item.price
          };
        }
      }
    }
    
    // Fill in any missing tickers from fallback if batch didn't return them
    for (const ticker of tickers) {
      if (!result[ticker]) {
        const base = BASE_PRICES[ticker] || 150;
        result[ticker] = {
          symbol: ticker,
          price: base,
          changesPercentage: 0.5,
          change: 1.2,
          dayLow: base * 0.99,
          dayHigh: base * 1.01,
          yearHigh: base * 1.2,
          yearLow: base * 0.8,
          marketCap: base * 1000000000,
          priceAvg50: base * 0.95,
          priceAvg200: base * 0.90,
          volume: 2000000,
          previousClose: base,
          open: base
        };
      }
    }
    
    return result;
  } catch (error) {
    console.warn('Failed to fetch live quotes from FMP, falling back to simulated data:', error);
    throw error;
  }
}
