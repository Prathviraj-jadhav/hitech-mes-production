"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { KPI, MachineState, QualityResult, WorkOrderStatus } from "@/lib/mes/types";

/* === KPI Card - Swiss design with teal accents === */
export function KPICard({ kpi, onPin, pinned }: { kpi: KPI; onPin?: () => void; pinned?: boolean }) {
  const positive = kpi.trend >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;
  const meetsTarget = kpi.value >= kpi.target;
  const lowerBetter = ["Scrap", "Downtime", "Open NCRs"].includes(kpi.label);
  const good = lowerBetter ? kpi.value <= kpi.target : meetsTarget;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border bg-card p-4 transition-swiss hover:shadow-md hover:-translate-y-0.5 group gsap-reveal cursor-pointer",
        pinned && "ring-1 ring-primary/30 border-primary/30"
      )}
    >
      {/* Top accent line - gradient by status */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 transition-swiss",
        good ? "bg-gradient-to-r from-primary to-primary/60" : "bg-gradient-to-r from-destructive to-destructive/60"
      )} />
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold tracking-tight tabular-nums">
              {kpi.value.toLocaleString("en-IN")}
            </span>
            {kpi.unit && (
              <span className="text-xs font-medium text-muted-foreground">{kpi.unit}</span>
            )}
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
          good ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
        )}>
          <TrendIcon className={cn("h-3 w-3")} />
          {Math.abs(kpi.trend)}
        </div>
      </div>
      {/* Sparkline */}
      <Sparkline data={kpi.sparkline} className="mt-3 h-8 w-full" good={good} />
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{kpi.trendLabel}</span>
        <span className="tabular-nums">Target {kpi.target}{kpi.unit}</span>
      </div>
      {/* Pin button */}
      {onPin && (
        <button
          onClick={onPin}
          className={cn(
            "absolute right-2 top-2 h-5 w-5 rounded grid place-items-center opacity-0 group-hover:opacity-100 transition-swiss",
            pinned && "opacity-100"
          )}
        >
          <span className={cn("text-[10px]", pinned ? "font-bold text-primary" : "font-normal text-muted-foreground")}>★</span>
        </button>
      )}
    </Card>
  );
}

/* === Sparkline - teal for good, red for bad === */
export function Sparkline({ data, className, good = true }: { data: number[]; className?: string; good?: boolean }) {
  const w = 100;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const d = `M ${points.join(" L ")}`;
  const dArea = `${d} L ${w},${h} L 0,${h} Z`;
  const strokeColor = good ? "var(--primary)" : "var(--destructive)";
  const fillColor = good ? "var(--primary)" : "var(--destructive)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <path d={dArea} fill={fillColor} fillOpacity={0.08} />
      <path d={d} fill="none" stroke={strokeColor} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r="1.5"
        fill={strokeColor}
      />
    </svg>
  );
}

/* === Status Dot - color-coded by state === */
export function StatusDot({ state, label, pulse }: { state: MachineState; label?: string; pulse?: boolean }) {
  const map: Record<MachineState, { color: string; bg: string }> = {
    running: { color: "bg-success", bg: "ring-success/30" },
    idle: { color: "bg-muted-foreground/40", bg: "ring-muted-foreground/20" },
    down: { color: "bg-destructive", bg: "ring-destructive" },
    changeover: { color: "bg-warning", bg: "ring-warning/30" },
    offline: { color: "bg-transparent border border-border", bg: "" },
  };
  const s = map[state];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full ring-2", s.color, s.bg, state === "running" && pulse && "pulse-brand")} />
      {label && <span className="text-[11px] font-medium capitalize">{label}</span>}
    </span>
  );
}

/* === Quality Result Badge - color-coded === */
export function QualityBadge({ result }: { result: QualityResult }) {
  const map: Record<QualityResult, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
    pass: { label: "PASS", cls: "bg-success text-success-foreground", icon: CheckCircle2 },
    fail: { label: "FAIL", cls: "bg-destructive text-destructive-foreground", icon: XCircle },
    hold: { label: "HOLD", cls: "bg-warning text-warning-foreground", icon: Clock },
    pending: { label: "PEND", cls: "border border-border text-muted-foreground", icon: Clock },
  };
  const s = map[result];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex h-5 min-w-[44px] items-center justify-center gap-1 rounded px-1.5 text-[10px] font-bold tracking-wider", s.cls)}>
      <Icon className="h-2.5 w-2.5" />
      {s.label}
    </span>
  );
}

