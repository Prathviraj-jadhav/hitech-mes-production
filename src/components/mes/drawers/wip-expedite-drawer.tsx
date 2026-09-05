"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { notifySuccess } from "@/lib/mes/toast";
import type { WIPItem } from "@/lib/mes/types";
import { Hourglass, Zap, AlertTriangle, CheckCircle2, Clock, Layers, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WipExpediteDrawerProps {
  open: boolean;
  onClose: () => void;
  item: WIPItem | null;
}

export function WipExpediteDrawer({ open, onClose, item }: WipExpediteDrawerProps) {
  const [cranePriority, setCranePriority] = React.useState("High (Bay 2 Overhead Crane)");
  const [targetBuffer, setTargetBuffer] = React.useState("HDG Kettle #1 Loading Bay");

  if (!item) return null;

  // Carrying cost math (assume ~₹25,000 value per radiator element, 12% annual cost of capital)
  const unitValue = 25000;
  const batchValue = item.qty * unitValue;
  const dailyCarryingCost = Math.round((batchValue * 0.12) / 365);
  const totalCostAccrued = Math.round((dailyCarryingCost / 24) * item.ageHours);

  const handleExpedite = () => {
    notifySuccess(
      "Fast-Track Expedite Dispatched",
      `Batch ${item.serial} (${item.customer}) escalated. Crane priority allocated to ${targetBuffer}. Dwell clock reset.`
    );
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Hourglass className="h-4 w-4 text-primary" />
            <span>Shop-Floor Flow Optimization · WIP Dwell Time Control</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight flex items-center justify-between">
            <span>{item.serial}: {item.product}</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono",
              item.ageHours > 48 ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
            )}>
              {item.ageHours}h DWELL
            </span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Customer: {item.customer} · Plant {item.plant} ({item.line}) · Work Order: {item.workOrder}
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-5 text-xs">
          {/* Stagnant warning banner */}
          {item.ageHours > 24 && (
            <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <div className="font-bold text-xs uppercase">Stagnant Buffer Alert (Threshold Exceeded)</div>
                <div className="text-[10px] mt-0.5">
                  Standard buffer dwell limit is 24 hours. Prolonged exposure causes surface flash rusting before chemical pickling.
                </div>
              </div>
            </div>
          )}

          {/* Dwell Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/20 border border-border p-3 rounded-lg text-center">
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Current Stage</div>
              <div className="font-bold text-xs mt-0.5">{item.stage}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Batch Qty</div>
              <div className="font-mono font-bold text-xs mt-0.5">{item.qty} units</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Total Dwell</div>
              <div className="font-mono font-bold text-xs mt-0.5 text-destructive">{item.ageHours} hrs</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Promised Due</div>
              <div className="font-mono text-[11px] mt-0.5">{item.dueDate}</div>
            </div>
          </div>

          {/* Financial Carrying Cost Calculator */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Trapped Capital &amp; Carrying Cost
              </span>
              <span className="text-[10px] font-mono text-primary font-bold">12% Cost of Capital</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <div className="text-muted-foreground text-[10px]">Trapped Batch Value</div>
                <div className="text-base font-mono font-bold text-foreground">₹{(batchValue / 100000).toFixed(2)} Lakhs</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[10px]">Accumulated Holding Interest</div>
                <div className="text-base font-mono font-bold text-destructive">₹{totalCostAccrued.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>

          {/* Expedited Fast-Track Re-routing Action */}
          <div className="rounded-lg border-2 border-primary/40 bg-card p-4 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>Fast-Track Expedited Re-routing</span>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Overhead Crane Allocation</label>
              <select
                value={cranePriority}
                onChange={(e) => setCranePriority(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs"
              >
                <option value="High (Bay 2 Overhead Crane)">High Priority (Bay 2 Overhead Crane #01)</option>
                <option value="Auxiliary Hoist">Auxiliary Hoist (Header Welding)</option>
                <option value="Forklift Transfer">Dedicated Electric Forklift #04</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Next Fast-Track Destination</label>
              <select
                value={targetBuffer}
                onChange={(e) => setTargetBuffer(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-semibold"
              >
                <option value="HDG Kettle #1 Loading Bay">HDG Kettle #1 Loading Bay (Immediate Dip)</option>
                <option value="HDG Kettle #2 Express Queue">HDG Kettle #2 Express Queue</option>
                <option value="Shot Blasting Booth 1">Shot Blasting Booth 1 (Surface Prep)</option>
              </select>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Dismiss</Button>
          <Button size="sm" onClick={handleExpedite} className="gap-1.5 bg-primary text-primary-foreground">
            <Zap className="h-3.5 w-3.5" /> Execute Fast-Track Re-routing
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
