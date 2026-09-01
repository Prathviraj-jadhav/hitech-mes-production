import { db } from "../src/lib/db";

// Import seed data from the existing seed file
import {
  KPIS, PLANT_KPIS, WORK_ORDERS, MACHINES, QUALITY_RECORDS,
  INVENTORY, MAINTENANCE, OPERATORS_DATA, TRACE_EVENTS, ALERTS,
  NCRS, SHIFT_HANDOVER, DOCUMENTS, SUPPLIERS, AUDIT_TRAIL,
  CUSTOMER_ORDERS, SHIPMENTS, CALIBRATION_ITEMS, COST_OF_QUALITY,
  ROOT_CAUSES,
} from "../src/lib/mes/seed";
import { PLANTS } from "../src/lib/mes/store";

async function main() {
  console.log("Starting database seed...");

  // Clean existing data
  console.log("Cleaning existing data...");
  await db.auditEntry.deleteMany();
  await db.costOfQualityItem.deleteMany();
  await db.rootCauseAnalysis.deleteMany();
  await db.customerOrder.deleteMany();
  await db.supplier.deleteMany();
  await db.document.deleteMany();
  await db.shiftHandoverEntry.deleteMany();
  await db.calibrationItem.deleteMany();
  await db.shipment.deleteMany();
  await db.maintenanceOrder.deleteMany();
  await db.nCR.deleteMany();
  await db.alert.deleteMany();
  await db.traceEvent.deleteMany();
  await db.qualityRecord.deleteMany();
  await db.inventoryItem.deleteMany();
  await db.machine.deleteMany();
  await db.operator.deleteMany();
  await db.workOrder.deleteMany();
  await db.plant.deleteMany();

  // Seed Plants
  console.log("Seeding plants...");
  for (const p of PLANTS) {
    await db.plant.create({
      data: {
        code: p.code,
        name: p.name,
        location: p.location,
        since: p.since,
        role: p.role,
        lines: JSON.stringify(p.lines),
      },
    });
  }

  // Seed Work Orders
  console.log("Seeding work orders...");
  for (const w of WORK_ORDERS) {
    await db.workOrder.create({
      data: {
        woNumber: w.id,
        orderNo: w.orderNo,
        product: w.product,
        customer: w.customer,
        plantCode: w.plant,
        line: w.line,
        qty: w.qty,
        qtyDone: w.qtyDone,
        qtyScrap: w.qtyScrap,
        status: w.status,
        priority: w.priority,
        startDate: new Date(w.startDate),
        dueDate: new Date(w.dueDate),
        progress: w.progress,
        heatNumber: w.heatNumber || null,
        currentStage: w.currentStage,
        operator: w.operator || null,
        oee: w.oee,
      },
    });
  }

  // Seed Machines
  console.log("Seeding machines...");
  for (const m of MACHINES) {
    await db.machine.create({
      data: {
        machineId: m.id,
        name: m.name,
        plantCode: m.plant,
        line: m.line,
        type: m.type,
        state: m.state,
        oee: m.oee,
        availability: m.availability,
        performance: m.performance,
        quality: m.quality,
        cycleTime: m.cycleTime,
        idealCycle: m.idealCycle,
        parameters: JSON.stringify(m.parameters),
      },
    });
  }

  // Seed Inventory
  console.log("Seeding inventory...");
  for (const i of INVENTORY) {
    await db.inventoryItem.create({
      data: {
        sku: i.sku,
        description: i.description,
        type: i.type,
        plantCode: i.plant,
        location: i.location,
        quantity: i.quantity,
        unit: i.unit,
        heatNumber: i.heatNumber || null,
        supplier: i.supplier || null,
        reorderLevel: i.reorderLevel,
        lastMovement: new Date(i.lastMovement),
      },
    });
  }

  // Seed Quality Records
  console.log("Seeding quality records...");
  for (const q of QUALITY_RECORDS) {
    await db.qualityRecord.create({
      data: {
        qcId: q.id,
        serial: q.serial,
        stage: q.stage,
        inspector: q.inspector,
        result: q.result,
        value: q.value || null,
        spec: q.spec || null,
        unit: q.unit || null,
        timestamp: new Date(q.timestamp),
        plantCode: q.plant,
        notes: q.notes || null,
      },
    });
  }

  // Seed Trace Events
  console.log("Seeding trace events...");
  for (const e of TRACE_EVENTS) {
    await db.traceEvent.create({
      data: {
        eventId: e.id,
        serial: e.serial,
        stage: e.stage,
        timestamp: new Date(e.timestamp),
        operator: e.operator,
        machine: e.machine,
        result: e.result,
        data: JSON.stringify(e.data),
      },
    });
  }

  // Seed Operators
  console.log("Seeding operators...");
  for (const o of OPERATORS_DATA) {
    await db.operator.create({
      data: {
        operatorId: o.id,
        name: o.name,
        role: o.role,
        plantCode: o.plant,
        certifications: JSON.stringify(o.certifications),
        skills: JSON.stringify(o.skills),
        shift: o.shift,
        productivity: o.productivity,
        utilization: o.utilization,
      },
    });
  }

  // Seed Alerts
  console.log("Seeding alerts...");
  for (const a of ALERTS) {
    await db.alert.create({
      data: {
        alertId: a.id,
        severity: a.severity,
        module: a.module,
        title: a.title,
        description: a.description,
        plantCode: a.plant || null,
        timestamp: new Date(a.timestamp),
        acknowledged: a.acknowledged,
      },
    });
  }

  // Seed NCRs
  console.log("Seeding NCRs...");
  for (const n of NCRS) {
    await db.nCR.create({
      data: {
        ncrId: n.id,
        title: n.title,
        description: n.description,
        plantCode: n.plant,
        stage: n.stage,
        severity: n.severity,
        status: n.status,
        source: n.source,
        raisedBy: n.raisedBy,
        raisedAt: new Date(n.raisedAt),
        affectedSerials: JSON.stringify(n.affectedSerials),
        affectedQty: n.affectedQty,
        rootCause: n.rootCause || null,
        capaAction: n.capaAction || null,
        capaOwner: n.capaOwner || null,
        capaDue: n.capaDue ? new Date(n.capaDue) : null,
        containmentAction: n.containmentAction || null,
        daysOpen: n.daysOpen,
      },
    });
  }

  // Seed Maintenance Orders
  console.log("Seeding maintenance orders...");
  for (const m of MAINTENANCE) {
    await db.maintenanceOrder.create({
      data: {
        moId: m.id,
        asset: m.asset,
        plantCode: m.plant,
        type: m.type,
        priority: m.priority,
        status: m.status,
        assignedTo: m.assignedTo || null,
        dueDate: new Date(m.dueDate),
        mtbf: m.mtbf || null,
        mttr: m.mttr || null,
      },
    });
  }

  // Seed Shipments
  console.log("Seeding shipments...");
  for (const s of SHIPMENTS) {
    await db.shipment.create({
      data: {
        manifestNo: s.manifestNo,
        customer: s.customer,
        orderNo: s.orderNo,
        plantCode: s.plant,
        destination: s.destination,
        carrier: s.carrier,
        vehicleNo: s.vehicleNo,
        driver: s.driver,
        lrNo: s.lrNo,
        status: s.status,
        units: s.units,
        weight: s.weight,
        value: s.value,
        loadingDate: new Date(s.loadingDate),
        eta: new Date(s.eta),
        deliveredDate: s.deliveredDate ? new Date(s.deliveredDate) : null,
        documents: JSON.stringify(s.documents),
        coordinates: s.coordinates ? JSON.stringify(s.coordinates) : null,
      },
    });
  }

  // Seed Calibration Items
  console.log("Seeding calibration items...");
  for (const c of CALIBRATION_ITEMS) {
    await db.calibrationItem.create({
      data: {
        calId: c.id,
        instrument: c.instrument,
        tag: c.tag,
        plantCode: c.plant,
        location: c.location,
        type: c.type,
        range: c.range,
        accuracy: c.accuracy,
        lastCalibrated: new Date(c.lastCalibrated),
        nextDue: new Date(c.nextDue),
        frequency: c.frequency,
        status: c.status,
        certNo: c.certNo,
        vendor: c.vendor,
        criticality: c.criticality,
      },
    });
  }

  // Seed Shift Handover Entries
  console.log("Seeding shift handover entries...");
  for (const e of SHIFT_HANDOVER) {
    await db.shiftHandoverEntry.create({
      data: {
        entryId: e.id,
        shift: e.shift,
        date: e.date,
        fromOperator: e.fromOperator,
        toOperator: e.toOperator,
        type: e.type,
        title: e.title,
        details: e.details,
        plantCode: e.plant,
        priority: e.priority,
        acknowledged: e.acknowledged,
        timestamp: new Date(e.timestamp),
      },
    });
  }

  // Seed Documents
  console.log("Seeding documents...");
  for (const d of DOCUMENTS) {
    await db.document.create({
      data: {
        docId: d.id,
        name: d.name,
        type: d.type,
        status: d.status,
        revision: d.revision,
        effective: d.effective,
        review: d.review,
        owner: d.owner,
      },
    });
  }

  // Seed Suppliers
  console.log("Seeding suppliers...");
  for (const s of SUPPLIERS) {
    await db.supplier.create({
      data: {
        supplierId: s.id,
        name: s.name,
        category: s.category,
        rating: s.rating,
        tier: s.tier,
        onTimeDelivery: s.onTimeDelivery,
        qualityAcceptance: s.qualityAcceptance,
        defectPpm: s.defectPpm,
        totalOrders: s.totalOrders,
        openNCRs: s.openNCRs,
        lastDelivery: new Date(s.lastDelivery),
        contact: s.contact,
        location: s.location,
        trend: JSON.stringify(s.trend),
      },
    });
  }

  // Seed Audit Trail
  console.log("Seeding audit trail...");
  for (const a of AUDIT_TRAIL) {
    await db.auditEntry.create({
      data: {
        auditId: a.id,
        timestamp: new Date(a.timestamp),
        user: a.user,
        role: a.role,
        action: a.action,
        module: a.module,
        entity: a.entity,
        entityId: a.entityId,
        plantCode: a.plant || null,
        details: a.details,
        ipAddress: a.ipAddress,
      },
    });
  }

  // Seed Customer Orders
  console.log("Seeding customer orders...");
  for (const o of CUSTOMER_ORDERS) {
    await db.customerOrder.create({
      data: {
        orderId: o.id,
        customer: o.customer,
        orderNo: o.orderNo,
        product: o.product,
        qty: o.qty,
        dispatchedQty: o.dispatchedQty,
        status: o.status,
        poDate: o.poDate,
        promisedDate: o.promisedDate,
        dispatchedDate: o.dispatchedDate || null,
        deliveryLocation: o.deliveryLocation,
        endTransformer: o.endTransformer || null,
        serials: JSON.stringify(o.serials),
        documentation: JSON.stringify(o.documentation),
      },
    });
  }

  // Seed Cost of Quality
  console.log("Seeding cost of quality items...");
  for (const c of COST_OF_QUALITY) {
    await db.costOfQualityItem.create({
      data: {
        coqId: c.id,
        category: c.category,
        description: c.description,
        plantCode: c.plant,
        amount: c.amount,
        period: c.period,
        trend: c.trend,
        details: c.details || null,
      },
    });
  }

  // Seed Root Cause Analyses
  console.log("Seeding root cause analyses...");
  for (const r of ROOT_CAUSES) {
    await db.rootCauseAnalysis.create({
      data: {
        rcaId: r.id,
        title: r.title,
        problem: r.problem,
        ncrRef: r.ncrRef || null,
        plantCode: r.plant,
        stage: r.stage,
        facilitator: r.facilitator,
        participants: JSON.stringify(r.participants),
        date: new Date(r.date),
        status: r.status,
        rootCause: r.rootCause,
        whys: JSON.stringify(r.whys),
        correctiveAction: r.correctiveAction,
        preventiveAction: r.preventiveAction,
        owner: r.owner,
        dueDate: new Date(r.dueDate),
        effectiveness: r.effectiveness || null,
      },
    });
  }

  console.log("Database seed completed successfully!");
  console.log("Summary:");
  console.log(`  Plants: ${PLANTS.length}`);
  console.log(`  Work Orders: ${WORK_ORDERS.length}`);
  console.log(`  Machines: ${MACHINES.length}`);
  console.log(`  Inventory Items: ${INVENTORY.length}`);
  console.log(`  Quality Records: ${QUALITY_RECORDS.length}`);
  console.log(`  Trace Events: ${TRACE_EVENTS.length}`);
  console.log(`  Operators: ${OPERATORS_DATA.length}`);
  console.log(`  Alerts: ${ALERTS.length}`);
  console.log(`  NCRs: ${NCRS.length}`);
  console.log(`  Maintenance Orders: ${MAINTENANCE.length}`);
  console.log(`  Shipments: ${SHIPMENTS.length}`);
  console.log(`  Calibration Items: ${CALIBRATION_ITEMS.length}`);
  console.log(`  Shift Handover Entries: ${SHIFT_HANDOVER.length}`);
  console.log(`  Documents: ${DOCUMENTS.length}`);
  console.log(`  Suppliers: ${SUPPLIERS.length}`);
  console.log(`  Audit Entries: ${AUDIT_TRAIL.length}`);
  console.log(`  Customer Orders: ${CUSTOMER_ORDERS.length}`);
  console.log(`  Cost of Quality Items: ${COST_OF_QUALITY.length}`);
  console.log(`  Root Cause Analyses: ${ROOT_CAUSES.length}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
