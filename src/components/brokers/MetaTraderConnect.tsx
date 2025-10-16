import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useBroker } from "@/contexts/BrokerContext";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { MetaTraderCredentials } from "@/types/trading";

export const MetaTraderConnect = () => {
  const { setConnection, setAccountInfo } = useBroker();
  const [credentials, setCredentials] = useState<MetaTraderCredentials>({
    token: "",
    accountId: "",
    server: "",
    isDemo: true,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);

    // Validate inputs
    if (!credentials.token || !credentials.accountId || !credentials.server) {
      setError("Please fill in all required fields");
      setIsConnecting(false);
      return;
    }

    // Simulate connection (in production, call Supabase edge function)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful connection
    setConnection({
      id: `mt_${Date.now()}`,
      brokerType: "metatrader",
      accountId: credentials.accountId,
      isActive: true,
      isDemo: credentials.isDemo,
      lastConnected: new Date(),
    });

    setAccountInfo({
      balance: credentials.isDemo ? 10000 : 5420.50,
      equity: credentials.isDemo ? 10127.35 : 5547.85,
      margin: 543.20,
      freeMargin: credentials.isDemo ? 9584.15 : 5004.65,
      marginLevel: 1864.5,
      profit: 127.35,
    });

    setIsConnecting(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            MetaTrader 4/5 Connection
          </h3>
          <p className="text-sm text-muted-foreground">
            Connect via MetaAPI. Get your token at{" "}
            <a
              href="https://metaapi.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              metaapi.cloud
            </a>
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
            <Label htmlFor="token">MetaAPI Token *</Label>
            <Input
              id="token"
              type="password"
              placeholder="Enter your MetaAPI token"
              value={credentials.token}
              onChange={(e) => setCredentials({ ...credentials, token: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="accountId">Account ID *</Label>
            <Input
              id="accountId"
              placeholder="e.g., 12345678"
              value={credentials.accountId}
              onChange={(e) => setCredentials({ ...credentials, accountId: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="server">Server *</Label>
            <Input
              id="server"
              placeholder="e.g., ICMarkets-Demo02"
              value={credentials.server}
              onChange={(e) => setCredentials({ ...credentials, server: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <Label htmlFor="isDemo">Demo Account</Label>
            <Switch
              id="isDemo"
              checked={credentials.isDemo}
              onCheckedChange={(checked) => setCredentials({ ...credentials, isDemo: checked })}
            />
          </div>
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
              Connect MetaTrader
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
