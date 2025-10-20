import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SafetySettings, Symbol } from "@/types/trading";
import { DEFAULT_SAFETY_SETTINGS } from "@/constants/trading";
import { executeTrade as executeTradeService } from "@/services/tradeExecutor";

interface TradeParams {
  symbol: Symbol;
  type: "buy" | "sell";
  volume: number;
  lotSize?: number;
  stopLoss?: number;
  takeProfit?: number;
}

interface TradingContextType {
  safetySettings: SafetySettings;
  setSafetySettings: (settings: SafetySettings) => void;
  isTradingEnabled: boolean;
  setIsTradingEnabled: (enabled: boolean) => void;
  emergencyStopActive: boolean;
  setEmergencyStopActive: (active: boolean) => void;
  executeTrade: (params: TradeParams) => Promise<void>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [safetySettings, setSafetySettings] = useState<SafetySettings>(() => {
    const saved = localStorage.getItem("safetySettings");
    return saved ? JSON.parse(saved) : DEFAULT_SAFETY_SETTINGS;
  });
  
  const [isTradingEnabled, setIsTradingEnabled] = useState(false);
  const [emergencyStopActive, setEmergencyStopActive] = useState(false);

  // Save safety settings to localStorage
  useEffect(() => {
    localStorage.setItem("safetySettings", JSON.stringify(safetySettings));
  }, [safetySettings]);

  const executeTrade = async (params: TradeParams) => {
    if (emergencyStopActive) {
      throw new Error("Emergency stop is active");
    }
    if (!isTradingEnabled) {
      throw new Error("Trading is disabled");
    }
    await executeTradeService({
      symbol: params.symbol,
      type: params.type,
      lotSize: params.volume,
      stopLoss: params.stopLoss,
      takeProfit: params.takeProfit,
    });
  };

  return (
    <TradingContext.Provider
      value={{
        safetySettings,
        setSafetySettings,
        isTradingEnabled,
        setIsTradingEnabled,
        emergencyStopActive,
        setEmergencyStopActive,
        executeTrade,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading must be used within TradingProvider");
  }
  return context;
}
