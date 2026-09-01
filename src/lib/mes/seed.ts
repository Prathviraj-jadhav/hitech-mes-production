// MES Seed Data - realistic Hi-Tech Radiators dataset
import type {
  WorkOrder, QualityRecord, Machine, InventoryItem,
  MaintenanceOrder, Operator, TraceEvent, KPI, Alert, PlantCode,
  NCR, ShiftHandoverEntry, ProductionLine,
  Supplier, AuditEntry, CustomerOrder, KPIBreakdown,
  Shipment, CalibrationItem,
  CostOfQualityItem, RootCauseAnalysis,
  ForecastScenario, WIPItem,
} from "./types";

export const KPIS: KPI[] = [
  { label: "Overall OEE", value: 72.4, unit: "%", target: 75, trend: 2.1, trendLabel: "vs last shift", sparkline: [68, 70, 67, 71, 73, 72, 74, 72, 73, 72.4] },
  { label: "On-Time Dispatch", value: 87.3, unit: "%", target: 90, trend: 3.4, trendLabel: "vs last week", sparkline: [82, 84, 83, 85, 86, 88, 87, 88, 89, 87.3] },
  { label: "First-Pass Yield", value: 94.8, unit: "%", target: 96, trend: -0.8, trendLabel: "vs last shift", sparkline: [95, 96, 95, 94, 95, 96, 94, 95, 95, 94.8] },
  { label: "Scrap Rate", value: 2.1, unit: "%", target: 1.8, trend: 0.3, trendLabel: "vs last shift", sparkline: [1.9, 2.0, 1.8, 2.1, 2.0, 1.9, 2.2, 2.0, 2.1, 2.1] },
  { label: "Active Work Orders", value: 47, unit: "", target: 50, trend: 5, trendLabel: "released today", sparkline: [40, 42, 44, 43, 45, 46, 47, 46, 47, 47] },
  { label: "Downtime (min)", value: 184, unit: "min", target: 150, trend: -22, trendLabel: "vs last shift", sparkline: [220, 210, 200, 195, 190, 188, 185, 184, 184, 184] },
  { label: "Traceability Coverage", value: 99.2, unit: "%", target: 100, trend: 0.4, trendLabel: "vs last week", sparkline: [97, 98, 98, 99, 99, 99, 99, 99, 99, 99.2] },
  { label: "Open NCRs", value: 8, unit: "", target: 5, trend: 2, trendLabel: "new this shift", sparkline: [5, 6, 7, 6, 7, 8, 7, 8, 8, 8] },
];

const customers = ["ABB Power Grids", "Siemens Energy", "GE Grid Sol.", "Hitachi Energy", "Toshiba T&D", "CG Power", "Schneider Electric", "Mitsubishi Electric"];
const products = ["Radiator-FN-2500", "Radiator-FN-3200", "Tank-CW-4500", "Tank-FW-3800", "Radiator-PC-1800", "Tank-PM-2200", "Radiator-FN-4100", "Tank-CW-5200"];
const stages = ["Cutting", "Forming", "Welding", "Leak Test", "Galvanizing", "Painting", "Assembly", "Final QC", "Packing"];
const operators = ["R. Sharma", "A. Patil", "S. Jadhav", "M. Iyer", "K. Deshmukh", "P. Nair", "V. Kulkarni", "D. More", "T. Sawant", "G. Pawar"];

// Fixed reference time for deterministic date generation (prevents hydration mismatch).
// All relative dates are computed from this fixed epoch instead of NOW.
const NOW = 1724697600000; // 2026-08-26T16:00:00Z (stable across server/client)

// Deterministic seeded PRNG (mulberry32) - ensures server/client render match
// This prevents hydration mismatches caused by Math.random()
let _seed = 1337;
function srand() {
  _seed = (_seed + 0x6D2B79F5) | 0;
  let t = _seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function rand(min: number, max: number) { return srand() * (max - min) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(srand() * arr.length)]; }
function pad(n: number, len = 4) { return String(n).padStart(len, "0"); }

export const WORK_ORDERS: WorkOrder[] = Array.from({ length: 48 }).map((_, i) => {
  const plant = pick<PlantCode>(["K1", "K2", "K3", "K4", "R1"]);
  const status = pick<WorkOrder["status"]>(["released", "started", "in-progress", "in-progress", "in-progress", "on-hold", "completed", "completed", "closed"]);
  const qty = Math.floor(rand(20, 240));
  const qtyDone = status === "completed" || status === "closed" ? qty : Math.floor(qty * rand(0.1, 0.9));
  const qtyScrap = Math.floor(qtyDone * rand(0.005, 0.04));
  const progress = Math.round((qtyDone / qty) * 100);
  const priority = pick<WorkOrder["priority"]>(["rush", "high", "normal", "normal", "normal", "low"]);
  const dueIn = Math.floor(rand(1, 14));
  const start = new Date(NOW - rand(0, 5) * 86400000);
  const due = new Date(NOW + dueIn * 86400000);
  return {
    id: `WO-${pad(2400 + i, 4)}`,
    orderNo: `SO-${pad(8100 + i, 5)}`,
    product: pick(products),
    customer: pick(customers),
    plant,
    line: pick(["FIN-LINE-A", "WELD-LINE-1", "HDG-1", "AUTO-LINE", "PAINT-1", "TANK-LINE-1"]),
    qty,
    qtyDone,
    qtyScrap,
    status,
    priority,
    startDate: start.toISOString(),
    dueDate: due.toISOString(),
    progress,
    heatNumber: `HT-${Math.floor(rand(100000, 999999))}`,
    currentStage: pick(stages),
    operator: pick(operators),
    oee: Math.round(rand(58, 88)),
  };
});

