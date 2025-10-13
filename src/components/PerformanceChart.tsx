import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { date: "Mon", balance: 10000 },
  { date: "Tue", balance: 10150 },
  { date: "Wed", balance: 10280 },
  { date: "Thu", balance: 10420 },
  { date: "Fri", balance: 10650 },
  { date: "Sat", balance: 10580 },
  { date: "Sun", balance: 10720 },
];

export const PerformanceChart = () => {
  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Performance Curve</h3>
          <TrendingUp className="h-5 w-5 text-bullish" />
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(195 100% 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(195 100% 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="hsl(195 100% 50%)" 
              fillOpacity={1} 
              fill="url(#colorBalance)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
