export interface HistoryRecord {
  date: string;
  close: number;
  sma200: number;
  macd: number;
  macd_signal: number;
  rsi: number;
}

export interface Holding {
  ticker: string;
  company: string;
  sector: string;
  weight: number;
  optimized_weight?: number;
  macd_status: string;
  macd_histogram: number;
  trend_status: string;
  rsi: number;
  sentiment_score: number;
  history?: HistoryRecord[];
  // Live fields
  price?: number;
  changesPercentage?: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  marketCap?: number;
  previousClose?: number;
}

export interface PortfolioSnapshot {
  as_of_date: string;
  strategy_name?: string;
  total_strategy_aum?: number;
  holdings: Holding[];
}

export interface QuoteData {
  symbol: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  previousClose: number;
  open: number;
}
