"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlantCode, Role, MESModule } from "./types";
import { ROLE_CONFIGS } from "./role-config";

export type Density = "compact" | "comfortable" | "spacious";
export type TimeRange = "shift" | "today" | "week" | "month" | "quarter";

interface MESPreferences {
  activePlant: PlantCode | "ALL";
  activeRole: Role;
  activeModule: MESModule;
  density: Density;
  timeRange: TimeRange;
  sidebarCollapsed: boolean;
  showGrid: boolean;
  favorites: MESModule[];
  pinnedKPIs: string[];
  searchQuery: string;
  notifDrawerOpen: boolean;
  // actions
  setPlant: (p: PlantCode | "ALL") => void;
  setRole: (r: Role) => void;
  setModule: (m: MESModule) => void;
  setDensity: (d: Density) => void;
  setTimeRange: (t: TimeRange) => void;
  toggleSidebar: () => void;
  toggleGrid: () => void;
  toggleFavorite: (m: MESModule) => void;
  togglePinnedKPI: (k: string) => void;
  setSearch: (q: string) => void;
  toggleNotifDrawer: () => void;
  setNotifDrawer: (open: boolean) => void;
  // role-based helpers
  getRoleConfig: () => typeof ROLE_CONFIGS[Role];
  isModuleAllowed: (m: MESModule) => boolean;
  getRoleKPIs: () => string[];
}

