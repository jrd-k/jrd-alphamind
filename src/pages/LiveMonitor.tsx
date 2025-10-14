import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { MarketRegime } from "@/components/MarketRegime";
import { ActivePositions } from "@/components/ActivePositions";
import { SignalFeed } from "@/components/SignalFeed";
import { BotControls } from "@/components/BotControls";
import { NewsFeed } from "@/components/NewsFeed";
import { RiskMetrics } from "@/components/RiskMetrics";
import { AIIndicators } from "@/components/AIIndicators";
import { 
  Activity,
  Target,
  TrendingUp,
} from "lucide-react";

const LiveMonitor = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Monitor</h2>
          <p className="text-sm text-muted-foreground">Real-time activity & signals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Active Trades"
            value="3"
            change="6 layers total"
            trend="neutral"
            icon={Activity}
          />
          <StatCard
            title="Today's P/L"
            value="+$127"
            change="+1.27%"
            trend="up"
            icon={TrendingUp}
          />
          <StatCard
            title="Signals Generated"
            value="12"
            change="5 executed"
            trend="neutral"
            icon={Target}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ActivePositions />
            <SignalFeed />
          </div>

          <div className="space-y-6">
            <BotControls />
            <MarketRegime />
            <AIIndicators />
            <RiskMetrics />
            <NewsFeed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveMonitor;
