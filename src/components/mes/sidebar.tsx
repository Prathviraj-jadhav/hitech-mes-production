"use client";

import * as React from "react";
import {
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, Users, FileText, Bell,
  Star, Monitor, Tv, BookOpen, GitBranch,
  Truck, History, Globe, PackageCheck, CalendarCheck,
  CircleDollarSign, GitFork, TrendingUp, Hourglass,
  ChevronDown, HelpCircle, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { useMESPrefs, MODULES } from "@/lib/mes/store";
import { ROLE_CONFIGS } from "@/lib/mes/role-config";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, Users, FileText, Bell, Monitor,
  Tv, BookOpen, GitBranch, Truck, History, Globe, PackageCheck, CalendarCheck,
  CircleDollarSign, GitFork, TrendingUp, Hourglass, HelpCircle,
};

const MODULE_GROUPS: { label: string; moduleIds: string[] }[] = [
  { label: "Operations", moduleIds: ["overview", "planning", "work-orders", "inventory", "traceability", "wip-aging"] },
  { label: "Quality", moduleIds: ["quality", "cost-quality", "root-cause", "calibration", "documents"] },
  { label: "Shop Floor", moduleIds: ["operator-terminal", "andon", "line-simulator", "iiot", "oee", "shift-handover"] },
  { label: "Support", moduleIds: ["maintenance", "energy", "workforce", "suppliers", "dispatch", "customer-portal"] },
  { label: "Intelligence", moduleIds: ["forecast", "audit-trail", "dashboards", "features-guide"] },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { activeModule, setModule, favorites, toggleFavorite, activeRole, sidebarCollapsed, toggleSidebar } = useMESPrefs();
  const roleConfig = ROLE_CONFIGS[activeRole];
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set());

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Brand Header */}
      <div className={cn(
        "flex h-14 items-center border-b border-border px-3 transition-all",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative grid h-9 w-9 shrink-0 place-items-center bg-primary text-primary-foreground rounded-lg">
            <span className="text-base font-black tracking-tighter">H</span>
            <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success border-2 border-sidebar" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col leading-none truncate">
              <span className="text-[13px] font-bold tracking-tight text-foreground truncate">Hi-Tech Radiators</span>
              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-primary mt-0.5">MES Platform</span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button (Desktop) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "h-7 w-7 p-0 text-muted-foreground hover:text-foreground hidden md:flex shrink-0",
            sidebarCollapsed && "hidden"
          )}
          title="Collapse sidebar (expand workspace)"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 px-1">
        <nav className="flex flex-col gap-0.5 px-1">
          {MODULE_GROUPS.map((group) => {
            const groupModules = MODULES.filter((m) =>
              group.moduleIds.includes(m.id) && roleConfig.allowedModules.includes(m.id)
            );
            if (groupModules.length === 0) return null;
            const isCollapsed = collapsedGroups.has(group.label);
            const hasActive = groupModules.some((m) => m.id === activeModule);

            return (
              <div key={group.label} className="mb-1">
                {/* Group Heading (only in expanded mode) */}
                {!sidebarCollapsed ? (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
                      hasActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={cn("h-3 w-3 transition-transform", isCollapsed && "rotate-[-90deg]")}
                    />
                  </button>
                ) : (
                  <div className="my-1.5 border-t border-border/50 mx-2" />
                )}

                {(!isCollapsed || sidebarCollapsed) && (
                  <div className="flex flex-col gap-0.5">
                    {groupModules.map((mod) => {
                      const Icon = ICONS[mod.icon] || LayoutDashboard;
                      const isActive = activeModule === mod.id;
                      const isFav = favorites.includes(mod.id);

                      if (sidebarCollapsed) {
                        return (
                          <button
                            key={mod.id}
                            onClick={() => {
                              setModule(mod.id);
                              onNavigate?.();
                            }}
                            title={`${mod.name} (${mod.short})`}
                            className={cn(
                              "group relative grid h-10 w-full place-items-center rounded-lg transition-swiss",
                              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive
                                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Icon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                            {isActive && (
                              <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 bg-primary-foreground rounded-r" />
                            )}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={mod.id}
                          onClick={() => {
                            setModule(mod.id);
                            onNavigate?.();
                          }}
                          className={cn(
                            "group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-swiss",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-swiss",
                              !isActive && "group-hover:scale-110"
                            )}
                          />
                          <span className="flex-1 text-left truncate">{mod.short}</span>
                          {isFav && (
                            <Star
                              className="h-3 w-3 fill-primary text-primary opacity-60"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(mod.id);
                              }}
                            />
                          )}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-primary-foreground rounded-r" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Guide CTA Footer */}
      <div className="p-2 border-t border-border bg-sidebar-accent/30">
        {sidebarCollapsed ? (
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("mes:open-feature-guide", { detail: { moduleId: activeModule } })
              );
              onNavigate?.();
            }}
            title="How to Use & Operations Guide (Shift+?)"
            className="grid h-10 w-full place-items-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-swiss"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("mes:open-feature-guide", { detail: { moduleId: activeModule } })
              );
              onNavigate?.();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-swiss"
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left truncate">How to Use & Guide</span>
            <span className="text-[10px] uppercase font-mono px-1 rounded bg-primary/20 text-primary font-bold">
              Shift+?
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
