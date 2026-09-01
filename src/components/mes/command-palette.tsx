"use client";

import * as React from "react";
import {
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, Users, FileText, Bell, Monitor,
  Building2, UserCog, Sun, Moon, Grid3x3, Rows3, Check, Factory,
  Command as CommandIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useMESPrefs, MODULES, PLANTS, ROLES } from "@/lib/mes/store";
import type { PlantCode, Role, MESModule, Density } from "@/lib/mes/types";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, CalendarRange, ClipboardList, Boxes, ShieldCheck,
  Workflow, Cpu, Gauge, Wrench, Zap, Users, FileText, Bell, Monitor,
};

const DENSITY_OPTIONS: { id: Density; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "compact", label: "Compact", icon: Rows3 },
  { id: "comfortable", label: "Comfortable", icon: Grid3x3 },
  { id: "spacious", label: "Spacious", icon: Grid3x3 },
];

/**
 * CommandPalette - global Cmd+K / Ctrl+K palette for the MES shell.
 * Strictly monochrome. Wraps shadcn Command (cmdk) inside a Dialog.
 *
 * Triggers:
 *   - Cmd+K / Ctrl+K anywhere on the page
 *   - Custom window event "mes:open-command-palette" (used by Topbar ⌘K chip)
 */
export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const {
    activeModule, setModule,
    activePlant, setPlant,
    activeRole, setRole,
    density, setDensity,
    showGrid, toggleGrid,
  } = useMESPrefs();

  // Listen for Cmd+K / Ctrl+K and the custom open event.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onCustom = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mes:open-command-palette", onCustom as EventListener);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mes:open-command-palette", onCustom as EventListener);
    };
  }, []);

  const close = React.useCallback(() => setOpen(false), []);

  const run = (fn: () => void) => () => {
    fn();
    close();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="MES Command Palette"
      description="Search modules, plants, roles and quick actions."
      className="sm:max-w-[640px] p-0"
    >
      <CommandInput placeholder="Type a command or search…" />
      <CommandList className="max-h-[460px]">
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Modules */}
        <CommandGroup heading="Modules">
          {MODULES.map((m) => {
            const Icon = ICONS[m.icon] || LayoutDashboard;
            const active = activeModule === m.id;
            return (
              <CommandItem
                key={m.id}
                value={`module ${m.short} ${m.name} ${m.description}`}
                onSelect={run(() => setModule(m.id as MESModule))}
                className="gap-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{m.short}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{m.description}</span>
                </div>
                {active ? (
                  <Check className="ml-auto h-3.5 w-3.5" />
                ) : (
                  <CommandShortcut>switch</CommandShortcut>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Plants */}
        <CommandGroup heading="Plant Scope">
          <CommandItem
            value="plant all plants every site"
            onSelect={run(() => setPlant("ALL"))}
            className="gap-2.5"
          >
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium">All Plants</span>
            <span className="ml-auto text-[11px] text-muted-foreground">5 sites</span>
            {activePlant === "ALL" && <Check className="ml-2 h-3.5 w-3.5" />}
          </CommandItem>
          {PLANTS.map((p) => {
            const active = activePlant === p.code;
            return (
              <CommandItem
                key={p.code}
                value={`plant ${p.code} ${p.name} ${p.location} ${p.role}`}
                onSelect={run(() => setPlant(p.code as PlantCode))}
                className="gap-2.5"
              >
                <Factory className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-mono text-sm font-bold w-8">{p.code}</span>
                <span className="text-sm font-medium truncate flex-1">{p.name}</span>
                <span className="text-[11px] text-muted-foreground truncate max-w-[160px]">{p.role}</span>
                {active && <Check className="ml-2 h-3.5 w-3.5" />}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Roles */}
        <CommandGroup heading="View as Role">
          {ROLES.map((r) => {
            const active = activeRole === r.id;
            return (
              <CommandItem
                key={r.id}
                value={`role ${r.name} ${r.description}`}
                onSelect={run(() => setRole(r.id as Role))}
                className="gap-2.5"
              >
                <UserCog className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{r.name}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{r.description}</span>
                </div>
                {active && <Check className="ml-auto h-3.5 w-3.5" />}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Quick actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            value="toggle theme dark light mode"
            onSelect={run(() => setTheme(theme === "dark" ? "light" : "dark"))}
            className="gap-2.5"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">Toggle theme</span>
            <CommandShortcut>{theme === "dark" ? "→ light" : "→ dark"}</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="toggle grid background show hide grid"
            onSelect={run(toggleGrid)}
            className="gap-2.5"
          >
            <Grid3x3 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium">Toggle grid background</span>
            <CommandShortcut>{showGrid ? "on → off" : "off → on"}</CommandShortcut>
          </CommandItem>

          {DENSITY_OPTIONS.map((d) => {
            const Icon = d.icon;
            const active = density === d.id;
            return (
              <CommandItem
                key={d.id}
                value={`density ${d.label}`}
                onSelect={run(() => setDensity(d.id))}
                className="gap-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Density: {d.label}</span>
                {active ? (
                  <Check className="ml-auto h-3.5 w-3.5" />
                ) : (
                  <CommandShortcut>set</CommandShortcut>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Footer hint */}
        <CommandGroup>
          <CommandItem disabled className="gap-2.5 opacity-70">
            <CommandIcon className="h-3.5 w-3.5" />
            <span className="text-[11px] text-muted-foreground">
              Tip: press <kbd className="font-mono">Esc</kbd> to close · <kbd className="font-mono">↑↓</kbd> to navigate · <kbd className="font-mono">Enter</kbd> to run
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// Re-export to satisfy tree-shakers that expect a default export name.
export default CommandPalette;
