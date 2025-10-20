import { CandlestickData, Symbol, TimeFrame } from "@/types/trading";

/**
 * Simulated real-time market data service for development
 * Generates realistic candlestick data for multiple currency pairs
 */

const baseRates: Record<Symbol, number> = {
  "EUR/USD": 1.0850,
  "GBP/USD": 1.2650,
  "USD/JPY": 149.50,
  "AUD/USD": 0.6550,
  "USD/CHF": 0.8850,
  "EUR/JPY": 162.20,
  "GBP/JPY": 189.10,
  "EUR/GBP": 0.8580,
};

const volatility: Record<Symbol, number> = {
  "EUR/USD": 0.0005,
  "GBP/USD": 0.0008,
  "USD/JPY": 0.05,
  "AUD/USD": 0.0006,
  "USD/CHF": 0.0004,
  "EUR/JPY": 0.08,
  "GBP/JPY": 0.10,
  "EUR/GBP": 0.0004,
};

const timeframeMinutes: Record<TimeFrame, number> = {
  "1m": 1,
  "5m": 5,
  "15m": 15,
  "1h": 60,
  "4h": 240,
  "1D": 1440,
};

let currentPrices: Record<Symbol, number> = { ...baseRates };

/**
 * Generate historical candlestick data
 */
export function generateHistoricalData(
  symbol: Symbol,
  timeframe: TimeFrame,
  count: number = 200
): CandlestickData[] {
  const candles: CandlestickData[] = [];
  const intervalMs = timeframeMinutes[timeframe] * 60 * 1000;
  const now = Date.now();
  const vol = volatility[symbol];
  let price = baseRates[symbol];

  for (let i = count; i > 0; i--) {
    const time = now - i * intervalMs;
    
    // Random walk with trend
    const trend = (Math.random() - 0.48) * vol; // Slight upward bias
    const open = price;
    const close = price + trend + (Math.random() - 0.5) * vol;
    const high = Math.max(open, close) + Math.random() * vol * 0.5;
    const low = Math.min(open, close) - Math.random() * vol * 0.5;
    const volume = Math.random() * 1000 + 500;

    candles.push({
      time: Math.floor(time / 1000), // Convert to seconds for lightweight-charts
      open: parseFloat(open.toFixed(symbol.includes("JPY") ? 2 : 4)),
      high: parseFloat(high.toFixed(symbol.includes("JPY") ? 2 : 4)),
      low: parseFloat(low.toFixed(symbol.includes("JPY") ? 2 : 4)),
      close: parseFloat(close.toFixed(symbol.includes("JPY") ? 2 : 4)),
      volume: Math.round(volume),
    });

    price = close;
  }

  currentPrices[symbol] = price;
  return candles;
}

/**
 * Generate a new candlestick update (simulates real-time tick)
 */
export function generateNextCandle(
  symbol: Symbol,
  lastCandle: CandlestickData,
  timeframe: TimeFrame
): CandlestickData {
  const vol = volatility[symbol];
  const intervalMs = timeframeMinutes[timeframe] * 60 * 1000;
  
  const trend = (Math.random() - 0.48) * vol;
  const open = lastCandle.close;
  const close = open + trend + (Math.random() - 0.5) * vol;
  const high = Math.max(open, close) + Math.random() * vol * 0.5;
  const low = Math.min(open, close) - Math.random() * vol * 0.5;
  const volume = Math.random() * 1000 + 500;

  currentPrices[symbol] = close;

  return {
    time: Math.floor((lastCandle.time * 1000 + intervalMs) / 1000),
    open: parseFloat(open.toFixed(symbol.includes("JPY") ? 2 : 4)),
    high: parseFloat(high.toFixed(symbol.includes("JPY") ? 2 : 4)),
    low: parseFloat(low.toFixed(symbol.includes("JPY") ? 2 : 4)),
    close: parseFloat(close.toFixed(symbol.includes("JPY") ? 2 : 4)),
    volume: Math.round(volume),
  };
}

/**
 * Update the current candle (simulates intra-candle price movement)
 */
export function updateCurrentCandle(
  currentCandle: CandlestickData,
  symbol: Symbol
): CandlestickData {
  const vol = volatility[symbol];
  const priceDelta = (Math.random() - 0.5) * vol * 0.3;
  const newClose = currentCandle.close + priceDelta;
  const newHigh = Math.max(currentCandle.high, newClose);
  const newLow = Math.min(currentCandle.low, newClose);

  currentPrices[symbol] = newClose;

  return {
    ...currentCandle,
    close: parseFloat(newClose.toFixed(symbol.includes("JPY") ? 2 : 4)),
    high: parseFloat(newHigh.toFixed(symbol.includes("JPY") ? 2 : 4)),
    low: parseFloat(newLow.toFixed(symbol.includes("JPY") ? 2 : 4)),
  };
}

/**
 * Get current price for a symbol
 */
export function getCurrentPrice(symbol: Symbol): number {
  return currentPrices[symbol] || baseRates[symbol];
}

/**
 * Simulate bid/ask spread
 */
export function getBidAsk(symbol: Symbol): { bid: number; ask: number; spread: number } {
  const mid = getCurrentPrice(symbol);
  const spreadPips = symbol.includes("JPY") ? 0.02 : 0.0002;
  
  return {
    bid: parseFloat((mid - spreadPips / 2).toFixed(symbol.includes("JPY") ? 2 : 4)),
    ask: parseFloat((mid + spreadPips / 2).toFixed(symbol.includes("JPY") ? 2 : 4)),
    spread: spreadPips,
  };
}
