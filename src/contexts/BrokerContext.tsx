import { createContext, useContext, useState, ReactNode } from "react";
import { BrokerConnection, AccountInfo, Position } from "@/types/trading";

interface BrokerContextType {
  connection: BrokerConnection | null;
  setConnection: (connection: BrokerConnection | null) => void;
  accountInfo: AccountInfo | null;
  setAccountInfo: (info: AccountInfo | null) => void;
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  isAutoTradeEnabled: boolean;
  setIsAutoTradeEnabled: (enabled: boolean) => void;
  connectionError: string | null;
  setConnectionError: (error: string | null) => void;
}

const BrokerContext = createContext<BrokerContextType | undefined>(undefined);

export function BrokerProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<BrokerConnection | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isAutoTradeEnabled, setIsAutoTradeEnabled] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  return (
    <BrokerContext.Provider
      value={{
        connection,
        setConnection,
        accountInfo,
        setAccountInfo,
        positions,
        setPositions,
        isAutoTradeEnabled,
        setIsAutoTradeEnabled,
        connectionError,
        setConnectionError,
      }}
    >
      {children}
    </BrokerContext.Provider>
  );
}

export function useBroker() {
  const context = useContext(BrokerContext);
  if (!context) {
    throw new Error("useBroker must be used within BrokerProvider");
  }
  return context;
}
