import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BookOpen, Code2, Zap, GitBranch, TreePine, Calculator,
  FlaskConical, BrainCircuit, FileCode, Gauge, Cpu, Bug, Dumbbell,
  HelpCircle, MessageSquare, ScrollText, TrendingUp, Settings, ChevronLeft,
  ChevronRight, GraduationCap
} from "lucide-react";

const NAV_ITEMS = [
  { group: "Main", items: [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/learn", label: "Learn", icon: BookOpen },
  ]},
  { group: "Compiler", items: [
    { path: "/studio", label: "Compiler Studio", icon: Code2 },
    { path: "/xray", label: "Compiler X-Ray", icon: Zap },
    { path: "/parse-tree", label: "Parse Tree", icon: GitBranch },
    { path: "/ast", label: "AST Viewer", icon: TreePine },
    { path: "/first-follow", label: "FIRST & FOLLOW", icon: Calculator },
    { path: "/parser-lab", label: "Parser Lab", icon: FlaskConical },
    { path: "/semantic", label: "Semantic Analyzer", icon: BrainCircuit },
    { path: "/intermediate", label: "Intermediate Code", icon: FileCode },
    { path: "/optimization", label: "Optimization Lab", icon: Gauge },
    { path: "/target-code", label: "Target Code", icon: Cpu },
    { path: "/error-detective", label: "Error Detective", icon: Bug },
  ]},
  { group: "Practice", items: [
    { path: "/practice", label: "Practice", icon: Dumbbell },
    { path: "/quiz", label: "Quiz", icon: HelpCircle },
    { path: "/viva", label: "Viva Prep", icon: MessageSquare },
    { path: "/lab-manual", label: "Lab Manual", icon: ScrollText },
  ]},
  { group: "Account", items: [
    { path: "/progress", label: "Progress", icon: TrendingUp },
    { path: "/settings", label: "Settings", icon: Settings },
  ]},
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { pathname } = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 h-14 border-b border-border shrink-0", collapsed && "justify-center px-0")}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm text-foreground tracking-tight">NEURACOMPILE</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_ITEMS.map(group => (
          <div key={group.group}>
            {!collapsed && (
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.group}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}
                    className={cn("sidebar-item", active && "active", collapsed && "justify-center px-0 w-10 h-10 mx-auto")}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border">
        <button onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-accent transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
