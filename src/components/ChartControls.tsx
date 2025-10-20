import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useChart } from "@/contexts/ChartContext";
import { SYMBOLS, TIMEFRAMES } from "@/constants/trading";
import { Symbol, TimeFrame } from "@/types/trading";
import { Activity, BarChart3 } from "lucide-react";

export const ChartControls = () => {
  const {
    selectedSymbol,
    setSelectedSymbol,
    selectedTimeframe,
    setSelectedTimeframe,
    chartType,
    setChartType,
    isRealTimeEnabled,
    setIsRealTimeEnabled,
  } = useChart();

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Symbol Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Symbol</label>
            <Select value={selectedSymbol} onValueChange={(value) => setSelectedSymbol(value as Symbol)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYMBOLS.map((symbol) => (
                  <SelectItem key={symbol} value={symbol}>
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chart Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Chart Type</label>
            <div className="flex gap-2">
              <Button
                variant={chartType === "regular" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("regular")}
                className="flex-1"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Regular
              </Button>
              <Button
                variant={chartType === "heikinashi" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("heikinashi")}
                className="flex-1"
              >
                <Activity className="h-4 w-4 mr-2" />
                Heikin Ashi
              </Button>
            </div>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Timeframe</label>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map(({ value, label }) => (
              <Button
                key={value}
                variant={selectedTimeframe === value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Real-time Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Real-time updates</span>
          <Button
            variant={isRealTimeEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
          >
            {isRealTimeEnabled ? (
              <>
                <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-2" />
                Live
              </>
            ) : (
              "Paused"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
