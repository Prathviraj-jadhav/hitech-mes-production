"use client";

import * as React from "react";
import {
  HelpCircle, Search, ArrowRight, CheckCircle2, Target, Lightbulb,
  Users, Layers, ExternalLink, BookOpen, Sparkles, Filter, ChevronRight,
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, FileText, Monitor, Tv,
  GitBranch, Truck, History, Globe, PackageCheck, CalendarCheck,
  CircleDollarSign, GitFork, TrendingUp, Hourglass, Bell, Shield,
  Layers3, BarChart3, CheckSquare, Compass, Award,
} from "lucide-react";
import { MODULE_GUIDES, ModuleGuide } from "@/lib/mes/feature-guides";
import { useMESPrefs, ROLES, MODULES } from "@/lib/mes/store";
import type { MESModule, Role } from "@/lib/mes/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { notifySuccess } from "@/lib/mes/toast";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, Users, FileText, Monitor, Tv,
  BookOpen, GitBranch, Truck, History, Globe, PackageCheck, CalendarCheck,
  CircleDollarSign, GitFork, TrendingUp, Hourglass, Bell, HelpCircle,
};

export function FeaturesGuideModule() {
  const { setModule, activeRole, setRole } = useMESPrefs();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedRole, setSelectedRole] = React.useState<string>("all");
  const [activeGuideId, setActiveGuideId] = React.useState<string>("overview");

  const categories = ["All", "Operations", "Quality", "Shop Floor", "Support", "Intelligence"];

  const filteredGuides = React.useMemo(() => {
    return MODULE_GUIDES.filter((g) => {
      if (g.id === "features-guide") return false; // hide self from directory
      if (selectedCategory !== "All" && g.category !== selectedCategory) return false;
      if (selectedRole !== "all" && !g.targetRoles.includes(selectedRole as Role)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          g.short.toLowerCase().includes(q) ||
          g.tagline.toLowerCase().includes(q) ||
          g.whatIsItFor.toLowerCase().includes(q) ||
          g.businessImpact.toLowerCase().includes(q) ||
          g.keyCapabilities.some((c) => c.toLowerCase().includes(q)) ||
          g.keyKPIs.some((k) => k.name.toLowerCase().includes(q) || k.description.toLowerCase().includes(q)) ||
          g.proTips.some((p) => p.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, selectedRole, searchQuery]);

  const activeGuide = React.useMemo(() => {
    return MODULE_GUIDES.find((g) => g.id === activeGuideId) || MODULE_GUIDES[0];
  }, [activeGuideId]);

  const ActiveIcon = ICONS[activeGuide.icon] || HelpCircle;

  const launchModule = (modId: string) => {
    if (modId !== "features-guide") {
      setModule(modId as MESModule);
      notifySuccess("Module Launched", `Opened ${activeGuide.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center bg-primary text-primary-foreground rounded-2xl shadow-sm">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Platform Operations Manual
              </span>
              <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider h-4">
                ISA-95 / MESA-11
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">
              Features & Operational User Guide
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Complete reference manual for all 26 Hi-Tech MES modules: what each feature is for, business value, step-by-step operating workflows, role assignments, and key KPI targets.
            </p>
          </div>
        </div>

        {/* High-level stats pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-bold">26</span>
            <span className="text-muted-foreground">Modules</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-bold">8</span>
            <span className="text-muted-foreground">Role Profiles</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-bold">75+</span>
            <span className="text-muted-foreground">KPI Benchmarks</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 border-border bg-card/80 backdrop-blur">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module name, feature, KPI, defect, or workflow..."
              className="h-9 pl-9 text-xs bg-muted/30"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden lg:inline">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-swiss",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline">
              Role:
            </span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-9 px-2.5 rounded-md border border-border bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Roles (Any)</option>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Split Layout: Module Directory + Detailed Manual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Module Directory List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            <span>Modules Directory ({filteredGuides.length})</span>
            <span>Click to View Guide</span>
          </div>

          <div className="space-y-2 max-h-[780px] overflow-y-auto pr-1">
            {filteredGuides.map((guide) => {
              const Icon = ICONS[guide.icon] || HelpCircle;
              const isActive = activeGuide.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setActiveGuideId(guide.id)}
                  className={cn(
                    "p-3.5 rounded-xl border transition-swiss cursor-pointer text-left group",
                    isActive
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-swiss",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground truncate">
                          {guide.name}
                        </span>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase h-4 px-1.5 border-border">
                          {guide.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-medium">
                        {guide.tagline}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {guide.targetRoles.slice(0, 3).map((r) => (
                          <span
                            key={r}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground font-medium capitalize"
                          >
                            {r.replace("-", " ")}
                          </span>
                        ))}
                        {guide.targetRoles.length > 3 && (
                          <span className="text-[9px] text-muted-foreground font-semibold">
                            +{guide.targetRoles.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredGuides.length === 0 && (
              <Card className="p-8 text-center text-xs text-muted-foreground">
                No modules match your current search and role filters.
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: In-Depth Operational Manual */}
        <div className="lg:col-span-7">
          <Card className="p-6 border-border bg-card shadow-sm space-y-6">
            {/* Guide Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
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

              <Button
                size="sm"
                onClick={() => launchModule(activeGuide.id)}
                className="gap-1.5 h-8 font-semibold shadow-xs"
              >
                <span>Launch Module</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Section 1: What is it for & Business Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span>What This Feature Is For</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeGuide.whatIsItFor}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Business Impact & ROI</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                  {activeGuide.businessImpact}
                </p>
              </div>
            </div>

            {/* Section 2: Roles & Personas */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>Primary Target Personas</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeGuide.targetRoles.map((role) => (
                  <Badge key={role} variant="outline" className="text-xs font-semibold capitalize px-2.5 py-1 bg-background border-border">
                    {role.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Section 3: Step-by-Step How to Use Workflow */}
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

            {/* Section 4: Key Capabilities */}
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

            {/* Section 5: Key KPIs Monitored */}
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

            {/* Section 6: Pro-Tips */}
            {activeGuide.proTips.length > 0 && (
              <div className="p-4 rounded-xl border border-warning/30 bg-warning/5 space-y-2">
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

            {/* Related Modules Quick Links */}
            {activeGuide.relatedModules.length > 0 && (
              <div className="pt-2 border-t border-border flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-muted-foreground font-semibold">Related Modules:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeGuide.relatedModules.map((relId) => {
                    const relGuide = MODULE_GUIDES.find((g) => g.id === relId);
                    if (!relGuide) return null;
                    return (
                      <Button
                        key={relId}
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveGuideId(relId)}
                        className="h-7 text-xs gap-1 px-2 border-border"
                      >
                        <span>{relGuide.short}</span>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
