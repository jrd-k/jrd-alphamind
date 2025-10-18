import { Header } from "@/components/Header";
import { TradeHistory } from "@/components/TradeHistory";
import { JournalStats } from "@/components/JournalStats";

const Journal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trade Journal</h1>
          <p className="text-sm text-muted-foreground">Complete history and analytics of all your trades</p>
        </div>

        <JournalStats />
        <TradeHistory />
      </main>
    </div>
  );
};

export default Journal;
