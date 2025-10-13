import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const newsItems = [
  {
    id: 1,
    time: "14:30",
    event: "US CPI Data",
    impact: "high",
    currency: "USD",
    forecast: "3.2%",
    status: "upcoming",
  },
  {
    id: 2,
    time: "12:00",
    event: "ECB Rate Decision",
    impact: "high",
    currency: "EUR",
    forecast: "4.5%",
    status: "upcoming",
  },
  {
    id: 3,
    time: "09:30",
    event: "UK Employment Data",
    impact: "medium",
    currency: "GBP",
    forecast: "4.2%",
    status: "passed",
  },
];

export const NewsFeed = () => {
  const getImpactColor = (impact: string) => {
    if (impact === "high") return "bg-bearish/10 text-bearish border-bearish/20";
    if (impact === "medium") return "bg-warning/10 text-warning border-warning/20";
    return "bg-info/10 text-info border-info/20";
  };

  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Economic Calendar</h3>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {newsItems.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-lg border transition-all ${
                  item.status === "upcoming" 
                    ? "bg-card/50 border-primary/30" 
                    : "bg-muted/20 border-border opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-primary">{item.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.currency}
                    </Badge>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getImpactColor(item.impact)}`}>
                    {item.impact.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{item.event}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Forecast: {item.forecast}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
