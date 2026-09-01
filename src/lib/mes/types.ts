// MES Domain Types - Hi-Tech Radiators
// Aligned to ISA-95 and MESA-11, scoped to SOW Phase 1

export type PlantCode = "K1" | "K2" | "K3" | "K4" | "R1";

export interface Plant {
  code: PlantCode;
  name: string;
  location: string;
  since: string;
  role: string;
  lines: string[];
}

export type MESModule =
  | "overview"
  | "planning"
  | "work-orders"
  | "inventory"
  | "quality"
  | "traceability"
  | "iiot"
  | "oee"
  | "maintenance"
  | "energy"
  | "workforce"
  | "documents"
  | "operator-terminal"
  | "andon"
  | "shift-handover"
  | "line-simulator"
  | "suppliers"
  | "audit-trail"
  | "customer-portal"
  | "dispatch"
  | "calibration"
  | "cost-quality"
  | "root-cause"
  | "forecast"
  | "wip-aging"
  | "dashboards";

export type Role =
  | "executive"
  | "plant-manager"
  | "planner"
  | "supervisor"
  | "quality"
  | "operator"
  | "maintenance"
  | "engineer";

export type WorkOrderStatus =
  | "released"
  | "started"
  | "in-progress"
  | "on-hold"
  | "completed"
  | "closed";

export type WorkOrderPriority = "rush" | "high" | "normal" | "low";

export type QualityResult = "pass" | "fail" | "hold" | "pending";

export type MachineState = "running" | "idle" | "down" | "changeover" | "offline";

export type DowntimeReason =
  | "breakdown"
  | "changeover"
  | "material-shortage"
  | "quality-hold"
  | "no-plan"
  | "operator-absent"
  | "planned-pm";

export interface WorkOrder {
  id: string;
  orderNo: string;
  product: string;
  customer: string;
  plant: PlantCode;
  line: string;
  qty: number;
  qtyDone: number;
  qtyScrap: number;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  startDate: string;
  dueDate: string;
  progress: number;
  heatNumber?: string;
  currentStage: string;
  operator?: string;
  oee: number;
}

export interface QualityRecord {
  id: string;
  serial: string;
  stage: string;
  inspector: string;
  result: QualityResult;
  value?: number;
  spec?: string;
  unit?: string;
  timestamp: string;
  plant: PlantCode;
  notes?: string;
}

export interface Machine {
  id: string;
  name: string;
  plant: PlantCode;
  line: string;
  type: string;
  state: MachineState;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  cycleTime: number;
  idealCycle: number;
  lastUpdate: string;
  parameters: { label: string; value: string; unit: string }[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  description: string;
  type: "raw" | "wip" | "fg" | "consumable" | "spare";
  plant: PlantCode;
  location: string;
  quantity: number;
  unit: string;
  heatNumber?: string;
  supplier?: string;
  reorderLevel: number;
  lastMovement: string;
}

export interface MaintenanceOrder {
  id: string;
  asset: string;
  plant: PlantCode;
  type: "preventive" | "corrective" | "predictive" | "calibration";
  priority: WorkOrderPriority;
  status: "open" | "in-progress" | "completed" | "scheduled";
  assignedTo?: string;
  dueDate: string;
  mtbf?: number;
  mttr?: number;
}

export interface Operator {
  id: string;
  name: string;
  role: string;
  plant: PlantCode;
  certifications: { type: string; validUntil: string; status: "valid" | "expiring" | "expired" }[];
  skills: { skill: string; level: 1 | 2 | 3 | 4 | 5 }[];
  shift: string;
  productivity: number;
  utilization: number;
}

export interface TraceEvent {
  id: string;
  serial: string;
  stage: string;
  timestamp: string;
  operator: string;
  machine: string;
  result: QualityResult;
  data: { label: string; value: string }[];
}

export interface KPI {
  label: string;
  value: number;
  unit: string;
  target: number;
  trend: number;
  trendLabel: string;
  sparkline: number[];
}

export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  module: string;
  title: string;
  description: string;
  plant?: PlantCode;
  timestamp: string;
  acknowledged: boolean;
}

// === New domain types for enhancement round ===

export type NCRStatus = "open" | "investigating" | "containment" | "root-cause" | "capa-open" | "verified" | "closed";
export type NCRSeverity = "critical" | "major" | "minor";
export type NCRSource = "incoming" | "in-process" | "final-qc" | "customer" | "audit" | "supplier";

export interface NCR {
  id: string;
  title: string;
  description: string;
  plant: PlantCode;
  stage: string;
  severity: NCRSeverity;
  status: NCRStatus;
  source: NCRSource;
  raisedBy: string;
  raisedAt: string;
  affectedSerials: string[];
  affectedQty: number;
  rootCause?: string;
  capaAction?: string;
  capaOwner?: string;
  capaDue?: string;
  containmentAction?: string;
  daysOpen: number;
}

export type ShiftEntryType = "note" | "issue" | "achievement" | "handover" | "escalation";

export interface ShiftHandoverEntry {
  id: string;
  shift: "A" | "B" | "C";
  date: string;
  fromOperator: string;
  toOperator: string;
  type: ShiftEntryType;
  title: string;
  details: string;
  plant: PlantCode;
  priority: WorkOrderPriority;
  acknowledged: boolean;
  timestamp: string;
}

