import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ChartProvider } from "@/contexts/ChartContext";
import { BrokerProvider } from "@/contexts/BrokerContext";
import { TradingProvider } from "@/contexts/TradingContext";
import Index from "./pages/Index";
import LiveMonitor from "./pages/LiveMonitor";
import Analytics from "./pages/Analytics";
import BrokerConnect from "./pages/BrokerConnect";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChartProvider>
        <BrokerProvider>
          <TradingProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex min-h-screen w-full">
                <Sidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/live" element={<LiveMonitor />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/broker-connect" element={<BrokerConnect />} />
                    <Route path="/install" element={<Install />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </BrowserRouter>
          </TradingProvider>
        </BrokerProvider>
      </ChartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