export const MACHINES: Machine[] = [
  // K1
  { id: "M-K1-001", name: "CNC Shear #1", plant: "K1", line: "FIN-LINE-A", type: "Cutting", state: "running", oee: 84, availability: 92, performance: 91, quality: 99, cycleTime: 38, idealCycle: 36, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Stroke rate", value: "92", unit: "spm" }, { label: "Blade wear", value: "0.4", unit: "mm" }] },
  { id: "M-K1-002", name: "Fin Former A", plant: "K1", line: "FIN-LINE-A", type: "Forming", state: "running", oee: 78, availability: 88, performance: 89, quality: 99, cycleTime: 22, idealCycle: 20, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Roll speed", value: "18", unit: "m/min" }, { label: "Oil pressure", value: "120", unit: "bar" }] },
  { id: "M-K1-003", name: "Seam Welder 1", plant: "K1", line: "WELD-LINE-1", type: "Welding", state: "idle", oee: 71, availability: 81, performance: 88, quality: 99, cycleTime: 45, idealCycle: 42, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Current", value: "285", unit: "A" }, { label: "Travel speed", value: "0.85", unit: "m/min" }] },
  { id: "M-K1-004", name: "Leak Test Rig 1", plant: "K1", line: "WELD-LINE-1", type: "Testing", state: "running", oee: 89, availability: 95, performance: 94, quality: 99, cycleTime: 120, idealCycle: 110, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Test pressure", value: "2.5", unit: "bar" }, { label: "Hold time", value: "120", unit: "s" }] },
  // K2 - Galvanizing
  { id: "M-K2-001", name: "HDG Kettle", plant: "K2", line: "HDG-2", type: "Galvanizing", state: "running", oee: 82, availability: 91, performance: 90, quality: 99, cycleTime: 1800, idealCycle: 1700, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Bath temp", value: "452", unit: "°C" }, { label: "Dwell time", value: "8.5", unit: "min" }, { label: "Zn level", value: "82", unit: "%" }] },
  { id: "M-K2-002", name: "Auto Line Press", plant: "K2", line: "AUTO-LINE", type: "Pressing", state: "running", oee: 76, availability: 86, performance: 89, quality: 99, cycleTime: 18, idealCycle: 16, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Tonnage", value: "320", unit: "T" }, { label: "Stroke", value: "240", unit: "spm" }] },
  { id: "M-K2-003", name: "Robot Welder 2", plant: "K2", line: "WELD-LINE-2", type: "Welding", state: "down", oee: 0, availability: 0, performance: 0, quality: 0, cycleTime: 0, idealCycle: 38, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Status", value: "FAULT-E104", unit: "" }, { label: "Last current", value: "0", unit: "A" }] },
  // K3 - Painting
  { id: "M-K3-001", name: "Paint Booth 1", plant: "K3", line: "PAINT-1", type: "Painting", state: "running", oee: 79, availability: 88, performance: 90, quality: 99, cycleTime: 480, idealCycle: 440, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "DFT", value: "78", unit: "μm" }, { label: "Booth temp", value: "28", unit: "°C" }] },
  { id: "M-K3-002", name: "Curing Oven 1", plant: "K3", line: "BAKE-1", type: "Curing", state: "running", oee: 85, availability: 92, performance: 93, quality: 100, cycleTime: 1200, idealCycle: 1100, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Oven temp", value: "185", unit: "°C" }, { label: "Bake time", value: "20", unit: "min" }] },
  { id: "M-K3-003", name: "Paint Booth 2", plant: "K3", line: "PAINT-2", type: "Painting", state: "changeover", oee: 0, availability: 0, performance: 0, quality: 0, cycleTime: 0, idealCycle: 440, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Color change", value: "in progress", unit: "" }] },
  // R1 - Tanks
  { id: "M-R1-001", name: "Tank Line Press", plant: "R1", line: "TANK-LINE-1", type: "Pressing", state: "running", oee: 81, availability: 89, performance: 91, quality: 99, cycleTime: 32, idealCycle: 30, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Tonnage", value: "450", unit: "T" }, { label: "Stroke", value: "180", unit: "spm" }] },
  { id: "M-R1-002", name: "Sub-Arc Welder", plant: "R1", line: "WELD-LINE-R", type: "Welding", state: "running", oee: 74, availability: 84, performance: 88, quality: 99, cycleTime: 90, idealCycle: 82, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Current", value: "520", unit: "A" }, { label: "Voltage", value: "32", unit: "V" }] },
  { id: "M-R1-003", name: "Tank Test Rig", plant: "R1", line: "TANK-LINE-2", type: "Testing", state: "idle", oee: 68, availability: 80, performance: 85, quality: 99, cycleTime: 240, idealCycle: 220, lastUpdate: new Date(NOW).toISOString(), parameters: [{ label: "Test pressure", value: "6.0", unit: "bar" }, { label: "Hold time", value: "240", unit: "s" }] },
];

export const QUALITY_RECORDS: QualityRecord[] = Array.from({ length: 40 }).map((_, i) => {
  const stage = pick(stages);
  const result = pick<QualityRecord["result"]>(["pass", "pass", "pass", "pass", "pass", "fail", "hold", "pending"]);
  const isCoating = stage === "Galvanizing" || stage === "Painting";
  const isWeld = stage === "Welding";
  const isLeak = stage === "Leak Test";
  return {
    id: `QC-${pad(5800 + i, 5)}`,
    serial: `SN-${pad(12000 + i, 6)}`,
    stage,
    inspector: pick(operators),
    result,
    value: isCoating ? Math.round(rand(60, 120)) : isWeld ? Math.round(rand(280, 320)) : isLeak ? +rand(2.4, 2.6).toFixed(2) : Math.round(rand(20, 25)),
    spec: isCoating ? "≥70 μm" : isWeld ? "280-320 A" : isLeak ? "≥2.5 bar" : "±0.5 mm",
    unit: isCoating ? "μm" : isWeld ? "A" : isLeak ? "bar" : "mm",
    timestamp: new Date(NOW - i * 1800000).toISOString(),
    plant: pick<PlantCode>(["K1", "K2", "K3", "R1"]),
    notes: result === "fail" ? "Out of spec - routed to NCR" : result === "hold" ? "Pending review" : undefined,
  };
});

export const INVENTORY: InventoryItem[] = [
  { id: "INV-001", sku: "CRCA-COIL-2.5", description: "CRCA Steel Coil 2.5mm × 1250mm", type: "raw", plant: "K4", location: "STORE-A/R1", quantity: 84, unit: "MT", heatNumber: "HT-482910", supplier: "Tata Steel", reorderLevel: 30, lastMovement: new Date(NOW - 3600000).toISOString() },
  { id: "INV-002", sku: "MS-SHEET-3.0", description: "MS Sheet 3.0mm × 1500mm", type: "raw", plant: "K4", location: "STORE-A/R2", quantity: 42, unit: "MT", heatNumber: "HT-482911", supplier: "JSW Steel", reorderLevel: 20, lastMovement: new Date(NOW - 7200000).toISOString() },
  { id: "INV-003", sku: "ZN-INGOT", description: "Zinc Ingot SHG 99.995%", type: "consumable", plant: "K2", location: "HDG-2/STO", quantity: 18.5, unit: "MT", supplier: "Hindustan Zinc", reorderLevel: 8, lastMovement: new Date(NOW - 86400000).toISOString() },
  { id: "INV-004", sku: "PAINT-EPOXY-BLK", description: "Epoxy Primer Black 20L", type: "consumable", plant: "K3", location: "PAINT-1/STO", quantity: 64, unit: "drum", supplier: "Akzo Nobel", reorderLevel: 25, lastMovement: new Date(NOW - 5400000).toISOString() },
  { id: "INV-005", sku: "WELD-WIRE-1.2", description: "MIG Wire SG2 1.2mm 15kg", type: "consumable", plant: "K1", location: "STORE-B/W1", quantity: 132, unit: "spool", supplier: "Ador Welding", reorderLevel: 50, lastMovement: new Date(NOW - 1800000).toISOString() },
  { id: "INV-006", sku: "FG-RAD-FN2500", description: "Finished Radiator FN-2500", type: "fg", plant: "K1", location: "FG-A/R3", quantity: 18, unit: "pcs", lastMovement: new Date(NOW - 900000).toISOString(), reorderLevel: 0 },
  { id: "INV-007", sku: "FG-TANK-CW4500", description: "Finished Tank CW-4500", type: "fg", plant: "R1", location: "FG-R/R1", quantity: 9, unit: "pcs", lastMovement: new Date(NOW - 2700000).toISOString(), reorderLevel: 0 },
  { id: "INV-008", sku: "WIP-CUT-BLANK", description: "Cut blank - fin panel", type: "wip", plant: "K1", location: "WIP/CUT-1", quantity: 240, unit: "pcs", heatNumber: "HT-482910", lastMovement: new Date(NOW - 600000).toISOString(), reorderLevel: 0 },
  { id: "INV-009", sku: "SPARE-WELD-TIP", description: "Weld tip M6 threaded", type: "spare", plant: "K4", location: "STORE-B/SP1", quantity: 48, unit: "pcs", supplier: "Binzel", reorderLevel: 20, lastMovement: new Date(NOW - 86400000 * 3).toISOString() },
  { id: "INV-010", sku: "SPARE-HYD-OIL", description: "Hydraulic Oil ISO VG 68 20L", type: "spare", plant: "K4", location: "STORE-B/SP2", quantity: 7, unit: "drum", supplier: "Shell", reorderLevel: 10, lastMovement: new Date(NOW - 86400000 * 5).toISOString() },
];

export const MAINTENANCE: MaintenanceOrder[] = [
  { id: "MT-001", asset: "HDG Kettle (M-K2-001)", plant: "K2", type: "preventive", priority: "high", status: "scheduled", assignedTo: "Maintenance Team B", dueDate: new Date(NOW + 86400000 * 2).toISOString(), mtbf: 720, mttr: 4 },
  { id: "MT-002", asset: "Robot Welder 2 (M-K2-003)", plant: "K2", type: "corrective", priority: "rush", status: "in-progress", assignedTo: "S. Jadhav", dueDate: new Date(NOW + 3600000 * 4).toISOString(), mtbf: 480, mttr: 6 },
  { id: "MT-003", asset: "CNC Shear #1 (M-K1-001)", plant: "K1", type: "preventive", priority: "normal", status: "open", assignedTo: "Maintenance Team A", dueDate: new Date(NOW + 86400000 * 5).toISOString(), mtbf: 960, mttr: 3 },
  { id: "MT-004", asset: "Leak Test Rig 1 (M-K1-004)", plant: "K1", type: "calibration", priority: "high", status: "scheduled", assignedTo: "Calibration Cell", dueDate: new Date(NOW + 86400000 * 1).toISOString() },
  { id: "MT-005", asset: "Curing Oven 1 (M-K3-002)", plant: "K3", type: "predictive", priority: "normal", status: "open", dueDate: new Date(NOW + 86400000 * 7).toISOString() },
  { id: "MT-006", asset: "DFT Gauge - K3", plant: "K3", type: "calibration", priority: "high", status: "completed", assignedTo: "Calibration Cell", dueDate: new Date(NOW - 86400000 * 2).toISOString() },
  { id: "MT-007", asset: "Tank Line Press (M-R1-001)", plant: "R1", type: "corrective", priority: "normal", status: "completed", assignedTo: "Maintenance Team C", dueDate: new Date(NOW - 86400000 * 1).toISOString(), mtbf: 1200, mttr: 8 },
  { id: "MT-008", asset: "Paint Booth 2 (M-K3-003)", plant: "K3", type: "preventive", priority: "normal", status: "scheduled", assignedTo: "Maintenance Team B", dueDate: new Date(NOW + 86400000 * 3).toISOString() },
];

export const OPERATORS_DATA: Operator[] = [
  { id: "OP-001", name: "R. Sharma", role: "IWE Welder", plant: "K1", certifications: [{ type: "IWE", validUntil: "2027-04-15", status: "valid" }, { type: "ISO 3834-2", validUntil: "2026-12-01", status: "valid" }], skills: [{ skill: "Seam Welding", level: 5 }, { skill: "Sub-Arc", level: 4 }, { skill: "Inspection", level: 3 }], shift: "A", productivity: 92, utilization: 88 },
  { id: "OP-002", name: "A. Patil", role: "Operator", plant: "K1", certifications: [], skills: [{ skill: "Cutting", level: 4 }, { skill: "Forming", level: 3 }, { skill: "Packing", level: 5 }], shift: "A", productivity: 85, utilization: 82 },
  { id: "OP-003", name: "S. Jadhav", role: "Maintenance Tech", plant: "K2", certifications: [{ type: "Electrical Safety", validUntil: "2026-09-30", status: "expiring" }], skills: [{ skill: "PLC", level: 5 }, { skill: "Hydraulics", level: 4 }, { skill: "HDG", level: 4 }], shift: "B", productivity: 88, utilization: 91 },
  { id: "OP-004", name: "M. Iyer", role: "NACE Inspector", plant: "K2", certifications: [{ type: "NACE L2", validUntil: "2027-08-20", status: "valid" }, { type: "FROSIO", validUntil: "2026-11-15", status: "valid" }], skills: [{ skill: "Coating Insp.", level: 5 }, { skill: "HDG", level: 5 }, { skill: "SPC", level: 4 }], shift: "A", productivity: 90, utilization: 86 },
  { id: "OP-005", name: "K. Deshmukh", role: "Operator", plant: "K3", certifications: [], skills: [{ skill: "Painting", level: 5 }, { skill: "Surface Prep", level: 4 }, { skill: "DFT", level: 4 }], shift: "B", productivity: 87, utilization: 84 },
  { id: "OP-006", name: "P. Nair", role: "IWE Welder", plant: "R1", certifications: [{ type: "IWE", validUntil: "2026-08-25", status: "expiring" }], skills: [{ skill: "Sub-Arc", level: 5 }, { skill: "MIG", level: 4 }, { skill: "Inspection", level: 4 }], shift: "A", productivity: 91, utilization: 89 },
  { id: "OP-007", name: "V. Kulkarni", role: "Operator", plant: "R1", certifications: [], skills: [{ skill: "Forming", level: 4 }, { skill: "Assembly", level: 5 }, { skill: "Testing", level: 3 }], shift: "B", productivity: 84, utilization: 80 },
  { id: "OP-008", name: "D. More", role: "FROSIO Inspector", plant: "K3", certifications: [{ type: "FROSIO L3", validUntil: "2027-02-10", status: "valid" }], skills: [{ skill: "Coating Insp.", level: 5 }, { skill: "Painting", level: 4 }, { skill: "QC", level: 5 }], shift: "A", productivity: 89, utilization: 87 },
];

export const TRACE_EVENTS: TraceEvent[] = Array.from({ length: 30 }).map((_, i) => {
  const stage = pick(stages);
  return {
    id: `TE-${pad(9000 + i, 5)}`,
    serial: `SN-${pad(12000 + Math.floor(i / 8), 6)}`,
    stage,
    timestamp: new Date(NOW - i * 900000).toISOString(),
    operator: pick(operators),
    machine: pick(MACHINES).name,
    result: pick<TraceEvent["result"]>(["pass", "pass", "pass", "pass", "fail", "hold"]),
    data: [
      { label: "Heat No.", value: `HT-${482910 + (i % 5)}` },
      { label: "WPS Ref", value: `WPS-RAD-${100 + (i % 8)}` },
      { label: "Cycle", value: `${Math.floor(rand(15, 45))} s` },
      { label: "Parameter", value: stage === "Welding" ? `${Math.round(rand(280, 320))} A` : stage === "Galvanizing" ? `${Math.round(rand(445, 460))} °C` : "OK" },
    ],
  };
});

export const ALERTS: Alert[] = [
  { id: "AL-001", severity: "critical", module: "iiot", title: "Robot Welder 2 - FAULT E104", description: "Wire feed motor fault. Breakdown MT-002 raised.", plant: "K2", timestamp: new Date(NOW - 900000).toISOString(), acknowledged: false },
  { id: "AL-002", severity: "warning", module: "quality", title: "Galvanizing DFT drift on HDG-2", description: "Last 5 batches trending 72→68 μm. Spec ≥70.", plant: "K2", timestamp: new Date(NOW - 1800000).toISOString(), acknowledged: false },
  { id: "AL-003", severity: "warning", module: "workforce", title: "IWE cert expiring - P. Nair", description: "IWE qualification expires in 21 days. Renewal required.", plant: "R1", timestamp: new Date(NOW - 3600000).toISOString(), acknowledged: true },
  { id: "AL-004", severity: "info", module: "inventory", title: "Hydraulic Oil below reorder", description: "Store-B/SP2 has 7 drums (reorder 10).", plant: "K4", timestamp: new Date(NOW - 7200000).toISOString(), acknowledged: false },
  { id: "AL-005", severity: "warning", module: "maintenance", title: "HDG Kettle PM due in 2 days", description: "Scheduled PM MT-001 - zinc bath inspection.", plant: "K2", timestamp: new Date(NOW - 10800000).toISOString(), acknowledged: false },
  { id: "AL-006", severity: "info", module: "planning", title: "Rush order SO-08115 prioritized", description: "Customer: Siemens Energy. Due in 3 days.", plant: "K1", timestamp: new Date(NOW - 14400000).toISOString(), acknowledged: true },
  { id: "AL-007", severity: "critical", module: "quality", title: "NCR-008 raised - Welding K1", description: "3 units failed visual inspection. Routed to hold.", plant: "K1", timestamp: new Date(NOW - 21600000).toISOString(), acknowledged: false },
  { id: "AL-008", severity: "info", module: "energy", title: "Peak demand approaching", description: "Plant K2 at 88% of contracted demand.", plant: "K2", timestamp: new Date(NOW - 28800000).toISOString(), acknowledged: true },
];

// Per-plant KPI summary
export const PLANT_KPIS: Record<PlantCode, { oee: number; fpYield: number; scrap: number; onTime: number; wip: number; output: number; downtime: number; energy: number }> = {
  K1: { oee: 74.2, fpYield: 95.3, scrap: 1.9, onTime: 89.1, wip: 142, output: 28, downtime: 38, energy: 412 },
  K2: { oee: 68.7, fpYield: 93.1, scrap: 2.4, onTime: 84.2, wip: 86, output: 22, downtime: 64, energy: 856 },
  K3: { oee: 76.1, fpYield: 96.4, scrap: 1.6, onTime: 91.4, wip: 64, output: 18, downtime: 22, energy: 324 },
  K4: { oee: 0, fpYield: 0, scrap: 0, onTime: 0, wip: 0, output: 0, downtime: 0, energy: 48 },
  R1: { oee: 71.5, fpYield: 94.7, scrap: 2.1, onTime: 86.8, wip: 98, output: 14, downtime: 41, energy: 388 },
};

// OEE trend over 24 hours (hourly)
export const OEE_TREND_24H = Array.from({ length: 24 }).map((_, h) => ({
  hour: `${pad(h, 2)}:00`,
  availability: Math.round(rand(78, 95)),
  performance: Math.round(rand(75, 92)),
  quality: Math.round(rand(96, 99.8)),
  oee: 0, // computed
})).map((d) => ({ ...d, oee: +((d.availability * d.performance * d.quality) / 10000).toFixed(1) }));

// Six big losses
export const SIX_BIG_LOSSES = [
  { category: "Breakdowns", minutes: 42, parent: "Availability" },
  { category: "Setup/Changeover", minutes: 68, parent: "Availability" },
  { category: "Minor stops", minutes: 28, parent: "Performance" },
  { category: "Speed loss", minutes: 35, parent: "Performance" },
  { category: "Start-up rejects", minutes: 8, parent: "Quality" },
  { category: "Production rejects", minutes: 12, parent: "Quality" },
];

// Energy trend (per hour, kWh)
export const ENERGY_TREND = Array.from({ length: 24 }).map((_, h) => ({
  hour: `${pad(h, 2)}:00`,
  k1: Math.round(rand(12, 22)),
  k2: Math.round(rand(28, 52)),
  k3: Math.round(rand(8, 18)),
  r1: Math.round(rand(10, 20)),
}));

// Documents
export const DOCUMENTS = [
  { id: "DOC-001", name: "WPS-RAD-100 Rev 4", type: "WPS", status: "approved", revision: "4", effective: "2026-01-15", review: "2027-01-15", owner: "Quality Eng." },
  { id: "DOC-002", name: "PQR-RAD-100 Rev 2", type: "PQR", status: "approved", revision: "2", effective: "2025-09-10", review: "2026-09-10", owner: "Quality Eng." },
  { id: "DOC-003", name: "SOP-GALV-001 Rev 7", type: "SOP", status: "approved", revision: "7", effective: "2026-03-01", review: "2027-03-01", owner: "Process Eng." },
  { id: "DOC-004", name: "SOP-PAINT-002 Rev 3", type: "SOP", status: "under-review", revision: "3", effective: "2025-11-20", review: "2026-08-20", owner: "Process Eng." },
  { id: "DOC-005", name: "CP-RAD-2500 Rev 5", type: "Control Plan", status: "approved", revision: "5", effective: "2026-02-10", review: "2027-02-10", owner: "Quality Eng." },
  { id: "DOC-006", name: "WI-WELD-ISO3834 Rev 2", type: "Work Instruction", status: "approved", revision: "2", effective: "2025-08-01", review: "2026-08-01", owner: "Quality Eng." },
  { id: "DOC-007", name: "SOP-LEAK-001 Rev 4", type: "SOP", status: "approved", revision: "4", effective: "2026-01-05", review: "2027-01-05", owner: "Process Eng." },
  { id: "DOC-008", name: "CAL-PLAN-2026 Rev 1", type: "Calibration Plan", status: "approved", revision: "1", effective: "2026-01-01", review: "2026-12-31", owner: "Quality Eng." },
];

export function getModuleData(module: string) {
  switch (module) {
    case "work-orders": return WORK_ORDERS;
    case "machines":
    case "iiot": return MACHINES;
    case "quality": return QUALITY_RECORDS;
    case "inventory": return INVENTORY;
    case "maintenance": return MAINTENANCE;
    case "workforce": return OPERATORS_DATA;
    case "traceability": return TRACE_EVENTS;
    case "documents": return DOCUMENTS;
    case "alerts": return ALERTS;
    case "ncrs": return NCRS;
    case "shift-handover": return SHIFT_HANDOVER;
    case "line-simulator": return PRODUCTION_LINES;
    default: return [];
  }
}

// === NCR / CAPA records ===
export const NCRS: NCR[] = [
  {
    id: "NCR-008",
    title: "Weld porosity - Seam Weld K1",
    description: "3 units (SN-12004, SN-12005, SN-12006) failed visual inspection on seam weld. Surface porosity detected on radiographic check. WPS-RAD-100 Rev 4 followed; suspect moisture contamination in shielding gas.",
    plant: "K1",
    stage: "Welding",
    severity: "major",
    status: "investigating",
    source: "in-process",
    raisedBy: "R. Sharma",
    raisedAt: new Date(NOW - 21600000).toISOString(),
    affectedSerials: ["SN-000012004", "SN-000012005", "SN-000012006"],
    affectedQty: 3,
    containmentAction: "Affected units quarantined. Last 24h output under review for recall scope.",
    daysOpen: 0,
  },
  {
    id: "NCR-007",
    title: "Galvanizing DFT below spec - HDG-2",
    description: "Last 5 batches on HDG-2 kettle trending 72 → 68 μm. Spec ≥ 70 μm. Bath temp stable at 452°C. Suspect Zn bath contamination (Fe content rising).",
    plant: "K2",
    stage: "Galvanizing",
    severity: "critical",
    status: "containment",
    source: "in-process",
    raisedBy: "M. Iyer",
    raisedAt: new Date(NOW - 1800000).toISOString(),
    affectedSerials: ["SN-000012018", "SN-000012019", "SN-000012020", "SN-000012021", "SN-000012022"],
    affectedQty: 28,
    containmentAction: "5 batches quarantined. Bath sample sent to lab. Production continues with adjusted dwell +0.5 min.",
    daysOpen: 1,
  },
  {
    id: "NCR-006",
    title: "Coating pinholes - Paint Booth 1",
    description: "Visual inspection identified pinhole defects on 4 painted radiator panels. Suspect paint viscosity drift in drum PA-2024-08.",
    plant: "K3",
    stage: "Painting",
    severity: "minor",
    status: "root-cause",
    source: "final-qc",
    raisedBy: "D. More",
    raisedAt: new Date(NOW - 86400000 * 2).toISOString(),
    affectedSerials: ["SN-000012030", "SN-000012031", "SN-000012032", "SN-000012033"],
    affectedQty: 4,
    rootCause: "Paint viscosity out of spec - drum exposed to > 30°C ambient during weekend storage.",
    daysOpen: 2,
  },
  {
    id: "NCR-005",
    title: "Dimensional deviation - fin pitch",
    description: "Customer (ABB Power Grids) reported fin pitch out of tolerance on 2 radiators received at site. SN-000011980, SN-000011981. ±0.5mm spec exceeded by 0.8mm.",
    plant: "K1",
    stage: "Forming",
    severity: "major",
    status: "capa-open",
    source: "customer",
    raisedBy: "Quality Head",
    raisedAt: new Date(NOW - 86400000 * 5).toISOString(),
    affectedSerials: ["SN-000011980", "SN-000011981"],
    affectedQty: 2,
    rootCause: "Fin former roll #2 worn beyond tolerance - last calibration overdue by 18 days.",
    capaAction: "Replace roll #2, recalibrate monthly instead of quarterly, add inline CMM check.",
    capaOwner: "Process Engineering",
    capaDue: new Date(NOW + 86400000 * 10).toISOString(),
    daysOpen: 5,
  },
  {
    id: "NCR-004",
    title: "Leak test failure - Tank CW-4500",
    description: "Pressure decay detected during leak test on 1 tank unit. Test pressure 6.0 bar, decay 0.4 bar over 240s (spec ≤ 0.2 bar).",
    plant: "R1",
    stage: "Leak Test",
    severity: "major",
    status: "verified",
    source: "in-process",
    raisedBy: "V. Kulkarni",
    raisedAt: new Date(NOW - 86400000 * 7).toISOString(),
    affectedSerials: ["SN-000011950"],
    affectedQty: 1,
    rootCause: "Sub-arc weld discontinuity at corner joint - wire feed speed drift on M-R1-002.",
    capaAction: "Rework weld, recalibrate wire feed servo, add real-time current monitor alarm.",
    containmentAction: "Unit reworked and re-tested PASS. WO released.",
    daysOpen: 7,
  },
  {
    id: "NCR-003",
    title: "Incoming steel - surface pitting",
    description: "CRCA coil HT-482911 from JSW Steel showed surface pitting on 8% of inspected sheets. Mill certificate within spec.",
    plant: "K4",
    stage: "Incoming",
    severity: "minor",
    status: "closed",
    source: "incoming",
    raisedBy: "Stores Officer",
    raisedAt: new Date(NOW - 86400000 * 12).toISOString(),
    affectedSerials: [],
    affectedQty: 8,
    rootCause: "Transport damage - coil edge protector missing on receipt.",
    capaAction: "Updated GRN process to verify edge protectors. Supplier scorecard updated.",
    daysOpen: 12,
  },
  {
    id: "NCR-002",
    title: "Paint color mismatch - customer spec",
    description: "Customer (Toshiba T&D) reported RAL 7016 shade slightly off. Approved master sample compared.",
    plant: "K3",
    stage: "Painting",
    severity: "minor",
    status: "closed",
    source: "customer",
    raisedBy: "Quality Head",
    raisedAt: new Date(NOW - 86400000 * 18).toISOString(),
    affectedSerials: ["SN-000011820", "SN-000011821"],
    affectedQty: 2,
    rootCause: "Paint mixing ratio deviation - operator used 5:1 instead of 4:1 hardener.",
    capaAction: "Updated SOP-PAINT-002 Rev 3 with explicit ratio check + sign-off.",
    daysOpen: 18,
  },
  {
    id: "NCR-001",
    title: "ISO 3834-2 audit finding - welder cert",
    description: "Third-party audit identified 1 welder (P. Nair) operating with IWE qualification within 30-day expiry window without renewal in progress.",
    plant: "R1",
    stage: "Welding",
    severity: "critical",
    status: "capa-open",
    source: "audit",
    raisedBy: "Lead Auditor (TUV Nord)",
    raisedAt: new Date(NOW - 86400000 * 21).toISOString(),
    affectedSerials: [],
    affectedQty: 0,
    rootCause: "Cert renewal cycle not tracked in HR system - manual spreadsheet gap.",
    capaAction: "Migrate cert tracking to MES Workforce module. Auto-alerts at 60/30/7 days. Block operations at expiry.",
    capaOwner: "HR + Quality",
    capaDue: new Date(NOW + 86400000 * 5).toISOString(),
    daysOpen: 21,
  },
];

// === Shift Handover Log entries ===
export const SHIFT_HANDOVER: ShiftHandoverEntry[] = [
  {
    id: "SH-001",
    shift: "A",
    date: new Date(NOW).toISOString().split("T")[0],
    fromOperator: "R. Sharma",
    toOperator: "S. Jadhav",
    type: "handover",
    title: "Shift A → B handover - K1 Weld Line",
    details: "WO-2400 in progress, 24/40 units done. Seam welder 1 running stable. WO-2401 queued, material reserved. Robot welder 2 still down - breakdown MT-002 in progress.",
    plant: "K1",
    priority: "normal",
    acknowledged: true,
    timestamp: new Date(NOW - 14400000).toISOString(),
  },
  {
    id: "SH-002",
    shift: "A",
    date: new Date(NOW).toISOString().split("T")[0],
    fromOperator: "M. Iyer",
    toOperator: "K. Deshmukh",
    type: "escalation",
    title: "ESCALATION: HDG DFT drift K2",
    details: "NCR-007 raised. Galvanizing DFT trending down on HDG-2. 5 batches quarantined. Bath sample sent to lab. Production continues with +0.5min dwell adjustment. Monitor closely.",
    plant: "K2",
    priority: "rush",
    acknowledged: false,
    timestamp: new Date(NOW - 7200000).toISOString(),
  },
  {
    id: "SH-003",
    shift: "A",
    date: new Date(NOW).toISOString().split("T")[0],
    fromOperator: "A. Patil",
    toOperator: "T. Sawant",
    type: "note",
    title: "Material shortage - WELD-WIRE-1.2",
    details: "MIG wire stock at 132 spools (reorder 50). Plenty for shift B. Reorder PO-2024-0881 placed with Ador, ETA 2 days.",
    plant: "K1",
    priority: "low",
    acknowledged: true,
    timestamp: new Date(NOW - 10800000).toISOString(),
  },
  {
    id: "SH-004",
    shift: "A",
    date: new Date(NOW).toISOString().split("T")[0],
    fromOperator: "P. Nair",
    toOperator: "V. Kulkarni",
    type: "issue",
    title: "Sub-arc welder - intermittent arc stability",
    details: "M-R1-002 showed 3 brief arc instability events during shift A (08:14, 09:42, 11:05). Each <2s. No quality impact detected but flagged for maintenance review.",
    plant: "R1",
    priority: "high",
    acknowledged: false,
    timestamp: new Date(NOW - 5400000).toISOString(),
  },
  {
    id: "SH-005",
    shift: "A",
    date: new Date(NOW).toISOString().split("T")[0],
    fromOperator: "D. More",
    toOperator: "G. Pawar",
    type: "achievement",
    title: "FP Yield record - Paint line K3",
    details: "Shift A achieved 96.8% first-pass yield on paint line - best shift this month. DFT consistency excellent. Recognize K. Deshmukh (operator) for consistent parameter discipline.",
    plant: "K3",
    priority: "normal",
    acknowledged: true,
    timestamp: new Date(NOW - 3600000).toISOString(),
  },
  {
    id: "SH-006",
    shift: "B",
    date: new Date(NOW - 86400000).toISOString().split("T")[0],
    fromOperator: "S. Jadhav",
    toOperator: "R. Sharma",
    type: "handover",
    title: "Shift B → A handover - K1 Weld Line",
    details: "WO-2400 completed overnight (40/40). WO-2401 started 06:15, 8/60 done. Andon call at 22:30 (material shortage, resolved in 18min). Robot welder 2 back online at 03:00.",
    plant: "K1",
    priority: "normal",
    acknowledged: true,
    timestamp: new Date(NOW - 86400000 + 3600000).toISOString(),
  },
  {
    id: "SH-007",
    shift: "B",
    date: new Date(NOW - 86400000).toISOString().split("T")[0],
    fromOperator: "K. Deshmukh",
    toOperator: "M. Iyer",
    type: "note",
    title: "Paint drum changeover - Paint Booth 2",
    details: "Drum changeover on PB-2 completed at 23:45. New drum PA-2024-088 viscosity verified 22s (spec 20-24s). First batch post-changeover passed QC.",
    plant: "K3",
    priority: "low",
    acknowledged: true,
    timestamp: new Date(NOW - 86400000 + 7200000).toISOString(),
  },
];

// === Production Lines for simulator ===
export const PRODUCTION_LINES: ProductionLine[] = [
  {
    id: "PL-K1-FIN-A",
    name: "K1 Fin Line A - Radiator",
    plant: "K1",
    throughput: 14,
    targetThroughput: 16,
    wipTotal: 42,
    bottleneck: "Seam Welder 1",
    stations: [
      { id: "S1", name: "Coil Unwind", state: "running", wipIn: 0, wipOut: 14, cycleTime: 22, idealCycle: 20, utilization: 92, operator: "A. Patil", lastEvent: "Coil HT-482910 loaded", lastEventTime: "14:22" },
      { id: "S2", name: "CNC Shear", state: "running", wipIn: 14, wipOut: 13, cycleTime: 38, idealCycle: 36, utilization: 88, lastEvent: "Stroke rate 92 spm", lastEventTime: "14:30" },
      { id: "S3", name: "Fin Former", state: "running", wipIn: 13, wipOut: 12, cycleTime: 22, idealCycle: 20, utilization: 89, operator: "A. Patil" },
      { id: "S4", name: "Seam Welder", state: "running", wipIn: 12, wipOut: 10, cycleTime: 45, idealCycle: 42, utilization: 81, operator: "R. Sharma", lastEvent: "WPS-RAD-100 active", lastEventTime: "14:28" },
      { id: "S5", name: "Leak Test", state: "idle", wipIn: 10, wipOut: 3, cycleTime: 120, idealCycle: 110, utilization: 0, lastEvent: "Awaiting units", lastEventTime: "14:18" },
      { id: "S6", name: "Inspection", state: "running", wipIn: 3, wipOut: 3, cycleTime: 60, idealCycle: 60, utilization: 95, operator: "M. Iyer" },
    ],
  },
  {
    id: "PL-K2-HDG",
    name: "K2 HDG Line - Galvanizing",
    plant: "K2",
    throughput: 22,
    targetThroughput: 24,
    wipTotal: 28,
    bottleneck: "HDG Kettle",
    stations: [
      { id: "S1", name: "Pre-clean", state: "running", wipIn: 0, wipOut: 24, cycleTime: 90, idealCycle: 85, utilization: 91 },
      { id: "S2", name: "Flux Dip", state: "running", wipIn: 24, wipOut: 24, cycleTime: 60, idealCycle: 55, utilization: 88 },
      { id: "S3", name: "HDG Kettle", state: "running", wipIn: 24, wipOut: 22, cycleTime: 1800, idealCycle: 1700, utilization: 90, operator: "M. Iyer", lastEvent: "Bath 452°C · dwell 8.5min", lastEventTime: "14:30" },
      { id: "S4", name: "Cooling", state: "running", wipIn: 22, wipOut: 22, cycleTime: 600, idealCycle: 600, utilization: 95 },
      { id: "S5", name: "DFT Check", state: "running", wipIn: 22, wipOut: 22, cycleTime: 45, idealCycle: 40, utilization: 87, operator: "M. Iyer", lastEvent: "DFT 68 μm - ALERT", lastEventTime: "14:25" },
      { id: "S6", name: "Quench", state: "idle", wipIn: 22, wipOut: 0, cycleTime: 300, idealCycle: 300, utilization: 0 },
    ],
  },
  {
    id: "PL-R1-TANK",
    name: "R1 Tank Line 1",
    plant: "R1",
    throughput: 8,
    targetThroughput: 10,
    wipTotal: 18,
    bottleneck: "Sub-Arc Welder",
    stations: [
      { id: "S1", name: "Plate Cut", state: "running", wipIn: 0, wipOut: 10, cycleTime: 45, idealCycle: 40, utilization: 86 },
      { id: "S2", name: "Roll Form", state: "running", wipIn: 10, wipOut: 9, cycleTime: 60, idealCycle: 55, utilization: 84 },
      { id: "S3", name: "Sub-Arc Weld", state: "running", wipIn: 9, wipOut: 8, cycleTime: 90, idealCycle: 82, utilization: 74, operator: "P. Nair", lastEvent: "Current 520A · travel 0.4m/min", lastEventTime: "14:28" },
      { id: "S4", name: "Leak Test", state: "running", wipIn: 8, wipOut: 8, cycleTime: 240, idealCycle: 220, utilization: 80, operator: "V. Kulkarni" },
      { id: "S5", name: "Final QC", state: "idle", wipIn: 8, wipOut: 0, cycleTime: 90, idealCycle: 90, utilization: 0 },
    ],
  },
];

// === Andon big-screen data ===
export const ANDON_BOARDS = [
  {
    id: "ANDON-K1",
    plant: "K1" as PlantCode,
    line: "FIN-LINE-A",
    shift: "A",
    supervisor: "R. Sharma",
    output: 28,
    outputTarget: 32,
    oee: 74.2,
    scrap: 1.9,
    downtime: 38,
    activeAlerts: 1,
    andonCalls: 2,
    status: "running" as const,
    stations: [
      { name: "Shear", state: "running" as const, operator: "A. Patil" },
      { name: "Former", state: "running" as const, operator: "A. Patil" },
      { name: "Weld 1", state: "running" as const, operator: "R. Sharma" },
      { name: "Weld 2", state: "down" as const, operator: "-" },
      { name: "Test", state: "idle" as const, operator: "-" },
    ],
  },
  {
    id: "ANDON-K2",
    plant: "K2" as PlantCode,
    line: "HDG-2",
    shift: "A",
    supervisor: "M. Iyer",
    output: 22,
    outputTarget: 24,
    oee: 68.7,
    scrap: 2.4,
    downtime: 64,
    activeAlerts: 3,
    andonCalls: 1,
    status: "running" as const,
    stations: [
      { name: "Pre-clean", state: "running" as const, operator: "-" },
      { name: "Flux", state: "running" as const, operator: "-" },
      { name: "Kettle", state: "running" as const, operator: "M. Iyer" },
      { name: "Cool", state: "running" as const, operator: "-" },
      { name: "DFT", state: "running" as const, operator: "M. Iyer" },
    ],
  },
  {
    id: "ANDON-K3",
    plant: "K3" as PlantCode,
    line: "PAINT-1",
    shift: "A",
    supervisor: "D. More",
    output: 18,
    outputTarget: 20,
    oee: 76.1,
    scrap: 1.6,
    downtime: 22,
    activeAlerts: 0,
    andonCalls: 0,
    status: "running" as const,
    stations: [
      { name: "Surface Prep", state: "running" as const, operator: "K. Deshmukh" },
      { name: "Paint Booth", state: "running" as const, operator: "K. Deshmukh" },
      { name: "Cure Oven", state: "running" as const, operator: "-" },
      { name: "DFT Check", state: "running" as const, operator: "D. More" },
    ],
  },
  {
    id: "ANDON-R1",
    plant: "R1" as PlantCode,
    line: "TANK-LINE-1",
    shift: "A",
    supervisor: "P. Nair",
    output: 14,
    outputTarget: 16,
    oee: 71.5,
    scrap: 2.1,
    downtime: 41,
    activeAlerts: 1,
    andonCalls: 1,
    status: "running" as const,
    stations: [
      { name: "Plate Cut", state: "running" as const, operator: "V. Kulkarni" },
      { name: "Roll Form", state: "running" as const, operator: "V. Kulkarni" },
      { name: "Sub-Arc", state: "running" as const, operator: "P. Nair" },
      { name: "Leak Test", state: "running" as const, operator: "V. Kulkarni" },
    ],
  },
];

// === Suppliers ===
export const SUPPLIERS: Supplier[] = [
  { id: "SUP-001", name: "Tata Steel", category: "Steel", rating: 94, tier: "A", onTimeDelivery: 96, qualityAcceptance: 98.2, defectPpm: 180, totalOrders: 142, openNCRs: 0, lastDelivery: new Date(NOW - 86400000 * 2).toISOString(), contact: "rm-tata@htr.com", location: "Jamshedpur", trend: [90, 91, 92, 91, 93, 94] },
  { id: "SUP-002", name: "JSW Steel", category: "Steel", rating: 86, tier: "B", onTimeDelivery: 88, qualityAcceptance: 95.1, defectPpm: 490, totalOrders: 88, openNCRs: 1, lastDelivery: new Date(NOW - 86400000 * 5).toISOString(), contact: "rm-jsw@htr.com", location: "Vijayanagar", trend: [88, 87, 85, 86, 85, 86] },
  { id: "SUP-003", name: "Hindustan Zinc", category: "Coating", rating: 91, tier: "A", onTimeDelivery: 93, qualityAcceptance: 99.1, defectPpm: 90, totalOrders: 64, openNCRs: 0, lastDelivery: new Date(NOW - 86400000 * 3).toISOString(), contact: "zn-hzl@htr.com", location: "Udaipur", trend: [88, 89, 90, 90, 91, 91] },
  { id: "SUP-004", name: "Ador Welding", category: "Welding", rating: 82, tier: "B", onTimeDelivery: 85, qualityAcceptance: 94.5, defectPpm: 550, totalOrders: 210, openNCRs: 0, lastDelivery: new Date(NOW - 86400000 * 1).toISOString(), contact: "weld-ador@htr.com", location: "Pune", trend: [80, 81, 82, 81, 82, 82] },
  { id: "SUP-005", name: "Akzo Nobel", category: "Paint", rating: 88, tier: "B", onTimeDelivery: 90, qualityAcceptance: 96.8, defectPpm: 320, totalOrders: 48, openNCRs: 1, lastDelivery: new Date(NOW - 86400000 * 7).toISOString(), contact: "paint-akzo@htr.com", location: "Bangalore", trend: [85, 86, 87, 87, 88, 88] },
  { id: "SUP-006", name: "Binzel", category: "Welding", rating: 79, tier: "C", onTimeDelivery: 78, qualityAcceptance: 92.4, defectPpm: 760, totalOrders: 56, openNCRs: 2, lastDelivery: new Date(NOW - 86400000 * 12).toISOString(), contact: "binzel-india@htr.com", location: "Chennai", trend: [82, 81, 80, 79, 79, 79] },
  { id: "SUP-007", name: "Shell Lubricants", category: "Spare", rating: 92, tier: "A", onTimeDelivery: 95, qualityAcceptance: 99.5, defectPpm: 50, totalOrders: 34, openNCRs: 0, lastDelivery: new Date(NOW - 86400000 * 4).toISOString(), contact: "shell-b2b@htr.com", location: "Mumbai", trend: [90, 91, 91, 92, 92, 92] },
  { id: "SUP-008", name: "SAIL", category: "Steel", rating: 84, tier: "B", onTimeDelivery: 86, qualityAcceptance: 95.8, defectPpm: 420, totalOrders: 72, openNCRs: 0, lastDelivery: new Date(NOW - 86400000 * 6).toISOString(), contact: "sail-rm@htr.com", location: "Bhilai", trend: [85, 84, 83, 84, 84, 84] },
  { id: "SUP-009", name: "3M Abrasives", category: "Spare", rating: 87, tier: "B", onTimeDelivery: 89, qualityAcceptance: 97.2, defectPpm: 280, totalOrders: 41, openNCRs: 0, lastDelivery: new Date(NOW - 86400000 * 8).toISOString(), contact: "3m-india@htr.com", location: "Bangalore", trend: [85, 86, 86, 87, 87, 87] },
  { id: "SUP-010", name: "Lincoln Electric", category: "Welding", rating: 90, tier: "A", onTimeDelivery: 92, qualityAcceptance: 98.4, defectPpm: 160, totalOrders: 68, openNCRs: 0, lastDelivery: new Date(NOW - 86400000 * 3).toISOString(), contact: "lincoln-in@htr.com", location: "Chennai", trend: [87, 88, 89, 89, 90, 90] },
];

// === Audit Trail entries ===
export const AUDIT_TRAIL: AuditEntry[] = [
  { id: "AU-001", timestamp: new Date(NOW - 120000).toISOString(), user: "R. Sharma", role: "IWE Welder", action: "complete", module: "work-orders", entity: "WorkOrder", entityId: "WO-2400", plant: "K1", details: "Work order WO-2400 marked as completed. 40/40 units. Final QC pass.", ipAddress: "10.0.1.42" },
  { id: "AU-002", timestamp: new Date(NOW - 480000).toISOString(), user: "M. Iyer", role: "NACE Inspector", action: "hold", module: "quality", entity: "QualityRecord", entityId: "QC-05802", plant: "K2", details: "DFT reading 68μm below spec (≥70). Unit SN-000012020 held at galvanizing gate.", ipAddress: "10.0.2.18" },
  { id: "AU-003", timestamp: new Date(NOW - 960000).toISOString(), user: "Quality Head", role: "Quality Engineer", action: "create", module: "quality", entity: "NCR", entityId: "NCR-007", plant: "K2", details: "NCR raised for HDG DFT drift. 5 batches quarantined. Severity: critical.", ipAddress: "10.0.0.12" },
  { id: "AU-004", timestamp: new Date(NOW - 1800000).toISOString(), user: "Planner", role: "Planner", action: "release", module: "planning", entity: "WorkOrder", entityId: "WO-2412", plant: "K1", details: "Work order released to FIN-LINE-A. Material reserved. Priority: rush.", ipAddress: "10.0.0.5" },
  { id: "AU-005", timestamp: new Date(NOW - 3600000).toISOString(), user: "S. Jadhav", role: "Maintenance Tech", action: "update", module: "maintenance", entity: "MaintenanceOrder", entityId: "MT-002", plant: "K2", details: "Breakdown MT-002 status updated to in-progress. Fault E104 diagnosis: wire feed motor.", ipAddress: "10.0.2.30" },
  { id: "AU-006", timestamp: new Date(NOW - 7200000).toISOString(), user: "Supervisor", role: "Supervisor", action: "acknowledge", module: "shift-handover", entity: "ShiftHandoverEntry", entityId: "SH-002", plant: "K2", details: "Escalation acknowledged. HDG DFT drift containment action confirmed.", ipAddress: "10.0.0.8" },
  { id: "AU-007", timestamp: new Date(NOW - 10800000).toISOString(), user: "Quality Head", role: "Quality Engineer", action: "approve", module: "documents", entity: "Document", entityId: "DOC-003", details: "SOP-GALV-001 Rev 7 approved. Effective 2026-03-01.", ipAddress: "10.0.0.12" },
  { id: "AU-008", timestamp: new Date(NOW - 14400000).toISOString(), user: "MD Office", role: "Executive", action: "export", module: "overview", entity: "Report", entityId: "SHIFT-RPT-2026-08-26", details: "Shift report exported. Format: PDF. Scope: All plants.", ipAddress: "10.0.0.1" },
  { id: "AU-009", timestamp: new Date(NOW - 18000000).toISOString(), user: "Stores Officer", role: "Supervisor", action: "create", module: "inventory", entity: "InventoryItem", entityId: "INV-001", plant: "K4", details: "Goods receipt: CRCA coil HT-482910 (Tata Steel). 84 MT. Mill cert attached.", ipAddress: "10.0.4.15" },
  { id: "AU-010", timestamp: new Date(NOW - 21600000).toISOString(), user: "Lead Auditor", role: "Quality Engineer", action: "create", module: "quality", entity: "NCR", entityId: "NCR-001", plant: "R1", details: "ISO 3834-2 audit finding raised. Welder cert renewal gap. CAPA opened.", ipAddress: "10.0.0.50" },
  { id: "AU-011", timestamp: new Date(NOW - 28800000).toISOString(), user: "V. Kulkarni", role: "Operator", action: "update", module: "work-orders", entity: "WorkOrder", entityId: "WO-2405", plant: "R1", details: "Scrap captured: 2 units. Reason: sub-arc weld discontinuity. Routed to rework.", ipAddress: "10.0.5.22" },
  { id: "AU-012", timestamp: new Date(NOW - 43200000).toISOString(), user: "HR Manager", role: "Executive", action: "update", module: "workforce", entity: "Operator", entityId: "OP-006", plant: "R1", details: "Operator P. Nair cert expiry alert configured. 60/30/7 day reminders enabled.", ipAddress: "10.0.0.3" },
  { id: "AU-013", timestamp: new Date(NOW - 57600000).toISOString(), user: "Calibration Cell", role: "Maintenance", action: "complete", module: "maintenance", entity: "MaintenanceOrder", entityId: "MT-006", plant: "K3", details: "DFT gauge calibration completed. Cert CAL-2026-084 issued. Due 2027-08.", ipAddress: "10.0.3.11" },
  { id: "AU-014", timestamp: new Date(NOW - 72000000).toISOString(), user: "System", role: "System", action: "login", module: "overview", entity: "Session", entityId: "SES-4821", details: "User login: R. Sharma (IWE Welder) from 10.0.1.42. Session established.", ipAddress: "10.0.1.42" },
  { id: "AU-015", timestamp: new Date(NOW - 86400000).toISOString(), user: "Quality Head", role: "Quality Engineer", action: "complete", module: "quality", entity: "NCR", entityId: "NCR-004", plant: "R1", details: "NCR-004 closed. CAPA verified. Root cause addressed. Weld rework + servo recalibration.", ipAddress: "10.0.0.12" },
];

// === Customer Orders ===
export const CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: "CO-001", customer: "Siemens Energy", orderNo: "SO-08100", product: "Radiator-FN-2500", qty: 40, dispatchedQty: 0,
    status: "in-production", poDate: "2026-08-10", promisedDate: "2026-08-28", deliveryLocation: "Kalwa Works, Mumbai", endTransformer: "TR-765kV-Kalwa",
    serials: ["SN-000012100", "SN-000012101", "SN-000012102", "SN-000012103"],
    documentation: [
      { label: "Material Certificate", status: "ready" },
      { label: "Welding Procedure (WPS)", status: "ready" },
      { label: "Welder Qualification", status: "ready" },
      { label: "HDG Coating Certificate", status: "pending" },
      { label: "Paint DFT Report", status: "pending" },
      { label: "Leak Test Certificate", status: "ready" },
      { label: "Final QC Report", status: "pending" },
      { label: "Packing List", status: "n/a" },
    ],
  },
  {
    id: "CO-002", customer: "ABB Power Grids", orderNo: "SO-08101", product: "Tank-CW-4500", qty: 18, dispatchedQty: 0,
    status: "in-production", poDate: "2026-08-08", promisedDate: "2026-09-05", deliveryLocation: "Savli Works, Vadodara", endTransformer: "TR-400kV-Savli",
    serials: ["SN-000012110", "SN-000012111"],
    documentation: [
      { label: "Material Certificate", status: "ready" },
      { label: "Welding Procedure (WPS)", status: "ready" },
      { label: "Welder Qualification", status: "ready" },
      { label: "HDG Coating Certificate", status: "pending" },
      { label: "Paint DFT Report", status: "n/a" },
      { label: "Leak Test Certificate", status: "pending" },
      { label: "Final QC Report", status: "pending" },
      { label: "Packing List", status: "n/a" },
    ],
  },
  {
    id: "CO-003", customer: "GE Grid Solutions", orderNo: "SO-08098", product: "Radiator-FN-3200", qty: 60, dispatchedQty: 60,
    status: "dispatched", poDate: "2026-07-15", promisedDate: "2026-08-20", dispatchedDate: "2026-08-19", deliveryLocation: "Hosur Works, TN", endTransformer: "TR-765kV-Hosur",
    serials: ["SN-000011950", "SN-000011951", "SN-000011952"],
    documentation: [
      { label: "Material Certificate", status: "ready" },
      { label: "Welding Procedure (WPS)", status: "ready" },
      { label: "Welder Qualification", status: "ready" },
      { label: "HDG Coating Certificate", status: "ready" },
      { label: "Paint DFT Report", status: "ready" },
      { label: "Leak Test Certificate", status: "ready" },
      { label: "Final QC Report", status: "ready" },
      { label: "Packing List", status: "ready" },
    ],
  },
  {
    id: "CO-004", customer: "Hitachi Energy", orderNo: "SO-08102", product: "Tank-FW-3800", qty: 12, dispatchedQty: 0,
    status: "qc-pending", poDate: "2026-08-05", promisedDate: "2026-09-10", deliveryLocation: "Kadapra, Kerala", endTransformer: "TR-220kV-Kadapra",
    serials: ["SN-000012120"],
    documentation: [
      { label: "Material Certificate", status: "ready" },
      { label: "Welding Procedure (WPS)", status: "ready" },
      { label: "Welder Qualification", status: "ready" },
      { label: "HDG Coating Certificate", status: "ready" },
      { label: "Paint DFT Report", status: "ready" },
      { label: "Leak Test Certificate", status: "ready" },
      { label: "Final QC Report", status: "pending" },
      { label: "Packing List", status: "n/a" },
    ],
  },
  {
    id: "CO-005", customer: "Toshiba T&D", orderNo: "SO-08103", product: "Radiator-PC-1800", qty: 80, dispatchedQty: 0,
    status: "ready-to-ship", poDate: "2026-07-28", promisedDate: "2026-08-26", deliveryLocation: "Hyderabad", endTransformer: "TR-132kV-HYD",
    serials: ["SN-000012130", "SN-000012131", "SN-000012132", "SN-000012133", "SN-000012134"],
    documentation: [
      { label: "Material Certificate", status: "ready" },
      { label: "Welding Procedure (WPS)", status: "ready" },
      { label: "Welder Qualification", status: "ready" },
      { label: "HDG Coating Certificate", status: "ready" },
      { label: "Paint DFT Report", status: "ready" },
      { label: "Leak Test Certificate", status: "ready" },
      { label: "Final QC Report", status: "ready" },
      { label: "Packing List", status: "pending" },
    ],
  },
  {
    id: "CO-006", customer: "CG Power", orderNo: "SO-08099", product: "Tank-CW-5200", qty: 8, dispatchedQty: 8,
    status: "delivered", poDate: "2026-07-01", promisedDate: "2026-08-10", dispatchedDate: "2026-08-08", deliveryLocation: "Bhopal", endTransformer: "TR-220kV-Bhopal",
    serials: ["SN-000011940"],
    documentation: [
      { label: "Material Certificate", status: "ready" },
      { label: "Welding Procedure (WPS)", status: "ready" },
      { label: "Welder Qualification", status: "ready" },
      { label: "HDG Coating Certificate", status: "ready" },
      { label: "Paint DFT Report", status: "ready" },
      { label: "Leak Test Certificate", status: "ready" },
      { label: "Final QC Report", status: "ready" },
      { label: "Packing List", status: "ready" },
    ],
  },
];

// === KPI Breakdown data (for drill-down) ===
export const KPI_BREAKDOWNS: Record<string, KPIBreakdown[]> = {
  "Overall OEE": [
    { label: "K1 - Fin Line A", value: 74.2, unit: "%", contribution: 20.4, trend: 2.1, children: [
      { label: "Shear", value: 84 }, { label: "Former", value: 78 }, { label: "Welder", value: 71 }, { label: "Leak Test", value: 89 },
    ]},
    { label: "K2 - HDG Line", value: 68.7, unit: "%", contribution: 18.9, trend: -1.2, children: [
      { label: "Pre-clean", value: 91 }, { label: "Kettle", value: 82 }, { label: "DFT", value: 79 }, { label: "Quench", value: 0 },
    ]},
    { label: "K3 - Paint Line", value: 76.1, unit: "%", contribution: 21.0, trend: 1.8, children: [
      { label: "Surface Prep", value: 79 }, { label: "Booth", value: 79 }, { label: "Oven", value: 85 }, { label: "DFT", value: 87 },
    ]},
    { label: "R1 - Tank Line", value: 71.5, unit: "%", contribution: 19.7, trend: 0.9, children: [
      { label: "Cut", value: 86 }, { label: "Roll", value: 84 }, { label: "Sub-Arc", value: 74 }, { label: "Test", value: 68 },
    ]},
  ],
  "On-Time Dispatch": [
    { label: "K1", value: 89.1, unit: "%", contribution: 24.2, trend: 3.4 },
    { label: "K2", value: 84.2, unit: "%", contribution: 22.9, trend: -1.8 },
    { label: "K3", value: 91.4, unit: "%", contribution: 24.8, trend: 2.1 },
    { label: "R1", value: 86.8, unit: "%", contribution: 23.6, trend: 1.2 },
  ],
  "First-Pass Yield": [
    { label: "Cutting", value: 98.2, unit: "%", contribution: 13.5, trend: 0.4 },
    { label: "Welding", value: 94.1, unit: "%", contribution: 12.9, trend: -1.2 },
    { label: "Leak Test", value: 96.8, unit: "%", contribution: 13.3, trend: 0.2 },
    { label: "Galvanizing", value: 92.3, unit: "%", contribution: 12.7, trend: -2.1 },
    { label: "Painting", value: 96.4, unit: "%", contribution: 13.2, trend: 1.1 },
    { label: "Final QC", value: 91.8, unit: "%", contribution: 12.6, trend: -0.8 },
  ],
  "Scrap Rate": [
    { label: "Welding defects", value: 0.9, unit: "%", contribution: 42.8, trend: 0.1 },
    { label: "Galvanizing DFT", value: 0.6, unit: "%", contribution: 28.6, trend: 0.2 },
    { label: "Dimensional", value: 0.3, unit: "%", contribution: 14.3, trend: -0.1 },
    { label: "Handling damage", value: 0.2, unit: "%", contribution: 9.5, trend: 0 },
    { label: "Other", value: 0.1, unit: "%", contribution: 4.8, trend: 0 },
  ],
};

// === Shipments / Dispatch ===
export const SHIPMENTS: Shipment[] = [
  {
    id: "SHP-001", manifestNo: "MN-2026-0842", customer: "GE Grid Solutions", orderNo: "SO-08098",
    plant: "K1", destination: "Hosur Works, Tamil Nadu", carrier: "VRL Logistics", vehicleNo: "MH-04-AB-2842",
    driver: "R. Yadav", lrNo: "LR-VRL-48210", status: "in-transit", units: 60, weight: 18.5, value: 42.8,
    loadingDate: new Date(NOW - 86400000).toISOString(), eta: new Date(NOW + 86400000 * 0.5).toISOString(),
    documents: [
      { label: "Packing List", status: "ready" }, { label: "Invoice", status: "ready" },
      { label: "Material Cert", status: "ready" }, { label: "QC Dossier", status: "ready" },
      { label: "Coating Cert", status: "ready" }, { label: "Leak Test Cert", status: "ready" },
      { label: "Lorry Receipt", status: "ready" }, { label: "E-Way Bill", status: "ready" },
    ],
    coordinates: { lat: 19.0760, lng: 72.8777, progress: 62 },
  },
  {
    id: "SHP-002", manifestNo: "MN-2026-0843", customer: "Toshiba T&D", orderNo: "SO-08103",
    plant: "K2", destination: "Hyderabad", carrier: "Transport Corp of India", vehicleNo: "MH-04-CD-1188",
    driver: "S. Kumar", lrNo: "LR-TCI-91034", status: "loading", units: 80, weight: 24.2, value: 58.4,
    loadingDate: new Date(NOW).toISOString(), eta: new Date(NOW + 86400000 * 3).toISOString(),
    documents: [
      { label: "Packing List", status: "pending" }, { label: "Invoice", status: "ready" },
      { label: "Material Cert", status: "ready" }, { label: "QC Dossier", status: "pending" },
      { label: "Coating Cert", status: "ready" }, { label: "Leak Test Cert", status: "ready" },
      { label: "Lorry Receipt", status: "pending" }, { label: "E-Way Bill", status: "pending" },
    ],
  },
  {
    id: "SHP-003", manifestNo: "MN-2026-0841", customer: "CG Power", orderNo: "SO-08099",
    plant: "R1", destination: "Bhopal", carrier: "Blue Dart Logistics", vehicleNo: "MH-04-EF-0042",
    driver: "A. Singh", lrNo: "LR-BD-77821", status: "delivered", units: 8, weight: 12.8, value: 28.6,
    loadingDate: new Date(NOW - 86400000 * 4).toISOString(),
    eta: new Date(NOW - 86400000 * 2).toISOString(),
    deliveredDate: new Date(NOW - 86400000 * 2).toISOString(),
    documents: [
      { label: "Packing List", status: "ready" }, { label: "Invoice", status: "ready" },
      { label: "Material Cert", status: "ready" }, { label: "QC Dossier", status: "ready" },
      { label: "Coating Cert", status: "ready" }, { label: "Leak Test Cert", status: "ready" },
      { label: "Lorry Receipt", status: "ready" }, { label: "E-Way Bill", status: "ready" },
      { label: "POD", status: "ready" },
    ],
    coordinates: { lat: 23.2599, lng: 77.4126, progress: 100 },
  },
  {
    id: "SHP-004", manifestNo: "MN-2026-0844", customer: "ABB Power Grids", orderNo: "SO-08101",
    plant: "R1", destination: "Savli Works, Vadodara", carrier: "DHL Supply Chain", vehicleNo: "MH-04-GH-5571",
    driver: "M. Patel", lrNo: "LR-DHL-33420", status: "scheduled", units: 18, weight: 28.4, value: 64.2,
    loadingDate: new Date(NOW + 86400000 * 4).toISOString(),
    eta: new Date(NOW + 86400000 * 5).toISOString(),
    documents: [
      { label: "Packing List", status: "pending" }, { label: "Invoice", status: "pending" },
      { label: "Material Cert", status: "ready" }, { label: "QC Dossier", status: "pending" },
      { label: "Coating Cert", status: "pending" }, { label: "Leak Test Cert", status: "pending" },
      { label: "Lorry Receipt", status: "pending" }, { label: "E-Way Bill", status: "pending" },
    ],
  },
  {
    id: "SHP-005", manifestNo: "MN-2026-0840", customer: "Siemens Energy", orderNo: "SO-08092",
    plant: "K3", destination: "Kalwa Works, Mumbai", carrier: "Agarwal Packers", vehicleNo: "MH-04-IJ-9920",
    driver: "K. Rao", lrNo: "LR-AP-18290", status: "delayed", units: 24, weight: 8.2, value: 18.4,
    loadingDate: new Date(NOW - 86400000 * 2).toISOString(),
    eta: new Date(NOW - 86400000).toISOString(),
    documents: [
      { label: "Packing List", status: "ready" }, { label: "Invoice", status: "ready" },
      { label: "Material Cert", status: "ready" }, { label: "QC Dossier", status: "ready" },
      { label: "Coating Cert", status: "ready" }, { label: "Leak Test Cert", status: "ready" },
      { label: "Lorry Receipt", status: "ready" }, { label: "E-Way Bill", status: "ready" },
    ],
    coordinates: { lat: 19.6830, lng: 73.0640, progress: 85 },
  },
  {
    id: "SHP-006", manifestNo: "MN-2026-0839", customer: "Hitachi Energy", orderNo: "SO-08102",
    plant: "K1", destination: "Kadapra, Kerala", carrier: "Safe Express", vehicleNo: "MH-04-KL-3318",
    driver: "T. Joseph", lrNo: "LR-SF-55671", status: "in-transit", units: 12, weight: 6.4, value: 22.8,
    loadingDate: new Date(NOW - 86400000 * 1.5).toISOString(),
    eta: new Date(NOW + 86400000 * 1.5).toISOString(),
    documents: [
      { label: "Packing List", status: "ready" }, { label: "Invoice", status: "ready" },
      { label: "Material Cert", status: "ready" }, { label: "QC Dossier", status: "ready" },
      { label: "Coating Cert", status: "ready" }, { label: "Leak Test Cert", status: "ready" },
      { label: "Lorry Receipt", status: "ready" }, { label: "E-Way Bill", status: "ready" },
    ],
    coordinates: { lat: 13.0827, lng: 80.2707, progress: 38 },
  },
];

// === Calibration items ===
export const CALIBRATION_ITEMS: CalibrationItem[] = [
  { id: "CAL-001", instrument: "DFT Gauge - Elcometer 456", tag: "DFT-K3-001", plant: "K3", location: "Paint Booth 1", type: "Coating Thickness", range: "0-2000 μm", accuracy: "±2%", lastCalibrated: "2026-02-10", nextDue: "2027-02-10", frequency: "12 months", status: "valid", certNo: "CAL-2026-084", vendor: "Elcometer India", criticality: "critical" },
  { id: "CAL-002", instrument: "DFT Gauge - PosiTector 6000", tag: "DFT-K2-002", plant: "K2", location: "HDG-2 DFT Station", type: "Coating Thickness", range: "0-3000 μm", accuracy: "±1%", lastCalibrated: "2026-02-15", nextDue: "2027-02-15", frequency: "12 months", status: "valid", certNo: "CAL-2026-085", vendor: "DeFelsko", criticality: "critical" },
  { id: "CAL-003", instrument: "Thermocouple Type-K", tag: "TC-K2-001", plant: "K2", location: "HDG Kettle", type: "Temperature", range: "0-1200°C", accuracy: "±2°C", lastCalibrated: "2026-01-20", nextDue: "2026-07-20", frequency: "6 months", status: "valid", certNo: "CAL-2026-041", vendor: "Omega Eng.", criticality: "critical" },
  { id: "CAL-004", instrument: "Pressure Gauge - Bourdon", tag: "PG-K1-001", plant: "K1", location: "Leak Test Rig 1", type: "Pressure", range: "0-10 bar", accuracy: "±0.5%", lastCalibrated: "2025-08-25", nextDue: "2026-08-25", frequency: "12 months", status: "due-soon", certNo: "CAL-2025-182", vendor: "Wika India", criticality: "critical" },
  { id: "CAL-005", instrument: "CMM - Coordinate Measuring", tag: "CMM-K1-001", plant: "K1", location: "QC Lab", type: "Dimensional", range: "500×500×500mm", accuracy: "±5 μm", lastCalibrated: "2025-12-10", nextDue: "2026-06-10", frequency: "6 months", status: "valid", certNo: "CAL-2025-220", vendor: "Mitutoyo", criticality: "critical" },
  { id: "CAL-006", instrument: "Micrometer 0-25mm", tag: "MIC-K1-001", plant: "K1", location: "Tool Room", type: "Dimensional", range: "0-25mm", accuracy: "±1 μm", lastCalibrated: "2025-09-15", nextDue: "2026-09-15", frequency: "12 months", status: "valid", certNo: "CAL-2025-195", vendor: "Mitutoyo", criticality: "major" },
  { id: "CAL-007", instrument: "Weld Current Monitor", tag: "WCM-K1-001", plant: "K1", location: "Seam Welder 1", type: "Electrical", range: "0-500A", accuracy: "±1%", lastCalibrated: "2025-07-20", nextDue: "2026-01-20", frequency: "6 months", status: "overdue", certNo: "CAL-2025-160", vendor: "Ador Welding", criticality: "critical" },
  { id: "CAL-008", instrument: "Pyrometer - Infrared", tag: "PYR-K2-001", plant: "K2", location: "HDG Kettle", type: "Temperature", range: "200-1000°C", accuracy: "±3°C", lastCalibrated: "2026-03-05", nextDue: "2026-09-05", frequency: "6 months", status: "valid", certNo: "CAL-2026-092", vendor: "Fluke", criticality: "critical" },
  { id: "CAL-009", instrument: "Surface Roughness Tester", tag: "SRT-K3-001", plant: "K3", location: "Surface Prep", type: "Surface", range: "Ra 0-50μm", accuracy: "±5%", lastCalibrated: "2025-11-10", nextDue: "2026-11-10", frequency: "12 months", status: "valid", certNo: "CAL-2025-240", vendor: "Taylor Hobson", criticality: "minor" },
  { id: "CAL-010", instrument: "Torque Wrench 10-200Nm", tag: "TW-R1-001", plant: "R1", location: "Assembly", type: "Torque", range: "10-200Nm", accuracy: "±4%", lastCalibrated: "2025-10-05", nextDue: "2026-10-05", frequency: "12 months", status: "valid", certNo: "CAL-2025-215", vendor: "Norbar", criticality: "major" },
  { id: "CAL-011", instrument: "Ultrasonic Thickness Gauge", tag: "UTG-K4-001", plant: "K4", location: "Inspection Lab", type: "Thickness", range: "0.5-500mm", accuracy: "±0.1mm", lastCalibrated: "2025-06-20", nextDue: "2026-06-20", frequency: "12 months", status: "due-soon", certNo: "CAL-2025-142", vendor: "Olympus", criticality: "major" },
  { id: "CAL-012", instrument: "Hardness Tester - Rockwell", tag: "HT-K4-001", plant: "K4", location: "Met Lab", type: "Hardness", range: "20-70 HRC", accuracy: "±1 HRC", lastCalibrated: "2025-12-01", nextDue: "2026-12-01", frequency: "12 months", status: "valid", certNo: "CAL-2025-225", vendor: "Wilson", criticality: "major" },
  { id: "CAL-013", instrument: "DFT Gauge - Elcometer 456", tag: "DFT-K3-002", plant: "K3", location: "Paint Booth 2", type: "Coating Thickness", range: "0-2000 μm", accuracy: "±2%", lastCalibrated: "2025-08-01", nextDue: "2026-08-01", frequency: "12 months", status: "in-progress", certNo: "CAL-2025-178", vendor: "Elcometer India", criticality: "critical" },
  { id: "CAL-014", instrument: "Caliper 0-300mm", tag: "CLP-R1-001", plant: "R1", location: "Tank QC", type: "Dimensional", range: "0-300mm", accuracy: "±0.02mm", lastCalibrated: "2025-09-20", nextDue: "2026-09-20", frequency: "12 months", status: "valid", certNo: "CAL-2025-200", vendor: "Mitutoyo", criticality: "minor" },
];

// === Cost of Quality items ===
export const COST_OF_QUALITY: CostOfQualityItem[] = [
  // Prevention
  { id: "COQ-001", category: "prevention", description: "Quality training - IWE/NACE/FROSIO refresh", plant: "K1", amount: 4.2, period: "Aug 2026", trend: -0.8, details: "12 welders and 4 inspectors trained in Aug" },
  { id: "COQ-002", category: "prevention", description: "SPC implementation - HDG DFT control", plant: "K2", amount: 2.8, period: "Aug 2026", trend: 0.5, details: "New SPC charts deployed on HDG-2" },
  { id: "COQ-003", category: "prevention", description: "Calibration program - instruments", plant: "K4", amount: 3.5, period: "Aug 2026", trend: -0.3, details: "14 instruments calibrated this month" },
  { id: "COQ-004", category: "prevention", description: "Supplier audit - Tata Steel, JSW", plant: "K4", amount: 1.2, period: "Aug 2026", trend: 0, details: "2 supplier audits completed" },
  { id: "COQ-005", category: "prevention", description: "Preventive maintenance - quality instruments", plant: "K1", amount: 1.8, period: "Aug 2026", trend: 0.2 },
  // Appraisal
  { id: "COQ-006", category: "appraisal", description: "Incoming inspection - steel coils", plant: "K4", amount: 5.4, period: "Aug 2026", trend: 0.6, details: "84 MT inspected, 100% coverage" },
  { id: "COQ-007", category: "appraisal", description: "In-process inspection - welding, HDG, paint", plant: "K1", amount: 8.2, period: "Aug 2026", trend: -1.2, details: "40+ inspection records this month" },
  { id: "COQ-008", category: "appraisal", description: "Final QC + leak/pressure test", plant: "R1", amount: 6.8, period: "Aug 2026", trend: 0.3 },
  { id: "COQ-009", category: "appraisal", description: "Third-party inspection (TUV Nord)", plant: "K2", amount: 4.5, period: "Aug 2026", trend: 0, details: "ISO 3834-2 surveillance audit" },
  { id: "COQ-010", category: "appraisal", description: "DFT gauge calibration + certs", plant: "K3", amount: 1.4, period: "Aug 2026", trend: -0.2 },
  // Internal failure
  { id: "COQ-011", category: "internal-failure", description: "Scrap - welding defects (porosity)", plant: "K1", amount: 12.4, period: "Aug 2026", trend: 2.1, details: "3 units scrapped (NCR-008)" },
  { id: "COQ-012", category: "internal-failure", description: "Rework - HDG DFT rework", plant: "K2", amount: 18.6, period: "Aug 2026", trend: 4.2, details: "5 batches re-galvanized (NCR-007)" },
  { id: "COQ-013", category: "internal-failure", description: "Rework - paint pinhole repair", plant: "K3", amount: 6.2, period: "Aug 2026", trend: -0.8, details: "4 units reworked (NCR-006)" },
  { id: "COQ-014", category: "internal-failure", description: "Scrap - dimensional deviation", plant: "K1", amount: 8.8, period: "Aug 2026", trend: 1.5, details: "2 units scrapped (NCR-005)" },
  { id: "COQ-015", category: "internal-failure", description: "Downtime - quality holds", plant: "K2", amount: 9.4, period: "Aug 2026", trend: 2.8 },
  // External failure
  { id: "COQ-016", category: "external-failure", description: "Customer claim - ABB fin pitch", plant: "K1", amount: 14.2, period: "Aug 2026", trend: 5.4, details: "2 units reworked at site (NCR-005)" },
  { id: "COQ-017", category: "external-failure", description: "Warranty - Toshiba paint color", plant: "K3", amount: 6.8, period: "Aug 2026", trend: -1.2, details: "2 units repainted (NCR-002)" },
  { id: "COQ-018", category: "external-failure", description: "Field service - leak repair", plant: "R1", amount: 4.2, period: "Aug 2026", trend: 0.8 },
];

// === Root Cause Analysis (5-Whys) ===
export const ROOT_CAUSES: RootCauseAnalysis[] = [
  {
    id: "RCA-001",
    title: "HDG DFT below spec - HDG-2 K2",
    problem: "Last 5 batches on HDG-2 kettle showed coating DFT trending 72→68 μm against spec ≥70 μm. 28 units affected. NCR-007 raised.",
    ncrRef: "NCR-007",
    plant: "K2",
    stage: "Galvanizing",
    facilitator: "Quality Head",
    participants: ["M. Iyer", "S. Jadhav", "Process Eng.", "HDG Operator"],
    date: new Date(NOW - 86400000 * 2).toISOString(),
    status: "verified",
    rootCause: "Zinc bath iron (Fe) content exceeded 0.8% threshold due to insufficient dross removal - bath maintenance frequency based on calendar instead of usage.",
    whys: [
      { question: "Why is DFT below spec?", answer: "Zinc coating thickness insufficient on last 5 batches" },
      { question: "Why is zinc coating insufficient?", answer: "Bath chemistry drifted - Fe content rising, Zn purity dropping" },
      { question: "Why did bath chemistry drift?", answer: "Dross accumulation not removed on schedule" },
      { question: "Why was dross not removed on schedule?", answer: "Maintenance calendar was weekly regardless of throughput" },
      { question: "Why was maintenance calendar-based not usage-based?", answer: "No usage counter integrated to PM trigger system" },
    ],
    correctiveAction: "Remove dross immediately, refresh bath to 99.995% Zn, re-galvanize 5 batches with +0.5min dwell.",
    preventiveAction: "Migrate PM trigger to usage-based (every 80 MT galvanized). Add inline Fe% monitor with alarm at 0.6%. Update SOP-GALV-001 Rev 8.",
    owner: "Process Engineering + Maintenance",
    dueDate: new Date(NOW + 86400000 * 14).toISOString(),
    effectiveness: "effective",
  },
  {
    id: "RCA-002",
    title: "Weld porosity - Seam Weld K1",
    problem: "3 units (SN-12004-006) failed visual + radiographic inspection due to surface porosity on seam weld. WPS-RAD-100 Rev 4 followed. NCR-008 raised.",
    ncrRef: "NCR-008",
    plant: "K1",
    stage: "Welding",
    facilitator: "Quality Head",
    participants: ["R. Sharma", "Welding Supervisor", "Maintenance"],
    date: new Date(NOW - 86400000).toISOString(),
    status: "in-progress",
    rootCause: "Shielding gas moisture contamination - gas dryer cartridge saturated and not replaced on schedule.",
    whys: [
      { question: "Why did welds show porosity?", answer: "Gas shielding was contaminated with moisture" },
      { question: "Why was shielding gas moist?", answer: "Gas dryer cartridge saturated" },
      { question: "Why was cartridge saturated?", answer: "Replacement interval extended beyond spec (90→120 days)" },
      { question: "Why was interval extended?", answer: "Spare cartridges out of stock for 18 days" },
      { question: "Why were spares out of stock?", answer: "Reorder trigger set at 0 stock instead of safety level 5" },
    ],
    correctiveAction: "Replace cartridge immediately, re-weld 3 affected units, re-test. Inspect all welds from last 24h.",
    preventiveAction: "Set reorder trigger at 5 cartridges (safety stock). Add humidity sensor on gas line with alarm. Update SOP to replace cartridge every 60 days max.",
    owner: "Welding Supervisor + Stores",
    dueDate: new Date(NOW + 86400000 * 7).toISOString(),
    effectiveness: "pending",
  },
  {
    id: "RCA-003",
    title: "Dimensional deviation - fin pitch K1",
    problem: "Customer (ABB) reported fin pitch out of tolerance on 2 radiators (SN-11980, SN-11981). ±0.5mm spec exceeded by 0.8mm. NCR-005.",
    ncrRef: "NCR-005",
    plant: "K1",
    stage: "Forming",
    facilitator: "Quality Head",
    participants: ["A. Patil", "Process Eng.", "Maintenance"],
    date: new Date(NOW - 86400000 * 4).toISOString(),
    status: "closed",
    rootCause: "Fin former roll #2 worn beyond tolerance - last calibration overdue by 18 days due to calendar tracking gap.",
    whys: [
      { question: "Why was fin pitch out of spec?", answer: "Fin former roll #2 worn beyond tolerance" },
      { question: "Why was roll worn?", answer: "Exceeded service life without replacement" },
      { question: "Why wasn't it replaced on time?", answer: "Calibration overdue by 18 days" },
      { question: "Why was calibration overdue?", answer: "Calendar tracking via spreadsheet - manual reminder missed" },
      { question: "Why was reminder missed?", answer: "Owner on leave, no backup reminder configured" },
    ],
    correctiveAction: "Replaced roll #2. Reworked 2 affected units. Added inline CMM check at forming station.",
    preventiveAction: "Migrate calibration tracking to MES (Calibration Calendar module). Auto-alerts at 60/30/7 days. Monthly calibration instead of quarterly for forming rolls.",
    owner: "Process Engineering",
    dueDate: new Date(NOW - 86400000 * 2).toISOString(),
    effectiveness: "effective",
  },
  {
    id: "RCA-004",
    title: "Leak test failure - Tank CW-4500 R1",
    problem: "Pressure decay 0.4 bar over 240s (spec ≤ 0.2 bar). Sub-arc weld discontinuity at corner joint. NCR-004.",
    ncrRef: "NCR-004",
    plant: "R1",
    stage: "Leak Test",
    facilitator: "Quality Head",
    participants: ["V. Kulkarni", "P. Nair", "Maintenance"],
    date: new Date(NOW - 86400000 * 6).toISOString(),
    status: "closed",
    rootCause: "Sub-arc welder wire feed servo drift causing inconsistent deposition at corner joints.",
    whys: [
      { question: "Why did tank leak?", answer: "Weld discontinuity at corner joint" },
      { question: "Why was there weld discontinuity?", answer: "Inconsistent weld deposition" },
      { question: "Why was deposition inconsistent?", answer: "Wire feed speed fluctuated during weld" },
      { question: "Why did wire feed fluctuate?", answer: "Servo motor calibration drifted over time" },
      { question: "Why wasn't drift detected?", answer: "No real-time current/speed monitor alarm on M-R1-002" },
    ],
    correctiveAction: "Reworked weld, re-tested PASS. Recalibrated wire feed servo.",
    preventiveAction: "Add real-time current + wire speed monitor with alarm on M-R1-002. Monthly servo calibration check. Update WPS to include corner-joint-specific parameters.",
    owner: "Maintenance + Process Eng.",
    dueDate: new Date(NOW - 86400000 * 1).toISOString(),
    effectiveness: "effective",
  },
];

// === Production Forecast scenarios ===
export const FORECAST_SCENARIOS: ForecastScenario[] = [
  {
    id: "FC-001",
    name: "Baseline - Current Trajectory",
    description: "Forecast based on current OEE, schedule, and material availability. No major disruptions assumed.",
    horizon: "Next 14 days",
    confidence: 78,
    points: Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(NOW); d.setDate(d.getDate() + i + 1);
      return {
        date: d.toISOString().split("T")[0],
        planned: 320 + Math.round(Math.sin(i / 3) * 20),
        projected: 298 + Math.round(Math.sin(i / 3) * 18),
        capacity: 380,
        actual: i < 2 ? 305 + Math.round(Math.sin(i / 3) * 15) : undefined,
      };
    }),
    assumptions: [
      "Current OEE (72.4%) sustained",
      "No unplanned machine downtime > 4 hours",
      "Material availability per current schedule",
      "Single shift operation (Shift A + B)",
    ],
    risks: [
      { description: "HDG-2 bath maintenance PM (Day 3)", impact: "medium", probability: 85 },
      { description: "Robot Welder 2 breakdown recurrence", impact: "high", probability: 25 },
      { description: "Tata Steel coil delivery delay", impact: "medium", probability: 15 },
      { description: "IWE cert expiry (P. Nair) affecting R1", impact: "high", probability: 100 },
    ],
  },
  {
    id: "FC-002",
    name: "Optimistic - OEE +5%",
    description: "If OEE improves to 77% via bottleneck relief and minor process tuning. Requires HDG DFT issue resolution.",
    horizon: "Next 14 days",
    confidence: 62,
    points: Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(NOW); d.setDate(d.getDate() + i + 1);
      return {
        date: d.toISOString().split("T")[0],
        planned: 340 + Math.round(Math.sin(i / 3) * 22),
        projected: 332 + Math.round(Math.sin(i / 3) * 20),
        capacity: 380,
      };
    }),
    assumptions: [
      "OEE improves to 77% (+5%)",
      "HDG DFT issue resolved (NCR-007 closed)",
      "Bottleneck (Seam Welder) relieved via parameter tuning",
      "Operator productivity +3%",
    ],
    risks: [
      { description: "HDG DFT root cause not fully resolved", impact: "high", probability: 30 },
      { description: "Operator fatigue on extended shifts", impact: "low", probability: 40 },
    ],
  },
  {
    id: "FC-003",
    name: "Pessimistic - Robot Welder Down",
    description: "If Robot Welder 2 remains down beyond Day 5, impacting K2 HDG feed. Conservative scenario.",
    horizon: "Next 14 days",
    confidence: 71,
    points: Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(NOW); d.setDate(d.getDate() + i + 1);
      return {
        date: d.toISOString().split("T")[0],
        planned: 280 + Math.round(Math.sin(i / 3) * 18),
        projected: 262 + Math.round(Math.sin(i / 3) * 15),
        capacity: 380,
      };
    }),
    assumptions: [
      "Robot Welder 2 down through Day 7",
      "K2 throughput reduced 30%",
      "Rerouted capacity to K1 where possible",
      "OEE drops to 68%",
    ],
    risks: [
      { description: "Robot Welder 2 spare part lead time", impact: "high", probability: 60 },
      { description: "Customer order delays (Toshiba, Hitachi)", impact: "high", probability: 80 },
      { description: "Expediting costs for spare parts", impact: "medium", probability: 70 },
    ],
  },
];

// === WIP Aging items ===
const wipProducts = ["Radiator-FN-2500", "Tank-CW-4500", "Radiator-FN-3200", "Tank-FW-3800", "Radiator-PC-1800"];
const wipStages = ["Cutting", "Forming", "Welding", "Leak Test", "Galvanizing", "Painting", "Assembly", "Final QC"];
const wipCustomers = ["ABB Power Grids", "Siemens Energy", "GE Grid Sol.", "Hitachi Energy", "Toshiba T&D", "CG Power"];

function getAgeBucket(hours: number): WIPItem["ageBucket"] {
  if (hours < 4) return "fresh";
  if (hours < 12) return "normal";
  if (hours < 24) return "aging";
  if (hours < 48) return "stale";
  return "critical";
}

export const WIP_ITEMS: WIPItem[] = Array.from({ length: 36 }).map((_, i) => {
  const ageHours = Math.floor(rand(1, 61));
  const bucket = getAgeBucket(ageHours);
  const status: WIPItem["status"] = bucket === "critical" ? (srand() > 0.5 ? "blocked" : "hold") :
                 bucket === "stale" ? (srand() > 0.5 ? "waiting" : "blocked") :
                 bucket === "aging" ? "waiting" : "moving";
  const enterDate = new Date(NOW - ageHours * 3600000);
  const dueDate = new Date(NOW + Math.floor(rand(0, 14)) * 86400000);
  const plant = (["K1", "K2", "K3", "R1"] as PlantCode[])[Math.floor(srand() * 4)];
  return {
    id: `WIP-${String(5001 + i).padStart(4, "0")}`,
    serial: `SN-${String(13000 + i).padStart(6, "0")}`,
    product: wipProducts[i % wipProducts.length],
    plant,
    line: ["FIN-LINE-A", "HDG-2", "PAINT-1", "TANK-LINE-1"][i % 4],
    stage: wipStages[i % wipStages.length],
    qty: Math.floor(rand(5, 45)),
    enterStage: enterDate.toISOString(),
    ageHours,
    ageBucket: bucket,
    status,
    workOrder: `WO-${String(2400 + Math.floor(i / 2)).padStart(4, "0")}`,
    customer: wipCustomers[i % wipCustomers.length],
    dueDate: dueDate.toISOString(),
    bottleneckReason: status === "blocked" ? (srand() > 0.5 ? "Material shortage - awaiting coil" : "Quality hold - NCR pending") :
                       status === "hold" ? "Quality inspection pending" : undefined,
  };
});
