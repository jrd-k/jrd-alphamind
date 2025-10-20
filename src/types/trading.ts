export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface HeikinAshiCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type TimeFrame = "1m" | "5m" | "15m" | "1h" | "4h" | "1D";

export type Symbol = "EUR/USD" | "GBP/USD" | "USD/JPY" | "AUD/USD" | "USD/CHF" | "EUR/JPY" | "GBP/JPY" | "EUR/GBP";

export type BrokerType = "metatrader" | "exness" | "justmarkets" | "demo";

export interface BrokerConnection {
  id: string;
  brokerType: BrokerType;
  accountId: string;
  isActive: boolean;
  isDemo: boolean;
  lastConnected?: Date;
  balance?: number;
}

export interface Trade {
  id: string;
  symbol: Symbol;
  type: "buy" | "sell";
  lotSize: number;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openTime: Date;
  closeTime?: Date;
  profit?: number;
  status: "open" | "closed" | "pending";
}

export interface Position {
  id: string;
  symbol: Symbol;
  type: "buy" | "sell";
  lotSize: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openTime: Date;
  unrealizedPL: number;
  realizedPL?: number;
}

export interface TradeSignal {
  id: string;
  symbol: Symbol;
  type: "buy" | "sell";
  confidence: number;
  timestamp: Date;
  executed: boolean;
  reason?: string;
}

export interface SafetySettings {
  dailyLossLimit: number;
  maxPositionSize: number;
  maxConcurrentTrades: number;
  maxRiskPerTrade: number;
  tradingHoursEnabled: boolean;
  tradingHoursStart?: string;
  tradingHoursEnd?: string;
  newsFilterEnabled: boolean;
}

export interface AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  profit: number;
}

export interface MetaTraderCredentials {
  token: string;
  accountId: string;
  server: string;
  isDemo: boolean;
}

export interface ExnessCredentials {
  apiKey: string;
  apiSecret: string;
  accountId: string;
  isDemo: boolean;
}

export interface JustMarketsCredentials {
  apiToken: string;
  accountId: string;
  isDemo: boolean;
}

export interface DemoAccountConfig {
  startingBalance: number;
  riskTolerance: "low" | "medium" | "high";
  preferredPairs: Symbol[];
}
