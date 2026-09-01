// Role-based configuration - defines what each role sees
import type { Role, MESModule, PlantCode } from "./types";

export interface RoleConfig {
  id: Role;
  name: string;
  description: string;
  defaultPlant: PlantCode | "ALL";
  defaultModule: MESModule;
  allowedModules: MESModule[];
  kpiFocus: string[];
  quickActions: { label: string; module: MESModule; icon: string }[];
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  executive: {
    id: "executive",
    name: "Executive",
    description: "MD / Leadership - multi-plant cockpit",
    defaultPlant: "ALL",
    defaultModule: "overview",
    allowedModules: [
      "overview", "oee", "quality", "traceability", "dispatch",
      "customer-portal", "cost-quality", "suppliers", "audit-trail",
      "forecast", "dashboards", "energy", "features-guide",
    ],
    kpiFocus: ["Overall OEE", "On-Time Dispatch", "First-Pass Yield", "Scrap Rate"],
    quickActions: [
      { label: "Executive Cockpit", module: "overview", icon: "LayoutDashboard" },
      { label: "OEE Analytics", module: "oee", icon: "Gauge" },
      { label: "Cost of Quality", module: "cost-quality", icon: "CircleDollarSign" },
      { label: "User Guide", module: "features-guide", icon: "HelpCircle" },
    ],
  },
  "plant-manager": {
    id: "plant-manager",
    name: "Plant Manager",
    description: "Single-plant operations oversight",
    defaultPlant: "K1",
    defaultModule: "overview",
    allowedModules: [
      "overview", "work-orders", "oee", "quality", "maintenance",
      "inventory", "workforce", "andon", "shift-handover", "wip-aging",
      "energy", "dispatch", "features-guide",
    ],
    kpiFocus: ["Overall OEE", "Active Work Orders", "Downtime (min)", "Open NCRs"],
    quickActions: [
      { label: "Plant Overview", module: "overview", icon: "LayoutDashboard" },
      { label: "Work Orders", module: "work-orders", icon: "ClipboardList" },
      { label: "Andon Board", module: "andon", icon: "Tv" },
      { label: "User Guide", module: "features-guide", icon: "HelpCircle" },
    ],
  },
  planner: {
    id: "planner",
    name: "Planner",
    description: "Production planning & scheduling",
    defaultPlant: "ALL",
    defaultModule: "planning",
    allowedModules: [
      "planning", "work-orders", "inventory", "dispatch",
      "forecast", "wip-aging", "overview", "customer-portal", "features-guide",
    ],
    kpiFocus: ["Active Work Orders", "On-Time Dispatch", "Downtime (min)"],
    quickActions: [
      { label: "Planning Board", module: "planning", icon: "CalendarRange" },
      { label: "Work Orders", module: "work-orders", icon: "ClipboardList" },
      { label: "Forecast", module: "forecast", icon: "TrendingUp" },
      { label: "User Guide", module: "features-guide", icon: "HelpCircle" },
    ],
  },
  supervisor: {
    id: "supervisor",
    name: "Supervisor",
    description: "Shop-floor supervision, Andon",
    defaultPlant: "K1",
    defaultModule: "andon",
    allowedModules: [
      "andon", "work-orders", "shift-handover", "wip-aging",
      "line-simulator", "operator-terminal", "oee", "quality",
      "overview", "iiot", "features-guide",
    ],
    kpiFocus: ["Active Work Orders", "Downtime (min)", "Open NCRs"],
    quickActions: [
      { label: "Andon Board", module: "andon", icon: "Tv" },
      { label: "Line Simulator", module: "line-simulator", icon: "GitBranch" },
      { label: "Shift Handover", module: "shift-handover", icon: "BookOpen" },
      { label: "User Guide", module: "features-guide", icon: "HelpCircle" },
    ],
  },
  quality: {
    id: "quality",
    name: "Quality Engineer",
    description: "Inspection, NCR/CAPA, SPC",
    defaultPlant: "ALL",
    defaultModule: "quality",
    allowedModules: [
      "quality", "traceability", "calibration", "cost-quality",
      "root-cause", "documents", "suppliers", "audit-trail",
      "overview", "features-guide",
    ],
    kpiFocus: ["First-Pass Yield", "Scrap Rate", "Open NCRs", "Traceability Coverage"],
    quickActions: [
      { label: "Quality Mgmt", module: "quality", icon: "ShieldCheck" },
      { label: "NCR / CAPA", module: "quality", icon: "ShieldCheck" },
      { label: "Root Cause", module: "root-cause", icon: "GitFork" },
      { label: "User Guide", module: "features-guide", icon: "HelpCircle" },
    ],
  },
  operator: {
    id: "operator",
    name: "Operator",
    description: "Digital job card execution",
    defaultPlant: "K1",
    defaultModule: "operator-terminal",
    allowedModules: [
      "operator-terminal", "work-orders", "andon", "shift-handover",
      "traceability", "features-guide",
    ],
    kpiFocus: ["Active Work Orders"],
    quickActions: [
      { label: "Operator Terminal", module: "operator-terminal", icon: "Monitor" },
      { label: "My Work Orders", module: "work-orders", icon: "ClipboardList" },
      { label: "Shift Handover", module: "shift-handover", icon: "BookOpen" },
      { label: "User Guide", module: "features-guide", icon: "HelpCircle" },
    ],
  },
  maintenance: {
    id: "maintenance",
    name: "Maintenance",
    description: "PM, breakdowns, spares",
    defaultPlant: "ALL",
    defaultModule: "maintenance",
    allowedModules: [
      "maintenance", "iiot", "calibration", "energy",
      "overview", "oee", "features-guide",
    ],
    kpiFocus: ["Downtime (min)", "Overall OEE"],
    quickActions: [
      { label: "Maintenance", module: "maintenance", icon: "Wrench" },
      { label: "Machine / IIoT", module: "iiot", icon: "Cpu" },
      { label: "Calibration", module: "calibration", icon: "CalendarCheck" },
      { label: "User Guide", module: "features-guide", icon: "HelpCircle" },
    ],
  },
  engineer: {
    id: "engineer",
    name: "Process Engineer",
    description: "Parameters, OEE, analytics",
    defaultPlant: "ALL",
    defaultModule: "oee",
    allowedModules: [
      "oee", "iiot", "quality", "root-cause", "line-simulator",
      "energy", "overview", "forecast", "wip-aging", "features-guide",
    ],
    kpiFocus: ["Overall OEE", "First-Pass Yield", "Scrap Rate"],
    quickActions: [
      { label: "OEE Analytics", module: "oee", icon: "Gauge" },
      { label: "Machine / IIoT", module: "iiot", icon: "Cpu" },
      { label: "Line Simulator", module: "line-simulator", icon: "GitBranch" },
      { label: "User Guide", module: "features-guide", icon: "HelpCircle" },
    ],
  },
};
