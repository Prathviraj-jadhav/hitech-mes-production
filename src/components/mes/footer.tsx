"use client";

import * as React from "react";
import { Activity, Wifi, Server, ShieldCheck, Clock } from "lucide-react";

export function Footer() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="flex h-8 items-center gap-4 px-4 text-[11px] font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="font-semibold text-foreground">Live</span>
          <span className="text-muted-foreground">· OPC-UA streaming</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <Server className="h-3 w-3" />
          <span>13 machines connected</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <Wifi className="h-3 w-3" />
          <span>Edge gateways: 5/5 healthy</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3" />
          <span>ISO 3834-2 · ISO 9001 · 14001 · 45001</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Activity className="h-3 w-3" />
          <span>Build v1.0.0</span>
          <span className="text-border">|</span>
          <Clock className="h-3 w-3" />
          <span className="tabular-nums">
            {now ? now.toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" }) : "--:--:--"} IST
          </span>
        </div>
      </div>
    </footer>
  );
}
