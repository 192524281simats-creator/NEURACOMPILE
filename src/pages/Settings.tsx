import { useTheme } from "@/hooks/useTheme";
import { Settings, Moon, Sun, User, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="p-6 max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="w-6 h-6 text-primary" />Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Customize your NEURACOMPILE experience</p>
      </div>

      <div className="space-y-4">
        {/* Profile */}
        <div className="stat-card gap-4">
          <h2 className="section-header mb-0"><User className="w-4 h-4" />Student Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Display Name</label>
              <input defaultValue="CS Student" className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Institution</label>
              <input defaultValue="University" className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors self-start">
            Save Profile
          </button>
        </div>

        {/* Appearance */}
        <div className="stat-card gap-4">
          <h2 className="section-header mb-0"><Moon className="w-4 h-4" />Appearance</h2>
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
            <div>
              <p className="text-sm font-medium text-foreground">Color Theme</p>
              <p className="text-xs text-muted-foreground">Currently: {isDark ? "Dark" : "Light"} mode</p>
            </div>
            <button onClick={toggle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-sm font-medium">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["Light", "Dark"].map(t => (
              <button key={t} onClick={() => { if ((t === "Dark") !== isDark) toggle(); }}
                className={cn("p-4 rounded-xl border-2 text-sm font-medium transition-all",
                  (t === "Dark") === isDark ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40")}>
                {t === "Dark" ? "🌙" : "☀️"} {t} Mode
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="stat-card gap-4">
          <h2 className="section-header mb-0">Editor Preferences</h2>
          {[
            { label: "Font Size", options: ["12px", "13px", "14px", "16px"], def: "14px" },
            { label: "Tab Size", options: ["2 spaces", "4 spaces", "8 spaces"], def: "4 spaces" },
          ].map(pref => (
            <div key={pref.label} className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <span className="text-sm font-medium text-foreground">{pref.label}</span>
              <select defaultValue={pref.def} className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {pref.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="stat-card gap-3">
          <h2 className="section-header mb-0"><Info className="w-4 h-4" />About NEURACOMPILE</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Version:</span> 1.0.0</p>
            <p><span className="font-medium text-foreground">Purpose:</span> Interactive Compiler Design learning platform for CS students</p>
            <p><span className="font-medium text-foreground">Compiler Engine:</span> TypeScript — runs entirely in your browser</p>
            <p><span className="font-medium text-foreground">Supported languages:</span> LEX/FLEX, C, C++, Python (educational subsets)</p>
            <p className="text-xs">Note: The compiler engine performs educational analysis. It does not execute code on the host system.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
