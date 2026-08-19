import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { cn } from "@/lib/utils";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <TopNav sidebarCollapsed={collapsed} />
      <main className={cn(
        "pt-14 min-h-screen transition-all duration-300",
        collapsed ? "pl-16" : "pl-64"
      )}>
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
