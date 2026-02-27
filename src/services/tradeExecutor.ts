import { Symbol, Trade, Position } from "@/types/trading";
import { getCachedCurrentPrice } from "./marketData";
import { api } from "./api";

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
 * Execute a trade using the backend API
 */
export async function executeTrade(params: TradeParams): Promise<Trade> {
  try {
    // Get current price for the trade
    const currentPrice = await getCachedCurrentPrice(params.symbol);

    // Convert frontend params to backend format; backend determines side via brain signal
    const lotSize = params.lotSize;

    // Calculate stop loss in pips if provided
    let stopLossPips: number | undefined;
    if (params.stopLoss !== undefined) {
      const pipValue = params.symbol.includes("JPY") ? 0.01 : 0.0001;
      const stopLossDiff = Math.abs(currentPrice - params.stopLoss);
      stopLossPips = stopLossDiff / pipValue;
    }

    // Call backend API to place order
    const orderResult = await api.placeOrder({
      symbol: params.symbol,
      quantity: lotSize,
      current_price: currentPrice,
      stop_loss_pips: stopLossPips,
      // indicators can be added later if needed
    });

    // Convert backend response to frontend Trade format
    const trade: Trade = {
      id: `trade_${orderResult.id}`,
      symbol: params.symbol,
      type: params.type,
      lotSize: Math.abs(quantity),
      entryPrice: currentPrice,
      stopLoss: params.stopLoss,
      takeProfit: params.takeProfit,
      openTime: new Date(orderResult.created_at || Date.now()),
      status: orderResult.status === "filled" ? "open" : "pending",
    };

    return trade;
  } catch (error) {
    console.error('Failed to execute trade:', error);
    throw new Error(`Trade execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Close a position (placeholder - needs backend endpoint)
 */
export async function closePosition(positionId: string): Promise<void> {
  try {
    // TODO: Implement close position endpoint in backend
    // For now, this is a placeholder
    console.log(`Closing position ${positionId}`);

    // When backend endpoint is available, uncomment:
    // await api.closePosition(positionId);
  } catch (error) {
    console.error('Failed to close position:', error);
    throw new Error(`Failed to close position: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Modify stop loss / take profit (placeholder - needs backend endpoint)
 */
export async function modifyPosition(
  positionId: string,
  stopLoss?: number,
  takeProfit?: number
): Promise<void> {
  try {
    // TODO: Implement modify position endpoint in backend
    // For now, this is a placeholder
    console.log(`Modifying position ${positionId}`, { stopLoss, takeProfit });

    // When backend endpoint is available, uncomment:
    // await api.modifyPosition(positionId, { stopLoss, takeProfit });
  } catch (error) {
    console.error('Failed to modify position:', error);
    throw new Error(`Failed to modify position: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Close all open positions (placeholder - needs backend endpoint)
 */
export async function closeAllPositions(): Promise<void> {
  try {
    // TODO: Implement close all positions endpoint in backend
    // For now, this is a placeholder
    console.log("Closing all positions");

    // When backend endpoint is available, uncomment:
    // await api.closeAllPositions();
  } catch (error) {
    console.error('Failed to close all positions:', error);
    throw new Error(`Failed to close all positions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
