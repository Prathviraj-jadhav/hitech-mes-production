"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle, Search, ArrowRight, CheckCircle2, Target, Lightbulb,
  Users, Layers, ExternalLink, BookOpen, Sparkles, X, ChevronRight,
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, FileText, Monitor, Tv,
  GitBranch, Truck, History, Globe, PackageCheck, CalendarCheck,
  CircleDollarSign, GitFork, TrendingUp, Hourglass, Bell,
} from "lucide-react";
import { MODULE_GUIDES, ModuleGuide } from "@/lib/mes/feature-guides";
import { useMESPrefs, MODULES } from "@/lib/mes/store";
import type { MESModule } from "@/lib/mes/types";
import { cn } from "@/lib/utils";
import { notifySuccess } from "@/lib/mes/toast";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, Users, FileText, Monitor, Tv,
  BookOpen, GitBranch, Truck, History, Globe, PackageCheck, CalendarCheck,
  CircleDollarSign, GitFork, TrendingUp, Hourglass, Bell, HelpCircle,
};

export function FeatureGuideModal() {
  const { activeModule, setModule } = useMESPrefs();
  const [open, setOpen] = React.useState(false);
  const [selectedModuleId, setSelectedModuleId] = React.useState<string>(activeModule);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  React.useEffect(() => {
    const handleOpen = (e: CustomEvent<{ moduleId?: string }>) => {
      if (e.detail?.moduleId) {
        setSelectedModuleId(e.detail.moduleId);
      } else {
        setSelectedModuleId(activeModule);
      }
      setOpen(true);
    };

    window.addEventListener("mes:open-feature-guide" as any, handleOpen);
    return () => window.removeEventListener("mes:open-feature-guide" as any, handleOpen);
  }, [activeModule]);

  // Keep selectedModuleId in sync with activeModule when opened
  React.useEffect(() => {
    if (open && !selectedModuleId) {
      setSelectedModuleId(activeModule);
    }
  }, [open, activeModule, selectedModuleId]);

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
          g.keyCapabilities.some((c) => c.toLowerCase().includes(q)) ||
          g.keyKPIs.some((k) => k.name.toLowerCase().includes(q) || k.description.toLowerCase().includes(q)) ||
          g.proTips.some((p) => p.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const activeGuide = React.useMemo(() => {
    return (
      MODULE_GUIDES.find((g) => g.id === selectedModuleId) ||
      MODULE_GUIDES.find((g) => g.id === activeModule) ||
      MODULE_GUIDES[0]
    );
  }, [selectedModuleId, activeModule]);

  const ActiveIcon = ICONS[activeGuide.icon] || HelpCircle;

  const launchModule = (modId: string) => {
    if (modId !== "features-guide") {
      setModule(modId as MESModule);
    }
    setOpen(false);
    notifySuccess("Navigated", `Switched to ${activeGuide.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[96vw] sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center bg-primary text-primary-foreground rounded-xl shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">
                  MES Features & Operations Guide
                </DialogTitle>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30 hidden sm:inline-flex">
                  Interactive Manual
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Comprehensive operational guides, step-by-step workflows & KPI benchmarks for all 26 MES modules
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Main Content Area: Sidebar list + Detail Pane */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Column: Module Search & Directory */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-muted/20 flex flex-col shrink-0 max-h-48 md:max-h-none">
            {/* Search Box */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search features, KPIs, terms..."
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

              {/* Category Pills */}
              <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition-swiss",
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules List */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                {filteredGuides.map((guide) => {
                  const Icon = ICONS[guide.icon] || HelpCircle;
                  const isSelected = activeGuide.id === guide.id;
                  return (
                    <button
                      key={guide.id}
                      onClick={() => setSelectedModuleId(guide.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-swiss text-xs",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                          : "hover:bg-accent hover:text-accent-foreground text-foreground"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary-foreground" : "text-primary")} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{guide.name}</div>
                        <div className={cn("text-[10px] truncate", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                          {guide.tagline}
                        </div>
                      </div>
                      <ChevronRight className={cn("h-3.5 w-3.5 opacity-50 shrink-0", isSelected && "opacity-100")} />
                    </button>
                  );
                })}

                {filteredGuides.length === 0 && (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No guides match "{searchQuery}"
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Column: Active Module Guide Deep Dive */}
          <div className="flex-1 flex flex-col overflow-hidden bg-card">
            {/* Guide Title Banner */}
            <div className="px-6 py-4 border-b border-border bg-background/50 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center bg-primary/10 text-primary border border-primary/20 rounded-xl">
                  <ActiveIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {activeGuide.category} Module
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-semibold h-4 px-1.5">
                      {activeGuide.short}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                    {activeGuide.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {activeGuide.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => launchModule(activeGuide.id)}
                  className="gap-1.5 h-8 font-semibold shadow-xs"
                >
                  <span>Open in App</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Guide Tabs & Body */}
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-4xl space-y-6">
                {/* What This Feature Is For & Business Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span>What This Feature Is For</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {activeGuide.whatIsItFor}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>Business & Manufacturing Impact</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                      {activeGuide.businessImpact}
                    </p>
                  </div>
                </div>

                {/* Target Roles & Personas */}
                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Primary User Personas & Roles</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeGuide.targetRoles.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs font-semibold capitalize px-2.5 py-1 bg-muted/50 border-border">
                        {role.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Key Capabilities */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <Layers className="h-4 w-4 text-primary" />
                    <span>Key Capabilities & Sub-Features</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeGuide.keyCapabilities.map((cap, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-muted/10 text-xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span className="leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step "How to Use" Workflow */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Step-by-Step Operational Workflow</span>
                  </div>
                  <div className="space-y-2">
                    {activeGuide.howToUseSteps.map((step) => (
                      <div
                        key={step.step}
                        className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card hover:border-primary/40 transition-swiss"
                      >
                        <div className="grid h-6 w-6 shrink-0 place-items-center bg-primary text-primary-foreground rounded-full text-xs font-bold">
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

                {/* Key Performance Indicators (KPIs) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <Target className="h-4 w-4 text-primary" />
                    <span>Key Performance Indicators (KPIs) Monitored</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeGuide.keyKPIs.map((kpi, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-border bg-muted/20 flex flex-col justify-between gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{kpi.name}</span>
                          <Badge variant="outline" className="font-mono font-bold text-xs bg-primary/10 text-primary border-primary/20">
                            Target: {kpi.target}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {kpi.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro-Tips & Best Practices */}
                {activeGuide.proTips.length > 0 && (
                  <div className="p-4 rounded-xl border border-warning/30 bg-warning/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warning">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      <span>Pro-Tips & Shop-Floor Best Practices</span>
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
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
