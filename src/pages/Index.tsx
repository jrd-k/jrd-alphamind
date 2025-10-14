import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { MarketRegime } from "@/components/MarketRegime";
import { ActivePositions } from "@/components/ActivePositions";
import { NewsFeed } from "@/components/NewsFeed";
import { RiskMetrics } from "@/components/RiskMetrics";
import { PerformanceChart } from "@/components/PerformanceChart";
import { AIIndicators } from "@/components/AIIndicators";
import { BotControls } from "@/components/BotControls";
import { SignalFeed } from "@/components/SignalFeed";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Activity,
  Percent,
  Clock
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">AI-powered trading overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total P/L"
            value="$365"
            change="+$127 today"
            trend="up"
            icon={DollarSign}
          />
          <StatCard
            title="Win Rate"
            value="67.8%"
            change="+2.3% vs avg"
            trend="up"
            icon={Target}
          />
          <StatCard
            title="Active Trades"
            value="3"
            change="6 layers total"
            trend="neutral"
            icon={Activity}
          />
          <StatCard
            title="Daily Return"
            value="+1.27%"
            change="Above target"
            trend="up"
            icon={Percent}
          />
          <StatCard
            title="Avg Hold Time"
            value="4.2h"
            change="Intraday mode"
            trend="neutral"
            icon={Clock}
          />
          <StatCard
            title="Sharpe Ratio"
            value="2.34"
            change="+0.12 this week"
            trend="up"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PerformanceChart />
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

export default Index;
