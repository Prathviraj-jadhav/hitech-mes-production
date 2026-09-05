"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyInfo } from "@/lib/mes/toast";
import type { PlantCode } from "@/lib/mes/types";
import { BookOpen, CheckCircle2, User, Clock, AlertTriangle, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShiftHandoverDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultPlant?: PlantCode;
}

export function ShiftHandoverDrawer({ open, onClose, defaultPlant = "K1" }: ShiftHandoverDrawerProps) {
  const { submitShiftHandover, workOrders, machines, alerts } = useMESDataStore();

  const [shift, setShift] = React.useState<"A" | "B" | "C">("A");
  const [plant, setPlant] = React.useState<PlantCode>(defaultPlant);
  const [outgoingSupervisor, setOutgoingSupervisor] = React.useState("Rajesh Sharma (Shift A Lead)");
  const [incomingSupervisor, setIncomingSupervisor] = React.useState("Sanjay Jadhav (Shift B Lead)");
  const [title, setTitle] = React.useState("Shift A Handover · Target Achieved 102%");
  const [details, setDetails] = React.useState(
    "340 radiators produced (102% of target). HDG Kettle 2 flux concentration adjusted to 4.2%. Work Order #WO-2412 requires priority leak testing in Shift B. Zero safety incidents."
  );
  const [carryOverTasks, setCarryOverTasks] = React.useState([
    { task: "Verify HDG-2 heating zone 3 temperature stability", done: false },
    { task: "Complete hydro leak testing on remaining 18 units of WO-2412", done: false },
    { task: "Stage 15 MT CRCA coil from K4 store to Fin Line A", done: true },
  ]);

  const activePlantWOs = workOrders.filter(w => plant === "ALL" || w.plant === plant);
  const plantOutput = activePlantWOs.reduce((a, b) => a + b.qtyDone, 0);
  const plantScrap = activePlantWOs.reduce((a, b) => a + b.qtyScrap, 0);

  const handleSubmit = () => {
    submitShiftHandover({
      shift,
      date: new Date().toISOString().split("T")[0],
      fromOperator: outgoingSupervisor,
      toOperator: incomingSupervisor,
      type: "handover",
      title,
      details,
      plant,
      priority: "high",
      acknowledged: false,
    });

    notifySuccess(
      "Shift Handover Submitted",
      `Shift ${shift} log signed by ${outgoingSupervisor}. Awaiting incoming supervisor confirmation.`
    );
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Digital Shift Handover &amp; Dual Sign-Off Logbook</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight">
            Shift Handover &amp; Operations Transition
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Standardized handover protocol transferring production achievements, ongoing machine issues, safety notices, and carry-over tasks without information loss.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-4 text-xs">
          {/* Shift Selection & Plant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Shift Transition</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-bold"
              >
                <option value="A">Shift A (06:00 - 14:00) → Shift B</option>
                <option value="B">Shift B (14:00 - 22:00) → Shift C</option>
                <option value="C">Shift C (22:00 - 06:00) → Shift A</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Plant Facility</label>
              <select
                value={plant}
                onChange={(e) => setPlant(e.target.value as PlantCode)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-semibold"
              >
                <option value="K1">Plant K1 (Radiators)</option>
                <option value="K2">Plant K2 (Auto Line &amp; HDG)</option>
                <option value="K3">Plant K3 (Paint Shop)</option>
                <option value="K4">Plant K4 (Stores)</option>
                <option value="R1">Plant R1 (Rabale Tanks)</option>
              </select>
            </div>
          </div>

          {/* Auto-prefilled shift metrics */}
          <div className="grid grid-cols-3 gap-2 bg-muted/20 border border-border p-3 rounded-lg text-center">
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Total Output</div>
              <div className="text-base font-bold font-mono text-primary mt-0.5">{plantOutput} units</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Shift Scrap</div>
              <div className="text-base font-bold font-mono text-destructive mt-0.5">{plantScrap} pcs</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Safety Incident</div>
              <div className="text-base font-bold font-mono text-primary mt-0.5">0 LTI</div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Handover Title / Summary</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 font-semibold text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Operational &amp; Process Notes</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded border border-border bg-background p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Carry-over checklist */}
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1.5">
              Carry-Over Action Items for Incoming Shift
            </label>
            <div className="space-y-1.5 rounded border border-border bg-card p-3">
              {carryOverTasks.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => {
                      const copy = [...carryOverTasks];
                      copy[idx].done = !copy[idx].done;
                      setCarryOverTasks(copy);
                    }}
                    className="h-3.5 w-3.5 rounded border-border"
                  />
                  <span className={cn("text-[11px]", t.done ? "line-through text-muted-foreground" : "font-medium")}>
                    {t.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Digital Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded border border-border bg-muted/20">
              <div className="text-[9px] uppercase text-muted-foreground mb-1">Outgoing Supervisor Sign-off</div>
              <Input
                type="text"
                value={outgoingSupervisor}
                onChange={(e) => setOutgoingSupervisor(e.target.value)}
                className="h-7 text-xs font-bold font-mono"
              />
              <span className="text-[9px] text-primary font-semibold mt-1 block">✓ Signed at Shift Siren</span>
            </div>

            <div className="p-3 rounded border border-border bg-muted/20">
              <div className="text-[9px] uppercase text-muted-foreground mb-1">Incoming Supervisor Verification</div>
              <Input
                type="text"
                value={incomingSupervisor}
                onChange={(e) => setIncomingSupervisor(e.target.value)}
                className="h-7 text-xs font-bold font-mono"
              />
              <span className="text-[9px] text-muted-foreground mt-1 block">Pending acceptance sign-off</span>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} className="gap-1.5 bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Submit &amp; Authorize Handover
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
