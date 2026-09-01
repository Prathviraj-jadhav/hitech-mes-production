# HiTech MES - Manufacturing Execution System

A production-grade Manufacturing Execution System (MES) for Hi-Tech Radiators Pvt. Ltd.

## Features

- **26 MES Modules**: Overview, Planning (APS), Work Orders, Inventory, Quality (ISO 3834-2),
  Traceability, IIoT, OEE, Maintenance (CMMS), Energy, Workforce, Documents, Operator Terminal,
  Andon Big Screen, Shift Handover, Line Simulator, Suppliers, Audit Trail, Customer Portal,
  Dispatch & Logistics, Calibration Calendar, Cost of Quality (PAIF), Root Cause Analysis (5-Whys),
  Production Forecast, WIP Aging & Kanban, Dashboards & Alerts
- **Multi-Plant**: K1, K2, K3, K4 (Khopoli) + R1 (Rabale)
- **Strict Monochrome Design**: Black, white, and gray shades only
- **Personalization**: Plant switcher, role switcher (8 roles), density toggle, theme toggle,
  time range, search, Cmd+K command palette
- **Real-time Simulations**: Live OEE gauges, production line flow animation, Andon big-screen

## Tech Stack

- Next.js 16 with App Router
- TypeScript 5
- Tailwind CSS 4 with shadcn/ui (New York style)
- Recharts for data visualization
- Zustand for state management
- Prisma ORM (SQLite)

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open http://localhost:3000
```

## Production Deployment

```bash
# Build for production
bun run build

# Start production server
bun run start
```

## Project Structure

```
src/
  app/
    page.tsx          # Main MES application (26 modules)
    layout.tsx        # Root layout with theme provider
    globals.css       # Monochrome design system
    api/mes/route.ts  # MES data API
  components/
    mes/              # MES-specific components (sidebar, topbar, footer, UI primitives)
    ui/               # shadcn/ui component library
  lib/
    mes/
      types.ts        # Domain types (WorkOrder, Machine, NCR, Shipment, etc.)
      seed.ts         # Deterministic seed data
      store.ts        # Zustand personalization store
    db.ts             # Prisma client
    utils.ts          # Utility functions
```

## Design System

Strict monochrome - all colors use zero chroma (pure grayscale):
- Background: white / near-black (dark mode)
- Foreground: near-black / white (dark mode)
- Charts: 5 shades of gray (oklch with 0 chroma)
- Status indicators: differentiated by shape, density, and border weight (not color)

## License

Proprietary - Hi-Tech Radiators Pvt. Ltd.
