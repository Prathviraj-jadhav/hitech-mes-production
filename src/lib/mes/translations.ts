import type { Language } from "./store";

type TranslationKey = 
  | "plant_andon" | "live_metrics" | "safety_status" | "oee" 
  | "quality_yield" | "wip" | "alerts" | "good_parts" 
  | "defects" | "shift_target" | "operator_terminal" 
  | "scan_barcode" | "start_job" | "report_scrap" 
  | "call_maintenance" | "view_sop" | "active_work_order"
  | "status_running" | "status_down" | "status_setup";

type TranslationMap = Record<TranslationKey, string>;

export const TRANSLATIONS: Record<Language, TranslationMap> = {
  en: {
    plant_andon: "Plant Andon Display",
    live_metrics: "Live Metrics",
    safety_status: "Safety Status",
    oee: "OEE",
    quality_yield: "Quality Yield",
    wip: "WIP",
    alerts: "Alerts",
    good_parts: "Good Parts",
    defects: "Defects",
    shift_target: "Shift Target",
    operator_terminal: "Operator Terminal",
    scan_barcode: "Scan Barcode",
    start_job: "Start Job",
    report_scrap: "Report Scrap",
    call_maintenance: "Call Maintenance",
    view_sop: "View SOP",
    active_work_order: "Active Work Order",
    status_running: "Running",
    status_down: "Down",
    status_setup: "Setup"
  },
  hi: {
    plant_andon: "प्लांट एंडॉन डिस्प्ले",
    live_metrics: "लाइव मेट्रिक्स",
    safety_status: "सुरक्षा स्थिति",
    oee: "ओ.ई.ई (OEE)",
    quality_yield: "गुणवत्ता उपज",
    wip: "कार्य प्रगति पर (WIP)",
    alerts: "चेतावनी",
    good_parts: "सही पार्ट्स",
    defects: "खराब पार्ट्स",
    shift_target: "शिफ्ट लक्ष्य",
    operator_terminal: "ऑपरेटर टर्मिनल",
    scan_barcode: "बारकोड स्कैन करें",
    start_job: "काम शुरू करें",
    report_scrap: "स्क्रैप रिपोर्ट करें",
    call_maintenance: "रखरखाव बुलाएं",
    view_sop: "SOP देखें",
    active_work_order: "सक्रिय वर्क ऑर्डर",
    status_running: "चालू है",
    status_down: "बंद है",
    status_setup: "सेटअप"
  },
  mr: {
    plant_andon: "प्लांट अंडन डिस्प्ले",
    live_metrics: "थेट मेट्रिक्स",
    safety_status: "सुरक्षा स्थिती",
    oee: "ओ.ई.ई (OEE)",
    quality_yield: "गुणवत्ता उत्पन्न",
    wip: "प्रगतीपथावर काम (WIP)",
    alerts: "सतर्कता",
    good_parts: "चांगले भाग",
    defects: "दोषपूर्ण भाग",
    shift_target: "शिफ्टचे लक्ष्य",
    operator_terminal: "ऑपरेटर टर्मिनल",
    scan_barcode: "बारकोड स्कॅन करा",
    start_job: "काम सुरू करा",
    report_scrap: "स्क्रॅप नोंदवा",
    call_maintenance: "देखभाल विभागाला बोलवा",
    view_sop: "SOP पहा",
    active_work_order: "सक्रिय वर्क ऑर्डर",
    status_running: "चालू आहे",
    status_down: "बंद आहे",
    status_setup: "सेटअप"
  }
};

export function useTranslation(lang: Language) {
  return (key: TranslationKey) => TRANSLATIONS[lang][key];
}
