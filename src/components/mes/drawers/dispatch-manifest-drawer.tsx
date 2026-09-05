"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyError, notifyInfo } from "@/lib/mes/toast";
import type { Shipment } from "@/lib/mes/types";
import { PackageCheck, Truck, QrCode, CheckCircle2, AlertTriangle, FileText, Printer, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DispatchManifestDrawerProps {
  open: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

export function DispatchManifestDrawer({ open, onClose, shipment }: DispatchManifestDrawerProps) {
  const [scanInput, setScanInput] = React.useState("");
  const [scannedSerials, setScannedSerials] = React.useState<string[]>(["RAD-2026-09412", "RAD-2026-09413"]);
  const [targetCount] = React.useState(shipment?.units || 48);

  if (!shipment) return null;

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const serial = scanInput.trim().toUpperCase();
    if (scannedSerials.includes(serial)) {
      notifyInfo("Duplicate Unit", `Serial ${serial} has already been verified and loaded.`);
    } else {
      setScannedSerials([serial, ...scannedSerials]);
      notifySuccess("Serial Verified & Loaded", `${serial} matched customer order ${shipment.orderNo}.`);
    }
    setScanInput("");
  };

  const handleGenerateGatePass = () => {
    notifySuccess(
      "Gate Pass & e-Way Bill Generated",
      `Gate Pass #GP-2026-0842 generated for Vehicle ${shipment.vehicleNo}. ISPM 15 fumigation certificate attached.`
    );
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <PackageCheck className="h-4 w-4 text-primary" />
            <span>Outbound Logistics · Container Stuffing &amp; Gate Clearance</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight">
            Manifest: {shipment.manifestNo} ({shipment.customer})
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Destination: {shipment.destination} · Carrier: {shipment.carrier} ({shipment.vehicleNo})
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-5 text-xs">
          {/* Shipment metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/20 border border-border p-3 rounded-lg">
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Vehicle No.</div>
              <div className="font-mono font-bold text-xs mt-0.5">{shipment.vehicleNo}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Lorry Receipt (LR)</div>
              <div className="font-mono text-xs mt-0.5">{shipment.lrNo}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Payload Weight</div>
              <div className="font-mono font-bold text-xs mt-0.5">{shipment.weight} MT</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">Commercial Value</div>
              <div className="font-mono font-bold text-xs mt-0.5 text-primary">₹{shipment.value} Lakhs</div>
            </div>
          </div>

          {/* Barcode Scanning Truck Loading Simulator */}
          <div className="rounded-lg border-2 border-primary/40 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-primary">
                <QrCode className="h-4 w-4" />
                <span>Barcode Loading Verification (Zero Error Prevention)</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-primary">
                {scannedSerials.length} / {targetCount} units verified
              </span>
            </div>

            <form onSubmit={handleScan} className="flex gap-2">
              <Input
                placeholder="Scan or type serial (e.g. RAD-2026-09414)…"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="h-8 font-mono text-xs"
              />
              <Button type="submit" size="sm" className="gap-1.5 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verify Scan
              </Button>
            </form>

            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {scannedSerials.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-muted/20 border border-border text-[11px] font-mono">
                  <span className="font-bold text-primary">✓ {s}</span>
                  <span className="text-[10px] text-muted-foreground">Order {shipment.orderNo} · Passed Inspection</span>
                </div>
              ))}
            </div>
          </div>

          {/* Container stuffing & axle weight distribution */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider">Axle Weight Distribution Visualizer</span>
              <span className="text-[10px] font-mono text-muted-foreground">ISPM 15 Fumigated Crates</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-muted/20 border border-border">
                <div className="text-[9px] uppercase text-muted-foreground">Front Steer Axle</div>
                <div className="font-mono font-bold text-sm mt-0.5">5.2 MT</div>
                <div className="text-[9px] text-primary">Within Legal Limit</div>
              </div>
              <div className="p-2 rounded bg-muted/20 border border-border">
                <div className="text-[9px] uppercase text-muted-foreground">Drive Tandem Axle</div>
                <div className="font-mono font-bold text-sm mt-0.5">14.8 MT</div>
                <div className="text-[9px] text-primary">Within Legal Limit</div>
              </div>
              <div className="p-2 rounded bg-muted/20 border border-border">
                <div className="text-[9px] uppercase text-muted-foreground">Trailer Tandem</div>
                <div className="font-mono font-bold text-sm mt-0.5">15.4 MT</div>
                <div className="text-[9px] text-primary">Within Legal Limit</div>
              </div>
            </div>
          </div>

          {/* Export Compliance Pack */}
          <div className="p-3 rounded border border-border bg-muted/20 space-y-2">
            <div className="font-bold text-[11px] uppercase tracking-wider">Statutory &amp; Export Compliance Pack</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>GST e-Way Bill Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>ISPM 15 Wooden Crating Cert</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>Mill Test Certificates (MTC) Attached</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>Security RFID Seal Tagged</span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" onClick={handleGenerateGatePass} className="gap-1.5 bg-primary text-primary-foreground">
            <Printer className="h-3.5 w-3.5" /> Print Gate Pass &amp; e-Way Bill
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
