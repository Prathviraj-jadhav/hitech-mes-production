"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WorkOrder, QualityRecord, Machine, InventoryItem,
  MaintenanceOrder, Operator, TraceEvent, Alert, PlantCode,
  NCR, ShiftHandoverEntry, Shipment, CalibrationItem,
  CostOfQualityItem, RootCauseAnalysis, WIPItem,
  CustomerOrder, AuditAction, AuditEntry,
} from "./types";
import {
  WORK_ORDERS as INITIAL_WOS,
  MACHINES as INITIAL_MACHINES,
  QUALITY_RECORDS as INITIAL_QUALITY,
  INVENTORY as INITIAL_INVENTORY,
  MAINTENANCE as INITIAL_MAINTENANCE,
  OPERATORS_DATA as INITIAL_OPERATORS,
  ALERTS as INITIAL_ALERTS,
  TRACE_EVENTS as INITIAL_TRACE,
  NCRS as INITIAL_NCRS,
  SHIFT_HANDOVER as INITIAL_HANDOVERS,
  ANDON_BOARDS as INITIAL_ANDON,
  SHIPMENTS as INITIAL_SHIPMENTS,
  CALIBRATION_ITEMS as INITIAL_CALIBRATION,
  COST_OF_QUALITY as INITIAL_COQ,
  ROOT_CAUSES as INITIAL_ROOT_CAUSES,
  WIP_ITEMS as INITIAL_WIP,
  CUSTOMER_ORDERS as INITIAL_CUSTOMER_ORDERS,
  AUDIT_TRAIL as INITIAL_AUDIT,
} from "./seed";

export interface ExceptionItem {
  id: string;
  title: string;
  severity: "critical" | "warning";
  assetOrOrder: string;
  plant: PlantCode;
  stage: string;
  owner: string;
  deadlineMinutes: number;
  description: string;
  recommendedAction: string;
  module: string;
}

export const INITIAL_EXCEPTIONS: ExceptionItem[] = [
  {
    id: "EXC-01",
    title: "HDG-2 Kettle Temp Drop (438°C) & Heating Zone 3 Surge",
    severity: "critical",
    assetOrOrder: "HDG-2 (Zinc Kettle)",
    plant: "K2",
    stage: "Galvanizing",
    owner: "V. Sharma (Maintenance)",
    deadlineMinutes: 8,
    description: "Bath temperature fell below 445°C minimum process window with 18A current draw spike on element 3. Risk of kettle freeze-up.",
    recommendedAction: "Replace failing contactor on heating zone 3 and inspect SCR firing circuit.",
    module: "iiot",
  },
  {
    id: "EXC-02",
    title: "Hydro Leak Test Gate Failed · 2 Out of 80 Leaking at Seam #3",
    severity: "critical",
    assetOrOrder: "WO-2412 (Siemens 2400mm)",
    plant: "K1",
    stage: "Leak Test",
    owner: "P. Nair (Quality Lead)",
    deadlineMinutes: 15,
    description: "Pinhole leaks detected during 2.0 bar underwater pressure hold. Unit advancement locked; NCR-2026-039 raised.",
    recommendedAction: "Tag defective elements, route to weld rework booth R-02, and release conforming 78 units.",
    module: "quality",
  },
  {
    id: "EXC-03",
    title: "Seam Welder SW-02 Electrode PM Overdue (480 / 500 hrs)",
    severity: "warning",
    assetOrOrder: "SW-02 (Seam Welder)",
    plant: "K2",
    stage: "Welding",
    owner: "K. Deshmukh (Welding Sup)",
    deadlineMinutes: 45,
    description: "Electrode wheel dresser reached wear limit. Weld seam consistency index at risk of dropping below ISO 3834-2 standard.",
    recommendedAction: "Reserve Cu-Cr wheels from K4 spare store and execute 30-min overhaul during shift change.",
    module: "maintenance",
  },
  {
    id: "EXC-04",
    title: "Stagnant WIP Buffer in Pre-Galvanizing (76h Dwell)",
    severity: "warning",
    assetOrOrder: "WO-2418 (Toshiba 3200mm)",
    plant: "K2",
    stage: "Pre-Galv Buffer",
    owner: "R. Sharma (Prod Manager)",
    deadlineMinutes: 60,
    description: "60 welded elements waiting >48h limit. High risk of surface flash rusting prior to pickling.",
    recommendedAction: "Fast-track crane routing to Bay 2 and prioritize immediate dip in HDG bath #1.",
    module: "wip-aging",
  },
];

