import { Header } from "@/components/Header";
import { BrokerSelection } from "@/components/BrokerSelection";

const BrokerConnect = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Connect Broker</h2>
          <p className="text-sm text-muted-foreground">Connect your trading account to execute trades</p>
        </div>
        <BrokerSelection />
      </main>
    </div>
  );
};

export default BrokerConnect;
