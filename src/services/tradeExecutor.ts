import { Symbol, Trade, Position } from "@/types/trading";
import { getCurrentPrice } from "./marketData";
import { saveTradeToJournal } from "./tradeJournal";

export interface TradeParams {
  symbol: Symbol;
  type: "buy" | "sell";
  lotSize: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate trade parameters before execution
 */
export function validateTrade(params: TradeParams, accountBalance: number): ValidationResult {
  const errors: string[] = [];

  // Lot size validation
  if (params.lotSize < 0.01) {
    errors.push("Minimum lot size is 0.01");
  }
  if (params.lotSize > 10.0) {
    errors.push("Maximum lot size is 10.0");
  }

  // Stop loss validation
  if (params.stopLoss !== undefined) {
    const currentPrice = getCurrentPrice(params.symbol);
    if (params.type === "buy" && params.stopLoss >= currentPrice) {
      errors.push("Stop loss must be below entry price for buy orders");
    }
    if (params.type === "sell" && params.stopLoss <= currentPrice) {
      errors.push("Stop loss must be above entry price for sell orders");
    }
  }

  // Take profit validation
  if (params.takeProfit !== undefined) {
    const currentPrice = getCurrentPrice(params.symbol);
    if (params.type === "buy" && params.takeProfit <= currentPrice) {
      errors.push("Take profit must be above entry price for buy orders");
    }
    if (params.type === "sell" && params.takeProfit >= currentPrice) {
      errors.push("Take profit must be below entry price for sell orders");
    }
  }

  // Margin requirement check (simplified)
  const requiredMargin = calculateMargin(params.lotSize, params.symbol);
  if (requiredMargin > accountBalance * 0.5) {
    errors.push("Insufficient margin. Trade requires too much of your account balance.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate position size based on risk percentage
 */
export function calculatePositionSize(
  symbol: Symbol,
  riskPercent: number,
  accountBalance: number,
  stopLossPips: number
): number {
  const riskAmount = accountBalance * (riskPercent / 100);
  const pipValue = symbol.includes("JPY") ? 0.01 : 0.0001;
  const contractSize = 100000; // Standard lot
  
  const lotSize = riskAmount / (stopLossPips * pipValue * contractSize);
  return parseFloat(Math.min(lotSize, 10.0).toFixed(2));
}

/**
 * Calculate required margin for a position
 */
export function calculateMargin(lotSize: number, symbol: Symbol): number {
  const contractSize = 100000; // Standard lot
  const leverage = 100; // 1:100 leverage
  const price = getCurrentPrice(symbol);
  
  return (lotSize * contractSize * price) / leverage;
}

/**
 * Calculate potential profit/loss
 */
export function calculatePL(
  entryPrice: number,
  currentPrice: number,
  lotSize: number,
  type: "buy" | "sell",
  symbol: Symbol
): number {
  const contractSize = 100000;
  const priceDiff = type === "buy" 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  return priceDiff * lotSize * contractSize;
}

/**
 * Calculate risk/reward ratio
 */
export function calculateRiskReward(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  type: "buy" | "sell"
): number {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  
  if (risk === 0) return 0;
  return reward / risk;
}

/**
 * Execute a trade (demo mode - mock execution)
 */
export async function executeTrade(params: TradeParams): Promise<Trade> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const currentPrice = getCurrentPrice(params.symbol);
  
  // Mock trade object
  const trade: Trade = {
    id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    symbol: params.symbol,
    type: params.type,
    lotSize: params.lotSize,
    entryPrice: currentPrice,
    stopLoss: params.stopLoss,
    takeProfit: params.takeProfit,
    openTime: new Date(),
    status: "open",
  };

  // Log to trade journal
  saveTradeToJournal({
    id: trade.id,
    date: new Date().toLocaleString(),
    timestamp: Date.now(),
    symbol: params.symbol,
    type: params.type,
    entryPrice: currentPrice,
    lotSize: params.lotSize,
    stopLoss: params.stopLoss,
    takeProfit: params.takeProfit,
    layers: 1,
    status: "open",
  });

  // In production, this would call Supabase edge function
  // Example: await supabase.functions.invoke('execute-trade', { body: params })

  return trade;
}

/**
 * Close a position
 */
export async function closePosition(positionId: string): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In production: await supabase.functions.invoke('close-position', { body: { positionId } })
  console.log(`Closing position ${positionId}`);
}

/**
 * Modify stop loss / take profit
 */
export async function modifyPosition(
  positionId: string,
  stopLoss?: number,
  takeProfit?: number
): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In production: await supabase.functions.invoke('modify-position', { 
  //   body: { positionId, stopLoss, takeProfit } 
  // })
  console.log(`Modifying position ${positionId}`, { stopLoss, takeProfit });
}

/**
 * Close all open positions (emergency stop)
 */
export async function closeAllPositions(): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In production: await supabase.functions.invoke('close-all-positions')
  console.log("Closing all positions");
}
