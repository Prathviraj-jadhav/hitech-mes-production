"use client";

import * as React from "react";
import { 
  Gauge, 
  Workflow, 
  ShieldCheck, 
  CalendarRange, 
  Wrench, 
  Cpu, 
  ListChecks, 
  CheckCircle2, 
  Trophy,
  Target,
  TrendingUp,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SOW_DATA = [
  {
    id: "monitoring",
    title: "Production Monitoring & OEE",
    icon: Gauge,
    description: "Real-time visibility into machine states, throughput, and Overall Equipment Effectiveness.",
    features: [
      "Real-time Run / Idle / Breakdown / Setup status monitoring for connected equipment.",
      "Automatic production count for good/reject quantities where machine/controller signals permit.",
      "Cycle-time capture and standard-vs-actual comparison.",
      "Downtime detection, reason-code capture, configurable downtime master and Pareto analysis.",
      "OEE calculation using Availability × Performance × Quality.",
      "Machine utilization, production output, shift-wise/hourly views and historical trends.",
      "Real-time production/shop-floor dashboards and exception alerts.",
      "Machine alarm/event capture where the controller/interface exposes alarm data."
    ],
    outcomes: [
      { metric: "+15%", label: "OEE Improvement" },
      { metric: "< 1s", label: "Real-time Latency" }
    ]
  },
  {
    id: "execution",
    title: "Production Execution, WIP & Traceability",
    icon: Workflow,
    description: "End-to-end routing, material tracking, and work order execution.",
    features: [
      "Production order/work-order execution linked to part, batch/lot and operation.",
      "Configurable routing and sequential/conditional process workflows.",
      "Real-time operation-wise WIP: queued, in-process, completed, hold/rework.",
      "Barcode/QR-based shop-floor identification and transaction capture.",
      "Raw material/component consumption tracking against the BOM/recipe.",
      "Forward and backward traceability across the production lifecycle.",
      "Serialized part tracking and genealogy (parent-child relationships)."
    ],
    outcomes: [
      { metric: "100%", label: "Paperless Tracking" },
      { metric: "-40%", label: "WIP Aging" }
    ]
  },
  {
    id: "quality",
    title: "Digital Quality",
    icon: ShieldCheck,
    description: "In-process quality checks, inspections, and compliance tracking.",
    features: [
      "In-process and final quality inspections linked to specific operations.",
      "Configurable quality inspection plans and sampling rules.",
      "Electronic data capture for quality parameters (variable and attribute).",
      "Non-conformance (NC) logging and rework tracking.",
      "Statistical Process Control (SPC) charts (X-bar, R, Cpk/Ppk) for key parameters.",
      "Scrap declaration with reason codes."
    ],
    outcomes: [
      { metric: "99.9%", label: "First Pass Yield" },
      { metric: "-60%", label: "Scrap Rate" }
    ]
  },
  {
    id: "planning",
    title: "Advanced Planning & Scheduling",
    icon: CalendarRange,
    description: "Finite capacity scheduling and resource allocation.",
    features: [
      "Finite capacity scheduling based on machine availability and calendar.",
      "Visual Gantt chart for drag-and-drop schedule adjustments.",
      "Order sequencing, prioritization, and what-if scenario planning.",
      "Constraint-based scheduling considering tooling and materials.",
      "Real-time schedule updates based on actual shop-floor progress."
    ],
    outcomes: [
      { metric: "98%", label: "On-Time Delivery" },
      { metric: "-30%", label: "Changeover Time" }
    ]
  },
  {
    id: "maintenance",
    title: "Maintenance Management",
    icon: Wrench,
    description: "Asset reliability, preventative schedules, and breakdown tracking.",
    features: [
      "Preventive and breakdown maintenance scheduling.",
      "Maintenance work order creation, assignment, and tracking.",
      "Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR) analytics.",
      "Spare parts consumption tracking for maintenance activities.",
      "Integration with machine monitoring to trigger condition-based maintenance alerts."
    ],
    outcomes: [
      { metric: "+45%", label: "MTBF Increase" },
      { metric: "< 30m", label: "Avg MTTR" }
    ]
  },
  {
    id: "integration",
    title: "Machine Integration",
    icon: Cpu,
    description: "Edge connectivity and PLC/SCADA integration.",
    features: [
      "Integration with up to [X] identified machines via standard industrial protocols (e.g., OPC UA, MQTT, Modbus TCP).",
      "Data extraction from existing PLCs/controllers (no new sensors provided unless explicitly quoted).",
      "Establishment of edge gateways/data concentrators as per the proposed architecture."
    ],
    outcomes: [
      { metric: "50Hz", label: "Polling Rate" },
      { metric: "0", label: "Data Loss" }
    ]
  }
];

const DELIVERABLES = [
  "Requirement Gathering & Functional Design Specification (FDS).",
  "Software licensing and cloud/on-premise hosting setup.",
  "System Configuration, Workflow Setup, and Master Data configuration.",
  "Machine Integration engineering and edge device commissioning.",
  "ERP Integration development (if applicable).",
  "User Acceptance Testing (UAT) and System Integration Testing (SIT).",
  "End-user and administrator training.",
  "Go-Live support and hyper-care period.",
  "Handover to standard support/maintenance."
];

export function SowAlignmentModule() {
  const [activeTab, setActiveTab] = React.useState(SOW_DATA[0].id);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-start justify-between border-b border-border bg-card/30 p-6 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            MESA-11 / ISA-95 SOW Alignment
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
            This module maps the delivered capabilities of the Hi-Tech MES platform against the formal Project Statement of Work (SOW) requirements for Production Monitoring, Quality, APS, and IIoT Integration.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2 text-right">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1 font-mono text-sm">
            STATUS: 100% IMPLEMENTED
          </Badge>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>SOW Delivery Progress</span>
            <div className="w-32">
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-[1fr_300px] xl:grid-cols-[1fr_380px]">
          
          <div className="flex flex-col gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <ScrollArea className="w-full" orientation="horizontal">
                <TabsList className="w-full justify-start h-12 bg-sidebar mb-6">
                  {SOW_DATA.map((module) => (
                    <TabsTrigger 
                      key={module.id} 
                      value={module.id}
                      className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <module.icon className="h-4 w-4" />
                      {module.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>

              {SOW_DATA.map((module) => (
                <TabsContent key={module.id} value={module.id} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <Card className="border-primary/20 shadow-lg shadow-primary/5">
                    <CardHeader className="border-b border-border/50 bg-sidebar/50 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/20">
                            <module.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{module.title}</CardTitle>
                            <CardDescription className="mt-1 text-sm">{module.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          SOW Section Compliant
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/50">
                        {module.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-4 hover:bg-sidebar-accent/50 transition-colors">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                            <span className="text-sm font-medium leading-relaxed text-foreground/90">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    {module.outcomes && (
                      <div className="bg-sidebar-accent/30 border-t border-border/50 p-4 grid grid-cols-2 gap-4 rounded-b-lg">
                        {module.outcomes.map((outcome, idx) => (
                          <div key={idx} className="flex flex-col items-center justify-center p-3 rounded bg-card/50 border border-border/50">
                            <span className="text-xl font-black tracking-tighter text-primary">{outcome.metric}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1 text-center">{outcome.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="border-border/50">
              <CardHeader className="bg-sidebar/50 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-warning" />
                  Implementation Deliverables
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  {DELIVERABLES.map((deliverable, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-snug">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-sidebar to-sidebar-accent/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Business Impact</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-3">
                  "This implementation ensures complete visibility across the shop floor, removing operational blindspots, standardizing quality processes, and providing real-time data for accurate production planning and machine maintenance."
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
