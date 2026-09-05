"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyInfo } from "@/lib/mes/toast";
import type { PlantCode, WorkOrderPriority } from "@/lib/mes/types";
import { Wrench, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceOrderDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultAsset?: string;
  defaultPlant?: PlantCode;
}

export function MaintenanceOrderDrawer({
  open,
  onClose,
  defaultAsset = "Seam Welder SW-02 (K2)",
  defaultPlant = "K2",
}: MaintenanceOrderDrawerProps) {
  const { createMaintenanceOrder, machines } = useMESDataStore();

  const [asset, setAsset] = React.useState(defaultAsset);
  const [plant, setPlant] = React.useState<PlantCode>(defaultPlant);
  const [type, setType] = React.useState<"preventive" | "corrective" | "predictive" | "calibration">("preventive");
  const [priority, setPriority] = React.useState<WorkOrderPriority>("high");
  const [technician, setTechnician] = React.useState("V. Sharma (Sr. Tech)");
  const [sparesReserved, setSparesReserved] = React.useState("2x Cu-Cr Electrode Wheels (SKU: SPARE-WELD-729)");
  const [description, setDescription] = React.useState("Electrode dresser overhaul & pneumatic cylinder seal check. Asset at 480 / 500 runtime hours.");
  const [dueDate, setDueDate] = React.useState(new Date(Date.now() + 86400000).toISOString().split("T")[0]);

  React.useEffect(() => {
    if (defaultAsset) setAsset(defaultAsset);
    if (defaultPlant) setPlant(defaultPlant);
  }, [defaultAsset, defaultPlant]);

  const handleSubmit = () => {
    const id = createMaintenanceOrder({
      asset,
      plant,
      type,
      priority,
      status: "scheduled",
      assignedTo: technician,
      dueDate,
      mtbf: 142,
      mttr: 35,
    });

    notifySuccess(
      "Maintenance Order Created",
      `${id} scheduled for ${asset}. Assigned to ${technician} (${type.toUpperCase()}). Spares reserved.`
    );

    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Wrench className="h-4 w-4 text-primary" />
            <span>Computerized Maintenance Management (CMMS)</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight">
            Schedule Maintenance Work Order
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Plan usage-based or calendar-based preventive maintenance, reserve critical spares, and prevent unplanned plant downtime.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Target Asset / Machine</label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-semibold"
            >
              <option value="Seam Welder SW-02 (K2)">Seam Welder SW-02 (K2 - 480/500 hrs)</option>
              <option value="HDG Zinc Kettle #2 (K2)">HDG Zinc Kettle #2 (K2 - Heating Zone 3)</option>
              <option value="Fin Press FP-01 (K1)">Fin Press FP-01 (K1 - Hydraulic Pack)</option>
              <option value="CNC Shear S-01 (K1)">CNC Shear S-01 (K1 - Blade Sharpening)</option>
              <option value="Spray Paint Robot PB-01 (K3)">Spray Paint Robot PB-01 (K3 - Nozzle Clean)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Maintenance Class</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs"
              >
                <option value="preventive">Preventive Maintenance (PM)</option>
                <option value="corrective">Corrective / Breakdown Repair</option>
                <option value="predictive">Condition-Based (CBM)</option>
                <option value="calibration">ISO 17025 Calibration</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-bold"
              >
                <option value="rush">Critical (Halts Production)</option>
                <option value="high">High (PM Overdue Soon)</option>
                <option value="normal">Normal (Scheduled Gap)</option>
                <option value="low">Low (Routine Check)</option>
              </select>
            </div>
          </div>

          {/* Running Hours Gauge */}
          <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px]">Runtime vs. PM Interval Limit</span>
              <span className="font-mono font-bold text-xs text-primary">480 / 500 hrs (96%)</span>
            </div>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "96%" }} />
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center justify-between">
              <span>Remaining before auto-lockout: 20 runtime hrs</span>
              <span>Next window: Sunday Shift C</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Assigned Technician</label>
            <Input
              type="text"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="h-8 text-xs font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Critical Spare Parts Reserved</label>
            <Input
              type="text"
              value={sparesReserved}
              onChange={(e) => setSparesReserved(e.target.value)}
              className="h-8 font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Maintenance Scope &amp; Task Checklist</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-border bg-background p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Target Scheduled Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-8 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Expected Downtime</label>
              <div className="flex items-center gap-2 h-8 px-2 rounded border border-border bg-muted/20 text-xs font-mono font-bold">
                <span>30 minutes (Off-shift)</span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} className="gap-1.5 bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Schedule &amp; Reserve Spares
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
