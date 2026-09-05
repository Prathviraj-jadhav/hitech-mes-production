"use client";

import * as React from "react";
import { QualityInspectionDrawer } from "./quality-inspection-drawer";
import { TraceabilitySpineDrawer } from "./traceability-spine-drawer";
import { ExceptionTriageDrawer } from "./exception-triage-drawer";
import { PlanningRushOrderModal } from "./planning-rush-order-modal";
import { MaterialIntakeDrawer } from "./material-intake-drawer";
import { MaintenanceOrderDrawer } from "./maintenance-order-drawer";
import { CalibrationLockoutDrawer } from "./calibration-lockout-drawer";
import { ShiftHandoverDrawer } from "./shift-handover-drawer";
import { FishboneRcaDrawer } from "./fishbone-rca-drawer";
import { DispatchManifestDrawer } from "./dispatch-manifest-drawer";
import { CoqRoiCalculatorDrawer } from "./coq-roi-calculator-drawer";
import { WipExpediteDrawer } from "./wip-expedite-drawer";
import { EnergyLoadShedDrawer } from "./energy-load-shed-drawer";
import type { CalibrationItem, RootCauseAnalysis, Shipment, WIPItem } from "@/lib/mes/types";
import type { ExceptionItem } from "@/lib/mes/data-store";

