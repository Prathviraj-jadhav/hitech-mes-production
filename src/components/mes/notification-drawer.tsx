"use client";

import * as React from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { useMESPrefs } from "@/lib/mes/store";
import { ALERTS } from "@/lib/mes/seed";
import { formatDateTime } from "@/lib/mes/date-utils";
import { cn } from "@/lib/utils";
import {
  AlertTriangle, AlertCircle, Info, CheckCircle2, Clock,
  Bell, Filter, X, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationDrawer() {
  const { notifDrawerOpen, setNotifDrawer } = useMESPrefs();
  const [filter, setFilter] = React.useState<string>("all");
  const [acknowledged, setAcknowledged] = React.useState<Set<string>>(new Set());
  const [localOpen, setLocalOpen] = React.useState(false);

  // Listen for custom event to open drawer
  React.useEffect(() => {
    const handler = () => setLocalOpen(true);
    window.addEventListener("mes:open-notif-drawer", handler);
    return () => window.removeEventListener("mes:open-notif-drawer", handler);
  }, []);

  const isOpen = localOpen || notifDrawerOpen;
  const handleClose = (open: boolean) => {
    setLocalOpen(open);
    setNotifDrawer(open);
  };

  const filtered = ALERTS.filter(a => {
    if (filter !== "all" && a.severity !== filter) return false;
    return true;
  });

  const criticalCount = ALERTS.filter(a => a.severity === "critical").length;
  const warningCount = ALERTS.filter(a => a.severity === "warning").length;
  const infoCount = ALERTS.filter(a => a.severity === "info").length;

  const severityMeta = {
    critical: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/5", border: "border-destructive/30", label: "Critical" },
    warning: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/5", border: "border-warning/30", label: "Warning" },
    info: { icon: Info, color: "text-info", bg: "bg-info/5", border: "border-info/30", label: "Info" },
  };

  const handleAcknowledge = (id: string) => {
    setAcknowledged(prev => new Set(prev).add(id));
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" />
            Alerts & Reminders
          </SheetTitle>
          <SheetDescription className="text-xs">
            {ALERTS.length} active alerts - {criticalCount} critical, {warningCount} warnings, {infoCount} info
          </SheetDescription>
        </SheetHeader>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/20">
          {["all", "critical", "warning", "info"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-swiss",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[9px] h-4 px-1">
              {filtered.length} shown
            </Badge>
          </div>
        </div>

        {/* Alert list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-8 w-8 text-success mb-2" />
              <p className="text-sm font-semibold">All clear</p>
              <p className="text-xs text-muted-foreground">No alerts in this category</p>
            </div>
          )}
          {filtered.map((a) => {
            const meta = severityMeta[a.severity];
            const Icon = meta.icon;
            const isAcked = acknowledged.has(a.id) || a.acknowledged;
            return (
              <div
                key={a.id}
                className={cn(
                  "rounded-md border p-3 transition-swiss",
                  meta.border, meta.bg,
                  isAcked && "opacity-50"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", meta.color, a.severity === "critical" && !isAcked && "pulse-alert")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold truncate">{a.title}</span>
                      {a.plant && (
                        <span className="font-mono text-[10px] text-muted-foreground shrink-0">{a.plant}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug mb-2">{a.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] h-4 px-1">{a.module}</Badge>
                        <span className="text-[10px] text-muted-foreground tabular-nums flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDateTime(a.timestamp)}
                        </span>
                      </div>
                      {!isAcked && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] gap-1 text-primary hover:text-primary"
                          onClick={() => handleAcknowledge(a.id)}
                        >
                          <Check className="h-3 w-3" />
                          Ack
                        </Button>
                      )}
                      {isAcked && (
                        <span className="text-[10px] text-success flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Acked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5 flex items-center justify-between bg-muted/20">
          <span className="text-[10px] text-muted-foreground">
            {acknowledged.size} of {ALERTS.length} acknowledged
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px] gap-1"
            onClick={() => setAcknowledged(new Set(ALERTS.map(a => a.id)))}
          >
            <Check className="h-3 w-3" />
            Ack All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
