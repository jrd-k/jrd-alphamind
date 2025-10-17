import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Play, Pause, RotateCcw, Settings2, AlertTriangle, Zap } from "lucide-react";
import { useState } from "react";
import { useBroker } from "@/contexts/BrokerContext";
import { useTrading } from "@/contexts/TradingContext";
import { toast } from "sonner";

export const BotControls = () => {
  const { connection } = useBroker();
  const { isTradingEnabled, setIsTradingEnabled } = useTrading();
  const [isRunning, setIsRunning] = useState(true);
  const [riskLevel, setRiskLevel] = useState([2]);
  const [maxLayers, setMaxLayers] = useState([6]);

  const handleAutoTradeToggle = (checked: boolean) => {
    if (checked && !connection?.isActive) {
      toast.error("Connect a broker first");
      return;
    }
    if (checked) {
      toast.success("Auto-execute enabled - trades will execute automatically");
    }
    setIsTradingEnabled(checked);
  };

  return (
    <Card className="p-6 bg-card border-border shadow-card hover:border-primary/30 transition-all duration-300">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Bot Controls</h3>
            <p className="text-xs text-muted-foreground mt-1">Manage trading bot</p>
          </div>
          <Badge 
            variant="outline" 
            className={isRunning 
              ? "bg-bullish/10 text-bullish border-bullish/30 font-semibold px-3 py-1" 
              : "bg-bearish/10 text-bearish border-bearish/30 font-semibold px-3 py-1"
            }
          >
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning 
              ? "bg-bearish hover:bg-bearish/90" 
              : "bg-bullish hover:bg-bullish/90"
            }
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Bot
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Bot
              </>
            )}
          </Button>
          <Button variant="outline" className="text-foreground border-border hover:bg-muted">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          {connection?.isActive && (
            <AlertDialog>
              <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-md">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <Label className="text-foreground font-semibold">Auto-Execute Trades</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isTradingEnabled ? "Bot will execute trades automatically" : "Manual confirmation required"}
                  </p>
                </div>
                {isTradingEnabled ? (
                  <Switch checked={isTradingEnabled} onCheckedChange={handleAutoTradeToggle} />
                ) : (
                  <AlertDialogTrigger asChild>
                    <Switch checked={false} onCheckedChange={() => {}} />
                  </AlertDialogTrigger>
                )}
              </div>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Enable Auto-Trading?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>When enabled, the bot will automatically execute trades on your {connection.isDemo ? "demo" : "live"} account.</p>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-foreground">Safety Checklist:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Safety limits are configured</li>
                        <li>Risk per trade is set appropriately</li>
                        <li>You understand trades execute automatically</li>
                        {!connection.isDemo && <li className="text-amber-600">⚠️ Trading with REAL money</li>}
                      </ul>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAutoTradeToggle(true)}>
                    Enable Auto-Trading
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Risk Per Trade</Label>
              <span className="text-sm font-medium text-primary">{riskLevel[0]}%</span>
            </div>
            <Slider
              value={riskLevel}
              onValueChange={setRiskLevel}
              max={5}
              step={0.5}
              className="w-full"
              aria-label={`Risk per trade: ${riskLevel[0]}%`}
            />
            <p className="text-xs text-muted-foreground">Recommended: 1-2%</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Max Layers Per Pair</Label>
              <span className="text-sm font-medium text-primary">{maxLayers[0]}</span>
            </div>
            <Slider
              value={maxLayers}
              onValueChange={setMaxLayers}
              max={6}
              min={1}
              step={1}
              className="w-full"
              aria-label={`Maximum layers per pair: ${maxLayers[0]}`}
            />
          </div>
        </div>

        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-warning">Safety Mode Active</p>
              <p className="text-xs text-muted-foreground">
                Bot will pause trading during high-impact news events
              </p>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full text-foreground border-border hover:bg-muted">
          <Settings2 className="h-4 w-4 mr-2" />
          Advanced Settings
        </Button>
      </div>
    </Card>
  );
};
