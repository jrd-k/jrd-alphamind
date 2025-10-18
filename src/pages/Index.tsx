import { useState } from "react";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { CandlestickChart } from "@/components/CandlestickChart";
import { ChartControls } from "@/components/ChartControls";
import { BrokerStatus } from "@/components/BrokerStatus";
import { PerformanceChart } from "@/components/PerformanceChart";
import { ActivePositions } from "@/components/ActivePositions";
import { SignalFeed } from "@/components/SignalFeed";
import { BotControls } from "@/components/BotControls";
import { MarketRegime } from "@/components/MarketRegime";
import { RiskMetrics } from "@/components/RiskMetrics";
import { AIIndicators } from "@/components/AIIndicators";
import { NewsFeed } from "@/components/NewsFeed";
import { IndicatorPanel } from "@/components/IndicatorPanel";
import { IndicatorChart } from "@/components/IndicatorChart";
import { useChart } from "@/contexts/ChartContext";
import { 
  TrendingUp, 
  Target, 
  Activity,
  Wallet,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
} from "lucide-react";

const Index = () => {
  const [indicators, setIndicators] = useState({
    sma: false,
    ema: false,
    rsi: false,
    macd: false,
    bollinger: false,
    stochastic: false,
  });
  const [smaPeriod, setSmaPeriod] = useState(50);
  const [emaPeriod, setEmaPeriod] = useState(12);
  const [chartData, setChartData] = useState<any[]>([]);

  const toggleIndicator = (indicator: keyof typeof indicators) => {
    setIndicators(prev => ({ ...prev, [indicator]: !prev[indicator] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive trading performance overview</p>
        </div>

        {/* Primary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total P/L"
            value="+$2,347"
            change="+23.4% since start"
            trend="up"
            icon={TrendingUp}
          />
          <StatCard
            title="Account Balance"
            value="$12,347"
            change="$10,000 initial"
            trend="up"
            icon={Wallet}
          />
          <StatCard
            title="Win Rate"
            value="73.2%"
            change="156/213 trades"
            trend="up"
            icon={Target}
          />
          <StatCard
            title="Active Trades"
            value="3"
            change="6 total layers"
            trend="neutral"
            icon={Activity}
          />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's P/L"
            value="+$127"
            change="+1.03%"
            trend="up"
            icon={Clock}
          />
          <StatCard
            title="Risk Score"
            value="5.2/10"
            change="Safe zone"
            trend="neutral"
            icon={ShieldCheck}
          />
          <StatCard
            title="Avg Win/Loss"
            value="2.3x"
            change="Risk:Reward ratio"
            trend="up"
            icon={BarChart3}
          />
          <StatCard
            title="Bot Status"
            value="Active"
            change="12 signals today"
            trend="up"
            icon={Zap}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <ChartControls />
            <CandlestickChart 
              indicators={indicators}
              smaPeriod={smaPeriod}
              emaPeriod={emaPeriod}
            />
            
            {/* Separate Indicator Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indicators.rsi && chartData.length > 50 && (
                <IndicatorChart data={chartData} type="rsi" title="RSI (14)" />
              )}
              {indicators.macd && chartData.length > 50 && (
                <IndicatorChart data={chartData} type="macd" title="MACD (12, 26, 9)" />
              )}
              {indicators.stochastic && chartData.length > 50 && (
                <IndicatorChart data={chartData} type="stochastic" title="Stochastic (14, 3, 3)" />
              )}
            </div>
          </div>
          <IndicatorPanel
            indicators={indicators}
            onToggleIndicator={toggleIndicator}
            smaPeriod={smaPeriod}
            emaPeriod={emaPeriod}
            onSMAPeriodChange={setSmaPeriod}
            onEMAPeriodChange={setEmaPeriod}
          />
        </div>

        <PerformanceChart />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ActivePositions />
            <SignalFeed />
          </div>

          <div className="space-y-6">
            <BrokerStatus />
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