export function GlobalDrawers() {
  // Quality Inspection
  const [inspectionState, setInspectionState] = React.useState<{ open: boolean; woId?: string; stage?: string }>({ open: false });
  // Traceability
  const [traceabilityState, setTraceabilityState] = React.useState<{ open: boolean; serial: string }>({ open: false, serial: "WO-2400" });
  // Rush Order
  const [rushOrderOpen, setRushOrderOpen] = React.useState(false);
  // Material Intake
  const [materialIntakeOpen, setMaterialIntakeOpen] = React.useState(false);
  // Maintenance Order
  const [maintenanceState, setMaintenanceState] = React.useState<{ open: boolean; asset?: string }>({ open: false });
  // Calibration
  const [calibrationState, setCalibrationState] = React.useState<{ open: boolean; item: CalibrationItem | null }>({ open: false, item: null });
  // Shift Handover
  const [shiftHandoverOpen, setShiftHandoverOpen] = React.useState(false);
  // Fishbone RCA
  const [rcaState, setRcaState] = React.useState<{ open: boolean; rca: RootCauseAnalysis | null }>({ open: false, rca: null });
  // Dispatch Manifest
  const [dispatchState, setDispatchState] = React.useState<{ open: boolean; shipment: Shipment | null }>({ open: false, shipment: null });
  // CoQ ROI Calculator
  const [coqRoiOpen, setCoqRoiOpen] = React.useState(false);
  // WIP Expedite
  const [wipState, setWipState] = React.useState<{ open: boolean; item: WIPItem | null }>({ open: false, item: null });
  // Energy Load Shedding
  const [energyLoadShedOpen, setEnergyLoadShedOpen] = React.useState(false);
  // Exception Triage
  const [exceptionState, setExceptionState] = React.useState<{ open: boolean; exception: ExceptionItem | null }>({ open: false, exception: null });

  React.useEffect(() => {
    const handleInspection = (e: any) => {
      setInspectionState({
        open: true,
        woId: e.detail?.woId,
        stage: e.detail?.stage || "Leak Test",
      });
    };
    const handleTraceability = (e: any) => {
      setTraceabilityState({
        open: true,
        serial: e.detail?.serial || "WO-2400",
      });
    };
    const handleRushOrder = () => setRushOrderOpen(true);
    const handleMaterialIntake = () => setMaterialIntakeOpen(true);
    const handleMaintenance = (e: any) => setMaintenanceState({ open: true, asset: e.detail?.asset });
    const handleCalibration = (e: any) => setCalibrationState({ open: true, item: e.detail?.item || null });
    const handleHandover = () => setShiftHandoverOpen(true);
    const handleRca = (e: any) => setRcaState({ open: true, rca: e.detail?.rca || null });
    const handleDispatch = (e: any) => setDispatchState({ open: true, shipment: e.detail?.shipment || null });
    const handleCoqRoi = () => setCoqRoiOpen(true);
    const handleWipExpedite = (e: any) => setWipState({ open: true, item: e.detail?.item || null });
    const handleEnergy = () => setEnergyLoadShedOpen(true);
    const handleException = (e: any) => setExceptionState({ open: true, exception: e.detail?.exception || null });

    window.addEventListener("mes:open-inspection", handleInspection);
    window.addEventListener("mes:open-traceability", handleTraceability);
    window.addEventListener("mes:open-rush-order", handleRushOrder);
    window.addEventListener("mes:open-material-intake", handleMaterialIntake);
    window.addEventListener("mes:open-maintenance", handleMaintenance);
    window.addEventListener("mes:open-calibration", handleCalibration);
    window.addEventListener("mes:open-handover", handleHandover);
    window.addEventListener("mes:open-rca", handleRca);
    window.addEventListener("mes:open-dispatch", handleDispatch);
    window.addEventListener("mes:open-coq-roi", handleCoqRoi);
    window.addEventListener("mes:open-wip-expedite", handleWipExpedite);
    window.addEventListener("mes:open-load-shed", handleEnergy);
    window.addEventListener("mes:open-exception-triage", handleException);

    return () => {
      window.removeEventListener("mes:open-inspection", handleInspection);
      window.removeEventListener("mes:open-traceability", handleTraceability);
      window.removeEventListener("mes:open-rush-order", handleRushOrder);
      window.removeEventListener("mes:open-material-intake", handleMaterialIntake);
      window.removeEventListener("mes:open-maintenance", handleMaintenance);
      window.removeEventListener("mes:open-calibration", handleCalibration);
      window.removeEventListener("mes:open-handover", handleHandover);
      window.removeEventListener("mes:open-rca", handleRca);
      window.removeEventListener("mes:open-dispatch", handleDispatch);
      window.removeEventListener("mes:open-coq-roi", handleCoqRoi);
      window.removeEventListener("mes:open-wip-expedite", handleWipExpedite);
      window.removeEventListener("mes:open-load-shed", handleEnergy);
      window.removeEventListener("mes:open-exception-triage", handleException);
    };
  }, []);

  return (
    <>
      <QualityInspectionDrawer
        open={inspectionState.open}
        onClose={() => setInspectionState(s => ({ ...s, open: false }))}
        defaultWoId={inspectionState.woId}
        defaultStage={inspectionState.stage}
      />
      <TraceabilitySpineDrawer
        open={traceabilityState.open}
        onClose={() => setTraceabilityState(s => ({ ...s, open: false }))}
        serial={traceabilityState.serial}
      />
      <PlanningRushOrderModal
        open={rushOrderOpen}
        onClose={() => setRushOrderOpen(false)}
      />
      <MaterialIntakeDrawer
        open={materialIntakeOpen}
        onClose={() => setMaterialIntakeOpen(false)}
      />
      <MaintenanceOrderDrawer
        open={maintenanceState.open}
        onClose={() => setMaintenanceState(s => ({ ...s, open: false }))}
        defaultAsset={maintenanceState.asset}
      />
      <CalibrationLockoutDrawer
        open={calibrationState.open}
        onClose={() => setCalibrationState(s => ({ ...s, open: false }))}
        item={calibrationState.item}
      />
      <ShiftHandoverDrawer
        open={shiftHandoverOpen}
        onClose={() => setShiftHandoverOpen(false)}
      />
      <FishboneRcaDrawer
        open={rcaState.open}
        onClose={() => setRcaState(s => ({ ...s, open: false }))}
        rca={rcaState.rca}
      />
      <DispatchManifestDrawer
        open={dispatchState.open}
        onClose={() => setDispatchState(s => ({ ...s, open: false }))}
        shipment={dispatchState.shipment}
      />
      <CoqRoiCalculatorDrawer
        open={coqRoiOpen}
        onClose={() => setCoqRoiOpen(false)}
      />
      <WipExpediteDrawer
        open={wipState.open}
        onClose={() => setWipState(s => ({ ...s, open: false }))}
        item={wipState.item}
      />
      <EnergyLoadShedDrawer
        open={energyLoadShedOpen}
        onClose={() => setEnergyLoadShedOpen(false)}
      />
      <ExceptionTriageDrawer
        open={exceptionState.open}
        onClose={() => setExceptionState(s => ({ ...s, open: false }))}
        exception={exceptionState.exception}
      />
    </>
  );
}
