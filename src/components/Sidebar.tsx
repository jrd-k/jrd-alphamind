import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Live Monitor", url: "/live", icon: Activity },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Broker Connect", url: "/broker-connect", icon: Settings },
  { title: "Sign In", url: "/auth", icon: LogIn },
];

const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
  <div className="p-4 md:p-6">
    <div className="flex items-center gap-2 mb-6 md:mb-8">
      <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
        <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
      </div>
      <div>
        <h2 className="font-bold text-sm md:text-base text-foreground">THE INSIDER</h2>
        <p className="text-[10px] md:text-xs text-muted-foreground">AI Trading System</p>
      </div>
    </div>

    <nav className="space-y-1 md:space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          end={item.url === "/"}
          onClick={onNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all text-sm md:text-base ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <item.icon className="h-4 w-4 md:h-5 md:w-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  </div>
);

export const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-primary rounded-lg shadow-glow">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground">THE INSIDER</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onNavClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-56 lg:w-64 bg-card border-r border-border min-h-screen flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
};
