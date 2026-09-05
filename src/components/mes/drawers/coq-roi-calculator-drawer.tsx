"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notifySuccess } from "@/lib/mes/toast";
import { CircleDollarSign, TrendingUp, ShieldCheck, AlertOctagon, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoqRoiCalculatorDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CoqRoiCalculatorDrawer({ open, onClose }: CoqRoiCalculatorDrawerProps) {
  const [revenueCr, setRevenueCr] = React.useState(8.5); // INR 8.5 Crores
  const [preventionLakhs, setPreventionLakhs] = React.useState(4.2);
  const [appraisalLakhs, setAppraisalLakhs] = React.useState(5.8);
  const [internalFailLakhs, setInternalFailLakhs] = React.useState(14.8);
  const [externalFailLakhs, setExternalFailLakhs] = React.useState(3.2);

  // Prevention investment simulation
  const [newInvestmentLakhs, setNewInvestmentLakhs] = React.useState(2.2);
  const [expectedDefectReductionPct, setExpectedDefectReductionPct] = React.useState(70);

  const goodCost = preventionLakhs + appraisalLakhs;
  const badCost = internalFailLakhs + externalFailLakhs;
  const totalCoQ = goodCost + badCost;
  const coqPctOfRevenue = ((totalCoQ / (revenueCr * 100)) * 100).toFixed(2);

  // ROI math
  const projectedSavingsLakhs = (internalFailLakhs * (expectedDefectReductionPct / 100)).toFixed(2);
  const netSavingsLakhs = (parseFloat(projectedSavingsLakhs) - newInvestmentLakhs).toFixed(2);
  const paybackMonths = newInvestmentLakhs > 0 && parseFloat(projectedSavingsLakhs) > 0
    ? ((newInvestmentLakhs / (parseFloat(projectedSavingsLakhs) / 12)) * 1).toFixed(1)
    : "1.0";

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <CircleDollarSign className="h-4 w-4 text-primary" />
            <span>Economics of Quality · PAF Cost Model &amp; ROI Simulator</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight">
            Cost of Quality (CoQ) Financial Engine
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Quantify the exact rupee cost of poor quality (CoPQ) and simulate bottom-line margin expansion from preventative investments.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-5 text-xs">
          {/* Headline financial metrics */}
          <div className="grid grid-cols-3 gap-2 bg-muted/20 border border-border p-3 rounded-lg text-center">
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Total CoQ</div>
              <div className="text-base font-bold font-mono text-primary mt-0.5">₹{totalCoQ.toFixed(1)} Lakhs</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Cost of Poor Quality</div>
              <div className="text-base font-bold font-mono text-destructive mt-0.5">₹{badCost.toFixed(1)} Lakhs</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">% of Plant Revenue</div>
              <div className={cn("text-base font-bold font-mono mt-0.5", parseFloat(coqPctOfRevenue) <= 2.5 ? "text-primary" : "text-destructive")}>
                {coqPctOfRevenue}%
              </div>
            </div>
          </div>

          {/* PAF Parameter Allocations */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">
              PAF Category Allocations (₹ Lakhs)
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-primary block mb-1">
                  1. Prevention (PM, Training)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={preventionLakhs}
                  onChange={(e) => setPreventionLakhs(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-primary block mb-1">
                  2. Appraisal (Lab Testing, QC)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={appraisalLakhs}
                  onChange={(e) => setAppraisalLakhs(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-destructive block mb-1">
                  3. Internal Failure (Scrap, Rework)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={internalFailLakhs}
                  onChange={(e) => setInternalFailLakhs(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-destructive block mb-1">
                  4. External Failure (Warranty)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={externalFailLakhs}
                  onChange={(e) => setExternalFailLakhs(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Preventative Quality ROI Simulation */}
          <div className="rounded-lg border-2 border-primary/40 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                <span>Preventative Investment ROI Simulator</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Scenario: Wire-Feeder Calibration</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                  Proposed Prevention Spend (₹ L)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={newInvestmentLakhs}
                  onChange={(e) => setNewInvestmentLakhs(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                  Expected Scrap Reduction (%)
                </label>
                <Input
                  type="number"
                  value={expectedDefectReductionPct}
                  onChange={(e) => setExpectedDefectReductionPct(parseInt(e.target.value) || 0)}
                  className="h-8 font-mono font-bold text-xs"
                />
              </div>
            </div>

            <div className="p-3 rounded bg-muted/20 border border-border space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projected Annual Scrap Savings:</span>
                <span className="font-mono font-bold text-primary">₹{projectedSavingsLakhs} Lakhs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Bottom-Line Margin Gain:</span>
                <span className="font-mono font-bold text-primary">₹{netSavingsLakhs} Lakhs</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-1">
                <span className="font-bold text-xs">Estimated Capital Payback:</span>
                <span className="font-mono font-black text-xs text-primary">{paybackMonths} Months</span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" onClick={() => {
            notifySuccess("CoQ Simulation Saved", "Executive business case summary saved to management deck.");
            onClose();
          }} className="gap-1.5 bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Save Scenario to Board Deck
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
