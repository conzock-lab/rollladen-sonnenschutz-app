import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Copy,
  Database,
  Download,
  Euro,
  FileText,
  GraduationCap,
  Hammer,
  HardHat,
  HelpCircle,
  Home,
  Layers,
  MessageSquareText,
  PackageSearch,
  PenTool,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Upload,
  UserRound,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import Card from "./components/Card";
import SectionTitle from "./components/SectionHeader";
import { Field, LoginField, TextArea } from "./components/Field";
import StatusBadge from "./components/StatusBadge";
import MiniCheck, { Badge } from "./components/CheckItem";
import CopyBox from "./components/CopyBox";
import useOnlineStatus from "./hooks/useOnlineStatus";
import useAutoSync from "./hooks/useAutoSync";
import useLocalStorage, { loadJson, saveJson } from "./hooks/useLocalStorage";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { enqueueSyncItem, ensureRetryQueued, markQueueSynced as markQueueItemsSynced, queueLocalChange as replaceLocalChange } from "./lib/syncQueue";
import { buildPdfPreview, createPdfFileName } from "./lib/pdfHelpers";
import { buildPartRequestText, createEmptyPartRequest, PART_PHOTO_REQUIREMENTS } from "./lib/partsHelpers";
import { productTypes, checklistTemplates, dynamicChecklistRules, measurementRequiredFields } from "./data/products";
import { allManufacturers } from "./data/manufacturers";
import { allDiagnosisTrees, allPartCatalog } from "./data/diagnosis";
import { reportActivityTemplates, reportLearningFields, reportTechnicalTerms, quizCards, sketchCards, azubiLearningModules, allQuizCards, expandedLearningModules, learningModules, isLearningModuleComplete } from "./data/learningModules";
import { roles, roleHomeConfig, teamRoleOptions } from "./data/rights";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import WorkflowPage from "./pages/WorkflowPage";
import CloseOrderPage from "./pages/CloseOrderPage";
import PdfExportPage from "./pages/PdfExportPage";
import SketchesPage from "./pages/SketchesPage";
import LearningPage from "./pages/LearningPage";
import RightsPage from "./pages/RightsPage";
import CompanyTeamPage from "./pages/CompanyTeamPage";
import MaintenancePage from "./pages/MaintenancePage";
import NormsPage from "./pages/NormsPage";
import PartsPage from "./pages/PartsPage";
import ManufacturersPage from "./pages/ManufacturersPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import MotorsPage from "./pages/MotorsPage";
import SubstratesPage from "./pages/SubstratesPage";
import ToolsPage from "./pages/ToolsPage";
import ProductLexiconPage from "./pages/ProductLexiconPage";
import CustomerPortalPage from "./pages/CustomerPortalPage";

const todayIso = () => new Date().toISOString().slice(0, 10);

function withTimeout(promise, timeoutMs = 15000) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error("Cloud-Anfrage hat zu lange gedauert.")), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}
function useDeviceLayout() {
  const [device, setDevice] = useState({ type: "desktop", isMobile: false, isTablet: false, isDesktop: true, isTouch: false });
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setDevice({ type: width < 768 ? "mobile" : width < 1180 ? "tablet" : "desktop", isMobile: width < 768, isTablet: width >= 768 && width < 1180, isDesktop: width >= 1180, isTouch });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  return device;
}


