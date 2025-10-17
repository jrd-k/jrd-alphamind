import { CandlestickData } from "@/types/trading";

/**
 * Calculate Simple Moving Average (SMA)
 */
export function calculateSMA(data: CandlestickData[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0);
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  
  return result;
}

/**
 * Calculate Exponential Moving Average (EMA)
 */
export function calculateEMA(data: CandlestickData[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  const firstSum = data.slice(0, period).reduce((acc, candle) => acc + candle.close, 0);
  let ema = firstSum / period;
  result.push({ time: data[period - 1].time, value: ema });
  
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close - ema) * multiplier + ema;
    result.push({ time: data[i].time, value: ema });
  }
  
  return result;
}

/**
 * Calculate Relative Strength Index (RSI)
 */
export function calculateRSI(data: CandlestickData[], period: number = 14): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    result.push({
      time: data[i + 1].time,
      value: rsi,
    });
  }
  
  return result;
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export function calculateMACD(
  data: CandlestickData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): {
  macd: { time: number; value: number }[];
  signal: { time: number; value: number }[];
  histogram: { time: number; value: number; color: string }[];
} {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  const macdLine: { time: number; value: number }[] = [];
  
  for (let i = 0; i < slowEMA.length; i++) {
    const fastValue = fastEMA.find(f => f.time === slowEMA[i].time);
    if (fastValue) {
      macdLine.push({
        time: slowEMA[i].time,
        value: fastValue.value - slowEMA[i].value,
      });
    }
  }
  
  const signalLine = calculateEMAFromValues(macdLine, signalPeriod);
  
  const histogram: { time: number; value: number; color: string }[] = [];
  for (let i = 0; i < signalLine.length; i++) {
    const macdValue = macdLine.find(m => m.time === signalLine[i].time);
    if (macdValue) {
      const histValue = macdValue.value - signalLine[i].value;
      histogram.push({
        time: signalLine[i].time,
        value: histValue,
        color: histValue >= 0 ? "#10B981" : "#EF4444",
      });
    }
  }
  
  return { macd: macdLine, signal: signalLine, histogram };
}

function calculateEMAFromValues(data: { time: number; value: number }[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  const multiplier = 2 / (period + 1);
  
  const firstSum = data.slice(0, period).reduce((acc, item) => acc + item.value, 0);
  let ema = firstSum / period;
  result.push({ time: data[period - 1].time, value: ema });
  
  for (let i = period; i < data.length; i++) {
    ema = (data[i].value - ema) * multiplier + ema;
    result.push({ time: data[i].time, value: ema });
  }
  
  return result;
}

/**
 * Calculate Bollinger Bands
 */
export function calculateBollingerBands(
  data: CandlestickData[],
  period: number = 20,
  stdDev: number = 2
): {
  upper: { time: number; value: number }[];
  middle: { time: number; value: number }[];
  lower: { time: number; value: number }[];
} {
  const sma = calculateSMA(data, period);
  const upper: { time: number; value: number }[] = [];
  const lower: { time: number; value: number }[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((acc, candle) => acc + candle.close, 0) / period;
    const variance = slice.reduce((acc, candle) => acc + Math.pow(candle.close - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    
    const smaValue = sma.find(s => s.time === data[i].time);
    if (smaValue) {
      upper.push({ time: data[i].time, value: smaValue.value + (stdDev * std) });
      lower.push({ time: data[i].time, value: smaValue.value - (stdDev * std) });
    }
  }
  
  return { upper, middle: sma, lower };
}

/**
 * Calculate Stochastic Oscillator
 */
export function calculateStochastic(
  data: CandlestickData[],
  period: number = 14,
  smoothK: number = 3,
  smoothD: number = 3
): {
  k: { time: number; value: number }[];
  d: { time: number; value: number }[];
} {
  const rawK: { time: number; value: number }[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const high = Math.max(...slice.map(c => c.high));
    const low = Math.min(...slice.map(c => c.low));
    const close = data[i].close;
    
    const k = high === low ? 50 : ((close - low) / (high - low)) * 100;
    rawK.push({ time: data[i].time, value: k });
  }
  
  const smoothedK = calculateSMAFromValues(rawK, smoothK);
  const smoothedD = calculateSMAFromValues(smoothedK, smoothD);
  
  return { k: smoothedK, d: smoothedD };
}

function calculateSMAFromValues(data: { time: number; value: number }[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.value, 0);
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  
  return result;
}

/**
 * Calculate Average True Range (ATR)
 */
export function calculateATR(data: CandlestickData[], period: number = 14): { time: number; value: number }[] {
  const trueRanges: number[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trueRanges.push(tr);
  }
  
  const result: { time: number; value: number }[] = [];
  for (let i = period - 1; i < trueRanges.length; i++) {
    const atr = trueRanges.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    result.push({
      time: data[i + 1].time,
      value: atr,
    });
  }
  
  return result;
}