export const useMESPrefs = create<MESPreferences>()(
  persist(
    (set, get) => ({
      activePlant: "ALL",
      activeRole: "executive",
      activeModule: "overview",
      density: "comfortable",
      timeRange: "today",
      sidebarCollapsed: false,
      showGrid: true,
      favorites: ["overview", "oee", "quality", "traceability"],
      pinnedKPIs: ["oee", "on-time", "fp-yield", "scrap"],
      searchQuery: "",
      notifDrawerOpen: false,
      setPlant: (p) => set({ activePlant: p }),
      setRole: (r) => {
        // When role changes, set default plant and module for that role
        const config = ROLE_CONFIGS[r];
        set({
          activeRole: r,
          activePlant: config.defaultPlant,
          activeModule: config.defaultModule,
        });
      },
      setModule: (m) => set({ activeModule: m }),
      setDensity: (d) => set({ density: d }),
      setTimeRange: (t) => set({ timeRange: t }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
      toggleFavorite: (m) =>
        set((s) => ({
          favorites: s.favorites.includes(m)
            ? s.favorites.filter((x) => x !== m)
            : [...s.favorites, m],
        })),
      togglePinnedKPI: (k) =>
        set((s) => ({
          pinnedKPIs: s.pinnedKPIs.includes(k)
            ? s.pinnedKPIs.filter((x) => x !== k)
            : [...s.pinnedKPIs, k],
        })),
      setSearch: (q) => set({ searchQuery: q }),
      toggleNotifDrawer: () => set((s) => ({ notifDrawerOpen: !s.notifDrawerOpen })),
      setNotifDrawer: (open) => set({ notifDrawerOpen: open }),
      getRoleConfig: () => ROLE_CONFIGS[get().activeRole],
      isModuleAllowed: (m) => {
        const config = ROLE_CONFIGS[get().activeRole];
        return config.allowedModules.includes(m);
      },
      getRoleKPIs: () => ROLE_CONFIGS[get().activeRole].kpiFocus,
    }),
    { name: "mes-prefs" }
  )
);

export const PLANTS: { code: PlantCode; name: string; location: string; since: string; role: string; lines: string[] }[] = [
  { code: "K1", name: "Khopoli Plant 1", location: "Khopoli, Maharashtra", since: "2005", role: "Radiator manufacturing", lines: ["FIN-LINE-A", "WELD-LINE-1", "HDG-1"] },
  { code: "K2", name: "Khopoli Plant 2", location: "Khopoli, Maharashtra", since: "2018", role: "Galvanizing · Automatic radiator line", lines: ["AUTO-LINE", "HDG-2", "WELD-LINE-2"] },
  { code: "K3", name: "Khopoli Plant 3", location: "Khopoli, Maharashtra", since: "2023", role: "Painting & coating facility", lines: ["PAINT-1", "PAINT-2", "BAKE-1"] },
  { code: "K4", name: "Khopoli Plant 4", location: "Khopoli, Maharashtra", since: "2023", role: "Material storage & machine store", lines: ["STORE-A", "STORE-B"] },
  { code: "R1", name: "Rabale Plant", location: "Rabale, Navi Mumbai", since: "2013", role: "Tank manufacturing (revamped 2024)", lines: ["TANK-LINE-1", "TANK-LINE-2", "WELD-LINE-R"] },
];

export const MODULES: { id: MESModule; name: string; short: string; description: string; icon: string }[] = [
  { id: "overview", name: "Executive Cockpit", short: "Overview", description: "Multi-plant consolidated view", icon: "LayoutDashboard" },
  { id: "planning", name: "Production Planning & Scheduling", short: "Planning", description: "Finite-capacity APS, Gantt, what-if", icon: "CalendarRange" },
  { id: "work-orders", name: "Work Order Execution", short: "Work Orders", description: "Digital job cards, WIP, Andon", icon: "ClipboardList" },
  { id: "inventory", name: "Material & Inventory", short: "Inventory", description: "Heat tracking, multi-plant stock", icon: "Boxes" },
  { id: "quality", name: "Quality Management", short: "Quality", description: "Gates, NCR/CAPA, SPC, ISO 3834-2", icon: "ShieldCheck" },
  { id: "traceability", name: "Genealogy & Traceability", short: "Traceability", description: "Coil-to-customer as-built record", icon: "Workflow" },
  { id: "iiot", name: "Machine / IIoT", short: "IIoT", description: "OPC-UA, Modbus, MQTT, parameters", icon: "Cpu" },
  { id: "oee", name: "OEE & Performance", short: "OEE", description: "A×P×Q, six big losses, Pareto", icon: "Gauge" },
  { id: "maintenance", name: "Maintenance (CMMS)", short: "Maintenance", description: "PM, breakdowns, MTBF/MTTR, spares", icon: "Wrench" },
  { id: "energy", name: "Energy & Utilities", short: "Energy", description: "Per-unit energy, CO2, HDG analytics", icon: "Zap" },
  { id: "workforce", name: "Workforce / Labour", short: "Workforce", description: "Skills matrix, cert validity", icon: "Users" },
  { id: "documents", name: "Document & Compliance", short: "Documents", description: "WPS/PQR/SOP, version control, audit", icon: "FileText" },
  { id: "operator-terminal", name: "Operator Terminal", short: "Operator", description: "Kiosk job card, Andon, touch execution", icon: "Monitor" },
  { id: "andon", name: "Andon Big Screen", short: "Andon", description: "Shop-floor display, station status", icon: "Tv" },
  { id: "shift-handover", name: "Shift Handover Log", short: "Handover", description: "Digital shift log, escalations", icon: "BookOpen" },
  { id: "line-simulator", name: "Production Line Simulator", short: "Line Sim", description: "Live line flow, bottleneck analysis", icon: "GitBranch" },
  { id: "suppliers", name: "Supplier Scorecard", short: "Suppliers", description: "Vendor rating, quality, delivery", icon: "Truck" },
  { id: "audit-trail", name: "Audit Trail", short: "Audit Trail", description: "Tamper-evident activity log", icon: "History" },
  { id: "customer-portal", name: "Customer Portal", short: "Portal", description: "Order status, documentation, traceability", icon: "Globe" },
  { id: "dispatch", name: "Dispatch & Logistics", short: "Dispatch", description: "Shipments, manifests, tracking, POD", icon: "PackageCheck" },
  { id: "calibration", name: "Calibration Calendar", short: "Calibration", description: "Instrument due-dates, certs, criticality", icon: "CalendarCheck" },
  { id: "cost-quality", name: "Cost of Quality", short: "Cost of Q", description: "PAIF analysis · prevention · appraisal · failure", icon: "CircleDollarSign" },
  { id: "root-cause", name: "Root Cause Analysis", short: "Root Cause", description: "5-Whys · fishbone · CAPA effectiveness", icon: "GitFork" },
  { id: "forecast", name: "Production Forecast", short: "Forecast", description: "What-if scenarios, capacity, risk analysis", icon: "TrendingUp" },
  { id: "wip-aging", name: "WIP Aging & Kanban", short: "WIP Aging", description: "Work-in-progress aging, bottlenecks, Kanban", icon: "Hourglass" },
  { id: "dashboards", name: "Dashboards & Alerts", short: "Dashboards", description: "Role-based, Andon, notifications", icon: "Bell" },
  { id: "features-guide", name: "Features & User Guide", short: "User Guide", description: "Comprehensive operational manual & workflows", icon: "HelpCircle" },
];

export const ROLES: { id: Role; name: string; description: string }[] = [
  { id: "executive", name: "Executive", description: "MD / Leadership - multi-plant cockpit" },
  { id: "plant-manager", name: "Plant Manager", description: "Single-plant operations oversight" },
  { id: "planner", name: "Planner", description: "Production planning & scheduling" },
  { id: "supervisor", name: "Supervisor", description: "Shop-floor supervision, Andon" },
  { id: "quality", name: "Quality Engineer", description: "Inspection, NCR/CAPA, SPC" },
  { id: "operator", name: "Operator", description: "Digital job card execution" },
  { id: "maintenance", name: "Maintenance", description: "PM, breakdowns, spares" },
  { id: "engineer", name: "Process Engineer", description: "Parameters, OEE, analytics" },
];