export type LineStationState = "running" | "idle" | "down" | "changeover" | "blocked" | "starved";

export interface LineStation {
  id: string;
  name: string;
  state: LineStationState;
  wipIn: number;
  wipOut: number;
  cycleTime: number;
  idealCycle: number;
  utilization: number;
  operator?: string;
  lastEvent?: string;
  lastEventTime?: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  plant: PlantCode;
  stations: LineStation[];
  throughput: number;
  targetThroughput: number;
  wipTotal: number;
  bottleneck: string;
}

// === Enhancement round 2 - new domain types ===

export interface Supplier {
  id: string;
  name: string;
  category: "Steel" | "Coating" | "Welding" | "Paint" | "Spare" | "Service";
  rating: number; // 0-100
  tier: "A" | "B" | "C" | "D";
  onTimeDelivery: number;
  qualityAcceptance: number;
  defectPpm: number;
  totalOrders: number;
  openNCRs: number;
  lastDelivery: string;
  contact: string;
  location: string;
  trend: number[]; // last 6 months rating
}

export type AuditAction =
  | "create" | "update" | "delete" | "approve" | "release"
  | "hold" | "complete" | "acknowledge" | "login" | "logout" | "export" | "reject";

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: AuditAction;
  module: string;
  entity: string;
  entityId: string;
  plant?: PlantCode;
  details: string;
  ipAddress: string;
  before?: string;
  after?: string;
}

export interface CustomerOrder {
  id: string;
  customer: string;
  orderNo: string;
  product: string;
  qty: number;
  dispatchedQty: number;
  status: "confirmed" | "in-production" | "qc-pending" | "ready-to-ship" | "dispatched" | "delivered";
  poDate: string;
  promisedDate: string;
  dispatchedDate?: string;
  deliveryLocation: string;
  endTransformer?: string;
  serials: string[];
  documentation: { label: string; status: "ready" | "pending" | "n/a" }[];
}

export interface KPIBreakdown {
  label: string;
  value: number;
  unit?: string;
  contribution: number; // % of total
  trend: number;
  children?: { label: string; value: number; unit?: string }[];
}

// === Enhancement round 3 - new domain types ===

export interface Shipment {
  id: string;
  manifestNo: string;
  customer: string;
  orderNo: string;
  plant: PlantCode;
  destination: string;
  carrier: string;
  vehicleNo: string;
  driver: string;
  lrNo: string; // lorry receipt
  status: "loading" | "in-transit" | "delivered" | "delayed" | "scheduled";
  units: number;
  weight: number; // MT
  value: number; // INR lakhs
  loadingDate: string;
  eta: string;
  deliveredDate?: string;
  documents: { label: string; status: "ready" | "pending" }[];
  coordinates?: { lat: number; lng: number; progress: number }; // 0-100 transit progress
}

export interface CalibrationItem {
  id: string;
  instrument: string;
  tag: string;
  plant: PlantCode;
  location: string;
  type: string;
  range: string;
  accuracy: string;
  lastCalibrated: string;
  nextDue: string;
  frequency: string; // e.g., "12 months"
  status: "valid" | "due-soon" | "overdue" | "in-progress";
  certNo: string;
  vendor: string;
  criticality: "critical" | "major" | "minor";
}

// === Enhancement round 4 - new domain types ===

export type CostOfQualityCategory = "prevention" | "appraisal" | "internal-failure" | "external-failure";

export interface CostOfQualityItem {
  id: string;
  category: CostOfQualityCategory;
  description: string;
  plant: PlantCode;
  amount: number; // INR lakhs
  period: string; // e.g., "Aug 2026"
  trend: number; // % change vs prior period
  details?: string;
}

export interface RootCauseAnalysis {
  id: string;
  title: string;
  problem: string;
  ncrRef?: string;
  plant: PlantCode;
  stage: string;
  facilitator: string;
  participants: string[];
  date: string;
  status: "open" | "in-progress" | "verified" | "closed";
  rootCause: string;
  whys: { question: string; answer: string }[];
  correctiveAction: string;
  preventiveAction: string;
  owner: string;
  dueDate: string;
  effectiveness?: "pending" | "effective" | "ineffective";
}

// === Enhancement round 5 - new domain types ===

export interface ForecastPoint {
  date: string;
  planned: number;
  projected: number;
  capacity: number;
  actual?: number;
}

export interface ForecastScenario {
  id: string;
  name: string;
  description: string;
  horizon: string; // e.g., "Next 14 days"
  confidence: number; // 0-100
  points: ForecastPoint[];
  assumptions: string[];
  risks: { description: string; impact: "low" | "medium" | "high"; probability: number }[];
}

export type WIPAgeBucket = "fresh" | "normal" | "aging" | "stale" | "critical";

export interface WIPItem {
  id: string;
  serial: string;
  product: string;
  plant: PlantCode;
  line: string;
  stage: string;
  qty: number;
  enterStage: string; // ISO date
  ageHours: number;
  ageBucket: WIPAgeBucket;
  status: "moving" | "waiting" | "blocked" | "hold";
  workOrder: string;
  customer: string;
  dueDate: string;
  bottleneckReason?: string;
}


