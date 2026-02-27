import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { Brain, TrendingUp, TrendingDown, Minus, Activity, Gauge, AlertCircle } from 'lucide-react';
import { useSecureWebSocket } from '@/hooks/useSecureWebSocket';

interface BrainAnalytics {
  summary: {
    total_decisions: number;
    buy_ratio: number;
    sell_ratio: number;
    hold_ratio: number;
    avg_confidence: number;
  };
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  avg_confidence_by_type: {
    BUY: number;
    SELL: number;
    HOLD: number;
  };
  time_series: Array<{
    date: string;
    buy: number;
    sell: number;
    hold: number;
    avg_confidence: number;
  }>;
  indicator_performance: Record<string, { count: number; avg_confidence: number }>;
  recent_decisions: Array<{
    id: number;
    symbol: string;
    decision: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    timestamp: string;
    indicator_summary: string;
    rsi?: number;
    macd?: string;
  }>;
}

const COLORS = {
  BUY: '#10b981',
  SELL: '#ef4444',
  HOLD: '#6b7280',
  high: '#22c55e',
  medium: '#f59e0b',
  low: '#ef4444'
};

export function AIDecisionDashboard() {
  const [analytics, setAnalytics] = useState<BrainAnalytics | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('ALL');
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isConnected, lastMessage } = useSecureWebSocket({
    onBrainSignal: () => {
      // Refresh analytics when new signal arrives
      fetchAnalytics();
    }
  });

  useEffect(() => {
    fetchSymbols();
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const fetchSymbols = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/brain/symbols', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch symbols');
      const data = await response.json();
      setSymbols(data.symbols || []);
    } catch (error) {
      console.error('Failed to fetch symbols:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      const params = new URLSearchParams({
        days: '30',
        ...(selectedSymbol !== 'ALL' && { symbol: selectedSymbol })
      });
      const response = await fetch(`/api/v1/brain/analytics?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading AI analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Failed to Load Analytics</p>
              <p className="text-sm text-red-700">{error || 'Unknown error'}</p>
              <button
                onClick={fetchAnalytics}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const decisionData = [
    {
      name: 'BUY',
      value: analytics.summary.buy_ratio * 100,
      count: Math.round(
        analytics.summary.buy_ratio * analytics.summary.total_decisions
      )
    },
    {
      name: 'SELL',
      value: analytics.summary.sell_ratio * 100,
      count: Math.round(
        analytics.summary.sell_ratio * analytics.summary.total_decisions
      )
    },
    {
      name: 'HOLD',
      value: analytics.summary.hold_ratio * 100,
      count: Math.round(
        analytics.summary.hold_ratio * analytics.summary.total_decisions
      )
    }
  ];

  const confidenceData = [
    {
      name: 'High (≥70%)',
      value: analytics.confidence_distribution.high,
      fill: COLORS.high
    },
    {
      name: 'Medium (40-70%)',
      value: analytics.confidence_distribution.medium,
      fill: COLORS.medium
    },
    {
      name: 'Low (<40%)',
      value: analytics.confidence_distribution.low,
      fill: COLORS.low
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Symbol Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">AI Brain Analytics</h2>
            <p className="text-muted-foreground">Machine learning decision insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
          >
            <option value="ALL">All Symbols</option>
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? '🟢 Live' : '🔴 Offline'}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics.summary.total_decisions}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(analytics.summary.avg_confidence * 100).toFixed(1)}%
            </div>
            <Progress
              value={analytics.summary.avg_confidence * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Buy Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold">
                {Math.round(analytics.summary.buy_ratio * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                analytics.summary.buy_ratio * analytics.summary.total_decisions
              )}{' '}
              signals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sell Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="text-3xl font-bold">
                {Math.round(analytics.summary.sell_ratio * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                analytics.summary.sell_ratio * analytics.summary.total_decisions
              )}{' '}
              signals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Decision Distribution</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="confidence">Confidence Analysis</TabsTrigger>
          <TabsTrigger value="recent">Recent Signals</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Decision Types</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={decisionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {decisionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[entry.name as keyof typeof COLORS]
                          }
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidence by Decision Type</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        type: 'BUY',
                        confidence: analytics.avg_confidence_by_type.BUY * 100
                      },
                      {
                        type: 'SELL',
                        confidence: analytics.avg_confidence_by_type.SELL * 100
                      },
                      {
                        type: 'HOLD',
                        confidence: analytics.avg_confidence_by_type.HOLD * 100
                      }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip
                      formatter={(value) =>
                        `${Number(value).toFixed(1)}%`
                      }
                    />
                    <Bar dataKey="confidence" fill="#8884d8">
                      {['BUY', 'SELL', 'HOLD'].map((type, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[type as keyof typeof COLORS]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.time_series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    }
                  />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="buy"
                    stackId="1"
                    stroke={COLORS.BUY}
                    fill={COLORS.BUY}
                    fillOpacity={0.6}
                    name="Buy"
                  />
                  <Area
                    type="monotone"
                    dataKey="sell"
                    stackId="1"
                    stroke={COLORS.SELL}
                    fill={COLORS.SELL}
                    fillOpacity={0.6}
                    name="Sell"
                  />
                  <Area
                    type="monotone"
                    dataKey="hold"
                    stackId="1"
                    stroke={COLORS.HOLD}
                    fill={COLORS.HOLD}
                    fillOpacity={0.6}
                    name="Hold"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confidence">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Confidence Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={confidenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {confidenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidence Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.time_series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })
                      }
                    />
                    <YAxis
                      domain={[0, 1]}
                      tickFormatter={(v) =>
                        `${(v * 100).toFixed(0)}%`
                      }
                    />
                    <RechartsTooltip
                      formatter={(value) =>
                        `${(Number(value) * 100).toFixed(1)}%`
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_confidence"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                      name="Avg Confidence"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {analytics.recent_decisions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No recent signals
                  </p>
                ) : (
                  analytics.recent_decisions.map((decision) => (
                    <div
                      key={decision.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`p-2 rounded-full ${
                            decision.decision === 'BUY'
                              ? 'bg-green-100 text-green-600'
                              : decision.decision === 'SELL'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {decision.decision === 'BUY' ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : decision.decision === 'SELL' ? (
                            <TrendingDown className="h-5 w-5" />
                          ) : (
                            <Minus className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {decision.symbol}
                            </span>
                            <Badge
                              variant={
                                decision.decision === 'BUY'
                                  ? 'default'
                                  : decision.decision === 'SELL'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {decision.decision}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {decision.indicator_summary}
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                            {decision.rsi !== undefined && (
                              <span>RSI: {decision.rsi.toFixed(1)}</span>
                            )}
                            {decision.macd && (
                              <span>MACD: {decision.macd}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Gauge className="h-4 w-4" />
                          <span className="font-medium">
                            {(decision.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(decision.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
