"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyInfo, notifyError } from "@/lib/mes/toast";
import type { CalibrationItem } from "@/lib/mes/types";
import { CalendarCheck, Lock, Unlock, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalibrationLockoutDrawerProps {
  open: boolean;
  onClose: () => void;
  item: CalibrationItem | null;
}

export function CalibrationLockoutDrawer({ open, onClose, item }: CalibrationLockoutDrawerProps) {
  const { recordCalibration, toggleToolLockout } = useMESDataStore();

  const [calDate, setCalDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [nextDue, setNextDue] = React.useState(
    new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0]
  );
  const [certNo, setCertNo] = React.useState(`NABL-CAL-${Math.floor(10000 + Math.random() * 90000)}`);
  const [vendor, setVendor] = React.useState("NABL Accredited Metrology Labs Pune");
  const [uncertainty, setUncertainty] = React.useState("± 0.8 μm");

  if (!item) return null;

  const isOverdue = item.status === "overdue";

  const handleToggleLock = () => {
    toggleToolLockout(item.id, !isOverdue);
    if (!isOverdue) {
      notifyError("Tool Locked Out", `${item.tag} locked out from shop-floor inspection sign-offs.`);
    } else {
      notifySuccess("Tool Unlocked", `${item.tag} unlocked for operational use.`);
    }
  };

  const handleRecordCal = () => {
    recordCalibration(item.id, calDate, nextDue, certNo);
    notifySuccess(
      "Calibration Certified",
      `${item.tag} calibrated under ISO 17025. Certificate ${certNo} logged. Status: VALID.`
    );
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <span>ISO 17025 Metrology &amp; Instrument Assurance</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight flex items-center justify-between">
            <span>{item.tag}: {item.instrument}</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono",
              item.status === "valid" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
            )}>
              {item.status.toUpperCase()}
            </span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Plant {item.plant} · {item.location} · Measurement Range: {item.range}
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-5 text-xs">
          {/* Lockout Guardrail Banner */}
          <div className={cn(
            "p-4 rounded-lg border flex items-center justify-between gap-3",
            isOverdue ? "bg-destructive/10 border-destructive" : "bg-muted/20 border-border"
          )}>
            <div className="flex items-center gap-3">
              {isOverdue ? <Lock className="h-6 w-6 text-destructive shrink-0" /> : <Unlock className="h-6 w-6 text-primary shrink-0" />}
              <div>
                <div className={cn("text-xs font-bold uppercase", isOverdue ? "text-destructive" : "text-primary")}>
                  {isOverdue ? "Automated Quality Lockout Engaged" : "Instrument Authorized for Production"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isOverdue
                    ? "Inspectors cannot sign off quality records with this gauge until recalibrated."
                    : "Gauge verified valid within calibrated measurement uncertainty."}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleLock}
              className={cn("h-7 text-[11px] font-bold", isOverdue ? "border-primary text-primary" : "border-destructive text-destructive")}
            >
              {isOverdue ? "Override Unlock" : "Lock Out Tool"}
            </Button>
          </div>

          {/* Current Instrument Spec */}
          <div className="grid grid-cols-2 gap-px bg-border rounded overflow-hidden border border-border">
            <div className="bg-card p-2.5">
              <div className="text-[9px] uppercase text-muted-foreground">Measurement Range</div>
              <div className="font-mono font-bold text-xs mt-0.5">{item.range}</div>
            </div>
            <div className="bg-card p-2.5">
              <div className="text-[9px] uppercase text-muted-foreground">Standard Accuracy</div>
              <div className="font-mono font-bold text-xs mt-0.5">{item.accuracy}</div>
            </div>
            <div className="bg-card p-2.5">
              <div className="text-[9px] uppercase text-muted-foreground">Last Calibrated</div>
              <div className="font-mono text-xs mt-0.5">{item.lastCalibrated}</div>
            </div>
            <div className="bg-card p-2.5">
              <div className="text-[9px] uppercase text-muted-foreground">Next Due Date</div>
              <div className="font-mono font-bold text-xs mt-0.5 text-primary">{item.nextDue}</div>
            </div>
          </div>

          {/* Record New Calibration Form */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 font-bold text-xs uppercase tracking-wider text-primary">
              <FileText className="h-4 w-4" />
              <span>Record New Calibration Certificate</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Calibration Date</label>
                <Input
                  type="date"
                  value={calDate}
                  onChange={(e) => setCalDate(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Next Recalibration Due</label>
                <Input
                  type="date"
                  value={nextDue}
                  onChange={(e) => setNextDue(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">NABL Certificate #</label>
                <Input
                  type="text"
                  value={certNo}
                  onChange={(e) => setCertNo(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Measurement Uncertainty</label>
                <Input
                  type="text"
                  value={uncertainty}
                  onChange={(e) => setUncertainty(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Calibration Vendor / Laboratory</label>
              <Input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="h-8 text-xs font-medium"
              />
            </div>
          </div>

          {/* Gauge R&R (MSA) Section */}
          <div className="p-3 rounded border border-border bg-muted/20 space-y-1 text-[11px]">
            <div className="font-bold flex items-center justify-between">
              <span>Gauge R&amp;R Variance (MSA Evaluation):</span>
              <span className="font-mono text-primary font-bold">5.8% (&le; 10% Acceptable)</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Evaluated across 3 quality inspectors and 10 repeat test samples. System repeatability meets ISO 17025 precision criteria.
            </p>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleRecordCal} className="gap-1.5 bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Authorize &amp; Update Calibration
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
