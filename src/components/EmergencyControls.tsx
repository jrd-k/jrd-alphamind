import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useBroker } from "@/contexts/BrokerContext";
import { useTrading } from "@/contexts/TradingContext";
import { AlertTriangle, Power, Link2Off } from "lucide-react";
import { toast } from "sonner";

export const EmergencyControls = () => {
  const { connection, setConnection } = useBroker();
  const { setEmergencyStopActive, setIsTradingEnabled } = useTrading();
  const [isStoppingAll, setIsStoppingAll] = useState(false);

  const handleEmergencyStop = async () => {
    setIsStoppingAll(true);
    
    // Simulate closing all positions
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEmergencyStopActive(true);
    setIsTradingEnabled(false);
    setIsStoppingAll(false);
    
    toast.error("EMERGENCY STOP ACTIVATED - All trading halted", {
      duration: 10000,
    });
  };

  const handleDisconnect = () => {
    setConnection(null);
    setIsTradingEnabled(false);
    toast.success("Broker disconnected");
  };

  return (
    <Card className="p-6 border-bearish/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-bearish" />
          <h3 className="text-lg font-semibold text-foreground">Emergency Controls</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Use these controls to immediately stop all trading activity
        </p>

        <div className="space-y-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full bg-bearish hover:bg-bearish/90"
                disabled={!connection?.isActive || isStoppingAll}
              >
                <Power className="h-4 w-4 mr-2" />
                {isStoppingAll ? "STOPPING..." : "STOP ALL TRADING"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emergency Stop Trading?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Close all open positions at market price</li>
                    <li>Cancel all pending orders</li>
                    <li>Disable automated trading</li>
                    <li>Require manual re-activation</li>
                  </ul>
                  <p className="mt-3 font-semibold text-bearish">
                    This action cannot be undone. Are you sure?
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEmergencyStop}
                  className="bg-bearish hover:bg-bearish/90"
                >
                  Confirm Emergency Stop
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
                disabled={!connection?.isActive}
              >
                <Link2Off className="h-4 w-4 mr-2" />
                Disconnect Broker
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Broker?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will disconnect your broker account. All automated trading will stop.
                  Open positions will remain but cannot be managed through this app until you reconnect.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDisconnect}>
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
          <p className="text-xs text-amber-600 dark:text-amber-500">
            <strong>Warning:</strong> Emergency stop should only be used in critical situations.
            Normal position management should be done through the positions panel.
          </p>
        </div>
      </div>
    </Card>
  );
};
