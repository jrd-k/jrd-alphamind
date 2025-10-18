export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  symbol: string;
  type: "buy" | "sell";
  entryPrice: number;
  exitPrice?: number;
  lotSize: number;
  stopLoss?: number;
  takeProfit?: number;
  pips?: number;
  profit?: number;
  profitPercent?: number;
  layers: number;
  duration?: string;
  strategy?: string;
  status: "open" | "closed" | "cancelled";
  notes?: string;
  broker?: string;
}

export interface JournalStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
}
