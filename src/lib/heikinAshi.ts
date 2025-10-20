import { CandlestickData, HeikinAshiCandle } from "@/types/trading";

/**
 * Converts regular OHLC candlestick data to Heikin Ashi candles
 * 
 * Heikin Ashi formulas:
 * - HA-Close = (Open + High + Low + Close) / 4
 * - HA-Open = (Previous HA-Open + Previous HA-Close) / 2
 * - HA-High = Max(High, HA-Open, HA-Close)
 * - HA-Low = Min(Low, HA-Open, HA-Close)
 */
export function convertToHeikinAshi(candles: CandlestickData[]): HeikinAshiCandle[] {
  if (candles.length === 0) return [];

  const haCandles: HeikinAshiCandle[] = [];
  
  // First candle: use regular OHLC
  const firstCandle = candles[0];
  const firstHA: HeikinAshiCandle = {
    time: firstCandle.time,
    open: (firstCandle.open + firstCandle.close) / 2,
    high: firstCandle.high,
    low: firstCandle.low,
    close: (firstCandle.open + firstCandle.high + firstCandle.low + firstCandle.close) / 4,
  };
  haCandles.push(firstHA);

  // Calculate subsequent candles
  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const prevHA = haCandles[i - 1];

    const haClose = (current.open + current.high + current.low + current.close) / 4;
    const haOpen = (prevHA.open + prevHA.close) / 2;
    const haHigh = Math.max(current.high, haOpen, haClose);
    const haLow = Math.min(current.low, haOpen, haClose);

    haCandles.push({
      time: current.time,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });
  }

  return haCandles;
}

/**
 * Checks if a Heikin Ashi candle is bullish
 */
export function isHeikinAshiBullish(candle: HeikinAshiCandle): boolean {
  return candle.close > candle.open;
}

/**
 * Checks if a Heikin Ashi candle has a strong trend
 * (small or no lower/upper shadow)
 */
export function hasStrongTrend(candle: HeikinAshiCandle): boolean {
  const body = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  
  if (totalRange === 0) return false;
  
  const bodyPercentage = body / totalRange;
  return bodyPercentage > 0.8; // Body is more than 80% of total range
}
