import { createContext, useContext, useState, ReactNode } from "react";
import { Symbol, TimeFrame, CandlestickData } from "@/types/trading";

interface ChartContextType {
  selectedSymbol: Symbol;
  setSelectedSymbol: (symbol: Symbol) => void;
  selectedTimeframe: TimeFrame;
  setSelectedTimeframe: (timeframe: TimeFrame) => void;
  chartType: "regular" | "heikinashi";
  setChartType: (type: "regular" | "heikinashi") => void;
  isRealTimeEnabled: boolean;
  setIsRealTimeEnabled: (enabled: boolean) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export function ChartProvider({ children }: { children: ReactNode }) {
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>("EUR/USD");
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>("15m");
  const [chartType, setChartType] = useState<"regular" | "heikinashi">("regular");
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  return (
    <ChartContext.Provider
      value={{
        selectedSymbol,
        setSelectedSymbol,
        selectedTimeframe,
        setSelectedTimeframe,
        chartType,
        setChartType,
        isRealTimeEnabled,
        setIsRealTimeEnabled,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
}

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within ChartProvider");
  }
  return context;
}
