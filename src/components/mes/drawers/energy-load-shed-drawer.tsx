"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notifySuccess, notifyInfo } from "@/lib/mes/toast";
import { Zap, AlertTriangle, CheckCircle2, TrendingDown, Leaf, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnergyLoadShedDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function EnergyLoadShedDrawer({ open, onClose }: EnergyLoadShedDrawerProps) {
  const [currentKva, setCurrentKva] = React.useState(940);
  const [contractLimitKva] = React.useState(1000);
  const [staggerFinPress, setStaggerFinPress] = React.useState(true);
  const [delayFurnace, setDelayFurnace] = React.useState(true);
  const [curtailCompressor, setCurtailCompressor] = React.useState(false);

  // Compute load relief
  const finPressRelief = staggerFinPress ? 45 : 0;
  const furnaceRelief = delayFurnace ? 85 : 0;
  const compressorRelief = curtailCompressor ? 30 : 0;
  const totalRelief = finPressRelief + furnaceRelief + compressorRelief;
  const projectedKva = Math.max(0, currentKva - totalRelief);

  const isBreached = currentKva >= 950;
  const isSafeAfterRelief = projectedKva < 900;

  const handleApply = () => {
    notifySuccess(
      "Load Shedding Rule Activated",
      `Staggered Fin Press 2 and postponed annealing furnace preheat. Load reduced to ${projectedKva} kVA. Avoided ₹1.5L penalty.`
    );
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span>ISO 50001 Energy Management &amp; Maximum Demand Protection</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight flex items-center justify-between">
            <span>Peak Demand Load Shedding Engine</span>
            <span className={cn(
              "font-mono text-xs font-bold px-2 py-0.5 rounded",
              currentKva >= 900 ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
            )}>
              {currentKva} / {contractLimitKva} kVA
            </span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Monitor real-time maximum demand against MSEDCL contracted limits and simulate automated load shedding to avoid heavy penalty surcharges.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-5 text-xs">
          {/* Demand Status Gauge */}
          <div className={cn(
            "p-4 rounded-lg border",
            currentKva >= 900 ? "bg-destructive/10 border-destructive" : "bg-muted/20 border-border"
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span>Peak Demand Alert: {((currentKva / contractLimitKva) * 100).toFixed(1)}% of Contract</span>
              </span>
              <span className="font-mono text-xs font-bold">{1000 - currentKva} kVA buffer left</span>
            </div>
            <div className="h-2.5 bg-muted rounded overflow-hidden">
              <div
                className={cn("h-full transition-all", currentKva >= 900 ? "bg-destructive" : "bg-primary")}
                style={{ width: `${(currentKva / contractLimitKva) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
              <span>Contract Limit: 1,000 kVA</span>
              <span className="text-destructive font-bold">MSEDCL Penalty Trigger: &gt; 1,000 kVA (₹1.5 Lakhs/event)</span>
            </div>
          </div>

          {/* Automated Load Shedding Actions */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-primary border-b border-border pb-1.5 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              <span>Simulate Active Load Curtailment</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded border border-border bg-muted/10 cursor-pointer hover:bg-muted/30">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={staggerFinPress}
                    onChange={(e) => setStaggerFinPress(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  <div>
                    <div className="font-bold">Stagger Fin Press 2 (FP-02) Startup</div>
                    <div className="text-[10px] text-muted-foreground">Pause secondary roll motor during peak demand interval</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-primary">-45 kVA</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded border border-border bg-muted/10 cursor-pointer hover:bg-muted/30">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={delayFurnace}
                    onChange={(e) => setDelayFurnace(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  <div>
                    <div className="font-bold">Postpone Annealing Furnace Preheating</div>
                    <div className="text-[10px] text-muted-foreground">Shift 200kW thermal ramp to off-peak night hours (after 22:00)</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-primary">-85 kVA</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded border border-border bg-muted/10 cursor-pointer hover:bg-muted/30">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={curtailCompressor}
                    onChange={(e) => setCurtailCompressor(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  <div>
                    <div className="font-bold">Unload Auxiliary Air Compressor #03</div>
                    <div className="text-[10px] text-muted-foreground">Rely on central pneumatic buffer tank for 45 minutes</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-primary">-30 kVA</span>
              </label>
            </div>
          </div>

          {/* Outcome Projection */}
          <div className="p-3 rounded-lg border border-primary bg-muted/20 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Projected Maximum Demand:</span>
              <span className="font-mono font-black text-base text-primary">{projectedKva} kVA</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Total Electrical Relief:</span>
              <span className="font-mono font-bold text-primary">-{totalRelief} kVA</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-border/50 pt-1.5">
              <span className="font-bold">Penalty Surcharge Avoided:</span>
              <span className="font-mono font-bold text-primary">₹1,50,000</span>
            </div>
          </div>

          {/* ESG & Specific Energy Consumption */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded border border-border bg-card">
            <div>
              <div className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                <Leaf className="h-3 w-3 text-primary" /> Specific Energy Consumption
              </div>
              <div className="font-mono font-bold text-xs mt-1">13.8 kWh / unit</div>
              <div className="text-[9px] text-primary">Target: &le; 14.5 kWh/unit</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Carbon Intensity</div>
              <div className="font-mono font-bold text-xs mt-1">11.4 kg CO2 / MT</div>
              <div className="text-[9px] text-muted-foreground">ISO 14001 Compliant</div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleApply} className="gap-1.5 bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Enforce Load Shedding Schedule
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
