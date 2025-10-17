import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_SAFETY_SETTINGS } from "@/constants/trading";
import { SafetySettings as SafetySettingsType } from "@/types/trading";
import { Shield, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const SafetySettings = () => {
  const [settings, setSettings] = useState<SafetySettingsType>(DEFAULT_SAFETY_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("safetySettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("safetySettings", JSON.stringify(settings));
    toast.success("Safety settings saved");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SAFETY_SETTINGS);
    localStorage.removeItem("safetySettings");
    toast.success("Settings reset to defaults");
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Safety Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="dailyLoss">Daily Loss Limit ($)</Label>
            <Input
              id="dailyLoss"
              type="number"
              value={settings.dailyLossLimit}
              onChange={(e) =>
                setSettings({ ...settings, dailyLossLimit: parseFloat(e.target.value) })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              Trading stops when daily loss reaches this amount
            </p>
          </div>

          <div>
            <Label htmlFor="maxPosition">Maximum Position Size (lots)</Label>
            <Input
              id="maxPosition"
              type="number"
              step="0.01"
              value={settings.maxPositionSize}
              onChange={(e) =>
                setSettings({ ...settings, maxPositionSize: parseFloat(e.target.value) })
              }
            />
          </div>

          <div>
            <Label htmlFor="maxTrades">Maximum Concurrent Trades</Label>
            <Input
              id="maxTrades"
              type="number"
              value={settings.maxConcurrentTrades}
              onChange={(e) =>
                setSettings({ ...settings, maxConcurrentTrades: parseInt(e.target.value) })
              }
            />
          </div>

          <div>
            <Label htmlFor="maxRisk">Maximum Risk Per Trade (%)</Label>
            <Input
              id="maxRisk"
              type="number"
              step="0.1"
              value={settings.maxRiskPerTrade}
              onChange={(e) =>
                setSettings({ ...settings, maxRiskPerTrade: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div>
              <Label htmlFor="tradingHours">Restrict Trading Hours</Label>
              <p className="text-xs text-muted-foreground">Only trade during specific hours</p>
            </div>
            <Switch
              id="tradingHours"
              checked={settings.tradingHoursEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, tradingHoursEnabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div>
              <Label htmlFor="newsFilter">News Event Filter</Label>
              <p className="text-xs text-muted-foreground">Pause trading during major news</p>
            </div>
            <Switch
              id="newsFilter"
              checked={settings.newsFilterEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, newsFilterEnabled: checked })
              }
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} className="flex-1">
            <Shield className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