/* === Work Order Status Badge === */
export function WOStatusBadge({ status }: { status: WorkOrderStatus }) {
  const map: Record<WorkOrderStatus, { label: string; cls: string }> = {
    released: { label: "RELEASED", cls: "border border-border text-muted-foreground" },
    started: { label: "STARTED", cls: "bg-primary/10 text-primary border border-primary/30" },
    "in-progress": { label: "IN PROGRESS", cls: "bg-primary text-primary-foreground" },
    "on-hold": { label: "ON HOLD", cls: "bg-warning text-warning-foreground" },
    completed: { label: "COMPLETED", cls: "bg-success text-success-foreground" },
    closed: { label: "CLOSED", cls: "bg-muted text-muted-foreground" },
  };
  const s = map[status];
  return (
    <span className={cn("inline-flex h-5 items-center justify-center rounded px-2 text-[10px] font-bold tracking-wider", s.cls)}>
      {s.label}
    </span>
  );
}

/* === Priority marker === */
export function PriorityMark({ priority }: { priority: string }) {
  if (priority === "rush") {
    return <span className="inline-flex h-5 items-center rounded bg-destructive px-1.5 text-[10px] font-bold tracking-wider text-destructive-foreground pulse-alert">RUSH</span>;
  }
  if (priority === "high") {
    return <span className="inline-flex h-5 items-center rounded border-2 border-primary px-1.5 text-[10px] font-bold tracking-wider text-primary">HIGH</span>;
  }
  if (priority === "low") {
    return <span className="inline-flex h-5 items-center rounded border border-border px-1.5 text-[10px] font-bold tracking-wider text-muted-foreground">LOW</span>;
  }
  return <span className="inline-flex h-5 items-center rounded px-1.5 text-[10px] font-bold tracking-wider text-muted-foreground">NORMAL</span>;
}

/* === Panel header === */
export function PanelHeader({
  title, subtitle, icon: Icon, action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/20">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-bold tracking-tight truncate">{title}</h3>
          {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* === Section title === */
export function SectionTitle({ title, count, action }: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</h2>
        {count !== undefined && (
          <span className="grid h-5 min-w-5 place-items-center rounded bg-primary px-1 text-[10px] font-bold text-primary-foreground tabular-nums">
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

/* === Progress bar - teal === */
export function MonoProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("relative h-1.5 w-full bg-muted overflow-hidden rounded-full", className)}>
      <div
        className={cn(
          "absolute inset-y-0 left-0 transition-all duration-500 rounded-full",
          value >= 90 ? "bg-success" : value >= 50 ? "bg-primary" : "bg-warning"
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* === OEE gauge (circular) - teal === */
export function OEEGauge({ value, size = 120, label = "OEE" }: { value: number; size?: number; label?: string }) {
  const stroke = size >= 80 ? 8 : size >= 50 ? 5 : 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 75 ? "var(--success)" : value >= 50 ? "var(--primary)" : "var(--destructive)";
  // Scale font size based on gauge size
  const valueFontSize = size >= 100 ? "text-2xl" : size >= 70 ? "text-lg" : size >= 50 ? "text-sm" : "text-[10px]";
  const labelFontSize = size >= 100 ? "text-[9px]" : size >= 50 ? "text-[8px]" : "text-[7px]";
  // Show decimal only on larger gauges
  const displayValue = size >= 70 ? value.toFixed(1) : Math.round(value).toString();
  return (
    <div className="relative grid place-items-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-muted" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center leading-none">
        <span className={cn("font-bold tabular-nums", valueFontSize)}>{displayValue}</span>
        {size >= 45 && <span className={cn("font-semibold uppercase tracking-wider text-muted-foreground", labelFontSize)}>{label}</span>}
      </div>
    </div>
  );
}

/* === Tag === */
export function MonoTag({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "solid" | "outline" | "success" | "warning" | "destructive" }) {
  const cls = {
    default: "bg-muted text-foreground",
    solid: "bg-primary text-primary-foreground",
    outline: "border border-border text-foreground",
    success: "bg-success/10 text-success border border-success/30",
    warning: "bg-warning/10 text-warning-foreground border border-warning/30",
    destructive: "bg-destructive/10 text-destructive border border-destructive/30",
  }[variant];
  return (
    <span className={cn("inline-flex h-5 items-center rounded px-1.5 text-[10px] font-medium tracking-wide", cls)}>
      {children}
    </span>
  );
}

/* === Skeleton loader === */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted rounded", className)}>
      <div className="absolute inset-0 scan-line" />
    </div>
  );
}

/* === KPI skeleton === */
export function KPISkeleton() {
  return (
    <Card className="p-4 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-8 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-2 w-16" />
      </div>
    </Card>
  );
}

/* === Empty state === */
export function EmptyState({ icon: Icon, title, description, action }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="grid h-12 w-12 place-items-center rounded border-2 border-dashed border-border text-muted-foreground mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="text-sm font-bold">{title}</h4>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/* === Live ticker === */
export function LiveTicker({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden bg-muted/30 border-y border-border">
      <div className="flex items-center gap-2 py-1.5 px-4">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 text-primary">Live</span>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="h-0.5 w-0.5 rounded-full bg-primary/40" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Data table row === */
export function HoverRow({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "group transition-swiss",
        onClick && "cursor-pointer",
        "hover:bg-accent/40",
        className
      )}
    >
      {children}
    </tr>
  );
}

/* === Button with micro-interaction === */
export function PressButton({ children, onClick, variant = "default", className }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold transition-swiss active:scale-[0.97]",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-border hover:border-primary/40 hover:bg-accent",
        variant === "ghost" && "hover:bg-accent",
        className
      )}
    >
      {children}
    </button>
  );
}

/* === Divider === */
export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) {
    return <div className={cn("h-px bg-border w-full", className)} />;
  }
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-px bg-border flex-1" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="h-px bg-border flex-1" />
    </div>
  );
}

