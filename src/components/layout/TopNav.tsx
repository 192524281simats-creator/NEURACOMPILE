import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Moon, Sun, Bell, Search, User, ChevronRight, HelpCircle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/learn": "Learn",
  "/studio": "Compiler Studio",
  "/xray": "Compiler X-Ray",
  "/parse-tree": "Parse Tree Generator",
  "/ast": "AST Viewer",
  "/first-follow": "FIRST & FOLLOW",
  "/parser-lab": "Parser Lab",
  "/semantic": "Semantic Analyzer",
  "/intermediate": "Intermediate Code",
  "/optimization": "Optimization Lab",
  "/target-code": "Target Code",
  "/error-detective": "Error Detective",
  "/practice": "Practice",
  "/quiz": "Quiz",
  "/viva": "Viva Preparation",
  "/lab-manual": "Lab Manual",
  "/progress": "My Progress",
  "/settings": "Settings",
};

export function TopNav({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const { pathname } = useLocation();
  const { isDark, toggle } = useTheme();
  const [showSearch, setShowSearch] = useState(false);

  const title = PAGE_TITLES[pathname] ?? "NEURACOMPILE";

  return (
    <header className={cn(
      "fixed top-0 right-0 h-14 bg-card border-b border-border flex items-center px-4 gap-4 z-30 transition-all duration-300",
      sidebarCollapsed ? "left-16" : "left-64"
    )}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">Home</Link>
        <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="font-medium text-foreground truncate">{title}</span>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center">
        {showSearch ? (
          <input autoFocus type="text" placeholder="Search topics, concepts..." onBlur={() => setShowSearch(false)}
            className="w-56 px-3 py-1.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        ) : (
          <button onClick={() => setShowSearch(true)} className="p-2 rounded-lg hover:bg-accent transition-colors" title="Search">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg hover:bg-accent transition-colors relative" title="Notifications">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-accent transition-colors" title="Toggle theme">
          {isDark ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
        </button>
        <Link to="/settings" className="p-2 rounded-lg hover:bg-accent transition-colors" title="Profile">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
        </Link>
        <Link to="/learn" className="p-2 rounded-lg hover:bg-accent transition-colors" title="Help">
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
}
