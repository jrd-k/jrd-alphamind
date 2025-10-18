import { useEffect, useRef, useState } from "react";
import * as LightweightCharts from "lightweight-charts";
import type { IChartApi } from "lightweight-charts";
import { Card } from "@/components/ui/card";
import { useChart } from "@/contexts/ChartContext";
import { generateHistoricalData, updateCurrentCandle, generateNextCandle } from "@/services/marketData";
import { convertToHeikinAshi } from "@/lib/heikinAshi";
import { 
  calculateSMA, 
  calculateEMA, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  calculateStochastic 
} from "@/lib/indicators";
import { CandlestickData } from "@/types/trading";

interface IndicatorState {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  bollinger: boolean;
  stochastic: boolean;
}

interface CandlestickChartProps {
  indicators?: IndicatorState;
  smaPeriod?: number;
  emaPeriod?: number;
}

export const CandlestickChart = ({ 
  indicators = { sma: false, ema: false, rsi: false, macd: false, bollinger: false, stochastic: false },
  smaPeriod = 50,
  emaPeriod = 12,
}: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const indicatorSeriesRef = useRef<Map<string, any>>(new Map());
  
  const { selectedSymbol, selectedTimeframe, chartType, isRealTimeEnabled } = useChart();
  const [chartData, setChartData] = useState<CandlestickData[]>([]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = LightweightCharts.createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#9CA3AF",
      },
      grid: {
        vertLines: { color: "#1F2937", style: LightweightCharts.LineStyle.Solid },
        horzLines: { color: "#1F2937", style: LightweightCharts.LineStyle.Solid },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#374151",
      },
      rightPriceScale: {
        borderColor: "#374151",
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      leftPriceScale: {
        visible: true,
        borderColor: "#374151",
      },
      crosshair: {
        mode: 1 as any,
        vertLine: {
          color: "#00D4FF",
          width: 1,
          style: LightweightCharts.LineStyle.Dashed,
          labelBackgroundColor: "#00D4FF",
        },
        horzLine: {
          color: "#00D4FF",
          width: 1,
          style: LightweightCharts.LineStyle.Dashed,
          labelBackgroundColor: "#00D4FF",
        },
      },
    });

    const candlestickSeries = (chart as any).addCandlestickSeries
      ? (chart as any).addCandlestickSeries({
          upColor: "#10B981",
          downColor: "#EF4444",
          borderUpColor: "#10B981",
          borderDownColor: "#EF4444",
          wickUpColor: "#10B981",
          wickDownColor: "#EF4444",
        })
      : (chart as any).addLineSeries({
          color: "#10B981",
          lineWidth: 2,
        });

    const volumeSeries = (chart as any).addHistogramSeries
      ? (chart as any).addHistogramSeries({
          color: "#00D4FF",
          priceFormat: {
            type: "volume",
          },
          priceScaleId: "",
        })
      : (chart as any).addLineSeries({
          color: "#00D4FF",
          lineWidth: 1,
        });

    chart.priceScale("").applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      indicatorSeriesRef.current.forEach(series => chart.removeSeries(series));
      indicatorSeriesRef.current.clear();
      chart.remove();
    };
  }, []);

  // Load initial data when symbol or timeframe changes
  useEffect(() => {
    const data = generateHistoricalData(selectedSymbol, selectedTimeframe, 200);
    setChartData(data);
  }, [selectedSymbol, selectedTimeframe]);

  // Update indicators
  useEffect(() => {
    if (!chartRef.current || chartData.length < 50) return;

    // Clear existing indicators
    indicatorSeriesRef.current.forEach(series => {
      try {
        chartRef.current?.removeSeries(series);
      } catch (e) {
        // Series might already be removed
      }
    });
    indicatorSeriesRef.current.clear();

    // Add SMA
    if (indicators.sma) {
      const smaData = calculateSMA(chartData, smaPeriod);
      const smaSeries = (chartRef.current as any).addLineSeries({
        color: "#FFD700",
        lineWidth: 2,
        title: `SMA ${smaPeriod}`,
      });
      smaSeries.setData(smaData as any);
      indicatorSeriesRef.current.set('sma', smaSeries);
    }

    // Add EMA
    if (indicators.ema) {
      const emaData = calculateEMA(chartData, emaPeriod);
      const emaSeries = (chartRef.current as any).addLineSeries({
        color: "#FF6B6B",
        lineWidth: 2,
        title: `EMA ${emaPeriod}`,
      });
      emaSeries.setData(emaData as any);
      indicatorSeriesRef.current.set('ema', emaSeries);
    }

    // Add Bollinger Bands
    if (indicators.bollinger) {
      const bbData = calculateBollingerBands(chartData, 20, 2);
      
      const upperSeries = (chartRef.current as any).addLineSeries({
        color: "#9C27B0",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        title: "BB Upper",
      });
      upperSeries.setData(bbData.upper as any);
      indicatorSeriesRef.current.set('bb-upper', upperSeries);

      const middleSeries = (chartRef.current as any).addLineSeries({
        color: "#9C27B0",
        lineWidth: 1,
        title: "BB Middle",
      });
      middleSeries.setData(bbData.middle as any);
      indicatorSeriesRef.current.set('bb-middle', middleSeries);

      const lowerSeries = (chartRef.current as any).addLineSeries({
        color: "#9C27B0",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        title: "BB Lower",
      });
      lowerSeries.setData(bbData.lower as any);
      indicatorSeriesRef.current.set('bb-lower', lowerSeries);
    }

  }, [chartData, indicators, smaPeriod, emaPeriod]);

  // Update chart with data
  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return;

    let displayData = chartData;
    
    if (chartType === "heikinashi") {
      const haData = convertToHeikinAshi(chartData);
      displayData = haData.map(ha => ({
        ...ha,
        volume: chartData.find(c => c.time === ha.time)?.volume,
      }));
    }

    candlestickSeriesRef.current.setData(displayData as any);
    
    if (displayData.length > 0 && displayData[0].volume !== undefined) {
      volumeSeriesRef.current.setData(
        displayData.map(d => ({
          time: d.time as any,
          value: d.volume || 0,
          color: d.close >= d.open ? "#10B98150" : "#EF444450",
        }))
      );
    }

    chartRef.current?.timeScale().fitContent();
  }, [chartData, chartType]);

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled || chartData.length === 0) return;

    const interval = setInterval(() => {
      setChartData(prev => {
        if (prev.length === 0) return prev;
        
        const lastCandle = prev[prev.length - 1];
        const shouldCreateNewCandle = Math.random() > 0.7;

        if (shouldCreateNewCandle) {
          const newCandle = generateNextCandle(selectedSymbol, lastCandle, selectedTimeframe);
          return [...prev.slice(-199), newCandle];
        } else {
          const updatedCandle = updateCurrentCandle(lastCandle, selectedSymbol);
          return [...prev.slice(0, -1), updatedCandle];
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, chartData.length, selectedSymbol, selectedTimeframe]);

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            {selectedSymbol}
            <span className="text-sm font-normal text-muted-foreground">• {selectedTimeframe}</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {chartType === "heikinashi" ? "Heikin Ashi" : "Candlestick"} Chart
            {Object.values(indicators).some(Boolean) && (
              <span className="ml-2">
                • {Object.values(indicators).filter(Boolean).length} indicators active
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isRealTimeEnabled && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bullish/10 border border-bullish/20">
              <div className="h-2 w-2 bg-bullish rounded-full animate-pulse" />
              <span className="text-xs font-medium text-bullish">Live Data</span>
            </div>
          )}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full rounded-lg overflow-hidden" />
    </Card>
  );
};
