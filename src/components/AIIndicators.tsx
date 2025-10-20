import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, Activity } from "lucide-react";

export const AIIndicators = () => {
  const indicators = [
    { name: "Regime Model", confidence: 78, status: "Active", icon: Brain },
    { name: "Exit Classifier", confidence: 65, status: "Monitoring", icon: Target },
    { name: "Volatility Predictor", confidence: 82, status: "Active", icon: Activity },
  ];

  return (
    <Card className="p-6 bg-card border-border shadow-card hover:border-primary/30 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">AI Models</h3>
            <p className="text-xs text-muted-foreground mt-1">Neural networks</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          {indicators.map((indicator) => (
            <div key={indicator.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <indicator.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{indicator.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{indicator.status}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Confidence</span>
                  <span className="text-xs font-medium text-foreground">{indicator.confidence}%</span>
                </div>
                <Progress 
                  value={indicator.confidence} 
                  className="h-1.5"
                  aria-label={`${indicator.name} confidence level: ${indicator.confidence}%`}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Last retrained: 2 hours ago • Next: 22h remaining
          </p>
        </div>
      </div>
    </Card>
  );
};
