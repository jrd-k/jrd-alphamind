import { Card } from "@/components/ui/card";
import { calculateJournalStats } from "@/services/tradeJournal";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";

export const JournalStats = () => {
  const [stats, setStats] = useState(calculateJournalStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(calculateJournalStats());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 border-border/50 bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.winRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.winningTrades}/{stats.totalTrades} trades
            </p>
          </div>
          <Target className="h-8 w-8 text-primary/50" />
        </div>
      </Card>

      <Card className="p-4 border-border/50 bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total P/L</p>
            <p className={`text-2xl font-bold mt-1 ${stats.totalProfit >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              ${stats.totalProfit >= 0 ? '+' : ''}{stats.totalProfit.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalTrades} trades
            </p>
          </div>
          {stats.totalProfit >= 0 ? (
            <TrendingUp className="h-8 w-8 text-bullish/50" />
          ) : (
            <TrendingDown className="h-8 w-8 text-bearish/50" />
          )}
        </div>
      </Card>

      <Card className="p-4 border-border/50 bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Profit Factor</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.profitFactor.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Avg Win: ${stats.avgWin.toFixed(2)}
            </p>
          </div>
          <BarChart3 className="h-8 w-8 text-primary/50" />
        </div>
      </Card>

      <Card className="p-4 border-border/50 bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Best Trade</p>
            <p className="text-2xl font-bold text-bullish mt-1">
              ${stats.largestWin.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Worst: ${stats.largestLoss.toFixed(2)}
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-bullish/50" />
        </div>
      </Card>
    </div>
  );
};
