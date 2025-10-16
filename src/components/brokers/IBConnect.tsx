import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useBroker } from "@/contexts/BrokerContext";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { IBCredentials } from "@/types/trading";

export const IBConnect = () => {
  const { setConnection, setAccountInfo } = useBroker();
  const [credentials, setCredentials] = useState<IBCredentials>({
    clientId: "",
    username: "",
    accountId: "",
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);

    if (!credentials.clientId || !credentials.username || !credentials.accountId) {
      setError("Please fill in all required fields");
      setIsConnecting(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    setConnection({
      id: `ib_${Date.now()}`,
      brokerType: "ib",
      accountId: credentials.accountId,
      isActive: true,
      isDemo: false,
      lastConnected: new Date(),
    });

    setAccountInfo({
      balance: 25840.90,
      equity: 26125.45,
      margin: 2580.00,
      freeMargin: 23545.45,
      marginLevel: 1012.3,
      profit: 284.55,
    });

    setIsConnecting(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Interactive Brokers Connection
          </h3>
          <p className="text-sm text-muted-foreground">
            Connect to Interactive Brokers. Requires TWS or IB Gateway running.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-bearish/10 border border-bearish/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-bearish" />
            <p className="text-sm text-bearish">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <Label htmlFor="clientId">Client ID *</Label>
            <Input
              id="clientId"
              placeholder="Enter client ID (usually 0)"
              value={credentials.clientId}
              onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="IB username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="accountId">Account ID *</Label>
            <Input
              id="accountId"
              placeholder="e.g., U1234567"
              value={credentials.accountId}
              onChange={(e) => setCredentials({ ...credentials, accountId: e.target.value })}
            />
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            Note: Ensure TWS or IB Gateway is running with API connections enabled (port 7497 for paper trading, 7496 for live).
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Connect Interactive Brokers
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
