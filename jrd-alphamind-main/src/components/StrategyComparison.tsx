import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  {
    strategy: "Power Hour",
    trades: 85,
    winRate: 72,
    avgReturn: 2.4,
  },
  {
    strategy: "SuperTrend",
    trades: 67,
    winRate: 68,
    avgReturn: 2.1,
  },
  {
    strategy: "Multi-Layer",
    trades: 54,
    winRate: 75,
    avgReturn: 3.2,
  },
  {
    strategy: "Intraday",
    trades: 39,
    winRate: 62,
    avgReturn: 1.8,
  },
];

export const StrategyComparison = () => {
  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Strategy Performance Comparison</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="strategy" 
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
            <Legend />
            <Bar dataKey="trades" fill="hsl(195 100% 50%)" name="Total Trades" />
            <Bar dataKey="winRate" fill="hsl(142 76% 36%)" name="Win Rate %" />
            <Bar dataKey="avgReturn" fill="hsl(38 92% 50%)" name="Avg Return %" />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((strategy) => (
            <div key={strategy.strategy} className="text-center p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">{strategy.strategy}</p>
              <p className="text-lg font-bold text-foreground">{strategy.trades}</p>
              <p className="text-xs text-bullish">{strategy.winRate}% WR</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
