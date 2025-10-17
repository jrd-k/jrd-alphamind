import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useBroker } from "@/contexts/BrokerContext";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ExnessCredentials {
  apiKey: string;
  apiSecret: string;
  accountId: string;
  isDemo: boolean;
}

export const ExnessConnect = () => {
  const { setConnection, setAccountInfo } = useBroker();
  const [credentials, setCredentials] = useState<ExnessCredentials>({
    apiKey: "",
    apiSecret: "",
    accountId: "",
    isDemo: true,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);

    if (!credentials.apiKey || !credentials.apiSecret || !credentials.accountId) {
      setError("Please fill in all required fields");
      setIsConnecting(false);
      return;
    }

    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    setConnection({
      id: `exness_${Date.now()}`,
      brokerType: "exness",
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
            Exness Connection
          </h3>
          <p className="text-sm text-muted-foreground">
            Connect your Exness account via API. Get your credentials from{" "}
            <a
              href="https://www.exness.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              exness.com
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
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Exness API key"
              value={credentials.apiKey}
              onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="apiSecret">API Secret *</Label>
            <Input
              id="apiSecret"
              type="password"
              placeholder="Enter your API secret"
              value={credentials.apiSecret}
              onChange={(e) => setCredentials({ ...credentials, apiSecret: e.target.value })}
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
              Connect Exness
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
