import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const DEFAULT_SYMBOLS = ["EUR/USD", "GBP/JPY", "AUD/USD", "USD/CHF", "EUR/JPY"];

export const SymbolManager = () => {
  const [symbols, setSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const [newSymbol, setNewSymbol] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const addSymbol = () => {
    const formatted = newSymbol.toUpperCase().trim();
    if (formatted && !symbols.includes(formatted)) {
      setSymbols([...symbols, formatted]);
      setNewSymbol("");
    }
  };

  const removeSymbol = (symbol: string) => {
    setSymbols(symbols.filter(s => s !== symbol));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Symbols ({symbols.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Trading Symbols</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., EUR/USD"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSymbol()}
            />
            <Button onClick={addSymbol} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-64">
            <div className="flex flex-wrap gap-2">
              {symbols.map((symbol) => (
                <Badge
                  key={symbol}
                  variant="outline"
                  className="pl-3 pr-1 py-1 text-sm gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  {symbol}
                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
