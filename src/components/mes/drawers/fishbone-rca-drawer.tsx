"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMESDataStore } from "@/lib/mes/data-store";
import { notifySuccess, notifyInfo } from "@/lib/mes/toast";
import type { RootCauseAnalysis } from "@/lib/mes/types";
import { GitFork, CheckCircle2, HelpCircle, AlertTriangle, Layers, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FishboneRcaDrawerProps {
  open: boolean;
  onClose: () => void;
  rca: RootCauseAnalysis | null;
}

export function FishboneRcaDrawer({ open, onClose, rca }: FishboneRcaDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<"fishbone" | "5whys" | "8d">("fishbone");

  // 6M Ishikawa factors
  const ishikawa6M = {
    Machine: ["Argon regulator diaphragm worn out", "Electrode wheel contact jitter", "Fin press die clearance drift"],
    Man: ["Operator unfamiliar with WPS-HDR-02 parameter window", "Shift handover note missed"],
    Method: ["Welding speed exceeded 25 cm/min", "Pre-weld joint degreasing step skipped"],
    Material: ["Batch edge camber on CRCA coil", "Shielding gas purity low (99.5% vs 99.9%)"],
    Measurement: ["Pressure gauge PT-01 calibration due in 3 days", "DFT meter probe angle error"],
    Milieu: ["High monsoon humidity causing hydrogen embrittlement", "Air draught in bay 2"],
  };

  const defaultWhys = rca?.whys || [
    { question: "Why 1: Why did the radiator leak during the pressure test?", answer: "Micro-porosity pinhole at header flange weld seam #3." },
    { question: "Why 2: Why was there porosity in the weld bead?", answer: "Shielding gas coverage was unstable during automatic torch travel." },
    { question: "Why 3: Why was the gas flow unstable?", answer: "The secondary regulator diaphragm pressure fluctuated between 8 and 15 L/min." },
    { question: "Why 4: Why did the diaphragm fluctuate?", answer: "Diaphragm elastomer was cracked due to exceeding 2,000 operational hours." },
    { question: "Why 5 (Root Cause): Why was the diaphragm not replaced?", answer: "Preventive maintenance for gas regulators was missing from CMMS asset schedules." },
  ];

  if (!rca) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <GitFork className="h-4 w-4 text-primary" />
            <span>Problem-Solving Discipline · Ishikawa 6M &amp; 5-Why Investigation</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight">
            {rca.id}: {rca.title}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Plant {rca.plant} · {rca.stage} · Facilitator: {rca.facilitator} · Ref: {rca.ncrRef || "Internal CAPA"}
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-5 text-xs">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-border pb-2">
            {(["fishbone", "5whys", "8d"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all",
                  activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                )}
              >
                {tab === "fishbone" && "Ishikawa 6M Fishbone"}
                {tab === "5whys" && "Recursive 5-Whys Chain"}
                {tab === "8d" && "8D Corrective Action (CAPA)"}
              </button>
            ))}
          </div>

          {activeTab === "fishbone" && (
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                6M Cause &amp; Effect Analysis (Fishbone Breakdown)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(ishikawa6M).map(([category, factors]) => (
                  <div key={category} className="rounded-lg border border-border bg-card p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-border pb-1">
                      <span className="font-bold text-xs uppercase tracking-wider text-primary">{category}</span>
                      <span className="text-[9px] font-mono text-muted-foreground">{factors.length} factors</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-muted-foreground">
                      {factors.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-primary font-bold mt-0.5">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "5whys" && (
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                5-Why Recursive Root Cause Tree
              </div>
              <div className="relative border-l-2 border-primary/40 pl-5 ml-3 space-y-3">
                {defaultWhys.map((w, idx) => (
                  <div key={idx} className="relative rounded border border-border bg-card p-3">
                    <div className="absolute -left-[27px] top-3 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <div className="font-bold text-xs text-foreground mb-1">{w.question}</div>
                    <div className="text-[11px] text-primary font-mono font-semibold bg-muted/20 p-2 rounded">
                      {w.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "8d" && (
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                8D Permanent Corrective &amp; Preventive Action Plan
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded border border-border bg-card">
                  <div className="text-[10px] uppercase font-bold text-primary mb-1">D3 · Containment Action</div>
                  <p className="text-xs text-muted-foreground">Immediate 100% re-testing of sister batch WO-2412 elements at 2.2 bar pressure rig.</p>
                </div>
                <div className="p-3 rounded border border-border bg-card">
                  <div className="text-[10px] uppercase font-bold text-primary mb-1">D5 · Permanent Corrective Action (CAPA)</div>
                  <p className="text-xs text-foreground font-medium">{rca.correctiveAction}</p>
                </div>
                <div className="p-3 rounded border border-border bg-card">
                  <div className="text-[10px] uppercase font-bold text-primary mb-1">D7 · Recurrence Prevention</div>
                  <p className="text-xs text-foreground font-medium">{rca.preventiveAction}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 p-3 rounded border border-border bg-muted/20">
                  <div>
                    <div className="text-[9px] uppercase text-muted-foreground">CAPA Owner</div>
                    <div className="font-semibold text-xs mt-0.5">{rca.owner}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-muted-foreground">Target Completion</div>
                    <div className="font-mono text-xs mt-0.5">{rca.dueDate}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-border bg-muted/30 px-6 py-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground" onClick={() => {
            notifySuccess("8D CAPA Exported", "Report generated and archived for ISO 9001 audit verification.");
            onClose();
          }}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Export Signed 8D Report
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
