"use client";

import * as React from "react";
import {
  Search, Bell, Sun, Moon, Grid3x3, Settings2,
  Check, ChevronDown, Building2, UserCog, Clock,
  Command, AlertTriangle, Menu, HelpCircle, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useMESPrefs, PLANTS, ROLES, MODULES } from "@/lib/mes/store";
import type { PlantCode, Role } from "@/lib/mes/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useMESDataStore } from "@/lib/mes/data-store";

const TIME_RANGES = [
  { id: "shift", label: "This shift" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "quarter", label: "This quarter" },
] as const;

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const {
    activePlant, setPlant, activeRole, setRole,
    timeRange, setTimeRange,
    showGrid, toggleGrid, searchQuery, setSearch,
    setModule, sidebarCollapsed, toggleSidebar,
  } = useMESPrefs();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { alerts } = useMESDataStore();
  const criticalAlerts = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;
  const warningAlerts = alerts.filter(a => a.severity === "warning" && !a.acknowledged).length;

  // Global search suggestions
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results: { type: string; label: string; action: () => void }[] = [];
    // Module suggestions
    MODULES.forEach(m => {
      if (m.name.toLowerCase().includes(q) || m.short.toLowerCase().includes(q)) {
        results.push({ type: "Module", label: m.name, action: () => setModule(m.id) });
      }
    });
    return results.slice(0, 5);
  }, [searchQuery, setModule]);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("mes:open-command-palette"));
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 sm:px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="h-9 w-9 p-0 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop Sidebar Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="h-9 w-9 p-0 hidden md:flex text-muted-foreground hover:text-foreground"
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </Button>
      
      {/* Global Search - prominent, Swiss style */}
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search modules, serials, work orders..."
          className="h-9 pl-9 pr-12 sm:pr-20 text-sm bg-muted/40 border-border focus-visible:border-primary focus-visible:ring-primary/20"
        />
        <button
          onClick={openCommandPalette}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-swiss"
        >
          <Command className="h-2.5 w-2.5" />
          <span>K</span>
        </button>
        {/* Search suggestions dropdown */}
        {searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border bg-popover shadow-lg z-50 overflow-hidden">
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              Quick Results
            </div>
            {searchSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { s.action(); setSearch(""); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-swiss text-left"
              >
                <Badge variant="secondary" className="text-[9px] h-4 px-1 font-bold uppercase">{s.type}</Badge>
                <span className="flex-1 truncate">{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Plant switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 font-medium px-2 sm:px-3">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="tabular-nums hidden sm:inline">{activePlant === "ALL" ? "All Plants" : activePlant}</span>
              <span className="tabular-nums sm:hidden">{activePlant}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider">Plant scope</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={activePlant} onValueChange={(v) => setPlant(v as PlantCode | "ALL")}>
              <DropdownMenuRadioItem value="ALL" className="gap-2">
                <span className="font-semibold">All Plants</span>
                <span className="ml-auto text-[10px] text-muted-foreground">5 sites</span>
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {PLANTS.map((p) => (
                <DropdownMenuRadioItem key={p.code} value={p.code} className="gap-2">
                  <span className="font-mono font-semibold">{p.code}</span>
                  <span className="text-xs text-muted-foreground truncate flex-1">{p.role}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 font-medium hidden md:flex">
              <UserCog className="h-4 w-4 text-primary" />
              <span className="capitalize">{ROLES.find(r => r.id === activeRole)?.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider">View as role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLES.map((r) => (
              <DropdownMenuItem
                key={r.id}
                onClick={() => setRole(r.id as Role)}
                className={cn("flex flex-col items-start gap-0.5 py-2", activeRole === r.id && "bg-accent")}
              >
                <span className="text-sm font-semibold">{r.name}</span>
                <span className="text-[11px] text-muted-foreground">{r.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time range */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 font-medium hidden lg:flex">
              <Clock className="h-4 w-4 text-primary" />
              <span>{TIME_RANGES.find(t => t.id === timeRange)?.label}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
              {TIME_RANGES.map((t) => (
                <DropdownMenuRadioItem key={t.id} value={t.id}>{t.label}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Grid toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleGrid}
          className={cn("h-9 w-9 p-0 hidden sm:flex", showGrid && "bg-accent border-primary")}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>

        {/* Theme toggle */}
        {mounted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 p-0"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        {/* Notifications - opens drawer with red alert badge */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.dispatchEvent(new CustomEvent("mes:open-notif-drawer"))}
          className="h-9 w-9 p-0 relative"
        >
          <Bell className="h-4 w-4" />
          {criticalAlerts > 0 && (
            <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground pulse-alert">
              {criticalAlerts}
            </span>
          )}
          {criticalAlerts === 0 && warningAlerts > 0 && (
            <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-warning px-1 text-[9px] font-bold text-warning-foreground">
              {warningAlerts}
            </span>
          )}
        </Button>

        {/* Feature Guide Help Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.dispatchEvent(new CustomEvent("mes:open-feature-guide"))}
          className="h-9 gap-1.5 px-2.5 font-semibold text-xs text-primary border-primary/30 hover:bg-primary/10 transition-swiss"
          title="Open Features & Operations Guide (Shift+?)"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden xl:inline">Guide</span>
        </Button>

        {/* Settings */}
        <Button variant="outline" size="sm" className="h-9 w-9 p-0 hidden sm:flex" onClick={() => {
          // Dispatch event to open settings (could open a dialog)
          window.dispatchEvent(new CustomEvent("mes:open-command-palette"));
        }}>
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
