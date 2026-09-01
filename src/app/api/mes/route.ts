import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  KPIS, WORK_ORDERS, MACHINES, QUALITY_RECORDS, INVENTORY,
  MAINTENANCE, OPERATORS_DATA, TRACE_EVENTS, ALERTS, PLANT_KPIS,
  OEE_TREND_24H, SIX_BIG_LOSSES, ENERGY_TREND, DOCUMENTS,
} from "@/lib/mes/seed";
import type { PlantCode } from "@/lib/mes/types";

export const dynamic = "force-dynamic";

function filterByPlant<T extends { plant: PlantCode }>(arr: T[], plant: string | null) {
  if (!plant || plant === "ALL") return arr;
  return arr.filter((x) => x.plant === plant);
}

// GET - Read from database with seed fallback
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const moduleName = sp.get("module") || "overview";
  const plant = sp.get("plant") || "ALL";

  try {
    switch (moduleName) {
      case "overview": {
        // Try database first, fall back to seed
        let dbAlerts, dbWOs, dbMachines;
        try {
          dbAlerts = await db.alert.findMany({ orderBy: { timestamp: "desc" } });
          dbWOs = await db.workOrder.findMany({ where: { status: { in: ["started", "in-progress", "on-hold"] } } });
          dbMachines = await db.machine.findMany();
        } catch {
          // Database not available, use seed
        }
        return NextResponse.json({
          kpis: KPIS,
          plantKpis: PLANT_KPIS,
          alerts: dbAlerts?.length ? dbAlerts : ALERTS,
          activeWorkOrders: dbWOs?.length ? dbWOs : WORK_ORDERS.filter((w) => ["started", "in-progress", "on-hold"].includes(w.status)),
          machineStates: dbMachines?.length ? dbMachines : MACHINES,
          source: dbAlerts ? "database" : "seed",
        });
      }

      case "work-orders": {
        try {
          const data = plant === "ALL"
            ? await db.workOrder.findMany({ orderBy: { createdAt: "desc" } })
            : await db.workOrder.findMany({ where: { plantCode: plant }, orderBy: { createdAt: "desc" } });
          return NextResponse.json({ data: data.length ? data : filterByPlant(WORK_ORDERS, plant), source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: filterByPlant(WORK_ORDERS, plant), source: "seed" });
        }
      }

      case "machines":
      case "iiot": {
        try {
          const data = plant === "ALL"
            ? await db.machine.findMany()
            : await db.machine.findMany({ where: { plantCode: plant } });
          return NextResponse.json({ data: data.length ? data : filterByPlant(MACHINES, plant), source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: filterByPlant(MACHINES, plant), source: "seed" });
        }
      }

      case "quality": {
        try {
          const data = plant === "ALL"
            ? await db.qualityRecord.findMany({ orderBy: { timestamp: "desc" } })
            : await db.qualityRecord.findMany({ where: { plantCode: plant }, orderBy: { timestamp: "desc" } });
          return NextResponse.json({ data: data.length ? data : filterByPlant(QUALITY_RECORDS, plant), source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: filterByPlant(QUALITY_RECORDS, plant), source: "seed" });
        }
      }

      case "inventory": {
        try {
          const data = plant === "ALL"
            ? await db.inventoryItem.findMany()
            : await db.inventoryItem.findMany({ where: { plantCode: plant } });
          return NextResponse.json({ data: data.length ? data : filterByPlant(INVENTORY, plant), source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: filterByPlant(INVENTORY, plant), source: "seed" });
        }
      }

      case "maintenance": {
        try {
          const data = plant === "ALL"
            ? await db.maintenanceOrder.findMany({ orderBy: { dueDate: "asc" } })
            : await db.maintenanceOrder.findMany({ where: { plantCode: plant }, orderBy: { dueDate: "asc" } });
          return NextResponse.json({ data: data.length ? data : filterByPlant(MAINTENANCE, plant), source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: filterByPlant(MAINTENANCE, plant), source: "seed" });
        }
      }

      case "workforce": {
        try {
          const data = plant === "ALL"
            ? await db.operator.findMany()
            : await db.operator.findMany({ where: { plantCode: plant } });
          return NextResponse.json({ data: data.length ? data : filterByPlant(OPERATORS_DATA, plant), source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: filterByPlant(OPERATORS_DATA, plant), source: "seed" });
        }
      }

      case "traceability": {
        try {
          const data = plant === "ALL"
            ? await db.traceEvent.findMany({ orderBy: { timestamp: "desc" } })
            : await db.traceEvent.findMany({ orderBy: { timestamp: "desc" } });
          return NextResponse.json({ data: data.length ? data : TRACE_EVENTS, source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: TRACE_EVENTS, source: "seed" });
        }
      }

      case "documents": {
        try {
          const data = await db.document.findMany();
          return NextResponse.json({ data: data.length ? data : DOCUMENTS, source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: DOCUMENTS, source: "seed" });
        }
      }

      case "alerts": {
        try {
          const data = plant === "ALL"
            ? await db.alert.findMany({ orderBy: { timestamp: "desc" } })
            : await db.alert.findMany({ where: { plantCode: plant }, orderBy: { timestamp: "desc" } });
          return NextResponse.json({ data: data.length ? data : ALERTS, source: data.length ? "database" : "seed" });
        } catch {
          return NextResponse.json({ data: ALERTS, source: "seed" });
        }
      }

      case "oee":
        return NextResponse.json({
          trend: OEE_TREND_24H,
          sixBigLosses: SIX_BIG_LOSSES,
          plantKpis: PLANT_KPIS,
          machines: filterByPlant(MACHINES, plant),
        });

      case "energy":
        return NextResponse.json({
          trend: ENERGY_TREND,
          plantKpis: PLANT_KPIS,
        });

      default:
        return NextResponse.json({ error: "Unknown module" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
  }
}

// POST - Create new records
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  try {
    switch (action) {
      case "create-work-order": {
        const wo = await db.workOrder.create({
          data: {
            woNumber: body.woNumber || `WO-${Date.now()}`,
            orderNo: body.orderNo || `SO-${Date.now()}`,
            product: body.product || "New Product",
            customer: body.customer || "TBD",
            plantCode: body.plant || "K1",
            line: body.line || "FIN-LINE-A",
            qty: body.qty || 1,
            status: "released",
            priority: body.priority || "normal",
            startDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 86400000),
            currentStage: "Cutting",
            oee: 0,
          },
        });
        // Create audit entry
        await db.auditEntry.create({
          data: {
            auditId: `AU-${Date.now()}`,
            user: body.user || "System",
            role: body.role || "Planner",
            action: "create",
            module: "work-orders",
            entity: "WorkOrder",
            entityId: wo.woNumber,
            plantCode: body.plant || "K1",
            details: `Work order ${wo.woNumber} created for ${body.product || "New Product"}`,
            ipAddress: "10.0.0.1",
          },
        });
        return NextResponse.json({ success: true, data: wo });
      }

      case "acknowledge-alert": {
        const alert = await db.alert.update({
          where: { alertId: body.alertId },
          data: { acknowledged: true },
        });
        await db.auditEntry.create({
          data: {
            auditId: `AU-${Date.now()}`,
            user: body.user || "System",
            role: body.role || "Supervisor",
            action: "acknowledge",
            module: "alerts",
            entity: "Alert",
            entityId: body.alertId,
            details: `Alert ${body.alertId} acknowledged`,
            ipAddress: "10.0.0.1",
          },
        });
        return NextResponse.json({ success: true, data: alert });
      }

      case "create-ncr": {
        const ncr = await db.nCR.create({
          data: {
            ncrId: `NCR-${Date.now()}`,
            title: body.title || "New NCR",
            description: body.description || "",
            plantCode: body.plant || "K1",
            stage: body.stage || "Inspection",
            severity: body.severity || "minor",
            status: "open",
            source: body.source || "in-process",
            raisedBy: body.raisedBy || "System",
            affectedSerials: JSON.stringify(body.serials || []),
            affectedQty: body.affectedQty || 0,
            daysOpen: 0,
          },
        });
        await db.auditEntry.create({
          data: {
            auditId: `AU-${Date.now()}`,
            user: body.user || "System",
            role: body.role || "Quality Engineer",
            action: "create",
            module: "quality",
            entity: "NCR",
            entityId: ncr.ncrId,
            plantCode: body.plant || "K1",
            details: `NCR ${ncr.ncrId} raised: ${body.title}`,
            ipAddress: "10.0.0.1",
          },
        });
        return NextResponse.json({ success: true, data: ncr });
      }

      case "advance-ncr-status": {
        const ncr = await db.nCR.update({
          where: { ncrId: body.ncrId },
          data: { status: body.newStatus },
        });
        return NextResponse.json({ success: true, data: ncr });
      }

      case "create-maintenance": {
        const mo = await db.maintenanceOrder.create({
          data: {
            moId: `MT-${Date.now()}`,
            asset: body.asset || "Unknown Asset",
            plantCode: body.plant || "K1",
            type: body.type || "corrective",
            priority: body.priority || "normal",
            status: "open",
            dueDate: new Date(Date.now() + 7 * 86400000),
          },
        });
        return NextResponse.json({ success: true, data: mo });
      }

      case "update-wo-status": {
        const wo = await db.workOrder.update({
          where: { woNumber: body.woId },
          data: { status: body.newStatus },
        });
        await db.auditEntry.create({
          data: {
            auditId: `AU-${Date.now()}`,
            user: body.user || "System",
            role: body.role || "Supervisor",
            action: body.newStatus === "completed" ? "complete" : "update",
            module: "work-orders",
            entity: "WorkOrder",
            entityId: body.woId,
            details: `Work order ${body.woId} status changed to ${body.newStatus}`,
            ipAddress: "10.0.0.1",
          },
        });
        return NextResponse.json({ success: true, data: wo });
      }

      case "create-shift-entry": {
        const entry = await db.shiftHandoverEntry.create({
          data: {
            entryId: `SH-${Date.now()}`,
            shift: body.shift || "A",
            date: new Date().toISOString().split("T")[0],
            fromOperator: body.fromOperator || "System",
            toOperator: body.toOperator || "All",
            type: body.type || "note",
            title: body.title || "New Entry",
            details: body.details || "",
            plantCode: body.plant || "K1",
            priority: body.priority || "normal",
          },
        });
        return NextResponse.json({ success: true, data: entry });
      }

      case "acknowledge-shift-entry": {
        const entry = await db.shiftHandoverEntry.update({
          where: { entryId: body.entryId },
          data: { acknowledged: true },
        });
        return NextResponse.json({ success: true, data: entry });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API POST error:", error);
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
  }
}

// PATCH - Update records
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  try {
    switch (action) {
      case "update-work-order": {
        const wo = await db.workOrder.update({
          where: { woNumber: body.woId },
          data: {
            ...(body.status && { status: body.status }),
            ...(body.priority && { priority: body.priority }),
            ...(body.operator && { operator: body.operator }),
            ...(body.qtyDone !== undefined && { qtyDone: body.qtyDone }),
            ...(body.qtyScrap !== undefined && { qtyScrap: body.qtyScrap }),
            ...(body.progress !== undefined && { progress: body.progress }),
          },
        });
        return NextResponse.json({ success: true, data: wo });
      }

      case "update-machine-state": {
        const machine = await db.machine.update({
          where: { machineId: body.machineId },
          data: {
            ...(body.state && { state: body.state }),
            ...(body.oee !== undefined && { oee: body.oee }),
          },
        });
        return NextResponse.json({ success: true, data: machine });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API PATCH error:", error);
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
  }
}
