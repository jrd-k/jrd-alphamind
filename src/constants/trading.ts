import { Symbol, TimeFrame, SafetySettings } from "@/types/trading";

export const SYMBOLS: Symbol[] = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "AUD/USD",
  "USD/CHF",
  "EUR/JPY",
  "GBP/JPY",
  "EUR/GBP",
];

export const TIMEFRAMES: { value: TimeFrame; label: string }[] = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1D", label: "1 Day" },
];

export const DEFAULT_SAFETY_SETTINGS: SafetySettings = {
  dailyLossLimit: 500,
  maxPositionSize: 1.0,
  maxConcurrentTrades: 5,
  maxRiskPerTrade: 2,
  tradingHoursEnabled: false,
  newsFilterEnabled: true,
};

export const POSITION_SIZE_LIMITS = {
  min: 0.01,
  max: 10.0,
  step: 0.01,
};

export const DEMO_BALANCE_OPTIONS = [5000, 10000, 25000, 50000];

export const BROKER_CONFIGS = {
  metatrader: {
    name: "MetaTrader 4/5",
    description: "Most popular forex platform",
    features: ["Expert Advisors", "Custom Indicators", "Automated Trading"],
    difficulty: "Intermediate",
  },
  oanda: {
    name: "OANDA",
    description: "Direct REST API integration",
    features: ["Low Spreads", "Advanced Charting", "Risk Management"],
    difficulty: "Easy",
  },
  ib: {
    name: "Interactive Brokers",
    description: "For stocks, options & forex",
    features: ["Multi-Asset", "Low Fees", "Advanced Orders"],
    difficulty: "Advanced",
  },
  demo: {
    name: "Demo Account",
    description: "Paper trading simulation",
    features: ["Risk-Free", "Instant Setup", "Full Features"],
    difficulty: "Beginner",
  },
};