const navItems = [
  { id: "dashboard", label: "Start", icon: Home, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero", "kunde"] },
  { id: "today", label: "Heute", icon: ClipboardList, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "orders", label: "AuftrÃ¤ge", icon: BriefcaseBusiness, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "workflow", label: "Workflow", icon: ClipboardList, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "closeOrder", label: "Abschluss", icon: CheckCircle2, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "products", label: "Produkte", icon: Sun, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "checklists", label: "Checklisten", icon: ClipboardCheck, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "tools", label: "Werkzeug", icon: Hammer, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "substrates", label: "Untergrund", icon: HardHat, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "motors", label: "Motoren", icon: Zap, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "diagnose", label: "Diagnose", icon: HelpCircle, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "manufacturers", label: "Hersteller", icon: Database, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "measurement", label: "AufmaÃŸ", icon: Wrench, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "offers", label: "Angebot", icon: Euro, roles: ["meister", "buero"] },
  { id: "photos", label: "Foto-KI", icon: Camera, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "parts", label: "Ersatzteile", icon: PackageSearch, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "customers", label: "Kunden", icon: MessageSquareText, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "portal", label: "Kundenportal", icon: Home, roles: ["kunde", "meister", "buero"] },
  { id: "maintenance", label: "Wartung", icon: RefreshCw, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "learning", label: "Lernen", icon: GraduationCap, roles: ["azubi", "meister", "buero"] },
  { id: "azubiPlan", label: "Azubi-Plan", icon: GraduationCap, roles: ["azubi", "meister"] },
  { id: "knowledge", label: "Skizzen", icon: Layers, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "reportBook", label: "Berichtsheft", icon: BookOpen, roles: ["azubi", "meister"] },
  { id: "safety", label: "Warnsystem", icon: AlertTriangle, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "norms", label: "Normen", icon: ShieldCheck, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "pdf", label: "PDF Export", icon: Download, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "rights", label: "Rechte", icon: Settings, roles: ["meister", "buero"] },
  { id: "company", label: "Firma & Team", icon: UserRound, roles: ["meister", "buero"] },
  { id: "planning", label: "Baustellenplanung", icon: BriefcaseBusiness, roles: ["meister", "buero", "vorarbeiter"] },
  { id: "notes", label: "Notizen", icon: Star, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "ki", label: "KI", icon: Sparkles, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
];



const pdfTemplateDefinitions = {
  "Montageprotokoll": {
    title: "Montageprotokoll",
    description: "FÃ¼r Montageabschluss, FunktionsprÃ¼fung, Kundeneinweisung und offene Punkte.",
    fields: [
      { key: "monteur", label: "Monteur / Vorarbeiter", type: "text", auto: "assignedTo", placeholder: "z. B. Max Mustermann" },
      { key: "montageDate", label: "Montagedatum", type: "date", auto: "date" },
      { key: "startTime", label: "Beginn", type: "time", auto: "time" },
      { key: "endTime", label: "Ende", type: "time", placeholder: "z. B. 15:30" },
      { key: "weather", label: "Wetter / Baustellensituation", type: "text", placeholder: "z. B. trocken, windstill, Zugang frei" },
      { key: "workDone", label: "DurchgefÃ¼hrte Arbeiten", type: "textarea", auto: "workDone", placeholder: "Montage, Befestigung, Einstellung, FunktionsprÃ¼fung ..." },
      { key: "functionTest", label: "FunktionsprÃ¼fung", type: "select", options: ["ohne Mangel", "mit Hinweis", "nicht mÃ¶glich"] },
      { key: "customerInstruction", label: "Kundeneinweisung", type: "select", options: ["durchgefÃ¼hrt", "nicht anwesend", "noch offen"] },
      { key: "openIssues", label: "Offene Punkte / MÃ¤ngel", type: "textarea", placeholder: "z. B. Ersatzteil nachbestellen, Silikonfuge nachziehen ..." },
      { key: "signatures", label: "Unterschriften", type: "text", placeholder: "Monteur / Kunde" },
    ],
  },
  "AufmaÃŸblatt": {
    title: "AufmaÃŸblatt",
    description: "FÃ¼r Produktdaten, MaÃŸe, Einbausituation, Untergrund und Bestellinformationen.",
    fields: [
      { key: "measuredBy", label: "AufmaÃŸ aufgenommen von", type: "text", auto: "assignedTo", placeholder: "z. B. Max Mustermann" },
      { key: "measurementDate", label: "AufmaÃŸdatum", type: "date", auto: "date" },
      { key: "width", label: "Breite", type: "text", auto: "width", placeholder: "z. B. 1200 mm" },
      { key: "height", label: "HÃ¶he", type: "text", auto: "height", placeholder: "z. B. 1400 mm" },
      { key: "installation", label: "Einbausituation", type: "text", auto: "installType", placeholder: "z. B. Renovierung / Neubau / Laibung" },
      { key: "operationSide", label: "Bedienseite / Motorseite", type: "text", placeholder: "links / rechts" },
      { key: "color", label: "Farbe / OberflÃ¤che", type: "text", placeholder: "z. B. weiÃŸ, anthrazit, RAL ..." },
      { key: "cableExit", label: "Kabelauslass / Strom", type: "text", placeholder: "z. B. links oben vorhanden" },
      { key: "specialNotes", label: "Besonderheiten", type: "textarea", placeholder: "SchrÃ¤ge Laibung, WDVS, alte Anlage, Zugang, GerÃ¼st ..." },
    ],
  },
  "Wartungsprotokoll": {
    title: "Wartungsprotokoll",
    description: "FÃ¼r Zustand, Reinigung, PrÃ¼fung, MÃ¤ngel und nÃ¤chste Wartung.",
    fields: [
      { key: "maintenanceBy", label: "Wartung durchgefÃ¼hrt von", type: "text", auto: "assignedTo", placeholder: "z. B. Max Mustermann" },
      { key: "maintenanceDate", label: "Wartungsdatum", type: "date", auto: "date" },
      { key: "condition", label: "Anlagenzustand", type: "select", options: ["gut", "gebraucht", "mangelhaft", "defekt"] },
      { key: "cleaning", label: "Reinigung", type: "select", options: ["durchgefÃ¼hrt", "teilweise durchgefÃ¼hrt", "nicht erforderlich", "nicht mÃ¶glich"] },
      { key: "checkedParts", label: "GeprÃ¼fte Bauteile", type: "textarea", auto: "checkedParts", placeholder: "FÃ¼hrungsschienen, Panzer, Endlagen, Motor, Sensorik ..." },
      { key: "defects", label: "Festgestellte MÃ¤ngel", type: "textarea", placeholder: "Keine MÃ¤ngel / MÃ¤ngel eintragen ..." },
      { key: "recommendation", label: "Empfehlung", type: "textarea", placeholder: "z. B. Ersatzteil tauschen, jÃ¤hrliche Wartung, Reinigung ..." },
      { key: "nextMaintenance", label: "NÃ¤chste Wartung", type: "text", placeholder: "z. B. in 12 Monaten" },
    ],
  },
  "KundenÃ¼bergabe": {
    title: "KundenÃ¼bergabe",
    description: "FÃ¼r Bedienhinweise, Pflege, Sicherheit, Ãœbergabe und BestÃ¤tigung durch den Kunden.",
    fields: [
      { key: "handoverTo", label: "Ãœbergabe an", type: "text", auto: "customer", placeholder: "z. B. Herr/Frau Mustermann" },
      { key: "handoverDate", label: "Ãœbergabedatum", type: "date", auto: "date" },
      { key: "operationExplained", label: "Bedienung erklÃ¤rt", type: "select", options: ["ja", "teilweise", "nein"] },
      { key: "careExplained", label: "Pflegehinweise erklÃ¤rt", type: "select", options: ["ja", "teilweise", "nein"] },
      { key: "safetyExplained", label: "Sicherheits-/Windhinweise erklÃ¤rt", type: "select", options: ["ja", "teilweise", "nein"] },
      { key: "documents", label: "Ãœbergebene Unterlagen", type: "textarea", placeholder: "Bedienungsanleitung, Pflegehinweise, Angebot, Protokoll ..." },
      { key: "customerQuestions", label: "Fragen / Hinweise Kunde", type: "textarea", placeholder: "Fragen oder WÃ¼nsche des Kunden ..." },
      { key: "handoverResult", label: "Ãœbergabe-Ergebnis", type: "select", options: ["ohne Beanstandung", "mit Hinweis", "Nacharbeit erforderlich"] },
    ],
  },
  "Angebotsentwurf": {
    title: "Angebotsentwurf",
    description: "FÃ¼r Leistung, Positionen, Preise, GÃ¼ltigkeit und Hinweise vor Versand.",
    fields: [
      { key: "offerDate", label: "Angebotsdatum", type: "date", auto: "today" },
      { key: "validUntil", label: "GÃ¼ltig bis", type: "text", placeholder: "z. B. 14 Tage" },
      { key: "service", label: "Leistungsbeschreibung", type: "textarea", auto: "offerService", placeholder: "Lieferung und Montage ..." },
      { key: "material", label: "Material netto", type: "number", auto: "material" },
      { key: "labor", label: "Arbeitszeit / Lohn", type: "text", auto: "labor" },
      { key: "travel", label: "Anfahrt netto", type: "number", auto: "travel" },
      { key: "totalNet", label: "Gesamt netto", type: "number", auto: "net" },
      { key: "offerNotes", label: "Zusatzhinweise", type: "textarea", placeholder: "UntergrundprÃ¼fung, Stromanschluss, Lieferzeit, Herstellerangaben ..." },
    ],
  },
  "Berichtsheft-Eintrag": {
    title: "Berichtsheft-Eintrag",
    description: "FÃ¼r Tages-/Wochenbericht, Lernfeld, Ausbildungsjahr und Meister-Kommentar.",
    fields: [
      { key: "reportMode", label: "Berichtsart", type: "select", options: ["Tagesbericht", "Wochenbericht"] },
      { key: "reportYear", label: "Ausbildungsjahr", type: "select", options: ["1", "2", "3"] },
      { key: "learningField", label: "Lernfeld", type: "text", auto: "learningField" },
      { key: "reportText", label: "Berichtstext", type: "textarea", auto: "reportProposal" },
      { key: "reportStatus", label: "Status", type: "select", options: ["Entwurf", "Zur PrÃ¼fung", "Ã„nderung nÃ¶tig", "Freigegeben"] },
      { key: "masterComment", label: "Meister-Kommentar", type: "textarea", auto: "masterComment" },
    ],
  },
};

const customerTemplates = [
  { title: "TerminbestÃ¤tigung", text: "Hallo {kunde}, wir bestÃ¤tigen den Montagetermin fÃ¼r {produkt}. Termin: {termin}. Adresse: {adresse}. Bitte sorgen Sie dafÃ¼r, dass der Montagebereich frei zugÃ¤nglich ist." },
  { title: "Montagevorbereitung", text: "Hallo {kunde}, bitte rÃ¤umen Sie den Bereich fÃ¼r {produkt} vor dem Termin frei. Termin: {termin}." },
  { title: "Bedenkenhinweis Untergrund", text: "Hallo {kunde}, bei Ihrem Auftrag {ß´æÚ$z{-®éÜj×6†V6´'WGFöã×¶6†V6´'WGFöçÒFVÆWFU6¶WF6ƒ×¶FVÆWFU6¶WF6…&V6÷&GÒ÷&FW'3×·f—6–&ÆT÷&FW'7Ò6fU6¶WF6ƒ×·6fU6¶WF6…&V6÷&GÒ6fVE6¶WF6†W3×´'&’æ—4'&’‡6fVE6¶WF6†W2’ò6fVE6¶WF6†W2¢µ×Ò6VÆV7FVD÷&FW$–C×·6VÆV7FVD÷&FW#òæ–BÇÂ6VÆV7FVD÷&FW$–GÒ6WE6¶WF6„–ÖvS×·6WE6¶WF6„–ÖvWÒ6†÷tæ÷F–6S×·6†÷tæ÷F–6WÒ6¶WF6„–ÖvS×·6¶WF6„–ÖvWÒóâ—Ğ¢¶7F—fRÓÓÒ'&W÷'D&öö²"bb67&VVâƒÆF—b6Æ74æÖSÒ'76R×’ÓR#ãÄ6&CãÅ6V7F–öåF—FÆR–6öã×´&öö´÷VçÒF—FÆSÒ$&W&–6‡G6†VgBÔgVæ·F–öæVâ"7V'F—FÆSÒ%FvW2Òõvö6†Væ&W&–6‡BÂf÷&ÆvRÂ6†V6¶Æ—7FVì;Æ&W&æ†ÖRÂf÷FòÔæ÷F—¢Â7FGW2ôg&V–v&RÂW&–ææW'VærÂ7V–6†W&âVæBW‡÷'Bâ"óãÆF—b6Æ74æÖSÒ&w&–BvÓR†Ã¦w&–BÖ6öÇ2Õ³ã–g%óãg%Ò#ãÆF—b6Æ74æÖSÒ'76R×’ÓB#ãÆF—b6Æ74æÖSÒ&w&–BvÓ2ÖC¦w&–BÖ6öÇ2Ó"#ãÆÆ&VÂ6Æ74æÖSÒ&&Æö6²&÷VæFVBÓ'†Â&r×6ÆFRÓSÓBFW‡B×6ÒföçBÖ&öÆB#ä&W&–6‡G6'CÇ6VÆV7BfÇVS×·&W÷'DÖöFWÒöä6†ævS×²†R’Óâ6WE&W÷'DÖöFR†RçF&vWBçfÇVR—Ò6Æ74æÖSÒ&×BÓ"rÖgVÆÂ&÷VæFVB×†Â&÷&FW"&÷&FW"×6ÆFRÓ#&r×v†—FR‚Ó2’Ó2#ãÆ÷F–öãåFvW6&W&–6‡CÂö÷F–öããÆ÷F–öãåvö6†Væ&W&–6‡CÂö÷F–öããÂ÷6VÆV7CãÂöÆ&VÃãÆÆ&VÂ6Æ74æÖSÒ&&Æö6²&÷VæFVBÓ'†Â&r×6ÆFRÓSÓBFW‡B×6ÒföçBÖ&öÆB#äW6&–ÆGVæw6¦‡#Ç6VÆV7BfÇVS×·&W÷'E–V'Òöä6†ævS×²†R’Óâ6WE&W÷'E–V"†RçF&vWBçfÇVR—Ò6Æ74æÖSÒ&×BÓ"rÖgVÆÂ&÷VæFVB×†Â&÷&FW"&÷&FW"×6ÆFRÓ#&r×v†—FR‚Ó2’Ó2#ãÆ÷F–öâfÇVSÒ##ãâW6&–ÆGVæw6¦‡#Âö÷F–öããÆ÷F–öâfÇVSÒ#"#ã"âW6&–ÆGVæw6¦‡#Âö÷F–öããÆ÷F–öâfÇVSÒ#2#ã2âW6&–ÆGVæw6¦‡#Âö÷F–öããÂ÷6VÆV7CãÂöÆ&VÃãÆÆ&VÂ6Æ74æÖSÒ&&Æö6²&÷VæFVBÓ'†Â&r×6ÆFRÓSÓBFW‡B×6ÒföçBÖ&öÆB#äÆW&æfVÆCÇ6VÆV7BfÇVS×·&W÷'DÆV&æ–ætf–VÆGÒöä6†ævS×²†R’Óâ6WE&W÷'DÆV&æ–ætf–VÆB†RçF&vWBçfÇVR—Ò6Æ74æÖSÒ&×BÓ"rÖgVÆÂ&÷VæFVB×†Â&÷&FW"&÷&FW"×6ÆFRÓ#&r×v†—FR‚Ó2’Ó2#ç·&W÷'DÆV&æ–ætf–VÆG2æÖ‚†f–VÆB’ÓâÆ÷F–öâ¶W“×¶f–VÆGÓç¶f–VÆGÓÂö÷F–öãâ—ÓÂ÷6VÆV7CãÂöÆ&VÃãÆÆ&VÂ6Æ74æÖSÒ&&Æö6²&÷VæFVBÓ'†Â&r×6ÆFRÓSÓBFW‡B×6ÒföçBÖ&öÆB#åL:GF–v¶V—G2Õf÷&ÆvSÇ6VÆV7BfÇVS×·&W÷'EFV×ÆFT–GÒöä6†ævS×²†R’Óâ6WE&W÷'EFV×ÆFT–B†RçF&vWBçfÇVR—Ò6Æ74æÖSÒ&×BÓ"rÖgVÆÂ&÷VæFVB×†Â&÷&FW"&÷&FW"×6ÆFRÓ#&r×v†—FR‚Ó2’Ó2#ç·&W÷'D7F—f—G•FV×ÆFW2æÖ‚‡FV×ÆFR’ÓâÆ÷F–öâ¶W“×·FV×ÆFRæ–GÒfÇVS×·FV×ÆFRæ–GÓç·FV×ÆFRæÆ&VÇÓÂö÷F–öãâ—ÓÂ÷6VÆV7CãÂöÆ&VÃãÂöF—cãÆF—b6Æ74æÖSÒ&w&–BvÓ2ÖC¦w&–BÖ6öÇ2Ó2#ãÆ'WGFöâöä6Æ–6³×¶Ç•&W÷'EFV×ÆFWÒ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×6ÆFRÓ“S‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×v†—FR#åf÷&ÆvR;Æ&W&æV†ÖVãÂö'WGFöããÆ'WGFöâöä6Æ–6³×¶–×÷'D6†V6¶Æ—7D–çFõ&W÷'GÒ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&rÖVÖW&ÆBÓ‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡BÖVÖW&ÆBÓƒ#ä6†V6¶Æ—7FR;Æ&W&æV†ÖVãÂö'WGFöããÆ'WGFöâöä6Æ–6³×¶FE†÷Fôæ÷FUFõ&W÷'GÒ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×6·’Ó‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×6·’Óƒ#äf÷FòÔæ÷F—¢V–æl;ÆvVãÂö'WGFöããÆ'WGFöâöä6Æ–6³×¶vVæW&FUvVV¶Ç•&W÷'GÒ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×f–öÆWBÓ‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×f–öÆWBÓƒ#åvö6†Væ&W&–6‡BW'¦WVvVãÂö'WGFöããÆ'WGFöâöä6Æ–6³×¶&÷fTÆFW7E&W÷'GÒ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&rÖVÖW&ÆBÓ‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡BÖVÖW&ÆBÓƒ#äÆWG§FVâ&W&–6‡Bg&V–vV&VãÂö'WGFöããÆ'WGFöâöä6Æ–6³×¶W‡÷'D7W'&VçE&W÷'GÒ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×6ÆFRÓ‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×6ÆFRÓƒ#ä&W&–6‡BW‡÷'F–W&VãÂö'WGFöããÂöF—cãÅFW‡D&VÆ&VÃÒ%7F–6‡Væ·FRòV–vVæW"FW‡B"fÇVS×·&W÷'EFW‡GÒöä6†ævS×·6WE&W÷'EFW‡GÒóãÆF—b6Æ74æÖSÒ'&÷VæFVBÓ7†Â&r×6ÆFRÓSÓB#ãÇ6Æ74æÖSÒ'FW‡B×‡2föçBÖ&öÆBWW&66RFW‡B×6ÆFRÓS#äf6†&Vw&–ffSÂ÷ãÆF—b6Æ74æÖSÒ&×BÓ2fÆW‚fÆW‚×w&vÓ"#ç·&W÷'EFW&×2æÖ‚‡FW&Ò’ÓâÄ&FvR¶W“×·FW&×Óç·FW&×ÓÂô&FvSâ—ÓÂöF—cãÂöF—cãÆF—b6Æ74æÖSÒ&w&–BvÓ2ÖC¦w&–BÖ6öÇ2Ó"#ãÆÆ&VÂ6Æ74æÖSÒ&&Æö6²&÷VæFVBÓ'†Â&r×6ÆFRÓSÓBFW‡B×6ÒföçBÖ&öÆB#å7FGW3Ç6VÆV7BfÇVS×·&W÷'E7FGW7Òöä6†ævS×²†R’Óâ6WE&W÷'E7FGW2†RçF&vWBçfÇVR—Ò6Æ74æÖSÒ&×BÓ"rÖgVÆÂ&÷VæFVB×†Â&÷&FW"&÷&FW"×6ÆFRÓ#&r×v†—FR‚Ó2’Ó2#ãÆ÷F–öãäVçGwW&cÂö÷F–öããÆ÷F–öãå§W",;ÆgVæsÂö÷F–öããÆ÷F–öãì8FæFW'Værì;gF–sÂö÷F–öããÆ÷F–öãäg&V–vVvV&VãÂö÷F–öããÂ÷6VÆV7CãÂöÆ&VÃãÄf–VÆBÆ&VÃÒ$W&–ææW'Vær"fÇVS×·&W÷'E&VÖ–æFW'Òöä6†ævS×·6WE&W÷'E&VÖ–æFW'ÒóãÂöF—cãÅFW‡D&VÆ&VÃÒ$ÖV—7FW"Ô¶öÖÖVçF""fÇVS×·&W÷'DÖ7FW$6öÖÖVçGÒöä6†ævS×·6WE&W÷'DÖ7FW$6öÖÖVçGÒóãÂöF—cãÆF—b6Æ74æÖSÒ'76R×’ÓB#ãÄ6÷”&÷‚F—FÆSÒ$&W&–6‡BÕf÷'66†Ær¶÷–W&Vâ"FW‡C×·&W÷'E&÷÷6ÇÒóãÆF—b6Æ74æÖSÒ&w&–BvÓ2ÖC¦w&–BÖ6öÇ2Ó2#ãÆ'WGFöâöä6Æ–6³×·6fU&W÷'DVçG'—Ò6Æ74æÖSÒ&fÆW‚—FV×2Ö6VçFW"§W7F–g’Ö6VçFW"vÓ"&÷VæFVBÓ'†Â&r×6ÆFRÓ“S‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×v†—FR#ãÅ6fR6—¦S×³wÒóå7V–6†W&ãÂö'WGFöããÆ'WGFöâöä6Æ–6³×²‚’Óâ6WEFeF&vWB‚$&W&–6‡G6†VgBÔV–çG&r"—Ò6Æ74æÖSÒ&fÆW‚—FV×2Ö6VçFW"§W7F–g’Ö6VçFW"vÓ"&÷VæFVBÓ'†Â&r×6ÆFRÓ‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×6ÆFRÓƒ#ãÄf–ÆUFW‡B6—¦S×³wÒóäl;Ç"DcÂö'WGFöããÆ'WGFöâöä6Æ–6³×²‚’Óâv–æF÷rç&–çB‚—Ò6Æ74æÖSÒ&fÆW‚—FV×2Ö6VçFW"§W7F–g’Ö6VçFW"vÓ"&÷VæFVBÓ'†Â&r×6ÆFRÓ‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×6ÆFRÓƒ#ãÅ&–çFW"6—¦S×³wÒóäG'V6¶VãÂö'WGFöããÂöF—cç·&W÷'DW‡÷'EFW‡BbbÄ6÷”&÷‚F—FÆSÒ$&W&–6‡G6†VgBÔW‡÷'B¶÷–W&Vâ"FW‡C×·&W÷'DW‡÷'EFW‡GÒóçÓÂöF—cãÂöF—cãÂô6&CãÄ6&CãÅ6V7F–öåF—FÆR–6öã×µ6fWÒF—FÆSÒ$vW7V–6†W'FR&W&–6‡FR"7V'F—FÆSÒ$&W&–6‡FRvW&FVâÆö¶ÂvW7V–6†W'Bâ"óãÆF—b6Æ74æÖSÒ&w&–BvÓBÖC¦w&–BÖ6öÇ2Ó"#ç·6fVE&W÷'G2æÆVæwF‚ÓÓÒbbÆF—b6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×6ÆFRÓSÓBFW‡B×6ÒföçBÖ&öÆBFW‡B×6ÆFRÓc#äæö6‚¶V–æR&W&–6‡FRvW7V–6†W'BãÂöF—cç×·6fVE&W÷'G2æÖ‚†VçG'’’ÓâÆ'F–6ÆR¶W“×¶VçG'’æ–GÒ6Æ74æÖSÒ'&÷VæFVBÓ7†Â&r×6ÆFRÓSÓR#ãÆF—b6Æ74æÖSÒ&fÆW‚fÆW‚×w&—FV×2Ö6VçFW"vÓ"#ãÄ&FvSç¶VçG'’æÖöFWÓÂô&FvSãÄ&FvSç¶VçG'’ç7FGW7ÓÂô&FvSãÄ&FvSç¶VçG'’æ÷&FW$–BÇÂ&ö†æRVgG&r'ÓÂô&FvSãÂöF—cãÇ6Æ74æÖSÒ&×BÓ2FW‡B×‡2föçBÖ&öÆBFW‡B×6ÆFRÓS#ç¶VçG'’æ7&VFVDGÓÂ÷ãÇFW‡F&V&VDöæÇ’fÇVS×¶VçG'’çFW‡GÒ6Æ74æÖSÒ&×BÓ2‚Ó3"rÖgVÆÂ&W6—¦RÖæöæR&÷VæFVBÓ'†Â&÷&FW"&÷&FW"×6ÆFRÓ#&r×v†—FRÓ2FW‡B×6ÒÆVF–ærÓb"óãÆF—b6Æ74æÖSÒ&×BÓ2w&–BvÓ"ÖC¦w&–BÖ6öÇ2Ó"#ãÆ'WGFöâöä6Æ–6³×²‚’Óâ²6WE&W÷'DW‡÷'EFW‡B†VçG'’çFW‡B“²6†÷tæ÷F–6R‚$&W&–6‡Bl;Ç"W‡÷'BW6vW|:F†ÇBâ"“²×Ò6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×6ÆFRÓ“S‚ÓB’Ó"FW‡B×6ÒföçBÖ&öÆBFW‡B×v†—FR#äW‡÷'BW7|:F†ÆVãÂö'WGFöããÆ'WGFöâöä6Æ–6³×²‚’ÓâFVÆWFU&W÷'B†VçG'’æ–B—Ò6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×&÷6RÓ‚ÓB’Ó"FW‡B×6ÒföçBÖ&öÆBFW‡B×&÷6RÓƒ#ä&W&–6‡BÌ;g66†VãÂö'WGFöããÂöF—cãÂö'F–6ÆSâ—ÓÂöF—cãÂô6&CãÂöF—câ—Ğ¢¶7F—fRÓÓÒ'6fWG’"bb67&VVâƒÆF—b6Æ74æÖSÒ&w&–BvÓRÆs¦w&–BÖ6öÇ2Õ³ã†g%óã&g%Ò#ãÄ6&CãÅ6V7F–öåF—FÆR–6öã×´ÆW'EG&–ævÆWÒF—FÆSÒ%6–6†W&†V—G2ÒVæBv&ç7—7FVÒ"7V'F—FÆSÒ$·&—F—66†R¶öÖ&–æF–öæVâvW&FVâ6–6‡F&"vVÖ6‡Bâ"óãÆF—b6Æ74æÖSÒ'76R×’Ó2#çµ²%tEe3¢Æ7F'G&wVærVæB&F–6‡GVær,;ÆfVâ"Â$Ö&¶—6S¢†ö†R†V&VÂÒVæB§Vv·,:FgFR"Â$VÆV·G&ó¢7æçVæw6g&V–†V—BVæBf6†vW&V6‡FRÖW77Vær"Â%v–æC¢†W'7FVÆÆW&æv&VâVæB6Vç6÷&–²&V6‡FVâ%ÒæÖ‚‡r’ÓâÆF—b¶W“×·wÒ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&rÖÖ&W"ÓSÓBFW‡B×6ÒföçBÖ&öÆBFW‡BÖÖ&W"Ó“#ç·wÓÂöF—câ—ÓÂöF—cãÂô6&CãÄ6&CãÅ6V7F–öåF—FÆR–6öã×µ6†–VÆD6†V6·ÒF—FÆSÒ%v&æ†–çvV—6R"7V'F—FÆSÒ$æ–6‡BÇ2WFöÖF—66†Rg&V–v&RçWG¦Vââ"óãÇ6Æ74æÖSÒ'FW‡B×6ÒÆVF–ærÓbFW‡B×6ÆFRÓc#ä†W'7FVÆÆW&æv&VâÂVçFW&w'VæBÂ&VfW7F–wVærÂvV,:GVFVŒ;f†RVæBf6‡,;ÆgVær&ÆV–&VâfW&&–æFÆ–6‚ãÂ÷ãÂô6&CãÂöF—câ—Ğ¢¶7F—fRÓÓÒ&æ÷&×2"bb67&VVâƒÄæ÷&×5vR6†V6´'WGFöã×¶6†V6´'WGFöçÒÖöGVÆT6†V6·3×¶ÖöGVÆT6†V6·7Ò6VÆV7FVD÷&FW#×·6VÆV7FVD÷&FW'Ò6VÆV7FVE&öGV7C×·6VÆV7FVE&öGV7GÒóâ—Ğ¢¶7F—fRÓÓÒ'Fb"bb67&VVâƒÅFdW‡÷'EvR7W'&VçEFeFV×ÆFS×¶7W'&VçEFeFV×ÆFWÒvWEFefÇVS×¶vWEFefÇVWÒFdFö7VÖVçG3×·FdFö7VÖVçG7ÒFdf–ÆTæÖS×·Fdf–ÆTæÖWÒFe&Wf–WtÆ–æW3×·Fe&Wf–WtÆ–æW7ÒFeF&vWC×·FeF&vWGÒFeFV×ÆFTFVf–æ—F–öç3×·FeFV×ÆFTFVf–æ—F–öç7Ò&W6WEFeFV×ÆFS×·&W6WEFeFV×ÆFWÒ6fUFdFö7VÖVçC×·6fUFdFö7VÖVçGÒ6VÆV7FVD÷&FW#×·6VÆV7FVD÷&FW'Ò6VÆV7FVE&öGV7C×·6VÆV7FVE&öGV7GÒ6WEFdf–VÆC×·6WEFdf–VÆGÒ6WEFeF&vWC×·6WEFeF&vWGÒWFFUFdFö7VÖVçE7FGW3×·WFFUFdFö7VÖVçE7FGW7Òóâ—Ğ¢¶7F—fRÓÓÒ'&–v‡G2"bb67&VVâƒÅ&–v‡G5vRæd—FV×3×¶æd—FV×7Òóâ—Ğ¢¶7F—fRÓÓÒ&6ö×ç’"bb67&VVâƒÄ6ö×ç•FVÕvR6äÖævS×¶6åf–WtÆV&æ–æuFV×Ò6ö×ç“×¶6ö×ç—Ò6ö×ç•V÷ÆS×¶6ö×ç•V÷ÆWÒ7&VFT6ö×ç•W'6öã×¶7&VFT6ö×ç•W'6öçÒöä&6†—fUW'6öã×¶&6†—fUW'6öçÒöå&VvVæW&FT6öFS×·&VvVæW&FUW'6öä6öFWÒöå6WEW'6öå7FGW3×·6WEW'6öå7FGW7ÒöåWFFUW'6öã×·WFFT6ö×ç•W'6öçÒ÷&FW'3×¶÷&FW'7ÒW'6öäf÷&Ó×·W'6öäf÷&×ÒW'6öå&öÆTÆ&VÃ×·W'6öå&öÆTÆ&VÇÒ6WD6ö×ç“×·6WD6ö×ç—Ò6WEW'6öäf÷&Ó×·6WEW'6öäf÷&×Ò6†÷tæ÷F–6S×·6†÷tæ÷F–6WÒFVÕ&öÆT÷F–öç3×·FVÕ&öÆT÷F–öç7ÒWFFT§V&•&öw&W73×·WFFT§V&•&öw&W77Òóâ—Ğ¢¶7F—fRÓÓÒ'Æææ–ær"bb67&VVâƒÆF—b6Æ74æÖSÒ&w&–BvÓRÆs¦w&–BÖ6öÇ2Õ³ã–g%óãg%Ò#ãÄ6&CãÅ6V7F–öåF—FÆR–6öã×´'&–Vf66T'W6–æW77ÒF—FÆSÒ$&W7FVÆÆVçÆçVær"7V'F—FÆSÒ$VgG,:FvRvW&FVâf÷&&&V—FW&âÂÖöçFWW&VâÂ§V&—2VæB·VæFVâ§VvWv–W6VââFæ6‚6V†Vâ6öFRÔÆöv–ç2çW"–‡&R76VæFVâ&W7FVÆÆVââ"óãÆF—b6Æ74æÖSÒ'76R×’Ó2#ç¶÷&FW'2æÖ‚†ò’ÓâÆ'WGFöâ¶W“×¶òæ–GÒöä6Æ–6³×²‚’Óâ6WE6VÆV7FVD÷&FW$–B†òæ–B—Ò6Æ74æÖS×¶rÖgVÆÂ&÷VæFVBÓ7†Â&÷&FW"ÓBFW‡BÖÆVgBG·6VÆV7FVD÷&FW#òæ–BÓÓÒòæ–Bò&&÷&FW"×6ÆFRÓ“S&r×v†—FR6†F÷rÖÖB"¢&&÷&FW"×6ÆFRÓ&r×6ÆFRÓS'ÖÓãÆF—b6Æ74æÖSÒ&fÆW‚—FV×2Ö6VçFW"§W7F–g’Ö&WGvVVâ#ãÇ7G&öæsç¶òæFFWÒ¶òçF–ÖWÒ+r¶òæ7W7FöÖW'ÓÂ÷7G&öæsãÄ&FvSç¶òç7FGW7ÓÂô&FvSãÂöF—cãÇ6Æ74æÖSÒ&×BÓFW‡B×6ÒFW‡B×6ÆFRÓc#ç¶òæFG&W77ÓÂ÷ãÇ6Æ74æÖSÒ&×BÓ"FW‡B×‡2föçBÖ&öÆBFW‡B×6ÆFRÓS#åFVÓ¢²†òæ76–væVDÖVÖ&W$–G2ÇÂµÒ’æÖ‚†–B’Óâ6ö×ç•V÷ÆRæf–æB‚‡’Óâæ–BÓÓÒ–B“òææÖR’æf–ÇFW"„&ööÆVâ’æ¦ö–â‚"Â"’ÇÂòæ76–væVEFòÇÂ&æö6‚æ–VÖæB'ÓÂ÷ãÂö'WGFöãâ—ÓÂöF—cãÂô6&CãÄ6&CãÅ6V7F–öåF—FÆR–6öã×µW6W%&÷VæGÒF—FÆSÒ%§WvV—7Værl;Ç"·F—fVâVgG&r"7V'F—FÆSÒ%|:F†ÆRFVÖÖ—FvÆ–VFW"VæB·VæFVâW2FVÒf—&ÖVçfW'¦V–6†æ—2â"óãÆF—b6Æ74æÖSÒ&Ö"ÓB&÷VæFVBÓ7†Â&r×6ÆFRÓSÓB#ãÆƒ26Æ74æÖSÒ&föçBÖ&Æ6²#ç·6VÆV7FVD÷&FW#òæ–GÒ+r·6VÆV7FVD÷&FW#òæ7W7FöÖW'ÓÂöƒ3ãÇ6Æ74æÖSÒ&×BÓFW‡B×6ÒFW‡B×6ÆFRÓc#ç·6VÆV7FVE&öGV7BææÖWÒ+r·6VÆV7FVD÷&FW#òæFFWÒ·6VÆV7FVD÷&FW#òçF–ÖWÓÂ÷ãÂöF—cãÇ6Æ74æÖSÒ&Ö"Ó"FW‡B×‡2föçBÖ&öÆBWW&66RFW‡B×6ÆFRÓS#åFVÒ§WvV—6VãÂ÷ãÆF—b6Æ74æÖSÒ'76R×’Ó"#ç·FVÔÖVÖ&W'2æÖ‚‡’ÓâÆÆ&VÂ¶W“×·æ–GÒ6Æ74æÖSÒ&fÆW‚—FV×2Ö6VçFW"§W7F–g’Ö&WGvVVâvÓ2&÷VæFVBÓ'†Â&r×6ÆFRÓSÓ2FW‡B×6ÒföçBÖ&öÆB#ãÇ7ãç·ææÖWÒ+r·W'6öå&öÆTÆ&VÂ‡ç&öÆR—ÓÂ÷7ããÆ–çWBG—SÒ&6†V6¶&÷‚"6†V6¶VC×²‡6VÆV7FVD÷&FW#òæ76–væVDÖVÖ&W$–G2ÇÂµÒ’æ–æ6ÇVFW2‡æ–B—Òöä6†ævS×²‚’ÓâFövvÆT76–væÖVçB‡æ–B—Ò6Æ74æÖSÒ&‚ÓRrÓR66VçB×6ÆFRÓ“S"óãÂöÆ&VÃâ—ÓÂöF—cãÇ6Æ74æÖSÒ&Ö"Ó"×BÓRFW‡B×‡2föçBÖ&öÆBWW&66RFW‡B×6ÆFRÓS#ä·VæFR§WvV—6VãÂ÷ãÆF—b6Æ74æÖSÒ'76R×’Ó"#ç¶6ö×ç”7W7FöÖW'2æÖ‚‡’ÓâÆ'WGFöâ¶W“×·æ–GÒöä6Æ–6³×²‚’Óâ76–vä7W7FöÖW%Fô÷&FW"‡æ–B—Ò6Æ74æÖS×¶rÖgVÆÂ&÷VæFVBÓ'†ÂÓ2FW‡BÖÆVgBFW‡B×6ÒföçBÖ&öÆBG·6VÆV7FVD÷&FW#òæ7W7FöÖW%W'6öä–BÓÓÒæ–Bò&&r×6ÆFRÓ“SFW‡B×v†—FR"¢&&r×6ÆFRÓS'ÖÓç·ææÖWÒ+r·ç7FGW7Ò+r·æFG&W72ÇÂ&ö†æRG&W76R'ÓÂö'WGFöãâ—ÓÂöF—cãÂô6&CãÂöF—câ—Ğ¢¶7F—fRÓÓÒ'÷'FÂ"bb67&VVâƒÄ7W7FöÖW%÷'FÅvR7W'&VçD7W7FöÖW$÷&FW'3×¶7W'&VçD7W7FöÖW$÷&FW'7Ò7W7FöÖW$Fö7VÖVçG3×¶7W'&VçD7W7FöÖW$Fö7VÖVçG7Ò6öæf—&Ô7W7FöÖW$ö–çFÖVçC×¶6öæf—&Ô7W7FöÖW$ö–çFÖVçGÒ÷Vä7W7FöÖW$÷&FW#×¶÷Vä7W7FöÖW$÷&FW'Òóâ—Ğ¢¶7F—fRÓÓÒ&§V&•Æâ"bb67&VVâƒÆF—b6Æ74æÖSÒ'76R×’ÓR#à¢Ä6&CãÅ6V7F–öåF—FÆR–6öã×´w&GVF–öä6ÒF—FÆSÒ$§V&’ÔÆW&çÆâ"7V'F—FÆSÒ$ÆW&æÖöGVÆRæ6‚W6&–ÆGVæw6¦‡"Âf÷'G66‡&—GBVæBì:F6‡7FW"Vfv&Râ"óà¢ÆF—b6Æ74æÖSÒ&w&–BvÓ2ÖC¦w&–BÖ6öÇ2ÓB#ãÆF—b6Æ74æÖSÒ'&÷VæFVBÓ7†Â&r×6ÆFRÓSÓB#ãÇ6Æ74æÖSÒ'FW‡BÓ7†ÂföçBÖ&Æ6²#ç¶7W'&VçEW'6öãòç&öw&W72ÇÂ6ö×ç•V÷ÆRæf–æB‚‡’Óâç&öÆRÓÓÒ&§V&’"“òç&öw&W72ÇÂÒSÂ÷ãÇ6Æ74æÖSÒ'FW‡B×6ÒFW‡B×6ÆFRÓc#äÆW&æf÷'G66‡&—GCÂ÷ãÂöF—cãÆF—b6Æ74æÖSÒ'&÷VæFVBÓ7†Â&r×6ÆFRÓSÓB#ãÇ6Æ74æÖSÒ'FW‡BÓ7†ÂföçBÖ&Æ6²#ç¶×•&W÷'G2æf–ÇFW"‚‡"’Óâ"ç7FGW2ÓÒ$g&V–vVvV&Vâ"’æÆVæwF‡ÓÂ÷ãÇ6Æ74æÖSÒ'FW‡B×6ÒFW‡B×6ÆFRÓc#æöffVæR&W&–6‡FSÂ÷ãÂöF—cãÆF—b6Æ74æÖSÒ'&÷VæFVBÓ7†Â&r×6ÆFRÓSÓB#ãÇ6Æ74æÖSÒ'FW‡BÓ7†ÂföçBÖ&Æ6²#ç·V—¤6&G2æÆVæwF‡ÓÂ÷ãÇ6Æ74æÖSÒ'FW‡B×6ÒFW‡B×6ÆFRÓc#åV—¦g&vVãÂ÷ãÂöF—cãÆF—b6Æ74æÖSÒ'&÷VæFVBÓ7†Â&r×6ÆFRÓSÓB#ãÇ6Æ74æÖSÒ'FW‡BÓ7†ÂföçBÖ&Æ6²#ç·f—6–&ÆT÷&FW'2æÆVæwF‡ÓÂ÷ãÇ6Æ74æÖSÒ'FW‡B×6ÒFW‡B×6ÆFRÓc#ä&W7FVÆÆVãÂ÷ãÂöF—cãÂöF—cà¢Âô6&Cà¢Ä6&CãÅ6V7F–öåF—FÆR–6öã×´&öö´÷VçÒF—FÆSÒ$ÆW&æÖöGVÆR"7V'F—FÆSÒ$ÖV—7FW"¶æâ6V†VâÂvVÆ6†RF†VÖVâl;Ç"§V&—2Ç2ì:F6‡7FW26–æçföÆÂ6–æBâ"óãÆF—b6Æ74æÖSÒ&w&–BvÓBÖC¦w&–BÖ6öÇ2Ó"†Ã¦w&–BÖ6öÇ2Ó2#ç¶§V&”ÆV&æ–ætÖöGVÆW2æÖ‚†ÖöGVÆR’ÓâÆ'F–6ÆR¶W“×¶ÖöGVÆRçF÷–7Ò6Æ74æÖSÒ'&÷VæFVBÓ7†Â&r×6ÆFRÓSÓR#ãÆF—b6Æ74æÖSÒ&fÆW‚—FV×2Ö6VçFW"§W7F–g’Ö&WGvVVâ#ãÆƒ26Æ74æÖSÒ&föçBÖ&Æ6²#ç¶ÖöGVÆRçF÷–7ÓÂöƒ3ãÄ&FvSç¶ÖöGVÆRç–V'Òâ¦‡#Âô&FvSãÂöF—cãÇ6Æ74æÖSÒ&×BÓ2FW‡B×6ÒÆVF–ærÓbFW‡B×6ÆFRÓc#ç¶ÖöGVÆRævöÇÓÂ÷ãÆF—b6Æ74æÖSÒ&×BÓ276R×’Ó"#ç¶ÖöGVÆRçF6·2æÖ‚‡F6²’ÓâÆF—b¶W“×·F6·Ò6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×v†—FRÓ2FW‡B×‡2föçBÖ&öÆBFW‡B×6ÆFRÓc#ç·F6·ÓÂöF—câ—ÓÂöF—cãÂö'F–6ÆSâ—ÓÂöF—cãÂô6&Cà¢Ä6&CãÅ6V7F–öåF—FÆR–6öã×´ÆW'EG&–ævÆWÒF—FÆSÒ$V×fV†ÇVær"7V'F—FÆSÒ$WFöÖF—66†RÆW&æ†–çvV—6RW2VgG,:FvVâÂ&W&–6‡FVâVæBV—¢â"óãÆF—b6Æ74æÖSÒ'&÷VæFVBÓ7†Â&rÖÖ&W"ÓSÓRFW‡B×6ÒföçBÖ&öÆBÆVF–ærÓbFW‡BÖÖ&W"Ó“#äF–W6Rvö6†RÖ÷F÷"ÔVæFÆvVâÂgVæ·7FWVW'VærVæB6V&W&R&W&–6‡G6†VgBÔf÷&×VÆ–W'VævVâv–VFW&†öÆVââFæ6‚V—¦g&vVâÌ;g6VâVæBV–æVâFvW6&W&–6‡BW2V–æVÒV6‡FVâVgG&rW'¦WVvVâãÂöF—cãÂô6&Cà¢ÂöF—câ—Ğ ¢¶7F—fRÓÓÒ&æ÷FW2"bb67&VVâƒÆF—b6Æ74æÖSÒ&w&–BvÓRÆs¦w&–BÖ6öÇ2Õ³ãvg%óã6g%Ò#ãÄ6&CãÅ6V7F–öåF—FÆR–6öã×µ7F'ÒF—FÆSÒ$ff÷&—FVâbV–vVæRæ÷F—¦Vâ"7V'F—FÆSÒ$V–vVæRÌ;g7VævVâÂW'6G§FV–ÆçVÖÖW&âöFW"Œ:GVf–vR†–çvV—6R7V–6†W&ââ"óãÅFW‡D&VÆ&VÃÒ$æWVRæ÷F—¢"fÇVS×¶ff÷&—FWÒöä6†ævS×·6WDff÷&—FWÒóãÆ'WGFöâöä6Æ–6³×¶FDæ÷FWÒ6Æ74æÖSÒ&×BÓ2rÖgVÆÂ&÷VæFVBÓ'†Â&r×6ÆFRÓ“S‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×v†—FR#äæ÷F—¢7V–6†W&ãÂö'WGFöããÂô6&CãÄ6&CãÅ6V7F–öåF—FÆR–6öã×µVåFööÇÒF—FÆSÒ$vW7V–6†W'FRæ÷F—¦Vâ"7V'F—FÆSÒ$Æö¶ÆRæ÷F—¦Vâ–Ò'&÷w6W"â"óãÆF—b6Æ74æÖSÒ'76R×’Ó2#ç¶æ÷FW2æÖ‚†â’ÓâÆF—b¶W“×¶âæ–GÒ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×6ÆFRÓSÓBFW‡B×6ÒÆVF–ærÓb#ãÄ&FvSç¶âæÖöGVÆWÓÂô&FvSãÇ6Æ74æÖSÒ&×BÓ"#ç¶âçFW‡GÓÂ÷ãÂöF—câ—ÓÂöF—cãÂô6&CãÂöF—câ—Ğ¢¶7F—fRÓÓÒ&¶’"bb67&VVâƒÆF—b6Æ74æÖSÒ&w&–BvÓRÆs¦w&–BÖ6öÇ2Õ³ã†g%óã&g%Ò#ãÄ6&CãÅ6V7F–öåF—FÆR–6öã×µ7&¶ÆW7ÒF—FÆSÒ$´’Ô76—7FVçB"7V'F—FÆSÒ$W'¦WVwB,;Æg66‡&—GFR§VÒ·F—fVâVgG&râ"óãÇFW‡F&VÆ6V†öÆFW#Ò$&V—7–VÃ¢f÷&&W&öÆÆÆFVâVbtEe2Ö—BgVæ¶Ö÷F÷"Âv÷&Vb6‡FVãò"6Æ74æÖSÒ&‚ÓCrÖgVÆÂ&W6—¦RÖæöæR&÷VæFVBÓ'†Â&÷&FW"&÷&FW"×6ÆFRÓ#&r×6ÆFRÓSÓBFW‡B×6Ò÷WFÆ–æRÖæöæR"óãÆ'WGFöâöä6Æ–6³×¶vVæW&FT¶”ç7vW'Ò6Æ74æÖSÒ&×BÓBfÆW‚rÖgVÆÂ—FV×2Ö6VçFW"§W7F–g’Ö6VçFW"vÓ"&÷VæFVBÓ'†Â&r×6ÆFRÓ“S‚ÓB’Ó2FW‡B×6ÒföçBÖ&öÆBFW‡B×v†—FR#ãÅ7&¶ÆW26—¦S×³‡Òóå,;Æg66‡&—GFRf÷'66†ÆvVãÂö'WGFöãç¶vVæW&FVD•&W7öç6RbbÆF—b6Æ74æÖSÒ&×BÓB&÷VæFVBÓ7†Â&r×6ÆFRÓSÓBFW‡B×6ÒföçBÖ&öÆBÆVF–ærÓbFW‡B×6ÆFRÓs#ç¶vVæW&FVD•&W7öç6WÓÂöF—cçÓÂô6&CãÄ6&CãÅ6V7F–öåF—FÆR–6öã×´Æ–W'7ÒF—FÆSÒ$çGv÷'BÕ7G'V·GW""7V'F—FÆSÒ%6ò6öÆÂF–R´’7:GFW"çGv÷'FVââ"óãÆF—b6Æ74æÖSÒ'76R×’Ó2#çµ²%&öGV·BVæBVgG&rW&¶VææVâ"Â%VçFW&w'VæBVæB6–6†W&†V—B,;ÆfVâ"Â%vW&·¦WVrVæB6†V6¶Æ—7FRç¦V–vVâ"Â$F–væ÷6RöFW"ÖöçFvV&ÆVbf÷'66†ÆvVâ"Â%&÷Fö¶öÆÂôf÷F÷2ôæ÷F—¦Vâ7V–6†W&â%ÒæÖ‚‡2Â’’ÓâÆF—b¶W“×·7Ò6Æ74æÖSÒ'&÷VæFVBÓ'†Â&r×6ÆFRÓSÓBFW‡B×6ÒföçBÖ&öÆB#ç¶’²Òâ·7ÓÂöF—câ—ÓÂöF—cãÂô6&CãÂöF—câ—Ğ£ÂöF—cãÂöF—cã°§Ğ