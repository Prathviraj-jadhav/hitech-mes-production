"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useMESDataStore, type ExceptionItem } from "@/lib/mes/data-store";
import { notifySuccess, notifyInfo } from "@/lib/mes/toast";
import { AlertOctagon, CheckCircle2, Clock, User, ShieldAlert, ArrowRight, Wrench, Factory } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExceptionTriageDrawerProps {
  open: boolean;
  onClose: () => void;
  exception: ExceptionItem | null;
}

export function ExceptionTriageDrawer({ open, onClose, exception }: ExceptionTriageDrawerProps) {
  const { resolveException } = useMESDataStore();
  const [resolutionNotes, setResolutionNotes] = React.useState<string>("");
  const [owner, setOwner] = React.useState<string>(exception?.owner || "Assigned Engineer");

  React.useEffect(() => {
    if (exception) {
      setOwner(exception.owner);
      setResolutionNotes(exception.recommendedAction);
    }
  }, [exception]);

  if (!exception) return null;

  const handleResolve = () => {
    resolveException(exception.id, resolutionNotes || "Mitigation action executed and confirmed on shop floor.");
    notifySuccess(
      "Exception Resolved",
      `${exception.title} has been marked resolved. Root cause logged to operational audit trail.`
    );
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <span>Executive Alarm Triage · The Critical Few</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight text-destructive flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 shrink-0" />
            <span>{exception.id}: {exception.title}</span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Plant {exception.plant} · {exception.stage} · Target Resolution SLA: &le; {exception.deadlineMinutes} mins
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-5 text-xs">
          {/* Severity & Context Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/20 border border-border p-3 rounded-lg">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Severity</div>
              <span className="font-bold uppercase text-destructive font-mono text-xs">{exception.severity}</span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Plant Location</div>
              <span className="font-bold font-mono text-xs">Plant {exception.plant}</span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Asset / Order</div>
              <span className="font-semibold text-xs truncate block">{exception.assetOrOrder}</span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Response SLA</div>
              <span className="font-bold text-xs text-primary font-mono">{exception.deadlineMinutes}m left</span>
            </div>
          </div>

          {/* Detailed Diagnosis */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Diagnostic Assessment</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded border border-border/50">
              {exception.description}
            </p>
          </div>

          {/* Action Owner Assignment */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
              Assigned Operational Owner
            </label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-3 font-semibold text-xs"
              />
            </div>
          </div>

          {/* Recommended Resolution Plan */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
              Mitigation / Resolution Actions
            </label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full rounded border border-border bg-background p-3 text-xs focus:ring-1 focus:ring-primary outline-none"
            />
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Executing this action logs an immutable 21 CFR Part 11 transaction and clears the exception banner.
            </span>
          </div>

          {/* Standard Operating Procedure Guide */}
          <div className="p-3 rounded border border-dashed border-border bg-muted/10 text-[11px] space-y-1">
            <div className="font-bold text-primary flex items-center gap-1">
              <Wrench className="h-3 w-3" />
              <span>SOP Escalation Rule (Section 16 Alarm Triage)</span>
            </div>
            <p className="text-muted-foreground leading-snug">
              If containment is not executed within {exception.deadlineMinutes} minutes, automatic SMS/Voice escalation will ping the Plant General Manager and Director of Operations.
            </p>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Dismiss</Button>
          <Button size="sm" onClick={handleResolve} className="gap-1.5 bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Mitigation &amp; Clear
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
