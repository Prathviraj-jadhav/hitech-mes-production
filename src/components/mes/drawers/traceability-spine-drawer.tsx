"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyError, notifyInfo } from "@/lib/mes/toast";
import { formatDateTime, formatDate } from "@/lib/mes/date-utils";
import {
  Workflow, Download, ShieldCheck, CheckCircle2, Lock, AlertTriangle,
  Printer, ExternalLink, Factory, Cpu, FileText, User, Layers, ArrowRight, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TraceabilitySpineDrawerProps {
  open: boolean;
  onClose: () => void;
  serial: string;
}

export function TraceabilitySpineDrawer({ open, onClose, serial }: TraceabilitySpineDrawerProps) {
  const { workOrders, traceEvents, containSuspectBatch, qualityRecords } = useMESDataStore();
  const [showCoCModal, setShowCoCModal] = React.useState(false);
  const [containmentReason, setContainmentReason] = React.useState("Suspect micro-fissuring in coil heat batch");

  const wo = workOrders.find(w => w.id === serial) || workOrders[0];
  const heatNo = wo?.heatNumber || "HT-98214";

  // Build the 10-stage backward as-built digital spine
  const asBuiltTimeline = [
    {
      stage: "1. Raw Material Intake & Mill Certificate",
      date: "2026-08-12 09:30 IST",
      plant: "K4 (Stores)",
      operator: "M. Shinde (Store Mgr)",
      machine: "Weighbridge & Inward Bay",
      data: [
        { label: "Steel Supplier", value: "JSW Steel Ltd." },
        { label: "Mill Heat No.", value: heatNo },
        { label: "Steel Grade", value: "CRCA EN 10130 FeP01" },
        { label: "MTC Certificate #", value: "MTC-JSW-2026-8819" },
        { label: "Chemistry (%C / %Mn)", value: "C: 0.06% · Mn: 0.28%" },
        { label: "Thickness & Width", value: "1.20 mm × 520 mm" },
      ],
      passed: true,
    },
    {
      stage: "2. CNC Shearing & Nesting",
      date: "2026-08-14 11:15 IST",
      plant: wo?.plant || "K1",
      operator: "A. Patil",
      machine: "CNC Shear S-01",
      data: [
        { label: "Cut Blank Length", value: "2400 mm (± 0.5 mm)" },
        { label: "Nesting Material Yield", value: "98.4% (Low scrap)" },
        { label: "Part Serial Inherited", value: `${serial}-BLK-01` },
      ],
      passed: true,
    },
    {
      stage: "3. Fin Roll-Forming & Pressing",
      date: "2026-08-15 14:20 IST",
      plant: wo?.plant || "K1",
      operator: "D. More",
      machine: "Fin Press FP-01",
      data: [
        { label: "Cooling Channel Pitch", value: "45.0 mm (Spec 45±1)" },
        { label: "Corrugation Depth", value: "8.2 mm" },
        { label: "Fin Roll Speed", value: "22 m/min" },
      ],
      passed: true,
    },
    {
      stage: "4. Seam & Header Pipe Welding (ISO 3834-2)",
      date: "2026-08-16 10:45 IST",
      plant: wo?.plant || "K1",
      operator: "Ramakant S. (W-04)",
      machine: "Seam Welder SW-02",
      data: [
        { label: "Welder Certification", value: "EN ISO 9606-1 (Valid)" },
        { label: "WPS Recipe Ref", value: "WPS-HDR-02 Seam" },
        { label: "Weld Current / Arc Volt", value: "165 A · 22.4 V" },
        { label: "Shielding Gas (Ar+CO2)", value: "82/18 Mix · 14.5 L/min" },
        { label: "Visual NDT Check", value: "Zero undercut · 100% sound" },
      ],
      passed: true,
    },
    {
      stage: "5. Hydrostatic Leak / Pressure Test Gate",
      date: "2026-08-17 16:10 IST",
      plant: wo?.plant || "K1",
      operator: "P. Nair (QC Lead)",
      machine: "Hydro Test Rig HTR-01",
      data: [
        { label: "Test Pressure Applied", value: "2.0 bar (Proof test)" },
        { label: "Pressure Hold Duration", value: "120 seconds" },
        { label: "Pressure Drop Observed", value: "0.00 bar (Zero decay)" },
        { label: "Test Medium", value: "Submerged Water Bath" },
        { label: "Gate Clearance", value: "PASS · Stamp #QC-78" },
      ],
      passed: true,
    },
    {
      stage: "6. Hot-Dip Galvanizing (HDG)",
      date: "2026-08-19 09:05 IST",
      plant: "K2",
      operator: "T. Sawant",
      machine: "Zinc Kettle #2 (450°C)",
      data: [
        { label: "Zinc Purity Grade", value: "Special High Grade 99.995%" },
        { label: "Bath Temperature", value: "452°C (Set 450°C)" },
        { label: "Immersion Dwell Time", value: "8.5 minutes" },
        { label: "Coating DFT (ISO 1461)", value: "94 μm (Spec ≥ 86 μm)" },
        { label: "Dross Control Index", value: "Normal (0.42%)" },
      ],
      passed: true,
    },
    {
      stage: "7. Surface Blasting & Epoxy Coating",
      date: "2026-08-21 13:40 IST",
      plant: "K3",
      operator: "G. Pawar",
      machine: "Automated Spray Booth 2",
      data: [
        { label: "Surface Profile (Blasting)", value: "Sa 2.5 (Roughness 45 μm)" },
        { label: "Epoxy Primer DFT", value: "62 μm (Spec 60)" },
        { label: "PU Topcoat DFT (RAL 7035)", value: "84 μm (Spec 80)" },
        { label: "Total Coating DFT", value: "146 μm (Spec ≥ 140 μm)" },
        { label: "Oven Cure Cycle", value: "180°C × 25 minutes" },
        { label: "Adhesion Cross-Hatch", value: "Class 5B (Zero peel)" },
      ],
      passed: true,
    },
    {
      stage: "8. Header Assembly & Valve Fitment",
      date: "2026-08-23 11:20 IST",
      plant: wo?.plant || "K1",
      operator: "V. Kulkarni",
      machine: "Assembly Bay A-3",
      data: [
        { label: "Flange Alignment", value: "0.2 mm (Tolerance 0.5 mm)" },
        { label: "Drain / Vent Plug Torque", value: "45 Nm (Calibrated wrench)" },
        { label: "Lifting Lug Load Test", value: "2.5x SWL Verified" },
      ],
      passed: true,
    },
    {
      stage: "9. Final QC & Customer Inspection Release (IRN)",
      date: "2026-08-24 15:00 IST",
      plant: wo?.plant || "K1",
      operator: "S. Jadhav (Chief QA)",
      machine: "Inspection Bed 1",
      data: [
        { label: "Customer PO Match", value: `${wo?.orderNo} (${wo?.customer})` },
        { label: "IRN Clearance Report", value: "IRN-2026-09412-PASS" },
        { label: "Third-Party Inspector", value: "TUV Nord / Bureau Veritas" },
        { label: "Final Status", value: "RELEASED FOR DISPATCH" },
      ],
      passed: true,
    },
    {
      stage: "10. Wooden Crating (ISPM 15) & Dispatch",
      date: "2026-08-25 10:15 IST",
      plant: wo?.plant || "K1",
      operator: "Logistics Team",
      machine: "Export Packing Bay",
      data: [
        { label: "Fumigated Crate #", value: "CRATE-ISPM15-4412" },
        { label: "Container / Vehicle #", value: "MSKU-99412 / MH-06-BW-4820" },
        { label: "Lorry Receipt (LR) #", value: "LR-78921-TCI" },
        { label: "Gate Pass No.", value: "GP-2026-0842" },
        { label: "Destination", value: `${wo?.customer} Grid Substation` },
      ],
      passed: true,
    },
  ];

  // Where-used forward trace: other serials using this heat number
  const forwardUnits = workOrders.filter(w => w.heatNumber === heatNo && w.id !== serial);

  const handleContainment = () => {
    const res = containSuspectBatch(heatNo, containmentReason);
    notifyError(
      "Batch Containment Engaged",
      `Quarantined ${res.affectedCount + 1} serials associated with Heat #${heatNo}. Placed on quality hold.`
    );
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
        <SheetContent side="right" className="w-full sm:max-w-3xl md:max-w-4xl overflow-y-auto p-0">
          <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Workflow className="h-4 w-4 text-primary" />
                <span>As-Built Product Genealogy &amp; Traceability Spine</span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground">
                100% Traceable
              </span>
            </div>
            <SheetTitle className="text-xl font-bold tracking-tight mt-1 flex items-center gap-3">
              <span>Serial: {serial}</span>
              <span className="text-sm font-normal text-muted-foreground">({wo?.product} · {wo?.customer})</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Immutable digital thread from raw steel coil heat #{heatNo} through cutting, forming, ISO 3834-2 welding, hydro testing, HDG, painting to customer delivery.
            </SheetDescription>
          </SheetHeader>

          <div className="p-6 space-y-6 text-xs">
            {/* Quick action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-semibold text-[11px]">Primary Root: Heat #{heatNo}</span>
                <span className="text-[10px] text-muted-foreground">({wo?.customer})</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => setShowCoCModal(true)}
                >
                  <FileText className="h-3.5 w-3.5" /> View / Print CoC Dossier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleContainment}
                >
                  <Lock className="h-3.5 w-3.5" /> Contain This Heat Lot
                </Button>
              </div>
            </div>

            {/* As-built 10-stage timeline */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center justify-between">
                <span>10-Stage As-Built Digital Genealogy</span>
                <span className="text-primary font-semibold">Verified ISO 9001 / ISO 3834-2</span>
              </div>

              <div className="relative border-l-2 border-primary/40 pl-5 ml-3 space-y-5">
                {asBuiltTimeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline Node Bullet */}
                    <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-border/50">
                        <div className="font-bold text-xs text-primary flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          <span>{step.stage}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                          <span>{step.plant}</span>
                          <span>·</span>
                          <span>{step.date}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] mb-2">
                        {step.data.map((d, i) => (
                          <div key={i} className="p-1.5 rounded bg-muted/20 border border-border/40">
                            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{d.label}</div>
                            <div className="font-mono font-bold text-xs mt-0.5">{d.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                        <span>Operator / Sign-off: <strong className="text-foreground">{step.operator}</strong></span>
                        <span>Equipment: <strong className="font-mono text-foreground">{step.machine}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Where-Used Forward Trace Tool */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Forward Trace (Where-Used Precision Containment)</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Coil Heat #{heatNo}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                In the event of a steel mill recall or metallurgical defect, forward trace instantly isolates every sister radiator sharing heat #{heatNo} across all 5 facilities.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-muted-foreground">Associated Serial</th>
                      <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-muted-foreground">Customer</th>
                      <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-muted-foreground">Product</th>
                      <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-muted-foreground">Plant</th>
                      <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-muted-foreground">Current Stage</th>
                      <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {forwardUnits.slice(0, 4).map((u) => (
                      <tr key={u.id} className="hover:bg-accent/20 font-mono">
                        <td className="px-3 py-1.5 font-bold">{u.id}</td>
                        <td className="px-3 py-1.5 font-sans">{u.customer}</td>
                        <td className="px-3 py-1.5">{u.product}</td>
                        <td className="px-3 py-1.5">{u.plant}</td>
                        <td className="px-3 py-1.5 font-sans">{u.currentStage}</td>
                        <td className="px-3 py-1.5">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                            u.status === "on-hold" ? "bg-destructive text-destructive-foreground" : "bg-muted text-foreground"
                          )}>
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {forwardUnits.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-2 text-muted-foreground">No other active serials share this heat number.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            <Button size="sm" className="gap-1.5" onClick={() => setShowCoCModal(true)}>
              <Download className="h-3.5 w-3.5" /> Export Customer Dossier (CoC)
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* CERTIFICATE OF CONFORMITY (CoC) PRINTABLE MODAL */}
      <Dialog open={showCoCModal} onOpenChange={setShowCoCModal}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6 font-sans">
          <DialogHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Hi-Tech Radiators Pvt. Ltd. · Quality Assurance
                </div>
                <DialogTitle className="text-xl font-bold tracking-tight mt-1">
                  Certificate of Conformity &amp; Inspection Release
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Official Mill &amp; Manufacturing Quality Compliance Dossier
                </DialogDescription>
              </div>
              <div className="h-10 w-10 grid place-items-center rounded bg-primary text-primary-foreground font-black text-xs">
                ISO
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded border border-border bg-muted/20">
              <div>
                <div className="text-[9px] uppercase text-muted-foreground">Serial Number</div>
                <div className="font-mono font-bold text-sm">{serial}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase text-muted-foreground">Customer / Order</div>
                <div className="font-semibold text-sm">{wo?.customer} · {wo?.orderNo}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase text-muted-foreground">Product Specification</div>
                <div className="font-mono font-semibold">{wo?.product} (2400mm Fins)</div>
              </div>
              <div>
                <div className="text-[9px] uppercase text-muted-foreground">Manufacturing Plants</div>
                <div className="font-semibold">K1 (Fab), K2 (Galv), K3 (Paint)</div>
              </div>
            </div>

            {/* Compliance Matrix */}
            <div className="border border-border rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b border-border text-[10px] uppercase text-muted-foreground">
                  <tr>
                    <th className="p-2 text-left">Inspection Stage</th>
                    <th className="p-2 text-left">Standard / Spec</th>
                    <th className="p-2 text-left">Measured Value</th>
                    <th className="p-2 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-2 font-semibold">Raw Steel Chemistry</td>
                    <td className="p-2 text-muted-foreground">EN 10130 FeP01</td>
                    <td className="p-2 font-mono">C: 0.06%, Mn: 0.28% (MTC #{heatNo})</td>
                    <td className="p-2 text-right font-bold text-primary">CONFORMS</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Welding Qualification</td>
                    <td className="p-2 text-muted-foreground">ISO 3834-2 / EN ISO 9606</td>
                    <td className="p-2 font-mono">WPS-HDR-02 · Welder W-04 (165A / 22V)</td>
                    <td className="p-2 text-right font-bold text-primary">CERTIFIED</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Pressure / Leak Test</td>
                    <td className="p-2 text-muted-foreground">2.0 bar / 60s Underwater</td>
                    <td className="p-2 font-mono">2.0 bar held 120s · Zero leakage</td>
                    <td className="p-2 text-right font-bold text-primary">PASS</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Hot-Dip Galvanizing</td>
                    <td className="p-2 text-muted-foreground">ISO 1461 / ASTM A123 (≥ 86 μm)</td>
                    <td className="p-2 font-mono">94.0 μm average (452°C zinc bath)</td>
                    <td className="p-2 text-right font-bold text-primary">CONFORMS</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Epoxy Paint System</td>
                    <td className="p-2 text-muted-foreground">Total DFT ≥ 140 μm / ASTM 5B</td>
                    <td className="p-2 font-mono">146.0 μm total · Class 5B cross-hatch</td>
                    <td className="p-2 text-right font-bold text-primary">PASS</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded bg-muted/10 text-[10px]">
              <div>
                <div className="font-bold">Third-Party Inspection Agency</div>
                <div className="text-muted-foreground">Bureau Veritas / TUV Nord Inspection Stamp #BV-9842</div>
              </div>
              <div className="text-right">
                <div className="font-bold">Authorized Signatory</div>
                <div className="text-muted-foreground">Head of Quality, Hi-Tech Radiators</div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-3 flex-row justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCoCModal(false)}>Close</Button>
            <Button size="sm" className="gap-1.5" onClick={() => {
              notifySuccess("Dossier Downloaded", `Certificate of Conformity for ${serial} generated as PDF.`);
              setShowCoCModal(false);
            }}>
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
