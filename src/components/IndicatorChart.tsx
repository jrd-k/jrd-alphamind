import { useEffect, useRef } from "react";
import * as LightweightCharts from "lightweight-charts";
import type { IChartApi } from "lightweight-charts";
import { Card } from "@/components/ui/card";
import { CandlestickData } from "@/types/trading";
import { calculateRSI, calculateMACD, calculateStochastic, calculateATR } from "@/lib/indicators";

interface IndicatorChartProps {
  data: CandlestickData[];
  type: "rsi" | "macd" | "stochastic" | "atr";
  title: string;
}

export const IndicatorChart = ({ data, type, title }: IndicatorChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length < 50) return;

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
      height: 200,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#374151",
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
    });

    if (type === "rsi") {
      const rsiData = calculateRSI(data, 14);
      const rsiSeries = (chart as any).addLineSeries({
        color: "#00D4FF",
        lineWidth: 2,
      });
      rsiSeries.setData(rsiData as any);

      // Add overbought/oversold lines
      const overboughtSeries = (chart as any).addLineSeries({
        color: "#EF4444",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
      });
      overboughtSeries.setData(rsiData.map(d => ({ time: d.time, value: 70 })) as any);

      const oversoldSeries = (chart as any).addLineSeries({
        color: "#10B981",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
      });
      oversoldSeries.setData(rsiData.map(d => ({ time: d.time, value: 30 })) as any);
    } else if (type === "macd") {
      const macdData = calculateMACD(data, 12, 26, 9);
      
      const macdSeries = (chart as any).addLineSeries({
        color: "#00D4FF",
        lineWidth: 2,
      });
      macdSeries.setData(macdData.macd as any);

      const signalSeries = (chart as any).addLineSeries({
        color: "#FF6B6B",
        lineWidth: 2,
      });
      signalSeries.setData(macdData.signal as any);

      const histogramSeries = (chart as any).addHistogramSeries({
        priceFormat: {
          type: "price",
        },
      });
      histogramSeries.setData(macdData.histogram as any);
    } else if (type === "stochastic") {
      const stochData = calculateStochastic(data, 14, 3, 3);
      
      const kSeries = (chart as any).addLineSeries({
        color: "#00D4FF",
        lineWidth: 2,
      });
      kSeries.setData(stochData.k as any);

      const dSeries = (chart as any).addLineSeries({
        color: "#FF6B6B",
        lineWidth: 2,
      });
      dSeries.setData(stochData.d as any);

      // Add overbought/oversold lines
      const overboughtSeries = (chart as any).addLineSeries({
        color: "#EF4444",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
      });
      overboughtSeries.setData(stochData.k.map(d => ({ time: d.time, value: 80 })) as any);

      const oversoldSeries = (chart as any).addLineSeries({
        color: "#10B981",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
      });
      oversoldSeries.setData(stochData.k.map(d => ({ time: d.time, value: 20 })) as any);
    } else if (type === "atr") {
      const atrData = calculateATR(data, 14);
      const atrSeries = (chart as any).addLineSeries({
        color: "#9C27B0",
        lineWidth: 2,
      });
      atrSeries.setData(atrData as any);
    }

    chartRef.current = chart;

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
  }, [data, type]);

  return (
    <Card className="p-4 border-border/50 bg-card/50 backdrop-blur">
      <h4 className="text-sm font-semibold text-foreground mb-3">{title}</h4>
      <div ref={chartContainerRef} className="w-full rounded-lg overflow-hidden" />
    </Card>
  );
};
