import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useBroker } from "@/contexts/BrokerContext";
import { SYMBOLS, DEMO_BALANCE_OPTIONS } from "@/constants/trading";
import { CheckCircle } from "lucide-react";
import { DemoAccountConfig } from "@/types/trading";

export const DemoConnect = () => {
  const { setConnection, setAccountInfo } = useBroker();
  const [config, setConfig] = useState<DemoAccountConfig>({
    startingBalance: 10000,
    riskTolerance: "medium",
    preferredPairs: ["EUR/USD", "GBP/USD"],
  });

  const handleActivate = () => {
    setConnection({
      id: `demo_${Date.now()}`,
      brokerType: "demo",
      accountId: `DEMO-${Date.now()}`,
      isActive: true,
      isDemo: true,
      lastConnected: new Date(),
    });

    setAccountInfo({
      balance: config.startingBalance,
      equity: config.startingBalance,
      margin: 0,
      freeMargin: config.startingBalance,
      marginLevel: 0,
      profit: 0,
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Demo Account Setup
          </h3>
          <p className="text-sm text-muted-foreground">
            Practice trading with simulated funds. No real money involved.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="balance">Starting Balance</Label>
            <Select
              value={config.startingBalance.toString()}
              onValueChange={(value) =>
                setConfig({ ...config, startingBalance: parseInt(value) })
              }
            >
              <SelectTrigger id="balance">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEMO_BALANCE_OPTIONS.map((amount) => (
                  <SelectItem key={amount} value={amount.toString()}>
                    ${amount.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="risk">Risk Tolerance</Label>
            <Select
              value={config.riskTolerance}
              onValueChange={(value: "low" | "medium" | "high") =>
                setConfig({ ...config, riskTolerance: value })
              }
            >
              <SelectTrigger id="risk">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Conservative (1% risk)</SelectItem>
                <SelectItem value="medium">Moderate (2% risk)</SelectItem>
                <SelectItem value="high">Aggressive (5% risk)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 bg-bullish/10 border border-bullish/20 rounded-md">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-bullish mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-bullish mb-1">Perfect for testing</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Test strategies risk-free</li>
                <li>• Same features as live accounts</li>
                <li>• Real-time market data</li>
                <li>• Switch to live anytime</li>
              </ul>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={handleActivate}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Activate Demo Account
        </Button>
      </div>
    </Card>
  );
};