interface MESDataState {
  workOrders: WorkOrder[];
  machines: Machine[];
  qualityRecords: QualityRecord[];
  inventory: InventoryItem[];
  maintenance: MaintenanceOrder[];
  operators: Operator[];
  alerts: Alert[];
  ncrs: NCR[];
  traceEvents: TraceEvent[];
  andonBoards: typeof INITIAL_ANDON;
  shiftHandovers: ShiftHandoverEntry[];
  shipments: Shipment[];
  calibrationItems: CalibrationItem[];
  rootCauses: RootCauseAnalysis[];
  costOfQuality: CostOfQualityItem[];
  wipItems: WIPItem[];
  customerOrders: CustomerOrder[];
  auditTrail: AuditEntry[];
  exceptions: ExceptionItem[];

  // Mutations
  advanceWorkOrderStage: (woId: string) => { success: boolean; blockedReason?: string; gate?: string };
  updateWorkOrder: (woId: string, updates: Partial<WorkOrder>) => void;
  holdWorkOrder: (woId: string, reason: string) => void;
  releaseWorkOrder: (woId: string) => void;
  completeWorkOrder: (woId: string) => void;
  logScrapAndRework: (woId: string, scrapQty: number, reworkQty: number, reasonCode: string, stage: string) => void;
  
  recordQualityInspection: (record: Omit<QualityRecord, "id" | "timestamp">) => { recordId: string; ncrId?: string };
  createNCR: (ncr: Omit<NCR, "id" | "raisedAt" | "daysOpen">) => string;
  updateNCR: (id: string, updates: Partial<NCR>) => void;
  
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  updateMachineParameters: (id: string, params: { label: string; value: string; unit: string }[]) => void;
  
  receiveMaterialIntake: (item: {
    supplier: string;
    grade: string;
    heatNumber: string;
    weightMt: number;
    location: string;
    carbonPct: number;
    manganesePct: number;
    mtcRef: string;
  }) => void;
  transferStock: (itemId: string, targetPlant: PlantCode, targetLocation: string, qty: number) => void;
  
  createMaintenanceOrder: (order: Omit<MaintenanceOrder, "id">) => string;
  updateMaintenanceOrder: (id: string, updates: Partial<MaintenanceOrder>) => void;
  
  raiseAndonCall: (plant: PlantCode, line: string, stationId: string, type: "Breakdown" | "Quality" | "Material" | "Tooling", message: string) => void;
  acknowledgeAndon: (boardId: string, stationId: string, acknowledgedBy: string) => void;
  resolveAndon: (boardId: string, stationId: string, resolutionNotes: string) => void;
  
  recordCalibration: (itemId: string, newDate: string, nextDue: string, certNo: string) => void;
  toggleToolLockout: (itemId: string, locked: boolean) => void;
  
  submitShiftHandover: (entry: Omit<ShiftHandoverEntry, "id" | "timestamp">) => string;
  signShiftHandover: (id: string, incomingSupervisor: string) => void;
  
  injectRushOrder: (order: {
    customer: string;
    product: string;
    qty: number;
    plant: PlantCode;
    line: string;
    turnaroundDays: number;
    heatNumber?: string;
  }) => { woId: string; conflicts: string[] };
  
  containSuspectBatch: (heatNumber: string, reason: string) => { affectedCount: number; serials: string[] };
  
  resolveException: (excId: string, resolutionNotes: string) => void;
  
  addAuditEntry: (action: AuditAction, module: string, entity: string, entityId: string, details: string) => void;
  
  resetToDefaults: () => void;
}

