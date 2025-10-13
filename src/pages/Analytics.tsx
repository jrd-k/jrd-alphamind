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
          <h2 className="text-2xl font-bold text-foreground mb-2">Trading Analytics</h2>
          <p className="text-muted-foreground">Historical performance analysis and insights</p>
        </div>

        <AdvancedMetrics />
        <StrategyComparison />
        <TradeHistory />
      </main>
    </div>
  );
};

export default Analytics;
