import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Activity, Award, Zap, Shield } from "lucide-react";

const metrics = [
  {
    name: "Sharpe Ratio",
    value: 2.34,
    target: 2.0,
    description: "Risk-adjusted returns",
    icon: Award,
    color: "text-bullish",
  },
  {
    name: "Profit Factor",
    value: 2.8,
    target: 2.0,
    description: "Gross profit / Gross loss",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    name: "Win Rate",
    value: 67.8,
    target: 60,
    description: "Percentage of winning trades",
    icon: Target,
    color: "text-bullish",
  },
  {
    name: "Expectancy",
    value: 0.45,
    target: 0.3,
    description: "Average $ per trade",
    icon: Zap,
    color: "text-primary",
  },
  {
    name: "Recovery Factor",
    value: 3.2,
    target: 2.5,
    description: "Net profit / Max drawdown",
    icon: Shield,
    color: "text-bullish",
  },
  {
    name: "Avg Win / Avg Loss",
    value: 1.9,
    target: 1.5,
    description: "Risk-reward ratio",
    icon: Activity,
    color: "text-primary",
  },
];

export const AdvancedMetrics = () => {
  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Advanced Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{metric.name}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {metric.target} target
                  </span>
                </div>
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-bullish">245</p>
              <p className="text-xs text-muted-foreground">Total Trades</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">32.4 days</p>
              <p className="text-xs text-muted-foreground">Avg Trade Duration</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