const STAGES = [
  "Planning",
  "Raw Material",
  "Cutting",
  "Forming",
  "Welding",
  "Leak Test",
  "Galvanizing",
  "Painting",
  "Assembly",
  "Final QC",
  "Packing",
  "Dispatched",
];

export const useMESDataStore = create<MESDataState>()(
  persist(
    (set, get) => ({
      workOrders: INITIAL_WOS,
      machines: INITIAL_MACHINES,
      qualityRecords: INITIAL_QUALITY,
      inventory: INITIAL_INVENTORY,
      maintenance: INITIAL_MAINTENANCE,
      operators: INITIAL_OPERATORS,
      alerts: INITIAL_ALERTS,
      ncrs: INITIAL_NCRS,
      traceEvents: INITIAL_TRACE,
      andonBoards: INITIAL_ANDON,
      shiftHandovers: INITIAL_HANDOVERS,
      shipments: INITIAL_SHIPMENTS,
      calibrationItems: INITIAL_CALIBRATION,
      rootCauses: INITIAL_ROOT_CAUSES,
      costOfQuality: INITIAL_COQ,
      wipItems: INITIAL_WIP,
      customerOrders: INITIAL_CUSTOMER_ORDERS,
      auditTrail: INITIAL_AUDIT,
      exceptions: INITIAL_EXCEPTIONS,

      advanceWorkOrderStage: (woId: string) => {
        const wo = get().workOrders.find(w => w.id === woId);
        if (!wo) return { success: false, blockedReason: "Work order not found" };

        if (wo.status === "on-hold") {
          return {
            success: false,
            blockedReason: "Work order is currently on QUALITY HOLD. Clear all active NCRs before advancing.",
          };
        }

        const currentIdx = STAGES.indexOf(wo.currentStage);
        if (currentIdx === -1 || currentIdx >= STAGES.length - 1) {
          return { success: false, blockedReason: "Work order is already at terminal stage." };
        }

        const nextStage = STAGES[currentIdx + 1];

        // Quality Gate Enforcement ("Enforce, Don't Just Record")
        if (wo.currentStage === "Welding") {
          // Check welder cert & WPS
          const welder = get().operators.find(o => o.name === wo.operator);
          const hasValidWeldCert = welder?.certifications.some(c => 
            (c.type.includes("3834") || c.type.includes("9606") || c.type.includes("Welder")) && c.status === "valid"
          );
          if (welder && !hasValidWeldCert) {
            return {
              success: false,
              blockedReason: `ISO 3834-2 Gate Blocked: Welder ${wo.operator} certification has lapsed. Reassign to certified welder before advancing.`,
              gate: "ISO 3834-2 Welder Qualification Gate",
            };
          }
        }

        if (wo.currentStage === "Leak Test") {
          // Check if there's a passing leak test for this serial / WO
          const testRecord = get().qualityRecords.find(
            q => (q.serial === wo.id || q.stage === "Leak Test") && q.result === "pass"
          );
          if (!testRecord) {
            return {
              success: false,
              blockedReason: "Pressure Test Gate Blocked: 2.0 bar hydrostatic leak test must be recorded and passed before advancing to Galvanizing.",
              gate: "2.0 Bar Hydrostatic Gate",
            };
          }
        }

        if (wo.currentStage === "Galvanizing") {
          const dftRecord = get().qualityRecords.find(
            q => q.stage === "Galvanizing" && q.result === "pass" && (q.value || 0) >= 86
          );
          if (!dftRecord) {
            return {
              success: false,
              blockedReason: "ISO 1461 Coating Gate Blocked: Zinc bath DFT must be measured and meet min 86 μm specification.",
              gate: "ISO 1461 HDG Coating Gate",
            };
          }
        }

        if (wo.currentStage === "Painting") {
          const paintRecord = get().qualityRecords.find(
            q => q.stage === "Painting" && q.result === "pass" && (q.value || 0) >= 120
          );
          if (!paintRecord) {
            return {
              success: false,
              blockedReason: "Paint DFT Gate Blocked: Epoxy primer & polyurethane topcoat total DFT must meet ≥ 140 μm spec.",
              gate: "Paint Coating Gate",
            };
          }
        }

        // Successfully advance stage
        const newProgress = Math.min(100, Math.round(((currentIdx + 2) / STAGES.length) * 100));
        const newStatus = nextStage === "Dispatched" ? "completed" : "in-progress";

        set(state => ({
          workOrders: state.workOrders.map(w =>
            w.id === woId
              ? { ...w, currentStage: nextStage, progress: newProgress, status: newStatus }
              : w
          ),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Current Operator",
              role: "Supervisor",
              action: "update",
              module: "work-orders",
              entity: "WorkOrder",
              entityId: woId,
              plant: wo.plant,
              details: `Stage progressed from ${wo.currentStage} to ${nextStage} (Gate verified)`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));

        return { success: true };
      },

      updateWorkOrder: (woId, updates) => {
        set(state => ({
          workOrders: state.workOrders.map(w => (w.id === woId ? { ...w, ...updates } : w)),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Supervisor",
              role: "Supervisor",
              action: "update",
              module: "work-orders",
              entity: "WorkOrder",
              entityId: woId,
              details: `Work order fields updated: ${Object.keys(updates).join(", ")}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      holdWorkOrder: (woId, reason) => {
        set(state => ({
          workOrders: state.workOrders.map(w =>
            w.id === woId ? { ...w, status: "on-hold" } : w
          ),
          alerts: [
            {
              id: `alt-${Date.now()}`,
              severity: "warning",
              module: "work-orders",
              title: `Work Order ${woId} Placed on Hold`,
              description: reason || "Manual supervisor hold triggered.",
              timestamp: new Date().toISOString(),
              acknowledged: false,
            },
            ...state.alerts,
          ],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Supervisor",
              role: "Quality Engineer",
              action: "hold",
              module: "work-orders",
              entity: "WorkOrder",
              entityId: woId,
              details: `Hold triggered: ${reason}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      releaseWorkOrder: (woId) => {
        set(state => ({
          workOrders: state.workOrders.map(w =>
            w.id === woId ? { ...w, status: "in-progress" } : w
          ),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Quality Manager",
              role: "Quality",
              action: "release",
              module: "work-orders",
              entity: "WorkOrder",
              entityId: woId,
              details: "Hold released after quality disposition.",
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      completeWorkOrder: (woId) => {
        set(state => ({
          workOrders: state.workOrders.map(w =>
            w.id === woId ? { ...w, status: "completed", progress: 100, currentStage: "Packing" } : w
          ),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Plant Supervisor",
              role: "Supervisor",
              action: "complete",
              module: "work-orders",
              entity: "WorkOrder",
              entityId: woId,
              details: "Work order completed and verified for packing.",
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      logScrapAndRework: (woId, scrapQty, reworkQty, reasonCode, stage) => {
        const wo = get().workOrders.find(w => w.id === woId);
        set(state => ({
          workOrders: state.workOrders.map(w =>
            w.id === woId
              ? {
                  ...w,
                  qtyScrap: w.qtyScrap + scrapQty,
                  qtyDone: Math.max(0, w.qtyDone - scrapQty),
                }
              : w
          ),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Operator Terminal",
              role: "Operator",
              action: "update",
              module: "operator-terminal",
              entity: "WorkOrder",
              entityId: woId,
              plant: wo?.plant,
              details: `Logged ${scrapQty} scrap pcs (${reasonCode}) and ${reworkQty} rework pcs at stage ${stage}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      recordQualityInspection: (record) => {
        const recordId = `QC-${Math.floor(1000 + Math.random() * 9000)}`;
        const timestamp = new Date().toISOString();
        const fullRecord: QualityRecord = {
          ...record,
          id: recordId,
          timestamp,
        };

        let ncrId: string | undefined;

        // If fail, enforce hold and auto-create NCR
        if (record.result === "fail") {
          ncrId = `NCR-2026-${Math.floor(100 + Math.random() * 900)}`;
          const newNCR: NCR = {
            id: ncrId,
            title: `Quality Gate Breach: ${record.stage} on ${record.serial}`,
            description: `Measured value ${record.value || "N/A"} ${record.unit || ""} deviated from spec ${record.spec || "tolerance"}. Unit quarantined.`,
            plant: record.plant,
            stage: record.stage,
            severity: "critical",
            status: "open",
            source: "in-process",
            raisedBy: record.inspector,
            raisedAt: timestamp,
            affectedSerials: [record.serial],
            affectedQty: 1,
            containmentAction: "Unit tagged with physical Red Hold tag; progression in MES locked.",
            daysOpen: 0,
          };

          set(state => ({
            qualityRecords: [fullRecord, ...state.qualityRecords],
            ncrs: [newNCR, ...state.ncrs],
            workOrders: state.workOrders.map(w =>
              w.id === record.serial ? { ...w, status: "on-hold" } : w
            ),
            alerts: [
              {
                id: `alt-${Date.now()}`,
                severity: "critical",
                module: "quality",
                title: `Quality Gate Fail on ${record.serial}`,
                description: `${record.stage} failed: ${record.value} ${record.unit} vs ${record.spec}. Auto-created ${ncrId}.`,
                plant: record.plant,
                timestamp,
                acknowledged: false,
              },
              ...state.alerts,
            ],
            auditTrail: [
              {
                id: `aud-${Date.now()}`,
                timestamp,
                user: record.inspector,
                role: "Quality",
                action: "create",
                module: "quality",
                entity: "QualityRecord",
                entityId: recordId,
                plant: record.plant,
                details: `Inspection recorded FAIL: ${record.stage}. Auto-created ${ncrId} and placed serial on hold.`,
                ipAddress: "192.168.10.42",
              },
              ...state.auditTrail,
            ],
          }));
        } else {
          // Pass or Hold
          set(state => ({
            qualityRecords: [fullRecord, ...state.qualityRecords],
            traceEvents: [
              {
                id: `trc-${Date.now()}`,
                serial: record.serial,
                stage: record.stage,
                timestamp,
                operator: record.inspector,
                machine: `${record.plant}-G-01`,
                result: record.result,
                data: [
                  { label: "Measured", value: `${record.value || "-"} ${record.unit || ""}` },
                  { label: "Spec", value: record.spec || "-" },
                  { label: "Inspector", value: record.inspector },
                ],
              },
              ...state.traceEvents,
            ],
            auditTrail: [
              {
                id: `aud-${Date.now()}`,
                timestamp,
                user: record.inspector,
                role: "Quality",
                action: "create",
                module: "quality",
                entity: "QualityRecord",
                entityId: recordId,
                plant: record.plant,
                details: `Inspection recorded ${record.result.toUpperCase()}: ${record.stage} (${record.value} ${record.unit})`,
                ipAddress: "192.168.10.42",
              },
              ...state.auditTrail,
            ],
          }));
        }

        return { recordId, ncrId };
      },

      createNCR: (ncr) => {
        const id = `NCR-2026-${Math.floor(100 + Math.random() * 900)}`;
        const newNCR: NCR = {
          ...ncr,
          id,
          raisedAt: new Date().toISOString(),
          daysOpen: 0,
        };
        set(state => ({
          ncrs: [newNCR, ...state.ncrs],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: ncr.raisedBy,
              role: "Quality",
              action: "create",
              module: "quality",
              entity: "NCR",
              entityId: id,
              plant: ncr.plant,
              details: `Manual NCR raised: ${ncr.title}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
        return id;
      },

      updateNCR: (id, updates) => {
        set(state => ({
          ncrs: state.ncrs.map(n => (n.id === id ? { ...n, ...updates } : n)),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Quality Engineer",
              role: "Quality",
              action: "update",
              module: "quality",
              entity: "NCR",
              entityId: id,
              details: `NCR updated: status=${updates.status || "unchanged"}, owner=${updates.capaOwner || "unchanged"}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      updateMachine: (id, updates) => {
        set(state => ({
          machines: state.machines.map(m => (m.id === id ? { ...m, ...updates, lastUpdate: new Date().toISOString() } : m)),
        }));
      },

      updateMachineParameters: (id, params) => {
        set(state => ({
          machines: state.machines.map(m =>
            m.id === id ? { ...m, parameters: params, lastUpdate: new Date().toISOString() } : m
          ),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Process Engineer",
              role: "Engineer",
              action: "update",
              module: "iiot",
              entity: "Machine",
              entityId: id,
              details: `Parameters updated: ${params.map(p => `${p.label}=${p.value}${p.unit}`).join(", ")}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      receiveMaterialIntake: (item) => {
        const sku = `COIL-${item.grade.replace(/\s+/g, "-")}-${item.heatNumber.slice(-4)}`;
        const newItem: InventoryItem = {
          id: `INV-${Date.now()}`,
          sku,
          description: `${item.grade} Steel Coil · Heat #${item.heatNumber}`,
          type: "raw",
          plant: "K4",
          location: item.location || "Bay K4-B04",
          quantity: item.weightMt,
          unit: "MT",
          heatNumber: item.heatNumber,
          supplier: item.supplier,
          reorderLevel: 25,
          lastMovement: new Date().toISOString(),
        };

        set(state => ({
          inventory: [newItem, ...state.inventory],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Store Manager",
              role: "Stores",
              action: "create",
              module: "inventory",
              entity: "InventoryItem",
              entityId: newItem.id,
              plant: "K4",
              details: `Received ${item.weightMt} MT ${item.grade} coil from ${item.supplier}. Heat #${item.heatNumber}. MTC Ref: ${item.mtcRef}. C: ${item.carbonPct}%, Mn: ${item.manganesePct}%`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      transferStock: (itemId, targetPlant, targetLocation, qty) => {
        set(state => ({
          inventory: state.inventory.map(i => {
            if (i.id === itemId) {
              return {
                ...i,
                quantity: Math.max(0, i.quantity - qty),
                lastMovement: new Date().toISOString(),
              };
            }
            return i;
          }),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Logistics Officer",
              role: "Stores",
              action: "update",
              module: "inventory",
              entity: "InventoryItem",
              entityId: itemId,
              details: `Transferred ${qty} to ${targetPlant} (${targetLocation})`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      createMaintenanceOrder: (order) => {
        const id = `MO-${Math.floor(1000 + Math.random() * 9000)}`;
        const fullOrder: MaintenanceOrder = {
          ...order,
          id,
        };
        set(state => ({
          maintenance: [fullOrder, ...state.maintenance],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Maintenance Planner",
              role: "Maintenance",
              action: "create",
              module: "maintenance",
              entity: "MaintenanceOrder",
              entityId: id,
              plant: order.plant,
              details: `Scheduled ${order.type} maintenance for ${order.asset}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
        return id;
      },

      updateMaintenanceOrder: (id, updates) => {
        set(state => ({
          maintenance: state.maintenance.map(m => (m.id === id ? { ...m, ...updates } : m)),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Technician",
              role: "Maintenance",
              action: "update",
              module: "maintenance",
              entity: "MaintenanceOrder",
              entityId: id,
              details: `Maintenance order status: ${updates.status || "updated"}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      raiseAndonCall: (plant, line, stationId, type, message) => {
        set(state => ({
          andonBoards: state.andonBoards.map(b => {
            if (b.plant === plant && b.line === line) {
              return {
                ...b,
                activeAlerts: b.activeAlerts + 1,
                stations: b.stations.map(s =>
                  s.id === stationId ? { ...s, state: "down", lastEvent: `${type}: ${message}` } : s
                ),
              };
            }
            return b;
          }),
          alerts: [
            {
              id: `alt-${Date.now()}`,
              severity: "critical",
              module: "andon",
              title: `Andon Alert: ${type} at ${stationId} (${plant} · ${line})`,
              description: message,
              plant,
              timestamp: new Date().toISOString(),
              acknowledged: false,
            },
            ...state.alerts,
          ],
        }));
      },

      acknowledgeAndon: (boardId, stationId, acknowledgedBy) => {
        set(state => ({
          andonBoards: state.andonBoards.map(b => {
            if (b.id === boardId) {
              return {
                ...b,
                stations: b.stations.map(s =>
                  s.id === stationId ? { ...s, lastEvent: `Acknowledged by ${acknowledgedBy}` } : s
                ),
              };
            }
            return b;
          }),
        }));
      },

      resolveAndon: (boardId, stationId, resolutionNotes) => {
        set(state => ({
          andonBoards: state.andonBoards.map(b => {
            if (b.id === boardId) {
              return {
                ...b,
                activeAlerts: Math.max(0, b.activeAlerts - 1),
                stations: b.stations.map(s =>
                  s.id === stationId ? { ...s, state: "running", lastEvent: `Resolved: ${resolutionNotes}` } : s
                ),
              };
            }
            return b;
          }),
        }));
      },

      recordCalibration: (itemId, newDate, nextDue, certNo) => {
        set(state => ({
          calibrationItems: state.calibrationItems.map(c =>
            c.id === itemId
              ? {
                  ...c,
                  lastCalibrated: newDate,
                  nextDue,
                  certNo,
                  status: "valid",
                }
              : c
          ),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Quality Laboratory Lead",
              role: "Quality",
              action: "update",
              module: "calibration",
              entity: "CalibrationItem",
              entityId: itemId,
              details: `Calibrated instrument under ISO 17025. Certificate: ${certNo}. Next due: ${nextDue}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      toggleToolLockout: (itemId, locked) => {
        set(state => ({
          calibrationItems: state.calibrationItems.map(c =>
            c.id === itemId
              ? { ...c, status: locked ? "overdue" : "valid" }
              : c
          ),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Quality QA",
              role: "Quality",
              action: "update",
              module: "calibration",
              entity: "CalibrationItem",
              entityId: itemId,
              details: locked ? "Tool locked out from shop-floor sign-off (Overdue)" : "Tool unlocked",
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      submitShiftHandover: (entry) => {
        const id = `SH-${Date.now()}`;
        const newEntry: ShiftHandoverEntry = {
          ...entry,
          id,
          timestamp: new Date().toISOString(),
        };
        set(state => ({
          shiftHandovers: [newEntry, ...state.shiftHandovers],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: entry.fromOperator,
              role: "Supervisor",
              action: "create",
              module: "shift-handover",
              entity: "ShiftHandoverEntry",
              entityId: id,
              plant: entry.plant,
              details: `Shift ${entry.shift} handover logged: ${entry.title}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
        return id;
      },

      signShiftHandover: (id, incomingSupervisor) => {
        set(state => ({
          shiftHandovers: state.shiftHandovers.map(s =>
            s.id === id ? { ...s, acknowledged: true, toOperator: incomingSupervisor } : s
          ),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: incomingSupervisor,
              role: "Supervisor",
              action: "approve",
              module: "shift-handover",
              entity: "ShiftHandoverEntry",
              entityId: id,
              details: `Dual sign-off completed by incoming supervisor ${incomingSupervisor}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      injectRushOrder: (order) => {
        const woId = `WO-RUSH-${Math.floor(1000 + Math.random() * 9000)}`;
        const soNo = `SO-RUSH-${Math.floor(10000 + Math.random() * 90000)}`;
        const now = Date.now();
        const dueDate = new Date(now + order.turnaroundDays * 86400000).toISOString();

        const newWO: WorkOrder = {
          id: woId,
          orderNo: soNo,
          product: order.product,
          customer: order.customer,
          plant: order.plant,
          line: order.line,
          qty: order.qty,
          qtyDone: 0,
          qtyScrap: 0,
          status: "started",
          priority: "rush",
          startDate: new Date(now).toISOString(),
          dueDate,
          progress: 5,
          heatNumber: order.heatNumber || "HT-98214",
          currentStage: "Cutting",
          operator: "R. Sharma",
          oee: 84.5,
        };

        // Detect potential conflicting orders on that line
        const conflicts = get().workOrders
          .filter(w => w.line === order.line && w.status === "in-progress")
          .map(w => `${w.id} (${w.customer}, Qty ${w.qty})`);

        set(state => ({
          workOrders: [newWO, ...state.workOrders],
          alerts: [
            {
              id: `alt-${Date.now()}`,
              severity: "warning",
              module: "planning",
              title: `Rush Order Injected: ${order.customer} (${order.qty} units)`,
              description: `Committed ${order.turnaroundDays}-day turnaround on Line ${order.line}. Job cards pushed to Operator Terminal.`,
              plant: order.plant,
              timestamp: new Date().toISOString(),
              acknowledged: false,
            },
            ...state.alerts,
          ],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Head of Planning",
              role: "Planner",
              action: "create",
              module: "planning",
              entity: "WorkOrder",
              entityId: woId,
              plant: order.plant,
              details: `Injected rush purchase order for ${order.customer} with ${order.turnaroundDays}d due date`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));

        return { woId, conflicts };
      },

      containSuspectBatch: (heatNumber, reason) => {
        const matchingWOs = get().workOrders.filter(w => w.heatNumber === heatNumber);
        const serials = matchingWOs.map(w => w.id);

        set(state => ({
          workOrders: state.workOrders.map(w =>
            w.heatNumber === heatNumber ? { ...w, status: "on-hold" } : w
          ),
          alerts: [
            {
              id: `alt-${Date.now()}`,
              severity: "critical",
              module: "traceability",
              title: `Batch Containment Lock: Heat #${heatNumber}`,
              description: `Quarantined ${serials.length} serials across plants. Reason: ${reason}`,
              timestamp: new Date().toISOString(),
              acknowledged: false,
            },
            ...state.alerts,
          ],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Quality Manager",
              role: "Quality",
              action: "hold",
              module: "traceability",
              entity: "BatchContainment",
              entityId: heatNumber,
              details: `Forward trace containment locked ${serials.length} units: ${serials.join(", ")}. Reason: ${reason}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));

        return { affectedCount: serials.length, serials };
      },

      resolveException: (excId, resolutionNotes) => {
        set(state => ({
          exceptions: state.exceptions.filter(e => e.id !== excId),
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Plant Director",
              role: "Executive",
              action: "approve",
              module: "overview",
              entity: "Exception",
              entityId: excId,
              details: `Exception resolved: ${resolutionNotes}`,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      addAuditEntry: (action, module, entity, entityId, details) => {
        set(state => ({
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "MES User",
              role: "Operator",
              action,
              module,
              entity,
              entityId,
              details,
              ipAddress: "192.168.10.42",
            },
            ...state.auditTrail,
          ],
        }));
      },

      resetToDefaults: () => {
        set({
          workOrders: INITIAL_WOS,
          machines: INITIAL_MACHINES,
          qualityRecords: INITIAL_QUALITY,
          inventory: INITIAL_INVENTORY,
          maintenance: INITIAL_MAINTENANCE,
          operators: INITIAL_OPERATORS,
          alerts: INITIAL_ALERTS,
          ncrs: INITIAL_NCRS,
          traceEvents: INITIAL_TRACE,
          andonBoards: INITIAL_ANDON,
          shiftHandovers: INITIAL_HANDOVERS,
          shipments: INITIAL_SHIPMENTS,
          calibrationItems: INITIAL_CALIBRATION,
          rootCauses: INITIAL_ROOT_CAUSES,
          costOfQuality: INITIAL_COQ,
          wipItems: INITIAL_WIP,
          customerOrders: INITIAL_CUSTOMER_ORDERS,
          auditTrail: INITIAL_AUDIT,
          exceptions: INITIAL_EXCEPTIONS,
        });
      },
    }),
    {
      name: "hitech-mes-data-state",
      partialize: (state) => ({
        workOrders: state.workOrders,
        qualityRecords: state.qualityRecords,
        ncrs: state.ncrs,
        inventory: state.inventory,
        maintenance: state.maintenance,
        machines: state.machines,
        exceptions: state.exceptions,
        calibrationItems: state.calibrationItems,
        shiftHandovers: state.shiftHandovers,
        auditTrail: state.auditTrail.slice(0, 50),
      }),
    }
  )
);
