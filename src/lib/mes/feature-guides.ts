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
      "The Executive Cockpit provides a consolidated high-level dashboard of all 5 manufacturing facilities (K1, K2, K3, K4 in Khopoli and R1 in Rabale). It aggregates plant-level KPIs, machine running states, active work orders, and critical alerts into an executive command center.",
    businessImpact:
      "Enables leadership (MD, VP Operations, Plant Heads) to instantly identify production bottlenecks, dispatch delays, and quality risks without digging through disparate shift reports.",
    targetRoles: ["executive", "plant-manager", "planner"],
    keyCapabilities: [
      "Real-time aggregated OEE, First-Pass Yield, Scrap Rate, and On-Time Dispatch tracking",
      "Interactive multi-plant selector (All Plants vs. individual sites K1, K2, K3, K4, R1)",
      "Live Production Ticker displaying instantaneous machine sensor values and shift milestones",
      "Urgent alert feed with severity flags (Critical, Warning, Info) and direct jump links",
      "One-click Export Shift Report functionality for executive reviews",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Plant Scope", instruction: "Use the Topbar dropdown to filter between 'All Plants' for consolidated metrics or select a specific facility (e.g. K1 for Radiators, R1 for Tanks)." },
      { step: 2, title: "Review Key Sparklines", instruction: "Inspect the 8 core KPI cards. Pay special attention to OEE (Target: 75%) and Scrap Rate (Target: <1.8%)." },
      { step: 3, title: "Check Active Alerts", instruction: "Review the Live Alert stream on the right. Critical breakdown alerts (e.g. FAULT E104 on Welder 2) require immediate management focus." },
      { step: 4, title: "Explore Plant Comparisons", instruction: "Scroll to the Plant KPI Matrix to compare output, downtime, and energy efficiency between Khopoli and Rabale sites." },
      { step: 5, title: "Export Summary", instruction: "Click 'Export Shift Report' at the top right to download the consolidated PDF/CSV report for operational handovers." },
    ],
    keyKPIs: [
      { name: "Overall OEE", target: "≥ 75.0%", description: "Availability × Performance × Quality across active production lines" },
      { name: "First-Pass Yield", target: "≥ 96.0%", description: "Percentage of radiators passing QC without rework" },
      { name: "On-Time Dispatch", target: "≥ 90.0%", description: "Orders dispatched on or before customer promised date" },
      { name: "Scrap Rate", target: "≤ 1.8%", description: "Material loss percentage during forming and welding" },
    ],
    proTips: [
      "Click any KPI card to jump directly into the deep-dive analytics module for that metric.",
      "Use keyboard shortcut 'Ctrl+K' to quickly search for any specific order or serial number across plants.",
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
      "Advanced Planning and Scheduling (APS) module that balances production demand against finite machine and tooling capacity across fin rolling lines, tank fabrication bays, and hot-dip galvanizing kettles.",
    businessImpact:
      "Eliminates line starvation and over-allocation, reduces order changeover delays by up to 35%, and guarantees delivery commitments for Tier-1 transformer OEMs (Siemens, ABB, Toshiba).",
    targetRoles: ["planner", "plant-manager", "executive"],
    keyCapabilities: [
      "Interactive finite-capacity Gantt chart with drag-and-drop rescheduling",
      "Work center capacity utilization heatmaps across all shifts (Shift A, B, C)",
      "Rush order prioritization (e.g. SO-08115 Siemens Energy 3-day rush PO)",
      "Automated lead-time calculation factoring in galvanizing dwell and paint curing times",
      "Automated schedule optimization algorithm for bottleneck minimization",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Timeline & Work Center", instruction: "Switch between Gantt View, Capacity Heatmap, and Work Center Queue to inspect machine loading." },
      { step: 2, title: "Identify Overloaded Lines", instruction: "Check for red/orange highlighted machine rows where utilization exceeds 90% of available hours." },
      { step: 3, title: "Rebalance Schedule Blocks", instruction: "Drag-and-drop order blocks across parallel lines (e.g., shifting fin jobs between FIN-LINE-A and AUTO-LINE)." },
      { step: 4, title: "Manage Rush Orders", instruction: "Tag urgent customer orders as 'Rush' or 'High' priority to automatically insert them into optimal production slots." },
      { step: 5, title: "Publish Schedule", instruction: "Click 'Publish Schedule' to push updated digital job travelers to operator kiosks and supervisory dashboards." },
    ],
    keyKPIs: [
      { name: "Plan Adherence", target: "≥ 95.0%", description: "Percentage of jobs executed exactly according to planned time" },
      { name: "Bottleneck Utilization", target: "88% - 92%", description: "Optimal throughput load on critical constraint stations (HDG Kettle)" },
      { name: "Schedule Stability", target: "≥ 90.0%", description: "Minimal schedule perturbations within a 48-hour frozen window" },
    ],
    proTips: [
      "Group similar fin pitch and radiator height jobs together on the same line to reduce tooling setup time.",
      "Check HDG kettle maintenance schedules in the CMMS module before locking in large galvanizing batches.",
    ],
    relatedModules: ["work-orders", "line-simulator", "wip-aging", "forecast"],
  },
  {
    id: "work-orders",
    name: "Work Order Execution",
    short: "Work Orders",
    category: "Operations",
    icon: "ClipboardList",
    tagline: "Digital job travelers, stage-gate tracking & scrap accounting",
    whatIsItFor:
      "Manages the end-to-end lifecycle of production work orders from release through shearing, fin forming, seam welding, header assembly, pressure testing, hot-dip galvanizing, painting, and closing.",
    businessImpact:
      "Replaces vulnerable paper routing sheets with tamper-proof digital job records, preventing unauthorized stage bypass and ensuring 100% heat number traceability.",
    targetRoles: ["supervisor", "plant-manager", "operator", "planner"],
    keyCapabilities: [
      "Filter by status: Released, Started, In-Progress, On-Hold, Completed, Closed",
      "Steel Heat Number (e.g. HT-271624) stamping and validation for every batch",
      "Stage progress tracking: Cutting → Forming → Welding → Leak Test → Galvanizing → Painting → Final QC",
      "Instant scrap logging with specific defect reason codes",
      "Barcode/QR code generation for digital job traveler printing",
    ],
    howToUseSteps: [
      { step: 1, title: "Find Work Order", instruction: "Search by WO Number (e.g., WO-2400), Sales Order (SO-08100), or Customer Name." },
      { step: 2, title: "Review Job Details", instruction: "Click a work order card to open the drawer showing planned vs done quantities, operator assigned, and stage." },
      { step: 3, title: "Advance Production Stage", instruction: "Update job state ('Start Job', 'Mark Stage Complete') as parts pass through quality gates." },
      { step: 4, title: "Log Defects & Scrap", instruction: "If any parts are rejected during leak test or welding, enter scrap count to adjust yield and trigger NCR if needed." },
      { step: 5, title: "Close Order", instruction: "Once final QC passes and packaging is verified, mark order 'Completed' for dispatch staging." },
    ],
    keyKPIs: [
      { name: "Order Completion On-Time", target: "≥ 92.0%", description: "Work orders finished before the customer promised dueDate" },
      { name: "Stage WIP Dwell Time", target: "< 12 hrs", description: "Average duration a work order spends waiting between stations" },
      { name: "Yield per Batch", target: "≥ 98.2%", description: "Ratio of good finished units to raw input steel blanks" },
    ],
    proTips: [
      "Use 'On-Hold' status with mandatory reason notes whenever parts are paused for customer engineering approval.",
      "Click 'View Traceability' directly from any work order drawer to see the linked material coil certificates.",
    ],
    relatedModules: ["planning", "quality", "operator-terminal", "traceability"],
  },
  {
    id: "inventory",
    name: "Material & Inventory Management",
    short: "Inventory",
    category: "Operations",
    icon: "Boxes",
    tagline: "Multi-plant raw steel coils, WIP components, FG stock & heat tracking",
    whatIsItFor:
      "Tracks raw materials (CRCA steel coils, header pipes), WIP components (formed fins, welded headers), finished radiators, paint/zinc consumables, and maintenance spares across Store-A, Store-B, and Central Warehouses.",
    businessImpact:
      "Prevents costly line shutdowns due to raw steel stockouts, reduces working capital tied up in excess inventory by 22%, and maintains strict FIFO/MTC compliance.",
    targetRoles: ["plant-manager", "supervisor", "planner"],
    keyCapabilities: [
      "Categorized inventory views: Raw Material, WIP, Finished Goods, Consumables, Spare Parts",
      "Steel coil Heat Number & Mill Test Certificate (MTC) verification at receiving",
      "Automated low-stock alerts when inventory drops below Reorder Level",
      "Material issuance directly linked to active production Work Orders",
      "Storage location bin tracking (e.g. Khopoli Bay-3, Rack-B4)",
    ],
    howToUseSteps: [
      { step: 1, title: "Filter by Material Category", instruction: "Select 'Raw', 'WIP', 'Finished Goods', or 'Consumables' from the category tabs." },
      { step: 2, title: "Check Reorder Status", instruction: "Look for items flagged with 'Reorder Required' (e.g. Zinc Ingots or Hydraulic Oil)." },
      { step: 3, title: "Verify Heat Number", instruction: "Click raw steel coil items to review verified chemical composition and tensile strength MTC specs." },
      { step: 4, title: "Issue Stock to Shop Floor", instruction: "Click 'Issue Material', enter the target Work Order number and quantity to deduct inventory." },
      { step: 5, title: "Audit Stock Movements", instruction: "Review the 'Last Movement' timestamp and transaction log for inventory reconciliation." },
    ],
    keyKPIs: [
      { name: "Inventory Accuracy", target: "≥ 99.0%", description: "Match between physical stock audits and digital MES records" },
      { name: "Stockout Incidents", target: "0 per month", description: "Zero production halts caused by unfulfilled material requests" },
      { name: "Slow-Moving Stock Ratio", target: "< 5.0%", description: "Percentage of inventory idle for greater than 60 days" },
    ],
    proTips: [
      "Always verify that the heat number on the physical coil tag matches the digital MTC before issuing to fin roll formers.",
    ],
    relatedModules: ["work-orders", "suppliers", "wip-aging", "traceability"],
  },
  {
    id: "quality",
    name: "Quality Management & NCR/CAPA",
    short: "Quality",
    category: "Quality",
    icon: "ShieldCheck",
    tagline: "Stage-gate inspection, ISO 3834-2 welding compliance, NCRs & 8D CAPA",
    whatIsItFor:
      "Enforces total quality control across raw material incoming inspection, in-process welding/forming inspection, pressure leak testing (2.5 bar hydro / air underwater), galvanizing coating thickness (DFT ≥70 µm), and final pre-dispatch audit.",
    businessImpact:
      "Guarantees compliance with international welding standard ISO 3834-2 and customer technical specifications (Siemens, ABB, Hitachi), reducing customer warranty claims to near zero.",
    targetRoles: ["quality", "plant-manager", "supervisor"],
    keyCapabilities: [
      "Digital inspection logs with Pass, Fail, Hold, Pending result classification",
      "Non-Conformance Report (NCR) lifecycle: Open → Investigating → Containment → Root Cause → CAPA Open → Verified → Closed",
      "Severity categorization: Critical (Safety/Pressure leak), Major (DFT drift), Minor (Cosmetic)",
      "Hydrostatic leak test pressure logging with exact hold times (120s @ 2.5 bar)",
      "One-click generation of formal Quality Inspection Certificates for customer dispatch dossiers",
    ],
    howToUseSteps: [
      { step: 1, title: "Log Inspection Result", instruction: "Select product serial, stage (e.g. Welded Header, Hydro Test, DFT Inspection), and enter measured values." },
      { step: 2, title: "Compare Against Specs", instruction: "Ensure values fall within tolerance (e.g. Zinc DFT spec ≥ 70 µm, Hydro pressure ≥ 2.5 bar)." },
      { step: 3, title: "Raise NCR on Defect", instruction: "If a defect occurs, click 'Raise NCR', select severity, defect type (e.g., Weld Pin Hole), and quarantine serials." },
      { step: 4, title: "Assign CAPA Owner", instruction: "Document immediate containment actions, assign 8D corrective action owner and target closure date." },
      { step: 5, title: "Verify & Close NCR", instruction: "Review post-remedial test results and verify CAPA effectiveness before final NCR closure." },
    ],
    keyKPIs: [
      { name: "First-Pass Yield (FPY)", target: "≥ 96.0%", description: "Percentage of units passing all stage inspections on first attempt" },
      { name: "Defect PPM", target: "< 250 PPM", description: "Defective parts per million manufactured" },
      { name: "Average CAPA Closure Time", target: "< 14 days", description: "Speed of investigating, resolving, and verifying corrective actions" },
    ],
    proTips: [
      "Quarantined serials in 'Hold' status cannot be scheduled for galvanizing or packing until formal QC release.",
      "Use the 'Cost of Quality' module to see the monetary cost of internal reworks caused by open NCRs.",
    ],
    relatedModules: ["root-cause", "cost-quality", "traceability", "calibration"],
  },
  {
    id: "traceability",
    name: "Genealogy & End-to-End Traceability",
    short: "Traceability",
    category: "Operations",
    icon: "Workflow",
    tagline: "Coil-to-customer 'as-built' digital pedigree for every radiator & tank",
    whatIsItFor:
      "Builds a complete, tamper-proof genealogy tree for every serial number, linking the parent steel coil heat number, machine telemetry, operator IDs, weld inspection records, hydro test charts, galvanizing bath dwell, and dispatch manifest.",
    businessImpact:
      "Enables instant response to customer audit queries and warranty claims in seconds instead of days, fulfilling strict Tier-1 OEM traceability requirements.",
    targetRoles: ["quality", "plant-manager", "executive"],
    keyCapabilities: [
      "Instant serial number & barcode search (e.g., SN-K1-2024-001)",
      "Visual multi-tier genealogy timeline from raw coil receipt to customer installation",
      "Linked process parameters (welding current, zinc bath temp 452°C, hydro test pressure 2.5 bar)",
      "Operator digital signature and inspection timestamp audit records",
      "Exportable comprehensive As-Built Quality Dossier (PDF)",
    ],
    howToUseSteps: [
      { step: 1, title: "Enter Serial Number", instruction: "Type the unit serial number (e.g. SN-K1-2024-001) or work order number in the search bar." },
      { step: 2, title: "Inspect Genealogy Tree", instruction: "Trace the interactive visual pipeline from Raw Steel Coil → Fin Blanking → Assembly → HDG → Testing." },
      { step: 3, title: "View Parameter Logs", instruction: "Click any stage node in the timeline to view exact machine sensor readings and test pressures recorded at that moment." },
      { step: 4, title: "Verify Operator & Machine", instruction: "Confirm which certified operator and machine executed each weld seam and galvanizing dip." },
      { step: 5, title: "Download Customer Dossier", instruction: "Click 'Export Traceability Dossier' to generate a customer-ready compliance document." },
    ],
    keyKPIs: [
      { name: "Traceability Coverage", target: "100.0%", description: "Percentage of produced radiators with full digital genealogy" },
      { name: "Dossier Retrieval Time", target: "< 5 seconds", description: "Time taken to compile complete history for customer audit" },
    ],
    proTips: [
      "Use traceability data during root cause analysis to check if multiple field defects share the same raw material coil batch.",
    ],
    relatedModules: ["quality", "work-orders", "customer-portal", "audit-trail"],
  },
  {
    id: "iiot",
    name: "Machine Telemetry & IIoT",
    short: "IIoT",
    category: "Shop Floor",
    icon: "Cpu",
    tagline: "Real-time OPC-UA / Modbus / MQTT sensor streaming & machine states",
    whatIsItFor:
      "Connects shop-floor machinery (CNC shears, fin formers, seam welders, hydro test rigs, HDG zinc kettle burners, paint booths) directly to the MES via industrial IoT protocols for live condition monitoring.",
    businessImpact:
      "Detects parameter drift (e.g. zinc bath temperature drops, roll forming pressure spikes) before defects occur, reducing scrap by 18% and preventing unexpected breakdown stops.",
    targetRoles: ["engineer", "maintenance", "supervisor", "plant-manager"],
    keyCapabilities: [
      "Live machine status monitoring: Running (Green), Idle (Yellow), Down (Red), Changeover (Blue), Offline",
      "High-frequency sensor feeds: Zinc bath temp (452°C), stroke rate (92 spm), roll speed, weld current (285A), pressure",
      "Automatic threshold alarming with instant notification triggers",
      "Cycle time vs Ideal cycle time comparison per machine",
      "Direct maintenance breakdown work order dispatch from alarm events",
    ],
    howToUseSteps: [
      { step: 1, title: "Filter by Plant & Line", instruction: "Select plant (K1, K2, K3, R1) or line to view machines in that specific section." },
      { step: 2, title: "Monitor Machine States", instruction: "Check the status grid for down or idle assets (e.g., M-K2-003 Robot Welder down on FAULT E104)." },
      { step: 3, title: "Inspect Telemetry Parameters", instruction: "Click a machine card to see live sensor gauges, stroke counts, oil pressure, and bath temperatures." },
      { step: 4, title: "Respond to Parameter Alarms", instruction: "If a parameter drifts beyond threshold (e.g. Zinc bath <445°C), alert the line supervisor or maintenance crew." },
      { step: 5, title: "Dispatch Maintenance", instruction: "Click 'Raise Breakdown Order' directly from a faulted machine card to dispatch a technician." },
    ],
    keyKPIs: [
      { name: "Live Telemetry Uptime", target: "≥ 99.5%", description: "Reliability of IoT data stream from shop-floor PLC/SCADA gateways" },
      { name: "Cycle Time Adherence", target: "≥ 94.0%", description: "Actual cycle time within 10% of engineering standard ideal cycle" },
    ],
    proTips: [
      "Keep an eye on HDG-2 Zinc bath temperature: maintaining 450°C-455°C ensures optimal coating adherence and minimum dross formation.",
    ],
    relatedModules: ["oee", "maintenance", "energy", "andon"],
  },
  {
    id: "oee",
    name: "OEE & Performance Analytics",
    short: "OEE",
    category: "Shop Floor",
    icon: "Gauge",
    tagline: "A × P × Q mathematical breakdown, Six Big Losses & Pareto analysis",
    whatIsItFor:
      "Calculates Overall Equipment Effectiveness (OEE = Availability × Performance × Quality) across all assets and provides Pareto analysis of the Six Big Losses (Breakdowns, Setups, Minor Stops, Reduced Speed, Scrap, Rework).",
    businessImpact:
      "Provides actionable insight to unlock hidden plant capacity, pinpoint machine speed loss, and justify CAPEX/OPEX continuous improvement investments.",
    targetRoles: ["plant-manager", "engineer", "executive", "supervisor"],
    keyCapabilities: [
      "Detailed Availability, Performance, and Quality percentage breakdown gauges",
      "24-Hour rolling OEE trend chart with shift-by-shift comparison",
      "Six Big Losses Pareto chart identifying top downtime drivers in machine-hours",
      "Plant-by-plant and machine-by-machine OEE league table rankings",
      "Loss categorization: Equipment failure, changeover delay, idling, reduced speed, process defects",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Time Window", instruction: "Choose between 'This Shift', 'Today', 'This Week', or 'This Month' to set the analysis timeframe." },
      { step: 2, title: "Analyze OEE Components", instruction: "Examine whether low OEE is driven by Availability (downtime), Performance (slow speed), or Quality (scrap)." },
      { step: 3, title: "Inspect Six Big Losses", instruction: "Review the Pareto chart to see the largest bucket of lost hours (e.g., 42 hours lost to changeovers)." },
      { step: 4, title: "Review Machine Rankings", instruction: "Identify the top 3 and bottom 3 machines to focus Kaizen and TPM (Total Productive Maintenance) activities." },
      { step: 5, title: "Track Improvement Trend", instruction: "Monitor weekly rolling averages to verify that TPM corrective actions are raising plant OEE toward 75%+." },
    ],
    keyKPIs: [
      { name: "Overall OEE", target: "≥ 75.0%", description: "World-class benchmark target for custom heavy fabrication MES" },
      { name: "Availability Rate", target: "≥ 90.0%", description: "Operating time divided by planned production time" },
      { name: "Performance Rate", target: "≥ 92.0%", description: "Actual operating speed divided by design ideal run rate" },
      { name: "Quality Rate", target: "≥ 98.0%", description: "Good production output divided by total parts started" },
    ],
    proTips: [
      "Use SMED (Single-Minute Exchange of Die) techniques on fin former changeovers to recover up to 15% in Availability loss.",
    ],
    relatedModules: ["iiot", "maintenance", "overview", "line-simulator"],
  },
  {
    id: "maintenance",
    name: "Maintenance & CMMS",
    short: "Maintenance",
    category: "Support",
    icon: "Wrench",
    tagline: "Preventive maintenance, breakdown dispatch, MTBF / MTTR & spare parts",
    whatIsItFor:
      "Complete Computerized Maintenance Management System (CMMS) managing scheduled preventive maintenance (PM), emergency breakdown work orders, MTBF / MTTR metrics, and critical spare parts inventory.",
    businessImpact:
      "Reduces unplanned machine breakdowns by 40%, increases asset lifespan, and keeps Mean Time To Repair (MTTR) under 45 minutes across all plants.",
    targetRoles: ["maintenance", "plant-manager", "engineer"],
    keyCapabilities: [
      "Preventive (PM), Corrective, Predictive, and Calibration work order management",
      "Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR) analytics",
      "Technician assignment and maintenance priority ranking (Rush, High, Normal, Low)",
      "Spare parts consumption tracking directly linked to maintenance tasks",
      "Upcoming maintenance schedule calendar with automated due-date reminders",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Upcoming PM Orders", instruction: "Check the maintenance queue for PM jobs due in the next 48 hours (e.g. MT-001 HDG Kettle PM)." },
      { step: 2, title: "Log Breakdown Work Order", instruction: "When an asset faults, click 'New Maintenance Order', select the asset, defect symptoms, and priority." },
      { step: 3, title: "Assign Certified Technician", instruction: "Allocate the job to an available technician (e.g. electrical/mechanical tech)." },
      { step: 4, title: "Record Repair Actions & Spares", instruction: "Log the root cause, repair actions taken, hours spent, and replacement spare parts used." },
      { step: 5, title: "Close & Verify Machine State", instruction: "Mark the work order 'Completed'; the machine state in IIoT automatically transitions back to Running/Idle." },
    ],
    keyKPIs: [
      { name: "MTBF", target: "≥ 120 hrs", description: "Average operating hours between unexpected equipment breakdowns" },
      { name: "MTTR", target: "< 45 min", description: "Average duration to diagnose, repair, and restore a broken machine" },
      { name: "PM Compliance", target: "≥ 95.0%", description: "Percentage of preventive maintenance tasks executed on time" },
    ],
    proTips: [
      "Schedule high-wear component replacements (shear blades, roll forming dies) during planned shift breaks to minimize downtime.",
    ],
    relatedModules: ["iiot", "oee", "inventory", "andon"],
  },
  {
    id: "energy",
    name: "Energy & Utilities Management",
    short: "Energy",
    category: "Support",
    icon: "Zap",
    tagline: "Specific energy consumption (SEC), peak demand & carbon emissions",
    whatIsItFor:
      "Tracks electrical power consumption (kWh), natural gas/LPG for galvanizing burners, compressed air usage, and calculates Specific Energy Consumption per metric ton of radiators produced.",
    businessImpact:
      "Prevents maximum demand penalty surcharges from state electricity boards (MSEDCL), lowers energy costs by 12%, and supports ISO 50001 energy management compliance.",
    targetRoles: ["engineer", "plant-manager", "executive"],
    keyCapabilities: [
      "Real-time peak demand monitoring (kVA) with 85% threshold warning alerts",
      "Specific Energy Consumption (SEC) per finished radiator and per metric ton of steel",
      "Plant-wise energy comparison (K1, K2, K3, K4, R1 power usage profiles)",
      "Galvanizing kettle thermal efficiency and burner consumption analytics",
      "Carbon emissions (kg CO₂ eq) tracking per production batch",
    ],
    howToUseSteps: [
      { step: 1, title: "Monitor Peak Demand", instruction: "Check live plant power load against contracted maximum demand (e.g. K2 at 88% threshold warning)." },
      { step: 2, title: "Analyze Specific Energy Consumption", instruction: "Review kWh per unit to verify energy efficiency across different radiator product models." },
      { step: 3, title: "Inspect Galvanizing Thermal Profile", instruction: "Monitor HDG burner efficiency during active dipping versus idle holding shifts." },
      { step: 4, title: "Optimize Shift Loads", instruction: "Stagger heavy power startup operations (furnace heaters, large presses) to avoid concurrent peak demand spikes." },
      { step: 5, title: "Export Energy Audit Report", instruction: "Download monthly utility and carbon footprint reports for management review." },
    ],
    keyKPIs: [
      { name: "Specific Energy Consumption", target: "< 14.5 kWh/unit", description: "Average electrical energy consumed per finished radiator unit" },
      { name: "Peak Demand Ratio", target: "< 85.0%", description: "Operating load kept safely below maximum contracted utility limit" },
      { name: "Power Factor", target: "≥ 0.98", description: "Maintained power factor to avoid utility penalty charges" },
    ],
    proTips: [
      "Shift energy-intensive baking oven cycles to off-peak tariff hours (night shifts) to benefit from Time-of-Day (ToD) tariff discounts.",
    ],
    relatedModules: ["iiot", "overview", "maintenance"],
  },
  {
    id: "workforce",
    name: "Workforce & Skills Matrix",
    short: "Workforce",
    category: "Support",
    icon: "Users",
    tagline: "Operator qualification matrix, welder certifications & shift allocation",
    whatIsItFor:
      "Manages workforce skills, ASME / ISO 9606 welder qualifications, IWE certifications, shift rosters, and operator productivity/utilization metrics across all plant sites.",
    businessImpact:
      "Ensures that critical processes (such as robotic seam welding and pressure vessel sealing) are executed only by certified operators, preventing quality audit failures and customer disqualification.",
    targetRoles: ["plant-manager", "supervisor", "quality"],
    keyCapabilities: [
      "Multi-level skill matrix (Level 1 Novice to Level 5 Expert/Trainer) across all manufacturing stations",
      "Welder qualification certificate validity radar with 30-day expiration warnings",
      "Shift-wise operator allocation across Shift A, B, and C",
      "Operator productivity (%) and utilization (%) performance analytics",
      "Training needs gap identification for cross-skilling",
    ],
    howToUseSteps: [
      { step: 1, title: "Filter by Plant & Shift", instruction: "Select plant (e.g. K1, R1) and shift to view the on-duty roster of operators and technicians." },
      { step: 2, title: "Check Certification Status", instruction: "Look for flagged certificates (e.g., 'IWE qualification expires in 21 days - P. Nair')." },
      { step: 3, title: "Match Skills to Complex Jobs", instruction: "Ensure high-spec export orders (Siemens/Hitachi) are assigned to Level 4/5 certified welders." },
      { step: 4, title: "Schedule Recertification", instruction: "Trigger training or welding test coupons for operators whose certs are nearing expiration." },
      { step: 5, title: "Review Utilization & Output", instruction: "Analyze individual and shift-level productivity to reward top performers and support training needs." },
    ],
    keyKPIs: [
      { name: "Welder Cert Compliance", target: "100.0%", description: "Zero uncertified operators performing code welding operations" },
      { name: "Multi-Skilled Operator Ratio", target: "≥ 65.0%", description: "Operators qualified across at least 3 distinct manufacturing stations" },
      { name: "Average Workforce Utilization", target: "85% - 92%", description: "Productive working hours vs planned shift hours" },
    ],
    proTips: [
      "Schedule welder coupon testing at least 3 weeks before certificate expiry to prevent operational gaps.",
    ],
    relatedModules: ["documents", "operator-terminal", "shift-handover"],
  },
  {
    id: "documents",
    name: "Document & Compliance Management",
    short: "Documents",
    category: "Quality",
    icon: "FileText",
    tagline: "Controlled WPS / PQR / SOP repository, revision control & compliance",
    whatIsItFor:
      "A secure, centralized document management system maintaining controlled Welding Procedure Specifications (WPS), Procedure Qualification Records (PQR), Standard Operating Procedures (SOP), and Control Plans.",
    businessImpact:
      "Guarantees that shop-floor operators always build according to the latest approved engineering revision, eliminating scrap from obsolete drawings or outdated welding parameters.",
    targetRoles: ["quality", "engineer", "plant-manager"],
    keyCapabilities: [
      "Controlled document register for WPS, PQR, SOP, Control Plans, and Work Instructions",
      "Revision control with version history (e.g. Rev 03 approved vs Rev 04 under-review)",
      "Effective date and mandatory periodic review reminder alerts",
      "Designated document owner and technical approver sign-offs",
      "Direct document viewer access from shop-floor operator kiosks",
    ],
    howToUseSteps: [
      { step: 1, title: "Search Document Library", instruction: "Filter by document type (WPS, PQR, SOP, Control Plan) or search by document ID (e.g. DOC-001)." },
      { step: 2, title: "Verify Revision Status", instruction: "Ensure only 'Approved' status documents are active on production lines; avoid 'Under-Review' drafts." },
      { step: 3, title: "Inspect Welding Parameters", instruction: "Open WPS files to check specified voltage, current range, shielding gas mix, and wire feed speed." },
      { step: 4, title: "Initiate Revision Workflow", instruction: "When engineering releases an ECN (Engineering Change Note), upload revised document for review." },
      { step: 5, title: "Archive Obsolete Versions", instruction: "System automatically marks previous revisions 'Obsolete' with full timestamped audit trail." },
    ],
    keyKPIs: [
      { name: "Document Review Timeliness", target: "100.0%", description: "All SOPs and WPS documents reviewed within scheduled annual cycle" },
      { name: "Obsolete Document Usage", target: "0 incidents", description: "Zero shop-floor operations run on outdated drawing revisions" },
    ],
    proTips: [
      "Link approved WPS documents directly to welding work orders so operators can view welding parameters on their kiosk screen.",
    ],
    relatedModules: ["quality", "workforce", "audit-trail"],
  },
  {
    id: "operator-terminal",
    name: "Operator Terminal (Kiosk UI)",
    short: "Operator",
    category: "Shop Floor",
    icon: "Monitor",
    tagline: "Touchscreen-optimized job traveler execution, scrap logging & Andon call",
    whatIsItFor:
      "A high-contrast, touch-optimized shop-floor kiosk interface designed specifically for machine operators to execute digital job cards, record part counts, log scrap, and call for help without touching paper.",
    businessImpact:
      "Provides live shop-floor feedback to the MES in real time, eliminating end-of-shift data entry lag and empowering operators with one-touch assistance.",
    targetRoles: ["operator", "supervisor"],
    keyCapabilities: [
      "Big-button touch controls optimized for gloved shop-floor operation",
      "One-tap 'Start Job', 'Pause', and 'Complete' production execution",
      "Instant good part counter (+1, +10) with automatic progression tracking",
      "One-click scrap recording with mandatory defect reason selection",
      "One-touch Andon Call Assistance button (Material, Quality, Maintenance, Supervisor)",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Work Station & Job", instruction: "Select your station (e.g. Fin Forming A, Seam Welder 1) and choose the assigned active Work Order." },
      { step: 2, title: "Tap Start Production", instruction: "Press 'Start' to record your start timestamp and log your operator ID to the job record." },
      { step: 3, title: "Increment Completed Parts", instruction: "Use the large '+1' or '+10' buttons as finished parts pass your station quality check." },
      { step: 4, title: "Log Defective Units", instruction: "If a part fails visual or dimensional check, tap 'Log Scrap', select defect code, and confirm." },
      { step: 5, title: "Call for Assistance", instruction: "If tooling breaks or raw material runs low, tap 'Call Andon' to alert the supervisor immediately." },
    ],
    keyKPIs: [
      { name: "Shop-Floor Data Entry Latency", target: "< 2 seconds", description: "Real-time sync between physical part completion and MES database" },
      { name: "Terminal Touch Uptime", target: "100.0%", description: "Availability of shop-floor kiosk terminals throughout the shift" },
    ],
    proTips: [
      "Use 'Pause' mode with 'Break' or 'Tool Setup' reason when temporarily stepping away from the workstation to keep OEE metrics accurate.",
    ],
    relatedModules: ["work-orders", "andon", "quality", "shift-handover"],
  },
  {
    id: "andon",
    name: "Digital Andon Big Screen",
    short: "Andon",
    category: "Shop Floor",
    icon: "Tv",
    tagline: "Overhead shop-floor status board, line stoppage alerts & escalation",
    whatIsItFor:
      "A high-visibility, fullscreen overhead display for factory floors showing real-time station operating status, line stoppages, unacknowledged alarms, and multi-tier call escalation timers.",
    businessImpact:
      "Cuts line stoppage response times by 60% by broadcasting immediate audio-visual alerts to supervisors and maintenance teams the moment a station halts.",
    targetRoles: ["supervisor", "plant-manager", "maintenance", "operator"],
    keyCapabilities: [
      "Color-coded station status grid: Green (Running), Yellow (Idle), Red (Breakdown/Down), Blue (Quality Hold)",
      "Pulsing red alerts for active line stoppages with live stoppage timer in minutes",
      "Multi-tier escalation tracking: Level 1 (Supervisor <5m), Level 2 (Manager <15m), Level 3 (Plant Head <30m)",
      "Plant-wide line throughput counters and shift target countdowns",
      "Optimized for 55-inch+ overhead shop-floor LED monitors with fullscreen mode",
    ],
    howToUseSteps: [
      { step: 1, title: "Launch Fullscreen Display", instruction: "Open this module on shop-floor overhead monitors and click the fullscreen toggle button." },
      { step: 2, title: "Monitor Station Status", instruction: "Ensure all production line stations remain in 'Green Running' status." },
      { step: 3, title: "Respond to Red Stoppages", instruction: "When a station turns red, check the blinking card for the stoppage reason (e.g. Robot Welder Fault)." },
      { step: 4, title: "Acknowledge Andon Call", instruction: "Supervisor or technician acknowledges the alert on their mobile device or kiosk, resetting the timer." },
      { step: 5, title: "Clear Issue & Resume", instruction: "Once repair/clearance is complete, the station automatically transitions back to green." },
    ],
    keyKPIs: [
      { name: "Average Andon Response Time", target: "< 5 minutes", description: "Time taken for supervisor/technician to acknowledge an active alarm" },
      { name: "Unplanned Stoppage Duration", target: "< 20 min/shift", description: "Total cumulative line stoppage time per 8-hour shift" },
    ],
    proTips: [
      "Level 2 escalation automatically triggers SMS/WhatsApp alerts to the Plant Manager if a red stoppage persists over 15 minutes.",
    ],
    relatedModules: ["operator-terminal", "iiot", "maintenance", "shift-handover"],
  },
  {
    id: "shift-handover",
    name: "Shift Handover Log",
    short: "Handover",
    category: "Shop Floor",
    icon: "BookOpen",
    tagline: "Digital shift logs, critical carryover issues & supervisor sign-offs",
    whatIsItFor:
      "A structured digital logbook facilitating smooth handovers between Shift A (06:00-14:00), Shift B (14:00-22:00), and Shift C (22:00-06:00) to eliminate communication gaps.",
    businessImpact:
      "Prevents recurring quality defects and machine startup delays during shift changes, saving an estimated 25 minutes of lost production per shift transition.",
    targetRoles: ["supervisor", "plant-manager", "operator"],
    keyCapabilities: [
      "Categorized handover logs: Notes, Machine Issues, Quality Holds, Key Achievements, Escalations",
      "Carryover Work Order status tracking and target vs actual production output handoff",
      "Priority flagging (Rush, High, Normal) for pending operational tasks",
      "Mandatory digital acknowledgment and sign-off by incoming shift supervisor",
      "Historical searchable shift archive for shift-to-shift variance investigation",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Current Shift Summary", instruction: "Outgoing supervisor reviews shift output numbers, scrap totals, and machine downtime minutes." },
      { step: 2, title: "Log Critical Carryovers", instruction: "Click 'New Handover Entry', select type ('Issue', 'Handover'), write clear notes, and set priority." },
      { step: 3, title: "Flag Unresolved Problems", instruction: "Highlight ongoing maintenance orders (e.g., HDG bath drossing due) and special customer instructions." },
      { step: 4, title: "Incoming Supervisor Review", instruction: "Incoming supervisor reads all entries, inspects pending work orders, and clicks 'Acknowledge'." },
      { step: 5, title: "Timestamped Sign-off", instruction: "The system logs digital signatures and timestamps for complete ISO 9001 governance." },
    ],
    keyKPIs: [
      { name: "Shift Handover Compliance", target: "100.0%", description: "Every shift transition logged and digitally acknowledged prior to startup" },
      { name: "Shift Startup Delay", target: "< 5 minutes", description: "Minimal lost time between consecutive shift handoffs" },
    ],
    proTips: [
      "Always mention specific serial numbers if any units were placed on quality hold during the outgoing shift.",
    ],
    relatedModules: ["work-orders", "andon", "workforce", "overview"],
  },
  {
    id: "line-simulator",
    name: "Production Line Digital Twin Simulator",
    short: "Line Sim",
    category: "Shop Floor",
    icon: "GitBranch",
    tagline: "Live flow animation, buffer accumulation & constraint analysis",
    whatIsItFor:
      "A real-time digital twin simulator that visualizes unit flow through Shearing, Fin Forming, Assembly, Seam Welding, Hydro Testing, Galvanizing, Painting, and Packaging lines to detect bottlenecks before lines block.",
    businessImpact:
      "Allows production engineers to identify starved and blocked stations in real time, increasing line balancing efficiency by 24% and maximizing throughput.",
    targetRoles: ["engineer", "plant-manager", "supervisor"],
    keyCapabilities: [
      "Animated digital twin schematic of multi-station production lines",
      "Live station state indicators: Running, Idle, Down, Blocked (upstream full), Starved (no input)",
      "WIP Buffer in/out counters and utilization percentage bars per station",
      "Automated Bottleneck identification badge pointing to the current constraining process",
      "Throughput comparison: Actual units/hr vs Target engineering takt rate",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Production Line", instruction: "Choose target line (e.g. Khopoli Plant 1 Fin Line, Plant 2 Auto Radiator Line, or Rabale Tank Line)." },
      { step: 2, title: "Observe Live Flow", instruction: "Watch the animated part flow and identify which stations are yellow (idle/starved) or red (blocked)." },
      { step: 3, title: "Locate the Bottleneck", instruction: "Check the 'Bottleneck Station' banner to find the slowest process currently capping line throughput." },
      { step: 4, title: "Inspect Buffer Accumulation", instruction: "Check WIP buffer levels between stations; high WIP before a station confirms a downstream bottleneck." },
      { step: 5, title: "Rebalance Resources", instruction: "Adjust operator allocation or line speed to balance station cycle times closer to takt time." },
    ],
    keyKPIs: [
      { name: "Line Balancing Efficiency", target: "≥ 88.0%", description: "Even distribution of workload across sequential manufacturing stations" },
      { name: "Target Throughput Ratio", target: "≥ 95.0%", description: "Actual hourly output compared against design line capacity" },
    ],
    proTips: [
      "If the Leak Test rig is the bottleneck, check if pre-test visual inspections can catch obvious weld defects before hydro testing.",
    ],
    relatedModules: ["planning", "wip-aging", "oee", "iiot"],
  },
  {
    id: "suppliers",
    name: "Supplier Scorecard & Vendor Quality",
    short: "Suppliers",
    category: "Support",
    icon: "Truck",
    tagline: "Vendor performance ratings, On-Time Delivery (OTD) & incoming defect PPM",
    whatIsItFor:
      "Evaluates and scores raw material steel mills, zinc suppliers, paint manufacturers, and subcontract service vendors based on On-Time Delivery (OTD), Quality Acceptance Rate, and Defect PPM.",
    businessImpact:
      "Identifies poor-performing vendors before defective raw materials enter the factory, driving vendor quality improvements and protecting Hi-Tech's production schedule.",
    targetRoles: ["plant-manager", "quality", "executive"],
    keyCapabilities: [
      "Comprehensive vendor ratings (0-100 score) and Tier classifications (Tier A, B, C, D)",
      "Categorized supplier registry: Steel Coils, Zinc Coating, Welding Wire, Paint & Flux, Spares, Services",
      "On-Time Delivery (OTD %) and Quality Acceptance (%) tracking per supplier",
      "Incoming Defect PPM (Parts Per Million) and open supplier NCR count",
      "6-Month historical performance trend sparklines for quarterly vendor audits",
    ],
    howToUseSteps: [
      { step: 1, title: "Filter by Material Category", instruction: "Select category (e.g. Steel, Coating, Welding, Paint) to inspect suppliers in that sector." },
      { step: 2, title: "Review Vendor Tiers", instruction: "Identify Tier A (Preferred) vs Tier C/D (At Risk) vendors based on overall scorecard ratings." },
      { step: 3, title: "Examine Quality & Delivery Metrics", instruction: "Check defect PPM rates and open NCR counts linked to incoming material shipments." },
      { step: 4, title: "Review 6-Month Trends", instruction: "Inspect trend sparklines to see if vendor performance is improving or deteriorating over time." },
      { step: 5, title: "Export Scorecard", instruction: "Download vendor evaluation reports for formal vendor audits and contract negotiations." },
    ],
    keyKPIs: [
      { name: "Supplier On-Time Delivery", target: "≥ 95.0%", description: "Purchase orders delivered on or before promised delivery date" },
      { name: "Supplier Quality Acceptance", target: "≥ 99.0%", description: "Incoming material lots accepted at receiving inspection without rejection" },
      { name: "Incoming Defect PPM", target: "< 500 PPM", description: "Defective raw material parts per million received" },
    ],
    proTips: [
      "Prioritize steel coil procurement from Tier-A mills (Tata Steel, JSW) for critical high-pressure transformer orders.",
    ],
    relatedModules: ["inventory", "quality", "cost-quality"],
  },
  {
    id: "audit-trail",
    name: "Audit Trail & Compliance",
    short: "Audit Trail",
    category: "Intelligence",
    icon: "History",
    tagline: "Immutable 21 CFR Part 11 / ISA-95 event log with before/after diffs",
    whatIsItFor:
      "Maintains an immutable, tamper-evident record of all system events, status changes, quality approvals, parameter overrides, and user logins across all 5 plants.",
    businessImpact:
      "Guarantees 100% compliance with ISO 9001, customer audits (Siemens, ABB), and internal cybersecurity governance, providing complete accountability for every shop-floor decision.",
    targetRoles: ["executive", "quality", "plant-manager"],
    keyCapabilities: [
      "Immutable chronological log of all create, update, delete, approve, release, and hold actions",
      "User identity, role, IP address, and exact millisecond timestamp logging",
      "Detailed before/after change deltas showing precise modified values",
      "Search filters by User, Module, Action Type, and Plant code",
      "Exportable compliance logs for external ISO and customer audit reviews",
    ],
    howToUseSteps: [
      { step: 1, title: "Search Audit Events", instruction: "Search by User Name, Entity ID (e.g. WO-2400, QC-05800), or Module name." },
      { step: 2, title: "Filter by Action Type", instruction: "Filter by sensitive actions such as 'approve', 'hold', 'release', or 'reject'." },
      { step: 3, title: "Inspect Change Details", instruction: "Review the 'Details' column and before/after diff to verify why an action was taken." },
      { step: 4, title: "Verify User & IP", instruction: "Confirm which user role and terminal IP performed critical quality status overrides." },
      { step: 5, title: "Export Audit Log", instruction: "Click 'Export Audit Log' to generate a timestamped compliance record for audit dossiers." },
    ],
    keyKPIs: [
      { name: "Audit Trail Completeness", target: "100.0%", description: "Every critical system transaction captured without data loss" },
      { name: "Tamper-Evident Integrity", target: "100.0%", description: "All log entries permanently hashed and read-only" },
    ],
    proTips: [
      "Use the audit trail when investigating why a work order was placed on hold or who authorized an urgent schedule override.",
    ],
    relatedModules: ["quality", "traceability", "documents"],
  },
  {
    id: "customer-portal",
    name: "Customer Portal & OEM Visibility",
    short: "Portal",
    category: "Support",
    icon: "Globe",
    tagline: "Dedicated OEM self-service portal for transformer manufacturers",
    whatIsItFor:
      "A dedicated, transparent client-facing portal enabling Tier-1 transformer manufacturers (Siemens Energy, Toshiba T&D, ABB Power Grids, Hitachi Energy, Schneider Electric, CG Power, Mitsubishi Electric) to track order progress, inspection reports, and dispatch schedules.",
    businessImpact:
      "Eliminates hundreds of manual email/phone status inquiries per month, speeds up customer inspection clearances, and strengthens OEM partnerships.",
    targetRoles: ["executive", "planner", "quality"],
    keyCapabilities: [
      "Customer-specific order book filtering with live percentage progress tracking",
      "Associated end-customer transformer serial numbers and project references",
      "Document readiness checklist (Inspection Test Reports, Galvanizing Certs, Leak Test Logs)",
      "Estimated vs Actual dispatch dates with carrier lorry receipt (LR) details",
      "Self-service download of complete customer compliance documentation packages",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Customer Account", instruction: "Filter by customer (e.g. Siemens Energy, Hitachi Energy, Toshiba T&D) to view their specific order pipeline." },
      { step: 2, title: "Track Production Status", instruction: "Review order states: Confirmed → In-Production → QC-Pending → Ready-to-Ship → Dispatched." },
      { step: 3, title: "Check Document Readiness", instruction: "Verify that all required documentation (MTC, ITR, Hydro Cert) is marked 'Ready'." },
      { step: 4, title: "View Linked Serials", instruction: "Click an order to see the exact radiator unit serial numbers manufactured under that PO." },
      { step: 5, title: "Download Quality Dossier", instruction: "Click 'Download All Reports' to compile the complete customer shipment document package." },
    ],
    keyKPIs: [
      { name: "Customer Order Transparency", target: "100.0%", description: "Real-time order progress accessible to OEM clients 24/7" },
      { name: "Doc Retrieval Self-Service Rate", target: "≥ 90.0%", description: "OEMs accessing test certificates without contacting support" },
    ],
    proTips: [
      "Ensure all inspection reports are uploaded to the quality module as soon as testing passes so the portal updates automatically.",
    ],
    relatedModules: ["dispatch", "traceability", "work-orders"],
  },
  {
    id: "dispatch",
    name: "Dispatch & Logistics Management",
    short: "Dispatch",
    category: "Support",
    icon: "PackageCheck",
    tagline: "Shipment manifests, carrier vehicle tracking, LR numbers & POD",
    whatIsItFor:
      "Manages outbound logistics, packing lists, vehicle loading, Lorry Receipt (LR) tracking, carrier assignments, and Proof of Delivery (POD) for finished radiator and tank consignments.",
    businessImpact:
      "Prevents shipping wrong or incomplete orders, ensures 100% documentation accompanying trucks, and improves On-Time In-Full (OTIF) delivery performance.",
    targetRoles: ["plant-manager", "planner", "executive"],
    keyCapabilities: [
      "Dispatch status tracking: Loading, In-Transit, Delivered, Delayed, Scheduled",
      "Vehicle registration (e.g. MH-46-AR-2041), carrier name, driver details, and LR Number recording",
      "Consignment weight (MT), unit count, and cargo invoice value tracking",
      "Pre-dispatch document verification checklist (E-Way Bill, Tax Invoice, Quality Dossier, Delivery Challan)",
      "Transit progress tracking with ETA and timestamped Proof of Delivery confirmation",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Scheduled Dispatches", instruction: "Check the dispatch queue for consignments scheduled for loading today and this week." },
      { step: 2, title: "Create/Update Manifest", instruction: "Enter vehicle number, carrier name, driver contact, and official Lorry Receipt (LR) number." },
      { step: 3, title: "Verify Shipping Documents", instruction: "Ensure all mandatory documents (Invoice, Packing List, Quality Certificate, E-Way Bill) are verified." },
      { step: 4, title: "Mark Vehicle Dispatched", instruction: "Once loading is complete and the vehicle departs the gate, update status to 'In-Transit'." },
      { step: 5, title: "Confirm Proof of Delivery", instruction: "Upon customer receiving confirmation, update status to 'Delivered' and log delivery timestamp." },
    ],
    keyKPIs: [
      { name: "On-Time In-Full (OTIF)", target: "≥ 95.0%", description: "Shipments delivered on time with 100% correct quantities and documentation" },
      { name: "Vehicle Loading Turnaround", target: "< 90 min", description: "Average duration to inspect, load, and clear a transport vehicle" },
    ],
    proTips: [
      "Never clear a vehicle at the security gate without verifying that the physical radiator serial tags match the shipping manifest exactly.",
    ],
    relatedModules: ["customer-portal", "work-orders", "inventory"],
  },
  {
    id: "calibration",
    name: "Calibration Calendar & Gauges",
    short: "Calibration",
    category: "Quality",
    icon: "CalendarCheck",
    tagline: "Instrument due-dates, calibration certs, accuracy specs & criticality",
    whatIsItFor:
      "Tracks calibration schedules, accuracy tolerances, certificates, and inspection validity for all quality gauges, pressure sensors, vernier calipers, micrometers, pyrometers, and DFT meters.",
    businessImpact:
      "Ensures zero uncalibrated or expired measuring instruments are used on the shop floor, preventing false quality passes and non-compliance during ISO 9001 / customer audits.",
    targetRoles: ["quality", "maintenance", "engineer"],
    keyCapabilities: [
      "Comprehensive gauge registry with unique instrument tags (e.g. CAL-001 to CAL-020)",
      "Color-coded validity status: Valid (Green), Due-Soon (<30 days, Orange), Overdue (Red), In-Progress (Blue)",
      "Criticality classification: Critical (Hydro gauges, DFT meters), Major, Minor",
      "Calibration certificate numbers and external NABL-accredited calibration vendor tracking",
      "Measurement range, accuracy specification, and calibration frequency tracking",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Calibration Calendar", instruction: "Filter instruments by validity status to find gauges marked 'Due-Soon' or 'Overdue'." },
      { step: 2, title: "Quarantine Overdue Gauges", instruction: "Any gauge in 'Overdue' status must be immediately removed from the line and marked 'In-Progress'." },
      { step: 3, title: "Dispatch to Calibration Lab", instruction: "Send instrument to internal metrology or approved external NABL calibration vendor." },
      { step: 4, title: "Record New Certificate", instruction: "Enter newly issued Certificate Number, calibrated date, and calculate the next due date." },
      { step: 5, title: "Re-issue to Shop Floor", instruction: "Mark instrument 'Valid' and return it to its designated plant location (e.g., K1 Bay-2 QC)." },
    ],
    keyKPIs: [
      { name: "Overdue Gauge Count", target: "0 instruments", description: "Zero uncalibrated gauges present on active production lines" },
      { name: "Calibration On-Time Adherence", target: "100.0%", description: "All tools calibrated on or before their scheduled expiration date" },
    ],
    proTips: [
      "Pressure gauges on hydrostatic test rigs must be calibrated every 6 months without exception due to ASME pressure vessel safety rules.",
    ],
    relatedModules: ["quality", "maintenance", "iiot"],
  },
  {
    id: "cost-quality",
    name: "Cost of Quality (PAIF Model)",
    short: "Cost of Q",
    category: "Quality",
    icon: "CircleDollarSign",
    tagline: "Prevention, Appraisal, Internal Failure & External Failure financial analysis",
    whatIsItFor:
      "Applies the classical PAF (Prevention, Appraisal, Internal Failure, External Failure) accounting model to quantify quality expenditures and financial losses across all 5 manufacturing facilities.",
    businessImpact:
      "Translates engineering quality metrics into financial INR Lakhs, demonstrating the ROI of prevention activities (operator training, better tooling) in reducing costly internal scrap and warranty claims.",
    targetRoles: ["executive", "quality", "plant-manager"],
    keyCapabilities: [
      "Categorized cost breakdown: Prevention, Appraisal, Internal Failure, External Failure",
      "Financial impact tracking in INR Lakhs per plant and per fiscal period",
      "Period-over-period percentage cost trend comparisons",
      "Visual cost distribution charts showing Good Costs (Prevention + Appraisal) vs Bad Costs (Failures)",
      "Direct link between shop-floor scrap costs and internal failure ledger",
    ],
    howToUseSteps: [
      { step: 1, title: "Review Total Cost of Quality", instruction: "Inspect total CoQ and check its proportion relative to overall plant production value." },
      { step: 2, title: "Analyze Category Breakdown", instruction: "Compare Good Quality Costs (Prevention & Appraisal) against Bad Quality Costs (Scrap & Rework)." },
      { step: 3, title: "Investigate Internal Failures", instruction: "Examine internal failure line items (e.g. Welding rework, Scrap forming blanks) to identify root expense drivers." },
      { step: 4, title: "Track Month-over-Month Trends", instruction: "Verify that increased prevention spending results in declining failure costs over time." },
      { step: 5, title: "Export Financial Report", instruction: "Download the monthly Cost of Quality summary for executive and finance committee reviews." },
    ],
    keyKPIs: [
      { name: "Total CoQ as % of Sales", target: "< 2.5%", description: "Total quality cost kept well below 2.5% of gross plant turnover" },
      { name: "Failure Cost Reduction", target: "≥ 15% YoY", description: "Continuous annual decline in internal scrap and external warranty costs" },
      { name: "Prevention-to-Failure Ratio", target: "> 1.5", description: "Spending more on preventive controls than fixing downstream defects" },
    ],
    proTips: [
      "Every rupee spent on automated weld parameter monitoring (Prevention) saves an estimated 7 rupees in leak rework (Internal Failure).",
    ],
    relatedModules: ["quality", "root-cause", "overview"],
  },
  {
    id: "root-cause",
    name: "Root Cause Analysis (5-Whys & Fishbone)",
    short: "Root Cause",
    category: "Quality",
    icon: "GitFork",
    tagline: "Structured 5-Whys problem solving, Ishikawa fishbone & CAPA validation",
    whatIsItFor:
      "A structured problem-solving module implementing the 5-Whys and Ishikawa (Fishbone) methodologies to investigate significant manufacturing non-conformances and prevent recurrence.",
    businessImpact:
      "Eliminates repeat defects by forcing cross-functional teams to identify the true systemic root cause rather than applying temporary symptom band-aids.",
    targetRoles: ["quality", "engineer", "plant-manager"],
    keyCapabilities: [
      "Interactive sequential 5-Whys question-and-answer tree builder",
      "Direct linkage to parent Non-Conformance Reports (NCR) and affected serials",
      "Cross-functional team logging (Facilitator, Quality, Production, Maintenance participants)",
      "Corrective & Preventive Action (CAPA) definitions with assigned owners and due dates",
      "CAPA Effectiveness verification rating (Effective, Ineffective, Pending)",
    ],
    howToUseSteps: [
      { step: 1, title: "Select or Create RCA Case", instruction: "Open an RCA case linked to a high-severity NCR (e.g. RCA-001 Galvanizing DFT Drift)." },
      { step: 2, title: "Document the Problem Statement", instruction: "State the specific failure mode clearly with quantifiable data (e.g. 5 batches trending <70 µm)." },
      { step: 3, title: "Build the 5-Why Tree", instruction: "Work down the 5-Why chain: Why did it happen? → Why was it not detected? → Why did the system allow it?" },
      { step: 4, title: "Formulate Permanent CAPA", instruction: "Define permanent corrective actions (fix current issue) and preventive actions (prevent all future occurrences)." },
      { step: 5, title: "Verify Effectiveness", instruction: "After 30 days of production, audit post-remedy quality data and mark the RCA 'Verified Effective'." },
    ],
    keyKPIs: [
      { name: "Repeat Defect Recurrence Rate", target: "0.0%", description: "Zero recurrence of defects resolved through verified RCA cases" },
      { name: "RCA Investigation Speed", target: "< 7 days", description: "Full 5-Why analysis completed within one week of NCR creation" },
      { name: "CAPA Effectiveness Rate", target: "≥ 95.0%", description: "Percentage of preventive actions verified effective upon follow-up audit" },
    ],
    proTips: [
      "Involve machine operators in the 5-Why session: shop-floor operators usually know the physical reason a process drifted.",
    ],
    relatedModules: ["quality", "cost-quality", "audit-trail"],
  },
  {
    id: "forecast",
    name: "Production Forecast & Scenario Modeling",
    short: "Forecast",
    category: "Intelligence",
    icon: "TrendingUp",
    tagline: "What-if scenario modeling, machine capacity limits & risk simulation",
    whatIsItFor:
      "Simulates future production output, capacity constraints, and supply chain risks over 14-day, 30-day, and 90-day horizons under different demand and operational scenarios.",
    businessImpact:
      "Enables plant management to anticipate capacity shortfalls weeks in advance, make data-driven overtime/shift decisions, and commit confidently to large export orders.",
    targetRoles: ["planner", "plant-manager", "executive"],
    keyCapabilities: [
      "Multi-scenario modeling: Baseline Forecast, High Demand Surge (+25%), Supply Chain Disruption",
      "Planned vs Projected vs Maximum Rated Capacity trend curves",
      "Confidence rating (%) based on historical machine OEE and material lead times",
      "Assumptions and Risk Register with Impact (High/Med/Low) and Probability ratings",
      "Capacity deficit warning flags when projected demand exceeds maximum plant throughput",
    ],
    howToUseSteps: [
      { step: 1, title: "Select Forecast Scenario", instruction: "Choose a scenario (e.g. 'Baseline Q3 Demand' or 'High Surge Scenario') from the selector." },
      { step: 2, title: "Inspect Daily Output Curves", instruction: "Compare the 'Projected Output' line against the horizontal 'Rated Capacity' ceiling." },
      { step: 3, title: "Identify Capacity Gaps", instruction: "Look for dates where the projected demand curve crosses above rated machine capacity." },
      { step: 4, title: "Review Risk Matrix", instruction: "Assess critical risks (e.g. Zinc raw material price spike or key welder absenteeism) and their impact." },
      { step: 5, title: "Execute Capacity Mitigation", instruction: "Adjust work center schedules or plan overtime shifts in the Planning module to resolve capacity deficits." },
    ],
    keyKPIs: [
      { name: "Forecast Accuracy (MAPE)", target: "≥ 92.0%", description: "Mean Absolute Percentage Error between projected and actual monthly output" },
      { name: "Capacity Feasibility Ratio", target: "100.0%", description: "All accepted customer orders validated against available machine hours" },
    ],
    proTips: [
      "Run a 'Supply Disruption' what-if scenario whenever steel mill delivery lead times increase by more than 10 days.",
    ],
    relatedModules: ["planning", "overview", "wip-aging"],
  },
  {
    id: "wip-aging",
    name: "WIP Aging & Shop-Floor Kanban",
    short: "WIP Aging",
    category: "Operations",
    icon: "Hourglass",
    tagline: "WIP dwell time heatmaps, aging risk buckets & Kanban queue flow",
    whatIsItFor:
      "Monitors Work-in-Progress (WIP) dwell times across all manufacturing stages, categorizing in-process batches into age buckets to prevent parts from sitting idle on the shop floor.",
    businessImpact:
      "Reduces total manufacturing lead time by 28%, prevents rusting/corrosion of semi-finished steel parts, and enforces smooth First-In-First-Out (FIFO) production flow.",
    targetRoles: ["supervisor", "plant-manager", "planner"],
    keyCapabilities: [
      "WIP Age categorization: Fresh (<12h, Green), Normal (12-24h, Blue), Aging (24-48h, Yellow), Stale (48-72h, Orange), Critical (>72h, Red)",
      "Stage dwell time breakdown (Blanking, Forming, Welding, Hydro Test, Galvanizing, Painting)",
      "Bottleneck reason tagging (e.g., 'Waiting for Hydro Test Rig', 'Pending Quality Clearance')",
      "Interactive Kanban queue view with stage-by-stage card drag-and-drop",
      "High-risk aging alert triggers sent directly to shift supervisors",
    ],
    howToUseSteps: [
      { step: 1, title: "Check Aging Distribution", instruction: "Review the age breakdown bar; ensure zero WIP items fall into the red 'Critical >72h' bucket." },
      { step: 2, title: "Switch to Kanban View", instruction: "Switch between Table View and Kanban Board to see batch cards queued at each stage." },
      { step: 3, title: "Filter for Stale/Critical WIP", instruction: "Filter for items in 'Aging' or 'Stale' status to investigate why parts are delayed." },
      { step: 4, title: "Inspect Bottleneck Reasons", instruction: "Check the bottleneck note (e.g. 'Waiting for paint color changeover') and clear the constraint." },
      { step: 5, title: "Expedite Delayed Batches", instruction: "Re-prioritize stagnant batches in the planning schedule to restore FIFO line flow." },
    ],
    keyKPIs: [
      { name: "Average WIP Dwell Time", target: "< 18.0 hrs", description: "Average hours a semi-finished unit spends waiting between active machine steps" },
      { name: "Critical WIP Items (>72h)", target: "0 items", description: "Zero parts stagnating on shop-floor buffer areas for over 3 days" },
      { name: "WIP Turn Rate", target: "≥ 8.5 turns/mo", description: "Speed of converting raw steel inventory into finished, tested radiators" },
    ],
    proTips: [
      "Raw formed fins should not sit un-welded for more than 24 hours in humid weather to avoid micro-corrosion before galvanizing.",
    ],
    relatedModules: ["work-orders", "line-simulator", "planning", "inventory"],
  },
  {
    id: "dashboards",
    name: "Role Dashboards & Central Notifications",
    short: "Dashboards",
    category: "Intelligence",
    icon: "Bell",
    tagline: "Role-customized cockpits, real-time alert triage & system status",
    whatIsItFor:
      "Provides tailored role-specific dashboards (Executive, Plant Manager, Planner, Supervisor, Quality, Operator, Maintenance, Engineer) combined with a centralized notification broadcast center.",
    businessImpact:
      "Ensures every user from operator to executive sees exactly the information relevant to their operational domain, eliminating information overload and accelerating decision making.",
    targetRoles: ["executive", "plant-manager", "planner", "supervisor", "quality", "operator", "maintenance", "engineer"],
    keyCapabilities: [
      "8 Role-customized views with domain-tailored KPI focuses and quick action shortcuts",
      "Central Notification Drawer with one-click acknowledgment for Critical, Warning, and Info alerts",
      "Direct jump links from alert cards to the offending machine or work order",
      "Pinned KPI customization allowing users to bookmark their top metrics",
      "System health and database connectivity status indicators",
    ],
    howToUseSteps: [
      { step: 1, title: "Switch Role Profile", instruction: "Use the Role dropdown in the Topbar to switch between Executive, Plant Manager, Quality, Operator, etc." },
      { step: 2, title: "Review Role Focus KPIs", instruction: "Notice how the KPI priority shifts dynamically (e.g. Quality Engineer sees FPY and NCRs; Maintenance sees MTBF/MTTR)." },
      { step: 3, title: "Triage Active Alerts", instruction: "Click the Notification Bell in the Topbar to open the drawer; review and acknowledge pending alarms." },
      { step: 4, title: "Use Quick Action Buttons", instruction: "Click role quick action buttons (e.g. 'Log Breakdown', 'Raise NCR', 'Line Sim') to execute daily tasks fast." },
      { step: 5, title: "Customize Favorites", instruction: "Click the star icon next to frequently used modules in the sidebar to pin them for instant access." },
    ],
    keyKPIs: [
      { name: "Alert Triage Speed", target: "< 3 minutes", description: "Average time from alert generation to supervisor acknowledgment" },
      { name: "Role Adoption Rate", target: "100.0%", description: "Active daily engagement by personnel across all 8 organizational roles" },
    ],
    proTips: [
      "Switch to 'Compact' display density from settings if you work on a smaller laptop screen to fit more data onto the screen.",
    ],
    relatedModules: ["overview", "operator-terminal", "andon"],
  },
  {
    id: "features-guide",
    name: "Features & User Guide Center",
    short: "User Guide",
    category: "Help",
    icon: "HelpCircle",
    tagline: "Comprehensive documentation, operational workflows & best practices",
    whatIsItFor:
      "A complete, interactive in-app guide and training reference covering every feature, role responsibility, operational workflow, and KPI across the Hi-Tech MES platform.",
    businessImpact:
      "Accelerates onboarding of new engineers and operators, reduces operational mistakes, and serves as an audit-ready standard operating reference for management.",
    targetRoles: ["executive", "plant-manager", "planner", "supervisor", "quality", "operator", "maintenance", "engineer"],
    keyCapabilities: [
      "Searchable catalog of all 26 MES modules with instant keyword filtering",
      "Category tabs: Operations, Quality, Shop Floor, Support, Intelligence, and All Modules",
      "Structured documentation for each module: Business Purpose, Key Capabilities, Step-by-Step How-to-Use, KPIs, Pro Tips",
      "Role-based cheat sheet detailing which modules apply to which employee persona",
      "One-click 'Launch Module' and 'Try Feature' direct navigation buttons",
    ],
    howToUseSteps: [
      { step: 1, title: "Browse or Search", instruction: "Use the search bar to find any feature (e.g. 'Gantt', '5-Why', 'Scrap', 'Hydro Test', 'WPS') or filter by category." },
      { step: 2, title: "Select Module Card", instruction: "Click any module card to inspect its full operational guide, business context, and step-by-step instructions." },
      { step: 3, title: "Review Step-by-Step Workflow", instruction: "Follow the numbered operational steps to learn how to execute tasks correctly in the software." },
      { step: 4, title: "Check Role Fit & KPIs", instruction: "Review target roles and KPI benchmark definitions to understand operational expectations." },
      { step: 5, title: "Jump Directly to Module", instruction: "Click 'Open Module in App' to immediately navigate to that screen and apply what you learned." },
    ],
    keyKPIs: [
      { name: "User Onboarding Time", target: "< 2 days", description: "Time required for new shop-floor staff to achieve proficiency in digital MES execution" },
      { name: "Operational Error Rate", target: "< 0.1%", description: "Minimal user errors during digital job card and inspection data logging" },
    ],
    proTips: [
      "You can open the contextual guide for any active screen at any time by clicking the 'Feature Guide' button on the module header.",
    ],
    relatedModules: ["overview", "dashboards", "documents"],
  },
];
