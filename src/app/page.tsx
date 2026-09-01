"use client";

import * as React from "react";
import { Sidebar } from "@/components/mes/sidebar";
import { Topbar } from "@/components/mes/topbar";
import { Footer } from "@/components/mes/footer";
import { useMESPrefs, PLANTS } from "@/lib/mes/store";
import { ROLE_CONFIGS } from "@/lib/mes/role-config";
import {
  KPIS, WORK_ORDERS, MACHINES, ALERTS, PLANT_KPIS,
  OEE_TREND_24H, SIX_BIG_LOSSES, ENERGY_TREND, OPERATORS_DATA,
  QUALITY_RECORDS, INVENTORY, MAINTENANCE, TRACE_EVENTS, DOCUMENTS,
  NCRS, SHIFT_HANDOVER, PRODUCTION_LINES, ANDON_BOARDS,
  SUPPLIERS, AUDIT_TRAIL, CUSTOMER_ORDERS, KPI_BREAKDOWNS,
  SHIPMENTS, CALIBRATION_ITEMS,
  COST_OF_QUALITY, ROOT_CAUSES,
  FORECAST_SCENARIOS, WIP_ITEMS,
} from "@/lib/mes/seed";
import {
  KPICard, Sparkline, StatusDot, QualityBadge, WOStatusBadge,
  PriorityMark, PanelHeader, SectionTitle, MonoProgress, OEEGauge, MonoTag,
  Skeleton, EmptyState, LiveTicker, StatusPill, MiniBars, RingProgress, Divider,
  AlertCard, PressButton, HoverRow,
} from "@/components/mes/ui";
import { PageTransition, AnimatedValue, useGsapReveal } from "@/components/mes/gsap-provider";
import {
  Activity, AlertTriangle, ArrowUpRight, Boxes, CalendarRange, Cpu,
  Factory, FileText, Gauge, ShieldCheck, TrendingUp, Users, Wrench, Zap,
  Workflow, ClipboardList, ChevronRight, Search, Download, Filter,
  Layers, MapPin, Clock, CircleDot, BarChart3,
  Play, Pause, Square, Hand, Printer, Edit3, Ban, CheckCircle2,
  Monitor, Package, AlertOctagon, Timer, Hash, User, IdCard,
  Tv, BookOpen, GitBranch, ArrowRight, ArrowLeft, Maximize2,
  Flag, MessageSquare, ThumbsUp, Megaphone, CircleAlert,
  Settings, Plus, X, ChevronDown, MoreHorizontal, Eye, RefreshCw,
  Circle, Dot, ArrowDownToLine, ArrowUpFromLine, Radio, Waves,
  Truck, History, Globe, Star, Award, ShieldAlert, FileCheck,
  ExternalLink, Building, MapPinned, Calendar, PackageCheck,
  ClipboardCheck, Lock, Fingerprint, Network, TrendingDown,
  Route, Navigation, CalendarCheck, CalendarDays, Gauge as GaugeIcon,
  Thermometer, Ruler, Zap as ZapIcon, Wrench as WrenchIcon,
  CircleDollarSign, GitFork, HelpCircle, Target, TrendingDown as TrendingDownIcon,
  Fish, Search as SearchIcon, Lightbulb, ArrowDownCircle,
  Hourglass, AlertTriangle as AlertTriangleIcon, Layers3, Workflow as WorkflowIcon,
  Zap as ZapIcon2, TrendingUp as TrendingUpIcon, ArrowRightCircle,
  LayoutDashboard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { CommandPalette } from "@/components/mes/command-palette";
import { NotificationDrawer } from "@/components/mes/notification-drawer";
import { FeatureGuideModal } from "@/components/mes/feature-guide-modal";
import { FeaturesGuideModule } from "@/components/mes/features-guide-module";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { notifyAction, notifySuccess, notifyInfo } from "@/lib/mes/toast";
import { formatTime, formatDateTime, formatDate, formatDateYear, formatDateShort, formatDateWeekday, formatMonthYear } from "@/lib/mes/date-utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity, AlertTriangle, ArrowUpRight, Boxes, CalendarRange, Cpu,
  Factory, FileText, Gauge, ShieldCheck, TrendingUp, Users, Wrench, Zap,
  Workflow, ClipboardList, ChevronRight, Search, Download, Filter,
  Layers, MapPin, Clock, CircleDot, BarChart3, Play, Pause, Square,
  Monitor, Package, AlertOctagon, Tv, BookOpen, GitBranch, Truck,
  History, Globe, PackageCheck, CalendarCheck, CircleDollarSign,
  GitFork, TrendingUp, Hourglass, LayoutDashboard, CalendarRange,
};

