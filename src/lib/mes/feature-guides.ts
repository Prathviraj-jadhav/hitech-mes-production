// Complete Feature & User Guide for all 26 Hi-Tech MES Modules
// Aligned with ISA-95, MESA-11, and Hi-Tech Radiators Multi-Plant Production Standards

import type { MESModule, Role } from "./types";

export interface ModuleGuide {
  id: MESModule | "features-guide";
  name: string;
  short: string;
  category: "Operations" | "Quality" | "Shop Floor" | "Support" | "Intelligence" | "Help";
  icon: string;
  tagline: string;
  whatIsItFor: string;
  whyItIsUsed: string;
  shopFloorScenario: string;
  businessImpact: string;
  targetRoles: Role[];
  keyCapabilities: string[];
  howToUseSteps: { step: number; title: string; instruction: string }[];
  keyKPIs: { name: string; target: string; description: string }[];
  proTips: string[];
  relatedModules: MESModule[];
}

export const MODULE_GUIDES: ModuleGuide[] = [
  {
    id: "overview",
    name: "Executive Cockpit",
    short: "Overview",
    category: "Operations",
    icon: "LayoutDashboard",
    tagline: "Enterprise-wide real-time visibility across all manufacturing plants",
    whatIsItFor:
      "The Executive Cockpit provides a consolidated high-level operational command center aggregating all 5 manufacturing facilities (K1 Radiators, K2 Header Pipes, K3 Fin Pressing, K4 Raw Materials in Khopoli, and R1 Transformer Tanks in Rabale). It pulls live telemetry, work order throughput, OEE trends, and critical quality alerts into a single unified screen.",
    whyItIsUsed:
      "In heavy transformer radiator manufacturing, plant leaders cannot wait for end-of-day spreadsheets or verbal shift handovers to know if a critical bottleneck has stalled delivery. The Executive Cockpit is used to eliminate operational blindness, synchronize multi-plant interdependencies, detect machine breakdowns in real-time, and ensure on-time dispatch commitments for global OEMs like Siemens, ABB, and Toshiba.",
    shopFloorScenario:
      "A Plant Director arrives at 08:30 AM, opens the Cockpit on an ultrawide screen, and immediately sees that Plant K1 OEE is at 72.4% due to an unacknowledged heater fault on HDG-2 (Hot-Dip Galvanizing kettle). With one click, they drill down into the kettle parameters, page the maintenance supervisor via the drawer, and verify that the 240-unit Siemens Energy radiator dispatch batch will remain on schedule for 16:00 dispatch.",
    businessImpact:
      "Reduces management reaction time from hours to minutes, eliminates delivery penalties (LDs), and prevents multi-plant schedule misalignment across Khopoli and Rabale sites.",
    targetRoles: ["executive", "plant-manager", "planner"],
    keyCapabilities: [
      "Real-time aggregated OEE, First-Pass Yield, Scrap Rate, and On-Time Dispatch tracking across all 5 facilities",
      "Interactive plant scope selector ('All Plants' enterprise view vs. single-plant focus K1, K2, K3, K4, R1)",
      "Live Production Telemetry Ticker displaying sensor streams (furnace temps, welding speeds, cycle times)",
      "Urgent alert banner with severity classification (Critical, Warning, Info) and direct triage links",
      "One-click 'Export Shift Report' generating PDF/CSV executive summaries for operational reviews",
      "Interactive KPI drill-down dialogs breaking down root contributors for OEE, Scrap, and Downtime",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Plant Scope", instruction: "Use the Topbar dropdown or Plant Matrix cards to toggle between consolidated multi-plant view ('All Plants') or drill into a specific plant (K1, K2, K3, K4, R1)." },
      { step: 2, title: "Inspect High-Level Sparklines", instruction: "Check the 8 primary KPI cards at the top. Click any card (e.g. Overall OEE or First-Pass Yield) to open the interactive root-cause drill-down dialog." },
      { step: 3, title: "Triage Live Plant Alerts", instruction: "Review the Live Alert stream on the right. Red pulsing alerts represent critical equipment failures or quality deviations that require immediate containment." },
      { step: 4, title: "Analyze 24-Hour OEE Trends", instruction: "Inspect the OEE Area Chart to monitor the interplay of Availability, Performance, and Quality across Shift A, B, and C." },
      { step: 5, title: "Export Shift Report", instruction: "Click 'Export Shift Report' in the top-right corner to download a PDF report for daily management standups." },
    ],
    keyKPIs: [
      { name: "Overall OEE", target: "≥ 75.0%", description: "Availability × Performance × Quality across active production lines" },
      { name: "First-Pass Yield", target: "≥ 96.0%", description: "Percentage of radiators passing final inspection without rework" },
      { name: "On-Time Dispatch", target: "≥ 90.0%", description: "Orders dispatched on or before promised delivery date" },
      { name: "Scrap Rate", target: "≤ 1.8%", description: "Material scrap percentage during fin stamping, folding and welding" },
    ],
    proTips: [
      "Click any plant card in the Plant Network grid to open an in-depth slide-over drawer with machine states, active work orders, and local operators.",
      "Use keyboard shortcut 'Shift+?' at any time to open this Feature Guide for instant operational help.",
    ],
    relatedModules: ["oee", "quality", "work-orders", "dashboards"],
  },
  {
    id: "planning",
    name: "Production Planning & Scheduling (APS)",
    short: "Planning",
    category: "Operations",
    icon: "CalendarRange",
    tagline: "Finite-capacity scheduling, Gantt sequencing & what-if capacity leveling",
    whatIsItFor:
      "Advanced Planning and Scheduling (APS) engine that sequences work orders against finite machine hours, tooling availability, and raw material heat lots across fin stamping lines, header pipe welding bays, and galvanizing kettles.",
    whyItIsUsed:
      "Transformer radiators involve complex multi-stage batch production (Fin Rolling → Element Welding → Header Assembly → Pressure Testing → Galvanizing → Painting). Without finite APS, lines experience chronic starvation, excessive die changeover downtime, and delayed OEM deliveries. This module is used to optimize line utilization, simulate rush orders, and ensure zero line idling.",
    shopFloorScenario:
      "A rush purchase order arrives from Siemens Energy for 120 units of 2400mm radiators with a 3-day turnaround. The Planner opens the Planning module, drags the order into Line 1 Shift A, and the APS algorithm automatically verifies cold-rolled coil stock in K4, reserves Fin Press FP-01, and schedules the HDG kettle slot without displacing existing high-priority ABB orders.",
    businessImpact:
      "Reduces changeover downtime by 35%, improves on-time delivery from 82% to 94%, and prevents work-in-progress (WIP) pileups on the shop floor.",
    targetRoles: ["planner", "plant-manager", "executive"],
    keyCapabilities: [
      "Interactive finite-capacity Gantt scheduling board with drag-and-drop job rescheduling",
      "Work center capacity utilization heatmaps across shifts (Shift A, Shift B, Shift C)",
      "Automated lead-time calculation factoring in galvanizing dwell and epoxy paint curing times",
      "Rush order injection and real-time conflict detection with existing committed jobs",
      "One-click schedule dispatch pushing digital job cards directly to Operator Terminals",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Demand Backlog", instruction: "Inspect unscheduled sales orders and production requests in the left backlog drawer." },
      { step: 2, title: "Sequence on Gantt Board", instruction: "Drag work orders onto available machine bays (e.g. Fin Line 1, HDG Kettle 2). The system highlights tooling compatibility and changeover times." },
      { step: 3, title: "Resolve Capacity Clashes", instruction: "Check the Work Center Utilization gauge. If a bay exceeds 95% capacity, shift batch lots to secondary bays or schedule an overtime shift." },
      { step: 4, title: "Publish Schedule", instruction: "Click 'Publish Shift Schedule' to broadcast updated job cards to all shop-floor operator terminals in real time." },
    ],
    keyKPIs: [
      { name: "Schedule Adherence", target: "≥ 92.0%", description: "Percentage of jobs completed in their planned time slot" },
      { name: "Capacity Utilization", target: "82% - 88%", description: "Balanced machine loading without causing thermal bottlenecks" },
      { name: "Changeover Duration", target: "≤ 45 min", description: "Average tooling/die setup time between radiator pitch variants" },
    ],
    proTips: [
      "Group orders by fin width (520mm vs. 380mm) to minimize fin press tooling changeovers and save up to 90 minutes per shift.",
      "Check raw material coil availability in Inventory before locking the 3-day production horizon.",
    ],
    relatedModules: ["work-orders", "inventory", "forecast", "wip-aging"],
  },
  {
    id: "work-orders",
    name: "Work Order Management",
    short: "Work Orders",
    category: "Operations",
    icon: "ClipboardList",
    tagline: "End-to-end digital job cards, BOM tracking & stage-gate progression",
    whatIsItFor:
      "Centralized work order tracking system that tracks every production batch from raw coil issue through cutting, fin forming, seam welding, header pipe fitting, pressure testing, hot-dip galvanizing, painting, and final packaging.",
    whyItIsUsed:
      "Paper traveler sheets in fabrication plants get dirty, lost, or filled out retroactively, leading to unrecorded scrap, traceability gaps, and untracked WIP. This module is used to provide digital traveler tracking with real-time status updates, stage-gate quality locks, and live piece-count reconciliation.",
    shopFloorScenario:
      "A line supervisor selects WO-2026-0842 on their tablet. They see that 80 of 100 radiators have passed the 2.0 bar underwater leak test, 2 failed with pinhole leaks at weld seam #3, and 18 are in the queue. The supervisor logs the 2 defects into the NCR system with one tap and releases the 80 passed units to the HDG galvanizing bay.",
    businessImpact:
      "Eliminates 100% of paper travelers, prevents unauthorized progression of defective parts, and provides accurate real-time inventory counts.",
    targetRoles: ["plant-manager", "supervisor", "operator", "planner"],
    keyCapabilities: [
      "Multi-stage digital traveler cards with live status badges (Scheduled, In-Progress, On-Hold, Completed)",
      "BOM consumption tracking linking heat numbers, cold-rolled coils, header pipes, and paint batches",
      "Interactive stage progression with mandatory quality verification gates (Hydro Test, Zinc Coating Dwell)",
      "Real-time scrap and rework logging with immediate root-cause defect code tagging",
      "Full search and filter by Customer (Siemens, ABB), Heat Number, Product Model, and Priority",
    ],
    howToUseSteps: [
      { step: 1, title: "Locate Work Order", instruction: "Use search or status tabs (In-Progress, On-Hold, Completed) to find the target work order." },
      { step: 2, title: "Open Detail Sheet", instruction: "Click any row to open the full digital job card with BOM specs, drawings, and stage history." },
      { step: 3, title: "Log Completed Quantity", instruction: "Enter good units completed and record any scrapped pieces with the applicable defect code." },
      { step: 4, title: "Progress to Next Stage", instruction: "Click 'Advance Stage' (e.g. Header Welding → Pressure Test). If quality clearance is required, attach the inspection report." },
    ],
    keyKPIs: [
      { name: "WIP Turn Time", target: "≤ 36 hrs", description: "Total elapsed time from raw sheet decoiling to final packing" },
      { name: "Scrap Loss Rate", target: "≤ 1.5%", description: "Percentage of material scrapped during work order execution" },
      { name: "Job Card Accuracy", target: "100%", description: "Reconciliation between physically produced and digitally recorded pieces" },
    ],
    proTips: [
      "Pin urgent orders to the top of your list by clicking the star icon next to the order number.",
      "Always verify the steel mill heat number before issuing high-pressure fin batches.",
    ],
    relatedModules: ["operator-terminal", "traceability", "quality", "wip-aging"],
  },
  {
    id: "inventory",
    name: "Inventory & Raw Material Management",
    short: "Inventory",
    category: "Operations",
    icon: "Boxes",
    tagline: "Coil heat-lot tracking, WIP buffers, chemical stock & min-max replenishment",
    whatIsItFor:
      "Enterprise inventory management covering raw materials (CRCA steel coils, header pipes, zinc ingots, epoxy paint, primers), work-in-progress (WIP) buffer stores at K4, and finished radiator stock ready for dispatch.",
    whyItIsUsed:
      "Steel coils and high-purity zinc represent over 65% of transformer radiator manufacturing cost. Running out of prime CRCA coil halts the entire plant, while over-stocking ties up crores in working capital. This module is used to maintain precision min-max levels, track mill test certificates (MTC), prevent coil rusting, and optimize reorder cycles.",
    shopFloorScenario:
      "The Store Manager at Plant K4 scans a newly delivered 15-ton CRCA steel coil (Heat #HT-98214) from JSW Steel. The system automatically verifies the chemical composition (Carbon 0.06%, Manganese 0.28%) against EN 10130 specifications, prints a QR barcode label, and assigns it to Bay B-04. When coil stock drops below the 20-ton safety threshold, a reorder PO is automatically generated.",
    businessImpact:
      "Reduces raw material carrying costs by 18%, prevents stockout-induced downtime, and guarantees 100% heat-lot compliance for ISO 9001 audits.",
    targetRoles: ["planner", "plant-manager"],
    keyCapabilities: [
      "Raw material heat-lot tracking with attached Mill Test Certificates (MTC) and supplier traceability",
      "Real-time stock valuation and inventory aging breakdown across Khopoli and Rabale warehouses",
      "Dynamic Min-Max safety stock thresholds with automatic low-stock alerts and purchase requisitions",
      "WIP buffer monitoring between fin stamping (K3) and assembly welding bays (K1)",
      "Chemical inventory tracking for hot-dip galvanizing bath (Zinc, Ammonium Chloride flux, Acid tanks)",
    ],
    howToUseSteps: [
      { step: 1, title: "Check Stock Levels", instruction: "View the inventory summary dashboard to monitor total available, reserved, and quarantine inventory." },
      { step: 2, title: "Review Low Stock Alerts", instruction: "Inspect the 'Reorder Required' filter for items below safety stock thresholds (e.g. Zinc SHG 99.995%)." },
      { step: 3, title: "Receive Inward Consignment", instruction: "Click 'Receive Material', scan supplier barcode, enter heat number, and attach lab test results." },
      { step: 4, title: "Issue to Production", instruction: "Allocate specific coil rolls to active Work Orders to preserve downstream traceability." },
    ],
    keyKPIs: [
      { name: "Inventory Turnover Ratio", target: "≥ 12.0x", description: "Annual inventory turns to maximize cash flow efficiency" },
      { name: "Stockout Incidents", target: "0 per quarter", description: "Production halts caused by missing raw materials or consumables" },
      { name: "Stock Accuracy", target: "≥ 99.5%", description: "Match between physical cycle counts and digital inventory records" },
    ],
    proTips: [
      "Use FIFO (First In, First Out) rules for CRCA coils to prevent atmospheric surface corrosion during monsoon months in Maharashtra.",
      "Monitor zinc bath ingot consumption daily to forecast quarterly zinc procurement tenders.",
    ],
    relatedModules: ["suppliers", "traceability", "work-orders", "cost-quality"],
  },
  {
    id: "quality",
    name: "Quality Management & SPC",
    short: "Quality",
    category: "Quality",
    icon: "ShieldCheck",
    tagline: "Digital inspection checklists, Statistical Process Control (SPC) & NCR / CAPA",
    whatIsItFor:
      "Comprehensive quality assurance and control module encompassing incoming raw material inspection, in-process welding inspections, hydrostatic pressure tests (2.0 bar), zinc coating thickness measurements, paint adhesion tests, and automated 8D Non-Conformance Reports (NCR).",
    whyItIsUsed:
      "Transformer radiators must operate leak-free in high-voltage electrical substations for 30+ years filled with hot dielectric oil. A single pinhole leak in the field causes massive environmental damage, power outages, and catastrophic OEM warranty claims. This module is used to enforce zero-defect manufacturing through digital checklists, automated SPC control charts (Cp/Cpk), and structured CAPA investigations.",
    shopFloorScenario:
      "A Quality Engineer conducts dry film thickness (DFT) testing on a freshly painted batch of radiators for ABB. The gauge reads 112 microns against the 140 micron spec. The engineer logs the deviation on their mobile tablet, attaching a photo of the under-coated fin radius. The system automatically halts the batch, generates NCR-2026-039, and notifies the Paint Shop supervisor to adjust spray gun pressure.",
    businessImpact:
      "Boosts First-Pass Yield (FPY) from 91% to 97.2%, slashes customer warranty claims to near zero, and ensures 100% audit readiness for Power Grid Corporation of India (PGCIL) inspections.",
    targetRoles: ["quality", "plant-manager", "supervisor"],
    keyCapabilities: [
      "Digital quality inspection checklists with pass/fail gates and photographic evidence attachments",
      "Automated Statistical Process Control (SPC) X-bar & R charts for critical dimensions and zinc thickness",
      "Full 8D Non-Conformance Reporting (NCR) workflow with containment, root-cause, and CAPA approval gates",
      "Hydrostatic leak testing log recording test pressure (bar), dwell duration (seconds), and inspector ID",
      "Zinc coating thickness compliance tracking (ISO 1461 / ASTM A123 minimum 86 microns)",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Inspection Gate", instruction: "Choose the inspection stage: Inward Steel, Post-Weld Pressure Test, Galvanizing DFT, or Final QC." },
      { step: 2, title: "Record Measurements", instruction: "Enter sample readings (e.g. Weld Penetration: 1.8mm, Zinc Coating: 94µm). Out-of-spec readings turn red instantly." },
      { step: 3, title: "Raise NCR for Defects", instruction: "If defects are detected (e.g. pinhole leak, zinc ash, paint blister), click 'Raise NCR' and select the defect code." },
      { step: 4, title: "Assign CAPA", instruction: "Assign corrective action tasks to the responsible process owner with a mandatory resolution deadline." },
      { step: 5, title: "Approve Batch Release", instruction: "Digitally sign the inspection certificate to release the work order for packaging." },
    ],
    keyKPIs: [
      { name: "First-Pass Yield (FPY)", target: "≥ 96.5%", description: "Percentage of units passing all inspection stages on the first attempt" },
      { name: "Process Capability (Cpk)", target: "≥ 1.33", description: "Statistical index measuring process consistency within tolerance limits" },
      { name: "Open NCR Resolution Time", target: "≤ 48 hrs", description: "Average duration to contain, investigate, and close an internal NCR" },
    ],
    proTips: [
      "Review the Top-5 Defect Pareto chart weekly to prioritize welding jig calibrations.",
      "Require dual-inspector sign-off for all high-voltage nuclear/export grade radiator batches.",
    ],
    relatedModules: ["traceability", "cost-quality", "root-cause", "calibration"],
  },
  {
    id: "traceability",
    name: "End-to-End Genealogy & Traceability",
    short: "Traceability",
    category: "Operations",
    icon: "Workflow",
    tagline: "Forward & backward genealogy from raw steel coil to installed transformer site",
    whatIsItFor:
      "Enterprise product genealogy engine that constructs an immutable digital thread linking raw steel heat number, decoiling machine ID, fin pressing die, welding operator, pressure test log, zinc kettle batch, and customer transformer serial number.",
    whyItIsUsed:
      "When a utility company reports a transformer issue 5 years after installation, the manufacturer must prove exactly which steel coil, welding station, and test parameters were used. Without digital traceability, a single defective coil forces a total recall of thousands of units. This module is used to enable pinpoint forward/backward audits in under 10 seconds.",
    shopFloorScenario:
      "A quality auditor from Siemens requests full genealogy for Radiator Serial #RAD-2026-09412. The QA manager enters the serial into Traceability search. Within 2 seconds, the interactive tree diagram renders the exact JSW Steel coil heat number (#HT-8841), Welder ID (W-04 Ramakant S.), Hydro Test chart (2.2 bar passed at 11:14 AM on 12-Feb), and HDG bath #2 temperature log (452°C).",
    businessImpact:
      "Reduces audit preparation time by 95%, limits potential recall exposure by 90% through laser-precise batch containment, and satisfies stringent Tier-1 OEM audit standards.",
    targetRoles: ["quality", "executive", "plant-manager", "operator"],
    keyCapabilities: [
      "Interactive multi-tier genealogy tree with forward (Coil → Radiators) and backward (Serial → Coil) tracing",
      "QR / Barcode scanner integration for instant shop-floor component lookup",
      "Automated Certificate of Conformity (CoC) and Mill Test Certificate (MTC) package generation",
      "Batch containment tool: identify all radiators produced from a suspect steel heat number in one click",
      "Audit trail log capturing every timestamped process milestone and operator badge ID",
    ],
    howToUseSteps: [
      { step: 1, title: "Enter Search Identifier", instruction: "Type a Radiator Serial Number, Work Order ID, Steel Heat Lot, or Customer PO into the search bar." },
      { step: 2, title: "Explore Genealogy Tree", instruction: "Click through nodes on the visual tree to inspect upstream raw materials and downstream assemblies." },
      { step: 3, title: "View Parameter Logs", instruction: "Click any process node (e.g. Welder 2) to view the actual machine parameters (amperage, gas flow) recorded during production." },
      { step: 4, title: "Export Traceability Dossier", instruction: "Click 'Download Full Dossier' to export the complete customer-ready PDF quality packet." },
    ],
    keyKPIs: [
      { name: "Traceability Coverage", target: "100.0%", description: "Percentage of serialized radiators with complete digital genealogy" },
      { name: "Audit Query Time", target: "≤ 5 sec", description: "Time required to retrieve complete manufacturing history for any unit" },
      { name: "Batch Isolation Precision", target: "100%", description: "Accuracy in containing only affected serials during heat-lot investigations" },
    ],
    proTips: [
      "Scan the QR code on the physical radiator nameplate using any mobile device to pull up the live digital birth certificate.",
      "Use forward tracing immediately when a raw material supplier issues a quality notice on a specific steel heat lot.",
    ],
    relatedModules: ["quality", "work-orders", "audit-trail", "customer-portal"],
  },
  {
    id: "iiot",
    name: "IIoT Machine Monitoring & Edge Gateway",
    short: "IIoT",
    category: "Shop Floor",
    icon: "Cpu",
    tagline: "Live telemetry, OPC-UA / MQTT sensor streaming & threshold alarming",
    whatIsItFor:
      "Industrial Internet of Things (IIoT) telemetry platform connecting shop-floor machines (Fin Folding Presses, Seam Welders, Header Tube Benders, HDG Zinc Kettles, Powder Coating Ovens) via OPC-UA, Modbus TCP, and MQTT edge industrial gateways.",
    whyItIsUsed:
      "Heavy industrial machinery gives clear warning signs (vibration spikes, current draw anomalies, temperature drift) before catastrophic breakdown. Without continuous IIoT streaming, maintenance teams operate in reactive firefighting mode. This module is used to detect equipment degradation early, monitor machine states live, and optimize process setpoints.",
    shopFloorScenario:
      "At 14:15, the edge gateway on HDG Zinc Kettle #2 detects a temperature drop from 450°C to 438°C combined with an electrical current surge on heating element zone 3. The IIoT dashboard triggers an instant Amber Alert on the supervisor's smart display. Maintenance replaces a failing contactor during a scheduled break, preventing a 4-hour kettle freeze-up.",
    businessImpact:
      "Prevents catastrophic machine breakdown, eliminates unrecorded micro-stoppages, and optimizes energy consumption across high-power thermal assets.",
    targetRoles: ["maintenance", "engineer", "plant-manager", "supervisor"],
    keyCapabilities: [
      "Live real-time telemetry streaming (Spindle RPM, Motor Current, Hydraulic Pressure, Bath Temperatures)",
      "High-contrast machine status board (Running [Green], Idle [Yellow], Down [Red], Changeover [Blue])",
      "Configurable threshold alert rules with automated push notifications to on-duty maintenance engineers",
      "Historical time-series charting with zoom, pan, and anomaly spike highlighting",
      "Direct integration with OEE engine to automatically categorize availability loss reasons",
    ],
    howToUseSteps: [
      { step: 1, title: "Monitor Machine Fleet", instruction: "Review the live machine matrix. Green indicates active production; blinking red flags immediate breakdown." },
      { step: 2, title: "Select Machine for Telemetry", instruction: "Click any machine card (e.g. Fin Press FP-01) to open the real-time sensor gauge panel." },
      { step: 3, title: "Inspect Process Parameters", instruction: "Verify critical process setpoints (e.g. Welding Speed: 1.2 m/min, Hydraulic Pressure: 160 bar)." },
      { step: 4, title: "Configure Alert Triggers", instruction: "Set high/low safety thresholds on critical sensors to trigger preventative maintenance warnings." },
    ],
    keyKPIs: [
      { name: "Machine Telemetry Uptime", target: "≥ 99.8%", description: "Edge gateway connectivity and sensor data ingestion availability" },
      { name: "Sensor Anomaly Lead Time", target: "≥ 45 min", description: "Advance warning time before an abnormal reading causes a full machine trip" },
      { name: "Real-time Data Latency", target: "≤ 500 ms", description: "Time from physical sensor reading to screen display" },
    ],
    proTips: [
      "Look for gradual upward drift in hydraulic motor current on fin presses — it indicates dull cutting dies that need resharpening.",
      "Monitor zinc bath temperature stability (±3°C) to maintain consistent coating thickness and prevent excess zinc drag-out.",
    ],
    relatedModules: ["oee", "maintenance", "energy", "line-simulator"],
  },
  {
    id: "oee",
    name: "OEE Analytics & Six Big Losses",
    short: "OEE",
    category: "Shop Floor",
    icon: "Gauge",
    tagline: "Availability, Performance & Quality decomposition across plants, lines & shifts",
    whatIsItFor:
      "Enterprise Overall Equipment Effectiveness (OEE) analytics engine that calculates the standard Availability × Performance × Quality equation in real time, decomposing downtime into the classic TPM 'Six Big Losses'.",
    whyItIsUsed:
      "Many plants believe their lines are running at 80% capacity when the true OEE is below 65% due to hidden micro-stoppages, slow running speeds, and unrecorded rework. This module is used to shine an unsparing light on true machine productivity, pinpoint the biggest loss drivers, and guide continuous improvement (Kaizen) initiatives.",
    shopFloorScenario:
      "A process engineer investigates why Header Welding Bay 2 has an OEE of only 64.2%. By looking at the Six Big Losses waterfall chart, they discover that 'Minor Idling & Stoppages' account for 18% of lost time because operators wait for cranes to lift heavy header pipes. The engineer re-routes an auxiliary hoist, boosting line OEE to 78.5% within a week.",
    businessImpact:
      "Unlocks 15-20% hidden plant capacity without investing in new machinery, directly increasing top-line throughput and gross margins.",
    targetRoles: ["plant-manager", "engineer", "executive", "supervisor"],
    keyCapabilities: [
      "Real-time OEE gauge with granular Availability, Performance, and Quality factor breakdowns",
      "Six Big Losses Pareto decomposition (Breakdowns, Setup/Adjustments, Small Stops, Reduced Speed, Startup Scrap, Production Scrap)",
      "Multi-dimensional filtering by Plant (K1-K4, R1), Line, Shift (A/B/C), and Machine Bay",
      "Historical OEE trend benchmarking against world-class manufacturing targets (WCM standard: 85%)",
      "Interactive loss drill-down identifying the top 3 downtime root causes per machine",
    ],
    howToUseSteps: [
      { step: 1, title: "Filter Analysis Scope", instruction: "Select the plant, line, and date range (This Shift, Today, Last 7 Days, Month) in the top filter bar." },
      { step: 2, title: "Inspect OEE Breakdown", instruction: "Examine the Availability, Performance, and Quality gauges to identify which factor is dragging down efficiency." },
      { step: 3, title: "Analyze Six Big Losses", instruction: "Review the Waterfall chart. Identify whether the primary bottleneck is equipment downtime, speed loss, or defect scrap." },
      { step: 4, title: "Drill into Loss Details", instruction: "Click on any loss category (e.g. 'Setup & Changeovers') to see the breakdown of individual reasons and frequencies." },
      { step: 5, title: "Export Action Plan", instruction: "Export the OEE summary report to share with the engineering team for weekly Kaizen reviews." },
    ],
    keyKPIs: [
      { name: "World-Class OEE", target: "≥ 85.0%", description: "Availability (90%) × Performance (95%) × Quality (99.5%) benchmark" },
      { name: "Availability Factor", target: "≥ 90.0%", description: "Actual operating time divided by planned production time" },
      { name: "Performance Factor", target: "≥ 92.0%", description: "Actual production speed compared to designed ideal cycle speed" },
      { name: "Quality Factor", target: "≥ 98.0%", description: "Good parts produced divided by total parts started" },
    ],
    proTips: [
      "Focus on the single biggest loss category on your Pareto chart — eliminating just the top loss typically yields an immediate 4-6% OEE jump.",
      "Compare Shift A vs. Shift B OEE on the same machine to identify operator best practices and training opportunities.",
    ],
    relatedModules: ["iiot", "maintenance", "quality", "root-cause"],
  },
  {
    id: "maintenance",
    name: "Preventive & Corrective Maintenance (CMMS)",
    short: "Maintenance",
    category: "Support",
    icon: "Wrench",
    tagline: "Digital work orders, PM schedules, MTBF/MTTR metrics & spare parts inventory",
    whatIsItFor:
      "Computerized Maintenance Management System (CMMS) managing scheduled preventive maintenance (PM), breakdown work orders, lubrication routes, vibration checks, MTBF/MTTR reliability metrics, and critical spare parts inventory.",
    whyItIsUsed:
      "Unplanned machine breakdowns during high-priority transformer radiator runs result in costly production standstills and missed customer delivery deadlines. This module is used to transition from reactive firefighting to disciplined preventive and predictive maintenance, ensuring high asset reliability.",
    shopFloorScenario:
      "The Maintenance Lead sees that Seam Welder SW-02 has operated 480 hours since its last electrode dresser overhaul (PM schedule interval: 500 hours). The CMMS automatically creates PM Work Order #PM-2026-114, reserves 2 replacement copper-chromium electrode wheels from spares, and schedules the 30-minute maintenance task for Sunday during the shift changeover.",
    businessImpact:
      "Reduces unplanned downtime by 40%, increases Mean Time Between Failures (MTBF) by 30%, and lowers total maintenance spare parts expenditure.",
    targetRoles: ["maintenance", "plant-manager", "engineer"],
    keyCapabilities: [
      "Automated calendar-based and running-hour-based Preventive Maintenance (PM) work order generation",
      "Emergency breakdown dispatch with technician mobile alerts and response timer tracking",
      "Reliability engineering analytics: Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR)",
      "Spare parts inventory management with min-max reorder points for critical valves, motors, and electrodes",
      "Asset history log capturing complete lifecycle repair records and maintenance cost per machine",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Maintenance Schedule", instruction: "Inspect the PM calendar for upcoming daily, weekly, and monthly maintenance tasks." },
      { step: 2, title: "Triage Breakdown Tickets", instruction: "When a machine trips, review the open breakdown work orders. Assign technicians and set priority." },
      { step: 3, title: "Execute Work Order", instruction: "The technician opens the digital checklist, performs the PM steps, and records spare parts consumed." },
      { step: 4, title: "Verify & Close Ticket", instruction: "Conduct test run, verify sensor readouts, and have the shop supervisor sign off on machine handover." },
    ],
    keyKPIs: [
      { name: "MTBF (Mean Time Between Failures)", target: "≥ 120 hrs", description: "Average operating hours between unexpected equipment breakdowns" },
      { name: "MTTR (Mean Time To Repair)", target: "≤ 45 min", description: "Average duration to diagnose, repair, and restart a down machine" },
      { name: "PM Compliance Rate", target: "≥ 95.0%", description: "Percentage of planned preventive maintenance tasks executed on schedule" },
    ],
    proTips: [
      "Maintain safety stock for high-wear items (welding contact tips, hydraulic seals, burner nozzles) to ensure MTTR stays under 45 minutes.",
      "Always attach photos of worn components to the work order to build an empirical failure library.",
    ],
    relatedModules: ["iiot", "oee", "calibration", "energy"],
  },
  {
    id: "energy",
    name: "Energy Management & Sustainability (ISO 50001)",
    short: "Energy",
    category: "Support",
    icon: "Zap",
    tagline: "Specific energy consumption (kWh/radiator), peak demand & carbon footprint",
    whatIsItFor:
      "Industrial energy monitoring platform tracking electricity (kWh), natural gas/LPG (kg), water (kL), and compressed air across substations, galvanizing burners, welding lines, and powder coating ovens.",
    whyItIsUsed:
      "Energy represents the second-highest variable cost in radiator fabrication, especially in thermal processes like hot-dip galvanizing kettles and curing ovens. Unmanaged peak power draws trigger severe utility penalties from MSEDCL (Maharashtra State Electricity Distribution Co.). This module is used to monitor Specific Energy Consumption (SEC), avoid maximum demand penalties, and drive ESG sustainability goals.",
    shopFloorScenario:
      "The Energy Manager reviews the real-time maximum demand monitor. The plant is currently drawing 940 kVA against a contracted maximum demand limit of 1,000 kVA. The system issues a Peak Demand Warning. The manager automatically staggers the startup of Fin Press 2 and postpones electric annealing furnace preheating until off-peak hours (after 22:00), avoiding a ₹1.5 lakh penalty.",
    businessImpact:
      "Cuts annual power bills by 12-15%, eliminates maximum demand penalty surcharges, and provides verified ESG carbon data for European OEM customer audits.",
    targetRoles: ["engineer", "plant-manager", "executive", "maintenance"],
    keyCapabilities: [
      "Real-time power monitoring with automated Maximum Demand (kVA) breach alerts and load shedding rules",
      "Specific Energy Consumption (SEC) tracking measuring exact kWh consumed per finished radiator unit",
      "Thermal energy efficiency analytics for Hot-Dip Galvanizing (HDG) zinc bath burners and paint curing ovens",
      "Compressed air leak monitoring detecting off-shift compressor baseline power draw anomalies",
      "Carbon footprint and Scope 1 & Scope 2 greenhouse gas emissions calculator for ESG reporting",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Total Consumption", instruction: "Inspect live kWh consumption across plants K1, K2, K3, K4, and R1." },
      { step: 2, title: "Monitor Peak Demand", instruction: "Check the kVA gauge against your contracted maximum demand limit to prevent penalty surcharges." },
      { step: 3, title: "Analyze Specific Energy", instruction: "Track kWh/radiator over time. Rising SEC indicates machine friction, dull tooling, or idling losses." },
      { step: 4, title: "Investigate Off-Shift Baseline", instruction: "Inspect power consumption between 02:00 - 05:00 AM to detect unswitched lighting, heaters, or air leaks." },
    ],
    keyKPIs: [
      { name: "Specific Energy Consumption", target: "≤ 14.5 kWh/unit", description: "Total electrical and thermal energy consumed per completed radiator" },
      { name: "Peak Demand Compliance", target: "100%", description: "Zero contract demand overshoot penalties from utility provider" },
      { name: "Compressed Air Baseline", target: "≤ 8% of full load", description: "Off-shift pneumatic system power draw indicating minimal pipe leaks" },
    ],
    proTips: [
      "Schedule high-power HDG zinc bath skimming and heating cycles during discounted night tariff hours (22:00 to 06:00).",
      "Conduct quarterly ultrasonic compressed air leak audits — fixing 5 small leaks can save over ₹25,000 monthly in power.",
    ],
    relatedModules: ["iiot", "overview", "maintenance", "dashboards"],
  },
  {
    id: "workforce",
    name: "Workforce & Skill Matrix Management",
    short: "Workforce",
    category: "Support",
    icon: "Users",
    tagline: "Skill matrix (Level 1-4), welder qualification, shift rosters & safety compliance",
    whatIsItFor:
      "Shop-floor human capital management system tracking operator skill levels (L1 Trainee to L4 Master), certified welder qualifications (EN ISO 9606 / ASME Section IX), daily shift attendance rosters, and safety incident tracking.",
    whyItIsUsed:
      "Radiator manufacturing requires certified welders and qualified leak test technicians. Assigning an uncertified operator to automatic seam welding leads to high defect rates and OEM audit non-compliance. This module is used to ensure only qualified personnel are assigned to critical stations, manage cross-training, and maintain OSHA safety compliance.",
    shopFloorScenario:
      "A shift supervisor rosters workers for Shift A on Line 1. The supervisor attempts to assign operator Dinesh K. to the TIG Header Welder. The system blocks the assignment with an alert: 'Welder certification expired on 15-Jan (ISO 9606 qualification test overdue)'. The supervisor reassigns Dinesh to fin pressing and slots in certified welder Amit Patil, maintaining code compliance.",
    businessImpact:
      "Prevents defect generation from unqualified operators, ensures 100% compliance during customer quality audits, and increases workforce flexibility through structured cross-training.",
    targetRoles: ["plant-manager", "supervisor"],
    keyCapabilities: [
      "Digital Skill Matrix (L1 Learning, L2 Under Supervision, L3 Autonomous, L4 Master Trainer) per station",
      "Welder qualification and NDT certificate expiry tracking with 30-day renewal reminders",
      "Shift attendance rostering with automated skill-balance validation for Shift A, Shift B, and Shift C",
      "Safety incident and near-miss reporting log with Days Since Last Lost-Time Incident (LTI) counter",
      "Operator performance analytics comparing output and quality yield by operator and shift",
    ],
    howToUseSteps: [
      { step: 1, title: "View Shift Attendance", instruction: "Review the daily check-in board to see available operators by plant and station." },
      { step: 2, title: "Check Station Competency", instruction: "Inspect the Skill Matrix grid to verify that each critical workstation has an L3 or L4 operator assigned." },
      { step: 3, title: "Review Expiring Certifications", instruction: "Filter for welders with certifications expiring in the next 30 days to schedule renewal tests." },
      { step: 4, title: "Log Training Progress", instruction: "Update operator skill levels as workers complete cross-training modules and pass evaluation tests." },
    ],
    keyKPIs: [
      { name: "Skill Matrix Coverage", target: "≥ 88.0%", description: "Percentage of stations with at least 3 qualified backup operators" },
      { name: "Welder Cert Compliance", target: "100.0%", description: "Zero uncertified operators deployed on pressure boundary welding" },
      { name: "Lost-Time Incidents (LTI)", target: "0 per year", description: "Zero workplace safety injuries resulting in lost workdays" },
    ],
    proTips: [
      "Implement a 3x3 skill rule: every critical machine must have at least 3 qualified operators, and every operator must know 3 machines.",
      "Review near-miss safety reports at the start of every shift during the 5-minute safety toolbox talk.",
    ],
    relatedModules: ["operator-terminal", "shift-handover", "quality"],
  },
  {
    id: "documents",
    name: "Document & Drawing Control (DMS)",
    short: "Documents",
    category: "Quality",
    icon: "FileText",
    tagline: "Engineering drawings, SOPs, customer specs & revision control with watermarking",
    whatIsItFor:
      "Controlled Document Management System (DMS) managing engineering CAD drawings, Standard Operating Procedures (SOPs), Control Plans, Quality Inspection Standards, and customer-specific technical specifications with revision watermarking.",
    whyItIsUsed:
      "Manufacturing parts against obsolete drawing revisions is one of the most expensive mistakes in precision engineering. If an operator builds a 2400mm radiator using Revision B instead of Revision C, an entire 50-unit batch must be scrapped. This module is used to ensure only current, approved, and watermarked drawings are displayed at workstations.",
    shopFloorScenario:
      "An operator at the Header Pipe cutting bay scans the Work Order barcode. The connected terminal screen automatically displays the latest approved drawing (DWG-HDR-520-Rev D, approved 10-Feb) with a live dynamic watermark ('CONTROLLED COPY - OPERATOR VIEW'). When the engineering team uploads Revision E, Revision D is automatically obsoleted across all shop-floor screens in real time.",
    businessImpact:
      "Eliminates 100% of scrap caused by obsolete drawings, reduces engineering release cycle time, and satisfies ISO 9001 document control clauses.",
    targetRoles: ["quality", "engineer", "plant-manager", "operator"],
    keyCapabilities: [
      "Revision control with automatic obsoletion of prior versions and strict change approval workflows",
      "Dynamic document watermarking ('CONTROLLED COPY', 'UNCONTROLLED IF PRINTED', 'OBSOLETE')",
      "Instant drawing access from digital Work Orders and Operator Terminals via barcode scanning",
      "Engineering Change Order (ECO / ECN) tracking with implementation sign-off verification",
      "Full audit trail logging who viewed, downloaded, or updated any controlled document",
    ],
    howToUseSteps: [
      { step: 1, title: "Search Document Library", instruction: "Search by Drawing Number, Customer Name, Product Code, or Document Category (SOP, Control Plan)." },
      { step: 2, title: "Verify Revision Status", instruction: "Ensure the document status is 'Active / Approved'. Obsolete documents are flagged with red warnings." },
      { step: 3, title: "View Watermarked Drawing", instruction: "Open the viewer to inspect dimension tolerances, weld symbols, and special customer requirements." },
      { step: 4, title: "Initiate ECN Revision", instruction: "When engineering modifications are required, click 'Create ECN' to submit a new revision draft." },
    ],
    keyKPIs: [
      { name: "Drawing Obsoletion Scrap", target: "0 incidents", description: "Zero scrap caused by building against superseded drawing revisions" },
      { name: "ECN Implementation Lead Time", target: "≤ 5 days", description: "Duration to review, approve, and deploy an Engineering Change Notice" },
      { name: "Document Audit Compliance", target: "100.0%", description: "Full conformity with ISO 9001 document control standards" },
    ],
    proTips: [
      "Never print hard copies on the shop floor — access live drawings directly on the Operator Terminal to guarantee revision accuracy.",
      "Check the 'Customer Special Requirements' section on drawing title blocks for specific paint brand and zinc grade mandates.",
    ],
    relatedModules: ["operator-terminal", "quality", "audit-trail"],
  },
  {
    id: "operator-terminal",
    name: "Operator Terminal (Digital Job Card Execution)",
    short: "Operator Terminal",
    category: "Shop Floor",
    icon: "Monitor",
    tagline: "Rugged shop-floor touch interface for job clocking, cycle times & Andon triggers",
    whatIsItFor:
      "Ruggedized, touch-friendly digital job execution terminal placed beside machine bays and assembly stations for operators to clock on/off work orders, log piece counts, record scrap reasons, and trigger instant Andon help calls.",
    whyItIsUsed:
      "Operators on noisy shop floors need an ultra-simple, high-contrast interface with large touch targets that works with gloved hands. Complex ERP screens cause data entry delays and operator frustration. This terminal is used to empower operators with paperless job cards, clear cycle time pacing, and immediate emergency assistance.",
    shopFloorScenario:
      "An operator on Seam Welder 1 scans their RFID badge. The terminal greets them, displays their assigned Work Order (WO-2026-0842, Siemens 2400mm Fins), and shows the target pace: 45 seconds per fin. As each fin is welded, the counter increments automatically via optical sensor. When a weld wire spool jams, the operator taps the red 'Andon: Maintenance' button, immediately alerting the technician.",
    businessImpact:
      "Provides real-time production feedback, cuts job clocking overhead by 80%, and empowers shop-floor operators with instant supervisor support.",
    targetRoles: ["operator", "supervisor"],
    keyCapabilities: [
      "Large-target high-contrast interface designed for rugged shop-floor industrial tablets and kiosks",
      "Barcode/RFID operator clock-in and work order traveler selection with zero manual typing required",
      "Live piece counter with real-time target pace progress bar and cycle time countdown timer",
      "Instant single-tap scrap logging with visual defect code selectors (Weld Pinhole, Dent, Fold Defect)",
      "Integrated Andon Help Call buttons dispatching immediate alerts to Maintenance, Quality, and Material stores",
    ],
    howToUseSteps: [
      { step: 1, title: "Badge Login", instruction: "Scan your operator RFID badge or select your name to log in to your workstation." },
      { step: 2, title: "Select Assigned Job Card", instruction: "Tap 'Start Job' on your queued work order. The terminal loads drawings, BOM, and target quantities." },
      { step: 3, title: "Track Production Count", instruction: "As parts finish, tap the '+1 Good' button or let automated machine sensors record the count." },
      { step: 4, title: "Log Scrap Immediately", instruction: "If a part is rejected, tap 'Log Reject', select the reason (e.g. burn-through), and place it in the red quarantine bin." },
      { step: 5, title: "Trigger Andon When Stuck", instruction: "If tooling jams or materials run low, tap the yellow/red Andon buttons to call for help." },
    ],
    keyKPIs: [
      { name: "Cycle Time Adherence", target: "≥ 95.0%", description: "Percentage of cycles completed within standard designed cycle time" },
      { name: "Data Logging Timeliness", target: "Real-time", description: "Immediate digital capture of produced pieces and scrap events" },
      { name: "Andon Response Time", target: "≤ 3.0 min", description: "Time from operator button press to support staff arrival at the bay" },
    ],
    proTips: [
      "Always check the 'Special Quality Instructions' popup when starting a new customer work order.",
      "Hit the 'Material Request' Andon button 15 minutes before your current coil runs out to avoid line stoppage.",
    ],
    relatedModules: ["work-orders", "andon", "shift-handover", "traceability"],
  },
  {
    id: "andon",
    name: "Andon Live Board & Escalation Matrix",
    short: "Andon",
    category: "Shop Floor",
    icon: "Tv",
    tagline: "Visual factory alarms, response timers & automatic management escalation",
    whatIsItFor:
      "Visual shop-floor Andon board and automated escalation management system displaying active help calls, equipment breakdowns, material shortages, and quality containment holds across all machine bays.",
    whyItIsUsed:
      "When a line stops because of a broken weld tip or missing hardware, every minute of delay costs thousands in lost production. Without visual Andon boards and automated timer escalation, line stoppages go unnoticed by supervisors. This module is used to slash response times and ensure total transparency.",
    shopFloorScenario:
      "At 10:14, Fin Press 1 hits an Andon: Tooling Jam call. The plant overhead TV board flashes amber, and a timer begins ticking. If not acknowledged within 5 minutes, the system automatically escalates an SMS to the Maintenance Lead. If unresolved at 15 minutes, it escalates to the Plant Manager. The technician acknowledges at 2.4 minutes and resolves the jam in 6 minutes.",
    businessImpact:
      "Reduces shop-floor response time from 18 minutes to under 3 minutes, cutting overall unplanned line downtime by over 30%.",
    targetRoles: ["supervisor", "plant-manager", "maintenance", "quality", "operator"],
    keyCapabilities: [
      "High-visibility TV dashboard mode suitable for 65-inch overhead plant monitor displays",
      "Color-coded urgency states: Red (Breakdown/Quality Stop), Yellow (Material/Tooling), Green (All Clear)",
      "Real-time stopwatch response and resolution timers with color transitions as thresholds are exceeded",
      "Multi-tier automated escalation matrix (Level 1: Supervisor → Level 2: Dept Head → Level 3: Plant Manager)",
      "Historical Andon analytics identifying chronic problem workstations and recurring call types",
    ],
    howToUseSteps: [
      { step: 1, title: "Monitor Overhead Board", instruction: "Keep the Andon board open on shop-floor monitors or supervisor tablets." },
      { step: 2, title: "Acknowledge Help Call", instruction: "When a call appears, the responding technician taps 'Acknowledge' to stop the escalation timer." },
      { step: 3, title: "Contain & Resolve Issue", instruction: "Fix the tooling, replace the material, or contain the quality deviation on the shop floor." },
      { step: 4, title: "Log Root Cause & Close", instruction: "Select the root cause category and tap 'Resolve & Clear' to return the station to green status." },
    ],
    keyKPIs: [
      { name: "Mean Time to Acknowledge (MTTA)", target: "≤ 3.0 min", description: "Average time for support staff to acknowledge an Andon call" },
      { name: "Mean Time to Contain (MTTC)", target: "≤ 12.0 min", description: "Average time to clear the obstacle and restart production" },
      { name: "Escalation Rate", target: "≤ 5.0%", description: "Percentage of calls requiring Level 2/3 management escalation" },
    ],
    proTips: [
      "Display the Andon board on large TV screens in the plant cafeteria and supervisor offices for maximum visibility.",
      "Review the weekly Andon Pareto chart to identify which machine bays account for 80% of help calls.",
    ],
    relatedModules: ["operator-terminal", "maintenance", "shift-handover", "overview"],
  },
  {
    id: "shift-handover",
    name: "Digital Shift Handover & Logbook",
    short: "Shift Handover",
    category: "Shop Floor",
    icon: "BookOpen",
    tagline: "Structured Shift A/B/C handover notes, open issues & safety sign-offs",
    whatIsItFor:
      "Structured digital shift logbook enabling seamless operational handovers between outgoing and incoming shift supervisors, capturing production achievements, ongoing machine issues, safety notices, and pending customer orders.",
    whyItIsUsed:
      "Information lost between shift changes (Shift A → Shift B → Shift C) is a primary cause of recurring defects, duplicate maintenance work, and dropped customer commitments. Verbal or handwritten paper diaries are illegible and unsearchable. This module is used to standardize handover checklists with mandatory digital dual sign-offs.",
    shopFloorScenario:
      "At 14:50 (end of Shift A), Supervisor Rajesh completes the digital handover log: 340 radiators produced (102% of target), HDG Kettle 2 flux concentration adjusted to 4.2%, and Work Order #842 requires priority leak testing in Shift B. Incoming Supervisor Sanjay logs in at 15:00, reviews the notes, confirms physical machine states, and signs off digitally.",
    businessImpact:
      "Eliminates shift changeover information loss, reduces shift startup lag by 20 minutes, and creates a legally compliant historical operations record.",
    targetRoles: ["supervisor", "plant-manager", "operator"],
    keyCapabilities: [
      "Structured handover templates covering Output vs. Target, Machine Downtime, Safety, and WIP status",
      "Automatic data pre-fill pulling exact shift production totals, scrap counts, and active alerts from MES",
      "Dual digital signature workflow (Outgoing Supervisor Sign-off + Incoming Supervisor Acceptance)",
      "Carry-over task tracking ensuring unresolved issues stay flagged until physically cleared",
      "Full searchable shift archive with date, shift, plant, and supervisor keyword filtering",
    ],
    howToUseSteps: [
      { step: 1, title: "Open Shift Handover Form", instruction: "At T-15 minutes before shift end, the outgoing supervisor opens the current shift log." },
      { step: 2, title: "Review Auto-Populated Metrics", instruction: "Verify total output, scrap rate, and machine downtime automatically imported by the system." },
      { step: 3, title: "Add Qualitative Notes", instruction: "Document specific machine behaviors, tool wear observations, or special customer batch instructions." },
      { step: 4, title: "Outgoing Sign-Off", instruction: "Digitally sign the outgoing record to freeze the shift operational summary." },
      { step: 5, title: "Incoming Joint Verification", instruction: "The incoming supervisor reviews notes on the shop-floor walk and signs off to accept the line." },
    ],
    keyKPIs: [
      { name: "Handover Completion Rate", target: "100.0%", description: "Every completed shift signed off before incoming shift start" },
      { name: "Shift Startup Lag", target: "≤ 8 min", description: "Time between shift siren and first productive part produced" },
      { name: "Carryover Issue Closure", target: "≤ 24 hrs", description: "Resolution speed for operational roadblocks passed between shifts" },
    ],
    proTips: [
      "Conduct the 10-minute shift handover walk directly on the shop floor while reviewing the log on a tablet.",
      "Pay special attention to hot-dip galvanizing chemical tank adjustments logged by the prior shift.",
    ],
    relatedModules: ["overview", "andon", "work-orders", "workforce"],
  },
  {
    id: "line-simulator",
    name: "Line Simulator & Bottleneck Analysis",
    short: "Line Simulator",
    category: "Shop Floor",
    icon: "GitBranch",
    tagline: "Real-time production flow simulation, buffer queues & Theory of Constraints (TOC)",
    whatIsItFor:
      "Interactive digital twin production flow simulator that models line balancing, buffer queue dynamics, workstation takt times, and Theory of Constraints (TOC) bottlenecks across the entire radiator manufacturing value stream.",
    whyItIsUsed:
      "Adding faster machines to non-bottleneck stations wastes capital without increasing plant output. Plant managers need to know exactly which process step is the true constraint (e.g. is it Seam Welding, Hydro Testing, or Galvanizing Kettle dwell?). This module is used to visualize flow bottlenecks, simulate speed changes, and optimize buffer sizes.",
    shopFloorScenario:
      "An industrial engineer runs a what-if simulation to evaluate adding a second fin folding press. The line simulator demonstrates that because the downstream Seam Welder cycle time is 52 seconds and the HDG Kettle batch cycle is 45 minutes, adding another press will only build up WIP inventory at Bay 2 without increasing final radiator shipments. The engineer instead upgrades the welding jig.",
    businessImpact:
      "Prevents misallocated capital expenditures, identifies the true system constraint, and shortens total manufacturing lead time by up to 25%.",
    targetRoles: ["engineer", "plant-manager", "supervisor"],
    keyCapabilities: [
      "Visual production flow animation showing piece flow, WIP buffer accumulation, and station states",
      "Theory of Constraints (TOC) bottleneck highlighter with automatic station utilization ranking",
      "Interactive takt time slider allowing what-if simulation of increased sales order demand",
      "Buffer sizing optimizer recommending minimum and maximum buffer stock between fabrication bays",
      "Lead time breakdown comparing value-add processing time vs. non-value-add queue waiting time",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Production Line", instruction: "Choose the line configuration (e.g. K1 Line 1 Standard Radiators vs. R1 Heavy Transformer Tanks)." },
      { step: 2, title: "Observe Live Flow", instruction: "Watch the animated material flow. Red flashing stations indicate starved or blocked operations." },
      { step: 3, title: "Analyze Station Takt Times", instruction: "Inspect the cycle time bar chart. The station with the highest cycle time is your current bottleneck." },
      { step: 4, title: "Run What-If Simulation", instruction: "Adjust station speeds, downtime probabilities, or buffer capacities to evaluate productivity impacts." },
    ],
    keyKPIs: [
      { name: "Line Balance Efficiency", target: "≥ 85.0%", description: "Uniformity of workload distribution across all line workstations" },
      { name: "Value-Added Ratio (VAR)", target: "≥ 40.0%", description: "Active processing time divided by total door-to-door manufacturing lead time" },
      { name: "Buffer Starvation Events", target: "0 per shift", description: "Downstream machine stoppages caused by empty upstream buffer queues" },
    ],
    proTips: [
      "Protect your constraint station (usually the HDG Galvanizing Kettle) with a dedicated upstream buffer to ensure it never runs out of work.",
      "Never optimize a non-bottleneck station if it results in excess WIP pileup before a slower downstream process.",
    ],
    relatedModules: ["oee", "planning", "wip-aging", "iiot"],
  },
  {
    id: "suppliers",
    name: "Supplier Quality & Vendor Scorecards (SRM)",
    short: "Suppliers",
    category: "Support",
    icon: "Truck",
    tagline: "Vendor performance ratings, OTIF tracking, rejection rates & supplier audits",
    whatIsItFor:
      "Supplier Relationship Management (SRM) and vendor quality scorecard system tracking supplier On-Time In-Full (OTIF) delivery, incoming raw material rejection rates (PPM), lab test compliance, and supplier audit ratings.",
    whyItIsUsed:
      "Defective raw material steel coils or contaminated zinc ingots create catastrophic quality failures on the shop floor that no internal process can fix. This module is used to evaluate vendor reliability, enforce quality agreements, hold suppliers accountable for defective heat lots, and guide annual procurement allocations.",
    shopFloorScenario:
      "The Procurement Head reviews the quarterly vendor scorecard for steel suppliers. JSW Steel has an OTIF rating of 96.4% and an incoming rejection rate of 120 PPM, whereas a secondary supplier has dropped to 82% OTIF and 1,450 PPM due to edge camber defects. The head reallocates 70% of next quarter's coil contracts to JSW Steel and issues an official Supplier Corrective Action Request (SCAR).",
    businessImpact:
      "Reduces incoming raw material defects by 45%, improves supplier on-time deliveries, and saves significant costs through vendor chargebacks for defective materials.",
    targetRoles: ["quality", "executive", "planner"],
    keyCapabilities: [
      "Automated Supplier Scorecards evaluating Delivery (OTIF), Quality (Rejection PPM), and Responsiveness",
      "Supplier Corrective Action Request (SCAR) workflow tracking vendor 8D root-cause responses",
      "Inward Goods Inspection (IGR) integration linking lab test certificates to vendor profiles",
      "Approved Vendor List (AVL) management with automatic status downgrade for non-performing suppliers",
      "Vendor defect chargeback calculator recovering scrap and downtime costs caused by bad supplier stock",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Vendor Profile", instruction: "Search the supplier database (e.g. JSW Steel, Tata Steel, Hindustan Zinc, Asian Paints)." },
      { step: 2, title: "Review Performance Ratings", instruction: "Inspect the composite scorecard: Delivery OTIF, Quality Rejection Rate, and Pricing Index." },
      { step: 3, title: "Issue Quality SCAR", instruction: "When incoming coils fail thickness or chemical tests, generate a formal SCAR with attached test logs." },
      { step: 4, title: "Track Vendor Containment", instruction: "Monitor supplier 8D response timelines and verify corrective actions during the next shipment audit." },
    ],
    keyKPIs: [
      { name: "Supplier On-Time In-Full (OTIF)", target: "≥ 95.0%", description: "Percentage of vendor deliveries meeting agreed delivery date and quantity" },
      { name: "Incoming Rejection Rate", target: "≤ 250 PPM", description: "Defective raw material parts per million at inward goods inspection" },
      { name: "SCAR Closure Lead Time", target: "≤ 14 days", description: "Average duration for vendor to submit verified permanent corrective action" },
    ],
    proTips: [
      "Cross-check supplier Mill Test Certificates with your internal spectrometer test results to catch sub-grade steel before decoiling.",
      "Use vendor scorecard rankings during annual price negotiations to reward top-tier quality suppliers.",
    ],
    relatedModules: ["inventory", "quality", "cost-quality", "audit-trail"],
  },
  {
    id: "audit-trail",
    name: "Audit Trail & Compliance Logbook (21 CFR Part 11)",
    short: "Audit Trail",
    category: "Intelligence",
    icon: "History",
    tagline: "Immutable change logs, security tracking, role changes & regulatory compliance",
    whatIsItFor:
      "Enterprise audit trail and security compliance logbook providing an immutable, tamper-evident chronological record of all system events, configuration changes, user role modifications, quality overrides, and batch approvals.",
    whyItIsUsed:
      "Regulatory bodies, ISO 9001 auditors, and global Tier-1 OEM quality inspectors require proof that system records, test results, and inspection sign-offs cannot be secretly altered or deleted. This module is used to provide total accountability and prevent unauthorized process overrides.",
    shopFloorScenario:
      "During an annual ISO 9001 surveillance audit, the lead auditor asks for proof that an out-of-spec pressure test reading on WO-2026-0711 was not improperly overridden. The QA Lead opens the Audit Trail, filters for the Work Order ID, and shows the timestamped record: the initial 1.8 bar test failed at 09:12, an NCR was raised, rework was logged, and a re-test passed at 2.1 bar at 10:45.",
    businessImpact:
      "Guarantees 100% compliance during ISO 9001 and OEM audits, prevents data tampering, and maintains complete internal governance.",
    targetRoles: ["executive", "quality"],
    keyCapabilities: [
      "Immutable, tamper-evident log capturing Who, What, When, and Where for every system transaction",
      "Searchable filtering by User, Event Category (Quality, System, Security, Order), Plant, and Date Range",
      "Visual Before / After diff viewer displaying the exact field changes made during any record update",
      "Security event tracking monitoring failed login attempts, permission escalations, and data exports",
      "One-click audit report generation for ISO 9001, IATF 16949, and customer quality auditors",
    ],
    howToUseSteps: [
      { step: 1, title: "Define Audit Scope", instruction: "Select the date range, plant site, and event category in the top filter bar." },
      { step: 2, title: "Search Specific Entity", instruction: "Type a Work Order ID, User Name, or Record ID to inspect all associated actions." },
      { step: 3, title: "Examine Change Diffs", instruction: "Click any log row to open the detailed Before vs. After comparison panel." },
      { step: 4, title: "Export Verification Log", instruction: "Export the encrypted audit packet for external auditors or compliance reviews." },
    ],
    keyKPIs: [
      { name: "Audit Log Integrity", target: "100.0%", description: "Zero unlogged transactions or altered historical records" },
      { name: "Security Event Triage Time", target: "≤ 15 min", description: "Time to investigate and contain suspicious access or permission anomalies" },
      { name: "Regulatory Compliance", target: "100%", description: "Full conformity with ISO 9001 Clause 7.5 (Documented Information)" },
    ],
    proTips: [
      "Review the 'Permission Overrides' filter weekly to verify that emergency supervisor bypasses were properly authorized.",
      "Archive audit logs quarterly to cold storage while maintaining instant indexed search capability.",
    ],
    relatedModules: ["quality", "traceability", "documents"],
  },
  {
    id: "customer-portal",
    name: "Customer Portal & OEM Live Tracking",
    short: "Customer Portal",
    category: "Support",
    icon: "Globe",
    tagline: "OEM client order tracking, inspection certificates & dispatch milestones",
    whatIsItFor:
      "External-facing customer collaboration portal allowing OEM clients (Siemens Energy, ABB, Toshiba, Schneider Electric, BHEL) to securely track their order production progress, download inspection test certificates, and view dispatch milestones.",
    whyItIsUsed:
      "OEM procurement managers constantly call plant sales teams asking 'Where is my order? Is it in galvanizing yet? Can you email the test certificate?'. This creates immense phone/email overhead and slows down operations. This portal is used to provide self-service real-time visibility, building trust and cutting customer inquiry calls by 90%.",
    shopFloorScenario:
      "A procurement manager at Siemens Energy logs into the portal from Munich. They instantly see that their order of 180 units of 2800mm radiators is at 85% completion (in final painting), with 120 units already packed and quality-approved. They download the hydrostatic test certificates and packing lists directly with zero emails sent to the plant.",
    businessImpact:
      "Cuts customer status inquiry calls by 90%, shortens payment collection cycles by providing instant digital test reports, and significantly strengthens OEM client retention.",
    targetRoles: ["executive", "planner"],
    keyCapabilities: [
      "Secure client-authenticated dashboard with customer-specific order segregation (Siemens, ABB, Toshiba)",
      "Live order progress tracker with visual stage-gate milestones (Raw Material → Welding → HDG → Painting → Dispatch)",
      "Instant self-service download of Certificate of Conformity (CoC) and Factory Acceptance Test (FAT) packets",
      "Interactive shipping container and transport vehicle tracking with estimated delivery dates",
      "Direct client feedback and inspection waiver request submission portal",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Customer Account", instruction: "View the customer roster or toggle client view to verify exact data visibility." },
      { step: 2, title: "Monitor Open Orders", instruction: "Track progress percentages across all active purchase orders and scheduled dispatch batches." },
      { step: 3, title: "Publish Quality Certificates", instruction: "Attach approved inspection test reports (FAT/MTC) so clients can download them immediately." },
      { step: 4, title: "Update Dispatch Milestones", instruction: "Enter container tracking numbers and truck details when shipments leave the factory gate." },
    ],
    keyKPIs: [
      { name: "Customer Portal Adoption", target: "≥ 85.0%", description: "Percentage of active OEM clients using digital self-service tracking" },
      { name: "Status Inquiry Call Reduction", target: "≥ 80.0%", description: "Reduction in manual customer support emails and phone calls" },
      { name: "Test Certificate Lead Time", target: "Instant (< 1 min)", description: "Immediate availability of quality certificates upon batch completion" },
    ],
    proTips: [
      "Upload high-resolution photos of final painted radiator bundles to the portal to eliminate pre-shipment disputes.",
      "Set automated SMS/Email notifications to notify client project managers when their order reaches final packaging.",
    ],
    relatedModules: ["dispatch", "work-orders", "traceability", "overview"],
  },
  {
    id: "dispatch",
    name: "Dispatch, Packaging & Logistics",
    short: "Dispatch",
    category: "Support",
    icon: "PackageCheck",
    tagline: "Packing lists, container loading, export crating & transport gate-pass management",
    whatIsItFor:
      "Final outbound logistics module managing packaging verification, wooden crating compliance, container stuffing plans, transport vehicle gate passes, and delivery proof tracking for domestic and international shipments.",
    whyItIsUsed:
      "Finished transformer radiators are heavy, delicate precision assets. Transport damage from improper crating or loading wrong radiator serials onto a truck causes severe project delays at transformer assembly sites. This module is used to enforce barcode-verified loading, generate compliant transport documents, and ensure zero shipping discrepancies.",
    shopFloorScenario:
      "The Logistics Officer at Plant K1 prepares an export shipment for a power project in Dubai. Using a barcode scanner, they scan all 48 radiator bundles into Container #MSKU-99412. The system confirms all 48 serials match Siemens Purchase Order #PO-8812, prints the fumigated wooden crating certificate (ISPM 15), and generates the transport gate pass.",
    businessImpact:
      "Eliminates 100% of wrong-item shipping errors, prevents transit damage claims, and accelerates customer invoice clearance.",
    targetRoles: ["planner", "plant-manager", "executive"],
    keyCapabilities: [
      "Barcode/QR scanning validation preventing wrong serial numbers from being loaded onto transport trucks",
      "Container stuffing optimizer visualizing crate layout and weight distribution across truck axles",
      "Automated packing list, e-Way Bill, and Gate Pass generation with transport vehicle details",
      "Export wooden packaging compliance tracking (ISPM 15 fumigation certificates)",
      "Proof of Delivery (POD) upload capturing signed client receiving slips and transport condition photos",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Dispatch Schedule", instruction: "Review today's outbound shipping queue and customer delivery deadlines." },
      { step: 2, title: "Scan Serial Numbers", instruction: "Scan each radiator bundle as it is loaded into the truck or export container." },
      { step: 3, title: "Verify Crating Compliance", instruction: "Confirm protective corner padding, rust-preventative VCI wrap, and fumigation stamps." },
      { step: 4, title: "Generate Gate Pass & E-Way Bill", instruction: "Click 'Generate Dispatch Packet' to print the official gate pass, packing slip, and invoice." },
      { step: 5, title: "Record Truck Departure", instruction: "Log vehicle number, driver details, and departure timestamp as the truck exits the factory gate." },
    ],
    keyKPIs: [
      { name: "On-Time In-Full Dispatch (OTIF)", target: "≥ 94.0%", description: "Shipments dispatched on schedule with 100% correct items" },
      { name: "Loading Discrepancy Rate", target: "0 errors", description: "Zero instances of wrong serial numbers or incomplete crates loaded" },
      { name: "Gate Turnaround Time", target: "≤ 45 min", description: "Average duration for transport trucks from gate entry to outbound clearance" },
    ],
    proTips: [
      "Always inspect moisture desiccant bags inside export wooden crates before bolting the top lid.",
      "Take time-stamped photos of the loaded container before sealing to document proper transport strapping.",
    ],
    relatedModules: ["customer-portal", "work-orders", "inventory", "overview"],
  },
  {
    id: "calibration",
    name: "Equipment & Gauge Calibration (ISO 17025)",
    short: "Calibration",
    category: "Quality",
    icon: "CalendarCheck",
    tagline: "Gauge tracking, calibration certificates, measurement uncertainty & overdue locks",
    whatIsItFor:
      "Gauge and instrument calibration tracking system managing micrometers, vernier calipers, ultrasonic thickness gauges, hydrostatic pressure transmitters, spectrometer sensors, and temperature probes with automated calibration lockout.",
    whyItIsUsed:
      "Using an uncalibrated pressure transmitter or coating thickness gauge leads to invalid quality testing results and immediate major non-conformances during NABL / ISO audits. This module is used to ensure all measuring instruments are certified, maintain National Physical Laboratory (NPL) traceability, and automatically block out-of-calibration tools.",
    shopFloorScenario:
      "A Quality Inspector picks up Ultrasonic Thickness Gauge #UTG-04 to measure paint DFT. When scanning the tool barcode, the MES terminal alerts: 'Instrument Overdue for Calibration since yesterday'. The system locks the inspection screen for that gauge ID, prompting the inspector to use certified Gauge #UTG-02 while UTG-04 is sent to the NABL-accredited calibration lab.",
    businessImpact:
      "Guarantees 100% test measurement integrity, prevents false quality acceptances, and eliminates audit non-conformances.",
    targetRoles: ["quality", "maintenance"],
    keyCapabilities: [
      "Centralized gauge inventory with Master Calibration schedules and NIST/NPL traceability chains",
      "Automated tool lockout preventing shop-floor quality log sign-offs using overdue instruments",
      "Digital Calibration Certificate repository with measurement uncertainty and tolerance deviation records",
      "Measurement System Analysis (MSA) Gauge R&R (Repeatability & Reproducibility) calculator",
      "30-day and 7-day advance calibration due-date alerts sent to the Quality Laboratory Lead",
    ],
    howToUseSteps: [
      { step: 1, title: "View Calibration Calendar", instruction: "Inspect the calibration dashboard to review upcoming, active, and overdue instruments." },
      { step: 2, title: "Locate Physical Gauge", instruction: "Use tool serial number or QR tag to identify the physical instrument location on the shop floor." },
      { step: 3, title: "Perform Calibration / Lab Test", instruction: "Conduct internal master calibration or send to NABL-accredited third-party calibration agency." },
      { step: 4, title: "Upload Certificate & Update Due Date", instruction: "Upload the new calibration certificate, enter measured deviations, and set the next due date." },
      { step: 5, title: "Unlock Tool for Production", instruction: "The system automatically reactivates the tool for shop-floor inspection use." },
    ],
    keyKPIs: [
      { name: "Calibration Compliance Rate", target: "100.0%", description: "Zero production measurements performed using overdue or uncertified gauges" },
      { name: "Gauge R&R Variance", target: "≤ 10.0%", description: "Measurement system repeatability and reproducibility index" },
      { name: "Overdue Instrument Count", target: "0 instruments", description: "Zero active shop-floor instruments past their calibration due date" },
    ],
    proTips: [
      "Perform daily 1-point master block verification for ultrasonic DFT gauges before starting shift inspections.",
      "Store precision verniers and dial bore gauges in temperature-controlled calibration cabinets.",
    ],
    relatedModules: ["quality", "maintenance", "audit-trail"],
  },
  {
    id: "cost-quality",
    name: "Cost of Quality (CoQ / PAF Model)",
    short: "Cost of Q",
    category: "Quality",
    icon: "CircleDollarSign",
    tagline: "Prevention, Appraisal, Internal Failure & External Failure financial analytics",
    whatIsItFor:
      "Financial quality analytics platform decomposing plant quality expenditures using the classical PAF model: Prevention Costs (Training, PM), Appraisal Costs (Lab testing, inspections), Internal Failure Costs (Scrap, rework, downtime), and External Failure Costs (Warranty claims, field service).",
    whyItIsUsed:
      "Quality issues are often treated as technical problems rather than financial drains. Plant leadership needs to see the exact rupee cost of scrapped fins, reworked welds, and customer warranty claims. This module is used to quantify the financial cost of poor quality (CoPQ) and justify proactive investments in preventative quality.",
    shopFloorScenario:
      "The CFO and Plant Head review the quarterly CoQ report. Internal failure costs reached ₹14.8 lakhs due to seam welding pinhole rework. By investing ₹2.2 lakhs in preventative automatic wire-feed calibration and operator retraining (Prevention Costs), internal rework drops by 70%, generating a net financial saving of ₹8.1 lakhs in the next quarter.",
    businessImpact:
      "Reduces Cost of Poor Quality (CoPQ) by 25-30%, direct bottom-line margin expansion, and clear ROI justification for quality automation projects.",
    targetRoles: ["executive", "quality", "plant-manager"],
    keyCapabilities: [
      "PAF (Prevention, Appraisal, Internal Failure, External Failure) cost categorization matrix",
      "Real-time Cost of Poor Quality (CoPQ) calculator linked to live scrap and rework logs",
      "Defect financial impact ranking identifying the costliest scrap root causes (e.g. Zinc kettle over-coating)",
      "CoQ as a Percentage of Revenue metric tracking against world-class manufacturing targets (< 2.5%)",
      "Interactive ROI simulation model demonstrating payback from preventative quality investments",
    ],
    howToUseSteps: [
      { step: 1, title: "Review CoQ Breakdown", instruction: "Inspect the PAF distribution chart to analyze current spending ratios across Prevention, Appraisal, and Failure." },
      { step: 2, title: "Identify Top CoPQ Drivers", instruction: "Review the Failure Cost Pareto chart to pinpoint which defect codes generate the highest monetary losses." },
      { step: 3, title: "Simulate Prevention Impact", instruction: "Model the financial return of adding an automated sensor or specialized training program." },
      { step: 4, title: "Export Board Presentation", instruction: "Generate the executive CoQ financial slide deck for monthly management committee reviews." },
    ],
    keyKPIs: [
      { name: "CoQ as % of Revenue", target: "≤ 2.2%", description: "Total Cost of Quality divided by gross plant manufacturing revenue" },
      { name: "Prevention-to-Failure Ratio", target: "≥ 1.5x", description: "Proactive prevention spending compared to reactive failure losses" },
      { name: "Scrap Financial Loss", target: "≤ ₹1.2L / month", description: "Direct monetary value of scrapped steel coils, zinc, and paint" },
    ],
    proTips: [
      "Every ₹1 spent on Prevention typically saves ₹4 in Internal Failures and ₹10 in External Customer Claims.",
      "Include secondary costs like extra galvanizing acid pickling and forklift transport in rework cost calculations.",
    ],
    relatedModules: ["quality", "root-cause", "overview", "suppliers"],
  },
  {
    id: "root-cause",
    name: "Root Cause Analysis (Fishbone & 5-Why)",
    short: "Root Cause",
    category: "Quality",
    icon: "GitFork",
    tagline: "Ishikawa 6M diagrams, 5-Why drilldowns & 8D CAPA containment investigations",
    whatIsItFor:
      "Structured root-cause investigation module providing interactive Ishikawa (Fishbone 6M: Machine, Man, Method, Material, Measurement, Milieu) diagrams, 5-Why recursive analysis tools, and 8D problem-solving workflows.",
    whyItIsUsed:
      "When a recurring defect occurs (such as header flange weld cracking), operators often implement quick surface-level patches (e.g. adding more weld metal) rather than addressing the true root cause (e.g. incorrect edge chamfer angle). This module is used to force disciplined engineering investigations that eliminate recurring defects permanently.",
    shopFloorScenario:
      "A cross-functional team investigates a recurring leak at Radiator Header Joint #4. Using the 5-Why tool: Why 1: Joint leaked during hydro test (weld pinhole). Why 2: Porosity in weld bead. Why 3: Shielding gas flow was unstable. Why 4: Argon gas regulator diaphragm was worn out. Why 5 (Root Cause): Preventive maintenance on gas regulators was not included in the CMMS schedule. The team updates the PM schedule, solving the issue permanently.",
    businessImpact:
      "Eliminates 90% of recurring chronic defects, accelerates 8D customer investigation submissions, and builds an organizational problem-solving knowledge base.",
    targetRoles: ["quality", "engineer", "supervisor"],
    keyCapabilities: [
      "Interactive Ishikawa (Fishbone) diagram builder categorized by the classic 6M manufacturing pillars",
      "Guided 5-Why investigation wizard with automatic root-cause hypothesis validation gates",
      "Full 8D problem-solving structure (D1 Team → D2 Problem → D3 Containment → D4 Root Cause → D5 CAPA → D6 Validate → D7 Prevent Recurrence → D8 Congratulate)",
      "Action item assignment with milestone owners, target completion dates, and effectiveness verification",
      "Historical RCA repository allowing engineers to search past solutions for similar failure modes",
    ],
    howToUseSteps: [
      { step: 1, title: "Create RCA Case", instruction: "Link the RCA investigation to an open NCR, Customer Complaint, or Machine Breakdown." },
      { step: 2, title: "Populate Fishbone 6M", instruction: "Brainstorm potential contributing causes across Machine, Man, Method, Material, Measurement, and Milieu." },
      { step: 3, title: "Conduct 5-Why Drilldown", instruction: "For the top probable causes, drill down through 5 sequential 'Why' questions to uncover the root cause." },
      { step: 4, title: "Define Corrective Actions", instruction: "Formulate permanent corrective actions that physically or procedurally prevent recurrence." },
      { step: 5, title: "Verify Effectiveness", instruction: "Schedule a mandatory 30-day follow-up audit to verify zero recurrence before closing the RCA." },
    ],
    keyKPIs: [
      { name: "Defect Recurrence Rate", target: "≤ 2.0%", description: "Percentage of investigated failure modes that reoccur within 12 months" },
      { name: "RCA Investigation Cycle Time", target: "≤ 5 days", description: "Duration from defect occurrence to approved root-cause determination" },
      { name: "8D Closure Rate", target: "≥ 95.0%", description: "Percentage of 8D customer reports completed within SLA deadlines" },
    ],
    proTips: [
      "Involve shop-floor machine operators in Fishbone brainstorming — they usually know subtle machine quirks that engineers miss.",
      "Never accept 'Operator Error' as a root cause — ask why the process allowed the error to occur without poka-yoke error-proofing.",
    ],
    relatedModules: ["quality", "cost-quality", "oee", "maintenance"],
  },
  {
    id: "forecast",
    name: "Demand Forecasting & Capacity Planning",
    short: "Forecast",
    category: "Intelligence",
    icon: "TrendingUp",
    tagline: "Predictive OEM demand, seasonal trends, raw material budgeting & capacity planning",
    whatIsItFor:
      "Predictive demand forecasting and long-range capacity planning module analyzing historical radiator sales, OEM transformer build projections, seasonal grid expansion cycles, and raw steel/zinc procurement budgets.",
    whyItIsUsed:
      "Heavy electrical manufacturing operates on long supply chain lead times (CRCA steel coils require 6-8 weeks lead time from steel mills). Relying on guesswork leads to severe material shortages during peak grid commissioning quarters. This module is used to project accurate rolling demand forecasts and plan plant capacity 6-12 months ahead.",
    shopFloorScenario:
      "The Head of Planning reviews the 6-month predictive forecast. Projected demand for 2800mm large-fin radiators increases by 45% in Q3 due to major PowerGrid substation projects. The forecast model calculates that Plant K1 fin welding capacity will bottleneck by August. Management approves a second welding shift and locks in steel coil contracts with JSW Steel 2 months early at favorable pricing.",
    businessImpact:
      "Optimizes raw material purchasing leverage, prevents capacity bottlenecks before they occur, and improves multi-quarter revenue predictability.",
    targetRoles: ["planner", "executive", "plant-manager"],
    keyCapabilities: [
      "Predictive demand modeling combining historical trends, customer forecast feeds, and market seasonalities",
      "Rough-Cut Capacity Planning (RCCP) simulating long-term machine hours and labor requirements",
      "Raw material budgeting estimating future metric tonnage of CRCA steel coil, zinc, and header pipes",
      "Scenario planning (Conservative, Baseline, Aggressive Growth) with financial revenue projections",
      "Direct integration with Production Planning (APS) to feed rolling master production schedules (MPS)",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Demand Forecast", instruction: "Inspect the rolling 12-month demand trend by customer segment (Domestic OEM, Export, Replacement)." },
      { step: 2, title: "Compare with Plant Capacity", instruction: "Examine the Rough-Cut Capacity graph to identify future quarterly bottleneck months." },
      { step: 3, title: "Run What-If Scenarios", instruction: "Adjust growth percentages (+10%, +25%) to simulate raw material procurement budgets and shift requirements." },
      { step: 4, title: "Publish Procurement Budget", instruction: "Export raw material requirements to the Procurement team to initiate long-term mill contracts." },
    ],
    keyKPIs: [
      { name: "Forecast Accuracy (MAPE)", target: "≥ 88.0%", description: "Mean Absolute Percentage Error between forecasted and actual demand" },
      { name: "Capacity Utilization Target", target: "80% - 85%", description: "Optimal long-term asset utilization balancing flexibility and efficiency" },
      { name: "Material Budget Variance", target: "≤ ±5.0%", description: "Accuracy between forecasted and actual raw material expenditure" },
    ],
    proTips: [
      "Factor in the monsoon season dip in regional transformer installation when planning Q2/Q3 production smoothing.",
      "Collaborate directly with key OEM clients (Siemens, ABB) to import their quarterly transformer production schedules.",
    ],
    relatedModules: ["planning", "inventory", "overview", "dashboards"],
  },
  {
    id: "wip-aging",
    name: "WIP Aging & Bottleneck Tracking",
    short: "WIP Aging",
    category: "Operations",
    icon: "Hourglass",
    tagline: "Work-in-progress dwell time, stuck batch alerts, bottleneck heatmaps & carrying cost",
    whatIsItFor:
      "Work-in-Progress (WIP) aging and dwell-time monitoring module tracking semi-finished radiator components as they move between shop-floor buffer stages (Decoiling → Fin Pressing → Header Assembly → Pressure Test → HDG → Painting).",
    whyItIsUsed:
      "Semi-finished parts waiting between stations tie up substantial working capital and can develop surface oxidation/rusting if left exposed. Worse, forgotten batches cause order delays. This module is used to flag stuck WIP batches, visualize buffer aging heatmaps, and enforce strict dwell-time limits.",
    shopFloorScenario:
      "The Production Manager checks the WIP Aging board. A batch of 60 welded radiator elements for Toshiba has been sitting in the Pre-Galvanizing buffer for 76 hours (Standard dwell limit: 24 hours). The system highlights the batch in flashing red. The manager investigates, discovers a crane scheduling bottleneck, and re-routes the batch to HDG Kettle #1 within the hour.",
    businessImpact:
      "Reduces shop-floor WIP inventory by 22%, eliminates surface oxidation on stored components, and accelerates total plant cash-to-cash cycle time.",
    targetRoles: ["plant-manager", "planner", "supervisor"],
    keyCapabilities: [
      "Real-time WIP aging heatmap categorized by staging buffer (<12 hrs, 12-24 hrs, 24-48 hrs, >48 hrs Critical)",
      "Automated stagnant batch alerts highlighting work orders that haven't progressed in their expected time window",
      "WIP carrying cost financial calculator estimating interest cost on trapped shop-floor inventory",
      "Buffer queue capacity gauge preventing physical floor congestion between machine bays",
      "Fast-track expedited routing tool for aging customer orders nearing their promised delivery dates",
    ],
    howToUseSteps: [
      { step: 1, title: "Inspect WIP Heatmap", instruction: "Review the color-coded staging buffers across plants K1, K2, K3, K4, and R1." },
      { step: 2, title: "Filter Critical Stagnant Batches", instruction: "Click the '>48 hrs' critical bucket to view individual stuck work order traveler IDs." },
      { step: 3, title: "Identify Bottleneck Cause", instruction: "Check whether the hold is due to missing components, quality quarantine, or machine starvation." },
      { step: 4, title: "Expedite Batch", instruction: "Re-prioritize the work order in the Planning module to immediately push it to the next available bay." },
    ],
    keyKPIs: [
      { name: "Average WIP Dwell Time", target: "≤ 18.0 hrs", description: "Average hours a component spends waiting in buffers between active processing" },
      { name: "Stagnant Batches (>48h)", target: "0 batches", description: "Zero production orders stuck in intermediate buffers past 48 hours" },
      { name: "WIP Turnover Speed", target: "≥ 15.0 days", description: "Overall speed of inventory progression through the manufacturing cycle" },
    ],
    proTips: [
      "Never allow raw welded steel radiators to sit un-galvanized past 48 hours to prevent surface flash rusting.",
      "Set physical tape lines on the factory floor matching the digital buffer capacities defined in this module.",
    ],
    relatedModules: ["work-orders", "planning", "line-simulator", "inventory"],
  },
  {
    id: "dashboards",
    name: "Executive & Plant Analytics Dashboards",
    short: "Dashboards",
    category: "Intelligence",
    icon: "Bell",
    tagline: "Customizable analytical charts, multi-plant KPI matrices & automated email exports",
    whatIsItFor:
      "Enterprise analytical reporting and executive dashboard platform aggregating multi-plant performance, historical production trends, quality yields, maintenance costs, and energy analytics with customizable chart widgets.",
    whyItIsUsed:
      "Different executive stakeholders need different analytical lenses: the Managing Director focuses on multi-plant throughput and EBITDA margins, the Quality Head focuses on First-Pass Yield and vendor defect PPM, and the Plant Head focuses on OEE and shift adherence. This module is used to provide role-tailored dashboards with scheduled email exports.",
    shopFloorScenario:
      "Every Monday at 07:00 AM, the MES automatically generates and emails a consolidated 'Weekly Manufacturing Leadership Deck' to the Board of Directors. The dashboard compiles OEE trends across all 5 plants, total metric tonnage of radiators shipped, scrap rate reductions, and open high-priority CAPA resolutions.",
    businessImpact:
      "Replaces hours of manual PowerPoint slide creation, fosters a data-driven manufacturing culture, and provides complete transparency across all management tiers.",
    targetRoles: ["executive", "plant-manager", "engineer", "planner"],
    keyCapabilities: [
      "Customizable widget grid featuring Bar, Line, Area, Radar, and Gauge analytical visualizations",
      "Multi-plant comparison matrix benchmarking Khopoli (K1, K2, K3, K4) vs. Rabale (R1) performance",
      "Automated report scheduler generating and emailing daily, weekly, and monthly PDF/Excel decks",
      "Interactive data filtering across plant, line, shift, product family, customer, and date range",
      "Full-screen TV Presentation Mode designed for boardrooms and plant entrance kiosks",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Dashboard View", instruction: "Choose from pre-built executive dashboards (Executive Cockpit, Quality Intelligence, Plant Operations, Sustainability)." },
      { step: 2, title: "Customize Date Range", instruction: "Select historical comparison periods (e.g. This Month vs. Last Month, Year-over-Year)." },
      { step: 3, title: "Interact with Chart Data", instruction: "Hover over chart nodes to see granular metric values; click any legend to isolate specific lines or plants." },
      { step: 4, title: "Schedule Automated Email", instruction: "Click 'Share & Schedule' to set automated weekly PDF delivery to management stakeholders." },
    ],
    keyKPIs: [
      { name: "Report Generation Time", target: "Instant (< 2 sec)", description: "Real-time dashboard rendering speed from high-performance cache" },
      { name: "Data Accuracy & Completeness", target: "100.0%", description: "Full data reconciliation across all underlying MES transaction tables" },
      { name: "Executive Engagement", target: "≥ 90.0%", description: "Percentage of leadership stakeholders actively utilizing digital dashboards" },
    ],
    proTips: [
      "Use Fullscreen Mode (press F11 or click Fullscreen) when presenting during monthly executive reviews.",
      "Export raw chart data directly to Excel for specialized statistical modeling.",
    ],
    relatedModules: ["overview", "oee", "quality", "forecast"],
  },
  {
    id: "features-guide",
    name: "Features & Operational User Guide Center",
    short: "User Guide",
    category: "Help",
    icon: "HelpCircle",
    tagline: "Comprehensive operational manual, role assignments & KPI targets for all 26 modules",
    whatIsItFor:
      "Centralized in-app documentation and standard operating guide hub detailing the purpose, business justification, role mappings, step-by-step operating workflows, key capabilities, and KPI benchmarks for every module in the Hi-Tech MES platform.",
    whyItIsUsed:
      "Complex industrial software often suffers from low user adoption when operators and engineers are unsure what a screen is for or how to use it properly during a shift. This module is used to provide instant, contextual, and searchable operational guidance directly inside the application, accelerating user onboarding and ensuring standardized MES usage.",
    shopFloorScenario:
      "A newly hired Process Engineer wants to run a bottleneck simulation on Fin Line 1. They open the Feature Guide, read the 5-step workflow for the Line Simulator module, learn how to adjust takt time sliders and interpret buffer starvation alerts, and execute their first simulation without needing external training.",
    businessImpact:
      "Slashes user training time by 70%, ensures 100% feature adoption across all 8 user roles, and serves as an immutable operating standard for plant audits.",
    targetRoles: ["executive", "plant-manager", "planner", "supervisor", "quality", "operator", "maintenance", "engineer"],
    keyCapabilities: [
      "Complete operational manuals for all 26 MES modules with crisp, standardized sections",
      "Dedicated 'Why It Is Used' rationale and realistic shop-floor scenarios for every screen",
      "Interactive category and employee role filters for personalized learning",
      "Global full-text keyword search indexing workflows, defect codes, KPIs, and pro-tips",
      "One-click direct navigation ('Launch Module') jumping straight into the target screen",
    ],
    howToUseSteps: [
      { step: 1, title: "Search or Filter", instruction: "Use the search bar or category pills to locate the module you want to understand." },
      { step: 2, title: "Review 'Why It Is Used'", instruction: "Read the business purpose and shop-floor scenario to understand the operational context." },
      { step: 3, title: "Follow Step-by-Step Workflow", instruction: "Execute the numbered instructions in the target module." },
      { step: 4, title: "Check KPI Targets", instruction: "Review the benchmark performance targets for that screen to ensure optimal plant efficiency." },
      { step: 5, title: "Launch Module", instruction: "Click 'Launch Module' to instantly jump into the live screen and start working." },
    ],
    keyKPIs: [
      { name: "Documentation Coverage", target: "100.0% (26/26)", description: "Complete manual available for every single module in the system" },
      { name: "Operator Onboarding Time", target: "≤ 2 days", description: "Time required for new plant staff to achieve autonomous MES usage" },
      { name: "User Guide Accessibility", target: "Instant (Shift+?)", description: "One-click access from anywhere in the application" },
    ],
    proTips: [
      "Press keyboard shortcut 'Shift+?' from any screen in the application to open the contextual guide drawer immediately.",
      "Review the Shop-Floor Pro-Tips section on each module to discover advanced shortcuts and best practices.",
    ],
    relatedModules: ["overview", "dashboards", "work-orders", "operator-terminal"],
  },
];
