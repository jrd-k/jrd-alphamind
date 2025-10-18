import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, Search, Filter, Trash2, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { getJournal, exportJournal, importJournal, deleteJournalEntry } from "@/services/tradeJournal";
import { JournalEntry } from "@/types/trade-journal";
import { useToast } from "@/hooks/use-toast";

export const TradeHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all");
  const { toast } = useToast();

  useEffect(() => {
    loadJournal();
  }, []);

  const loadJournal = () => {
    setJournalEntries(getJournal());
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (importJournal(result)) {
            loadJournal();
            toast({
              title: "Import Successful",
              description: `Imported ${file.name}`,
            });
          } else {
            toast({
              title: "Import Failed",
              description: "Invalid file format",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const data = exportJournal();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-journal-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: "Trade journal downloaded",
    });
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    loadJournal();
    toast({
      title: "Trade Deleted",
      description: "Trade entry removed from journal",
    });
  };

  const filteredEntries = journalEntries
    .filter(entry => {
      if (filterStatus !== "all" && entry.status !== filterStatus) return false;
      if (searchTerm && !entry.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && !entry.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Trade Journal</h3>
            <p className="text-sm text-muted-foreground">{filteredEntries.length} entries</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleImport}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
              disabled={journalEntries.length === 0}
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
              placeholder="Search by symbol or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const next = filterStatus === "all" ? "open" : filterStatus === "open" ? "closed" : "all";
              setFilterStatus(next);
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            {filterStatus === "all" ? "All" : filterStatus === "open" ? "Open" : "Closed"}
          </Button>
        </div>
        
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No trades in journal yet</p>
            <p className="text-sm text-muted-foreground/70">Executed trades will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Symbol</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Entry/Exit</TableHead>
                  <TableHead className="text-muted-foreground">Lot</TableHead>
                  <TableHead className="text-muted-foreground">Pips</TableHead>
                  <TableHead className="text-muted-foreground">P/L</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">{entry.id.slice(0, 8)}</TableCell>
                    <TableCell className="text-sm text-foreground">{entry.date}</TableCell>
                    <TableCell className="font-medium text-foreground">{entry.symbol}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={entry.type === "buy" 
                          ? "bg-bullish/10 text-bullish border-bullish/20" 
                          : "bg-bearish/10 text-bearish border-bearish/20"
                        }
                      >
                        {entry.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex flex-col text-xs">
                        <span>{entry.entryPrice.toFixed(5)}</span>
                        {entry.exitPrice && (
                          <span className="text-muted-foreground">→ {entry.exitPrice.toFixed(5)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{entry.lotSize}</TableCell>
                    <TableCell className={entry.pips && entry.pips >= 0 ? "text-bullish font-medium" : "text-bearish font-medium"}>
                      {entry.pips ? `${entry.pips >= 0 ? "+" : ""}${entry.pips.toFixed(1)}` : "-"}
                    </TableCell>
                    <TableCell>
                      {entry.profit !== undefined ? (
                        <div className="flex flex-col">
                          <span className={entry.profit >= 0 ? "text-bullish font-medium" : "text-bearish font-medium"}>
                            ${entry.profit >= 0 ? "+" : ""}{entry.profit.toFixed(2)}
                          </span>
                          {entry.profitPercent !== undefined && (
                            <span className={`text-xs ${entry.profit >= 0 ? "text-bullish/70" : "text-bearish/70"}`}>
                              {entry.profitPercent >= 0 ? "+" : ""}{entry.profitPercent.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          entry.status === "open" 
                            ? "bg-primary/10 text-primary border-primary/20"
                            : entry.status === "closed"
                            ? "bg-muted text-muted-foreground border-muted-foreground/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
};
