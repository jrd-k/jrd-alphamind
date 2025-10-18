import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, Search, Filter } from "lucide-react";
import { useState } from "react";

const historyData = [
  {
    id: "TR001",
    date: "2025-10-13 14:23",
    pair: "EUR/USD",
    type: "BUY",
    entry: 1.0745,
    exit: 1.0772,
    pips: 27,
    pl: 270,
    plPercent: 2.5,
    layers: 3,
    duration: "4h 12m",
    strategy: "Power Hour Breakout",
  },
  {
    id: "TR002",
    date: "2025-10-13 09:45",
    pair: "GBP/JPY",
    type: "SELL",
    entry: 186.54,
    exit: 186.21,
    pips: 33,
    pl: 165,
    plPercent: 1.8,
    layers: 2,
    duration: "6h 34m",
    strategy: "SuperTrend Swing",
  },
  {
    id: "TR003",
    date: "2025-10-12 16:20",
    pair: "AUD/USD",
    type: "BUY",
    entry: 0.6512,
    exit: 0.6498,
    pips: -14,
    pl: -70,
    plPercent: -0.6,
    layers: 1,
    duration: "2h 18m",
    strategy: "Intraday Scalp",
  },
  {
    id: "TR004",
    date: "2025-10-12 11:15",
    pair: "USD/CHF",
    type: "SELL",
    entry: 0.8845,
    exit: 0.8801,
    pips: 44,
    pl: 440,
    plPercent: 4.2,
    layers: 4,
    duration: "8h 45m",
    strategy: "Multi-Layer Swing",
  },
  {
    id: "TR005",
    date: "2025-10-11 13:30",
    pair: "EUR/JPY",
    type: "BUY",
    entry: 158.32,
    exit: 158.78,
    pips: 46,
    pl: 230,
    plPercent: 2.1,
    layers: 2,
    duration: "12h 20m",
    strategy: "Power Hour Breakout",
  },
];

export const TradeHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      console.log('Importing file:', file.name);
      // Handle file import logic
    };
    input.click();
  };

  const handleExport = () => {
    console.log('Exporting trade history...');
    // Handle export logic
  };

  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Trade History</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleImport}
              className="text-foreground border-border hover:bg-muted"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
              className="text-foreground border-border hover:bg-muted"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>
          <Button variant="outline" size="sm" className="text-foreground border-border hover:bg-muted">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Pair</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Entry/Exit</TableHead>
                <TableHead className="text-muted-foreground">Pips</TableHead>
                <TableHead className="text-muted-foreground">P/L</TableHead>
                <TableHead className="text-muted-foreground">Layers</TableHead>
                <TableHead className="text-muted-foreground">Duration</TableHead>
                <TableHead className="text-muted-foreground">Strategy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((trade) => (
                <TableRow key={trade.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-mono text-sm text-muted-foreground">{trade.id}</TableCell>
                  <TableCell className="text-sm text-foreground">{trade.date}</TableCell>
                  <TableCell className="font-medium text-foreground">{trade.pair}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={trade.type === "BUY" 
                        ? "bg-bullish/10 text-bullish border-bullish/20" 
                        : "bg-bearish/10 text-bearish border-bearish/20"
                      }
                    >
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex flex-col text-xs">
                      <span>{trade.entry}</span>
                      <span className="text-muted-foreground">→ {trade.exit}</span>
                    </div>
                  </TableCell>
                  <TableCell className={trade.pips >= 0 ? "text-bullish font-medium" : "text-bearish font-medium"}>
                    {trade.pips >= 0 ? "+" : ""}{trade.pips}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={trade.pl >= 0 ? "text-bullish font-medium" : "text-bearish font-medium"}>
                        ${trade.pl >= 0 ? "+" : ""}{trade.pl}
                      </span>
                      <span className={`text-xs ${trade.pl >= 0 ? "text-bullish/70" : "text-bearish/70"}`}>
                        {trade.plPercent >= 0 ? "+" : ""}{trade.plPercent}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{trade.layers}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{trade.duration}</TableCell>
                  <TableCell className="text-sm text-foreground">{trade.strategy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
