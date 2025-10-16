import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SafetySettings } from "@/types/trading";
import { DEFAULT_SAFETY_SETTINGS } from "@/constants/trading";

interface TradingContextType {
  safetySettings: SafetySettings;
  setSafetySettings: (settings: SafetySettings) => void;
  isTradingEnabled: boolean;
  setIsTradingEnabled: (enabled: boolean) => void;
  emergencyStopActive: boolean;
  setEmergencyStopActive: (active: boolean) => void;
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

  return (
    <TradingContext.Provider
      value={{
        safetySettings,
        setSafetySettings,
        isTradingEnabled,
        setIsTradingEnabled,
        emergencyStopActive,
        setEmergencyStopActive,
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
