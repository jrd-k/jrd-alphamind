import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBroker } from "@/contexts/BrokerContext";
import { useTrading } from "@/contexts/TradingContext";
import { SYMBOLS } from "@/constants/trading";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const ManualTradePanel = () => {
  const { connection, accountInfo } = useBroker();
  const { executeTrade } = useTrading();
  const [symbol, setSymbol] = useState<string>("EUR/USD");
  const [lotSize, setLotSize] = useState("0.01");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const handleTrade = async (direction: "buy" | "sell") => {
    if (!connection?.isActive) {
      toast.error("No broker connected");
      return;
    }

    const lots = parseFloat(lotSize);
    if (isNaN(lots) || lots <= 0) {
      toast.error("Invalid lot size");
      return;
    }

    try {
      await executeTrade({
        symbol: symbol as any,
        type: direction,
        volume: lots,
        stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
        takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      });

      toast.success(`${direction.toUpperCase()} order placed for ${lots} lots of ${symbol}`);
      
      // Reset form
      setStopLoss("");
      setTakeProfit("");
    } catch (error) {
      toast.error("Failed to execute trade");
    }
  };

  const calculateRisk = () => {
    if (!accountInfo || !stopLoss) return null;
    const lots = parseFloat(lotSize);
    const sl = parseFloat(stopLoss);
    if (isNaN(lots) || isNaN(sl)) return null;
    
    const pipValue = 10; // Simplified
    const risk = lots * sl * pipValue;
    const riskPercent = (risk / accountInfo.balance) * 100;
    
    return { risk, riskPercent };
  };

  const riskCalc = calculateRisk();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Manual Trade</h3>
          <p className="text-sm text-muted-foreground">Execute trades directly</p>
        </div>

        {!connection?.isActive && (
          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <p className="text-sm text-amber-500">Connect a broker to trade</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger id="symbol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYMBOLS.map((sym) => (
                  <SelectItem key={sym} value={sym}>
                    {sym}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="lotSize">Lot Size</Label>
            <Input
              id="lotSize"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.01"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="stopLoss">Stop Loss (pips)</Label>
              <Input
                id="stopLoss"
                type="number"
                placeholder="20"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="takeProfit">Take Profit (pips)</Label>
              <Input
                id="takeProfit"
                type="number"
                placeholder="40"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
              />
            </div>
          </div>

          {riskCalc && (
            <div className="p-3 bg-muted/50 rounded-md text-sm">
              <p className="text-muted-foreground">
                Risk: ${riskCalc.risk.toFixed(2)} ({riskCalc.riskPercent.toFixed(2)}%)
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleTrade("buy")}
            disabled={!connection?.isActive}
            className="bg-bullish hover:bg-bullish/90"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            BUY
          </Button>
          <Button
            onClick={() => handleTrade("sell")}
            disabled={!connection?.isActive}
            className="bg-bearish hover:bg-bearish/90"
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            SELL
          </Button>
        </div>
      </div>
    </Card>
  );
};
