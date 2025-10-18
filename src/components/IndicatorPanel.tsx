import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Activity, BarChart3, Waves } from "lucide-react";

interface IndicatorPanelProps {
  indicators: {
    sma: boolean;
    ema: boolean;
    rsi: boolean;
    macd: boolean;
    bollinger: boolean;
    stochastic: boolean;
  };
  onToggleIndicator: (indicator: keyof IndicatorPanelProps["indicators"]) => void;
  smaPeriod: number;
  emaPeriod: number;
  onSMAPeriodChange: (period: number) => void;
  onEMAPeriodChange: (period: number) => void;
}

export const IndicatorPanel = ({
  indicators,
  onToggleIndicator,
  smaPeriod,
  emaPeriod,
  onSMAPeriodChange,
  onEMAPeriodChange,
}: IndicatorPanelProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Technical Indicators
          </h3>
        </div>

        <div className="space-y-3">
          {/* Moving Averages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <Label className="text-sm">SMA</Label>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={smaPeriod.toString()}
                  onValueChange={(v) => onSMAPeriodChange(parseInt(v))}
                  disabled={!indicators.sma}
                >
                  <SelectTrigger className="w-16 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
                <Switch
                  checked={indicators.sma}
                  onCheckedChange={() => onToggleIndicator("sma")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <Label className="text-sm">EMA</Label>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={emaPeriod.toString()}
                  onValueChange={(v) => onEMAPeriodChange(parseInt(v))}
                  disabled={!indicators.ema}
                >
                  <SelectTrigger className="w-16 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="26">26</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
                <Switch
                  checked={indicators.ema}
                  onCheckedChange={() => onToggleIndicator("ema")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Oscillators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <Label className="text-sm">RSI (14)</Label>
              </div>
              <Switch
                checked={indicators.rsi}
                onCheckedChange={() => onToggleIndicator("rsi")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <Label className="text-sm">MACD</Label>
              </div>
              <Switch
                checked={indicators.macd}
                onCheckedChange={() => onToggleIndicator("macd")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <Label className="text-sm">Stochastic</Label>
              </div>
              <Switch
                checked={indicators.stochastic}
                onCheckedChange={() => onToggleIndicator("stochastic")}
              />
            </div>
          </div>

          <Separator />

          {/* Bands & Channels */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves className="h-3 w-3 text-muted-foreground" />
                <Label className="text-sm">Bollinger Bands</Label>
              </div>
              <Switch
                checked={indicators.bollinger}
                onCheckedChange={() => onToggleIndicator("bollinger")}
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground">
            {Object.values(indicators).filter(Boolean).length} indicator{Object.values(indicators).filter(Boolean).length !== 1 ? 's' : ''} active
          </p>
        </div>
      </div>
    </Card>
  );
};
