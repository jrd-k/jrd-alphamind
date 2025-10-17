import { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, CandlestickSeries, HistogramSeries } from "lightweight-charts";
import { Card } from "@/components/ui/card";
import { useChart } from "@/contexts/ChartContext";
import { generateHistoricalData, updateCurrentCandle, generateNextCandle } from "@/services/marketData";
import { convertToHeikinAshi } from "@/lib/heikinAshi";
import { CandlestickData } from "@/types/trading";

export const CandlestickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  
  const { selectedSymbol, selectedTimeframe, chartType, isRealTimeEnabled } = useChart();
  const [chartData, setChartData] = useState<CandlestickData[]>([]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#9CA3AF",
      },
      grid: {
        vertLines: { color: "#1F2937" },
        horzLines: { color: "#1F2937" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#374151",
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#6366F1",
          labelBackgroundColor: "#6366F1",
        },
        horzLine: {
          color: "#6366F1",
          labelBackgroundColor: "#6366F1",
        },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      downColor: "#EF4444",
      borderUpColor: "#10B981",
      borderDownColor: "#EF4444",
      wickUpColor: "#10B981",
      wickDownColor: "#EF4444",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#6366F1",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    chart.priceScale("").applyOptions({
      scaleMargins: {
        top: 0.8,
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
      chart.remove();
    };
  }, []);

  // Load initial data when symbol or timeframe changes
  useEffect(() => {
    const data = generateHistoricalData(selectedSymbol, selectedTimeframe, 200);
    setChartData(data);
  }, [selectedSymbol, selectedTimeframe]);

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
        const shouldCreateNewCandle = Math.random() > 0.7; // 30% chance of new candle

        if (shouldCreateNewCandle) {
          const newCandle = generateNextCandle(selectedSymbol, lastCandle, selectedTimeframe);
          return [...prev.slice(-199), newCandle];
        } else {
          const updatedCandle = updateCurrentCandle(lastCandle, selectedSymbol);
          return [...prev.slice(0, -1), updatedCandle];
        }
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, chartData.length, selectedSymbol, selectedTimeframe]);

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {selectedSymbol} - {selectedTimeframe}
          </h3>
          <p className="text-sm text-muted-foreground">
            {chartType === "heikinashi" ? "Heikin Ashi" : "Candlestick"} Chart
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isRealTimeEnabled && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-bullish rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          )}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </Card>
  );
};
