import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const timeframes = {
  "1D": [
    { date: "00:00", balance: 10620 }, { date: "04:00", balance: 10650 },
    { date: "08:00", balance: 10680 }, { date: "12:00", balance: 10700 },
    { date: "16:00", balance: 10710 }, { date: "20:00", balance: 10720 },
  ],
  "1W": [
    { date: "Mon", balance: 10000 }, { date: "Tue", balance: 10150 },
    { date: "Wed", balance: 10280 }, { date: "Thu", balance: 10420 },
    { date: "Fri", balance: 10650 }, { date: "Sat", balance: 10580 },
    { date: "Sun", balance: 10720 },
  ],
  "1M": [
    { date: "W1", balance: 9800 }, { date: "W2", balance: 10100 },
    { date: "W3", balance: 10350 }, { date: "W4", balance: 10720 },
  ],
  "3M": [
    { date: "M1", balance: 9200 }, { date: "M2", balance: 9850 },
    { date: "M3", balance: 10720 },
  ],
  "1Y": [
    { date: "Jan", balance: 8500 }, { date: "Feb", balance: 8800 },
    { date: "Mar", balance: 9200 }, { date: "Apr", balance: 9100 },
    { date: "May", balance: 9500 }, { date: "Jun", balance: 9850 },
    { date: "Jul", balance: 10100 }, { date: "Aug", balance: 10200 },
    { date: "Sep", balance: 10350 }, { date: "Oct", balance: 10720 },
  ],
};

export const PerformanceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof timeframes>("1W");

  return (
    <Card className="p-6 bg-card border-border shadow-card hover:border-primary/30 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">Performance Curve</h3>
            <p className="text-sm text-muted-foreground mt-1">Track your trading growth over time</p>
          </div>
          <div className="flex items-center gap-2">
            {Object.keys(timeframes).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as keyof typeof timeframes)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  selectedPeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {period}
              </button>
            ))}
            <TrendingUp className="h-5 w-5 text-bullish ml-2" />
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timeframes[selectedPeriod]}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(195 100% 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(195 100% 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Area type="monotone" dataKey="balance" stroke="hsl(195 100% 50%)" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
