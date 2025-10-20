import { Header } from "@/components/Header";
import { TradeHistory } from "@/components/TradeHistory";
import { AdvancedMetrics } from "@/components/AdvancedMetrics";
import { StrategyComparison } from "@/components/StrategyComparison";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">Performance insights & metrics</p>
        </div>

        <AdvancedMetrics />
        <StrategyComparison />
        <TradeHistory />
      </main>
    </div>
  );
};

export default Analytics;
