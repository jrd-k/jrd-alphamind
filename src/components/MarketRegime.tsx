import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const MarketRegime = () => {
  const regime = { status: "Trending", confidence: 78, volatility: "Medium", direction: "Bullish" };

  const getRegimeIcon = () => {
    if (regime.direction === "Bullish") return <TrendingUp className="h-5 w-5 text-bullish" />;
    if (regime.direction === "Bearish") return <TrendingDown className="h-5 w-5 text-bearish" />;
    return <Minus className="h-5 w-5 text-neutral" />;
  };

  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Market Regime</h3>
          {getRegimeIcon()}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="outline" className="bg-bullish/10 text-bullish border-bullish/20">
              {regime.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">AI Confidence</span>
              <span className="text-sm font-medium text-foreground">{regime.confidence}%</span>
            </div>
            <Progress value={regime.confidence} className="h-2" aria-label={`AI confidence level: ${regime.confidence}%`} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Volatility</span>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              {regime.volatility}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Direction</span>
            <Badge variant="outline" className="bg-bullish/10 text-bullish border-bullish/20">
              {regime.direction}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
