import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Download, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="h-8 w-8 text-primary" />
            <CardTitle>Install moneee App</CardTitle>
          </div>
          <CardDescription>
            Install our trading bot on your device for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Check className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Already Installed!</h3>
                <p className="text-sm text-muted-foreground">
                  The app is already installed on your device. You can access it from your home screen.
                </p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <Download className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Quick Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Add to your home screen for instant access
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Works Offline</h4>
                    <p className="text-sm text-muted-foreground">
                      Access your trading data even without internet
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Native Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      Feels like a native mobile app
                    </p>
                  </div>
                </div>
              </div>

              {deferredPrompt ? (
                <Button onClick={handleInstallClick} className="w-full" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Install App
                </Button>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    To install this app:
                  </p>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">On iPhone/iPad:</p>
                    <p>Tap the Share button, then "Add to Home Screen"</p>
                    <p className="font-medium mt-3">On Android:</p>
                    <p>Tap the menu button, then "Add to Home Screen" or "Install App"</p>
                  </div>
                  <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;