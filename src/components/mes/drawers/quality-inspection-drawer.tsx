"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyError, notifyInfo } from "@/lib/mes/toast";
import type { PlantCode, QualityResult } from "@/lib/mes/types";
import { ShieldCheck, AlertTriangle, CheckCircle2, Lock, ArrowRight, Gauge, Thermometer, Layers, Wrench, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualityInspectionDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultWoId?: string;
  defaultStage?: string;
}

export function QualityInspectionDrawer({
  open,
  onClose,
  defaultWoId,
  defaultStage = "Leak Test",
}: QualityInspectionDrawerProps) {
  const { workOrders, recordQualityInspection, operators } = useMESDataStore();

  const [selectedWoId, setSelectedWoId] = React.useState<string>(defaultWoId || "");
  const [stage, setStage] = React.useState<string>(defaultStage);
  const [inspector, setInspector] = React.useState<string>("P. Nair (Lead QC)");
  const [result, setResult] = React.useState<QualityResult>("pass");
  const [notes, setNotes] = React.useState<string>("");

  // Stage-specific parameters
  // Hydrostatic / Pneumatic Leak Test
  const [testPressure, setTestPressure] = React.useState<number>(2.0);
  const [holdDuration, setHoldDuration] = React.useState<number>(60);
  const [testMedium, setTestMedium] = React.useState<"Water" | "Oil" | "Air">("Water");
  const [gaugeId, setGaugeId] = React.useState<string>("PT-01 (Calibrated)");
  const [leakObserved, setLeakObserved] = React.useState<boolean>(false);

  // HDG Galvanizing DFT
  const [bathTemp, setBathTemp] = React.useState<number>(450);
  const [dwellTime, setDwellTime] = React.useState<number>(8.5);
  const [dftReadings, setDftReadings] = React.useState<number[]>([88, 92, 86, 90, 89]);

  // Painting DFT
  const [primerDft, setPrimerDft] = React.useState<number>(60);
  const [topcoatDft, setTopcoatDft] = React.useState<number>(82);
  const [cureTemp, setCureTemp] = React.useState<number>(180);
  const [adhesionPass, setAdhesionPass] = React.useState<boolean>(true);

  // Welding ISO 3834-2
  const [welderId, setWelderId] = React.useState<string>("W-04 (Ramakant S.)");
  const [wpsRef, setWpsRef] = React.useState<string>("WPS-HDR-02 (Seam)");
  const [weldCurrent, setWeldCurrent] = React.useState<number>(165);
  const [weldVoltage, setWeldVoltage] = React.useState<number>(22.4);
  const [gasFlow, setGasFlow] = React.useState<number>(14.5);

  React.useEffect(() => {
    if (defaultWoId) setSelectedWoId(defaultWoId);
    if (defaultStage) setStage(defaultStage);
  }, [defaultWoId, defaultStage]);

  const activeWO = workOrders.find(w => w.id === selectedWoId) || workOrders[0];

  const avgGalvDft = React.useMemo(() => {
    return Math.round(dftReadings.reduce((a, b) => a + b, 0) / dftReadings.length);
  }, [dftReadings]);

  const totalPaintDft = primerDft + topcoatDft;

  // Evaluate pass/fail compliance based on parameters
  React.useEffect(() => {
    if (stage === "Leak Test") {
      if (leakObserved || testPressure < 2.0 || holdDuration < 60) {
        setResult("fail");
      } else {
        setResult("pass");
      }
    } else if (stage === "Galvanizing") {
      if (avgGalvDft < 86 || bathTemp < 440 || bathTemp > 460) {
        setResult("fail");
      } else {
        setResult("pass");
      }
    } else if (stage === "Painting") {
      if (totalPaintDft < 140 || !adhesionPass) {
        setResult("fail");
      } else {
        setResult("pass");
      }
    } else if (stage === "Welding") {
      const isQualified = !welderId.includes("Expired");
      setResult(isQualified ? "pass" : "fail");
    }
  }, [stage, leakObserved, testPressure, holdDuration, avgGalvDft, bathTemp, totalPaintDft, adhesionPass, welderId]);

  const handleSubmit = () => {
    const targetSerial = selectedWoId || activeWO?.id || "WO-2400";
    const plant: PlantCode = activeWO?.plant || "K1";

    let measuredValue: number | undefined;
    let specText = "";
    let unitText = "";

    if (stage === "Leak Test") {
      measuredValue = testPressure;
      specText = "≥ 2.0 bar · 60s hold";
      unitText = "bar";
    } else if (stage === "Galvanizing") {
      measuredValue = avgGalvDft;
      specText = "ISO 1461 min 86 μm";
      unitText = "μm";
    } else if (stage === "Painting") {
      measuredValue = totalPaintDft;
      specText = "min 140 μm (60+80)";
      unitText = "μm";
    } else if (stage === "Welding") {
      measuredValue = weldCurrent;
      specText = `${wpsRef} · 160-170A`;
      unitText = "A";
    } else {
      measuredValue = 100;
      specText = "Spec conforming";
      unitText = "%";
    }

    const res = recordQualityInspection({
      serial: targetSerial,
      stage,
      inspector,
      result,
      value: measuredValue,
      spec: specText,
      unit: unitText,
      plant,
      notes: notes || `Recorded via Quality Inspection Gateway for ${targetSerial}`,
    });

    if (result === "pass") {
      notifySuccess(
        "Quality Gate Passed",
        `${stage} inspection passed for ${targetSerial}. Digital signature stamped and stage unlocked.`
      );
    } else {
      notifyError(
        "Quality Gate Blocked · Non-Conformance Raised",
        `${stage} failed for ${targetSerial}. Unit quarantined with Red Hold tag. Raised ${res.ncrId}.`
      );
    }

    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Quality Gate Enforcement · Enforce, Don&apos;t Just Record</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight">
            Record Inspection &amp; Gate Verification
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Enforces strict ISO 3834-2, ISO 1461, and OEM hydrostatic pressure parameters. Failed gates lock progression and auto-generate 8D NCRs.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 p-6 text-xs">
          {/* Target Work Order & Stage Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Target Work Order / Serial
              </label>
              <select
                value={selectedWoId}
                onChange={(e) => setSelectedWoId(e.target.value)}
                className="w-full h-9 rounded border border-border bg-background px-3 font-mono font-bold text-xs"
              >
                {workOrders.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.id} · {w.orderNo} ({w.customer} - {w.product})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Inspection Stage / Quality Gate
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full h-9 rounded border border-border bg-background px-3 font-semibold text-xs"
              >
                <option value="Leak Test">Leak / Pressure Test (2.0 bar Gate)</option>
                <option value="Galvanizing">Hot-Dip Galvanizing DFT (ISO 1461 Gate)</option>
                <option value="Painting">Epoxy Painting &amp; Coating DFT Gate</option>
                <option value="Welding">Welding ISO 3834-2 &amp; WPS Compliance Gate</option>
                <option value="Cutting">Cutting &amp; Shearing Dimensional Gate</option>
                <option value="Forming">Fin Forming &amp; Pitch Tolerance Gate</option>
                <option value="Final QC">Final QC &amp; IRN Inspection Gate</option>
              </select>
            </div>
          </div>

          {/* Inspector & Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Inspector ID &amp; Signature
              </label>
              <input
                type="text"
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                className="w-full h-9 rounded border border-border bg-background px-3 font-medium text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Inspection Instrument / Calibration Status
              </label>
              <div className="flex items-center gap-2 h-9 px-3 rounded border border-border bg-muted/20 font-mono text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold">NABL Calibrated · Valid (ISO 17025)</span>
              </div>
            </div>
          </div>

          {/* PARAMETER SPECIFICATION FORMS */}
          {stage === "Leak Test" && (
            <div className="rounded-lg border-2 border-primary/40 bg-card p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span className="font-bold text-xs uppercase tracking-wider">Hydrostatic Leak Testing Parameters</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded">Standard Spec: 2.0 bar / 60s</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Test Pressure (bar)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={testPressure}
                    onChange={(e) => setTestPressure(parseFloat(e.target.value) || 0)}
                    className="h-8 font-mono font-bold text-sm"
                  />
                  <span className="text-[9px] text-muted-foreground">Min required: 2.0 bar</span>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Dwell Duration (sec)</label>
                  <Input
                    type="number"
                    value={holdDuration}
                    onChange={(e) => setHoldDuration(parseInt(e.target.value) || 0)}
                    className="h-8 font-mono font-bold text-sm"
                  />
                  <span className="text-[9px] text-muted-foreground">Min hold: 60 seconds</span>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Test Medium</label>
                  <select
                    value={testMedium}
                    onChange={(e) => setTestMedium(e.target.value as any)}
                    className="w-full h-8 rounded border border-border bg-background px-2 text-xs"
                  >
                    <option value="Water">Underwater Immersion</option>
                    <option value="Air">Dry Air Decay</option>
                    <option value="Oil">Transformer Mineral Oil</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded border border-border bg-muted/10">
                <div>
                  <div className="font-bold text-xs">Pinhole Leak / Seam Seepage Detected?</div>
                  <div className="text-[10px] text-muted-foreground">Underwater bubbles or pressure decay observed during dwell</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLeakObserved(false)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-bold transition-all",
                      !leakObserved ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
                    )}
                  >
                    Zero Leaks (PASS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeakObserved(true)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-bold transition-all",
                      leakObserved ? "bg-destructive text-destructive-foreground" : "border border-border text-muted-foreground"
                    )}
                  >
                    Leak Found (FAIL)
                  </button>
                </div>
              </div>
            </div>
          )}

          {stage === "Galvanizing" && (
            <div className="rounded-lg border-2 border-primary/40 bg-card p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-primary" />
                  <span className="font-bold text-xs uppercase tracking-wider">Hot-Dip Galvanizing (HDG) Parameters</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded">ISO 1461 / ASTM A123: ≥ 86 μm</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Zinc Kettle Temp (°C)</label>
                  <Input
                    type="number"
                    value={bathTemp}
                    onChange={(e) => setBathTemp(parseInt(e.target.value) || 0)}
                    className="h-8 font-mono font-bold text-sm"
                  />
                  <span className="text-[9px] text-muted-foreground">Process Window: 445°C - 455°C</span>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Immersion Dwell (min)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={dwellTime}
                    onChange={(e) => setDwellTime(parseFloat(e.target.value) || 0)}
                    className="h-8 font-mono font-bold text-sm"
                  />
                  <span className="text-[9px] text-muted-foreground">Standard: 8.0 - 9.5 min</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  5-Point Dry Film Thickness (DFT) Measurements (μm)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {dftReadings.map((val, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-[9px] text-muted-foreground mb-1">Point {idx + 1}</div>
                      <Input
                        type="number"
                        value={val}
                        onChange={(e) => {
                          const n = [...dftReadings];
                          n[idx] = parseInt(e.target.value) || 0;
                          setDftReadings(n);
                        }}
                        className="h-8 text-center font-mono font-bold text-xs"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between bg-muted/20 p-2 rounded border border-border">
                  <span className="text-[11px] font-semibold">Average Coating DFT:</span>
                  <span className={cn("text-base font-mono font-black", avgGalvDft >= 86 ? "text-primary" : "text-destructive")}>
                    {avgGalvDft} μm {avgGalvDft >= 86 ? "(Conforming)" : "(Below 86 μm Spec)"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {stage === "Painting" && (
            <div className="rounded-lg border-2 border-primary/40 bg-card p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="font-bold text-xs uppercase tracking-wider">Epoxy Paint &amp; Polyurethane Coating Gate</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded">Total Spec: ≥ 140 μm</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Primer DFT (μm)</label>
                  <Input
                    type="number"
                    value={primerDft}
                    onChange={(e) => setPrimerDft(parseInt(e.target.value) || 0)}
                    className="h-8 font-mono font-bold text-sm"
                  />
                  <span className="text-[9px] text-muted-foreground">Spec: 60 μm</span>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">PU Topcoat DFT (μm)</label>
                  <Input
                    type="number"
                    value={topcoatDft}
                    onChange={(e) => setTopcoatDft(parseInt(e.target.value) || 0)}
                    className="h-8 font-mono font-bold text-sm"
                  />
                  <span className="text-[9px] text-muted-foreground">Spec: 80 μm</span>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Cure Oven Temp (°C)</label>
                  <Input
                    type="number"
                    value={cureTemp}
                    onChange={(e) => setCureTemp(parseInt(e.target.value) || 0)}
                    className="h-8 font-mono font-bold text-sm"
                  />
                  <span className="text-[9px] text-muted-foreground">Target: 180°C</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded border border-border bg-muted/10">
                <div>
                  <div className="font-bold text-xs">Cross-Hatch Adhesion Test (ASTM D3359)</div>
                  <div className="text-[10px] text-muted-foreground">Adhesion lattice rated Class 4B or 5B</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdhesionPass(!adhesionPass)}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-bold transition-all",
                    adhesionPass ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                  )}
                >
                  {adhesionPass ? "Pass (5B)" : "Fail (Lifting)"}
                </button>
              </div>

              <div className="flex items-center justify-between bg-muted/20 p-2 rounded border border-border">
                <span className="text-[11px] font-semibold">Total Paint DFT (Primer + Topcoat):</span>
                <span className={cn("text-base font-mono font-black", totalPaintDft >= 140 ? "text-primary" : "text-destructive")}>
                  {totalPaintDft} μm {totalPaintDft >= 140 ? "(Conforming)" : "(Below 140 μm Spec)"}
                </span>
              </div>
            </div>
          )}

          {stage === "Welding" && (
            <div className="rounded-lg border-2 border-primary/40 bg-card p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" />
                  <span className="font-bold text-xs uppercase tracking-wider">Welding Quality (ISO 3834-2 &amp; WPS Compliance)</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded">Welder Cert Active</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Welder Assignment</label>
                  <select
                    value={welderId}
                    onChange={(e) => setWelderId(e.target.value)}
                    className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-medium"
                  >
                    <option value="W-04 (Ramakant S.)">Ramakant S. · EN ISO 9606 Valid</option>
                    <option value="W-02 (Amit Patil)">Amit Patil · ASME Sec IX Valid</option>
                    <option value="W-09 (Dinesh K. - Expired)">Dinesh K. · [EXPIRED 15-Jan]</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Approved WPS Reference</label>
                  <select
                    value={wpsRef}
                    onChange={(e) => setWpsRef(e.target.value)}
                    className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-mono"
                  >
                    <option value="WPS-HDR-02 (Seam)">WPS-HDR-02 (Seam Weld)</option>
                    <option value="WPS-FIN-01 (TIG)">WPS-FIN-01 (TIG Header Pipe)</option>
                    <option value="WPS-TNK-04 (MIG)">WPS-TNK-04 (Tank Flange)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-0.5">Weld Current (A)</label>
                  <Input
                    type="number"
                    value={weldCurrent}
                    onChange={(e) => setWeldCurrent(parseInt(e.target.value) || 0)}
                    className="h-8 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-0.5">Arc Voltage (V)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={weldVoltage}
                    onChange={(e) => setWeldVoltage(parseFloat(e.target.value) || 0)}
                    className="h-8 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-0.5">Shielding Gas (L/m)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={gasFlow}
                    onChange={(e) => setGasFlow(parseFloat(e.target.value) || 0)}
                    className="h-8 font-mono text-xs"
                  />
                </div>
              </div>

              {welderId.includes("Expired") && (
                <div className="flex items-center gap-2 p-2.5 rounded bg-destructive/10 border border-destructive text-destructive text-[11px] font-semibold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>ISO 3834-2 Violation: Selected operator certification has expired. Automatic gate lock will be engaged!</span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
              Inspection Notes / Visual Observations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Visual weld bead uniform, zero porosity, surface blasted to Sa 2.5 profile..."
              className="w-full rounded border border-border bg-background p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Gate Status Outcome Banner */}
          <div className={cn(
            "p-4 rounded-lg border flex items-center justify-between gap-3",
            result === "pass" ? "bg-primary/10 border-primary" : "bg-destructive/10 border-destructive"
          )}>
            <div className="flex items-center gap-3">
              {result === "pass" ? (
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
              ) : (
                <Lock className="h-6 w-6 text-destructive shrink-0" />
              )}
              <div>
                <div className={cn("text-sm font-bold uppercase tracking-wide", result === "pass" ? "text-primary" : "text-destructive")}>
                  {result === "pass" ? "Quality Gate Verification: PASS" : "Quality Gate Verification: BLOCKED (FAIL)"}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {result === "pass"
                    ? "Unit is certified conforming. Stage progression enabled."
                    : "Failure will place unit on HOLD, route to rework, and raise an official 8D NCR."}
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className={cn(result === "fail" && "bg-destructive hover:bg-destructive/90 text-destructive-foreground")}
          >
            {result === "pass" ? "Authorize & Stamp Gate Pass" : "Enforce Quality Hold & Raise NCR"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
