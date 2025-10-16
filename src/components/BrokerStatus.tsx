import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBroker } from "@/contexts/BrokerContext";
import { BROKER_CONFIGS } from "@/constants/trading";
import { CheckCircle, XCircle, AlertCircle, LogOut } from "lucide-react";

export const BrokerStatus = () => {
  const { connection, accountInfo, setConnection, setAccountInfo } = useBroker();

  if (!connection) {
    return (
      <Card className="p-4 border-dashed">
        <div className="text-center py-6">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No broker connected</p>
          <Button variant="outline" size="sm" asChild>
            <a href="/broker-connect">Connect Broker</a>
          </Button>
        </div>
      </Card>
    );
  }

  const brokerConfig = BROKER_CONFIGS[connection.brokerType];

  const handleDisconnect = () => {
    setConnection(null);
    setAccountInfo(null);
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {brokerConfig.name}
              {connection.isActive ? (
                <CheckCircle className="h-4 w-4 text-bullish" />
              ) : (
                <XCircle className="h-4 w-4 text-bearish" />
              )}
            </h3>
            <p className="text-xs text-muted-foreground">{connection.accountId}</p>
          </div>
          <Badge variant={connection.isDemo ? "outline" : "default"}>
            {connection.isDemo ? "Demo" : "Live"}
          </Badge>
        </div>

        {accountInfo && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="text-sm font-semibold text-foreground">
                ${accountInfo.balance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Equity</p>
              <p className="text-sm font-semibold text-foreground">
                ${accountInfo.equity.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">P/L</p>
              <p className={`text-sm font-semibold ${accountInfo.profit >= 0 ? "text-bullish" : "text-bearish"}`}>
                {accountInfo.profit >= 0 ? "+" : ""}${accountInfo.profit.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Margin</p>
              <p className="text-sm font-semibold text-foreground">
                {accountInfo.marginLevel.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleDisconnect}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>

        {connection.lastConnected && (
          <p className="text-xs text-center text-muted-foreground">
            Last connected: {new Date(connection.lastConnected).toLocaleString()}
          </p>
        )}
      </div>
    </Card>
  );
};
