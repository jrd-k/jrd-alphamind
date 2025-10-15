import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Settings2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export const BotControls = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [autoTrade, setAutoTrade] = useState(true);
  const [riskLevel, setRiskLevel] = useState([2]);
  const [maxLayers, setMaxLayers] = useState([6]);

  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Bot Controls</h3>
          <Badge 
            variant="outline" 
            className={isRunning 
              ? "bg-bullish/10 text-bullish border-bullish/20" 
              : "bg-bearish/10 text-bearish border-bearish/20"
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Auto Trading</Label>
              <p className="text-xs text-muted-foreground">Enable automatic trade execution</p>
            </div>
            <Switch checked={autoTrade} onCheckedChange={setAutoTrade} />
          </div>

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
