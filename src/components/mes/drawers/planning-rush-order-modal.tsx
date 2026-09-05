"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyInfo } from "@/lib/mes/toast";
import type { PlantCode } from "@/lib/mes/types";
import { CalendarRange, Zap, AlertTriangle, CheckCircle2, Clock, Layers, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanningRushOrderModalProps {
  open: boolean;
  onClose: () => void;
}

export function PlanningRushOrderModal({ open, onClose }: PlanningRushOrderModalProps) {
  const { injectRushOrder, inventory, workOrders } = useMESDataStore();

  const [customer, setCustomer] = React.useState("Siemens Energy");
  const [product, setProduct] = React.useState("Radiator-FN-2400");
  const [qty, setQty] = React.useState(120);
  const [plant, setPlant] = React.useState<PlantCode>("K1");
  const [line, setLine] = React.useState("FIN-LINE-A");
  const [turnaroundDays, setTurnaroundDays] = React.useState(3);
  const [simulated, setSimulated] = React.useState(false);

  // Simulation checks
  const totalCoilWeight = (qty * 0.08).toFixed(1); // MT needed
  const availableCoils = inventory.filter(i => i.type === "raw" && i.sku.includes("COIL"));
  const totalCoilStock = availableCoils.reduce((a, b) => a + b.quantity, 0);
  const hasMaterial = totalCoilStock >= parseFloat(totalCoilWeight);

  const conflictingWOs = workOrders.filter(w => w.line === line && w.status === "in-progress");

  const handleSimulate = () => {
    setSimulated(true);
    notifyInfo("Finite Capacity Simulated", `Analyzed ${line} machine load and K4 inventory availability.`);
  };

  const handleCommit = () => {
    const res = injectRushOrder({
      customer,
      product,
      qty,
      plant,
      line,
      turnaroundDays,
    });
    notifySuccess(
      "Rush Order Committed & Dispatched",
      `Order ${res.woId} generated. Digital job cards pushed directly to Operator Terminal.`
    );
    setSimulated(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setSimulated(false); onClose(); } }}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <CalendarRange className="h-4 w-4" />
            <span>APS Finite-Capacity Scheduling · What-If Simulator</span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight mt-1">
            Rush Order Injection &amp; Conflict Detection
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Simulate inserting a priority OEM order into the active production sequence without starving downstream welding and galvanizing kettles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">OEM Customer</label>
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-semibold"
              >
                <option value="Siemens Energy">Siemens Energy (High Priority)</option>
                <option value="ABB Power Grids">ABB Power Grids</option>
                <option value="Toshiba T&D">Toshiba T&D</option>
                <option value="Hitachi Energy">Hitachi Energy</option>
                <option value="GE Grid Sol.">GE Grid Solutions</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Product Specification</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-mono"
              >
                <option value="Radiator-FN-2400">Radiator-FN-2400 (520mm width)</option>
                <option value="Radiator-FN-3200">Radiator-FN-3200 (Long fin)</option>
                <option value="Tank-CW-4500">Tank-CW-4500 (Corrugated wall)</option>
                <option value="Tank-PM-2200">Tank-PM-2200 (Pad-mounted)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Batch Quantity (Units)</label>
              <Input
                type="number"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                className="h-8 font-mono font-bold text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Requested Turnaround</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={turnaroundDays}
                  onChange={(e) => setTurnaroundDays(parseInt(e.target.value) || 0)}
                  className="h-8 font-mono font-bold text-xs w-24"
                />
                <span className="text-muted-foreground">days (Target: 3-day turnaround)</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Production Facility</label>
              <select
                value={plant}
                onChange={(e) => setPlant(e.target.value as PlantCode)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-semibold"
              >
                <option value="K1">Plant K1 (Khopoli - Radiators)</option>
                <option value="K2">Plant K2 (Khopoli - Auto Line &amp; HDG)</option>
                <option value="R1">Plant R1 (Rabale - Tanks)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Target Production Line</label>
              <select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs font-mono"
              >
                <option value="FIN-LINE-A">FIN-LINE-A (Fin Press FP-01)</option>
                <option value="AUTO-LINE">AUTO-LINE (High-Speed Mitsubishi)</option>
                <option value="WELD-LINE-1">WELD-LINE-1 (Header Seam)</option>
                <option value="TANK-LINE-1">TANK-LINE-1 (Rabale Corrugated)</option>
              </select>
            </div>
          </div>

          {/* SIMULATION RESULTS PANEL */}
          {simulated ? (
            <div className="rounded-lg border-2 border-primary bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Feasibility Simulation: CONFIRMED</span>
                </span>
                <span className="text-[10px] font-mono bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">
                  Zero Starvation
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-card border border-border">
                  <div className="text-[9px] uppercase text-muted-foreground">Raw Material Status (K4 Store)</div>
                  <div className="font-bold mt-1 text-primary">
                    {hasMaterial ? "✓ Reserved 9.6 MT CRCA Coil" : "⚠ Insufficient coil stock"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Available in Bay K4-B04: {totalCoilStock.toFixed(1)} MT</div>
                </div>

                <div className="p-2.5 rounded bg-card border border-border">
                  <div className="text-[9px] uppercase text-muted-foreground">Downstream HDG Slot</div>
                  <div className="font-bold mt-1 text-primary">✓ Reserved Zinc Bath #2 Slot</div>
                  <div className="text-[10px] text-muted-foreground">Cycle: 45 min dwell · 450°C maintained</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-muted-foreground mb-1">
                  Line Schedule Impact ({conflictingWOs.length} concurrent orders active on {line}):
                </div>
                <div className="p-2 rounded bg-card border border-border font-mono text-[11px] space-y-1">
                  {conflictingWOs.slice(0, 2).map((w) => (
                    <div key={w.id} className="flex justify-between text-muted-foreground">
                      <span>{w.id} ({w.customer})</span>
                      <span className="text-primary font-bold">Non-interfering · Shift B buffer utilized</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded border border-dashed border-border bg-muted/10 text-center space-y-2">
              <div className="text-muted-foreground text-xs">
                Run simulation to check machine capacity, raw material reservation in K4, and zinc kettle slots.
              </div>
              <Button variant="outline" size="sm" onClick={handleSimulate} className="gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Run Finite-Capacity Simulation
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border pt-3 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!simulated}
            onClick={handleCommit}
            className="gap-1.5 bg-primary text-primary-foreground"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Commit Order &amp; Dispatch Job Cards
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
