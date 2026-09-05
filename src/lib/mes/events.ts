"use client";

import type { CalibrationItem, RootCauseAnalysis, Shipment, WIPItem } from "./types";
import type { ExceptionItem } from "./data-store";

export function openQualityInspection(woId?: string, stage?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-inspection", { detail: { woId, stage } }));
  }
}

export function openTraceability(serial: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-traceability", { detail: { serial } }));
  }
}

export function openRushOrderModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-rush-order"));
  }
}

export function openMaterialIntake() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-material-intake"));
  }
}

export function openMaintenanceOrder(asset?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-maintenance", { detail: { asset } }));
  }
}

export function openCalibrationLockout(item?: CalibrationItem | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-calibration", { detail: { item } }));
  }
}

export function openShiftHandover() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-handover"));
  }
}

export function openFishboneRca(rca?: RootCauseAnalysis | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-rca", { detail: { rca } }));
  }
}

export function openDispatchManifest(shipment?: Shipment | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-dispatch", { detail: { shipment } }));
  }
}

export function openCoqRoiCalculator() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-coq-roi"));
  }
}

export function openWipExpedite(item?: WIPItem | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-wip-expedite", { detail: { item } }));
  }
}

export function openEnergyLoadShed() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-load-shed"));
  }
}

export function openExceptionTriage(exception?: ExceptionItem | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mes:open-exception-triage", { detail: { exception } }));
  }
}
