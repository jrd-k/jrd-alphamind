import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export const StatCard = ({ title, value, change, trend, icon: Icon }: StatCardProps) => {
  const trendColor = trend === "up" ? "text-bullish" : trend === "down" ? "text-bearish" : "text-neutral";
  
  return (
    <Card className="p-6 bg-card border-border hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
          {change && (
            <p className={`text-sm font-semibold ${trendColor}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-gradient-primary rounded-lg shadow-glow">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
};