export default function Home() {
  const {
    activePlant, activeModule, density, showGrid, searchQuery, activeRole,
  } = useMESPrefs();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const filteredWorkOrders = React.useMemo(() => {
    return WORK_ORDERS.filter((w) => {
      if (activePlant !== "ALL" && w.plant !== activePlant) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return w.id.toLowerCase().includes(q) || w.orderNo.toLowerCase().includes(q) ||
               w.product.toLowerCase().includes(q) || w.customer.toLowerCase().includes(q) ||
               (w.heatNumber || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [activePlant, searchQuery]);

  const filteredMachines = React.useMemo(() => {
    return MACHINES.filter((m) => activePlant === "ALL" || m.plant === activePlant);
  }, [activePlant]);

  const densityClass = `density-${density}`;

  return (
    <div className={cn("flex h-screen w-full overflow-hidden bg-background", densityClass)}>
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileSidebarOpen(false)}
      />
      <div className={cn(
        "fixed z-50 h-full transition-transform md:relative md:translate-x-0",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className={cn(
          "flex-1 overflow-y-auto",
          showGrid && "bg-grid"
        )}>
          {activeModule === "operator-terminal" ? (
            <OperatorTerminalModule />
          ) : (
            <PageTransition moduleKey={activeModule}>
              <div className="mx-auto w-full max-w-[1920px] p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8 2xl:px-10">
                {activeModule === "overview" && <OverviewModule />}
              {activeModule === "planning" && <PlanningModule />}
              {activeModule === "work-orders" && <WorkOrdersModule workOrders={filteredWorkOrders} />}
              {activeModule === "inventory" && <InventoryModule />}
              {activeModule === "quality" && <QualityModule />}
              {activeModule === "traceability" && <TraceabilityModule />}
              {activeModule === "iiot" && <IIoTModule machines={filteredMachines} />}
              {activeModule === "oee" && <OEEModule />}
              {activeModule === "maintenance" && <MaintenanceModule />}
              {activeModule === "energy" && <EnergyModule />}
              {activeModule === "workforce" && <WorkforceModule />}
              {activeModule === "documents" && <DocumentsModule />}
              {activeModule === "andon" && <AndonModule />}
              {activeModule === "shift-handover" && <ShiftHandoverModule />}
              {activeModule === "line-simulator" && <LineSimulatorModule />}
              {activeModule === "suppliers" && <SuppliersModule />}
              {activeModule === "audit-trail" && <AuditTrailModule />}
              {activeModule === "customer-portal" && <CustomerPortalModule />}
              {activeModule === "dispatch" && <DispatchModule />}
              {activeModule === "calibration" && <CalibrationModule />}
              {activeModule === "cost-quality" && <CostOfQualityModule />}
              {activeModule === "root-cause" && <RootCauseModule />}
              {activeModule === "forecast" && <ForecastModule />}
              {activeModule === "wip-aging" && <WIPAgingModule />}
              {activeModule === "dashboards" && <DashboardsModule />}
              {activeModule === "features-guide" && <FeaturesGuideModule />}
              </div>
            </PageTransition>
          )}
        </main>
        <Footer />
      </div>
      <CommandPalette />
      <NotificationDrawer />
      <FeatureGuideModal />
    </div>
  );
}

/* ===================================================================
   KPI DRILL-DOWN DIALOG
   =================================================================== */
function KPIDrillDialog({ kpiLabel, onClose }: { kpiLabel: string | null; onClose: () => void }) {
  const kpi = KPIS.find(k => k.label === kpiLabel);
  const breakdown = kpiLabel ? KPI_BREAKDOWNS[kpiLabel] : undefined;
  const lowerBetter = kpiLabel && ["Scrap Rate", "Downtime (min)", "Open NCRs"].includes(kpiLabel);

  return (
    <Dialog open={!!kpiLabel} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            KPI Drill-down · {kpiLabel}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Breakdown by contributing source · target {kpi?.target}{kpi?.unit} · current {kpi?.value}{kpi?.unit}
          </DialogDescription>
        </DialogHeader>

        {kpi && (
          <div className="space-y-4">
            {/* Summary header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded border border-border bg-muted/20">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Current</div>
                <div className="text-xl font-bold tabular-nums">{kpi.value}{kpi.unit}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Target</div>
                <div className="text-xl font-bold tabular-nums">{kpi.target}{kpi.unit}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Trend</div>
                <div className="text-xl font-bold tabular-nums">{kpi.trend > 0 ? "+" : ""}{kpi.trend}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</div>
                <div className={cn(
                  "inline-flex h-6 items-center rounded px-2 text-[10px] font-bold uppercase tracking-wider",
                  lowerBetter ? (kpi.value <= kpi.target ? "bg-primary text-primary-foreground" : "border-2 border-primary") :
                  (kpi.value >= kpi.target ? "bg-primary text-primary-foreground" : "border-2 border-primary")
                )}>
                  {lowerBetter ? (kpi.value <= kpi.target ? "ON TARGET" : "OFF TARGET") :
                  (kpi.value >= kpi.target ? "ON TARGET" : "OFF TARGET")}
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recent trend</div>
              <div className="h-16">
                <Sparkline data={kpi.sparkline} className="w-full h-full" />
              </div>
            </div>

            {/* Breakdown */}
            {breakdown && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Breakdown by source</div>
                <div className="space-y-2">
                  {breakdown.map(b => (
                    <div key={b.label} className="rounded border border-border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold">{b.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold tabular-nums">{b.value}{b.unit}</span>
                          <span className="text-[10px] text-muted-foreground tabular-nums">{b.contribution}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted overflow-hidden rounded-sm">
                        <div
                          className={cn("h-full", b.trend >= 0 ? "bg-primary" : "bg-primary/60")}
                          style={{ width: `${b.contribution}%` }}
                        />
                      </div>
                      {b.children && (
                        <div className="mt-2 grid grid-cols-4 gap-2 text-[10px]">
                          {b.children.map(c => (
                            <div key={c.label} className="rounded bg-muted/30 px-2 py-1">
                              <div className="text-muted-foreground">{c.label}</div>
                              <div className="font-bold tabular-nums">{c.value}{b.unit}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!breakdown && (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No breakdown data available for this KPI.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ===================================================================
   MODULE: OVERVIEW - Executive Cockpit
   =================================================================== */
function OverviewModule() {
  const { activePlant, pinnedKPIs, togglePinnedKPI, activeRole, setModule, setPlant } = useMESPrefs();
  const roleConfig = ROLE_CONFIGS[activeRole];
  const kpis = KPIS.filter(k => roleConfig.kpiFocus.includes(k.label));
  const allKpis = KPIS;
  const [drillKPI, setDrillKPI] = React.useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = React.useState<string | null>(null);
  const activeWOs = WORK_ORDERS.filter(w => ["started", "in-progress", "on-hold"].includes(w.status));
  const runningMachines = MACHINES.filter(m => m.state === "running").length;
  const downMachines = MACHINES.filter(m => m.state === "down").length;
  const criticalAlerts = ALERTS.filter(a => a.severity === "critical").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
            <span className="h-1 w-1 bg-primary rounded-full" />
            <span>Executive Cockpit</span>
            <ChevronRight className="h-3 w-3" />
            <span>{activePlant === "ALL" ? "All Plants" : `Plant ${activePlant}`}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Manufacturing Execution System
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time production visibility across {activePlant === "ALL" ? "5 plants" : `Plant ${activePlant}`} - Khopoli & Rabale, Maharashtra.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Shift report exported", "Report downloaded as PDF")}>
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export shift report</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => notifyInfo("Live mode activated", "Real-time streaming from OPC-UA edge gateways")}>
            <CircleDot className="h-3.5 w-3.5" />
            <span>Live mode</span>
          </Button>
        </div>
      </div>

      {/* Role-based quick actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
          {roleConfig.name} Quick Actions:
        </span>
        {roleConfig.quickActions.map((action, i) => {
          const Icon = ICONS[action.icon] || LayoutDashboard;
          return (
            <button
              key={i}
              onClick={() => setModule(action.module)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-xs font-semibold transition-swiss hover:border-primary hover:bg-accent hover:text-primary"
            >
              <Icon className="h-3.5 w-3.5" />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Live ticker */}
      <LiveTicker items={[
        `OEE ${KPIS[0].value}% · target ${KPIS[0].target}%`,
        `${WORK_ORDERS.filter(w => w.status === "in-progress").length} WOs in progress`,
        `${MACHINES.filter(m => m.state === "running").length}/${MACHINES.length} machines running`,
        `${ALERTS.filter(a => !a.acknowledged).length} unack alerts`,
        `HDG-2 bath 452°C · dwell 8.5min`,
        `Shift A · 14:32 IST`,
        `Next handover 18:00`,
      ]} />

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} onClick={() => setDrillKPI(kpi.label)} className="cursor-pointer">
            <KPICard
              kpi={kpi}
              pinned={pinnedKPIs.includes(kpi.label)}
              onPin={() => togglePinnedKPI(kpi.label)}
            />
          </div>
        ))}
      </div>

      {/* KPI Drill-down Dialog */}
      <KPIDrillDialog kpiLabel={drillKPI} onClose={() => setDrillKPI(null)} />

      {/* Plant Detail Drawer */}
      <Sheet open={selectedPlant !== null} onOpenChange={(o) => { if (!o) setSelectedPlant(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          {selectedPlant && (() => {
            const p = PLANTS.find(pl => pl.code === selectedPlant);
            const k = PLANT_KPIS[selectedPlant as keyof typeof PLANT_KPIS];
            if (!p || !k) return null;
            const isStore = p.code === "K4";
            const plantMachines = MACHINES.filter(m => m.plant === p.code);
            const plantWOs = WORK_ORDERS.filter(w => w.plant === p.code);
            const plantAlerts = ALERTS.filter(a => a.plant === p.code);
            const plantOperators = OPERATORS_DATA.filter(o => o.plant === p.code);
            return (
              <>
                <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Factory className="h-3.5 w-3.5" />
                    Plant Detail
                  </div>
                  <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-black">
                      {p.code}
                    </div>
                    {p.name}
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    {p.role} · {p.location} · est. {p.since}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-5 p-5">
                  {/* KPI Grid */}
                  {!isStore && (
                    <section>
                      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Performance Overview</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-lg border border-border bg-card p-4 text-center">
                          <OEEGauge value={k.oee} size={70} label="OEE" />
                        </div>
                        <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">First-Pass Yield</div>
                            <div className={cn("text-lg font-bold tabular-nums", k.fpYield >= 95 ? "text-success" : "text-destructive")}>{k.fpYield}%</div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Scrap Rate</div>
                            <div className={cn("text-lg font-bold tabular-nums", k.scrap <= 2 ? "text-success" : "text-destructive")}>{k.scrap}%</div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">On-Time</div>
                            <div className={cn("text-lg font-bold tabular-nums", k.onTime >= 88 ? "text-success" : "text-warning")}>{k.onTime}%</div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Downtime</div>
                            <div className={cn("text-lg font-bold tabular-nums", k.downtime <= 40 ? "" : "text-destructive")}>{k.downtime}m</div>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Output + WIP */}
                  {!isStore && (
                    <section>
                      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Production Summary</h3>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-lg border border-border bg-card p-3 text-center">
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Output</div>
                          <div className="text-xl font-bold tabular-nums text-primary">{k.output}<span className="text-xs text-muted-foreground ml-0.5">u</span></div>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-3 text-center">
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">WIP</div>
                          <div className="text-xl font-bold tabular-nums">{k.wip}</div>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-3 text-center">
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Energy</div>
                          <div className="text-xl font-bold tabular-nums">{k.energy}<span className="text-xs text-muted-foreground ml-0.5">kWh</span></div>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-3 text-center">
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Machines</div>
                          <div className="text-xl font-bold tabular-nums">{plantMachines.length}</div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Production Lines */}
                  <section>
                    <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Production Lines</h3>
                    <div className="flex flex-wrap gap-2">
                      {p.lines.map(l => (
                        <div key={l} className="rounded-lg border border-border bg-card px-3 py-2">
                          <div className="text-xs font-mono font-bold">{l}</div>
                          <div className="text-[9px] text-muted-foreground">{plantMachines.filter(m => m.line === l).length} machines</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Machines in this plant */}
                  {!isStore && plantMachines.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Machines ({plantMachines.length})</h3>
                      <div className="space-y-1.5">
                        {plantMachines.map(m => (
                          <div key={m.id} className="flex items-center gap-3 rounded border border-border bg-card p-2.5">
                            <StatusDot state={m.state} pulse={m.state === "running"} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold truncate">{m.name}</div>
                              <div className="text-[9px] text-muted-foreground font-mono">{m.id} · {m.line}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold tabular-nums text-primary">{m.oee || "-"}%</div>
                              <div className="text-[9px] text-muted-foreground">OEE</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Active Work Orders */}
                  {!isStore && (
                    <section>
                      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active Work Orders ({plantWOs.filter(w => ["started", "in-progress"].includes(w.status)).length})</h3>
                      <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                        {plantWOs.filter(w => ["started", "in-progress", "on-hold"].includes(w.status)).slice(0, 8).map(w => (
                          <div key={w.id} className="flex items-center gap-2 rounded border border-border bg-card p-2 text-xs">
                            <span className="font-mono font-bold">{w.id}</span>
                            <span className="flex-1 truncate text-muted-foreground">{w.product}</span>
                            <WOStatusBadge status={w.status} />
                            <span className="text-[10px] tabular-nums text-muted-foreground">{w.progress}%</span>
                          </div>
                        ))}
                        {plantWOs.filter(w => ["started", "in-progress", "on-hold"].includes(w.status)).length === 0 && (
                          <div className="text-center py-4 text-xs text-muted-foreground">No active work orders</div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Alerts */}
                  {plantAlerts.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant Alerts ({plantAlerts.length})</h3>
                      <div className="space-y-2">
                        {plantAlerts.map(a => (
                          <AlertCard
                            key={a.id}
                            severity={a.severity}
                            title={a.title}
                            description={a.description}
                            timestamp={a.timestamp}
                            module={a.module}
                            plant={a.plant}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Operators */}
                  {plantOperators.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Operators ({plantOperators.length})</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {plantOperators.map(o => (
                          <div key={o.id} className="flex items-center gap-2 rounded border border-border bg-card p-2">
                            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                              {o.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{o.name}</div>
                              <div className="text-[9px] text-muted-foreground truncate">{o.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Plant Report", `${p.name} report exported`)}>
                    <Download className="h-3.5 w-3.5" /> Export Report
                  </Button>
                  <Button size="sm" className="gap-1.5" onClick={() => { setPlant(p.code as any); setSelectedPlant(null); }}>
                    <Factory className="h-3.5 w-3.5" /> Focus Plant
                  </Button>
                </SheetFooter>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Plant grid + Live alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Plant Network - completely redesigned */}
        <Card className="lg:col-span-2 overflow-hidden">
          <PanelHeader
            title="Plant Network"
            subtitle="5 plants · Khopoli + Rabale · Real-time status"
            icon={Factory}
            action={
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-md border border-success/30 bg-success/5 px-2 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  <span className="text-[10px] font-bold text-success tabular-nums">{runningMachines} live</span>
                </div>
                {downMachines > 0 && (
                  <div className="flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1">
                    <span className="h-2 w-2 rounded-full bg-destructive pulse-alert" />
                    <span className="text-[10px] font-bold text-destructive tabular-nums">{downMachines} down</span>
                  </div>
                )}
              </div>
            }
          />
          {/* Network overview bar */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-1.5">
              <Factory className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">5 Plants</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Khopoli · Rabale, MH</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground tabular-nums">250+ staff</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Combined OEE:</span>
              <span className="text-[11px] font-bold tabular-nums text-primary">
                {Math.round(PLANTS.filter(p => p.code !== "K4").reduce((a, p) => a + PLANT_KPIS[p.code].oee, 0) / 4)}%
              </span>
            </div>
          </div>

          {/* Plant cards - redesigned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-3">
            {PLANTS.map((p) => {
              const k = PLANT_KPIS[p.code];
              const isStore = p.code === "K4";
              const plantAlerts = ALERTS.filter(a => a.plant === p.code);
              const criticalCount = plantAlerts.filter(a => a.severity === "critical").length;
              const warningCount = plantAlerts.filter(a => a.severity === "warning").length;
              const plantMachines = MACHINES.filter(m => m.plant === p.code);
              const runningCount = plantMachines.filter(m => m.state === "running").length;
              const statusColor = isStore ? "muted" : criticalCount > 0 ? "destructive" : k.oee >= 75 ? "success" : "primary";

              return (
                <div
                  key={p.code}
                  onClick={() => setSelectedPlant(p.code)}
                  className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-swiss cursor-pointer group relative"
                >
                  {/* Top accent bar - gradient by status */}
                  <div className={cn(
                    "h-1 w-full",
                    statusColor === "success" && "bg-gradient-to-r from-success to-success/60",
                    statusColor === "primary" && "bg-gradient-to-r from-primary to-primary/60",
                    statusColor === "destructive" && "bg-gradient-to-r from-destructive to-destructive/60",
                    statusColor === "muted" && "bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/20",
                  )} />

                  {/* Card header */}
                  <div className="p-3.5 pb-2.5">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "relative grid h-9 w-9 place-items-center rounded-lg text-xs font-black shrink-0",
                          isStore ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                        )}>
                          {p.code}
                          {!isStore && (
                            <div className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                              runningCount > 0 ? "bg-success" : "bg-muted-foreground"
                            )} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-bold truncate leading-tight">{p.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">est. {p.since}</div>
                        </div>
                      </div>
                      {!isStore ? (
                        <OEEGauge value={k.oee} size={54} label="OEE" />
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                          <Boxes className="h-4.5 w-4.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Role + location */}
                    <div className="mb-2.5">
                      <p className="text-[10px] text-muted-foreground leading-snug mb-1">{p.role}</p>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5 shrink-0 text-primary/60" />
                        <span className="truncate">{p.location}</span>
                      </div>
                    </div>

                    {/* Stats - pill style */}
                    {!isStore && (
                      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                        <div className={cn(
                          "rounded-md px-2 py-1.5 text-center border",
                          k.fpYield >= 95 ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"
                        )}>
                          <div className="text-[8px] uppercase tracking-wider text-muted-foreground">Yield</div>
                          <div className={cn(
                            "text-[11px] font-bold tabular-nums",
                            k.fpYield >= 95 ? "text-success" : "text-destructive"
                          )}>{k.fpYield}%</div>
                        </div>
                        <div className={cn(
                          "rounded-md px-2 py-1.5 text-center border",
                          k.scrap <= 2 ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"
                        )}>
                          <div className="text-[8px] uppercase tracking-wider text-muted-foreground">Scrap</div>
                          <div className={cn(
                            "text-[11px] font-bold tabular-nums",
                            k.scrap <= 2 ? "text-success" : "text-destructive"
                          )}>{k.scrap}%</div>
                        </div>
                        <div className={cn(
                          "rounded-md px-2 py-1.5 text-center border",
                          k.onTime >= 88 ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"
                        )}>
                          <div className="text-[8px] uppercase tracking-wider text-muted-foreground">On-Time</div>
                          <div className={cn(
                            "text-[11px] font-bold tabular-nums",
                            k.onTime >= 88 ? "text-success" : "text-warning"
                          )}>{k.onTime}%</div>
                        </div>
                      </div>
                    )}

                    {/* Store stats */}
                    {isStore && (
                      <div className="space-y-1 mb-2.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">SKUs</span>
                          <span className="font-bold text-primary tabular-nums">142</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Reorder alerts</span>
                          <span className="font-bold text-warning tabular-nums">3</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Stock value</span>
                          <span className="font-bold tabular-nums">₹4.2Cr</span>
                        </div>
                      </div>
                    )}

                    {/* Production lines - chip style */}
                    <div className="mb-2">
                      <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Production Lines</div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {p.lines.map((l) => (
                          <span key={l} className="text-[8px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-swiss">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer bar */}
                  <div className="flex items-center justify-between px-3.5 py-2 border-t border-border bg-muted/20">
                    {!isStore ? (
                      <>
                        <div className="flex items-center gap-2.5 text-[9px]">
                          <span className="flex items-center gap-0.5">
                            <Package className="h-2.5 w-2.5 text-muted-foreground" />
                            <span className="font-bold tabular-nums">{k.output}u</span>
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Layers className="h-2.5 w-2.5 text-muted-foreground" />
                            <span className="font-bold tabular-nums">{k.wip} WIP</span>
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                            <span className={cn("font-bold tabular-nums", k.downtime > 40 && "text-destructive")}>{k.downtime}m</span>
                          </span>
                        </div>
                        {(criticalCount > 0 || warningCount > 0) && (
                          <div className="flex items-center gap-1">
                            {criticalCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-destructive">
                                <span className="h-1.5 w-1.5 rounded-full bg-destructive pulse-alert" />
                                {criticalCount}
                              </span>
                            )}
                            {warningCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-warning">
                                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                                {warningCount}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-[9px] text-muted-foreground">Material storage & machine store</span>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-swiss" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Live alerts */}
        <Card className="overflow-hidden flex flex-col">
          <PanelHeader
            title="Live Alerts"
            subtitle={`${criticalAlerts} critical`}
            icon={AlertTriangle}
            action={<Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => window.dispatchEvent(new CustomEvent("mes:open-notif-drawer"))}>View all</Button>}
          />
          <ScrollArea className="flex-1 max-h-[420px]">
            <div className="divide-y divide-border">
              {ALERTS.slice(0, 8).map((a) => (
                <div key={a.id} className="px-4 py-2.5 hover:bg-accent/40 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className={cn(
                      "mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                      a.severity === "critical" ? "bg-primary pulse-mono" :
                      a.severity === "warning" ? "bg-muted-foreground" : "bg-border"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate flex-1">{a.title}</span>
                        <span className="text-[10px] font-mono text-muted-foreground shrink-0">{a.plant}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{a.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70">{a.module}</span>
                        <span className="text-[9px] text-muted-foreground/70">·</span>
                        <span className="text-[9px] text-muted-foreground/70 tabular-nums">
                          {formatTime(a.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* OEE Trend + Active WOs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <PanelHeader
            title="OEE Trend - Last 24 hours"
            subtitle="Availability × Performance × Quality"
            icon={Gauge}
            action={
              <div className="flex items-center gap-3 text-[10px]">
                <LegendDot label="Availability" />
                <LegendDot label="Performance" />
                <LegendDot label="Quality" />
                <LegendDot label="OEE" solid />
              </div>
            }
          />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={OEE_TREND_24H} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="oeeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} className="text-primary" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity={0} className="text-primary" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.1} vertical={false} className="text-primary" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" interval={2} />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                />
                <Area type="monotone" dataKey="availability" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1} fill="none" className="text-primary" />
                <Area type="monotone" dataKey="performance" stroke="currentColor" strokeOpacity={0.6} strokeWidth={1} fill="none" className="text-primary" strokeDasharray="3 2" />
                <Area type="monotone" dataKey="quality" stroke="currentColor" strokeOpacity={0.8} strokeWidth={1} fill="none" className="text-primary" strokeDasharray="1 2" />
                <Area type="monotone" dataKey="oee" stroke="currentColor" strokeWidth={2} fill="url(#oeeGrad)" className="text-primary" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active WOs */}
        <Card className="overflow-hidden flex flex-col">
          <PanelHeader
            title="Active Work Orders"
            subtitle={`${activeWOs.length} in progress`}
            icon={ClipboardList}
          />
          <ScrollArea className="flex-1 max-h-[280px]">
            <div className="divide-y divide-border">
              {activeWOs.slice(0, 6).map((w) => (
                <div key={w.id} className="px-4 py-2.5 hover:bg-accent/40">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold">{w.id}</span>
                      <PriorityMark priority={w.priority} />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">{w.plant}</span>
                  </div>
                  <p className="text-xs text-primary truncate">{w.product}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{w.customer}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <MonoProgress value={w.progress} className="flex-1" />
                    <span className="text-[10px] font-semibold tabular-nums">{w.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Machine grid */}
      <Card className="overflow-hidden">
        <PanelHeader
          title="Machine Status - Real-time"
          subtitle="OPC-UA / Modbus / MQTT edge streaming"
          icon={Cpu}
          action={
            <div className="flex items-center gap-3 text-[10px]">
              <StatusDot state="running" label="Running" />
              <StatusDot state="idle" label="Idle" />
              <StatusDot state="down" label="Down" />
              <StatusDot state="changeover" label="Changeover" />
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table suppressHydrationWarning className="w-full text-xs">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Machine</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Plant</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">State</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground text-right">OEE</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground text-right">A</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground text-right">P</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground text-right">Q</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MACHINES.map((m) => (
                <tr key={m.id} className="hover:bg-accent/30">
                  <td className="px-3 py-2">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{m.id}</div>
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold">{m.plant}</td>
                  <td className="px-3 py-2"><StatusDot state={m.state} label={m.state} pulse={m.state === "running"} /></td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums">{m.oee || "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{m.availability || "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{m.performance || "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{m.quality || "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {m.parameters.slice(0, 2).map((p, i) => (
                        <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-primary">
                          {p.label}: <span className="font-bold">{p.value}</span>{p.unit && ` ${p.unit}`}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, good }: { label: string; value: string | number; good?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold tabular-nums", good === false && "text-primary font-bold")}>{value}</span>
    </div>
  );
}

function LegendDot({ label, solid }: { label: string; solid?: boolean }) {
  return (
    <span className="flex items-center gap-1 text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-sm", solid ? "bg-primary" : "border border-primary")} />
      {label}
    </span>
  );
}

/* ===================================================================
   MODULE: PLANNING & SCHEDULING (APS)
   =================================================================== */
function PlanningModule() {
  const { activePlant } = useMESPrefs();
  const WOs = WORK_ORDERS.filter(w => activePlant === "ALL" || w.plant === activePlant);
  const lines = Array.from(new Set(WORK_ORDERS.map(w => w.line)));

  // Group WOs by line for Gantt
  const gantt: Record<string, typeof WORK_ORDERS> = {};
  lines.forEach(l => { gantt[l] = WOs.filter(w => w.line === l).slice(0, 5); });

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 01 · ISA-95 Level 3"
        title="Production Planning & Scheduling"
        description="Finite-capacity APS, drag-and-drop Gantt, what-if simulation, material-aware release"
        icon={CalendarRange}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Plan Attainment" value="92.4%" trend="+2.1%" />
        <MiniKPI label="OTIF" value="87.3%" trend="+3.4%" />
        <MiniKPI label="Rush Orders" value="3" trend="+1" />
        <MiniKPI label="Capacity Load" value="78%" trend="+5%" />
        <MiniKPI label="At-Risk Orders" value="4" trend="-2" />
      </div>

      {/* Gantt */}
      <Card className="overflow-hidden">
        <PanelHeader
          title="Production Schedule - Gantt"
          subtitle="Drag-and-drop sequencing · finite capacity across 5 plants"
          icon={Layers}
          action={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" onClick={() => notifyInfo("Filter", "Filter options coming soon")}>
                <Filter className="h-3 w-3" /> Filter
              </Button>
              <Button size="sm" className="h-7 text-[11px] gap-1.5" onClick={() => notifyInfo("What-if Simulation", "Scenario simulator activated")}>
                <CalendarRange className="h-3 w-3" /> What-if
              </Button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Day header */}
            <div className="flex border-b border-border bg-muted/30">
              <div className="w-44 shrink-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-r border-border">Line</div>
              <div className="flex-1 grid grid-cols-7">
                {["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22", "Sat 23", "Sun 24"].map((d, i) => (
                  <div key={d} className={cn("px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-r border-border", i === 6 && "bg-muted/30")}>
                    {d}
                  </div>
                ))}
              </div>
            </div>
            {/* Lines */}
            {lines.map((line) => (
              <div key={line} className="flex border-b border-border hover:bg-accent/20">
                <div className="w-44 shrink-0 px-3 py-3 border-r border-border">
                  <div className="text-xs font-bold font-mono">{line}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {WORK_ORDERS.find(w => w.line === line)?.plant}
                  </div>
                </div>
                <div className="flex-1 relative h-14 grid grid-cols-7 divide-x divide-border">
                  {(gantt[line] || []).map((w, i) => {
                    const startCol = (i * 1.4) % 7;
                    const span = Math.min(3, 7 - startCol);
                    return (
                      <div
                        key={w.id}
                        className="absolute top-1.5 bottom-1.5 rounded overflow-hidden group cursor-pointer hover:z-10 hover:ring-2 hover:ring-primary/40 transition-all"
                        style={{
                          left: `${(startCol / 7) * 100}%`,
                          width: `${(span / 7) * 100 - 0.5}%`,
                          background: w.priority === "rush" ? "var(--foreground)" : w.status === "in-progress" ? "var(--foreground)" : "var(--muted)",
                          color: w.priority === "rush" || w.status === "in-progress" ? "var(--background)" : "var(--foreground)",
                        }}
                      >
                        <div className="px-2 py-1 h-full flex flex-col justify-center">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono font-bold truncate">{w.id}</span>
                            {w.priority === "rush" && <span className="text-[8px] font-bold uppercase">Rush</span>}
                          </div>
                          <div className="text-[9px] truncate opacity-80">{w.product}</div>
                          <div className="mt-0.5 h-0.5 bg-current opacity-30 rounded-full overflow-hidden">
                            <div className="h-full bg-current" style={{ width: `${w.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Order pool + Capacity heat map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <PanelHeader title="Order Pool" subtitle="Prioritization by due-date risk" icon={ClipboardList} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Due</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {WOs.slice(0, 10).map((w) => {
                  const daysToDue = Math.ceil((new Date(w.dueDate).getTime() - 1724697600000) / 86400000);
                  const risk = daysToDue < 2 ? "high" : daysToDue < 5 ? "medium" : "low";
                  return (
                    <tr key={w.id} className="hover:bg-accent/30">
                      <td className="px-3 py-2">
                        <div className="font-mono font-bold text-[11px]">{w.orderNo}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{w.id}</div>
                      </td>
                      <td className="px-3 py-2 truncate">{w.customer}</td>
                      <td className="px-3 py-2 truncate font-mono text-[11px]">{w.product}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{w.qty}</td>
                      <td className="px-3 py-2 tabular-nums">{daysToDue}d</td>
                      <td className="px-3 py-2">
                        <span className={cn(
                          "inline-flex h-5 items-center rounded px-1.5 text-[10px] font-bold uppercase tracking-wider",
                          risk === "high" ? "bg-primary text-primary-foreground" :
                          risk === "medium" ? "border-2 border-primary text-primary" :
                          "border border-border text-muted-foreground"
                        )}>
                          {risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <PanelHeader title="Capacity Heat-map" subtitle="Finite capacity per line" icon={BarChart3} />
          <div className="p-4 space-y-3">
            {lines.slice(0, 8).map((line) => {
              // Deterministic load based on line name hash (avoids hydration mismatch)
              const hash = line.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
              const load = 40 + (hash % 60);
              return (
                <div key={line}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-semibold">{line}</span>
                    <span className="tabular-nums text-muted-foreground">{load}%</span>
                  </div>
                  <div className="h-2 bg-muted overflow-hidden rounded-sm">
                    <div
                      className={cn("h-full transition-all", load > 90 ? "bg-primary" : load > 75 ? "bg-primary/80" : "bg-primary/50")}
                      style={{ width: `${load}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ===================================================================
   MODULE: WORK ORDERS
   =================================================================== */
function WorkOrdersModule({ workOrders }: { workOrders: typeof WORK_ORDERS }) {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedWO, setSelectedWO] = React.useState<typeof WORK_ORDERS[number] | null>(null);
  const filtered = workOrders.filter(w => statusFilter === "all" || w.status === statusFilter);

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 02 · Shop-floor Execution"
        title="Work Order & Shop-floor Execution"
        description="Digital job cards, real-time WIP, Andon, paperless workflows"
        icon={ClipboardList}
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <MiniKPI label="Active WOs" value={workOrders.filter(w => ["started", "in-progress"].includes(w.status)).length} />
        <MiniKPI label="Released" value={workOrders.filter(w => w.status === "released").length} />
        <MiniKPI label="On Hold" value={workOrders.filter(w => w.status === "on-hold").length} />
        <MiniKPI label="Completed" value={workOrders.filter(w => w.status === "completed").length} />
        <MiniKPI label="Total Qty" value={workOrders.reduce((a, w) => a + w.qty, 0)} />
        <MiniKPI label="Scrap (pcs)" value={workOrders.reduce((a, w) => a + w.qtyScrap, 0)} />
      </div>

      <Card className="overflow-hidden">
        <PanelHeader
          title="Work Order Board"
          subtitle={`${filtered.length} orders · click a row to view details`}
          icon={ClipboardList}
          action={
            <div className="flex items-center gap-1">
              {["all", "in-progress", "on-hold", "completed"].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors",
                    statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">WO</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Order / Customer</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant · Line</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stage</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Heat No.</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Progress</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 20).map((w) => (
                <tr
                  key={w.id}
                  onClick={() => setSelectedWO(w)}
                  className="hover:bg-accent/30 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2.5 font-mono font-bold text-[11px]">{w.id}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-mono text-[11px]">{w.orderNo}</div>
                    <div className="text-[10px] text-muted-foreground truncate max-w-[140px]">{w.customer}</div>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">{w.product}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-mono font-bold">{w.plant}</div>
                    <div className="text-[10px] text-muted-foreground">{w.line}</div>
                  </td>
                  <td className="px-3 py-2.5 text-[11px]">{w.currentStage}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">{w.heatNumber || "-"}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    <div className="font-bold">{w.qtyDone}</div>
                    <div className="text-[10px] text-muted-foreground">/ {w.qty}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 w-32">
                      <MonoProgress value={w.progress} />
                      <span className="text-[10px] font-semibold tabular-nums shrink-0">{w.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5"><WOStatusBadge status={w.status} /></td>
                  <td className="px-3 py-2.5"><PriorityMark priority={w.priority} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <WorkOrderDetailSheet wo={selectedWO} onClose={() => setSelectedWO(null)} />
    </div>
  );
}

/* ===================================================================
   MODULE: INVENTORY
   =================================================================== */
function InventoryModule() {
  const { activePlant } = useMESPrefs();
  const items = INVENTORY.filter(i => activePlant === "ALL" || i.plant === activePlant);
  const [selectedItem, setSelectedItem] = React.useState<typeof INVENTORY[number] | null>(null);

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 03 · Material & Warehouse"
        title="Material & Inventory Management"
        description="Heat-number lot tracking, multi-plant stock, FIFO, barcode/RFID"
        icon={Boxes}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Total SKUs" value={items.length} />
        <MiniKPI label="Raw Material" value={`${items.filter(i => i.type === "raw").reduce((a, i) => a + i.quantity, 0)} MT`} />
        <MiniKPI label="WIP Units" value={items.filter(i => i.type === "wip").reduce((a, i) => a + i.quantity, 0)} />
        <MiniKPI label="Finished Goods" value={items.filter(i => i.type === "fg").reduce((a, i) => a + i.quantity, 0)} />
        <MiniKPI label="Reorder Alerts" value={items.filter(i => i.quantity < i.reorderLevel).length} />
      </div>

      <Card className="overflow-hidden">
        <PanelHeader title="Stock Items" subtitle="Heat-level traceability from intake" icon={Boxes} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant · Location</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Heat No.</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stock level</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((i) => {
                const low = i.quantity < i.reorderLevel;
                const ratio = i.reorderLevel > 0 ? (i.quantity / (i.reorderLevel * 2)) * 100 : 100;
                return (
                  <tr key={i.id} className="hover:bg-accent/30 cursor-pointer" onClick={() => setSelectedItem(i)}>
                    <td className="px-3 py-2.5 font-mono font-bold text-[11px]">{i.sku}</td>
                    <td className="px-3 py-2.5">{i.description}</td>
                    <td className="px-3 py-2.5">
                      <MonoTag variant={i.type === "raw" ? "solid" : i.type === "fg" ? "outline" : "default"}>
                        {i.type.toUpperCase()}
                      </MonoTag>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono font-bold">{i.plant}</span>
                      <span className="text-[10px] text-muted-foreground ml-1.5 font-mono">{i.location}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px]">{i.heatNumber || "-"}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="font-bold tabular-nums">{i.quantity}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">{i.unit}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2 w-28">
                        <MonoProgress value={Math.min(100, ratio)} />
                        {low && <span className="text-[9px] font-bold uppercase">Low</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-muted-foreground">{i.supplier || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inventory item detail drawer */}
      <Sheet open={selectedItem !== null} onOpenChange={(o) => { if (!o) setSelectedItem(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
          {selectedItem && (
            <>
              <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Boxes className="h-3.5 w-3.5" />
                  Inventory Item Detail
                </div>
                <SheetTitle className="text-xl font-bold tracking-tight font-mono">{selectedItem.sku}</SheetTitle>
                <SheetDescription className="text-sm">{selectedItem.description}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="SKU" value={selectedItem.sku} mono />
                  <DetailField label="Type" value={selectedItem.type.toUpperCase()} />
                  <DetailField label="Plant" value={selectedItem.plant} mono />
                  <DetailField label="Location" value={selectedItem.location} mono />
                  <DetailField label="Quantity" value={`${selectedItem.quantity} ${selectedItem.unit}`} />
                  <DetailField label="Reorder Level" value={`${selectedItem.reorderLevel} ${selectedItem.unit}`} />
                  {selectedItem.heatNumber && <DetailField label="Heat Number" value={selectedItem.heatNumber} mono />}
                  {selectedItem.supplier && <DetailField label="Supplier" value={selectedItem.supplier} />}
                  <DetailField label="Last Movement" value={formatDateTime(selectedItem.lastMovement)} />
                </div>
                {/* Stock level bar */}
                <div>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stock Level</h3>
                  <div className="rounded border border-border bg-card p-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Current: {selectedItem.quantity} {selectedItem.unit}</span>
                      <span className="text-muted-foreground">Reorder: {selectedItem.reorderLevel} {selectedItem.unit}</span>
                    </div>
                    <MonoProgress value={selectedItem.reorderLevel > 0 ? Math.min(100, (selectedItem.quantity / (selectedItem.reorderLevel * 2)) * 100) : 100} />
                    {selectedItem.quantity < selectedItem.reorderLevel && (
                      <div className="mt-2 text-xs text-destructive font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Below reorder level - PO required
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Stock Movement", "Stock movement form opened")}>
                  <ArrowRight className="h-3.5 w-3.5" /> Move Stock
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Traceability", "Opening heat number trace")}>
                  <Workflow className="h-3.5 w-3.5" /> Trace Heat
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => notifySuccess("Purchase Order", "Reorder PO created")}>
                  <Plus className="h-3.5 w-3.5" /> Create PO
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ===================================================================
   MODULE: QUALITY
   =================================================================== */
function QualityModule() {
  const { activePlant } = useMESPrefs();
  const records = QUALITY_RECORDS.filter(q => activePlant === "ALL" || q.plant === activePlant);
  const passCount = records.filter(r => r.result === "pass").length;
  const failCount = records.filter(r => r.result === "fail").length;
  const holdCount = records.filter(r => r.result === "hold").length;
  const fpYield = records.length > 0 ? ((passCount / records.length) * 100).toFixed(1) : "0";
  const [selectedNCR, setSelectedNCR] = React.useState<typeof NCRS[number] | null>(null);
  const [selectedRecord, setSelectedRecord] = React.useState<typeof QUALITY_RECORDS[number] | null>(null);

  // SPC chart data - coating DFT
  const spcData = records.filter(r => r.stage === "Galvanizing" || r.stage === "Painting").slice(0, 20).map((r, i) => ({
    idx: i + 1,
    value: r.value || (70 + (i * 3) % 20),
    spec: 70,
  }));

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 04 · ISO 3834-2 / ISO 9001"
        title="Quality Management & Inspection"
        description="Quality gates, NCR/CAPA, SPC, welder qualification enforcement"
        icon={ShieldCheck}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="First-Pass Yield" value={`${fpYield}%`} />
        <MiniKPI label="Pass" value={passCount} />
        <MiniKPI label="Fail" value={failCount} />
        <MiniKPI label="On Hold" value={holdCount} />
        <MiniKPI label="Open NCRs" value={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SPC chart */}
        <Card className="lg:col-span-2 overflow-hidden">
          <PanelHeader title="SPC - Coating DFT Trend" subtitle="Spec ≥ 70 μm · Cp/Cpk target ≥ 1.33" icon={Activity} />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={spcData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} className="text-primary" />
                <XAxis dataKey="idx" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" domain={[60, 90]} />
                <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11 }} />
                <ReferenceLine y={70} stroke="currentColor" strokeOpacity={0.6} strokeDasharray="4 2" label={{ value: "LSL 70", fontSize: 9, fill: "currentColor" }} />
                <Line type="monotone" dataKey="value" stroke="currentColor" strokeWidth={2} className="text-primary" dot={{ r: 2, fill: "currentColor" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quality gate distribution */}
        <Card className="overflow-hidden">
          <PanelHeader title="Results by Stage" icon={BarChart3} />
          <div className="p-4 space-y-3">
            {["Cutting", "Welding", "Leak Test", "Galvanizing", "Painting", "Final QC"].map((stage) => {
              const stageRecords = records.filter(r => r.stage === stage);
              const total = stageRecords.length || 1;
              const passRate = ((stageRecords.filter(r => r.result === "pass").length / total) * 100).toFixed(0);
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-medium">{stage}</span>
                    <span className="tabular-nums text-muted-foreground">{stageRecords.length} · {passRate}%</span>
                  </div>
                  <div className="h-2 bg-muted overflow-hidden rounded-sm">
                    <div className="h-full bg-primary" style={{ width: `${passRate}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Inspection records */}
      <Card className="overflow-hidden">
        <PanelHeader title="Inspection Records" subtitle="Real-time gate capture" icon={ShieldCheck} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">QC ID</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Serial</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stage</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Inspector</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Value</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Spec</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Result</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.slice(0, 15).map((r) => (
                <tr key={r.id} className="hover:bg-accent/30 cursor-pointer" onClick={() => setSelectedRecord(r)}>
                  <td className="px-3 py-2.5 font-mono font-bold text-[11px]">{r.id}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">{r.serial}</td>
                  <td className="px-3 py-2.5">{r.stage}</td>
                  <td className="px-3 py-2.5">{r.inspector}</td>
                  <td className="px-3 py-2.5 font-mono font-bold">{r.plant}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-mono">{r.value} {r.unit}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">{r.spec}</td>
                  <td className="px-3 py-2.5"><QualityBadge result={r.result} /></td>
                  <td className="px-3 py-2.5 text-[10px] text-muted-foreground tabular-nums">
                    {formatTime(r.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* NCR / CAPA Kanban Board */}
      <Card className="overflow-hidden">
        <PanelHeader
          title="NCR / CAPA Workflow"
          subtitle="Non-conformance → containment → root cause → CAPA → verify → close"
          icon={ShieldCheck}
          action={<Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" onClick={() => notifyInfo("Raise NCR", "NCR creation form opened")}><Plus className="h-3 w-3" /> Raise NCR</Button>}
        />
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-px bg-border min-w-[1100px]">
            {([
              { key: "open", label: "OPEN" },
              { key: "investigating", label: "INVESTIGATING" },
              { key: "containment", label: "CONTAINMENT" },
              { key: "root-cause", label: "ROOT CAUSE" },
              { key: "capa-open", label: "CAPA OPEN" },
              { key: "verified", label: "VERIFIED" },
              { key: "closed", label: "CLOSED" },
            ] as const).map(col => {
              const colNCRs = NCRS.filter(n => n.status === col.key);
              return (
                <div key={col.key} className="bg-card min-h-[280px] flex flex-col">
                  {/* Column header */}
                  <div className="px-3 py-2 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{col.label}</span>
                      <span className="grid h-4 min-w-4 place-items-center rounded bg-primary px-1 text-[9px] font-bold text-primary-foreground tabular-nums">
                        {colNCRs.length}
                      </span>
                    </div>
                  </div>
                  {/* Cards */}
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[400px]">
                    {colNCRs.length === 0 && (
                      <div className="text-center text-[10px] text-muted-foreground py-4">-</div>
                    )}
                    {colNCRs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNCR(n)}
                        className={cn(
                          "rounded border p-2.5 cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all",
                          n.severity === "critical" ? "border-primary border-2 bg-primary/5" :
                          n.severity === "major" ? "border-primary/40" :
                          "border-border"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold">{n.id}</span>
                          <span className={cn(
                            "inline-flex h-4 items-center rounded px-1 text-[8px] font-bold uppercase tracking-wider",
                            n.severity === "critical" ? "bg-primary text-primary-foreground" :
                            n.severity === "major" ? "border border-primary" :
                            "border border-border text-muted-foreground"
                          )}>
                            {n.severity}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold leading-tight mb-1">{n.title}</div>
                        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground mb-1.5">
                          <span className="font-mono font-bold text-primary">{n.plant}</span>
                          <span>·</span>
                          <span>{n.stage}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                          <span>{n.affectedQty} affected</span>
                          <span className="tabular-nums">{n.daysOpen}d open</span>
                        </div>
                        {n.capaAction && col.key === "capa-open" && (
                          <div className="mt-1.5 pt-1.5 border-t border-border/50 text-[9px]">
                            <span className="font-semibold">CAPA:</span> {n.capaAction.substring(0, 50)}…
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      <NCRDetailDrawer ncr={selectedNCR} onClose={() => setSelectedNCR(null)} />
      <QualityRecordDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}

/* ===================================================================
   MODULE: TRACEABILITY
   =================================================================== */
function TraceabilityModule() {
  const [selectedSerial, setSelectedSerial] = React.useState<string>(TRACE_EVENTS[0]?.serial || "");
  const events = TRACE_EVENTS.filter(e => e.serial === selectedSerial);

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 05 · As-built Genealogy"
        title="Genealogy & Traceability"
        description="Coil-to-customer digital thread, forward & backward trace, recall containment"
        icon={Workflow}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniKPI label="Traceability Coverage" value="99.2%" />
        <MiniKPI label="Time to Trace" value="< 60s" />
        <MiniKPI label="Serials Tracked" value="12,847" />
        <MiniKPI label="Heat Numbers" value="428" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Serial search */}
        <Card className="overflow-hidden">
          <PanelHeader title="Serial Search" icon={Search} />
          <div className="p-4 space-y-2">
            <Input placeholder="Search serial…" className="h-9 font-mono text-sm" defaultValue={selectedSerial} />
            <ScrollArea className="h-[320px]">
              <div className="space-y-1">
                {Array.from(new Set(TRACE_EVENTS.map(e => e.serial))).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSerial(s)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded text-xs font-mono transition-colors",
                      s === selectedSerial ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{s}</span>
                      <span className="text-[9px] opacity-70">
                        {TRACE_EVENTS.filter(e => e.serial === s).length} events
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>

        {/* As-built timeline */}
        <Card className="lg:col-span-2 overflow-hidden">
          <PanelHeader
            title={`As-built Timeline - ${selectedSerial}`}
            subtitle="Coil → Cut → Form → Weld → Test → Galv → Paint → Assembly → QC → Despatch"
            icon={Workflow}
          />
          <div className="p-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {events.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No events for this serial.
                  </div>
                )}
                {events.map((e, i) => (
                  <div key={e.id} className="relative pl-10">
                    <div className={cn(
                      "absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2",
                      e.result === "pass" ? "bg-primary border-primary" :
                      e.result === "fail" ? "bg-background border-primary" :
                      e.result === "hold" ? "bg-muted border-primary" :
                      "bg-background border-border"
                    )} />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold">{e.stage}</span>
                      <QualityBadge result={e.result} />
                      <span className="text-[10px] text-muted-foreground tabular-nums ml-auto">
                        {formatDateTime(e.timestamp)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {e.data.map((d, j) => (
                        <div key={j} className="flex justify-between border-b border-border/50 pb-0.5">
                          <span className="text-muted-foreground">{d.label}</span>
                          <span className="font-mono font-semibold">{d.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Operator: <span className="font-medium text-primary">{e.operator}</span> · Machine: <span className="font-mono">{e.machine}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recall / Where-used */}
      <Card className="overflow-hidden">
        <PanelHeader title="Where-Used Explorer" subtitle="Forward trace from heat number / parameter" icon={Search} />
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Search by</label>
            <select className="mt-1 w-full h-9 px-2 rounded border border-border bg-background text-sm">
              <option>Heat Number</option>
              <option>WPS Reference</option>
              <option>Welder ID</option>
              <option>Batch</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Value</label>
            <div className="mt-1 flex gap-2">
              <Input placeholder="e.g., HT-482910" className="font-mono text-sm" />
              <Button size="sm" className="gap-1.5"><Search className="h-3.5 w-3.5" /> Trace</Button>
            </div>
          </div>
        </div>
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Last query:</span> HT-482910 → <span className="font-mono">28 serials</span> affected across <span className="font-mono">3 plants</span>. Containment completed in <span className="font-semibold text-primary">4 min 12 sec</span>.
        </div>
      </Card>
    </div>
  );
}

/* ===================================================================
   MODULE: IIoT
   =================================================================== */
function IIoTModule({ machines }: { machines: typeof MACHINES }) {
  const [selectedMachine, setSelectedMachine] = React.useState<typeof MACHINES[number] | null>(null);
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 06 · ISA-95 Level 2"
        title="Machine / IIoT Connectivity"
        description="OPC-UA, Modbus TCP, MQTT - edge gateway streaming, parameter capture"
        icon={Cpu}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Connected" value={`${machines.length} / 13`} />
        <MiniKPI label="Streaming" value={machines.filter(m => m.state === "running").length} />
        <MiniKPI label="Down" value={machines.filter(m => m.state === "down").length} />
        <MiniKPI label="Data Points" value="2,847" />
        <MiniKPI label="Edge Latency" value="< 200ms" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((m) => (
          <Card key={m.id} className="overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-sm transition-swiss" onClick={() => setSelectedMachine(m)}>
            <div className="flex items-start justify-between border-b border-border px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <StatusDot state={m.state} pulse={m.state === "running"} />
                  <span className="text-sm font-bold">{m.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-muted-foreground">
                  <span>{m.id}</span>
                  <span>·</span>
                  <span className="font-bold text-primary">{m.plant}</span>
                  <span>·</span>
                  <span>{m.line}</span>
                </div>
              </div>
              <OEEGauge value={m.oee} size={48} />
            </div>
            <div className="p-4 space-y-3">
              {/* Parameters */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Live parameters</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {m.parameters.map((p, i) => (
                    <div key={i} className="rounded border border-border px-2 py-1.5 bg-muted/30">
                      <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{p.label}</div>
                      <div className="text-sm font-bold tabular-nums">
                        {p.value} <span className="text-[10px] font-medium text-muted-foreground">{p.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* A/P/Q bars */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">A × P × Q</div>
                <div className="space-y-1">
                  {[
                    { label: "A", value: m.availability },
                    { label: "P", value: m.performance },
                    { label: "Q", value: m.quality },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono w-3">{d.label}</span>
                      <MonoProgress value={d.value} />
                      <span className="text-[10px] font-semibold tabular-nums w-8 text-right">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <MachineDetailDrawer machine={selectedMachine} onClose={() => setSelectedMachine(null)} />
    </div>
  );
}

/* ===================================================================
   MODULE: OEE
   =================================================================== */
function OEEModule() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 07 · Performance Analytics"
        title="OEE & Performance Analytics"
        description="Availability × Performance × Quality, six big losses, Pareto, TEEP"
        icon={Gauge}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Big OEE */}
        <Card className="overflow-hidden">
          <PanelHeader title="Overall OEE" icon={Gauge} />
          <div className="p-4 grid place-items-center">
            <OEEGauge value={72.4} size={140} />
            <div className="mt-4 w-full space-y-2">
              <MiniBar label="Availability" value={87.2} />
              <MiniBar label="Performance" value={86.5} />
              <MiniBar label="Quality" value={96.1} />
            </div>
          </div>
        </Card>

        {/* Trend */}
        <Card className="lg:col-span-3 overflow-hidden">
          <PanelHeader title="OEE Trend - 24h" subtitle="Hourly A × P × Q" icon={Activity} />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={OEE_TREND_24H} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} className="text-primary" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" interval={2} />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11 }} />
                <Bar dataKey="availability" fill="currentColor" fillOpacity={0.2} className="text-primary" />
                <Bar dataKey="performance" fill="currentColor" fillOpacity={0.5} className="text-primary" />
                <Bar dataKey="quality" fill="currentColor" fillOpacity={0.9} className="text-primary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Six big losses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <PanelHeader title="Six Big Losses - Pareto" icon={BarChart3} />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SIX_BIG_LOSSES} layout="vertical" margin={{ top: 8, right: 8, left: 80, bottom: 0 }}>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} horizontal={false} className="text-primary" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.5} className="text-primary" width={80} />
                <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11 }} />
                <Bar dataKey="minutes" fill="currentColor" className="text-primary" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <PanelHeader title="Loss Breakdown" icon={Layers} />
          <div className="p-4 space-y-4">
            {["Availability", "Performance", "Quality"].map((parent) => {
              const losses = SIX_BIG_LOSSES.filter(l => l.parent === parent);
              const total = losses.reduce((a, l) => a + l.minutes, 0);
              return (
                <div key={parent}>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold uppercase tracking-wider">{parent}</span>
                    <span className="tabular-nums text-muted-foreground">{total} min lost</span>
                  </div>
                  <div className="h-3 bg-muted overflow-hidden rounded-sm flex">
                    {losses.map((l, i) => (
                      <div
                        key={l.category}
                        className="h-full transition-all"
                        style={{
                          width: `${(l.minutes / total) * 100}%`,
                          background: i === 0 ? "var(--foreground)" : i === 1 ? "var(--foreground)" : "var(--muted-foreground)",
                          opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.4,
                        }}
                        title={`${l.category}: ${l.minutes} min`}
                      />
                    ))}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                    {losses.map((l, i) => (
                      <span key={l.category}>
                        <span className="inline-block h-2 w-2 mr-1 align-middle" style={{ background: i === 0 ? "var(--foreground)" : i === 1 ? "var(--foreground)" : "var(--muted-foreground)", opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.4 }} />
                        {l.category} ({l.minutes}m)
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ===================================================================
   MODULE: MAINTENANCE
   =================================================================== */
function MaintenanceModule() {
  const [selectedMO, setSelectedMO] = React.useState<typeof MAINTENANCE[number] | null>(null);
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 08 · CMMS"
        title="Maintenance Management"
        description="Preventive, corrective, predictive · MTBF / MTTR · spares & calibration"
        icon={Wrench}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Open WOs" value={MAINTENANCE.filter(m => m.status === "open").length} />
        <MiniKPI label="Scheduled PM" value={MAINTENANCE.filter(m => m.type === "preventive").length} />
        <MiniKPI label="Breakdowns" value={MAINTENANCE.filter(m => m.type === "corrective").length} />
        <MiniKPI label="PM Compliance" value="86%" />
        <MiniKPI label="Avg MTTR" value="5.2h" />
      </div>

      <Card className="overflow-hidden">
        <PanelHeader title="Maintenance Work Orders" icon={Wrench} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Asset</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Priority</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Assigned</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Due</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">MTBF</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">MTTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MAINTENANCE.map((m) => (
                <tr key={m.id} className="hover:bg-accent/30 cursor-pointer" onClick={() => setSelectedMO(m)}>
                  <td className="px-3 py-2.5 font-mono font-bold text-[11px]">{m.id}</td>
                  <td className="px-3 py-2.5">{m.asset}</td>
                  <td className="px-3 py-2.5 font-mono font-bold">{m.plant}</td>
                  <td className="px-3 py-2.5">
                    <MonoTag variant={m.type === "corrective" ? "solid" : m.type === "preventive" ? "outline" : "default"}>
                      {m.type.toUpperCase()}
                    </MonoTag>
                  </td>
                  <td className="px-3 py-2.5"><PriorityMark priority={m.priority} /></td>
                  <td className="px-3 py-2.5 text-[11px]">{m.assignedTo || "-"}</td>
                  <td className="px-3 py-2.5 text-[11px] tabular-nums">
                    {formatDate(m.dueDate)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn(
                      "inline-flex h-5 items-center rounded px-1.5 text-[10px] font-bold uppercase tracking-wider",
                      m.status === "completed" ? "bg-muted text-primary" :
                      m.status === "in-progress" ? "bg-primary text-primary-foreground" :
                      m.status === "scheduled" ? "border border-border text-muted-foreground" :
                      "border-2 border-primary text-primary"
                    )}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-[11px]">{m.mtbf ? `${m.mtbf}h` : "-"}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-[11px]">{m.mttr ? `${m.mttr}h` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Maintenance order detail drawer */}
      <Sheet open={selectedMO !== null} onOpenChange={(o) => { if (!o) setSelectedMO(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
          {selectedMO && (
            <>
              <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Wrench className="h-3.5 w-3.5" />
                  Maintenance Work Order
                </div>
                <SheetTitle className="text-xl font-bold tracking-tight font-mono">{selectedMO.id}</SheetTitle>
                <SheetDescription className="text-sm">{selectedMO.asset}</SheetDescription>
                <div className="mt-2 flex items-center gap-2">
                  <MonoTag variant={selectedMO.type === "corrective" ? "destructive" : selectedMO.type === "preventive" ? "success" : "default"}>
                    {selectedMO.type.toUpperCase()}
                  </MonoTag>
                  <PriorityMark priority={selectedMO.priority} />
                </div>
              </SheetHeader>
              <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="Order ID" value={selectedMO.id} mono />
                  <DetailField label="Asset" value={selectedMO.asset} />
                  <DetailField label="Plant" value={selectedMO.plant} mono />
                  <DetailField label="Type" value={selectedMO.type.toUpperCase()} />
                  <DetailField label="Priority" value={selectedMO.priority.toUpperCase()} />
                  <DetailField label="Status" value={selectedMO.status.toUpperCase()} />
                  {selectedMO.assignedTo && <DetailField label="Assigned To" value={selectedMO.assignedTo} />}
                  <DetailField label="Due Date" value={formatDateYear(selectedMO.dueDate)} />
                  {selectedMO.mtbf && <DetailField label="MTBF" value={`${selectedMO.mtbf}h`} />}
                  {selectedMO.mttr && <DetailField label="MTTR" value={`${selectedMO.mttr}h`} />}
                </div>
                {selectedMO.mtbf && selectedMO.mttr && (
                  <div>
                    <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Reliability Metrics</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded border border-border bg-card p-3 text-center">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">MTBF</div>
                        <div className="text-lg font-bold tabular-nums">{selectedMO.mtbf}h</div>
                      </div>
                      <div className="rounded border border-border bg-card p-3 text-center">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">MTTR</div>
                        <div className="text-lg font-bold tabular-nums">{selectedMO.mttr}h</div>
                      </div>
                      <div className="rounded border border-border bg-card p-3 text-center">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Availability</div>
                        <div className="text-lg font-bold tabular-nums text-primary">{((selectedMO.mtbf / (selectedMO.mtbf + selectedMO.mttr)) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Assign", "Technician assignment dialog opened")}>
                  <Users className="h-3.5 w-3.5" /> Assign
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Exported", "Maintenance order exported")}>
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => notifySuccess("Status Updated", "Maintenance order status advanced")}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Update Status
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ===================================================================
   MODULE: ENERGY
   =================================================================== */
function EnergyModule() {
  const totals = ENERGY_TREND.map((d) => d.k1 + d.k2 + d.k3 + d.r1);
  const total = totals.reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 09 · ISO 14001"
        title="Energy & Utilities Monitoring"
        description="Per-plant metering, energy-per-unit, CO2 intensity, peak demand"
        icon={Zap}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Total Today" value={`${(total / 1000).toFixed(1)} MWh`} />
        <MiniKPI label="kWh / MT" value="412" />
        <MiniKPI label="CO₂ / MT" value="0.34 t" />
        <MiniKPI label="Peak Demand" value="88%" />
        <MiniKPI label="Cost Today" value="₹2.4L" />
      </div>

      <Card className="overflow-hidden">
        <PanelHeader
          title="Energy Consumption - 24h"
          subtitle="Per-plant kWh trend"
          icon={Zap}
          action={
            <div className="flex items-center gap-3 text-[10px]">
              <LegendDot label="K1" solid />
              <LegendDot label="K2" solid />
              <LegendDot label="K3" solid />
              <LegendDot label="R1" solid />
            </div>
          }
        />
        <div className="p-4">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ENERGY_TREND} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} className="text-primary" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" interval={2} />
              <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" />
              <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11 }} />
              <Bar dataKey="k1" stackId="a" fill="currentColor" fillOpacity={0.9} className="text-primary" />
              <Bar dataKey="k2" stackId="a" fill="currentColor" fillOpacity={0.7} className="text-primary" />
              <Bar dataKey="k3" stackId="a" fill="currentColor" fillOpacity={0.5} className="text-primary" />
              <Bar dataKey="r1" stackId="a" fill="currentColor" fillOpacity={0.3} className="text-primary" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* HDG analytics */}
      <Card className="overflow-hidden">
        <PanelHeader title="HDG Process Analytics - K2" subtitle="Bath temp · dwell · Zn consumption · energy per batch" icon={Factory} />
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricBox label="Bath Temp" value="452" unit="°C" spec="445-460" />
          <MetricBox label="Dwell Time" value="8.5" unit="min" spec="6-10" />
          <MetricBox label="Zn Usage" value="82" unit="%" spec="≥ 30" />
          <MetricBox label="Energy/Batch" value="412" unit="kWh" spec="< 450" />
        </div>
      </Card>
    </div>
  );
}

/* ===================================================================
   MODULE: WORKFORCE
   =================================================================== */
function WorkforceModule() {
  const [selectedOperator, setSelectedOperator] = React.useState<typeof OPERATORS_DATA[number] | null>(null);
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 10 · IWE / NACE / FROSIO"
        title="Workforce / Labour Management"
        description="Skills matrix, certification validity, productivity & utilization"
        icon={Users}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Active Operators" value={OPERATORS_DATA.length} />
        <MiniKPI label="Certified Welders" value={OPERATORS_DATA.filter(o => o.certifications.some(c => c.type === "IWE")).length} />
        <MiniKPI label="Inspectors" value={OPERATORS_DATA.filter(o => o.role.includes("Inspector")).length} />
        <MiniKPI label="Cert Expiring" value={OPERATORS_DATA.filter(o => o.certifications.some(c => c.status === "expiring")).length} />
        <MiniKPI label="Avg Utilization" value={`${Math.round(OPERATORS_DATA.reduce((a, o) => a + o.utilization, 0) / OPERATORS_DATA.length)}%`} />
      </div>

      <Card className="overflow-hidden">
        <PanelHeader title="Operators & Certifications" icon={Users} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Operator</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Certifications</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Shift</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Productivity</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {OPERATORS_DATA.map((o) => (
                <tr key={o.id} className="hover:bg-accent/30 cursor-pointer" onClick={() => setSelectedOperator(o)}>
                  <td className="px-3 py-2.5">
                    <div className="font-bold">{o.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{o.id}</div>
                  </td>
                  <td className="px-3 py-2.5">{o.role}</td>
                  <td className="px-3 py-2.5 font-mono font-bold">{o.plant}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {o.certifications.length === 0 && <span className="text-[10px] text-muted-foreground">-</span>}
                      {o.certifications.map((c) => (
                        <span key={c.type} className={cn(
                          "inline-flex h-5 items-center rounded px-1.5 text-[9px] font-bold tracking-wider",
                          c.status === "valid" ? "bg-primary text-primary-foreground" :
                          c.status === "expiring" ? "border-2 border-primary text-primary" :
                          "bg-muted text-primary"
                        )}>
                          {c.type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold">{o.shift}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-bold">{o.productivity}%</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 w-24">
                      <MonoProgress value={o.utilization} />
                      <span className="text-[10px] tabular-nums shrink-0">{o.utilization}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Skills matrix */}
      <Card className="overflow-hidden">
        <PanelHeader title="Skills Matrix" subtitle="Level 1-5 per skill per operator" icon={Users} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Operator</th>
                {["Cutting", "Forming", "Seam Welding", "Sub-Arc", "MIG", "HDG", "Painting", "Inspection", "SPC", "Coating Insp."].map((s) => (
                  <th key={s} className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {OPERATORS_DATA.map((o) => {
                const skillsMap = new Map(o.skills.map(s => [s.skill, s.level]));
                const allSkills = ["Cutting", "Forming", "Seam Welding", "Sub-Arc", "MIG", "HDG", "Painting", "Inspection", "SPC", "Coating Insp."];
                return (
                  <tr key={o.id} className="hover:bg-accent/30">
                    <td className="px-3 py-2 font-bold">{o.name}</td>
                    {allSkills.map((s) => {
                      const lvl = skillsMap.get(s);
                      return (
                        <td key={s} className="px-2 py-2 text-center">
                          {lvl ? (
                            <div className="inline-flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <span
                                  key={i}
                                  className={cn("h-1.5 w-1.5 rounded-full", i <= lvl ? "bg-primary" : "bg-muted")}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/30">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <OperatorDetailDrawer operator={selectedOperator} onClose={() => setSelectedOperator(null)} />
    </div>
  );
}

/* ===================================================================
   MODULE: DOCUMENTS
   =================================================================== */
function DocumentsModule() {
  const [selectedDoc, setSelectedDoc] = React.useState<typeof DOCUMENTS[number] | null>(null);
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 11 · ISO 9001 / 3834-2"
        title="Document & Compliance Management"
        description="WPS/PQR/SOP, version control, point-of-use delivery, audit packs"
        icon={FileText}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Controlled Docs" value={DOCUMENTS.length} />
        <MiniKPI label="Approved" value={DOCUMENTS.filter(d => d.status === "approved").length} />
        <MiniKPI label="Under Review" value={DOCUMENTS.filter(d => d.status === "under-review").length} />
        <MiniKPI label="Audit Pack Time" value="< 5 min" />
        <MiniKPI label="Compliance" value="98.4%" />
      </div>

      <Card className="overflow-hidden">
        <PanelHeader title="Controlled Documents" icon={FileText} action={<Button size="sm" variant="outline" className="h-7 text-[11px] gap-1.5" onClick={() => notifySuccess("Audit Pack Generated", "Complete ISO 9001/3834-2 evidence pack exported as PDF")}><Download className="h-3 w-3" /> Audit Pack</Button>} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Doc ID</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Rev</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Effective</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Review Due</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DOCUMENTS.map((d) => {
                const reviewDue = new Date(d.review).getTime() < 1724697600000 + 86400000 * 30;
                return (
                  <tr key={d.id} className="hover:bg-accent/30 cursor-pointer" onClick={() => setSelectedDoc(d)}>
                    <td className="px-3 py-2.5 font-mono font-bold text-[11px]">{d.id}</td>
                    <td className="px-3 py-2.5 font-medium">{d.name}</td>
                    <td className="px-3 py-2.5"><MonoTag>{d.type}</MonoTag></td>
                    <td className="px-3 py-2.5 font-mono font-bold tabular-nums">{d.revision}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn(
                        "inline-flex h-5 items-center rounded px-1.5 text-[10px] font-bold uppercase tracking-wider",
                        d.status === "approved" ? "bg-primary text-primary-foreground" : "border-2 border-primary text-primary"
                      )}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-[11px]">{d.effective}</td>
                    <td className="px-3 py-2.5 tabular-nums text-[11px]">
                      <span className={cn(reviewDue && "font-bold")}>{d.review}</span>
                      {reviewDue && <span className="ml-1 text-[9px] uppercase">· due</span>}
                    </td>
                    <td className="px-3 py-2.5 text-[11px]">{d.owner}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Document detail drawer */}
      <Sheet open={selectedDoc !== null} onOpenChange={(o) => { if (!o) setSelectedDoc(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
          {selectedDoc && (
            <>
              <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Controlled Document
                </div>
                <SheetTitle className="text-xl font-bold tracking-tight">{selectedDoc.name}</SheetTitle>
                <SheetDescription className="text-sm font-mono">{selectedDoc.id} · Rev {selectedDoc.revision}</SheetDescription>
                <div className="mt-2 flex items-center gap-2">
                  <MonoTag variant={selectedDoc.status === "approved" ? "success" : "warning"}>{selectedDoc.status.toUpperCase()}</MonoTag>
                  <MonoTag>{selectedDoc.type}</MonoTag>
                </div>
              </SheetHeader>
              <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="Doc ID" value={selectedDoc.id} mono />
                  <DetailField label="Revision" value={selectedDoc.revision} mono />
                  <DetailField label="Type" value={selectedDoc.type} />
                  <DetailField label="Status" value={selectedDoc.status.toUpperCase()} />
                  <DetailField label="Effective Date" value={selectedDoc.effective} />
                  <DetailField label="Review Due" value={selectedDoc.review} />
                  <DetailField label="Owner" value={selectedDoc.owner} />
                </div>
                <div>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Compliance Checklist</h3>
                  <div className="space-y-1.5">
                    {["Document approved by authorized reviewer", "Current revision served at point of use", "Read-and-understood acknowledgements collected", "Superseded revisions archived", "Review cycle configured (annual)"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 rounded border border-border bg-card p-2 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Version History</h3>
                  <div className="space-y-1.5">
                    {[parseInt(selectedDoc.revision), parseInt(selectedDoc.revision) - 1, parseInt(selectedDoc.revision) - 2].filter(r => r > 0).map((rev, i) => (
                      <div key={rev} className="flex items-center gap-3 rounded border border-border bg-card p-2 text-xs">
                        <span className={cn("grid h-6 w-6 place-items-center rounded text-[10px] font-bold shrink-0", i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>R{rev}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{i === 0 ? "Current revision" : "Superseded"}</div>
                          <div className="text-[10px] text-muted-foreground">{i === 0 ? "Effective: " + selectedDoc.effective : "Archived"}</div>
                        </div>
                        {i === 0 ? <span className="text-[9px] font-bold uppercase text-success">Active</span> : <span className="text-[9px] font-bold uppercase text-muted-foreground">Archived</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("View Document", "Opening document viewer...")}>
                  <Eye className="h-3.5 w-3.5" /> View
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Downloaded", "Document downloaded as PDF")}>
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => notifyInfo("Review Workflow", "Review and approval workflow started")}>
                  <Edit3 className="h-3.5 w-3.5" /> Start Review
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ===================================================================
   MODULE: ANDON BIG SCREEN
   =================================================================== */
function AndonModule() {
  const { activePlant } = useMESPrefs();
  const boards = ANDON_BOARDS.filter(b => activePlant === "ALL" || b.plant === activePlant);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [clock, setClock] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setClock(new Date());
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const focused = boards.find(b => b.id === selected) || boards[0];

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Shop-floor Display"
        title="Andon Big Screen"
        description="Real-time shop-floor status · station state · shift performance"
        icon={Tv}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {boards.map(b => (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-mono font-bold border transition-all",
                (focused?.id === b.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {b.plant} · {b.line}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setFullscreen(!fullscreen)}>
          <Maximize2 className="h-3.5 w-3.5" /> {fullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
        </Button>
      </div>

      {focused && (
        <Card className={cn("overflow-hidden", fullscreen && "fixed inset-4 z-50 max-w-none rounded-none border-2 border-primary")}>
          {/* Andon header bar - inverted */}
          <div className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">Andon Live</div>
                <div className="text-2xl font-bold mt-0.5">{focused.plant} - {focused.line}</div>
                <div className="text-xs opacity-70 mt-0.5">Supervisor: {focused.supervisor} · Shift {focused.shift}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider opacity-70">Live IST</div>
                <div className="text-2xl font-bold tabular-nums font-mono">
                  {clock ? clock.toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" }) : "--:--:--"}
                </div>
                <div className="flex items-center gap-1.5 justify-end mt-1 text-[10px] opacity-70">
                  <span className="h-1.5 w-1.5 rounded-full bg-background pulse-mono" />
                  <span>Streaming · OPC-UA</span>
                </div>
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-border border-b border-border">
            <AndonMetric label="Output" value={focused.output} target={focused.outputTarget} unit="u" />
            <AndonMetric label="OEE" value={focused.oee} target={75} unit="%" />
            <AndonMetric label="Scrap" value={focused.scrap} target={2} unit="%" invert />
            <AndonMetric label="Downtime" value={focused.downtime} target={40} unit="min" invert />
            <AndonMetric label="Alerts" value={focused.activeAlerts} target={0} invert />
          </div>

          {/* Station status row */}
          <div className="p-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Station status · {focused.stations.length} stations
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {focused.stations.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative rounded border-2 p-4 transition-all",
                    s.state === "running" && "border-primary/30 bg-card",
                    s.state === "down" && "border-primary bg-primary text-primary-foreground",
                    s.state === "idle" && "border-dashed border-border bg-muted/30",
                    s.state === "changeover" && "border-primary/60 bg-card"
                  )}
                >
                  {/* Station number */}
                  <div className="absolute top-2 right-2 text-[10px] font-mono opacity-50">S{i + 1}</div>
                  {/* State indicator */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      s.state === "running" && "bg-primary pulse-mono",
                      s.state === "down" && "bg-background pulse-mono",
                      s.state === "idle" && "bg-muted-foreground/40",
                      s.state === "changeover" && "bg-primary/60"
                    )} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{s.state}</span>
                  </div>
                  {/* Name */}
                  <div className="text-sm font-bold">{s.name}</div>
                  <div className="text-[10px] mt-1 opacity-70">Operator: {s.operator}</div>
                  {/* Progress dots for running */}
                  {s.state === "running" && (
                    <div className="flex gap-0.5 mt-2">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <span
                          key={j}
                          className={cn("h-1 flex-1 rounded-sm", j < (i + 3) % 8 ? "bg-primary" : "bg-muted")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer alerts ticker */}
          <div className="border-t border-border px-6 py-3 bg-muted/30 flex items-center gap-3 text-xs">
            <Megaphone className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1 overflow-hidden whitespace-nowrap">
              <span className="font-mono">
                {focused.activeAlerts > 0 ? `[${focused.activeAlerts} active alerts]` : "[all clear]"} ·
                {" "}{focused.andonCalls} andon calls this shift ·
                {" "}output {Math.round((focused.output / focused.outputTarget) * 100)}% of target ·
                {" "}bottleneck: {focused.stations.find(s => s.state === "down")?.name || "none"} ·
                {" "}next shift handover in 02:14:32
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Multi-board overview */}
      {!fullscreen && (
        <Card className="overflow-hidden">
          <PanelHeader title="All Andon Boards" subtitle={`${boards.length} lines · multi-plant`} icon={Tv} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {boards.map(b => (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className="bg-card p-4 text-left hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm">{b.plant} · {b.line}</span>
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    b.status === "running" ? "bg-primary pulse-mono" : "bg-muted-foreground"
                  )} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <div className="text-muted-foreground">OUT</div>
                    <div className="font-bold tabular-nums text-sm">{b.output}<span className="text-muted-foreground">/{b.outputTarget}</span></div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">OEE</div>
                    <div className="font-bold tabular-nums text-sm">{b.oee}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ALERTS</div>
                    <div className="font-bold tabular-nums text-sm">{b.activeAlerts}</div>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(b.output / b.outputTarget) * 100}%` }} />
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function AndonMetric({ label, value, target, unit, invert }: { label: string; value: number; target: number; unit: string; invert?: boolean }) {
  const good = invert ? value <= target : value >= target;
  return (
    <div className="p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold tabular-nums mt-1">
        {value}<span className="text-sm font-medium text-muted-foreground ml-1">{unit}</span>
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">
        Target {target}{unit} · {good ? "on track" : "off target"}
      </div>
    </div>
  );
}

/* ===================================================================
   MODULE: SHIFT HANDOVER LOG
   =================================================================== */
function ShiftHandoverModule() {
  const { activePlant } = useMESPrefs();
  const entries = SHIFT_HANDOVER.filter(e => activePlant === "ALL" || e.plant === activePlant);
  const [filter, setFilter] = React.useState<string>("all");
  const [showCompose, setShowCompose] = React.useState(false);

  const filtered = entries.filter(e => filter === "all" || e.type === filter);
  const unack = entries.filter(e => !e.acknowledged).length;

  const typeMeta: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; border: string }> = {
    handover: { label: "HANDOVER", icon: ArrowRight, border: "border-l-foreground" },
    escalation: { label: "ESCALATION", icon: CircleAlert, border: "border-l-foreground border-l-4" },
    issue: { label: "ISSUE", icon: AlertTriangle, border: "border-l-foreground border-l-2" },
    achievement: { label: "ACHIEVEMENT", icon: ThumbsUp, border: "border-l-muted-foreground" },
    note: { label: "NOTE", icon: MessageSquare, border: "border-l-border" },
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Shift Operations"
        title="Shift Handover Log"
        description="Digital shift log · cross-shift communication · escalations · achievements"
        icon={BookOpen}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Entries Today" value={entries.filter(e => e.date === new Date().toISOString().split("T")[0]).length} />
        <MiniKPI label="Unacknowledged" value={unack} />
        <MiniKPI label="Escalations" value={entries.filter(e => e.type === "escalation").length} />
        <MiniKPI label="Achievements" value={entries.filter(e => e.type === "achievement").length} />
        <MiniKPI label="Open Issues" value={entries.filter(e => e.type === "issue" && !e.acknowledged).length} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {["all", "handover", "escalation", "issue", "achievement", "note"].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
                filter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowCompose(!showCompose)}>
          <Plus className="h-3.5 w-3.5" /> New Entry
        </Button>
      </div>

      {/* Compose form */}
      {showCompose && (
        <Card className="p-4 border-2 border-primary/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">New Shift Entry</span>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowCompose(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <select className="h-9 px-2 rounded border border-border bg-background text-xs">
                <option>Shift A</option>
                <option>Shift B</option>
                <option>Shift C</option>
              </select>
              <select className="h-9 px-2 rounded border border-border bg-background text-xs">
                <option>K1</option>
                <option>K2</option>
                <option>K3</option>
                <option>K4</option>
                <option>R1</option>
              </select>
              <select className="h-9 px-2 rounded border border-border bg-background text-xs">
                <option>Handover</option>
                <option>Escalation</option>
                <option>Issue</option>
                <option>Achievement</option>
                <option>Note</option>
              </select>
              <select className="h-9 px-2 rounded border border-border bg-background text-xs">
                <option>Normal</option>
                <option>High</option>
                <option>Rush</option>
                <option>Low</option>
              </select>
            </div>
            <Input placeholder="Title…" className="h-9 font-medium" />
            <textarea
              className="w-full min-h-[100px] p-2 rounded border border-border bg-background text-sm"
              placeholder="Details - what happened, actions taken, what next shift needs to know…"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCompose(false)}>Cancel</Button>
              <Button size="sm">Submit Entry</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline of entries */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-3">
          {filtered.map((e) => {
            const meta = typeMeta[e.type];
            const Icon = meta.icon;
            return (
              <Card key={e.id} className={cn("relative ml-10 overflow-hidden border-l-4", meta.border)}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={cn(
                            "inline-flex h-5 items-center rounded px-1.5 text-[9px] font-bold tracking-wider",
                            e.type === "escalation" ? "bg-primary text-primary-foreground" :
                            e.type === "achievement" ? "border-2 border-primary" :
                            "bg-muted text-primary"
                          )}>
                            {meta.label}
                          </span>
                          <PriorityMark priority={e.priority} />
                          <span className="text-[10px] font-mono text-muted-foreground">{e.plant}</span>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[10px] text-muted-foreground">Shift {e.shift}</span>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            {formatDateTime(e.timestamp)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold leading-tight">{e.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{e.details}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                          <span><span className="font-semibold text-primary">{e.fromOperator}</span> → <span className="font-semibold text-primary">{e.toOperator}</span></span>
                          {!e.acknowledged && (
                            <span className="inline-flex items-center gap-1 text-primary font-semibold">
                              <Circle className="h-2 w-2" /> Unacknowledged
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!e.acknowledged && (
                      <Button variant="outline" size="sm" className="h-7 text-[10px] shrink-0" onClick={() => notifySuccess("Acknowledged", "Entry acknowledged by supervisor")}>
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Ack
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   MODULE: PRODUCTION LINE SIMULATOR
   =================================================================== */
function LineSimulatorModule() {
  const { activePlant } = useMESPrefs();
  const lines = PRODUCTION_LINES.filter(l => activePlant === "ALL" || l.plant === activePlant);
  const [selectedLine, setSelectedLine] = React.useState<string>(lines[0]?.id || "");
  const [running, setRunning] = React.useState(true);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(t);
  }, [running]);

  const line = lines.find(l => l.id === selectedLine) || lines[0];

  if (!line) {
    return (
      <div className="space-y-6">
        <ModuleHeader eyebrow="Module · Simulation" title="Production Line Simulator" description="Live line flow · bottleneck analysis · WIP visualization" icon={GitBranch} />
        <Card className="p-8 text-center text-muted-foreground text-sm">No production lines for this plant scope.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Simulation"
        title="Production Line Simulator"
        description="Live line flow · bottleneck analysis · WIP visualization · station utilization"
        icon={GitBranch}
      />

      {/* Line selector + controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {lines.map(l => (
            <button
              key={l.id}
              onClick={() => setSelectedLine(l.id)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-mono font-bold border transition-all",
                selectedLine === l.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setRunning(!running)}
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? "Pause" : "Play"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setTick(t => t + 1)}>
            <RefreshCw className="h-3.5 w-3.5" /> Step
          </Button>
        </div>
      </div>

      {/* Line summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <MiniKPI label="Throughput" value={`${line.throughput} u/hr`} />
        <MiniKPI label="Target" value={`${line.targetThroughput} u/hr`} />
        <MiniKPI label="Total WIP" value={line.wipTotal} />
        <MiniKPI label="Stations" value={line.stations.length} />
        <MiniKPI label="Utilization" value={`${Math.round(line.stations.reduce((a, s) => a + s.utilization, 0) / line.stations.length)}%`} />
        <MiniKPI label="Bottleneck" value={line.bottleneck.split(" ")[0]} />
      </div>

      {/* Line flow visualization */}
      <Card className="overflow-hidden">
        <PanelHeader
          title="Line Flow - Live"
          subtitle={`Tick #${tick} · ${running ? "running" : "paused"}`}
          icon={GitBranch}
        />
        <div className="p-6 overflow-x-auto">
          <div className="flex items-stretch gap-2 min-w-[800px]">
            {/* Material in */}
            <div className="flex flex-col items-center justify-center px-4 border-r-2 border-dashed border-primary">
              <ArrowDownToLine className="h-6 w-6 mb-1" />
              <div className="text-[10px] font-semibold uppercase tracking-wider">Material In</div>
              <div className="text-xs font-mono font-bold mt-1">{line.stations[0].wipIn} u</div>
            </div>

            {/* Stations */}
            {line.stations.map((s, i) => {
              const isBottleneck = s.name === line.bottleneck || s.cycleTime > s.idealCycle * 1.1;
              const flowOffset = (tick + i) % 4;
              return (
                <React.Fragment key={s.id}>
                  <div className={cn(
                    "relative flex-1 min-w-[140px] rounded border-2 p-3 transition-all",
                    s.state === "running" && "border-primary/40 bg-card",
                    s.state === "down" && "border-primary bg-primary text-primary-foreground",
                    s.state === "idle" && "border-dashed border-border bg-muted/20",
                    s.state === "changeover" && "border-primary/60",
                    s.state === "blocked" && "border-primary border-dashed",
                    s.state === "starved" && "border-border bg-muted/10",
                    isBottleneck && s.state === "running" && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}>
                    {/* Station number + bottleneck flag */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono opacity-60">S{i + 1}</span>
                      {isBottleneck && s.state === "running" && (
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-1 rounded">BOTTLENECK</span>
                      )}
                    </div>
                    {/* State indicator */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        s.state === "running" && "bg-primary pulse-mono",
                        s.state === "down" && "bg-background pulse-mono",
                        s.state === "idle" && "bg-muted-foreground/30",
                        s.state === "changeover" && "bg-primary/60"
                      )} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{s.state}</span>
                    </div>
                    {/* Name */}
                    <div className="text-sm font-bold leading-tight">{s.name}</div>
                    {/* Operator */}
                    <div className="text-[10px] opacity-70 mt-0.5">Op: {s.operator || "-"}</div>
                    {/* WIP in/out */}
                    <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                      <div className="rounded bg-background/50 dark:bg-primary/5 px-1.5 py-0.5">
                        <div className="opacity-60">IN</div>
                        <div className="font-bold tabular-nums">{s.wipIn}</div>
                      </div>
                      <div className="rounded bg-background/50 dark:bg-primary/5 px-1.5 py-0.5">
                        <div className="opacity-60">OUT</div>
                        <div className="font-bold tabular-nums">{s.wipOut}</div>
                      </div>
                    </div>
                    {/* Cycle time */}
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="opacity-60">Cycle</span>
                      <span className="font-mono font-bold tabular-nums">{s.cycleTime}s</span>
                    </div>
                    {/* Utilization bar */}
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between text-[9px] mb-0.5">
                        <span className="opacity-60">Util</span>
                        <span className="font-bold tabular-nums">{s.utilization}%</span>
                      </div>
                      <div className="h-1 bg-muted overflow-hidden rounded-sm">
                        <div
                          className={cn("h-full transition-all", s.utilization > 80 ? "bg-primary" : s.utilization > 50 ? "bg-primary/70" : "bg-primary/40")}
                          style={{ width: `${s.utilization}%` }}
                        />
                      </div>
                    </div>
                    {/* Flow animation indicator */}
                    {s.state === "running" && (
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                        {[0, 1, 2].map(j => (
                          <span
                            key={j}
                            className={cn(
                              "h-1 w-1 rounded-full transition-all",
                              j === flowOffset ? "bg-primary opacity-100" : "bg-primary opacity-30"
                            )}
                          />
                        ))}
                      </div>
                    )}
                    {/* Last event */}
                    {s.lastEvent && (
                      <div className="mt-2 pt-2 border-t border-border/50 text-[9px] text-muted-foreground">
                        <div className="font-semibold truncate">{s.lastEvent}</div>
                        {s.lastEventTime && <div className="tabular-nums">{s.lastEventTime}</div>}
                      </div>
                    )}
                  </div>
                  {/* Connector arrow between stations */}
                  {i < line.stations.length - 1 && (
                    <div className="flex items-center justify-center w-6">
                      <ArrowRight className={cn(
                        "h-4 w-4 transition-opacity",
                        running && ((tick + i) % 2 === 0) ? "opacity-100" : "opacity-30"
                      )} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Finished goods out */}
            <div className="flex flex-col items-center justify-center px-4 border-l-2 border-dashed border-primary">
              <ArrowUpFromLine className="h-6 w-6 mb-1" />
              <div className="text-[10px] font-semibold uppercase tracking-wider">FG Out</div>
              <div className="text-xs font-mono font-bold mt-1">{line.stations[line.stations.length - 1].wipOut} u</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Throughput chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <PanelHeader title="Throughput Trend - Simulated" subtitle="Last 60s · units per minute" icon={BarChart3} />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={Array.from({ length: 30 }).map((_, i) => ({
                  t: i,
                  u: Math.max(0, Math.round(line.throughput / 60 * 60 + Math.sin((i + tick) / 4) * 3 - (i % 3))),
                }))}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} className="text-primary" />
                <XAxis dataKey="t" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" interval={4} />
                <YAxis tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" />
                <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 10 }} />
                <Bar dataKey="u" fill="currentColor" className="text-primary" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <PanelHeader title="Station Utilization" subtitle="Real-time" icon={Gauge} />
          <div className="p-4 space-y-3">
            {line.stations.map((s, i) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-medium"><span className="font-mono opacity-50 mr-1.5">S{i+1}</span>{s.name}</span>
                  <span className="tabular-nums font-bold">{s.utilization}%</span>
                </div>
                <div className="h-2 bg-muted overflow-hidden rounded-sm">
                  <div
                    className={cn("h-full transition-all", s.utilization > 80 ? "bg-primary" : s.utilization > 50 ? "bg-primary/70" : "bg-primary/40")}
                    style={{ width: `${s.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ===================================================================
   MODULE: SUPPLIER SCORECARD
   =================================================================== */
function SuppliersModule() {
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = React.useState<string | null>(null);

  const filtered = SUPPLIERS.filter(s => categoryFilter === "all" || s.category === categoryFilter);
  const categories = ["all", "Steel", "Coating", "Welding", "Paint", "Spare"];
  const tierA = SUPPLIERS.filter(s => s.tier === "A").length;
  const tierB = SUPPLIERS.filter(s => s.tier === "B").length;
  const avgRating = Math.round(SUPPLIERS.reduce((a, s) => a + s.rating, 0) / SUPPLIERS.length);
  const totalNCRs = SUPPLIERS.reduce((a, s) => a + s.openNCRs, 0);
  const selected = SUPPLIERS.find(s => s.id === selectedSupplier);

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Procurement Quality"
        title="Supplier Scorecard"
        description="Vendor rating · on-time delivery · quality acceptance · defect PPM"
        icon={Truck}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Active Suppliers" value={SUPPLIERS.length} />
        <MiniKPI label="Tier A" value={tierA} />
        <MiniKPI label="Tier B" value={tierB} />
        <MiniKPI label="Avg Rating" value={`${avgRating}/100`} />
        <MiniKPI label="Open NCRs" value={totalNCRs} />
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={cn(
              "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
              categoryFilter === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Supplier grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(s => (
          <Card
            key={s.id}
            className={cn(
              "p-4 cursor-pointer transition-all hover:border-primary/40 hover:shadow-sm",
              selectedSupplier === s.id && "ring-1 ring-primary/30"
            )}
            onClick={() => setSelectedSupplier(s.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{s.name}</span>
                  <span className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold",
                    s.tier === "A" ? "bg-primary text-primary-foreground" :
                    s.tier === "B" ? "border-2 border-primary" :
                    s.tier === "C" ? "border border-primary/40" :
                    "border border-border text-muted-foreground"
                  )}>
                    {s.tier}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{s.category} · {s.location}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold tabular-nums">{s.rating}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">/ 100</div>
              </div>
            </div>
            {/* Rating bar */}
            <div className="h-1.5 bg-muted overflow-hidden rounded-sm mb-3">
              <div
                className={cn("h-full", s.rating >= 90 ? "bg-primary" : s.rating >= 80 ? "bg-primary/80" : "bg-primary/50")}
                style={{ width: `${s.rating}%` }}
              />
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <div className="text-muted-foreground">On-time</div>
                <div className="font-bold tabular-nums text-sm">{s.onTimeDelivery}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Quality</div>
                <div className="font-bold tabular-nums text-sm">{s.qualityAcceptance}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Defect PPM</div>
                <div className="font-bold tabular-nums text-sm">{s.defectPpm}</div>
              </div>
            </div>
            {/* Trend mini-bars */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-[9px] mb-1.5">
                <span className="text-muted-foreground uppercase tracking-wider">6-month trend</span>
                <span className={cn("font-bold", s.trend[s.trend.length - 1] > s.trend[0] ? "" : "text-muted-foreground")}>
                  {s.trend[s.trend.length - 1] > s.trend[0] ? "↑" : "↓"} {Math.abs(s.trend[s.trend.length - 1] - s.trend[0])}
                </span>
              </div>
              <MiniBars data={s.trend} />
            </div>
            {/* Open NCR indicator */}
            {s.openNCRs > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                <AlertOctagon className="h-3 w-3" />
                <span className="font-semibold">{s.openNCRs} open NCR{s.openNCRs > 1 ? "s" : ""}</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Selected supplier detail */}
      {selected && (
        <Card className="overflow-hidden border-2 border-primary/20">
          <PanelHeader
            title={`Supplier Detail - ${selected.name}`}
            subtitle={`${selected.id} · ${selected.category} · Tier ${selected.tier}`}
            icon={Truck}
            action={<Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setSelectedSupplier(null)}>Close</Button>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            <div className="bg-card p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Performance Metrics</div>
              <div className="space-y-2">
                <MetricRow label="Overall Rating" value={`${selected.rating}/100`} ratio={selected.rating} />
                <MetricRow label="On-Time Delivery" value={`${selected.onTimeDelivery}%`} ratio={selected.onTimeDelivery} />
                <MetricRow label="Quality Acceptance" value={`${selected.qualityAcceptance}%`} ratio={selected.qualityAcceptance} />
                <MetricRow label="Defect Rate" value={`${selected.defectPpm} PPM`} ratio={100 - (selected.defectPpm / 10)} invert />
              </div>
            </div>
            <div className="bg-card p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Order History</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Total Orders</span><span className="font-bold tabular-nums">{selected.totalOrders}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Open NCRs</span><span className="font-bold tabular-nums">{selected.openNCRs}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Last Delivery</span><span className="tabular-nums">{formatDate(selected.lastDelivery)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-mono text-[10px]">{selected.contact}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{selected.location}</span></div>
              </div>
            </div>
            <div className="bg-card p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Rating Trend (6 months)</div>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={selected.trend.map((v, i) => ({ month: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"][i], value: v }))} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="supGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} className="text-primary" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0} className="text-primary" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} className="text-primary" />
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" />
                  <YAxis tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" domain={[70, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 10 }} />
                  <Area type="monotone" dataKey="value" stroke="currentColor" strokeWidth={2} fill="url(#supGrad)" className="text-primary" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function MetricRow({ label, value, ratio, invert }: { label: string; value: string; ratio: number; invert?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 bg-muted overflow-hidden rounded-sm">
        <div
          className={cn("h-full", invert ? (ratio < 50 ? "bg-primary" : "bg-primary/50") : (ratio > 80 ? "bg-primary" : "bg-primary/50"))}
          style={{ width: `${Math.min(100, Math.max(0, ratio))}%` }}
        />
      </div>
    </div>
  );
}

/* ===================================================================
   MODULE: AUDIT TRAIL
   =================================================================== */
function AuditTrailModule() {
  const [actionFilter, setActionFilter] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [showDetails, setShowDetails] = React.useState<string | null>(null);

  const actions = ["all", "create", "update", "delete", "approve", "release", "hold", "complete", "acknowledge", "login", "export"];
  const filtered = AUDIT_TRAIL.filter(a => {
    if (actionFilter !== "all" && a.action !== actionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.user.toLowerCase().includes(q) || a.entityId.toLowerCase().includes(q) ||
             a.details.toLowerCase().includes(q) || a.module.toLowerCase().includes(q);
    }
    return true;
  });

  const actionMeta: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
    create: { icon: Plus, label: "CREATE" },
    update: { icon: Edit3, label: "UPDATE" },
    delete: { icon: X, label: "DELETE" },
    approve: { icon: CheckCircle2, label: "APPROVE" },
    release: { icon: ArrowRight, label: "RELEASE" },
    hold: { icon: Ban, label: "HOLD" },
    complete: { icon: CheckCircle2, label: "COMPLETE" },
    acknowledge: { icon: Eye, label: "ACK" },
    login: { icon: Fingerprint, label: "LOGIN" },
    logout: { icon: Fingerprint, label: "LOGOUT" },
    export: { icon: Download, label: "EXPORT" },
    reject: { icon: X, label: "REJECT" },
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Compliance & Security"
        title="Audit Trail"
        description="Tamper-evident activity log · ISO 9001 / 3834-2 evidence · every action tracked"
        icon={History}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Events (24h)" value={AUDIT_TRAIL.length} />
        <MiniKPI label="Unique Users" value={new Set(AUDIT_TRAIL.map(a => a.user)).size} />
        <MiniKPI label="Critical Actions" value={AUDIT_TRAIL.filter(a => ["delete", "approve", "hold"].includes(a.action)).length} />
        <MiniKPI label="Modules Touched" value={new Set(AUDIT_TRAIL.map(a => a.module)).size} />
        <MiniKPI label="Integrity" value="100%" />
      </div>

      {/* Filter bar */}
      <Card className="overflow-hidden">
        <div className="border-b border-border p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, entity, action…"
              className="h-8 pl-8 text-xs bg-muted/40"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {actions.map(a => (
              <button
                key={a}
                onClick={() => setActionFilter(a)}
                className={cn(
                  "px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all",
                  actionFilter === a ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Audit log table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Timestamp</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Module</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Entity</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Details</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(a => {
                const meta = actionMeta[a.action] || actionMeta.update;
                const Icon = meta.icon;
                const expanded = showDetails === a.id;
                return (
                  <React.Fragment key={a.id}>
                    <tr
                      className="hover:bg-accent/30 cursor-pointer"
                      onClick={() => setShowDetails(expanded ? null : a.id)}
                    >
                      <td className="px-3 py-2.5 tabular-nums text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDateTime(a.timestamp)}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold">{a.user}</div>
                        <div className="text-[9px] text-muted-foreground">{a.role}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn(
                          "inline-flex items-center gap-1 h-5 px-1.5 rounded text-[9px] font-bold uppercase tracking-wider",
                          ["delete", "reject"].includes(a.action) ? "border-2 border-primary" :
                          ["create", "approve", "complete"].includes(a.action) ? "bg-primary text-primary-foreground" :
                          ["hold"].includes(a.action) ? "border-2 border-primary" :
                          "bg-muted text-primary"
                        )}>
                          <Icon className="h-2.5 w-2.5" />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{a.module}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-mono font-bold text-[11px]">{a.entityId}</div>
                        <div className="text-[9px] text-muted-foreground">{a.entity}</div>
                      </td>
                      <td className="px-3 py-2.5 font-mono font-bold">{a.plant || "-"}</td>
                      <td className="px-3 py-2.5 text-[11px] max-w-md truncate text-muted-foreground">{a.details}</td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">{a.ipAddress}</td>
                    </tr>
                    {expanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Event Details</div>
                              <div className="space-y-1 text-xs">
                                <div><span className="text-muted-foreground">Audit ID:</span> <span className="font-mono font-bold">{a.id}</span></div>
                                <div><span className="text-muted-foreground">Timestamp (UTC):</span> <span className="tabular-nums">{new Date(a.timestamp).toISOString()}</span></div>
                                <div><span className="text-muted-foreground">User:</span> <span className="font-semibold">{a.user}</span> ({a.role})</div>
                                <div><span className="text-muted-foreground">Entity:</span> <span className="font-mono">{a.entity} · {a.entityId}</span></div>
                                <div><span className="text-muted-foreground">IP Address:</span> <span className="font-mono">{a.ipAddress}</span></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Full Description</div>
                              <p className="text-xs leading-relaxed">{a.details}</p>
                              <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                                <Lock className="h-3 w-3" />
                                <span>Tamper-evident · hash: SHA-256 · chained to previous entry</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            <span>Audit log integrity verified · {filtered.length} of {AUDIT_TRAIL.length} entries shown</span>
          </span>
          <span className="font-mono">Last verified: {"--:--:--"}</span>
        </div>
      </Card>
    </div>
  );
}

/* ===================================================================
   MODULE: CUSTOMER PORTAL
   =================================================================== */
function CustomerPortalModule() {
  const [selectedOrder, setSelectedOrder] = React.useState<string | null>(CUSTOMER_ORDERS[0]?.id || null);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const statuses = ["all", "confirmed", "in-production", "qc-pending", "ready-to-ship", "dispatched", "delivered"];
  const filtered = CUSTOMER_ORDERS.filter(o => statusFilter === "all" || o.status === statusFilter);
  const order = CUSTOMER_ORDERS.find(o => o.id === selectedOrder) || CUSTOMER_ORDERS[0];

  const statusMeta: Record<string, { label: string; cls: string }> = {
    "confirmed": { label: "CONFIRMED", cls: "border border-border text-muted-foreground" },
    "in-production": { label: "IN PRODUCTION", cls: "bg-primary text-primary-foreground" },
    "qc-pending": { label: "QC PENDING", cls: "border-2 border-primary" },
    "ready-to-ship": { label: "READY TO SHIP", cls: "bg-primary text-primary-foreground" },
    "dispatched": { label: "DISPATCHED", cls: "bg-muted text-primary" },
    "delivered": { label: "DELIVERED", cls: "bg-muted text-primary" },
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Customer Transparency"
        title="Customer Portal"
        description="Order status · as-built documentation · serial traceability · live delivery tracking"
        icon={Globe}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Active Orders" value={CUSTOMER_ORDERS.filter(o => !["delivered"].includes(o.status)).length} />
        <MiniKPI label="In Production" value={CUSTOMER_ORDERS.filter(o => o.status === "in-production").length} />
        <MiniKPI label="Ready to Ship" value={CUSTOMER_ORDERS.filter(o => o.status === "ready-to-ship").length} />
        <MiniKPI label="Dispatched" value={CUSTOMER_ORDERS.filter(o => ["dispatched", "delivered"].includes(o.status)).length} />
        <MiniKPI label="Avg Docs Ready" value={`${Math.round(CUSTOMER_ORDERS.reduce((a, o) => a + o.documentation.filter(d => d.status === "ready").length / o.documentation.length, 0) / CUSTOMER_ORDERS.length * 100)}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Order list */}
        <Card className="overflow-hidden lg:col-span-1">
          <PanelHeader title="Orders" subtitle={`${filtered.length} shown`} icon={ClipboardList} />
          <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
            {filtered.map(o => (
              <button
                key={o.id}
                onClick={() => setSelectedOrder(o.id)}
                className={cn(
                  "w-full text-left p-3 rounded border transition-all",
                  selectedOrder === o.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent/40"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs">{o.orderNo}</span>
                  <span className={cn(
                    "inline-flex h-4 items-center rounded px-1 text-[8px] font-bold uppercase tracking-wider",
                    selectedOrder === o.id ? "bg-background text-primary" : statusMeta[o.status].cls
                  )}>
                    {statusMeta[o.status].label}
                  </span>
                </div>
                <div className="text-xs font-semibold truncate">{o.customer}</div>
                <div className="text-[10px] opacity-70 truncate font-mono">{o.product} · {o.qty} u</div>
                <div className="mt-1.5 flex items-center justify-between text-[9px] opacity-60">
                  <span>Promise: {formatDate(o.promisedDate)}</span>
                  <span>{o.serials.length} serials</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Order detail */}
        <Card className="lg:col-span-2 overflow-hidden">
          {order && (
            <>
              <PanelHeader
                title={`Order ${order.orderNo}`}
                subtitle={`${order.customer} · ${order.product} · ${order.qty} units`}
                icon={PackageCheck}
                action={
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" onClick={() => notifySuccess("Documentation Pack", "Complete document dossier exported")}>
                      <Download className="h-3 w-3" /> Docs Pack
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" onClick={() => notifyInfo("Order Tracking", "Opening shipment tracking...")}>
                      <ExternalLink className="h-3 w-3" /> Track
                    </Button>
                  </div>
                }
              />
              <div className="p-4 space-y-4">
                {/* Status timeline */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Order Progress</div>
                  <div className="relative">
                    <div className="absolute top-3 left-0 right-0 h-px bg-border" />
                    <div
                      className="absolute top-3 left-0 h-px bg-primary transition-all"
                      style={{ width: `${
                        order.status === "confirmed" ? 0 :
                        order.status === "in-production" ? 25 :
                        order.status === "qc-pending" ? 50 :
                        order.status === "ready-to-ship" ? 75 :
                        order.status === "dispatched" ? 90 : 100
                      }%` }}
                    />
                    <div className="relative flex justify-between">
                      {[
                        { label: "Confirmed", done: true },
                        { label: "Production", done: ["in-production", "qc-pending", "ready-to-ship", "dispatched", "delivered"].includes(order.status) },
                        { label: "QC Pass", done: ["qc-pending", "ready-to-ship", "dispatched", "delivered"].includes(order.status) },
                        { label: "Ready", done: ["ready-to-ship", "dispatched", "delivered"].includes(order.status) },
                        { label: "Dispatched", done: ["dispatched", "delivered"].includes(order.status) },
                        { label: "Delivered", done: order.status === "delivered" },
                      ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                          <div className={cn(
                            "h-6 w-6 rounded-full grid place-items-center border-2 transition-all",
                            step.done ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"
                          )}>
                            {step.done && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                          <span className={cn("text-[9px] font-semibold uppercase tracking-wider", step.done ? "text-primary" : "text-muted-foreground")}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order details grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <PortalDetailField label="Customer" value={order.customer} />
                  <PortalDetailField label="Order No." value={order.orderNo} mono />
                  <PortalDetailField label="Product" value={order.product} mono />
                  <PortalDetailField label="Quantity" value={`${order.qty} units`} />
                  <PortalDetailField label="Dispatched" value={`${order.dispatchedQty} units`} />
                  <PortalDetailField label="Status" value={statusMeta[order.status].label} />
                  <PortalDetailField label="PO Date" value={formatDateYear(order.poDate)} />
                  <PortalDetailField label="Promised Date" value={formatDateYear(order.promisedDate)} />
                  <PortalDetailField label="Delivery Location" value={order.deliveryLocation} />
                  {order.endTransformer && <PortalDetailField label="End Transformer" value={order.endTransformer} mono />}
                  {order.dispatchedDate && <PortalDetailField label="Dispatched On" value={formatDateYear(order.dispatchedDate)} />}
                </div>

                {/* Documentation checklist */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Documentation Pack</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {order.documentation.map((d, i) => (
                      <div key={i} className={cn(
                        "flex items-center gap-2 p-2 rounded border text-xs",
                        d.status === "ready" ? "border-primary/30 bg-primary/5" :
                        d.status === "pending" ? "border-dashed border-border" :
                        "border-border opacity-50"
                      )}>
                        {d.status === "ready" ? (
                          <FileCheck className="h-3.5 w-3.5 shrink-0" />
                        ) : d.status === "pending" ? (
                          <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        ) : (
                          <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-[11px] truncate">{d.label}</div>
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{d.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Serials */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Serial Numbers ({order.serials.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {order.serials.map(s => (
                      <span key={s} className="font-mono text-[10px] px-2 py-1 rounded border border-border bg-muted/30">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <Workflow className="h-3 w-3" />
                    <span>Click any serial to view full as-built genealogy in Traceability module</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function PortalDetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded border border-border p-2.5 bg-muted/20">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-sm font-bold mt-0.5 truncate", mono && "font-mono")}>{value}</div>
    </div>
  );
}

/* ===================================================================
   MODULE: DISPATCH & LOGISTICS
   =================================================================== */
function DispatchModule() {
  const { activePlant } = useMESPrefs();
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedShipment, setSelectedShipment] = React.useState<string | null>(SHIPMENTS[0]?.id || null);

  const shipments = SHIPMENTS.filter(s => activePlant === "ALL" || s.plant === activePlant);
  const filtered = shipments.filter(s => statusFilter === "all" || s.status === statusFilter);
  const statuses = ["all", "loading", "in-transit", "delivered", "delayed", "scheduled"];
  const shipment = SHIPMENTS.find(s => s.id === selectedShipment) || SHIPMENTS[0];

  const statusMeta: Record<string, { label: string; cls: string }> = {
    "loading": { label: "LOADING", cls: "border-2 border-primary" },
    "in-transit": { label: "IN TRANSIT", cls: "bg-primary text-primary-foreground" },
    "delivered": { label: "DELIVERED", cls: "bg-muted text-primary" },
    "delayed": { label: "DELAYED", cls: "border-2 border-primary bg-primary/5" },
    "scheduled": { label: "SCHEDULED", cls: "border border-border text-muted-foreground" },
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Order-to-Dispatch"
        title="Dispatch & Logistics"
        description="Shipments · manifests · carrier tracking · POD · documentation pack"
        icon={PackageCheck}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Active Shipments" value={shipments.filter(s => ["loading", "in-transit"].includes(s.status)).length} />
        <MiniKPI label="In Transit" value={shipments.filter(s => s.status === "in-transit").length} />
        <MiniKPI label="Delayed" value={shipments.filter(s => s.status === "delayed").length} />
        <MiniKPI label="Delivered (30d)" value={shipments.filter(s => s.status === "delivered").length} />
        <MiniKPI label="Total Weight" value={`${shipments.reduce((a, s) => a + s.weight, 0).toFixed(1)} MT`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Shipment list */}
        <Card className="overflow-hidden lg:col-span-2">
          <PanelHeader
            title="Shipment Board"
            subtitle={`${filtered.length} shipments`}
            icon={PackageCheck}
            action={
              <div className="flex items-center gap-1">
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all",
                      statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {s.replace("-", " ")}
                  </button>
                ))}
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Manifest</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Destination</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Units</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Weight</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">ETA</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedShipment(s.id)}
                    className={cn(
                      "cursor-pointer hover:bg-accent/30 transition-colors",
                      selectedShipment === s.id && "bg-accent/50"
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-mono font-bold text-[11px]">{s.manifestNo}</div>
                      <div className="text-[9px] text-muted-foreground font-mono">{s.lrNo}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-semibold truncate max-w-[120px]">{s.customer}</div>
                      <div className="text-[9px] text-muted-foreground font-mono">{s.orderNo}</div>
                    </td>
                    <td className="px-3 py-2.5 truncate max-w-[140px] text-[11px]">{s.destination}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-bold">{s.units}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{s.weight} MT</td>
                    <td className="px-3 py-2.5 text-[10px] tabular-nums">
                      {formatDate(s.eta)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={cn("inline-flex h-5 items-center rounded px-1.5 text-[9px] font-bold uppercase tracking-wider", statusMeta[s.status].cls)}>
                        {statusMeta[s.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Shipment detail */}
        <Card className="overflow-hidden">
          {shipment && (
            <>
              <PanelHeader
                title={`Manifest ${shipment.manifestNo}`}
                subtitle={`${shipment.carrier} · ${shipment.vehicleNo}`}
                icon={Route}
              />
              <div className="p-4 space-y-4">
                {/* Transit progress */}
                {shipment.coordinates && (
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-2">
                      <span className="font-semibold uppercase tracking-wider text-muted-foreground">Transit Progress</span>
                      <span className="font-bold tabular-nums">{shipment.coordinates.progress}%</span>
                    </div>
                    <div className="relative h-2 bg-muted overflow-hidden rounded-sm">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary transition-all"
                        style={{ width: `${shipment.coordinates.progress}%` }}
                      />
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className="h-3 w-3 rounded-full bg-primary border-2 border-background shadow-sm"
                          style={{ marginLeft: `calc(${shipment.coordinates.progress}% - 6px)` }}
                        />
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground">
                      <span>{shipment.plant} Plant</span>
                      <span>{shipment.destination}</span>
                    </div>
                  </div>
                )}

                {/* Shipment details */}
                <div className="space-y-2 text-xs">
                  <Row label="Customer" value={shipment.customer} />
                  <Row label="Order No." value={shipment.orderNo} mono />
                  <Row label="Carrier" value={shipment.carrier} />
                  <Row label="Vehicle" value={shipment.vehicleNo} mono />
                  <Row label="Driver" value={shipment.driver} />
                  <Row label="LR No." value={shipment.lrNo} mono />
                  <Row label="Destination" value={shipment.destination} />
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Units</div>
                      <div className="font-bold tabular-nums">{shipment.units}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Weight</div>
                      <div className="font-bold tabular-nums">{shipment.weight} MT</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Value</div>
                      <div className="font-bold tabular-nums">₹{shipment.value}L</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Loading</div>
                      <div className="font-semibold tabular-nums text-[11px]">{formatDate(shipment.loadingDate)}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">ETA</div>
                      <div className="font-semibold tabular-nums text-[11px]">{formatDate(shipment.eta)}</div>
                    </div>
                  </div>
                </div>

                {/* Documentation checklist */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Documents ({shipment.documents.filter(d => d.status === "ready").length}/{shipment.documents.length})</div>
                  <div className="space-y-1">
                    {shipment.documents.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        {d.status === "ready" ? (
                          <CheckCircle2 className="h-3 w-3 shrink-0" />
                        ) : (
                          <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
                        )}
                        <span className={cn(d.status === "ready" ? "font-medium" : "text-muted-foreground")}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 flex-1" onClick={() => notifySuccess("Manifest Downloaded", "Shipping manifest exported")}>
                    <Download className="h-3 w-3" /> Manifest
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 flex-1" onClick={() => notifyInfo("Tracking", "Opening carrier tracking portal...")}>
                    <ExternalLink className="h-3 w-3" /> Track
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold text-right", mono && "font-mono text-[11px]")}>{value}</span>
    </div>
  );
}

/* ===================================================================
   MODULE: CALIBRATION CALENDAR
   =================================================================== */
function CalibrationModule() {
  const { activePlant } = useMESPrefs();
  const [view, setView] = React.useState<"list" | "calendar">("list");
  const items = CALIBRATION_ITEMS.filter(c => activePlant === "ALL" || c.plant === activePlant);

  const valid = items.filter(c => c.status === "valid").length;
  const dueSoon = items.filter(c => c.status === "due-soon").length;
  const overdue = items.filter(c => c.status === "overdue").length;
  const inProgress = items.filter(c => c.status === "in-progress").length;
  const critical = items.filter(c => c.criticality === "critical").length;

  const statusMeta: Record<string, { label: string; cls: string }> = {
    "valid": { label: "VALID", cls: "bg-muted text-primary" },
    "due-soon": { label: "DUE SOON", cls: "border-2 border-primary" },
    "overdue": { label: "OVERDUE", cls: "bg-primary text-primary-foreground" },
    "in-progress": { label: "IN PROGRESS", cls: "border-2 border-primary bg-primary/5" },
  };

  // Calendar: next 6 months
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Quality · ISO 9001"
        title="Calibration Calendar"
        description="Instrument due-dates · certificates · criticality · compliance tracking"
        icon={CalendarCheck}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Total Instruments" value={items.length} />
        <MiniKPI label="Valid" value={valid} />
        <MiniKPI label="Due Soon" value={dueSoon} />
        <MiniKPI label="Overdue" value={overdue} />
        <MiniKPI label="Critical" value={critical} />
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView("list")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all",
              view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            )}
          >
            List View
          </button>
          <button
            onClick={() => setView("calendar")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all",
              view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            )}
          >
            Calendar View
          </button>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => notifyInfo("Add Instrument", "Instrument registration form opened")}>
          <Plus className="h-3.5 w-3.5" /> Add Instrument
        </Button>
      </div>

      {view === "list" ? (
        <Card className="overflow-hidden">
          <PanelHeader title="Calibration Register" subtitle={`${items.length} instruments`} icon={CalendarCheck} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tag</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Instrument</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant · Location</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Range</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Last Cal</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Next Due</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Criticality</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map(c => {
                  const daysToDue = Math.ceil((new Date(c.nextDue).getTime() - 1724697600000) / 86400000);
                  return (
                    <tr key={c.id} className="hover:bg-accent/30">
                      <td className="px-3 py-2.5 font-mono font-bold text-[11px]">{c.tag}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold">{c.instrument}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">{c.certNo}</div>
                      </td>
                      <td className="px-3 py-2.5 text-[11px]">{c.type}</td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono font-bold">{c.plant}</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">{c.location}</span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">{c.range}</td>
                      <td className="px-3 py-2.5 tabular-nums text-[10px]">{formatDateShort(c.lastCalibrated)}</td>
                      <td className="px-3 py-2.5 tabular-nums text-[10px]">
                        <div className="font-semibold">{formatDateShort(c.nextDue)}</div>
                        <div className={cn(
                          "text-[9px]",
                          daysToDue < 0 ? "font-bold" : daysToDue < 30 ? "font-semibold" : "text-muted-foreground"
                        )}>
                          {daysToDue < 0 ? `${Math.abs(daysToDue)}d overdue` : `${daysToDue}d left`}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn(
                          "inline-flex h-4 items-center rounded px-1 text-[8px] font-bold uppercase tracking-wider",
                          c.criticality === "critical" ? "bg-primary text-primary-foreground" :
                          c.criticality === "major" ? "border border-primary" :
                          "border border-border text-muted-foreground"
                        )}>
                          {c.criticality}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn("inline-flex h-5 items-center rounded px-1.5 text-[9px] font-bold uppercase tracking-wider", statusMeta[c.status].cls)}>
                          {statusMeta[c.status].label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {months.map((month, mi) => {
            const monthItems = items.filter(c => {
              const due = new Date(c.nextDue);
              return due.getMonth() === month.getMonth() && due.getFullYear() === month.getFullYear();
            });
            return (
              <Card key={mi} className="overflow-hidden">
                <div className="border-b border-border px-3 py-2 bg-muted/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider">{formatMonthYear(month)}</div>
                  <div className="text-[9px] text-muted-foreground">{monthItems.length} due</div>
                </div>
                <div className="p-2 space-y-1.5 min-h-[200px]">
                  {monthItems.length === 0 && (
                    <div className="text-center text-[10px] text-muted-foreground py-8">-</div>
                  )}
                  {monthItems.map(c => (
                    <div
                      key={c.id}
                      className={cn(
                        "rounded border p-2 text-[10px]",
                        c.status === "overdue" ? "border-primary border-2" :
                        c.status === "due-soon" ? "border-primary" :
                        c.status === "in-progress" ? "border-primary border-dashed" :
                        "border-border"
                      )}
                    >
                      <div className="font-mono font-bold">{c.tag}</div>
                      <div className="text-[9px] truncate">{c.instrument}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="tabular-nums">{new Date(c.nextDue).getDate()}</span>
                        <span className={cn(
                          "inline-block h-1.5 w-1.5 rounded-full",
                          c.criticality === "critical" ? "bg-primary" :
                          c.criticality === "major" ? "bg-primary/50" :
                          "bg-border"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Criticality summary */}
      <Card className="overflow-hidden">
        <PanelHeader title="Compliance Summary" subtitle="By criticality and status" icon={ShieldCheck} />
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">By Criticality</div>
            <div className="space-y-2">
              {(["critical", "major", "minor"] as const).map(crit => {
                const count = items.filter(c => c.criticality === crit).length;
                const pct = items.length > 0 ? (count / items.length) * 100 : 0;
                return (
                  <div key={crit}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="capitalize">{crit}</span>
                      <span className="font-bold tabular-nums">{count}</span>
                    </div>
                    <div className="h-2 bg-muted overflow-hidden rounded-sm">
                      <div
                        className={cn("h-full", crit === "critical" ? "bg-primary" : crit === "major" ? "bg-primary/60" : "bg-primary/30")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">By Status</div>
            <div className="space-y-2">
              {(["valid", "due-soon", "in-progress", "overdue"] as const).map(st => {
                const count = items.filter(c => c.status === st).length;
                const pct = items.length > 0 ? (count / items.length) * 100 : 0;
                return (
                  <div key={st}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="capitalize">{st.replace("-", " ")}</span>
                      <span className="font-bold tabular-nums">{count}</span>
                    </div>
                    <div className="h-2 bg-muted overflow-hidden rounded-sm">
                      <div className="h-full bg-primary" style={{ width: `${pct}%`, opacity: st === "valid" ? 0.5 : st === "due-soon" ? 0.7 : 1 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Upcoming Due (next 90 days)</div>
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {items
                .filter(c => {
                  const days = Math.ceil((new Date(c.nextDue).getTime() - 1724697600000) / 86400000);
                  return days >= 0 && days <= 90;
                })
                .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
                .map(c => (
                  <div key={c.id} className="flex items-center gap-2 p-1.5 rounded border border-border text-[11px]">
                    <span className="font-mono font-bold">{c.tag}</span>
                    <span className="flex-1 truncate">{c.instrument}</span>
                    <span className="tabular-nums text-[10px]">{formatDate(c.nextDue)}</span>
                  </div>
                ))}
              {items.filter(c => {
                const days = Math.ceil((new Date(c.nextDue).getTime() - 1724697600000) / 86400000);
                return days >= 0 && days <= 90;
              }).length === 0 && (
                <div className="text-center text-[10px] text-muted-foreground py-4">No calibrations due in next 90 days</div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ===================================================================
   MODULE: COST OF QUALITY (PAIF Analysis)
   =================================================================== */
function CostOfQualityModule() {
  const { activePlant } = useMESPrefs();
  const items = COST_OF_QUALITY.filter(c => activePlant === "ALL" || c.plant === activePlant);

  const prevention = items.filter(c => c.category === "prevention");
  const appraisal = items.filter(c => c.category === "appraisal");
  const internalFailure = items.filter(c => c.category === "internal-failure");
  const externalFailure = items.filter(c => c.category === "external-failure");

  const totalPrevention = prevention.reduce((a, c) => a + c.amount, 0);
  const totalAppraisal = appraisal.reduce((a, c) => a + c.amount, 0);
  const totalInternal = internalFailure.reduce((a, c) => a + c.amount, 0);
  const totalExternal = externalFailure.reduce((a, c) => a + c.amount, 0);
  const totalGood = totalPrevention + totalAppraisal;
  const totalBad = totalInternal + totalExternal;
  const total = totalGood + totalBad;
  const copRatio = total > 0 ? ((totalBad / total) * 100).toFixed(1) : "0";

  const categoryMeta: Record<string, { label: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = {
    "prevention": { label: "PREVENTION", desc: "Investment to prevent defects", icon: ShieldCheck },
    "appraisal": { label: "APPRAISAL", desc: "Inspection & testing costs", icon: Eye },
    "internal-failure": { label: "INTERNAL FAILURE", desc: "Scrap, rework, downtime", icon: AlertOctagon },
    "external-failure": { label: "EXTERNAL FAILURE", desc: "Warranty, claims, field service", icon: TrendingDown },
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Quality Economics"
        title="Cost of Quality (PAIF)"
        description="Prevention · Appraisal · Internal Failure · External Failure - good vs bad quality cost"
        icon={CircleDollarSign}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Total COQ" value={`₹${total.toFixed(1)}L`} />
        <MiniKPI label="Good Quality" value={`₹${totalGood.toFixed(1)}L`} />
        <MiniKPI label="Bad Quality" value={`₹${totalBad.toFixed(1)}L`} />
        <MiniKPI label="COP Ratio" value={`${copRatio}%`} />
        <MiniKPI label="% of Revenue" value={`${(total / 850 * 100).toFixed(1)}%`} />
      </div>

      {/* PAIF summary - 4 quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          { key: "prevention", items: prevention, total: totalPrevention, good: true },
          { key: "appraisal", items: appraisal, total: totalAppraisal, good: true },
          { key: "internal-failure", items: internalFailure, total: totalInternal, good: false },
          { key: "external-failure", items: externalFailure, total: totalExternal, good: false },
        ] as const).map(cat => {
          const meta = categoryMeta[cat.key];
          const Icon = meta.icon;
          const pct = total > 0 ? (cat.total / total) * 100 : 0;
          return (
            <Card key={cat.key} className={cn("p-4", cat.good ? "border-primary/20" : "border-primary/40")}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "grid h-8 w-8 place-items-center rounded",
                    cat.good ? "bg-muted" : "bg-primary text-primary-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider">{meta.label}</div>
                    <div className="text-[9px] text-muted-foreground">{cat.good ? "GOOD QUALITY" : "BAD QUALITY"}</div>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold tabular-nums">₹{cat.total.toFixed(1)}<span className="text-xs text-muted-foreground">L</span></div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{meta.desc}</div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Share of total</span>
                  <span className="font-bold tabular-nums">{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted overflow-hidden rounded-sm">
                  <div
                    className={cn("h-full", cat.good ? "bg-primary/60" : "bg-primary")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground">{cat.items.length} line items</div>
            </Card>
          );
        })}
      </div>

      {/* Good vs Bad visualization */}
      <Card className="overflow-hidden">
        <PanelHeader title="Good vs Bad Quality Cost" subtitle="Investment in prevention vs cost of failure" icon={BarChart3} />
        <div className="p-4">
          <div className="space-y-4">
            {/* Good quality bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold uppercase tracking-wider">Good Quality (Prevention + Appraisal)</span>
                <span className="tabular-nums font-bold">₹{totalGood.toFixed(1)}L · {total > 0 ? ((totalGood / total) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="h-8 bg-muted overflow-hidden rounded flex">
                <div className="h-full bg-primary/40 flex items-center justify-center text-[10px] font-bold" style={{ width: `${total > 0 ? (totalPrevention / totalGood) * 100 : 0}%` }}>
                  {total > 0 && (totalPrevention / totalGood) * 100 > 15 && `Prevention ₹${totalPrevention.toFixed(1)}L`}
                </div>
                <div className="h-full bg-primary/70 flex items-center justify-center text-[10px] font-bold text-primary-foreground" style={{ width: `${total > 0 ? (totalAppraisal / totalGood) * 100 : 0}%` }}>
                  {total > 0 && (totalAppraisal / totalGood) * 100 > 15 && `Appraisal ₹${totalAppraisal.toFixed(1)}L`}
                </div>
              </div>
            </div>
            {/* Bad quality bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold uppercase tracking-wider">Bad Quality (Internal + External Failure)</span>
                <span className="tabular-nums font-bold">₹{totalBad.toFixed(1)}L · {total > 0 ? ((totalBad / total) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="h-8 bg-muted overflow-hidden rounded flex">
                <div className="h-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground" style={{ width: `${total > 0 ? (totalInternal / totalBad) * 100 : 0}%` }}>
                  {total > 0 && (totalInternal / totalBad) * 100 > 15 && `Internal ₹${totalInternal.toFixed(1)}L`}
                </div>
                <div className="h-full bg-primary/80 flex items-center justify-center text-[10px] font-bold text-primary-foreground" style={{ width: `${total > 0 ? (totalExternal / totalBad) * 100 : 0}%` }}>
                  {total > 0 && (totalExternal / totalBad) * 100 > 15 && `External ₹${totalExternal.toFixed(1)}L`}
                </div>
              </div>
            </div>
            {/* Insight */}
            <div className="mt-4 p-3 rounded border border-border bg-muted/20 text-xs">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Insight:</span> Bad quality cost is <span className="font-bold">{total > 0 ? (totalBad / totalGood).toFixed(1) : 0}×</span> the good quality investment.
                  {totalBad > totalGood ? (
                    <span> Increasing prevention spend by 20% (₹{(totalPrevention * 0.2).toFixed(1)}L) could reduce failure cost by an estimated 30-40%.</span>
                  ) : (
                    <span> Healthy ratio - prevention is outpacing failure cost.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed items table */}
      <Card className="overflow-hidden">
        <PanelHeader title="Cost of Quality - Line Items" subtitle={`${items.length} entries · ${activePlant === "ALL" ? "all plants" : `Plant ${activePlant}`}`} icon={CircleDollarSign} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Trend</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(c => {
                const meta = categoryMeta[c.category];
                return (
                  <tr key={c.id} className="hover:bg-accent/30">
                    <td className="px-3 py-2.5 font-mono font-bold text-[11px]">{c.id}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn(
                        "inline-flex h-5 items-center rounded px-1.5 text-[9px] font-bold uppercase tracking-wider",
                        c.category === "prevention" ? "bg-primary/10 text-primary" :
                        c.category === "appraisal" ? "bg-primary/20 text-primary" :
                        c.category === "internal-failure" ? "bg-primary text-primary-foreground" :
                        "bg-primary/80 text-primary-foreground"
                      )}>
                        {meta.label.split(" ")[0]}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px]">{c.description}</td>
                    <td className="px-3 py-2.5 font-mono font-bold">{c.plant}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-bold">₹{c.amount.toFixed(1)}L</td>
                    <td className="px-3 py-2.5">
                      <span className={cn(
                        "inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums",
                        c.trend < 0 ? "" : "text-muted-foreground"
                      )}>
                        {c.trend > 0 ? "+" : ""}{c.trend}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-muted-foreground max-w-[200px] truncate">{c.details || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-muted/30 border-t-2 border-border">
              <tr>
                <td colSpan={4} className="px-3 py-2.5 font-bold text-right">TOTAL</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold">₹{total.toFixed(1)}L</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ===================================================================
   MODULE: ROOT CAUSE ANALYSIS (5-Whys)
   =================================================================== */
function RootCauseModule() {
  const { activePlant } = useMESPrefs();
  const analyses = ROOT_CAUSES.filter(r => activePlant === "ALL" || r.plant === activePlant);
  const [selected, setSelected] = React.useState<string | null>(analyses[0]?.id || null);
  const rca = ROOT_CAUSES.find(r => r.id === selected) || analyses[0];

  const statusMeta: Record<string, { label: string; cls: string }> = {
    "open": { label: "OPEN", cls: "border-2 border-primary" },
    "in-progress": { label: "IN PROGRESS", cls: "bg-primary text-primary-foreground" },
    "verified": { label: "VERIFIED", cls: "bg-muted text-primary" },
    "closed": { label: "CLOSED", cls: "border border-border text-muted-foreground" },
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Continuous Improvement"
        title="Root Cause Analysis"
        description="5-Whys · structured problem solving · CAPA effectiveness tracking"
        icon={GitFork}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Total RCAs" value={analyses.length} />
        <MiniKPI label="Open" value={analyses.filter(r => r.status === "open" || r.status === "in-progress").length} />
        <MiniKPI label="Verified" value={analyses.filter(r => r.status === "verified").length} />
        <MiniKPI label="Closed" value={analyses.filter(r => r.status === "closed").length} />
        <MiniKPI label="Effective" value={analyses.filter(r => r.effectiveness === "effective").length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* RCA list */}
        <Card className="overflow-hidden lg:col-span-1">
          <PanelHeader title="Analyses" subtitle={`${analyses.length} shown`} icon={GitFork} />
          <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
            {analyses.map(r => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={cn(
                  "w-full text-left p-3 rounded border transition-all",
                  selected === r.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent/40"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[10px]">{r.id}</span>
                  <span className={cn(
                    "inline-flex h-4 items-center rounded px-1 text-[8px] font-bold uppercase tracking-wider",
                    selected === r.id ? "bg-background text-primary" : statusMeta[r.status].cls
                  )}>
                    {statusMeta[r.status].label}
                  </span>
                </div>
                <div className="text-xs font-semibold leading-tight">{r.title}</div>
                <div className="text-[10px] opacity-70 mt-1 flex items-center gap-1.5">
                  <span className="font-mono">{r.plant}</span>
                  <span>·</span>
                  <span>{r.stage}</span>
                </div>
                {r.ncrRef && (
                  <div className="text-[9px] opacity-60 mt-0.5 font-mono">Ref: {r.ncrRef}</div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* RCA detail - 5-Whys */}
        <Card className="lg:col-span-2 overflow-hidden">
          {rca && (
            <>
              <PanelHeader
                title={rca.title}
                subtitle={`${rca.id} · ${rca.plant} · ${rca.stage} · ${formatDateYear(rca.date)}`}
                icon={HelpCircle}
                action={
                  <span className={cn("inline-flex h-6 items-center rounded px-2 text-[10px] font-bold uppercase tracking-wider", statusMeta[rca.status].cls)}>
                    {statusMeta[rca.status].label}
                  </span>
                }
              />
              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Problem statement */}
                <div className="p-3 rounded border-2 border-primary bg-primary/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Problem Statement</div>
                  <p className="text-sm leading-relaxed">{rca.problem}</p>
                  {rca.ncrRef && (
                    <div className="mt-2 text-[10px] font-mono text-muted-foreground">Linked: {rca.ncrRef}</div>
                  )}
                </div>

                {/* 5-Whys chain */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">5-Whys Analysis</div>
                  <div className="relative">
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-3">
                      {rca.whys.map((w, i) => (
                        <div key={i} className="relative pl-12">
                          <div className={cn(
                            "absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border-2 font-bold text-xs",
                            i === rca.whys.length - 1 ? "bg-primary text-primary-foreground border-primary" : "bg-background border-primary"
                          )}>
                            {i + 1}
                          </div>
                          <div className="rounded border border-border p-2.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Why #{i + 1}</div>
                            <div className="text-xs font-semibold mb-1">{w.question}</div>
                            <div className="text-xs text-primary leading-relaxed">→ {w.answer}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Root cause */}
                <div className="p-3 rounded border-2 border-primary">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Root Cause</span>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">{rca.rootCause}</p>
                </div>

                {/* Corrective & Preventive actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Corrective Action</span>
                    </div>
                    <p className="text-xs leading-relaxed">{rca.correctiveAction}</p>
                  </div>
                  <div className="p-3 rounded border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Preventive Action</span>
                    </div>
                    <p className="text-xs leading-relaxed">{rca.preventiveAction}</p>
                  </div>
                </div>

                {/* Team & effectiveness */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Team</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Facilitator</span><span className="font-semibold">{rca.facilitator}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Owner</span><span className="font-semibold">{rca.owner}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Due</span><span className="tabular-nums">{formatDate(rca.dueDate)}</span></div>
                    </div>
                    <div className="mt-2">
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Participants</div>
                      <div className="flex flex-wrap gap-1">
                        {rca.participants.map((p, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Effectiveness</div>
                    {rca.effectiveness && (
                      <div className={cn(
                        "p-3 rounded border",
                        rca.effectiveness === "effective" ? "border-primary/30 bg-primary/5" :
                        rca.effectiveness === "ineffective" ? "border-primary border-2" :
                        "border-dashed border-border"
                      )}>
                        <div className="flex items-center gap-2">
                          {rca.effectiveness === "effective" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : rca.effectiveness === "ineffective" ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-xs font-bold uppercase tracking-wider">{rca.effectiveness}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {rca.effectiveness === "effective" ? "CAPA verified - no recurrence" :
                           rca.effectiveness === "ineffective" ? "CAPA failed - re-open and re-analyze" :
                           "Pending verification - monitor for 30 days"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ===================================================================
   MODULE: PRODUCTION FORECAST
   =================================================================== */
function ForecastModule() {
  const { activePlant } = useMESPrefs();
  const [selectedScenario, setSelectedScenario] = React.useState<string>(FORECAST_SCENARIOS[0]?.id || "");
  const scenario = FORECAST_SCENARIOS.find(s => s.id === selectedScenario) || FORECAST_SCENARIOS[0];

  const totalPlanned = scenario?.points.reduce((a, p) => a + p.planned, 0) || 0;
  const totalProjected = scenario?.points.reduce((a, p) => a + p.projected, 0) || 0;
  const totalCapacity = scenario?.points.reduce((a, p) => a + p.capacity, 0) || 0;
  const attainmentPct = totalPlanned > 0 ? ((totalProjected / totalPlanned) * 100).toFixed(1) : "0";
  const utilizationPct = totalCapacity > 0 ? ((totalProjected / totalCapacity) * 100).toFixed(1) : "0";

  const riskMeta: Record<string, { cls: string }> = {
    "low": { cls: "border border-border" },
    "medium": { cls: "border-2 border-primary" },
    "high": { cls: "bg-primary text-primary-foreground" },
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Predictive Analytics"
        title="Production Forecast"
        description="What-if scenarios · capacity utilization · risk-weighted projections"
        icon={TrendingUp}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Horizon" value={scenario?.horizon.split(" ")[1] + " days" || "14 days"} />
        <MiniKPI label="Total Planned" value={totalPlanned.toLocaleString()} />
        <MiniKPI label="Total Projected" value={totalProjected.toLocaleString()} />
        <MiniKPI label="Attainment" value={`${attainmentPct}%`} />
        <MiniKPI label="Capacity Util" value={`${utilizationPct}%`} />
      </div>

      {/* Scenario selector */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FORECAST_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedScenario(s.id)}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-bold border transition-all",
              selectedScenario === s.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {scenario && (
        <>
          {/* Confidence + description */}
          <Card className="overflow-hidden">
            <div className="p-4 flex items-start gap-4">
              <div className="shrink-0">
                <RingProgress value={scenario.confidence} size={80} label="Confidence" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{scenario.id} · {scenario.horizon}</div>
                <h3 className="text-sm font-bold mb-1">{scenario.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{scenario.description}</p>
              </div>
            </div>
          </Card>

          {/* Forecast chart */}
          <Card className="overflow-hidden">
            <PanelHeader
              title="Output Projection - 14 days"
              subtitle="Planned vs Projected vs Capacity"
              icon={BarChart3}
              action={
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="h-2 w-3 bg-primary/30" />Planned</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-3 bg-primary" />Projected</span>
                  <span className="flex items-center gap-1"><span className="h-px w-3 border-t border-dashed border-primary" />Capacity</span>
                </div>
              }
            />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={scenario.points} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} className="text-primary" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" tickFormatter={(v) => v.split("-").slice(1).join("/")} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} className="text-primary" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11 }}
                    labelFormatter={(v) => `Date: ${v}`}
                  />
                  <Bar dataKey="capacity" fill="currentColor" fillOpacity={0.1} className="text-primary" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="planned" fill="currentColor" fillOpacity={0.35} className="text-primary" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="projected" fill="currentColor" fillOpacity={0.9} className="text-primary" radius={[2, 2, 0, 0]} />
                  {scenario.points.some(p => p.actual !== undefined) && (
                    <Line type="monotone" dataKey="actual" stroke="currentColor" strokeWidth={2} strokeDasharray="4 2" className="text-primary" dot={{ r: 3, fill: "currentColor" }} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Assumptions */}
            <Card className="overflow-hidden">
              <PanelHeader title="Scenario Assumptions" subtitle={`${scenario.assumptions.length} factors`} icon={Lightbulb} />
              <div className="p-4 space-y-2">
                {scenario.assumptions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-primary font-bold text-[9px] mt-0.5">{i + 1}</span>
                    <span className="leading-relaxed">{a}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Risks */}
            <Card className="overflow-hidden">
              <PanelHeader title="Risk Register" subtitle={`${scenario.risks.length} risks identified`} icon={AlertTriangle} />
              <div className="p-4 space-y-2">
                {scenario.risks.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded border border-border">
                    <span className={cn("inline-flex h-5 items-center rounded px-1.5 text-[9px] font-bold uppercase tracking-wider shrink-0", riskMeta[r.impact].cls)}>
                      {r.impact}
                    </span>
                    <span className="flex-1 text-xs">{r.description}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-12 h-1.5 bg-muted overflow-hidden rounded-sm">
                        <div className="h-full bg-primary" style={{ width: `${r.probability}%` }} />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums w-8 text-right">{r.probability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Daily breakdown table */}
          <Card className="overflow-hidden">
            <PanelHeader title="Daily Breakdown" subtitle="Day-by-day projection" icon={CalendarDays} />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Capacity</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Planned</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Projected</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actual</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Attainment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scenario.points.map((p, i) => {
                    const att = p.planned > 0 ? ((p.projected / p.planned) * 100).toFixed(0) : "-";
                    const util = p.capacity > 0 ? ((p.projected / p.capacity) * 100).toFixed(0) : "-";
                    return (
                      <tr key={i} className="hover:bg-accent/30">
                        <td className="px-3 py-2.5 tabular-nums">{formatDateWeekday(p.date)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{p.capacity}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{p.planned}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums font-bold">{p.projected}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{p.actual ?? "-"}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-muted overflow-hidden rounded-sm">
                              <div className={cn("h-full", parseInt(att) >= 95 ? "bg-primary" : parseInt(att) >= 80 ? "bg-primary/70" : "bg-primary/40")} style={{ width: `${Math.min(100, parseInt(att) || 0)}%` }} />
                            </div>
                            <span className="text-[10px] font-bold tabular-nums w-8">{att}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-muted/30 border-t-2 border-border">
                  <tr>
                    <td className="px-3 py-2.5 font-bold">TOTAL</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-bold">{totalCapacity}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-bold">{totalPlanned}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-bold">{totalProjected}</td>
                    <td className="px-3 py-2.5"></td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-bold">{attainmentPct}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

/* ===================================================================
   MODULE: WIP AGING & KANBAN
   =================================================================== */
function WIPAgingModule() {
  const { activePlant } = useMESPrefs();
  const [view, setView] = React.useState<"aging" | "kanban">("aging");
  const [bucketFilter, setBucketFilter] = React.useState<string>("all");
  const items = WIP_ITEMS.filter(w => activePlant === "ALL" || w.plant === activePlant);
  const filtered = items.filter(w => bucketFilter === "all" || w.ageBucket === bucketFilter);

  const buckets = [
    { key: "fresh", label: "FRESH", max: 4, cls: "border border-border" },
    { key: "normal", label: "NORMAL", max: 12, cls: "border border-primary/40" },
    { key: "aging", label: "AGING", max: 24, cls: "border-2 border-primary/60" },
    { key: "stale", label: "STALE", max: 48, cls: "border-2 border-primary" },
    { key: "critical", label: "CRITICAL", max: 999, cls: "bg-primary text-primary-foreground" },
  ] as const;

  const statusMeta: Record<string, { label: string; cls: string }> = {
    "moving": { label: "MOVING", cls: "bg-muted text-primary" },
    "waiting": { label: "WAITING", cls: "border border-border" },
    "blocked": { label: "BLOCKED", cls: "border-2 border-primary" },
    "hold": { label: "HOLD", cls: "bg-primary text-primary-foreground" },
  };

  const totalUnits = items.reduce((a, w) => a + w.qty, 0);
  const criticalCount = items.filter(w => w.ageBucket === "critical").length;
  const staleCount = items.filter(w => w.ageBucket === "stale").length;
  const blockedCount = items.filter(w => w.status === "blocked" || w.status === "hold").length;
  const avgAge = items.length > 0 ? (items.reduce((a, w) => a + w.ageHours, 0) / items.length).toFixed(1) : "0";

  // Kanban columns by stage
  const kanbanStages = ["Cutting", "Forming", "Welding", "Leak Test", "Galvanizing", "Painting", "Assembly", "Final QC"];

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module · Shop-floor WIP"
        title="WIP Aging & Kanban"
        description="Work-in-progress aging buckets · bottleneck detection · Kanban board"
        icon={Hourglass}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniKPI label="Total WIP Units" value={totalUnits} />
        <MiniKPI label="Avg Age (hrs)" value={avgAge} />
        <MiniKPI label="Critical (>48h)" value={criticalCount} />
        <MiniKPI label="Stale (24-48h)" value={staleCount} />
        <MiniKPI label="Blocked/Hold" value={blockedCount} />
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView("aging")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all",
              view === "aging" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            )}
          >
            Aging View
          </button>
          <button
            onClick={() => setView("kanban")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all",
              view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            )}
          >
            Kanban Board
          </button>
        </div>
        {view === "aging" && (
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setBucketFilter("all")}
              className={cn(
                "px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all",
                bucketFilter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              All
            </button>
            {buckets.map(b => (
              <button
                key={b.key}
                onClick={() => setBucketFilter(b.key)}
                className={cn(
                  "px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all",
                  bucketFilter === b.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === "aging" ? (
        <>
          {/* Aging buckets distribution */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {buckets.map(b => {
              const bucketItems = items.filter(w => w.ageBucket === b.key);
              const count = bucketItems.length;
              const units = bucketItems.reduce((a, w) => a + w.qty, 0);
              return (
                <Card key={b.key} className={cn("p-4", b.cls)}>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{b.label}</div>
                  <div className="text-2xl font-bold tabular-nums">{count}</div>
                  <div className="text-[10px] opacity-60">{units} units</div>
                  <div className="mt-2 text-[9px] opacity-50">
                    {b.key === "fresh" && "< 4 hours"}
                    {b.key === "normal" && "4-12 hours"}
                    {b.key === "aging" && "12-24 hours"}
                    {b.key === "stale" && "24-48 hours"}
                    {b.key === "critical" && "> 48 hours"}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* WIP items table */}
          <Card className="overflow-hidden">
            <PanelHeader title="WIP Items" subtitle={`${filtered.length} of ${items.length} items`} icon={Hourglass} />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Serial</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plant · Line</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stage</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">WO</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Age (hrs)</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Bucket</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Bottleneck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.slice(0, 25).map(w => (
                    <tr key={w.id} className="hover:bg-accent/30">
                      <td className="px-3 py-2.5 font-mono text-[11px]">{w.serial}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{w.product}</td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono font-bold">{w.plant}</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">{w.line}</span>
                      </td>
                      <td className="px-3 py-2.5 text-[11px]">{w.stage}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{w.workOrder}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums font-bold">{w.qty}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums font-bold">{w.ageHours}h</td>
                      <td className="px-3 py-2.5">
                        <span className={cn(
                          "inline-flex h-4 items-center rounded px-1 text-[8px] font-bold uppercase tracking-wider",
                          w.ageBucket === "critical" ? "bg-primary text-primary-foreground" :
                          w.ageBucket === "stale" ? "border-2 border-primary" :
                          w.ageBucket === "aging" ? "border border-primary/60" :
                          w.ageBucket === "normal" ? "border border-primary/30" :
                          "border border-border"
                        )}>
                          {w.ageBucket}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn("inline-flex h-4 items-center rounded px-1 text-[8px] font-bold uppercase tracking-wider", statusMeta[w.status].cls)}>
                          {statusMeta[w.status].label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-[10px] text-muted-foreground max-w-[180px] truncate">{w.bottleneckReason || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        /* Kanban board */
        <Card className="overflow-hidden">
          <PanelHeader title="Kanban Board - by Stage" subtitle={`${items.length} items across ${kanbanStages.length} stages`} icon={Layers3} />
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-px bg-border min-w-[1200px]">
              {kanbanStages.map(stage => {
                const stageItems = items.filter(w => w.stage === stage);
                const stageQty = stageItems.reduce((a, w) => a + w.qty, 0);
                const blocked = stageItems.filter(w => w.status === "blocked" || w.status === "hold").length;
                return (
                  <div key={stage} className="bg-card min-h-[300px] flex flex-col">
                    <div className="px-3 py-2 border-b border-border bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{stage}</span>
                        <span className="grid h-4 min-w-4 place-items-center rounded bg-primary px-1 text-[9px] font-bold text-primary-foreground tabular-nums">
                          {stageItems.length}
                        </span>
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{stageQty} units{blocked > 0 && ` · ${blocked} blocked`}</div>
                    </div>
                    <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[500px]">
                      {stageItems.length === 0 && (
                        <div className="text-center text-[10px] text-muted-foreground py-4">-</div>
                      )}
                      {stageItems.map(w => (
                        <div
                          key={w.id}
                          className={cn(
                            "rounded border p-2 text-[10px] cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all",
                            w.ageBucket === "critical" ? "border-primary border-2 bg-primary/5" :
                            w.ageBucket === "stale" ? "border-primary" :
                            w.status === "hold" ? "border-primary border-dashed" :
                            w.status === "blocked" ? "border-primary/60 border-dashed" :
                            "border-border"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-[9px]">{w.serial}</span>
                            <span className={cn(
                              "inline-block h-1.5 w-1.5 rounded-full",
                              w.status === "moving" ? "bg-primary pulse-mono" :
                              w.status === "blocked" ? "bg-primary" :
                              w.status === "hold" ? "bg-muted-foreground" :
                              "bg-muted-foreground/40"
                            )} />
                          </div>
                          <div className="font-semibold text-[10px] truncate">{w.product}</div>
                          <div className="flex items-center justify-between mt-1 text-[9px] text-muted-foreground">
                            <span className="font-mono">{w.plant}</span>
                            <span className="tabular-nums">{w.qty}u · {w.ageHours}h</span>
                          </div>
                          {w.bottleneckReason && (
                            <div className="mt-1 pt-1 border-t border-border/50 text-[8px] text-muted-foreground truncate">
                              ⚠ {w.bottleneckReason}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ===================================================================
   MODULE: DASHBOARDS & ALERTS
   =================================================================== */
function DashboardsModule() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 12 · Role-based BI"
        title="Dashboards, Alerts & Mobile"
        description="Role-based views, Andon big-screens, push notifications, scheduled reports"
        icon={Activity}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <PanelHeader title="Active Alerts" subtitle={`${ALERTS.length} total · ${ALERTS.filter(a => a.severity === "critical").length} critical`} icon={AlertTriangle} />
          <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
            {ALERTS.map((a) => (
              <div key={a.id} className="px-4 py-3 hover:bg-accent/30">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded text-[9px] font-bold uppercase",
                    a.severity === "critical" ? "bg-primary text-primary-foreground" :
                    a.severity === "warning" ? "border-2 border-primary" :
                    "border border-border"
                  )}>
                    {a.severity === "critical" ? "C" : a.severity === "warning" ? "W" : "I"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold flex-1 truncate">{a.title}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{a.plant}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <MonoTag>{a.module}</MonoTag>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {formatDateTime(a.timestamp)}
                      </span>
                      {a.acknowledged && <span className="text-[9px] uppercase text-muted-foreground">· ack</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <PanelHeader title="Andon Board" subtitle="Shop-floor real-time status" icon={Activity} />
          <div className="p-4">
            <div className="bg-primary text-primary-foreground p-6 rounded">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">Andon Live</div>
                  <div className="text-2xl font-bold mt-1">Plant K2 - HDG Line</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider opacity-70">Shift A</div>
                  <div className="text-xl font-bold tabular-nums">14:32:08</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-background/30 p-3 rounded">
                  <div className="text-[9px] uppercase tracking-wider opacity-70">Output</div>
                  <div className="text-3xl font-bold tabular-nums">28</div>
                  <div className="text-[9px] opacity-70">units / shift</div>
                </div>
                <div className="border border-background/30 p-3 rounded">
                  <div className="text-[9px] uppercase tracking-wider opacity-70">OEE</div>
                  <div className="text-3xl font-bold tabular-nums">82%</div>
                  <div className="text-[9px] opacity-70">target 75%</div>
                </div>
                <div className="border border-background/30 p-3 rounded">
                  <div className="text-[9px] uppercase tracking-wider opacity-70">Scrap</div>
                  <div className="text-3xl font-bold tabular-nums">2.1%</div>
                  <div className="text-[9px] opacity-70">target ≤ 2%</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-background pulse-mono" />
                <span>Live · streaming from M-K2-001</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ===================================================================
   MODULE: OPERATOR TERMINAL - Kiosk Job Card
   =================================================================== */
function OperatorTerminalModule() {
  const { setModule } = useMESPrefs();
  const operator = OPERATORS_DATA[0];
  const wo = React.useMemo(
    () => WORK_ORDERS.find(w => w.status === "in-progress") || WORK_ORDERS.find(w => ["started", "released"].includes(w.status)) || WORK_ORDERS[0],
    []
  );

  // Build step-by-step work instructions from the canonical stage list.
  const stages = ["Cutting", "Forming", "Welding", "Leak Test", "Galvanizing", "Painting", "Assembly", "Final QC", "Packing"];
  const currentStageIdx = Math.max(0, stages.indexOf(wo.currentStage));

  // Quality checks required for this job card (derived from canonical stages).
  const qcChecks = [
    { id: "qc1", label: "Heat number verified vs coil tag", stage: "Cutting", done: currentStageIdx > 0 },
    { id: "qc2", label: "Visual weld - ISO 3834-2 acceptable", stage: "Welding", done: currentStageIdx > 2 },
    { id: "qc3", label: "Leak test ≥ 2.5 bar · hold 120s", stage: "Leak Test", done: currentStageIdx > 3 },
    { id: "qc4", label: "Galvanizing DFT ≥ 70 μm", stage: "Galvanizing", done: currentStageIdx > 4 },
    { id: "qc5", label: "Final visual + dimension check", stage: "Final QC", done: currentStageIdx > 7 },
  ];
  const [checks, setChecks] = React.useState(() => qcChecks.map(c => c.done));

  // Live cycle counter & elapsed timer.
  const [cycles, setCycles] = React.useState(() => wo.qtyDone);
  const [running, setRunning] = React.useState(true);
  const [elapsed, setElapsed] = React.useState(() => 42 * 60 + 17); // seconds, start from a plausible value

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setCycles(c => c + 1), 6000);
    return () => clearInterval(t);
  }, [running]);

  // Andon state.
  const [andonOpen, setAndonOpen] = React.useState(false);
  const [andonRaised, setAndonRaised] = React.useState<null | "Material" | "Quality" | "Maintenance">(null);

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${ss}`;
  };

  return (
    <div className="relative flex min-h-full flex-col bg-background">
      {/* Top bar - Andon on right */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setModule("work-orders")}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Exit Terminal
          </button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            <span className="text-sm font-bold tracking-tight">Operator Terminal</span>
            <span className="hidden sm:inline-flex h-5 items-center rounded border border-border px-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Kiosk · Plant {wo.plant} · {wo.line}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn(
            "hidden md:inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
            running ? "bg-primary text-primary-foreground" : "border-2 border-primary text-primary bg-background"
          )}>
            <span className={cn("h-1.5 w-1.5 rounded-full", running ? "bg-background pulse-mono" : "bg-primary")} />
            {running ? "Running" : "Paused"}
          </span>

          {/* Andon */}
          <div className="relative">
            <button
              onClick={() => setAndonOpen(v => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                andonRaised
                  ? "border-2 border-primary bg-primary text-primary-foreground"
                  : "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Hand className="h-4 w-4" />
              {andonRaised ? `Andon · ${andonRaised}` : "Call for Help"}
            </button>
            {andonOpen && (
              <div className="absolute right-0 top-full mt-2 z-20 w-56 rounded border border-border bg-popover p-1 shadow-lg">
                {(["Material", "Quality", "Maintenance"] as const).map((opt) => {
                  const Icon = opt === "Material" ? Package : opt === "Quality" ? ShieldCheck : Wrench;
                  return (
                    <button
                      key={opt}
                      onClick={() => { setAndonRaised(opt); setAndonOpen(false); setRunning(false); }}
                      className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm font-medium hover:bg-accent transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{opt}</span>
                      <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Andon</span>
                    </button>
                  );
                })}
                {andonRaised && (
                  <button
                    onClick={() => { setAndonRaised(null); setAndonOpen(false); setRunning(true); }}
                    className="mt-1 w-full border-t border-border pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                  >
                    Clear Andon
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Andon banner */}
      {andonRaised && (
        <div className="border-b-2 border-primary bg-primary text-primary-foreground">
          <div className="flex items-center justify-between px-6 py-2">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Andon Raised - {andonRaised} support requested</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider opacity-70">Supervisor paged · ETA 2 min</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-6">
        {/* Operator strip */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center bg-primary text-primary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operator</div>
              <div className="text-lg font-bold leading-tight">{operator.name}</div>
              <div className="text-xs text-muted-foreground">{operator.role} · Plant {operator.plant} · Shift {operator.shift}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {operator.certifications.length === 0 && (
              <span className="inline-flex h-7 items-center rounded border border-border px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                No active certs
              </span>
            )}
            {operator.certifications.map((c) => (
              <span
                key={c.type}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                  c.status === "valid" ? "bg-primary text-primary-foreground" :
                  c.status === "expiring" ? "border-2 border-primary text-primary bg-background" :
                  "border border-border text-muted-foreground"
                )}
              >
                <IdCard className="h-3 w-3" />
                {c.type}
                <span className="opacity-70 font-medium normal-case tracking-normal">· {c.validUntil}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Job card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job card - left/main */}
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Digital Job Card · {wo.id}</div>
                  <div className="mt-1 text-2xl font-bold tracking-tight">{wo.product}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <span className="font-mono">{wo.orderNo}</span> · {wo.customer}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Heat No.</div>
                  <div className="font-mono text-lg font-bold">{wo.heatNumber || "-"}</div>
                  <div className="mt-2 flex items-center justify-end gap-1.5">
                    <WOStatusBadge status={wo.status} />
                    <PriorityMark priority={wo.priority} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
              <JobStat label="Order Qty" value={String(wo.qty)} />
              <JobStat label="Completed" value={String(wo.qtyDone)} />
              <JobStat label="Scrap" value={String(wo.qtyScrap)} />
              <JobStat label="OEE" value={`${wo.oee}%`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {/* Drawing placeholder */}
              <div className="bg-card p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Drawing Reference</div>
                <div className="relative grid h-44 place-items-center rounded border border-dashed border-border bg-muted/20">
                  <div
                    className="absolute inset-3 opacity-30"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 22px)",
                    }}
                  />
                  <div className="relative flex flex-col items-center text-muted-foreground">
                    <FileText className="h-7 w-7" />
                    <span className="mt-2 font-mono text-xs font-bold">DWG-{wo.product}-R{4}</span>
                    <span className="text-[10px]">A1 · 1:1 scale · ISO 5455</span>
                  </div>
                  <div className="absolute left-2 top-2 h-3 w-3 border-l border-t border-primary" />
                  <div className="absolute right-2 top-2 h-3 w-3 border-r border-t border-primary" />
                  <div className="absolute left-2 bottom-2 h-3 w-3 border-l border-b border-primary" />
                  <div className="absolute right-2 bottom-2 h-3 w-3 border-r border-b border-primary" />
                </div>
              </div>

              {/* Work instructions */}
              <div className="bg-card p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Work Instructions</div>
                <ol className="space-y-2.5">
                  {stages.map((s, i) => {
                    const done = i < currentStageIdx;
                    const active = i === currentStageIdx;
                    return (
                      <li key={s} className="flex items-start gap-2.5">
                        <span className={cn(
                          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded text-[10px] font-bold",
                          done ? "bg-primary text-primary-foreground" :
                          active ? "border-2 border-primary text-primary" :
                          "border border-border text-muted-foreground"
                        )}>
                          {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "text-sm font-medium",
                            active ? "text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/70"
                          )}>
                            {s}
                          </div>
                          {active && (
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              In progress · follow SOP-{s.slice(0, 4).toUpperCase()}-001
                            </div>
                          )}
                        </div>
                        {active && (
                          <span className="inline-flex h-5 items-center rounded bg-primary px-1.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
                            Step
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Current parameters */}
            <div className="border-t border-border px-5 py-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Current Parameters - {wo.currentStage}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentStageParams(wo.currentStage).map((p) => (
                  <div key={p.label} className="rounded border border-border bg-muted/20 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.label}</div>
                    <div className="text-xl font-bold tabular-nums">{p.value} <span className="text-xs font-medium text-muted-foreground">{p.unit}</span></div>
                    <div className="text-[10px] text-muted-foreground">Spec: {p.spec}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality checks */}
            <div className="border-t border-border px-5 py-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Required Quality Checks</div>
              <div className="space-y-2">
                {qcChecks.map((c, i) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-3 rounded border border-border bg-card px-3 py-2.5 hover:bg-accent/40 transition-colors"
                  >
                    <Checkbox
                      checked={checks[i]}
                      onCheckedChange={(v) => setChecks(prev => prev.map((x, j) => j === i ? !!v : x))}
                    />
                    <span className={cn("text-sm font-medium", checks[i] ? "text-muted-foreground line-through" : "text-primary")}>
                      {c.label}
                    </span>
                    <span className="ml-auto inline-flex h-5 items-center rounded bg-muted px-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {c.stage}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Right column - counters + controls */}
          <div className="flex flex-col gap-4">
            {/* Cycle counter */}
            <Card className="overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-4 py-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live Production</div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border">
                <div className="bg-card p-4 text-center">
                  <Hash className="mx-auto h-4 w-4 text-muted-foreground" />
                  <div className="mt-1 text-4xl font-bold tabular-nums">{cycles}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cycles</div>
                </div>
                <div className="bg-card p-4 text-center">
                  <Timer className="mx-auto h-4 w-4 text-muted-foreground" />
                  <div className="mt-1 text-2xl font-bold tabular-nums">{fmtTime(elapsed)}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Elapsed</div>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-medium">Job progress</span>
                  <span className="tabular-nums font-bold">{Math.min(100, Math.round((cycles / Math.max(1, wo.qty)) * 100))}%</span>
                </div>
                <MonoProgress value={Math.min(100, (cycles / Math.max(1, wo.qty)) * 100)} className="h-2.5" />
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{cycles} / {wo.qty} units</span>
                  <span>Target: {Math.max(1, Math.round(wo.qty / 8))} / hr</span>
                </div>
              </div>
            </Card>

            {/* Controls */}
            <Card className="overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-4 py-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Execution Controls</div>
              </div>
              <div className="space-y-3 p-4">
                {/* START - filled solid */}
                <button
                  onClick={() => setRunning(true)}
                  className={cn(
                    "flex w-full items-center justify-center gap-3 rounded py-5 text-base font-bold uppercase tracking-[0.18em] transition-all",
                    running
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  <Play className="h-5 w-5" />
                  Start
                </button>
                {/* PAUSE - outlined */}
                <button
                  onClick={() => setRunning(false)}
                  className={cn(
                    "flex w-full items-center justify-center gap-3 rounded py-5 text-base font-bold uppercase tracking-[0.18em] transition-all",
                    !running
                      ? "bg-muted text-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "border border-border bg-background text-primary hover:bg-accent"
                  )}
                >
                  <Pause className="h-5 w-5" />
                  Pause
                </button>
                {/* COMPLETE - striped pattern + double border */}
                <button
                  onClick={() => setModule("work-orders")}
                  className={cn(
                    "relative flex w-full items-center justify-center gap-3 rounded border-2 border-primary py-5 text-base font-bold uppercase tracking-[0.18em] transition-all overflow-hidden",
                    "bg-background text-primary hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, currentColor 0 6px, transparent 6px 14px)",
                    }}
                  />
                  <Square className="relative h-5 w-5" />
                  <span className="relative">Complete Job</span>
                </button>
              </div>
              <Separator />
              <div className="px-4 py-3 text-[10px] text-muted-foreground">
                Buttons differ by <span className="font-semibold text-primary">fill density</span>: solid = active, outlined = idle, striped = terminal action.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

// Returns plausible live parameters for the active stage.
function currentStageParams(stage: string): { label: string; value: string; unit: string; spec: string }[] {
  switch (stage) {
    case "Cutting":
      return [
        { label: "Stroke rate", value: "92", unit: "spm", spec: "85-95" },
        { label: "Blade wear", value: "0.4", unit: "mm", spec: "≤ 0.6" },
        { label: "Coil width", value: "1250", unit: "mm", spec: "1250 ± 1" },
        { label: "Oil pressure", value: "118", unit: "bar", spec: "≥ 110" },
      ];
    case "Welding":
      return [
        { label: "Current", value: "298", unit: "A", spec: "280-320" },
        { label: "Voltage", value: "30", unit: "V", spec: "28-32" },
        { label: "Travel", value: "0.85", unit: "m/min", spec: "0.8-0.9" },
        { label: "Wire feed", value: "8.4", unit: "m/min", spec: "8.0-9.0" },
      ];
    case "Galvanizing":
      return [
        { label: "Bath temp", value: "452", unit: "°C", spec: "445-460" },
        { label: "Dwell", value: "8.5", unit: "min", spec: "8-10" },
        { label: "Zn level", value: "82", unit: "%", spec: "≥ 70" },
        { label: "DFT", value: "78", unit: "μm", spec: "≥ 70" },
      ];
    case "Leak Test":
      return [
        { label: "Test pressure", value: "2.55", unit: "bar", spec: "≥ 2.5" },
        { label: "Hold time", value: "120", unit: "s", spec: "≥ 120" },
        { label: "Drop", value: "0.01", unit: "bar", spec: "≤ 0.05" },
        { label: "Cycle", value: "118", unit: "s", spec: "≤ 130" },
      ];
    case "Painting":
      return [
        { label: "DFT", value: "78", unit: "μm", spec: "≥ 70" },
        { label: "Booth temp", value: "28", unit: "°C", spec: "25-30" },
        { label: "Air flow", value: "0.45", unit: "m/s", spec: "0.4-0.6" },
        { label: "Cycle", value: "470", unit: "s", spec: "≤ 480" },
      ];
    default:
      return [
        { label: "Cycle time", value: "38", unit: "s", spec: "≤ 45" },
        { label: "Output", value: "28", unit: "u/hr", spec: "≥ 25" },
        { label: "Setup OK", value: "Yes", unit: "", spec: "-" },
        { label: "Operator", value: "R. Sharma", unit: "", spec: "-" },
      ];
  }
}

/* ===================================================================
   WORK ORDER DETAIL DRAWER (Sheet)
   =================================================================== */
function WorkOrderDetailSheet({
  wo, onClose,
}: {
  wo: typeof WORK_ORDERS[number] | null;
  onClose: () => void;
}) {
  const open = wo !== null;

  // Build an as-built timeline: reuse TRACE_EVENTS for this serial if any,
  // otherwise fall back to placeholder stages derived from the WO.
  const timeline = React.useMemo(() => {
    if (!wo) return [];
    const existing = TRACE_EVENTS.filter(e => e.serial === wo.id);
    if (existing.length > 0) return existing;
    // Placeholder stages
    const stages = ["Cutting", "Forming", "Welding", "Leak Test", "Galvanizing", "Painting", "Assembly", "Final QC"];
    const currentIdx = Math.max(0, stages.indexOf(wo.currentStage));
    return stages.map((s, i) => ({
      id: `ph-${i}`,
      serial: wo.id,
      stage: s,
      timestamp: new Date(1724697600000 - (stages.length - i) * 3600000).toISOString(),
      operator: wo.operator || "Unassigned",
      machine: `${wo.plant}-M-${String(i + 1).padStart(3, "0")}`,
      result: i < currentIdx ? "pass" as const : i === currentIdx ? "pass" as const : "pending" as const,
      data: [
        { label: "Heat No.", value: wo.heatNumber || "-" },
        { label: "Cycle", value: `${30 + i * 2} s` },
        { label: "Operator", value: wo.operator || "-" },
        { label: "Stage", value: s },
      ],
    }));
  }, [wo]);

  // Quality checks performed - filter QUALITY_RECORDS by serial (WO id as serial proxy).
  const qcForWO = React.useMemo(() => {
    if (!wo) return [];
    const bySerial = QUALITY_RECORDS.filter(q => q.serial === wo.id);
    if (bySerial.length > 0) return bySerial;
    // Fallback: last 5 records from the same plant + stage.
    return QUALITY_RECORDS
      .filter(q => q.plant === wo.plant)
      .slice(0, 5)
      .map(q => ({ ...q, serial: wo.id }));
  }, [wo]);

  const operator = wo?.operator ? OPERATORS_DATA.find(o => o.name === wo.operator) : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto p-0"
      >
        {wo && (
          <>
            <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <ClipboardList className="h-3.5 w-3.5" />
                Work Order Detail
              </div>
              <SheetTitle className="text-xl font-bold tracking-tight">
                {wo.id} · <span className="font-mono">{wo.orderNo}</span>
              </SheetTitle>
              <SheetDescription className="text-sm">
                {wo.product} · {wo.customer}
              </SheetDescription>
              <div className="mt-2 flex items-center gap-2">
                <WOStatusBadge status={wo.status} />
                <PriorityMark priority={wo.priority} />
                <span className="inline-flex h-5 items-center rounded bg-muted px-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {wo.plant} · {wo.line}
                </span>
              </div>
            </SheetHeader>

            <div className="space-y-5 p-5">
              {/* All fields */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Order Fields</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border rounded overflow-hidden border border-border">
                  <DetailField label="WO ID" value={wo.id} mono />
                  <DetailField label="Order No." value={wo.orderNo} mono />
                  <DetailField label="Product" value={wo.product} mono />
                  <DetailField label="Customer" value={wo.customer} />
                  <DetailField label="Plant" value={wo.plant} mono />
                  <DetailField label="Line" value={wo.line} mono />
                  <DetailField label="Qty Ordered" value={String(wo.qty)} />
                  <DetailField label="Qty Done" value={String(wo.qtyDone)} />
                  <DetailField label="Qty Scrap" value={String(wo.qtyScrap)} />
                  <DetailField label="Progress" value={`${wo.progress}%`} />
                  <DetailField label="OEE" value={`${wo.oee}%`} />
                  <DetailField label="Heat No." value={wo.heatNumber || "-"} mono />
                  <DetailField label="Current Stage" value={wo.currentStage} />
                  <DetailField label="Operator" value={wo.operator || "Unassigned"} />
                  <DetailField
                    label="Start Date"
                    value={formatDateYear(wo.startDate)}
                  />
                  <DetailField
                    label="Due Date"
                    value={formatDateYear(wo.dueDate)}
                  />
                  <DetailField label="Priority" value={wo.priority.toUpperCase()} />
                  <DetailField label="Status" value={wo.status.toUpperCase()} />
                </div>
              </section>

              {/* As-built timeline */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  As-built Timeline · {timeline.length} stages
                </h3>
                <div className="rounded border border-border bg-card p-4">
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-3">
                      {timeline.map((e) => (
                        <div key={e.id} className="relative pl-9">
                          <div className={cn(
                            "absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2",
                            e.result === "pass" ? "bg-primary border-primary" :
                            e.result === "fail" ? "bg-background border-primary" :
                            e.result === "hold" ? "bg-muted border-primary" :
                            "bg-background border-border"
                          )} />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{e.stage}</span>
                            <QualityBadge result={e.result} />
                            <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                              {formatDateTime(e.timestamp)}
                            </span>
                          </div>
                          <div className="mt-1 grid grid-cols-2 gap-1 text-[11px]">
                            {e.data.map((d, j) => (
                              <div key={j} className="flex justify-between border-b border-border/50 pb-0.5">
                                <span className="text-muted-foreground">{d.label}</span>
                                <span className="font-mono font-semibold">{d.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            Operator: <span className="font-medium text-primary">{e.operator}</span> · Machine: <span className="font-mono">{e.machine}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Quality checks */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Quality Checks · {qcForWO.length} records
                </h3>
                <div className="rounded border border-border bg-card overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 border-b border-border">
                      <tr>
                        <th className="px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">QC ID</th>
                        <th className="px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stage</th>
                        <th className="px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Inspector</th>
                        <th className="px-2.5 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Value</th>
                        <th className="px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Spec</th>
                        <th className="px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {qcForWO.length === 0 && (
                        <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">No quality records for this serial.</td></tr>
                      )}
                      {qcForWO.map((q) => (
                        <tr key={q.id}>
                          <td className="px-2.5 py-2 font-mono font-bold">{q.id}</td>
                          <td className="px-2.5 py-2">{q.stage}</td>
                          <td className="px-2.5 py-2">{q.inspector}</td>
                          <td className="px-2.5 py-2 text-right font-mono tabular-nums">{q.value} {q.unit}</td>
                          <td className="px-2.5 py-2 font-mono text-muted-foreground">{q.spec}</td>
                          <td className="px-2.5 py-2"><QualityBadge result={q.result} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Operator assignment + cert validity */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Operator Assignment
                </h3>
                <div className="rounded border border-border bg-card p-4">
                  {operator ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold">{operator.name}</div>
                          <div className="text-[11px] text-muted-foreground">{operator.role} · Plant {operator.plant} · Shift {operator.shift}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Productivity</div>
                          <div className="text-sm font-bold tabular-nums">{operator.productivity}%</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Certifications</div>
                      <div className="flex flex-wrap gap-1.5">
                        {operator.certifications.length === 0 && (
                          <span className="text-[11px] text-muted-foreground">No active certifications</span>
                        )}
                        {operator.certifications.map((c) => (
                          <span
                            key={c.type}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                              c.status === "valid" ? "bg-primary text-primary-foreground" :
                              c.status === "expiring" ? "border-2 border-primary text-primary bg-background" :
                              "border border-border text-muted-foreground"
                            )}
                          >
                            <IdCard className="h-3 w-3" />
                            {c.type}
                            <span className="opacity-70 font-medium normal-case tracking-normal">· {c.validUntil}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <User className="mx-auto h-5 w-5 text-muted-foreground" />
                      <div className="mt-1 text-xs text-muted-foreground">
                        No operator assigned · <span className="font-semibold text-primary">{wo.operator || "Unassigned"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Edit Work Order", "Edit form opened")}>
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Print Job Card", "Job card sent to printer")}>
                <Printer className="h-3.5 w-3.5" /> Print Job Card
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Work Order Held", "WO placed on hold - supervisor notified")}>
                <Ban className="h-3.5 w-3.5" /> Hold
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => notifySuccess("Work Order Completed", "WO marked as complete - moved to closed")}>
                <CheckCircle2 className="h-3.5 w-3.5" /> Complete
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-card p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-sm font-bold mt-0.5 truncate", mono && "font-mono")}>{value}</div>
    </div>
  );
}

/* ===================================================================
   MACHINE DETAIL DRAWER
   =================================================================== */
function MachineDetailDrawer({
  machine, onClose,
}: {
  machine: typeof MACHINES[number] | null;
  onClose: () => void;
}) {
  const open = machine !== null;
  // Find related maintenance orders
  const relatedMaintenance = React.useMemo(() => {
    if (!machine) return [];
    return MAINTENANCE.filter(m => m.asset.includes(machine.id) || m.asset.includes(machine.name));
  }, [machine]);
  // Find related alerts
  const relatedAlerts = React.useMemo(() => {
    if (!machine) return [];
    return ALERTS.filter(a => a.title.includes(machine.name) || a.description.includes(machine.name));
  }, [machine]);

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {machine && (
          <>
            <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Cpu className="h-3.5 w-3.5" />
                Machine Detail
              </div>
              <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                <StatusDot state={machine.state} pulse={machine.state === "running"} />
                {machine.name}
              </SheetTitle>
              <SheetDescription className="text-sm font-mono">
                {machine.id} · {machine.plant} · {machine.line}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 p-5">
              {/* OEE breakdown */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Performance Metrics</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="rounded border border-border bg-card p-3 text-center">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">OEE</div>
                    <div className="text-xl font-bold tabular-nums text-primary">{machine.oee || "-"}</div>
                  </div>
                  <div className="rounded border border-border bg-card p-3 text-center">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Avail</div>
                    <div className="text-xl font-bold tabular-nums">{machine.availability || "-"}</div>
                  </div>
                  <div className="rounded border border-border bg-card p-3 text-center">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Perf</div>
                    <div className="text-xl font-bold tabular-nums">{machine.performance || "-"}</div>
                  </div>
                  <div className="rounded border border-border bg-card p-3 text-center">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Quality</div>
                    <div className="text-xl font-bold tabular-nums text-success">{machine.quality || "-"}</div>
                  </div>
                </div>
              </section>

              {/* Live parameters */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Live Parameters</h3>
                <div className="grid grid-cols-2 gap-2">
                  {machine.parameters.map((p, i) => (
                    <div key={i} className="rounded border border-border bg-card p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.label}</div>
                      <div className="text-lg font-bold tabular-nums">
                        {p.value} <span className="text-xs font-medium text-muted-foreground">{p.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cycle time comparison */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cycle Time Analysis</h3>
                <div className="rounded border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Actual Cycle Time</span>
                    <span className="font-bold tabular-nums">{machine.cycleTime}s</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Ideal Cycle Time</span>
                    <span className="font-bold tabular-nums">{machine.idealCycle}s</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Variance</span>
                    <span className={cn(
                      "font-bold tabular-nums",
                      machine.cycleTime > machine.idealCycle * 1.1 ? "text-destructive" : "text-success"
                    )}>
                      {machine.cycleTime > machine.idealCycle ? "+" : ""}{((machine.cycleTime - machine.idealCycle) / machine.idealCycle * 100).toFixed(1)}%
                    </span>
                  </div>
                  <MonoProgress value={machine.idealCycle > 0 ? (machine.idealCycle / machine.cycleTime) * 100 : 0} />
                </div>
              </section>

              {/* Related maintenance */}
              {relatedMaintenance.length > 0 && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Maintenance History · {relatedMaintenance.length} orders
                  </h3>
                  <div className="space-y-2">
                    {relatedMaintenance.map(m => (
                      <div key={m.id} className="rounded border border-border bg-card p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold">{m.id}</span>
                          <span className={cn(
                            "inline-flex h-4 items-center rounded px-1.5 text-[9px] font-bold uppercase",
                            m.status === "completed" ? "bg-success text-success-foreground" :
                            m.status === "in-progress" ? "bg-primary text-primary-foreground" :
                            "border border-border"
                          )}>{m.status}</span>
                        </div>
                        <div className="text-muted-foreground">{m.type} · {m.priority} priority</div>
                        {m.assignedTo && <div className="text-[10px] text-muted-foreground mt-0.5">Assigned: {m.assignedTo}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related alerts */}
              {relatedAlerts.length > 0 && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Active Alerts · {relatedAlerts.length}
                  </h3>
                  <div className="space-y-2">
                    {relatedAlerts.map(a => (
                      <AlertCard
                        key={a.id}
                        severity={a.severity}
                        title={a.title}
                        description={a.description}
                        timestamp={a.timestamp}
                        module={a.module}
                        plant={a.plant}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Maintenance Order", "Breakdown work order created")}>
                <Wrench className="h-3.5 w-3.5" /> Raise Maintenance
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Data Exported", "Machine telemetry data exported")}>
                <Download className="h-3.5 w-3.5" /> Export Data
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => notifyInfo("Trend Analysis", "Opening trend chart for this machine")}>
                <Activity className="h-3.5 w-3.5" /> View Trend
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ===================================================================
   NCR DETAIL DRAWER
   =================================================================== */
function NCRDetailDrawer({
  ncr, onClose,
}: {
  ncr: typeof NCRS[number] | null;
  onClose: () => void;
}) {
  const open = ncr !== null;

  const statusFlow = ["open", "investigating", "containment", "root-cause", "capa-open", "verified", "closed"];
  const currentStep = ncr ? statusFlow.indexOf(ncr.status) : -1;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {ncr && (
          <>
            <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Non-Conformance Report
              </div>
              <SheetTitle className="text-xl font-bold tracking-tight">
                {ncr.id} · {ncr.title}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {ncr.plant} · {ncr.stage} · {ncr.source} source
              </SheetDescription>
              <div className="mt-2 flex items-center gap-2">
                <span className={cn(
                  "inline-flex h-5 items-center rounded px-2 text-[10px] font-bold uppercase tracking-wider",
                  ncr.severity === "critical" ? "bg-destructive text-destructive-foreground" :
                  ncr.severity === "major" ? "bg-primary text-primary-foreground" :
                  "border border-border"
                )}>{ncr.severity}</span>
                <span className="inline-flex h-5 items-center rounded bg-muted px-2 text-[10px] font-bold uppercase tracking-wider">
                  {ncr.status.replace("-", " ")}
                </span>
              </div>
            </SheetHeader>

            <div className="space-y-5 p-5">
              {/* Workflow progress */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Workflow Progress</h3>
                <div className="flex items-center gap-1">
                  {statusFlow.map((step, i) => (
                    <React.Fragment key={step}>
                      <div className={cn(
                        "flex-1 h-2 rounded-full",
                        i <= currentStep ? "bg-primary" : "bg-muted"
                      )} />
                      {i < statusFlow.length - 1 && (
                        <div className={cn("h-px w-1", i < currentStep ? "bg-primary" : "bg-muted")} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-[8px] uppercase tracking-wider text-muted-foreground">
                  {statusFlow.map(s => <span key={s} className={cn(s === ncr.status && "text-primary font-bold")}>{s.split("-")[0]}</span>)}
                </div>
              </section>

              {/* Description */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Description</h3>
                <div className="rounded border border-border bg-card p-3 text-xs leading-relaxed">
                  {ncr.description}
                </div>
              </section>

              {/* Affected serials */}
              {ncr.affectedSerials.length > 0 && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Affected Serials · {ncr.affectedSerials.length} · {ncr.affectedQty} units
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {ncr.affectedSerials.map(s => (
                      <span key={s} className="font-mono text-[10px] px-2 py-1 rounded border border-border bg-muted/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Containment action */}
              {ncr.containmentAction && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Containment Action</h3>
                  <div className="rounded border border-warning/30 bg-warning/5 p-3 text-xs leading-relaxed">
                    {ncr.containmentAction}
                  </div>
                </section>
              )}

              {/* Root cause */}
              {ncr.rootCause && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Root Cause</h3>
                  <div className="rounded border border-primary/30 bg-primary/5 p-3 text-xs leading-relaxed">
                    {ncr.rootCause}
                  </div>
                </section>
              )}

              {/* CAPA */}
              {ncr.capaAction && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Corrective & Preventive Action
                  </h3>
                  <div className="rounded border border-success/30 bg-success/5 p-3 text-xs leading-relaxed">
                    {ncr.capaAction}
                  </div>
                  {ncr.capaOwner && (
                    <div className="mt-2 flex items-center gap-3 text-[11px]">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-semibold">{ncr.capaOwner}</span>
                      {ncr.capaDue && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">Due:</span>
                          <span className="font-semibold tabular-nums">{formatDate(ncr.capaDue)}</span>
                        </>
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* Meta info */}
              <section>
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="Raised By" value={ncr.raisedBy} />
                  <DetailField label="Days Open" value={String(ncr.daysOpen)} />
                  <DetailField label="Raised At" value={formatDateTime(ncr.raisedAt)} />
                  <DetailField label="Affected Qty" value={String(ncr.affectedQty)} />
                </div>
              </section>
            </div>

            <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Root Cause Analysis", "5-Whys RCA template opened")}>
                <GitFork className="h-3.5 w-3.5" /> Start RCA
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("NCR Exported", "NCR document exported as PDF")}>
                <Download className="h-3.5 w-3.5" /> Export NCR
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => notifySuccess("Status Advanced", "NCR moved to next workflow stage")}>
                <CheckCircle2 className="h-3.5 w-3.5" /> Advance Status
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ===================================================================
   OPERATOR DETAIL DRAWER
   =================================================================== */
function OperatorDetailDrawer({
  operator, onClose,
}: {
  operator: typeof OPERATORS_DATA[number] | null;
  onClose: () => void;
}) {
  const open = operator !== null;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {operator && (
          <>
            <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Operator Profile
              </div>
              <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {operator.name.split(" ").map(n => n[0]).join("")}
                </div>
                {operator.name}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {operator.role} · Plant {operator.plant} · Shift {operator.shift}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 p-5">
              {/* Performance metrics */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Performance</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded border border-border bg-card p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Productivity</div>
                    <div className="text-2xl font-bold tabular-nums text-primary">{operator.productivity}%</div>
                    <MonoProgress value={operator.productivity} className="mt-2" />
                  </div>
                  <div className="rounded border border-border bg-card p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Utilization</div>
                    <div className="text-2xl font-bold tabular-nums text-success">{operator.utilization}%</div>
                    <MonoProgress value={operator.utilization} className="mt-2" />
                  </div>
                </div>
              </section>

              {/* Certifications */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Certifications · {operator.certifications.length} active
                </h3>
                <div className="space-y-2">
                  {operator.certifications.length === 0 && (
                    <div className="text-center py-4 text-xs text-muted-foreground">No active certifications</div>
                  )}
                  {operator.certifications.map((c, i) => (
                    <div key={i} className={cn(
                      "rounded border p-3 flex items-center justify-between",
                      c.status === "valid" ? "border-success/30 bg-success/5" :
                      c.status === "expiring" ? "border-warning/30 bg-warning/5" :
                      "border-destructive/30 bg-destructive/5"
                    )}>
                      <div className="flex items-center gap-2">
                        <IdCard className={cn(
                          "h-4 w-4",
                          c.status === "valid" ? "text-success" :
                          c.status === "expiring" ? "text-warning" : "text-destructive"
                        )} />
                        <div>
                          <div className="text-xs font-bold">{c.type}</div>
                          <div className="text-[10px] text-muted-foreground">Valid until: {c.validUntil}</div>
                        </div>
                      </div>
                      <span className={cn(
                        "inline-flex h-5 items-center rounded px-2 text-[9px] font-bold uppercase tracking-wider",
                        c.status === "valid" ? "bg-success text-success-foreground" :
                        c.status === "expiring" ? "bg-warning text-warning-foreground" :
                        "bg-destructive text-destructive-foreground"
                      )}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills matrix */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Skills Matrix · {operator.skills.length} skills
                </h3>
                <div className="space-y-2">
                  {operator.skills.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-32 shrink-0">{s.skill}</span>
                      <div className="flex gap-0.5 flex-1">
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <div
                            key={lvl}
                            className={cn(
                              "h-2 flex-1 rounded-sm",
                              lvl <= s.level ? (s.level >= 4 ? "bg-primary" : "bg-primary/60") : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold tabular-nums w-8 text-right">L{s.level}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Assigned work orders */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Assigned Work Orders
                </h3>
                <div className="space-y-1.5">
                  {WORK_ORDERS.filter(w => w.operator === operator.name).slice(0, 5).map(w => (
                    <div key={w.id} className="flex items-center gap-2 rounded border border-border bg-card p-2 text-xs">
                      <span className="font-mono font-bold">{w.id}</span>
                      <span className="flex-1 truncate">{w.product}</span>
                      <WOStatusBadge status={w.status} />
                      <span className="text-[10px] tabular-nums text-muted-foreground">{w.progress}%</span>
                    </div>
                  ))}
                  {WORK_ORDERS.filter(w => w.operator === operator.name).length === 0 && (
                    <div className="text-center py-4 text-xs text-muted-foreground">No active work orders</div>
                  )}
                </div>
              </section>
            </div>

            <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Edit Profile", "Operator profile edit form opened")}>
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Training Record", "Training record exported")}>
                <Download className="h-3.5 w-3.5" /> Training Record
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => notifyInfo("Assign Work Order", "Work order assignment dialog opened")}>
                <ClipboardList className="h-3.5 w-3.5" /> Assign WO
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ===================================================================
   QUALITY RECORD DETAIL DRAWER
   =================================================================== */
function QualityRecordDrawer({
  record, onClose,
}: {
  record: typeof QUALITY_RECORDS[number] | null;
  onClose: () => void;
}) {
  const open = record !== null;
  const inspector = record ? OPERATORS_DATA.find(o => o.name === record.inspector) : null;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
        {record && (
          <>
            <SheetHeader className="border-b border-border bg-muted/30 px-5 py-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Quality Inspection Record
              </div>
              <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                {record.id}
                <QualityBadge result={record.result} />
              </SheetTitle>
              <SheetDescription className="text-sm font-mono">
                {record.serial} · {record.stage} · {record.plant}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 p-5">
              {/* Measurement */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Measurement</h3>
                <div className="rounded border border-border bg-card p-4 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Measured Value</div>
                  <div className={cn(
                    "text-4xl font-bold tabular-nums mt-1",
                    record.result === "pass" ? "text-success" :
                    record.result === "fail" ? "text-destructive" : "text-warning"
                  )}>
                    {record.value} <span className="text-lg text-muted-foreground">{record.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Spec: {record.spec}</div>
                </div>
              </section>

              {/* Inspection details */}
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Inspection Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="QC ID" value={record.id} mono />
                  <DetailField label="Serial" value={record.serial} mono />
                  <DetailField label="Stage" value={record.stage} />
                  <DetailField label="Plant" value={record.plant} mono />
                  <DetailField label="Inspector" value={record.inspector} />
                  <DetailField label="Timestamp" value={formatDateTime(record.timestamp)} />
                  <DetailField label="Spec" value={record.spec || "-"} mono />
                  <DetailField label="Result" value={record.result.toUpperCase()} />
                </div>
              </section>

              {/* Notes */}
              {record.notes && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</h3>
                  <div className="rounded border border-border bg-card p-3 text-xs leading-relaxed">
                    {record.notes}
                  </div>
                </section>
              )}

              {/* Inspector info */}
              {inspector && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Inspector Profile</h3>
                  <div className="rounded border border-border bg-card p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {inspector.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{inspector.name}</div>
                        <div className="text-[10px] text-muted-foreground">{inspector.role} · Plant {inspector.plant}</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-[9px] uppercase text-muted-foreground">Productivity</div>
                        <div className="text-sm font-bold tabular-nums">{inspector.productivity}%</div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <SheetFooter className="border-t border-border bg-muted/30 px-5 py-3 flex-row flex-wrap gap-2 sm:justify-end">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Traceability", "Opening as-built genealogy for this serial")}>
                <Workflow className="h-3.5 w-3.5" /> View Traceability
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifyInfo("Raise NCR", "NCR creation form opened for this serial")}>
                <AlertTriangle className="h-3.5 w-3.5" /> Raise NCR
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => notifySuccess("Certificate Exported", "Quality certificate exported as PDF")}>
                <Download className="h-3.5 w-3.5" /> Export Certificate
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ===================================================================
   Shared UI components
   =================================================================== */
function ModuleHeader({
  eyebrow, title, description, icon: Icon, moduleId,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleId?: string;
}) {
  const { activeModule } = useMESPrefs();
  const currentModId = moduleId || activeModule;

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center bg-primary text-primary-foreground rounded-xl shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">{title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 font-semibold text-primary border-primary/30 hover:bg-primary/10 transition-swiss"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("mes:open-feature-guide", { detail: { moduleId: currentModId } })
            )
          }
          title="View Feature Guide & Step-by-Step Workflow"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Feature Guide</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notifySuccess("Exported", "Data exported successfully")}>
          <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </div>
  );
}

function MiniKPI({ label, value, trend }: { label: string; value: string | number; trend?: string }) {
  return (
    <Card className="p-3 hover:shadow-sm transition-swiss gsap-reveal">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg sm:text-xl font-bold tabular-nums mt-1 text-foreground">{value}</div>
      {trend && <div className="text-[10px] text-muted-foreground mt-0.5">{trend}</div>}
    </Card>
  );
}

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums font-bold">{value}%</span>
      </div>
      <MonoProgress value={value} />
    </div>
  );
}

function MetricBox({ label, value, unit, spec }: { label: string; value: string | number; unit: string; spec: string }) {
  return (
    <div className="border border-border rounded p-3 bg-card">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-1">{value} <span className="text-xs font-medium text-muted-foreground">{unit}</span></div>
      <div className="text-[10px] text-muted-foreground mt-0.5">Spec: {spec}</div>
    </div>
  );
}

// (no custom ReferenceLine - using recharts' built-in)
