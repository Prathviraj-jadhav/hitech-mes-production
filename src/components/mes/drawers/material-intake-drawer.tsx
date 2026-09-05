"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyError } from "@/lib/mes/toast";
import { Boxes, CheckCircle2, AlertTriangle, QrCode, FileText, Factory } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaterialIntakeDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MaterialIntakeDrawer({ open, onClose }: MaterialIntakeDrawerProps) {
  const { receiveMaterialIntake } = useMESDataStore();

  const [supplier, setSupplier] = React.useState("JSW Steel Ltd.");
  const [grade, setGrade] = React.useState("CRCA EN 10130 FeP01");
  const [heatNumber, setHeatNumber] = React.useState(`HT-${Math.floor(80000 + Math.random() * 20000)}`);
  const [weightMt, setWeightMt] = React.useState(15.5);
  const [location, setLocation] = React.useState("Bay K4-B04");
  const [mtcRef, setMtcRef] = React.useState(`MTC-JSW-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  // Chemical composition
  const [carbonPct, setCarbonPct] = React.useState(0.06);
  const [manganesePct, setManganesePct] = React.useState(0.28);
  const [siliconPct, setSiliconPct] = React.useState(0.02);
  const [phosphorusPct, setPhosphorusPct] = React.useState(0.015);
  const [sulphurPct, setSulphurPct] = React.useState(0.012);

  // Validation
  const isCarbonConforming = carbonPct <= 0.12;
  const isManganeseConforming = manganesePct <= 0.60;
  const isAllConforming = isCarbonConforming && isManganeseConforming;

  const handleSubmit = () => {
    if (!isAllConforming) {
      notifyError(
        "Chemical Composition Out-of-Spec",
        "Carbon or Manganese exceeds EN 10130 metallurgical limit. Inward intake rejected."
      );
      return;
    }

    receiveMaterialIntake({
      supplier,
      grade,
      heatNumber,
      weightMt,
      location,
      carbonPct,
      manganesePct,
      mtcRef,
    });

    notifySuccess(
      "Raw Material Inward Booked",
      `Received ${weightMt} MT coil from ${supplier}. Assigned Heat #${heatNumber} to ${location}. QR tag generated.`
    );

    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Boxes className="h-4 w-4 text-primary" />
            <span>Raw Material Inward &amp; Heat-Lot Traceability Birth</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight">
            Coil Goods Receipt &amp; Mill Certificate Verification
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Verify metallurgical composition (EN 10130 / IS 2062), register parent steel heat number, and generate shop-floor QR traveler tag.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-5 text-xs">
          {/* Supplier & Coil Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Steel Mill / Supplier</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-semibold"
              >
                <option value="JSW Steel Ltd.">JSW Steel Ltd. (Tier-1)</option>
                <option value="Tata Steel Ltd.">Tata Steel Ltd. (Tier-1)</option>
                <option value="POSCO India">POSCO India</option>
                <option value="ArcelorMittal Nippon">ArcelorMittal Nippon Steel</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Steel Specification Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-mono font-semibold"
              >
                <option value="CRCA EN 10130 FeP01">CRCA EN 10130 FeP01 (Radiator Fins)</option>
                <option value="MS IS 2062 E250">MS IS 2062 E250 (Tank Wall Plates)</option>
                <option value="CRCA EN 10130 DC04">CRCA EN 10130 DC04 (Deep Drawing)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Mill Heat Number</label>
              <Input
                type="text"
                value={heatNumber}
                onChange={(e) => setHeatNumber(e.target.value)}
                className="h-8 font-mono font-bold text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Coil Weight (Metric Tonnes)</label>
              <Input
                type="number"
                step="0.1"
                value={weightMt}
                onChange={(e) => setWeightMt(parseFloat(e.target.value) || 0)}
                className="h-8 font-mono font-bold text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Storage Warehouse Location</label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-8 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Mill Test Certificate (MTC) Ref</label>
              <Input
                type="text"
                value={mtcRef}
                onChange={(e) => setMtcRef(e.target.value)}
                className="h-8 font-mono text-xs"
              />
            </div>
          </div>

          {/* Metallurgical Chemical Analysis Section */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                <span>MTC Metallurgical Chemical Composition (% Mass)</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Standard: EN 10130</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div>
                <label className="text-[9px] text-muted-foreground block mb-0.5">Carbon (C) %</label>
                <Input
                  type="number"
                  step="0.01"
                  value={carbonPct}
                  onChange={(e) => setCarbonPct(parseFloat(e.target.value) || 0)}
                  className={cn("h-8 font-mono text-xs", !isCarbonConforming && "border-destructive text-destructive font-bold")}
                />
                <span className="text-[8px] text-muted-foreground">Max: 0.12%</span>
              </div>

              <div>
                <label className="text-[9px] text-muted-foreground block mb-0.5">Manganese (Mn) %</label>
                <Input
                  type="number"
                  step="0.01"
                  value={manganesePct}
                  onChange={(e) => setManganesePct(parseFloat(e.target.value) || 0)}
                  className={cn("h-8 font-mono text-xs", !isManganeseConforming && "border-destructive text-destructive font-bold")}
                />
                <span className="text-[8px] text-muted-foreground">Max: 0.60%</span>
              </div>

              <div>
                <label className="text-[9px] text-muted-foreground block mb-0.5">Silicon (Si) %</label>
                <Input
                  type="number"
                  step="0.01"
                  value={siliconPct}
                  onChange={(e) => setSiliconPct(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono text-xs"
                />
                <span className="text-[8px] text-muted-foreground">Max: 0.05%</span>
              </div>

              <div>
                <label className="text-[9px] text-muted-foreground block mb-0.5">Phosphorus (P) %</label>
                <Input
                  type="number"
                  step="0.001"
                  value={phosphorusPct}
                  onChange={(e) => setPhosphorusPct(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono text-xs"
                />
                <span className="text-[8px] text-muted-foreground">Max: 0.045%</span>
              </div>

              <div>
                <label className="text-[9px] text-muted-foreground block mb-0.5">Sulphur (S) %</label>
                <Input
                  type="number"
                  step="0.001"
                  value={sulphurPct}
                  onChange={(e) => setSulphurPct(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono text-xs"
                />
                <span className="text-[8px] text-muted-foreground">Max: 0.045%</span>
              </div>
            </div>

            <div className={cn(
              "p-2.5 rounded border flex items-center justify-between text-[11px]",
              isAllConforming ? "bg-primary/10 border-primary text-primary" : "bg-destructive/10 border-destructive text-destructive"
            )}>
              <span className="font-semibold flex items-center gap-1.5">
                {isAllConforming ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {isAllConforming ? "Chemistry conforms to deep-draw forming standards." : "WARNING: Metallurgical specification violated!"}
              </span>
              <span className="font-mono font-bold">MTC Certified</span>
            </div>
          </div>

          {/* Barcode / Traveler Preview */}
          <div className="p-3 rounded border border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8 text-primary shrink-0" />
              <div>
                <div className="font-bold text-xs font-mono">TAG-{heatNumber}</div>
                <div className="text-[10px] text-muted-foreground">ZPL Network Printer Ready · Auto-assigned to Plant K4 store</div>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-background px-2 py-1 rounded border border-border">
              ISPM 15 / ISO 9001
            </span>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} className="gap-1.5 bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Book Inward &amp; Print QR Tag
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