/* === Status pill === */
export function StatusPill({ label, state = "default" }: { label: string; state?: "default" | "active" | "muted" | "success" | "warning" | "destructive" }) {
  const cls = {
    active: "bg-primary text-primary-foreground",
    default: "border border-border text-foreground",
    muted: "text-muted-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  }[state];
  return (
    <span className={cn("inline-flex items-center gap-1.5 h-5 px-2 rounded text-[10px] font-bold uppercase tracking-wider", cls)}>
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        state === "active" && "bg-primary-foreground pulse-brand",
        state === "default" && "bg-primary",
        state === "muted" && "bg-muted-foreground/40",
        state === "success" && "bg-success-foreground pulse-brand",
        state === "warning" && "bg-warning-foreground",
        state === "destructive" && "bg-destructive-foreground pulse-alert",
      )} />
      {label}
    </span>
  );
}

/* === Mini bar chart === */
export function MiniBars({ data, max, className }: { data: number[]; max?: number; className?: string }) {
  const m = max || Math.max(...data, 1);
  return (
    <div className={cn("flex items-end gap-0.5 h-8", className)}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-primary transition-swiss hover:opacity-70"
          style={{ height: `${(v / m) * 100}%`, opacity: 0.3 + (v / m) * 0.7 }}
        />
      ))}
    </div>
  );
}

/* === Ring progress (semi-circle) === */
export function RingProgress({ value, size = 60, label }: { value: number; size?: number; label?: string }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 75 ? "var(--success)" : value >= 50 ? "var(--primary)" : "var(--destructive)";
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size / 2 + 4 }}>
      <svg width={size} height={size / 2 + 4} viewBox={`0 0 ${size} ${size / 2 + 4}`}>
        <path
          d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          className="stroke-muted"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-sm font-bold tabular-nums">{value}%</span>
        {label && <span className="text-[8px] uppercase tracking-wider text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}

/* === Alert Card - detailed with color coding === */
export function AlertCard({ severity, title, description, timestamp, module: moduleName, plant, onAcknowledge }: {
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  timestamp: string;
  module: string;
  plant?: string;
  onAcknowledge?: () => void;
}) {
  const meta = {
    info: { color: "border-info/30 bg-info/5", dot: "bg-info", icon: AlertCircle },
    warning: { color: "border-warning/30 bg-warning/5", dot: "bg-warning", icon: AlertCircle },
    critical: { color: "border-destructive/30 bg-destructive/5", dot: "bg-destructive pulse-alert", icon: AlertCircle },
  }[severity];
  const Icon = meta.icon;
  return (
    <div className={cn("rounded-md border p-3 transition-swiss hover:shadow-sm", meta.color)}>
      <div className="flex items-start gap-2.5">
        <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", severity === "critical" && "text-destructive", severity === "warning" && "text-warning", severity === "info" && "text-info")} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold truncate">{title}</span>
            {plant && <span className="font-mono text-[10px] text-muted-foreground shrink-0">{plant}</span>}
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug mb-2">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{moduleName}</span>
              <span className="text-[9px] text-muted-foreground tabular-nums">
                {new Date(timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {onAcknowledge && (
              <button onClick={onAcknowledge} className="text-[10px] font-semibold text-primary hover:underline">
                Acknowledge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
