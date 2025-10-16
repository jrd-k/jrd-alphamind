import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useBroker } from "@/contexts/BrokerContext";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { OandaCredentials } from "@/types/trading";

export const OandaConnect = () => {
  const { setConnection, setAccountInfo } = useBroker();
  const [credentials, setCredentials] = useState<OandaCredentials>({
    apiToken: "",
    accountId: "",
    environment: "practice",
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);

    if (!credentials.apiToken || !credentials.accountId) {
      setError("Please fill in all required fields");
      setIsConnecting(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    setConnection({
      id: `oanda_${Date.now()}`,
      brokerType: "oanda",
      accountId: credentials.accountId,
      isActive: true,
      isDemo: credentials.environment === "practice",
      lastConnected: new Date(),
    });

    setAccountInfo({
      balance: credentials.environment === "practice" ? 100000 : 12420.75,
      equity: credentials.environment === "practice" ? 100234.50 : 12654.25,
      margin: 1250.00,
      freeMargin: credentials.environment === "practice" ? 98984.50 : 11404.25,
      marginLevel: 8018.8,
      profit: 234.50,
    });

    setIsConnecting(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            OANDA Connection
          </h3>
          <p className="text-sm text-muted-foreground">
            Connect your OANDA account. Get API token from{" "}
            <a
              href="https://www.oanda.com/account/tpa/personal_token"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OANDA settings
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
            <Label htmlFor="apiToken">API Token *</Label>
            <Input
              id="apiToken"
              type="password"
              placeholder="Enter your OANDA API token"
              value={credentials.apiToken}
              onChange={(e) => setCredentials({ ...credentials, apiToken: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="accountId">Account ID *</Label>
            <Input
              id="accountId"
              placeholder="e.g., 001-004-1234567-001"
              value={credentials.accountId}
              onChange={(e) => setCredentials({ ...credentials, accountId: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="environment">Environment</Label>
            <Select
              value={credentials.environment}
              onValueChange={(value: "practice" | "live") =>
                setCredentials({ ...credentials, environment: value })
              }
            >
              <SelectTrigger id="environment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="practice">Practice (Demo)</SelectItem>
                <SelectItem value="live">Live Trading</SelectItem>
              </SelectContent>
            </Select>
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
              Connect OANDA
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
