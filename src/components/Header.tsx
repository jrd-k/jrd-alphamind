import { Badge } from "@/components/ui/badge";
import { Activity, Settings } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">JRD-TRADES</h1>
              <p className="text-xs text-muted-foreground">AI Forex Trading System</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-bullish/10 text-bullish border-bullish/20">
            <div className="h-2 w-2 bg-bullish rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">$10,720.00</p>
            <p className="text-xs text-bullish">+7.2% Total</p>
          </div>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};
