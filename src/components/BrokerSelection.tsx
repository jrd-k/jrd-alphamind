import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BROKER_CONFIGS } from "@/constants/trading";
import { BrokerType } from "@/types/trading";
import { MetaTraderConnect } from "./brokers/MetaTraderConnect";
import { ExnessConnect } from "./brokers/ExnessConnect";
import { JustMarketsConnect } from "./brokers/JustMarketsConnect";
import { DemoConnect } from "./brokers/DemoConnect";

export const BrokerSelection = () => {
  const [selectedBroker, setSelectedBroker] = useState<BrokerType | null>(null);

  if (selectedBroker === "metatrader") return <MetaTraderConnect />;
  if (selectedBroker === "exness") return <ExnessConnect />;
  if (selectedBroker === "justmarkets") return <JustMarketsConnect />;
  if (selectedBroker === "demo") return <DemoConnect />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(BROKER_CONFIGS).map(([key, config]) => (
        <Card
          key={key}
          className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => setSelectedBroker(key as BrokerType)}
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">{config.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
          <div className="space-y-1 mb-4">
            {config.features.map((feature) => (
              <p key={feature} className="text-xs text-muted-foreground">• {feature}</p>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
