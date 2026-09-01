"use client";

import * as React from "react";
import {
  HelpCircle, Search, ArrowRight, CheckCircle2, Target, Lightbulb,
  Users, Layers, ExternalLink, BookOpen, Sparkles, Filter, ChevronRight,
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, FileText, Monitor, Tv,
  GitBranch, Truck, History, Globe, PackageCheck, CalendarCheck,
  CircleDollarSign, GitFork, TrendingUp, Hourglass, Bell, X, ShieldAlert,
  ChevronDown, Flame, Factory,
} from "lucide-react";
import { MODULE_GUIDES, ModuleGuide } from "@/lib/mes/feature-guides";
import { useMESPrefs, ROLES } from "@/lib/mes/store";
import type { MESModule, Role } from "@/lib/mes/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { notifySuccess } from "@/lib/mes/toast";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, Users, FileText, Monitor, Tv,
  BookOpen, GitBranch, Truck, History, Globe, PackageCheck, CalendarCheck,
  CircleDollarSign, GitFork, TrendingUp, Hourglass, Bell, HelpCircle,
};

export function FeatureGuideDrawer() {
  const [open, setOpen] = React.useState(false);
  const [selectedModuleId, setSelectedModuleId] = React.useState<string>("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const { setModule, activeModule } = useMESPrefs();

  // Listen for global custom event to open guide drawer
  React.useEffect(() => {
    const handleOpenGuide = (e: CustomEvent<{ moduleId?: string }>) => {
      const targetId = e.detail?.moduleId || activeModule || "overview";
      setSelectedModuleId(targetId);
      setOpen(true);
    };

    window.addEventListener("mes:open-feature-guide", handleOpenGuide as EventListener);

    // Global keyboard shortcut: Shift + ?
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSelectedModuleId(activeModule || "overview");
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mes:open-feature-guide", handleOpenGuide as EventListener);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModule]);

  const categories = ["All", "Operations", "Quality", "Shop Floor", "Support", "Intelligence"];

  const filteredGuides = React.useMemo(() => {
    return MODULE_GUIDES.filter((g) => {
      if (selectedCategory !== "All" && g.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          g.short.toLowerCase().includes(q) ||
          g.tagline.toLowerCase().includes(q) ||
          g.whatIsItFor.toLowerCase().includes(q) ||
          g.whyItIsUsed.toLowerCase().includes(q) ||
          g.shopFloorScenario.toLowerCase().includes(q) ||
          g.keyCapabilities.some((c) => c.toLowerCase().includes(q)) ||
          g.keyKPIs.some((k) => k.name.toLowerCase().includes(q) || k.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const activeGuide = React.useMemo(() => {
    return MODULE_GUIDES.find((g) => g.id === selectedModuleId) || MODULE_GUIDES[0];
  }, [selectedModuleId]);

  const IconComponent = ICONS[activeGuide.icon] || HelpCircle;

  const handleLaunchModule = () => {
    if (activeGuide.id !== "features-guide") {
      setModule(activeGuide.id as MESModule);
    }
    setOpen(false);
    notifySuccess("Module Launched", `Navigated to ${activeGuide.name}`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-0 flex flex-col h-full bg-card border-l border-border shadow-2xl overflow-hidden"
      >
        {/* Top Header */}
        <SheetHeader className="px-5 sm:px-6 py-4 border-b border-border bg-muted/40 shrink-0 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center bg-primary text-primary-foreground rounded-xl shadow-xs">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {activeGuide.category} Module
                  </span>
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider h-4 px-1.5 border-primary/30 text-primary">
                    ISA-95 Standard
                  </Badge>
                </div>
                <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-0.5">
                  {activeGuide.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground line-clamp-1 font-medium mt-0.5">
                  {activeGuide.tagline}
                </SheetDescription>
              </div>
            </div>

            {/* Launch Action */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleLaunchModule}
                className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
              >
                <span>Launch Screen</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Quick Module Switcher & Filter Bar */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-border bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          {/* Quick Module Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              Switch Guide:
            </span>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="h-8 px-2.5 rounded-md border border-border bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-60"
            >
              {MODULE_GUIDES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.short} · {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Keyword Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features, KPIs, workflows..."
              className="h-8 pl-8 text-xs bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Drawer if Query Active */}
        {searchQuery.trim() && (
          <div className="px-5 sm:px-6 py-2 border-b border-border bg-muted/30 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">
              Matches ({filteredGuides.length}):
            </span>
            {filteredGuides.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setSelectedModuleId(g.id);
                  setSearchQuery("");
                }}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-swiss",
                  activeGuide.id === g.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {g.short}
              </button>
            ))}
          </div>
        )}

        {/* Main Scrollable Manual Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-6 text-left">
          {/* Card 1: Why This Module Is Used (Crucial Business Rationale) */}
          <div className="p-4.5 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Why This Module Is Used & Business Purpose</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/95 leading-relaxed font-medium">
              {activeGuide.whyItIsUsed}
            </p>
          </div>

          {/* Card 2: Realistic Shop-Floor Scenario */}
          {activeGuide.shopFloorScenario && (
            <div className="p-4.5 rounded-xl border border-border bg-muted/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <Factory className="h-4 w-4 text-primary" />
                <span>Shop-Floor Operational Scenario</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic bg-background/60 p-3 rounded-lg border border-border/60">
                "{activeGuide.shopFloorScenario}"
              </p>
            </div>
          )}

          {/* Card 3: What It Is For & Business Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>What This Feature Is For</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeGuide.whatIsItFor}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-success">
                <Target className="h-4 w-4 text-success" />
                <span>Business Impact & Measurable ROI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeGuide.businessImpact}
              </p>
            </div>
          </div>

          {/* Card 4: Step-by-Step Operating Workflow */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Step-by-Step Operating Workflow</span>
            </div>
            <div className="space-y-2.5">
              {activeGuide.howToUseSteps.map((step) => (
                <div
                  key={step.step}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-swiss shadow-xs"
                >
                  <div className="grid h-6 w-6 shrink-0 place-items-center bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-xs">
                    {step.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-foreground">{step.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {step.instruction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Key Capabilities & Sub-Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              <span>Key Capabilities & Sub-Features</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeGuide.keyCapabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-muted/15 text-xs shadow-2xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="leading-snug text-foreground/90 font-medium">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Target Personas & Roles */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>Target Roles & Personas</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeGuide.targetRoles.map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="text-xs font-semibold capitalize px-2.5 py-1 bg-muted/30 border-border text-foreground"
                >
                  {role.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* Card 7: Key KPIs & Benchmark Targets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
              <Target className="h-4 w-4 text-primary" />
              <span>Key Performance Indicators (KPIs) Monitored</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeGuide.keyKPIs.map((kpi, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground">{kpi.name}</span>
                    <Badge variant="outline" className="font-mono font-bold text-xs bg-primary/10 text-primary border-primary/20">
                      {kpi.target}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {kpi.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 8: Shop-Floor Pro-Tips */}
          {activeGuide.proTips.length > 0 && (
            <div className="p-4.5 rounded-xl border border-warning/30 bg-warning/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warning">
                <Lightbulb className="h-4 w-4 text-warning" />
                <span>Shop-Floor Pro-Tips & Best Practices</span>
              </div>
              <ul className="space-y-1.5 pt-1">
                {activeGuide.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                    <span className="text-warning font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Modules */}
          {activeGuide.relatedModules.length > 0 && (
            <div className="pt-3 border-t border-border flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-muted-foreground font-semibold">Related Modules:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeGuide.relatedModules.map((relId) => {
                  const relGuide = MODULE_GUIDES.find((g) => g.id === relId);
                  if (!relGuide) return null;
                  return (
                    <Button
                      key={relId}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedModuleId(relId)}
                      className="h-7 text-xs gap-1 px-2.5 border-border hover:border-primary/50"
                    >
                      <span>{relGuide.short}</span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
