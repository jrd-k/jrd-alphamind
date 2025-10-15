import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const signals = [
  {
    id: 1,
    time: "14:32:15",
    pair: "EUR/USD",
    type: "ENTRY",
    direction: "BUY",
    price: 1.0745,
    reason: "Power Hour Breakout + SuperTrend Align",
    confidence: 0.82,
    status: "executed",
  },
  {
    id: 2,
    time: "14:28:03",
    pair: "GBP/JPY",
    type: "LAYER",
    direction: "SELL",
    price: 186.21,
    reason: "Fib 0.382 Retracement + Volume Spike",
    confidence: 0.75,
    status: "executed",
  },
  {
    id: 3,
    time: "14:15:42",
    pair: "AUD/USD",
    type: "EXIT",
    direction: "CLOSE",
    price: 0.6498,
    reason: "AI Exhaustion Signal + SuperTrend Flip",
    confidence: 0.88,
    status: "executed",
  },
  {
    id: 4,
    time: "14:12:20",
    pair: "USD/CHF",
    type: "ENTRY",
    direction: "SELL",
    price: 0.8845,
    reason: "Regime: Trending + Power Hour Break",
    confidence: 0.79,
    status: "pending",
  },
  {
    id: 5,
    time: "14:05:11",
    pair: "EUR/JPY",
    type: "REJECTED",
    direction: "BUY",
    price: 158.32,
    reason: "Low AI Confidence (0.54) + News Filter",
    confidence: 0.54,
    status: "rejected",
  },
];

export const SignalFeed = () => {
  const getStatusIcon = (status: string) => {
    if (status === "executed") return <CheckCircle className="h-4 w-4 text-bullish" />;
    if (status === "rejected") return <XCircle className="h-4 w-4 text-bearish" />;
    return <AlertCircle className="h-4 w-4 text-warning" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "executed") return "bg-bullish/10 text-bullish border-bullish/20";
    if (status === "rejected") return "bg-bearish/10 text-bearish border-bearish/20";
    return "bg-warning/10 text-warning border-warning/20";
  };

  const getTypeColor = (type: string) => {
    if (type === "ENTRY") return "bg-primary/10 text-primary border-primary/20";
    if (type === "LAYER") return "bg-info/10 text-info border-info/20";
    if (type === "EXIT") return "bg-warning/10 text-warning border-warning/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <Card className="p-6 bg-card border-border shadow-card hover:border-primary/30 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Live Signal Feed</h3>
            <p className="text-sm text-muted-foreground mt-1">Real-time trading signals</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-semibold px-3 py-1">
            <div className="h-2 w-2 bg-primary rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {signals.map((signal) => (
              <div 
                key={signal.id} 
                className="p-4 rounded-lg border border-border bg-card/50 hover:bg-muted/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary">{signal.time}</span>
                    <Badge variant="outline" className={getTypeColor(signal.type)}>
                      {signal.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(signal.status)}
                    <Badge variant="outline" className={`text-xs ${getStatusColor(signal.status)}`}>
                      {signal.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-foreground">{signal.pair}</span>
                  {signal.direction === "BUY" ? (
                    <TrendingUp className="h-4 w-4 text-bullish" />
                  ) : signal.direction === "SELL" ? (
                    <TrendingDown className="h-4 w-4 text-bearish" />
                  ) : null}
                  <Badge 
                    variant="outline" 
                    className={signal.direction === "BUY" 
                      ? "bg-bullish/10 text-bullish border-bullish/20" 
                      : signal.direction === "SELL"
                      ? "bg-bearish/10 text-bearish border-bearish/20"
                      : "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {signal.direction}
                  </Badge>
                  <span className="text-sm text-foreground">@ {signal.price}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-2">{signal.reason}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">AI Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          signal.confidence >= 0.7 ? "bg-bullish" : 
                          signal.confidence >= 0.5 ? "bg-warning" : 
                          "bg-bearish"
                        }`}
                        style={{ width: `${signal.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {(signal.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
