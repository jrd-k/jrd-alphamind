import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Layers } from "lucide-react";

const positions = [
  {
    id: 1,
    pair: "EUR/USD",
    type: "BUY",
    entry: 1.0745,
    current: 1.0772,
    pl: 270,
    plPercent: 2.5,
    layers: 3,
    size: 0.36,
  },
  {
    id: 2,
    pair: "GBP/JPY",
    type: "SELL",
    entry: 186.54,
    current: 186.21,
    pl: 165,
    plPercent: 1.8,
    layers: 2,
    size: 0.24,
  },
  {
    id: 3,
    pair: "AUD/USD",
    type: "BUY",
    entry: 0.6512,
    current: 0.6498,
    pl: -70,
    plPercent: -0.6,
    layers: 1,
    size: 0.12,
  },
];

export const ActivePositions = () => {
  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Active Positions</h3>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {positions.length} Open
          </Badge>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Pair</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Entry</TableHead>
                <TableHead className="text-muted-foreground">Current</TableHead>
                <TableHead className="text-muted-foreground">P/L</TableHead>
                <TableHead className="text-muted-foreground">Layers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{position.pair}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={position.type === "BUY" 
                        ? "bg-bullish/10 text-bullish border-bullish/20" 
                        : "bg-bearish/10 text-bearish border-bearish/20"
                      }
                    >
                      {position.type === "BUY" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {position.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">{position.entry}</TableCell>
                  <TableCell className="text-foreground">{position.current}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={position.pl >= 0 ? "text-bullish font-medium" : "text-bearish font-medium"}>
                        ${position.pl >= 0 ? "+" : ""}{position.pl}
                      </span>
                      <span className={`text-xs ${position.pl >= 0 ? "text-bullish/70" : "text-bearish/70"}`}>
                        {position.plPercent >= 0 ? "+" : ""}{position.plPercent}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Layers className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-medium">{position.layers}/6</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
