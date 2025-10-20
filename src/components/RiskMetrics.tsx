import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle } from "lucide-react";

export const RiskMetrics = () => {
  const metrics = { accountRisk: 5.2, dailyRisk: 3.1, maxDrawdown: 8.5, exposureLimit: 8.0 };

  return (
    <Card className="p-6 bg-card border-border shadow-card hover:border-primary/30 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Risk Management</h3>
            <p className="text-xs text-muted-foreground mt-1">Real-time monitoring</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Exposure</span>
              <span className="text-sm font-medium text-foreground">{metrics.accountRisk}%</span>
            </div>
            <Progress value={(metrics.accountRisk / metrics.exposureLimit) * 100} className="h-2" aria-label={`Current exposure: ${metrics.accountRisk}% of ${metrics.exposureLimit}% limit`} />
            <p className="text-xs text-muted-foreground">Limit: {metrics.exposureLimit}%</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Daily Risk Used</span>
              <span className="text-sm font-medium text-foreground">{metrics.dailyRisk}%</span>
            </div>
            <Progress value={(metrics.dailyRisk / 3) * 100} className="h-2" aria-label={`Daily risk used: ${metrics.dailyRisk}% of 3% daily cap`} />
            <p className="text-xs text-muted-foreground">Daily Cap: 3%</p>
          </div>

          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-warning">Max Drawdown</p>
                <p className="text-xs text-muted-foreground">Current: {metrics.maxDrawdown}% (Limit: 15%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
