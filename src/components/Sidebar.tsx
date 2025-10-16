import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Settings, 
  BookOpen,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Live Monitor", url: "/live", icon: Activity },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Broker Connect", url: "/broker-connect", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">THE INSIDER</h2>
            <p className="text-xs text-muted-foreground">AI Trading System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
