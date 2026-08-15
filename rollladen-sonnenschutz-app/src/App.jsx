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
import DesktopSidebar from "./components/DesktopSidebar";
import GlobalSearch from "./components/GlobalSearch";
import MobileBottomNav from "./components/MobileBottomNav";
import QuickAccessBar from "./components/QuickAccessBar";
import SectionTabs from "./components/SectionTabs";
import OrderChecklist from "./components/order/OrderChecklist";
import OrderMeasurement from "./components/order/OrderMeasurement";
import OrderPhotos, { REQUIRED_ORDER_PHOTOS } from "./components/order/OrderPhotos";
import useOnlineStatus from "./hooks/useOnlineStatus";
import useAutoSync from "./hooks/useAutoSync";
import useLocalStorage, { loadJson, saveJson } from "./hooks/useLocalStorage";
import useRoleNavigation from "./hooks/useRoleNavigation";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import {
  enqueueSyncItem,
  ensureRetryQueued,
  getAutoSyncState,
  getQueueSummary,
  getSyncableQueueItems,
  markQueueFailed,
  markQueueSyncing,
  markQueueSynced as markQueueItemsSynced,
  queueLocalChange as replaceLocalChange,
  restoreSyncQueue,
  retryFailedQueue,
} from "./lib/syncQueue";
import { loadLearningRecord, saveAssignedOrderChanges, saveCompanySnapshot, saveCustomerPortalChanges, saveLearningRecord } from "./services/supabaseSync";
import { buildPdfPreview, createPdfFileName } from "./lib/pdfHelpers";
import { buildOrderOpenItems, getOrderSyncStatus } from "./lib/orderWorkspace";
import { buildPartRequestText, createEmptyPartRequest, getPartPhotoRequirements } from "./lib/partsHelpers";
import { productTypes, checklistTemplates, dynamicChecklistRules, measurementRequiredFields } from "./data/products";
import { normalizeOrderStatus } from "./data/orders";
import { allManufacturers } from "./data/manufacturers";
import { allDiagnosisTrees } from "./data/diagnosis";
import { allMotorTypes } from "./data/motors";
import { formatDiagnosisForOrder } from "./lib/diagnosisAssistant";
import { createPracticeCaseFromDiagnosis, createPracticeCaseFromOrder, recordQuizAnswer } from "./lib/learningSystem";
import { reportActivityTemplates, reportLearningFields, reportTechnicalTerms, quizCards, sketchCards, azubiLearningModules, allQuizCards, expandedLearningModules, learningModules, isLearningModuleComplete } from "./data/learningModules";
import { roles, roleHomeConfig, teamRoleOptions } from "./data/rights";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import WorkflowPage from "./pages/WorkflowPage";
import CloseOrderPage from "./pages/CloseOrderPage";
import PdfExportPage from "./pages/PdfExportPage";
import SketchesPage from "./pages/SketchesPage";
import LearningPage from "./pages/LearningPage";
import ReportBookPage from "./pages/ReportBookPage";
import RightsPage from "./pages/RightsPage";
import CompanyTeamPage from "./pages/CompanyTeamPage";
import MaintenancePage from "./pages/MaintenancePage";
import NormsPage from "./pages/NormsPage";
import PartsPage from "./pages/PartsPage";
import ManufacturersPage from "./pages/ManufacturersPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import MotorsPage from "./pages/MotorsPage";
import TechnicalSearchPage from "./pages/TechnicalSearchPage";
import SubstratesPage from "./pages/SubstratesPage";
import ToolsPage from "./pages/ToolsPage";
import ProductLexiconPage from "./pages/ProductLexiconPage";
import CustomerPortalPage from "./pages/CustomerPortalPage";
import PlanningPage from "./pages/PlanningPage";
import { navigationItems } from "./config/navigation";
import { createPlanningAbsence } from "./lib/planning";
import {
  applyCustomerActionToOrder,
  createCustomerAction,
  CUSTOMER_SYNC_TYPES,
  customerPortalActivityCount,
  getVisibleCustomerDocuments,
  mergeCustomerPortalOrders,
  sanitizeCustomerOrder,
  updateCustomerPortalEntry,
} from "./lib/customerPortal";

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


const pdfTemplateDefinitions = {
  "Montageprotokoll": {
    title: "Montageprotokoll",
    description: "Für Montageabschluss, Funktionsprüfung, Kundeneinweisung und offene Punkte.",
    fields: [
      { key: "monteur", label: "Monteur / Vorarbeiter", type: "text", auto: "assignedTo", placeholder: "z. B. Max Mustermann" },
      { key: "montageDate", label: "Montagedatum", type: "date", auto: "date" },
      { key: "startTime", label: "Beginn", type: "time", auto: "time" },
      { key: "endTime", label: "Ende", type: "time", placeholder: "z. B. 15:30" },
      { key: "weather", label: "Wetter / Baustellensituation", type: "text", placeholder: "z. B. trocken, windstill, Zugang frei" },
      { key: "workDone", label: "Durchgeführte Arbeiten", type: "textarea", auto: "workDone", placeholder: "Montage, Befestigung, Einstellung, Funktionsprüfung ..." },
      { key: "functionTest", label: "Funktionsprüfung", type: "select", options: ["ohne Mangel", "mit Hinweis", "nicht möglich"] },
      { key: "customerInstruction", label: "Kundeneinweisung", type: "select", options: ["durchgeführt", "nicht anwesend", "noch offen"] },
      { key: "openIssues", label: "Offene Punkte / Mängel", type: "textarea", placeholder: "z. B. Ersatzteil nachbestellen, Silikonfuge nachziehen ..." },
      { key: "signatures", label: "Unterschriften", type: "text", placeholder: "Monteur / Kunde" },
    ],
  },
  "Aufmaßblatt": {
    title: "Aufmaßblatt",
    description: "Für Produktdaten, Maße, Einbausituation, Untergrund und Bestellinformationen.",
    fields: [
      { key: "measuredBy", label: "Aufmaß aufgenommen von", type: "text", auto: "assignedTo", placeholder: "z. B. Max Mustermann" },
      { key: "measurementDate", label: "Aufmaßdatum", type: "date", auto: "date" },
      { key: "width", label: "Breite", type: "text", auto: "width", placeholder: "z. B. 1200 mm" },
      { key: "height", label: "Höhe", type: "text", auto: "height", placeholder: "z. B. 1400 mm" },
      { key: "installation", label: "Einbausituation", type: "text", auto: "installType", placeholder: "z. B. Renovierung / Neubau / Laibung" },
      { key: "operationSide", label: "Bedienseite / Motorseite", type: "text", placeholder: "links / rechts" },
      { key: "color", label: "Farbe / Oberfläche", type: "text", placeholder: "z. B. weiß, anthrazit, RAL ..." },
      { key: "cableExit", label: "Kabelauslass / Strom", type: "text", placeholder: "z. B. links oben vorhanden" },
      { key: "specialNotes", label: "Besonderheiten", type: "textarea", placeholder: "Schräge Laibung, WDVS, alte Anlage, Zugang, Gerüst ..." },
    ],
  },
  "Wartungsprotokoll": {
    title: "Wartungsprotokoll",
    description: "Für Zustand, Reinigung, Prüfung, Mängel und nächste Wartung.",
    fields: [
      { key: "maintenanceBy", label: "Wartung durchgeführt von", type: "text", auto: "assignedTo", placeholder: "z. B. Max Mustermann" },
      { key: "maintenanceDate", label: "Wartungsdatum", type: "date", auto: "date" },
      { key: "condition", label: "Anlagenzustand", type: "select", options: ["gut", "gebraucht", "mangelhaft", "defekt"] },
      { key: "cleaning", label: "Reinigung", type: "select", options: ["durchgeführt", "teilweise durchgeführt", "nicht erforderlich", "nicht möglich"] },
      { key: "checkedParts", label: "Geprüfte Bauteile", type: "textarea", auto: "checkedParts", placeholder: "Führungsschienen, Panzer, Endlagen, Motor, Sensorik ..." },
      { key: "defects", label: "Festgestellte Mängel", type: "textarea", placeholder: "Keine Mängel / Mängel eintragen ..." },
      { key: "recommendation", label: "Empfehlung", type: "textarea", placeholder: "z. B. Ersatzteil tauschen, jährliche Wartung, Reinigung ..." },
      { key: "nextMaintenance", label: "Nächste Wartung", type: "text", placeholder: "z. B. in 12 Monaten" },
    ],
  },
  "Kundenübergabe": {
    title: "Kundenübergabe",
    description: "Für Bedienhinweise, Pflege, Sicherheit, Übergabe und Bestätigung durch den Kunden.",
    fields: [
      { key: "handoverTo", label: "Übergabe an", type: "text", auto: "customer", placeholder: "z. B. Herr/Frau Mustermann" },
      { key: "handoverDate", label: "Übergabedatum", type: "date", auto: "date" },
      { key: "operationExplained", label: "Bedienung erklärt", type: "select", options: ["ja", "teilweise", "nein"] },
      { key: "careExplained", label: "Pflegehinweise erklärt", type: "select", options: ["ja", "teilweise", "nein"] },
      { key: "safetyExplained", label: "Sicherheits-/Windhinweise erklärt", type: "select", options: ["ja", "teilweise", "nein"] },
      { key: "documents", label: "Übergebene Unterlagen", type: "textarea", placeholder: "Bedienungsanleitung, Pflegehinweise, Angebot, Protokoll ..." },
      { key: "customerQuestions", label: "Fragen / Hinweise Kunde", type: "textarea", placeholder: "Fragen oder Wünsche des Kunden ..." },
      { key: "handoverResult", label: "Übergabe-Ergebnis", type: "select", options: ["ohne Beanstandung", "mit Hinweis", "Nacharbeit erforderlich"] },
    ],
  },
  "Angebotsentwurf": {
    title: "Angebotsentwurf",
    description: "Für Leistung, Positionen, Preise, Gültigkeit und Hinweise vor Versand.",
    fields: [
      { key: "offerDate", label: "Angebotsdatum", type: "date", auto: "today" },
      { key: "validUntil", label: "Gültig bis", type: "text", placeholder: "z. B. 14 Tage" },
      { key: "service", label: "Leistungsbeschreibung", type: "textarea", auto: "offerService", placeholder: "Lieferung und Montage ..." },
      { key: "material", label: "Material netto", type: "number", auto: "material" },
      { key: "labor", label: "Arbeitszeit / Lohn", type: "text", auto: "labor" },
      { key: "travel", label: "Anfahrt netto", type: "number", auto: "travel" },
      { key: "totalNet", label: "Gesamt netto", type: "number", auto: "net" },
      { key: "offerNotes", label: "Zusatzhinweise", type: "textarea", placeholder: "Untergrundprüfung, Stromanschluss, Lieferzeit, Herstellerangaben ..." },
    ],
  },
  "Berichtsheft-Eintrag": {
    title: "Berichtsheft-Eintrag",
    description: "Für Tages-/Wochenbericht, Lernfeld, Ausbildungsjahr und Meister-Kommentar.",
    fields: [
      { key: "reportMode", label: "Berichtsart", type: "select", options: ["Tagesbericht", "Wochenbericht"] },
      { key: "reportYear", label: "Ausbildungsjahr", type: "select", options: ["1", "2", "3"] },
      { key: "learningField", label: "Lernfeld", type: "text", auto: "learningField" },
      { key: "reportText", label: "Berichtstext", type: "textarea", auto: "reportProposal" },
      { key: "reportStatus", label: "Status", type: "select", options: ["Entwurf", "Zur Prüfung", "Änderung nötig", "Freigegeben"] },
      { key: "masterComment", label: "Meister-Kommentar", type: "textarea", auto: "masterComment" },
    ],
  },
};

const customerTemplates = [
  { title: "Terminbestätigung", text: "Hallo {kunde}, wir bestätigen den Montagetermin für {produkt}. Termin: {termin}. Adresse: {adresse}. Bitte sorgen Sie dafür, dass der Montagebereich frei zugänglich ist." },
  { title: "Montagevorbereitung", text: "Hallo {kunde}, bitte räumen Sie den Bereich für {produkt} vor dem Termin frei. Termin: {termin}." },
  { title: "Bedenkenhinweis Untergrund", text: "Hallo {kunde}, bei Ihrem Auftrag {produkt} haben wir festgestellt, dass der Untergrund zusätzliche Maßnahmen erfordert. Wir dokumentieren dies und stimmen die sichere Ausführung ab." },
  { title: "Pflegehinweis Rollladen", text: "Bitte halten Sie die Führungsschienen sauber. Laub, Sand und Schmutz mit einer weichen Bürste entfernen. Keine öligen oder aggressiven Mittel verwenden." },
  { title: "Reklamation", text: "Bitte senden Sie uns ein Foto oder kurzes Video der Situation sowie eine kurze Fehlerbeschreibung. Wir prüfen den Fall und melden uns mit einer Einschätzung." },
  { title: "Bewertung anfragen", text: "Vielen Dank für Ihren Auftrag. Wenn Sie mit unserer Arbeit zufrieden sind, freuen wir uns sehr über eine kurze Bewertung." },
];
const techStacks = {
  supabase: { name: "Supabase", frontend: "React / React Native", auth: "Supabase Auth", database: "PostgreSQL", storage: "Supabase Storage", realtime: "Realtime Channels", offline: "lokale DB + Sync Queue", bestFor: "Handwerker-App mit Rollen, Aufträgen, Berichten, Fotos und späterem Web-Dashboard.", nextSteps: ["Supabase-Projekt anlegen", "Tabellen erstellen", "RLS-Regeln aktivieren", "Storage-Bucket für Fotos erstellen", "App mit API-Keys verbinden", "Sync-Logik testen"] },
  firebase: { name: "Firebase", frontend: "React / React Native", auth: "Firebase Auth", database: "Firestore", storage: "Firebase Storage", realtime: "Firestore Listener", offline: "Firestore Offline Cache + Sync Queue", bestFor: "Mobile-first App mit schneller Echtzeit-Synchronisierung und einfacher Nutzerverwaltung.", nextSteps: ["Firebase-Projekt anlegen", "Auth aktivieren", "Firestore Collections erstellen", "Storage-Regeln setzen", "App konfigurieren", "Offline-Cache testen"] },
};
const databaseTables = [
  { name: "users", fields: ["id", "name", "email", "role", "companyId", "createdAt"] },
  { name: "companies", fields: ["id", "name", "plan", "createdAt"] },
  { name: "orders", fields: ["id", "companyId", "customer", "address", "product", "status", "assignedTo", "date"] },
  { name: "checklists", fields: ["id", "orderId", "items", "progress", "updatedAt"] },
  { name: "measurements", fields: ["id", "orderId", "fields", "complete", "updatedAt"] },
  { name: "photos", fields: ["id", "orderId", "type", "url", "analysis", "createdAt"] },
  { name: "reports", fields: ["id", "orderId", "userId", "status", "text", "masterComment", "createdAt"] },
  { name: "syncLog", fields: ["id", "action", "userId", "timestamp", "status"] },
];
const appFunctionStatus = [
  { area: "Login", status: "Aktiv", note: "Login steht vor der App. Firmen nutzen E-Mail/Passwort, Personen nutzen Name + persönlichen Code." },
  { area: "Team-Codes", status: "Aktiv", note: "Firma erzeugt persönliche Codes für Vorarbeiter, Monteure, Azubis und Kunden." },
  { area: "Cloud", status: "Auto-Sync aktiv", note: "Daten werden nach dem Login automatisch gespeichert. Bei Offline-Verbindung pausiert der Sync automatisch." },
  { area: "Aufträge", status: "Aktiv", note: "Anlegen, Bearbeiten, Suchen, Löschen, Status und lokale Speicherung funktionieren." },
  { area: "Baustellenplanung", status: "Aktiv", note: "Aufträge können Teammitgliedern und Kunden zugewiesen werden." },
  { area: "Berichtsheft", status: "Aktiv", note: "Erzeugen, Speichern, Freigeben, Löschen, Wochenbericht und Export sind als Prototyp eingebaut." },
  { area: "Fotos", status: "Aktiv", note: "Upload und Analyse-Simulation funktionieren; echte KI-Erkennung braucht später ein Modell/API." },
];


const orderWorkflowTemplates = [
  { id: "rollladen-montage", name: "Rollladenmontage", product: "vorbaurollladen", orderType: "Montage", notes: "Montage vorbereiten, Aufmaß prüfen, Führungsschienen ausrichten, Endlagen testen und Kunden einweisen." },
  { id: "markisen-montage", name: "Markisenmontage", product: "markise", orderType: "Montage", notes: "Konsolenposition, Untergrund, Befestigungssystem, Neigung, Windhinweis und Übergabe dokumentieren." },
  { id: "diagnose", name: "Fehlerdiagnose", product: "vorbaurollladen", orderType: "Diagnose", notes: "Fehlerbild aufnehmen, Ursache eingrenzen, Fotos erstellen, Lösungsvorschlag und Ersatzteile dokumentieren." },
  { id: "wartung", name: "Wartung", product: "markise", orderType: "Wartung", notes: "Reinigung, Sichtprüfung, Funktionsprüfung, Mängel und nächste Wartung dokumentieren." },
  { id: "reklamation", name: "Reklamation", product: "zipscreen", orderType: "Reklamation", notes: "Kundenmeldung prüfen, Schaden dokumentieren, Ursache bewerten, Nacharbeit oder Ersatzteil anlegen." },
];



const makeCode = (prefix = "APP") => `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
const defaultCompany = () => ({
  id: "betrieb-muster",
  name: "Muster Sonnenschutz GmbH",
  contactPhone: "",
  contactEmail: "",
  createdAt: new Date().toLocaleString("de-DE"),
});
const defaultCompanyPeople = () => [
  { id: "P-100", name: "Max Mustermann", role: "vorarbeiter", accessCode: makeCode("VOR"), status: "aktiv", team: "Kolonne 1", trainingYear: "", progress: 0, phone: "", address: "", createdAt: new Date().toLocaleString("de-DE") },
  { id: "P-101", name: "Tom Mustermann", role: "monteur", accessCode: makeCode("MON"), status: "aktiv", team: "Kolonne 1", trainingYear: "", progress: 0, phone: "", address: "", createdAt: new Date().toLocaleString("de-DE") },
  { id: "P-102", name: "Leon Mustermann", role: "azubi", accessCode: makeCode("AZU"), status: "aktiv", team: "Kolonne 1", trainingYear: "2", progress: 35, phone: "", address: "", createdAt: new Date().toLocaleString("de-DE") },
  { id: "P-103", name: "Erika Musterfrau", role: "kunde", accessCode: makeCode("KUN"), status: "aktiv", team: "", trainingYear: "", progress: 0, phone: "", email: "", address: "Musterstraße 1", createdAt: new Date().toLocaleString("de-DE") },
];














const workflowStages = [
  { id: "request", title: "Anfrage", text: "Kundenwunsch, Produkt, Adresse und Wunschtermin aufnehmen.", actions: [{ id: "prepare", label: "Auftrag vorbereiten", module: "orders" }] },
  { id: "planning", title: "Planung", text: "Termin festlegen, Zuständigkeit klären und das passende Team einplanen.", actions: [{ id: "team", label: "Team zuweisen", module: "planning" }] },
  { id: "preparation", title: "Vorbereitung", text: "Aufmaß, Material, Befestigung und Checkliste vor dem Einsatz prüfen.", actions: [{ id: "measurement", label: "Aufmaß öffnen", module: "measurement" }, { id: "checklist", label: "Checkliste öffnen", module: "checklists" }] },
  { id: "installation", title: "Durchführung", text: "Arbeiten vor Ort ausführen und Fotos sowie wichtige Nachweise festhalten.", actions: [{ id: "photos", label: "Fotos hinzufügen", module: "photos" }, { id: "parts", label: "Ersatzteile prüfen", module: "parts" }] },
  { id: "completion", title: "Abschluss", text: "Funktion, Sicherheit, Einweisung und offene Punkte gemeinsam prüfen.", actions: [{ id: "close", label: "Abschluss prüfen", module: "closeOrder" }, { id: "rework", label: "Nacharbeit erstellen" }] },
  { id: "documents", title: "Dokumentation", text: "Protokoll und PDF bereitstellen; kaufmännische Bearbeitung anschließend abschließen.", actions: [{ id: "pdf", label: "PDF erstellen", module: "pdf" }] },
  { id: "done", title: "Erledigt", text: "Der Auftrag ist vollständig bearbeitet und kann geordnet abgelegt werden.", actions: [{ id: "archive", label: "Archivieren" }] },
];


function TopBar({ role, setRole, offline, pendingSyncCount, failedSyncCount, lastSyncedAt, syncError, syncing, onRetrySync, compact, currentUser, search }) {
  const selected = roles.find((item) => item.id === role) || roles[0];
  const canSwitchRole = currentUser?.role === "dev";
  return <div className="sticky top-3 z-30 mb-4 rounded-[1.5rem] border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
    <div className={`flex gap-3 ${compact ? "flex-col" : "items-center"}`}>
      <div className="flex shrink-0 items-center gap-2"><div className="flex min-h-11 items-center gap-2 rounded-2xl bg-slate-950 px-3 text-white"><UserRound size={18} /><span className="text-sm font-bold">{currentUser?.name || "Nutzer"}</span></div>{canSwitchRole ? <select value={role} onChange={(event) => setRole(event.target.value)} className="min-h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none">{roles.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select> : <div className="flex min-h-11 items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700">{selected.label}</div>}</div>
      {!compact && search}
      <div className="shrink-0"><StatusBadge offline={offline} pendingCount={pendingSyncCount} failedCount={failedSyncCount} lastSyncedAt={lastSyncedAt} error={syncError} syncing={syncing} onRetry={onRetrySync} showTechnicalDetails={currentUser?.role === "dev"} /></div>
    </div>
  </div>;
}
function Header({ role, orders, selectedOrder, compact, moduleCount }) {
  const selectedRole = roles.find((item) => item.id === role)?.label || role;
  const customerView = role === "kunde";
  return <header className="mb-5 rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl md:p-8"><div className={compact ? "space-y-4" : "grid gap-6 md:grid-cols-[1.4fr_0.6fr] md:items-center"}><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 md:text-sm"><Sun size={16} />{selectedRole}</div><h1 className={compact ? "text-2xl font-black tracking-tight" : "text-3xl font-black tracking-tight md:text-5xl"}>{customerView ? "Kundenportal" : "Monteur-App"}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base md:leading-7">{customerView ? "Termine, Aufträge und Dokumentstatus auf einen Blick" : "Rollladen & Sonnenschutz Assistent"}</p></div>{!compact && <div className="grid grid-cols-3 gap-3"><div className="rounded-3xl bg-white/10 p-4"><p className="text-3xl font-black">{orders.length}</p><p className="text-sm text-white/70">Aufträge</p></div><div className="rounded-3xl bg-white/10 p-4"><p className="text-3xl font-black">{selectedOrder ? "Ja" : "Nein"}</p><p className="text-sm text-white/70">{customerView ? "Termin vorhanden" : "Aktiver Auftrag"}</p></div><div className="rounded-3xl bg-white/10 p-4"><p className="text-3xl font-black">{moduleCount}</p><p className="text-sm text-white/70">Bereiche</p></div></div>}</div></header>;
}
function LoginGate({
  device,
  loginForm,
  setLoginForm,
  companyAuthMode,
  setCompanyAuthMode,
  registerCompanyWithSupabase,
  signInCompanyWithSupabase,
  pendingRegistration,
  resendConfirmationEmail,
  finishEmailConfirmation,
  clearPendingRegistration,
  codeLogin,
  setCodeLogin,
  loginWithPersonalCode,
  supabaseStatus,
  isSupabaseConfigured,
}) {
  const [loginType, setLoginType] = useState("company");

  return <main className={`min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 text-slate-950 ${device?.isMobile ? "pb-8" : "md:p-8"}`}>
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl flex-col justify-center gap-6">
      <section className="text-center text-white">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
          <ShieldCheck size={18} /> Geschützter Zugriff
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Rollladen & Sonnenschutz App</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75">
          Zentrale App für Betriebe, Monteure, Vorarbeiter, Azubis und Kunden. Erst anmelden, dann Aufträge, Team, Berichtsheft, Checklisten und Cloud-Synchronisation nutzen.
        </p>
        <div className="mx-auto mt-6 grid max-w-xl gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-white/10 p-4"><p className="text-2xl font-black">1</p><p className="mt-1 text-sm text-white/70">Firma anlegen</p></div>
          <div className="rounded-3xl bg-white/10 p-4"><p className="text-2xl font-black">2</p><p className="mt-1 text-sm text-white/70">Team verbinden</p></div>
          <div className="rounded-3xl bg-white/10 p-4"><p className="text-2xl font-black">3</p><p className="mt-1 text-sm text-white/70">Daten synchronisieren</p></div>
        </div>
      </section>

      <Card>
        {pendingRegistration ? (
          <div>
            <SectionTitle icon={CheckCircle2} title="E-Mail bestätigen" subtitle="Öffne den Bestätigungslink in deiner E-Mail. Danach kannst du hier direkt weiter zur App." />
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-900">
              Bestätigungsmail gesendet an: {pendingRegistration.email}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <button onClick={finishEmailConfirmation} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">E-Mail bestätigt – weiter</button>
              <button onClick={resendConfirmationEmail} className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">Bestätigungsmail erneut senden</button>
              <button onClick={clearPendingRegistration} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">Andere Daten verwenden</button>
            </div>
            <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">Falls du mehrere E-Mails anforderst, nutze immer den neuesten Link.</p>
          </div>
        ) : (
          <div>
            <SectionTitle icon={loginType === "company" ? Database : UserRound} title="Anmelden" subtitle="Firmen melden sich mit E-Mail an. Teammitglieder und Kunden nutzen Name + persönlichen Code." />
            {supabaseStatus && <div className="mb-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{supabaseStatus}</div>}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
              <button onClick={() => setLoginType("company")} className={`rounded-xl px-3 py-3 text-sm font-black ${loginType === "company" ? "bg-white shadow" : "text-slate-500"}`}>Firma</button>
              <button onClick={() => setLoginType("code")} className={`rounded-xl px-3 py-3 text-sm font-black ${loginType === "code" ? "bg-white shadow" : "text-slate-500"}`}>Name + Code</button>
            </div>

            {loginType === "company" ? (
              <div className="mt-5">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                  <button onClick={() => setCompanyAuthMode("register")} className={`rounded-xl px-3 py-2 text-sm font-black ${companyAuthMode === "register" ? "bg-white shadow" : "text-slate-500"}`}>Registrieren</button>
                  <button onClick={() => setCompanyAuthMode("login")} className={`rounded-xl px-3 py-2 text-sm font-black ${companyAuthMode === "login" ? "bg-white shadow" : "text-slate-500"}`}>Einloggen</button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {companyAuthMode === "register" && <LoginField label="Name Meister/Büro" value={loginForm.name} onChange={(v) => setLoginForm({ ...loginForm, name: v })} placeholder="z. B. Max Mustermann" autoComplete="off" />}
                  {companyAuthMode === "register" && <LoginField label="Betrieb" value={loginForm.company} onChange={(v) => setLoginForm({ ...loginForm, company: v })} placeholder="z. B. Muster Sonnenschutz GmbH" autoComplete="organization" />}
                  <LoginField label="E-Mail" value={loginForm.email} onChange={(v) => setLoginForm({ ...loginForm, email: v })} placeholder="z. B. max.mustermann@example.com" type="email" autoComplete="email" />
                  <LoginField label="Passwort" type="password" value={loginForm.password} onChange={(v) => setLoginForm({ ...loginForm, password: v })} placeholder="Passwort eingeben" autoComplete={companyAuthMode === "register" ? "new-password" : "current-password"} />
                </div>
                <button onClick={companyAuthMode === "register" ? registerCompanyWithSupabase : signInCompanyWithSupabase} className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">
                  {companyAuthMode === "register" ? "Firma registrieren" : "Firma einloggen"}
                </button>
              </div>
            ) : (
              <div className="mt-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <LoginField label="Name" value={codeLogin.name} onChange={(v) => setCodeLogin({ ...codeLogin, name: v })} placeholder="z. B. Max Mustermann" autoComplete="off" />
                  <LoginField label="Persönlicher Code" value={codeLogin.code} onChange={(v) => setCodeLogin({ ...codeLogin, code: v.toUpperCase() })} placeholder="z. B. MON-48291" autoComplete="off" />
                </div>
                <button onClick={loginWithPersonalCode} className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Mit Name + Code anmelden</button>
              </div>
            )}
          </div>
        )}
      </Card>

      <p className="text-center text-xs font-bold text-white/45">
        {isSupabaseConfigured ? "Cloud-Verbindung aktiv." : "Cloud-Verbindung noch nicht eingerichtet."}
      </p>
    </div>
  </main>;
}


export default function App() {
  const device = useDeviceLayout();
  const [role, setRoleState] = useLocalStorage("rs-role", "dev");
  const { offline } = useOnlineStatus();
  const [active, setActive] = useState("dashboard");
  const [orders, setOrders] = useState(() => loadJson("rs-orders", [{ id: "A-1001", customer: "Musterkunde GmbH", contact: "Max Mustermann", phone: "", email: "", address: "Musterstraße 1", date: todayIso(), time: "08:00", assignedTo: "Max Mustermann", product: "vorbaurollladen", substrate: "WDVS", drive: "Funkmotor", installType: "Renovierung", windCritical: true, status: "offen", priority: "normal", materialStatus: "nicht geprüft", orderType: "Montage", notes: "3 Elemente, Funkmotor, WDVS prüfen" }]));
  const [selectedOrderId, setSelectedOrderId] = useState(() => loadJson("rs-selected-order", "A-1001"));
  const [checks, setChecks] = useState(() => loadJson("rs-checks", {}));
  const [photos, setPhotos] = useState(() => loadJson("rs-order-photos", {}));
  const [notes, setNotes] = useState(() => loadJson("rs-notes", []));
  const [savedReports, setSavedReports] = useState(() => loadJson("rs-saved-reports", []));
  const [measurementValues, setMeasurementValues] = useState(() => loadJson("rs-measurements", {}));
  const [manualQuality, setManualQuality] = useState(() => loadJson("rs-quality", {}));
  const [authUser, setAuthUser] = useState(() => loadJson("rs-auth-user", null));
  const [syncLog, setSyncLog] = useState(() => loadJson("rs-sync-log", []));
  const [photoAnalyses, setPhotoAnalyses] = useState(() => loadJson("rs-photo-analyses", {}));
  const [newOrder, setNewOrder] = useState({ customer: "", contact: "", phone: "", email: "", address: "", date: todayIso(), time: "08:00", assignedTo: "", product: "vorbaurollladen", substrate: "Beton", drive: "Funkmotor", installType: "Renovierung", windCritical: false, priority: "normal", materialStatus: "nicht geprüft", orderType: "Montage", notes: "" });
  const [orderSearch, setOrderSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [diagnosisQuery, setDiagnosisQuery] = useState("");
  const [diagnosisCategory, setDiagnosisCategory] = useState("all");
  const [partQuery, setPartQuery] = useState("");
  const [partMode, setPartMode] = useState("search");
  const [partRequest, setPartRequest] = useState(() => createEmptyPartRequest());
  const [partRequests, setPartRequests] = useLocalStorage("rs-part-requests", []);
  const [manufacturerQuery, setManufacturerQuery] = useState("");
  const [motorQuery, setMotorQuery] = useState("");
  const [technicalQuery, setTechnicalQuery] = useState("");
  const [manufacturerFavorites, setManufacturerFavorites] = useLocalStorage("rs-manufacturer-favorites", []);
  const [motorFavorites, setMotorFavorites] = useLocalStorage("rs-motor-favorites", []);
  const [technicalRecents, setTechnicalRecents] = useLocalStorage("rs-technical-recents", []);
  const [technicalNotes, setTechnicalNotes] = useLocalStorage("rs-technical-notes", {});
  const [diagnosisFavorites, setDiagnosisFavorites] = useLocalStorage("rs-diagnosis-favorites", []);
  const [diagnosisRecents, setDiagnosisRecents] = useLocalStorage("rs-diagnosis-recents", []);
  const [diagnosisSessions, setDiagnosisSessions] = useLocalStorage("rs-diagnosis-sessions", []);
  const [pendingPhotoDiagnosis, setPendingPhotoDiagnosis] = useState(null);
  const [calc, setCalc] = useState({ count: 3, material: 420, labor: 4, rate: 65, travel: 45, wdvs: 0, disposal: 0 });
  const [reportText, setReportText] = useState("Heute Vorbaurollladen montiert, Führungsschienen gebohrt, Motor eingestellt und Kunden eingewiesen.");
  const [reportMode, setReportMode] = useState("Tagesbericht");
  const [reportYear, setReportYear] = useState("2");
  const [reportLearningField, setReportLearningField] = useState("Montage und Instandhaltung");
  const [reportTemplateId, setReportTemplateId] = useState("montage");
  const [reportStatus, setReportStatus] = useState("Entwurf");
  const [reportMasterComment, setReportMasterComment] = useState("");
  const [reportReminder, setReportReminder] = useState("Freitag 16:00");
  const [reportExportText, setReportExportText] = useState("");
  const [backupText, setBackupText] = useState("");
  const [loginForm, setLoginForm] = useState({ name: "", email: "", password: "", company: "", role: "meister" });
  const [cloudCompanyId, setCloudCompanyId] = useState(() => loadJson("rs-cloud-company", "betrieb-muster"));
  const [techStack, setTechStack] = useState("supabase");
  const [favorite, setFavorite] = useState("");
  const [generatedAiResponse, setGeneratedAiResponse] = useState("");
  const [pdfTarget, setPdfTarget] = useState("Montageprotokoll");
  const [pdfFormData, setPdfFormData] = useState(() => loadJson("rs-pdf-form-data", {}));
  const [company, setCompany] = useState(() => loadJson("rs-company", defaultCompany()));
  const [companyPeople, setCompanyPeople] = useState(() => loadJson("rs-company-people", defaultCompanyPeople()));
  const [planningAbsences, setPlanningAbsences] = useLocalStorage("rs-planning-absences", []);
  const [personForm, setPersonForm] = useState({ name: "", role: "monteur", phone: "", address: "", team: "Kolonne 1", trainingYear: "1" });
  const [codeLogin, setCodeLogin] = useState({ name: "", code: "" });
  const [supabaseStatus, setSupabaseStatus] = useState("");
  const [companyAuthMode, setCompanyAuthMode] = useState("register");
  const [pendingRegistration, setPendingRegistration] = useState(() => loadJson("rs-pending-registration", null));
  const [initialCloudLoaded, setInitialCloudLoaded] = useState(false);
  const [syncQueue, setSyncQueue] = useLocalStorage("rs-sync-queue", [], { normalize: restoreSyncQueue });
  const [lastSyncedAt, setLastSyncedAt] = useLocalStorage("rs-last-synced-at", "");
  const [syncError, setSyncError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [pdfDocuments, setPdfDocuments] = useState(() => loadJson("rs-pdf-documents", []));
  const [moduleChecks, setModuleChecks] = useState(() => loadJson("rs-module-checks", {}));
  const [learningProgress, setLearningProgress] = useLocalStorage("rs-learning-progress", {});
  const [quizProgress, setQuizProgress] = useLocalStorage("rs-quiz-progress", {});
  const [learningPracticeCases, setLearningPracticeCases] = useLocalStorage("rs-learning-practice-cases", []);
  const [learningAssignments, setLearningAssignments] = useLocalStorage("rs-learning-assignments", []);
  const [learningComments, setLearningComments] = useLocalStorage("rs-learning-comments", []);
  const [learningLists, setLearningLists] = useLocalStorage("rs-learning-lists", {});
  const [sketchImage, setSketchImage] = useState(() => loadJson("rs-free-sketch", ""));
  const [savedSketches, setSavedSketches] = useLocalStorage("rs-saved-sketches", []);
  const [workflowTemplateId, setWorkflowTemplateId] = useState("rollladen-montage");
  const [navigationFavorites, setNavigationFavorites] = useLocalStorage("rs-navigation-favorites", ["diagnose", "motors", "parts", "measurement"]);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage("rs-sidebar-collapsed", false);
  const syncInFlightRef = useRef(false);
  const syncRetryRequestedRef = useRef(false);
  const syncQueueRef = useRef(syncQueue);

  const setRole = (value) => setRoleState(value);
  const appRole = authUser?.role === "dev" ? role : authUser?.role || role;
  const { activeGroup: activeNavigationGroup, allowedPages: allowedNav, canOpenModule, groups: roleNavigationGroups, items: visibleNavigationItems, mobilePrimaryItems } = useRoleNavigation(appRole, active);
  const navigateTo = (moduleId) => { if (canOpenModule(moduleId)) setActive(moduleId); };
  const openSearchOrder = (orderId) => { setSelectedOrderId(orderId); setActive(appRole === "kunde" ? "portal" : "orders"); };
  const toggleNavigationFavorite = (moduleId) => setNavigationFavorites((current) => {
    const favorites = Array.isArray(current) ? current : [];
    if (favorites.includes(moduleId)) return favorites.filter((id) => id !== moduleId);
    if (favorites.length >= 5) { setNotice("Es können maximal fünf Schnellzugriffe angeheftet werden."); return favorites; }
    return [...favorites, moduleId];
  });
  const roleSyncQueue = useMemo(() => authUser?.role === "kunde" ? syncQueue.filter((item) => CUSTOMER_SYNC_TYPES.has(item.type)) : syncQueue, [authUser?.role, syncQueue]);
  const syncQueueSummary = useMemo(() => getQueueSummary(roleSyncQueue), [roleSyncQueue]);
  const autoSyncState = useMemo(() => getAutoSyncState(roleSyncQueue), [roleSyncQueue]);
  const pendingSyncCount = syncQueueSummary.unsynced;
  const failedSyncCount = syncQueueSummary.failed;
  const pendingSyncVersion = autoSyncState.version;
  useEffect(() => {
    if (authUser?.role && authUser.role !== "dev" && role !== authUser.role) setRole(authUser.role);
  }, [authUser?.role, role]);
  useEffect(() => { if (!allowedNav.some((item) => item.id === active)) setActive("dashboard"); }, [allowedNav, active]);
  useEffect(() => saveJson("rs-orders", orders), [orders]);
  useEffect(() => saveJson("rs-selected-order", selectedOrderId), [selectedOrderId]);
  useEffect(() => saveJson("rs-checks", checks), [checks]);
  useEffect(() => saveJson("rs-order-photos", photos), [photos]);
  useEffect(() => saveJson("rs-notes", notes), [notes]);
  useEffect(() => saveJson("rs-saved-reports", savedReports), [savedReports]);
  useEffect(() => saveJson("rs-measurements", measurementValues), [measurementValues]);
  useEffect(() => saveJson("rs-quality", manualQuality), [manualQuality]);
  useEffect(() => saveJson("rs-auth-user", authUser), [authUser]);
  useEffect(() => saveJson("rs-sync-log", syncLog), [syncLog]);
  useEffect(() => saveJson("rs-photo-analyses", photoAnalyses), [photoAnalyses]);
  useEffect(() => saveJson("rs-cloud-company", cloudCompanyId), [cloudCompanyId]);
  useEffect(() => saveJson("rs-company", company), [company]);
  useEffect(() => saveJson("rs-company-people", companyPeople), [companyPeople]);
  useEffect(() => saveJson("rs-pending-registration", pendingRegistration), [pendingRegistration]);
  useEffect(() => saveJson("rs-pdf-form-data", pdfFormData), [pdfFormData]);
  useEffect(() => saveJson("rs-pdf-documents", pdfDocuments), [pdfDocuments]);
  useEffect(() => saveJson("rs-module-checks", moduleChecks), [moduleChecks]);
  useEffect(() => saveJson("rs-free-sketch", sketchImage), [sketchImage]);
  useEffect(() => { syncQueueRef.current = syncQueue; }, [syncQueue]);

  const currentPerson = authUser?.personId ? companyPeople.find((p) => p.id === authUser.personId) : null;
  const isCompanyAdmin = ["dev", "meister", "buero"].includes(appRole);
  const visibleOrders = useMemo(() => {
    if (isCompanyAdmin) return orders;
    if (!currentPerson) return appRole === "kunde" ? [] : orders;
    if (["monteur", "vorarbeiter", "azubi"].includes(currentPerson.role)) {
      return orders.filter((o) => (o.assignedMemberIds || []).includes(currentPerson.id) || o.assignedTo === currentPerson.name);
    }
    if (currentPerson.role === "kunde") {
      return orders.filter((o) => o.customerPersonId === currentPerson.id || o.customer_id === currentPerson.id);
    }
    return appRole === "kunde" ? [] : orders;
  }, [orders, isCompanyAdmin, appRole, currentPerson?.id, currentPerson?.role, currentPerson?.name]);
  const selectedOrder = visibleOrders.find((o) => o.id === selectedOrderId) || visibleOrders[0] || (isCompanyAdmin ? orders[0] : null);
  const selectedProduct = productTypes.find((p) => p.id === selectedOrder?.product) || productTypes[0];
  const newOrderProduct = productTypes.find((p) => p.id === newOrder.product) || productTypes[0];
  const buildChecklistItems = (productId, source = {}) => [...new Set([...(checklistTemplates[productId] || []), ...dynamicChecklistRules.filter((rule) => Object.entries(rule.when).every(([key, value]) => source[key] === value)).flatMap((rule) => rule.items)])];
  const buildEmptyChecklist = (productId, source = {}) => Object.fromEntries(buildChecklistItems(productId, source).map((item) => [item, false]));
  const selectedChecklistItems = buildChecklistItems(selectedProduct.id, selectedOrder || {});
  const selectedChecklistDone = selectedChecklistItems.filter((item) => checks[selectedOrder?.id]?.[item]).length;
  const selectedChecklistProgress = selectedChecklistItems.length ? Math.round((selectedChecklistDone / selectedChecklistItems.length) * 100) : 0;
  const newOrderChecklistPreview = buildChecklistItems(newOrder.product, newOrder);
  const measurementFields = measurementRequiredFields[selectedProduct.id] || ["Breite", "Höhe", "Untergrund", "Bedienseite", "Foto"];
  const orderMeasurements = measurementValues[selectedOrder?.id] || {};
  const missingMeasurements = measurementFields.filter((field) => !orderMeasurements[field]);
  const orderPhotos = photos[selectedOrder?.id] || {};
  const orderPhotoAnalyses = photoAnalyses[selectedOrder?.id] || {};
  const orderPartRequests = partRequests.filter((request) => request.orderId === selectedOrder?.id);
  const openOrderPartRequests = orderPartRequests.filter((request) => !["erledigt", "verbaut"].includes(String(request.status || "").toLocaleLowerCase("de-DE")));
  const orderDocuments = pdfDocuments.filter((document) => document.orderId === selectedOrder?.id);
  const closingValues = manualQuality[selectedOrder?.id] || {};
  const hasRequiredPhotos = REQUIRED_ORDER_PHOTOS.every((key) => orderPhotos[key]);
  const hasPdfProtocol = orderDocuments.length > 0;
  const needsElectricalChecks = !["Gurt", "Kurbel", "manuell"].includes(selectedOrder?.drive);
  const closingGroups = [
    { id: "work", title: "Arbeiten", items: [
      { id: "work-complete", label: "Arbeiten laut Auftrag erledigt", done: Boolean(closingValues["work-complete"]), required: true },
      { id: "fixings-checked", label: "Befestigungen kontrolliert", done: Boolean(closingValues["fixings-checked"]), required: true },
      { id: "clean-installation", label: "Anlage sauber montiert", done: Boolean(closingValues["clean-installation"]), required: true },
      { id: "work-area-clean", label: "Baustelle gereinigt", done: Boolean(closingValues["work-area-clean"]), required: true },
    ] },
    { id: "function", title: "Funktion", items: [
      { id: "function-result", label: "Anlage getestet", done: Boolean(closingValues["function-result"]), required: true },
      ...(needsElectricalChecks ? [
        { id: "motor", label: "Motor geprüft", done: Boolean(closingValues.motor), required: true },
        { id: "end-positions", label: "Endlagen geprüft", done: Boolean(closingValues["end-positions"]), required: true },
        { id: "controls", label: "Bedienung geprüft", done: Boolean(closingValues.controls), required: true },
        { id: "radio-sensors", label: "Funk/Sensorik geprüft, falls vorhanden", done: Boolean(closingValues["radio-sensors"]), required: String(selectedOrder?.drive || "").toLocaleLowerCase("de-DE").includes("funk") || selectedOrder?.windCritical },
      ] : []),
    ] },
    { id: "safety", title: "Sicherheit", items: [
      { id: "safety-check", label: "Sichere Nutzung geprüft", done: Boolean(closingValues["safety-check"]), required: true },
      { id: "obstacles", label: "Hindernisse und Bewegungsbereich kontrolliert", done: Boolean(closingValues.obstacles), required: true },
      { id: "safety-fixings", label: "Sicherheitsrelevante Befestigung kontrolliert", done: Boolean(closingValues["safety-fixings"]), required: true },
      { id: "safety-note", label: "Herstellerhinweise berücksichtigt", done: Boolean(closingValues["safety-note"]), required: true },
    ] },
    { id: "photos", title: "Fotos", items: [
      { id: "photos", label: "Vorher-, Nachher- und Typenschildfoto vorhanden", done: hasRequiredPhotos, required: true, automatic: true, action: "photos" },
      { id: "detail-photos", label: "Relevante Detailfotos geprüft", done: Boolean(closingValues["detail-photos"]), required: true },
    ] },
    { id: "customer", title: "Kunde", items: [
      { id: "customer", label: "Bedienung erklärt", done: Boolean(closingValues.customer), required: true },
      { id: "customer-care", label: "Pflege erklärt", done: Boolean(closingValues["customer-care"]), required: true },
      { id: "customer-safety", label: "Sicherheitshinweise gegeben", done: Boolean(closingValues["customer-safety"]), required: true },
      { id: "customer-questions", label: "Fragen beantwortet", done: Boolean(closingValues["customer-questions"]), required: true },
    ] },
    { id: "documents", title: "Dokumentation", items: [
      { id: "product-checklist", label: "Produkt-Checkliste vollständig", done: selectedChecklistItems.length > 0 && selectedChecklistItems.every((item) => checks[selectedOrder?.id]?.[item]), required: true, automatic: true, action: "checklists" },
      { id: "measurement", label: "Aufmaß vollständig", done: missingMeasurements.length === 0, required: true, automatic: true, action: "measurement" },
      { id: "documentation", label: "Abschlussnotiz vorhanden", done: Boolean(selectedOrder?.completionNote?.trim()), required: true, automatic: true, action: "orders" },
      { id: "pdf-protocol", label: "PDF-Protokoll erstellt", done: hasPdfProtocol, required: false, automatic: true, action: "pdf", recommended: true },
      { id: "signature-ready", label: "Unterschrift vorbereitet", done: Boolean(closingValues["signature-ready"]), required: false, recommended: true },
    ] },
    { id: "open-points", title: "Offene Punkte", items: [
      { id: "open-points-reviewed", label: "Offene Punkte erfasst oder ausdrücklich als erledigt geprüft", done: Boolean(closingValues["open-points-reviewed"]), required: true },
      ...(closingValues["parts-status"] === "missing" ? [{ id: "part-request-started", label: "Ersatzteil-Anfrage gestartet", done: Boolean(selectedOrder?.partRequestStartedAt), required: true, automatic: true, action: "parts" }] : []),
    ], decision: { id: "parts-status", label: "Ersatzteilstatus festlegen", value: closingValues["parts-status"] || "", options: [{ value: "complete", label: "Kein Ersatzteil offen" }, { value: "missing", label: "Ersatzteil fehlt" }], required: true } },
    { id: "rework", title: "Nacharbeit nötig", items: [
      ...(closingValues["rework-status"] === "needed" ? [{ id: "rework-created", label: "Nacharbeitsauftrag erzeugt", done: Boolean(selectedOrder?.reworkOrderId), required: true, automatic: true, action: "rework" }] : []),
    ], decision: { id: "rework-status", label: "Nacharbeit bewerten", value: closingValues["rework-status"] || "", options: [{ value: "none", label: "Keine Nacharbeit nötig" }, { value: "needed", label: "Nacharbeit nötig" }], required: true } },
  ];
  const unresolvedQuality = closingGroups.flatMap((group) => [
    ...group.items.filter((item) => item.required && !item.done),
    ...(group.decision?.required && !group.decision.value ? [{ id: group.decision.id, label: group.decision.label, action: "closeOrder" }] : []),
  ]);
  const closeReady = Boolean(selectedOrder) && unresolvedQuality.length === 0;
  const orderWorkspaceContext = { buildChecklistItems, checks, measurementRequiredFields, measurementValues, photos, requiredPhotos: REQUIRED_ORDER_PHOTOS, partRequests, manualQuality, pdfDocuments };
  const getOrderOpenItems = (order) => buildOrderOpenItems(order, orderWorkspaceContext);
  const selectedOrderOpenItems = getOrderOpenItems(selectedOrder);
  const orderOpenCounts = Object.fromEntries(visibleOrders.map((order) => [order.id, getOrderOpenItems(order).length]));
  const requiredClosingItems = closingGroups.flatMap((group) => group.items.filter((item) => item.required));
  const completedClosingItems = requiredClosingItems.filter((item) => item.done).length;
  const measurementProgress = measurementFields.length ? Math.round(((measurementFields.length - missingMeasurements.length) / measurementFields.length) * 100) : 0;
  const closingProgress = requiredClosingItems.length ? Math.round((completedClosingItems / requiredClosingItems.length) * 100) : 0;
  const documentationProgress = Math.round(((hasPdfProtocol ? 1 : 0) + (hasRequiredPhotos ? 1 : 0)) / 2 * 100);
  const orderProgressItems = [
    { label: "Vorbereitung", percent: measurementProgress, text: `Aufmaß ${measurementFields.length - missingMeasurements.length}/${measurementFields.length}` },
    { label: "Durchführung", percent: selectedChecklistProgress, text: `Checkliste ${selectedChecklistDone}/${selectedChecklistItems.length}` },
    { label: "Abschluss", percent: closingProgress, text: `${completedClosingItems}/${requiredClosingItems.length} Pflichtpunkte` },
    { label: "Dokumentation", percent: documentationProgress, text: `${hasRequiredPhotos ? "Fotos" : "Fotos offen"} · ${hasPdfProtocol ? "PDF" : "PDF offen"}` },
  ];
  const selectedOrderSyncStatus = getOrderSyncStatus(syncQueue, selectedOrder?.id, Boolean(lastSyncedAt));
  const filteredOrders = visibleOrders.filter((o) => [o.id, o.customer, o.address, o.status, o.priority, o.orderType, o.manufacturer, o.notes, o.internalNotes, o.technicianNote, productTypes.find((p) => p.id === o.product)?.name || "", ...(o.assignedMemberIds || []).map((id) => companyPeople.find((p) => p.id === id)?.name || "")].join(" ").toLowerCase().includes(orderSearch.toLowerCase()));
  const pendingPlanningOrderIds = useMemo(() => [...new Set(syncQueue.filter((item) => item.status !== "synced" && ["planning", "order"].includes(item.type)).map((item) => item.recordId).filter(Boolean))], [syncQueue]);
  const todaysOrders = visibleOrders.filter((o) => o.date === todayIso());
  const openReports = savedReports.filter((r) => r.status !== "Freigegeben");
  const activeOrders = visibleOrders.filter((o) => !["Erledigt", "Archiviert"].includes(normalizeOrderStatus(o.status)));
  const waitingPartOrders = visibleOrders.filter((o) => normalizeOrderStatus(o.status) === "Wartet auf Material");
  const reworkOrders = visibleOrders.filter((o) => String(o.orderType || "").toLowerCase().includes("nacharbeit") || String(o.status || "").toLowerCase().includes("nacharbeit"));
  const planningSummary = {
    plannedToday: todaysOrders.length,
    activePeople: new Set(todaysOrders.flatMap((order) => order.assignedMemberIds || [])).size,
    unplanned: visibleOrders.filter((order) => !order.date || (!(order.assignedMemberIds || []).length && !order.assignedTo)).length,
    materialProblems: visibleOrders.filter((order) => ["fehlt", "wartet auf Lieferung", "teilweise vorhanden"].includes(order.materialStatus)).length,
    rework: reworkOrders.length,
    openClosures: visibleOrders.filter((order) => normalizeOrderStatus(order.status) === "Abschluss offen").length,
  };
  const roleHome = roleHomeConfig[appRole] || roleHomeConfig.monteur;
  const learningUserId = currentPerson?.id || authUser?.id || "local-azubi";
  const learningUserName = currentPerson?.name || authUser?.name || "";
  const canViewLearningTeam = authUser?.role === "dev" || ["meister", "buero"].includes(appRole);
  const myReports = canViewLearningTeam ? savedReports : savedReports.filter((report) => report.userName === learningUserName || report.createdBy === learningUserId || (!report.userName && !report.createdBy));
  const learnerTrainingYear = Math.max(1, Math.min(4, Number(currentPerson?.trainingYear || reportYear || 1)));
  const currentLearningProgress = learningProgress?.[learningUserId] || {};
  const currentCurriculum = learningModules.filter((module) => module.year <= learnerTrainingYear);
  const completedLearningModules = currentCurriculum.filter((module) => isLearningModuleComplete(currentLearningProgress[module.id]));
  const openLearningModules = currentCurriculum.filter((module) => !isLearningModuleComplete(currentLearningProgress[module.id]));
  const nextYearLearningModules = learningModules.filter((module) => module.year > learnerTrainingYear && !isLearningModuleComplete(currentLearningProgress[module.id]));
  const recommendedLearningModules = [...openLearningModules, ...nextYearLearningModules].slice(0, 3);
  const learningDashboard = {
    open: openLearningModules.length,
    completed: completedLearningModules.length,
    total: currentCurriculum.length,
    percent: currentCurriculum.length ? Math.round((completedLearningModules.length / currentCurriculum.length) * 100) : 0,
    recommended: recommendedLearningModules,
    openReports: myReports.filter((report) => report.status !== "Freigegeben").length,
  };
  const currentCustomerOrders = appRole === "kunde" ? visibleOrders.map(sanitizeCustomerOrder) : visibleOrders.filter((o) => o.customerPersonId || o.customer);
  const currentCustomerDocuments = useMemo(() => {
    return getVisibleCustomerDocuments(pdfDocuments, currentCustomerOrders.map((order) => order.id));
  }, [currentCustomerOrders, pdfDocuments]);
  const currentOrderHistory = selectedOrder?.statusHistory || [{ status: selectedOrder?.status || "offen", at: selectedOrder?.updatedAt || selectedOrder?.createdAt || "", by: authUser?.name || "System", note: "Aktueller Status" }];
  const selectedWorkflowTemplate = orderWorkflowTemplates.find((t) => t.id === workflowTemplateId) || orderWorkflowTemplates[0];
  const diagnosisCategories = ["all", ...new Set(allDiagnosisTrees.map((d) => d.category))];
  const filteredMakers = allManufacturers.filter((m) => [m.name, ...(m.categories || []), ...(m.typicalProducts || []), ...(m.motors || []), ...(m.controls || []), ...(m.protocols || []), ...(m.sensors || []), ...(m.smartHome || []), ...(m.partCategories || []), ...(m.topics || []), ...(m.productIds || []), m.note].join(" ").toLowerCase().includes(manufacturerQuery.toLowerCase()));
  const net = Number(calc.count) * Number(calc.material) + Number(calc.labor) * Number(calc.rate) + Number(calc.travel) + Number(calc.wdvs) + Number(calc.disposal);
  const selectedReportTemplate = reportActivityTemplates.find((template) => template.id === reportTemplateId) || reportActivityTemplates[0];
  const reportCheckedItems = selectedChecklistItems.filter((item) => checks[selectedOrder?.id]?.[item]);
  const reportTerms = reportTechnicalTerms[reportYear] || [];
  const reportProposal = reportMode === "Wochenbericht" ? `Wochenbericht im Bereich Rollladen- und Sonnenschutztechnik. In dieser Woche habe ich am Auftrag ${selectedOrder?.id || "ohne Auftragsnummer"} für ${selectedOrder?.customer || "einen Kunden"} mitgearbeitet. Schwerpunkt war ${selectedProduct.name}. Folgende Tätigkeiten wurden durchgeführt: ${reportText}. Berücksichtigte Checklistenpunkte: ${reportCheckedItems.length ? reportCheckedItems.join(", ") : "noch keine"}. Lernfeld: ${reportLearningField}. Ausbildungsjahr: ${reportYear}. Fachbegriffe: ${reportTerms.join(", ")}.` : `Tagesbericht im Bereich Rollladen- und Sonnenschutztechnik. Ich habe am Auftrag ${selectedOrder?.id || "ohne Auftragsnummer"} für ${selectedOrder?.customer || "einen Kunden"} gearbeitet. Produkt/Anlage: ${selectedProduct.name}. Tätigkeitsschwerpunkt: ${selectedReportTemplate.label}. ${selectedReportTemplate.text} Eigene Stichpunkte: ${reportText}. Berücksichtigte Checklistenpunkte: ${reportCheckedItems.length ? reportCheckedItems.join(", ") : "noch keine"}. Lernfeld: ${reportLearningField}. Ausbildungsjahr: ${reportYear}. Verwendete Fachbegriffe: ${reportTerms.join(", ")}. Status: ${reportStatus}.`;
  const isModuleChecked = (scope, item) => Boolean(moduleChecks[scope]?.[item]);
  const toggleModuleCheck = (scope, item) => setModuleChecks((current) => ({ ...current, [scope]: { ...(current[scope] || {}), [item]: !current[scope]?.[item] } }));
  const checkButton = (scope, item) => <button key={item} onClick={() => toggleModuleCheck(scope, item)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left text-sm font-bold ${isModuleChecked(scope, item) ? "bg-emerald-50 text-emerald-900" : "bg-white text-slate-700"}`}><MiniCheck done={isModuleChecked(scope, item)} />{item}</button>;
  const markScopeDone = (scope, items = []) => setModuleChecks((current) => ({ ...current, [scope]: Object.fromEntries(items.map((item) => [item, true])) }));
  const updateLearningProgress = (learnerId, moduleId, checkpointId, checked) => {
    if (learnerId !== learningUserId) return;
    setLearningProgress((current) => ({
      ...(current || {}),
      [learnerId]: {
        ...((current || {})[learnerId] || {}),
        [moduleId]: {
          ...((current || {})[learnerId]?.[moduleId] || {}),
          [checkpointId]: checked,
          updatedAt: new Date().toISOString(),
          updatedBy: authUser?.name || "Nutzer",
        },
      },
    }));
    addToSyncQueue("Lernfortschritt geändert", { learnerId, moduleId, checkpointId, checked });
  };
  const saveQuizAnswer = (learnerId, card, correct) => {
    if (!card || learnerId !== learningUserId) return;
    setQuizProgress((current) => recordQuizAnswer(current, learnerId, card, correct));
    addToSyncQueue("Quizantwort gespeichert", { learnerId, questionId: card.id, correct }, { type: "quizProgress", recordId: `${learnerId}:${card.id}` });
  };
  const saveLearningPracticeCase = (practiceCase) => {
    if (!practiceCase?.id || practiceCase.learnerId !== learningUserId) return;
    setLearningPracticeCases((current) => [practiceCase, ...(Array.isArray(current) ? current : []).filter((item) => item.id !== practiceCase.id)]);
    addToSyncQueue("Praxisfall gespeichert", { learnerId: practiceCase.learnerId, recordId: practiceCase.id, status: practiceCase.status }, { type: "practiceCase", recordId: practiceCase.id });
    showNotice("Praxisfall wurde lokal gespeichert und zur Synchronisierung vorgemerkt.");
  };
  const createLearningPracticeCaseFromOrder = (order, learnerId = learningUserId) => {
    if (!order || learnerId !== learningUserId) return;
    const productName = productTypes.find((product) => product.id === order.product)?.name || order.product || "Anlage";
    const practiceCase = createPracticeCaseFromOrder(order, learnerId, productName);
    saveLearningPracticeCase(practiceCase);
    if (canOpenModule("learning")) setActive("learning");
  };
  const saveDiagnosisAsLearningCase = (session, tree) => {
    if (!session || !tree || !canOpenModule("learning")) { showNotice("Für diese Rolle ist der Lernbereich nicht freigegeben."); return; }
    saveLearningPracticeCase(createPracticeCaseFromDiagnosis(session, tree, learningUserId));
    setActive("learning");
  };
  const saveLearningAssignment = (assignment) => {
    if (!canViewLearningTeam || !assignment?.id) return;
    setLearningAssignments((current) => [assignment, ...(Array.isArray(current) ? current : []).filter((item) => item.id !== assignment.id)]);
    addToSyncQueue("Lernaufgabe zugewiesen", { learnerId: assignment.learnerId, recordId: assignment.id }, { type: "learningAssignment", recordId: assignment.id, immediate: true });
    showNotice("Lernaufgabe wurde zugewiesen.");
  };
  const updateLearningAssignment = (assignmentId, status) => {
    const assignment = learningAssignments.find((item) => item.id === assignmentId);
    if (!assignment || (!canViewLearningTeam && assignment.learnerId !== learningUserId)) return;
    setLearningAssignments((current) => current.map((item) => item.id === assignmentId ? { ...item, status, updatedAt: new Date().toISOString() } : item));
    addToSyncQueue("Lernaufgabe geändert", { learnerId: assignment.learnerId, recordId: assignmentId, status }, { type: "learningAssignment", recordId: assignmentId });
  };
  const saveLearningComment = (comment) => {
    if (!canViewLearningTeam || !comment?.id) return;
    setLearningComments((current) => [comment, ...(Array.isArray(current) ? current : []).filter((item) => item.id !== comment.id)]);
    addToSyncQueue("Lernkommentar gespeichert", { learnerId: comment.learnerId, recordId: comment.id }, { type: "learningComment", recordId: comment.id });
    showNotice("Kommentar wurde gespeichert.");
  };
  const updateLearningComment = (commentId, status) => {
    const comment = learningComments.find((item) => item.id === commentId);
    if (!comment || (!canViewLearningTeam && comment.learnerId !== learningUserId)) return;
    setLearningComments((current) => current.map((item) => item.id === commentId ? { ...item, status, updatedAt: new Date().toISOString() } : item));
    addToSyncQueue("Lernkommentar geändert", { learnerId: comment.learnerId, recordId: commentId, status }, { type: "learningComment", recordId: commentId });
  };
  const toggleLearningList = (learnerId, listName, moduleId) => {
    if (learnerId !== learningUserId || !["favorites", "later"].includes(listName)) return;
    setLearningLists((current) => {
      const learner = current?.[learnerId] || { favorites: [], later: [] };
      const values = learner[listName] || [];
      return { ...(current || {}), [learnerId]: { ...learner, [listName]: values.includes(moduleId) ? values.filter((id) => id !== moduleId) : [...values, moduleId] } };
    });
    addToSyncQueue("Lernliste geändert", { learnerId, moduleId, listName }, { type: "learningProgress", recordId: learnerId });
  };
  const prepareLearningReport = (text, practiceCase = null) => {
    setReportText(text || "");
    setReportStatus("Entwurf");
    if (practiceCase?.sourceType === "order" && orders.some((order) => order.id === practiceCase.sourceId)) setSelectedOrderId(practiceCase.sourceId);
    if (canOpenModule("reportBook")) setActive("reportBook");
    showNotice("Berichtsheft-Entwurf vorbereitet. Bitte prüfen und in eigenen Worten ergänzen.");
  };
  const openLearningReportBook = (draft = "") => {
    if (draft) setReportText(draft);
    if (canOpenModule("reportBook")) setActive("reportBook");
  };
  const reviewLearningReport = (reportId, status, comment) => {
    if (!canViewLearningTeam || !["Änderung erforderlich", "Freigegeben"].includes(status)) return;
    setSavedReports((current) => current.map((report) => report.id === reportId ? { ...report, status, masterComment: comment, reviewedAt: new Date().toISOString(), reviewedBy: authUser?.name || "Ausbildungsleitung" } : report));
    addToSyncQueue("Berichtsheft geprüft", { reportId, status }, { type: "reportBook", recordId: reportId, immediate: true });
    showNotice(status === "Freigegeben" ? "Bericht wurde freigegeben." : "Änderung wurde angefordert.");
  };
  const partRequestOrder = orders.find((order) => order.id === partRequest.orderId) || selectedOrder;
  const partPhotoScope = `ersatzteil-anfrage-${partRequest.draftKey || partRequest.id || partRequestOrder?.id || "neu"}`;
  const partPhotoChecks = moduleChecks[partPhotoScope] || {};
  const partPhotoRequirements = getPartPhotoRequirements(partRequest.product || partRequestOrder?.product);
  const partRequestText = buildPartRequestText(partRequest, partRequestOrder, partPhotoChecks);
  const customerTemplateForOrder = (text) => text.replaceAll("{kunde}", selectedOrder?.customer || "Kunde").replaceAll("{produkt}", selectedProduct.name).replaceAll("{termin}", `${selectedOrder?.date || "Termin"} ${selectedOrder?.time || ""}`.trim()).replaceAll("{adresse}", selectedOrder?.address || "Adresse");
  const currentPdfTemplate = pdfTemplateDefinitions[pdfTarget] || pdfTemplateDefinitions["Montageprotokoll"];
  const currentPdfValues = pdfFormData[selectedOrder?.id || "global"]?.[pdfTarget] || {};
  const getPdfAutoValue = (field) => {
    const measurementWidth = orderMeasurements["Breite"] || orderMeasurements["lichte Breite"] || "";
    const measurementHeight = orderMeasurements["Höhe"] || orderMeasurements["lichte Höhe"] || "";
    const map = {
      assignedTo: selectedOrder?.assignedTo || authUser?.name || "",
      date: selectedOrder?.date || todayIso(),
      today: todayIso(),
      time: selectedOrder?.time || "",
      customer: selectedOrder?.customer || "",
      installType: selectedOrder?.installType || "",
      width: measurementWidth,
      height: measurementHeight,
      workDone: `Montage/Arbeiten an ${selectedProduct.name}. ${selectedOrder?.notes || ""}`.trim(),
      checkedParts: selectedChecklistItems.join(", "),
      offerService: `Lieferung und Montage von ${selectedProduct.name} für ${selectedOrder?.customer || "den Kunden"}.`,
      material: String(calc.material ?? ""),
      labor: `${calc.labor} Std. à ${calc.rate} €`,
      travel: String(calc.travel ?? ""),
      net: net.toFixed(2),
      learningField: reportLearningField,
      reportProposal,
      masterComment: reportMasterComment,
    };
    return map[field.auto] ?? "";
  };
  const getPdfValue = (field) => currentPdfValues[field.key] ?? getPdfAutoValue(field) ?? "";
  const setPdfField = (key, value) => setPdfFormData((current) => {
    const orderKey = selectedOrder?.id || "global";
    return { ...current, [orderKey]: { ...(current[orderKey] || {}), [pdfTarget]: { ...((current[orderKey] || {})[pdfTarget] || {}), [key]: value } } };
  });
  const resetPdfTemplate = () => setPdfFormData((current) => {
    const orderKey = selectedOrder?.id || "global";
    const nextOrder = { ...(current[orderKey] || {}) };
    delete nextOrder[pdfTarget];
    return { ...current, [orderKey]: nextOrder };
  });
  const pdfFileName = createPdfFileName(pdfTarget, selectedOrder);
  const pdfPreviewLines = buildPdfPreview([
    `${company.name}`,
    "Rollladen- & Sonnenschutztechnik",
    "",
    `${currentPdfTemplate.title}`,
    `Dokumentstatus: ${pdfDocuments.find((doc) => doc.orderId === selectedOrder?.id && doc.template === pdfTarget)?.status || "Entwurf"}`,
    `Dateiname: ${pdfFileName}`,
    "",
    "KUNDEN- UND AUFTRAGSDATEN",
    `Auftrag: ${selectedOrder?.id || "-"}`,
    `Kunde: ${selectedOrder?.customer || "-"}`,
    `Adresse: ${selectedOrder?.address || "-"}`,
    `Kontakt: ${selectedOrder?.contact || "-"}`,
    `Telefon: ${selectedOrder?.phone || "-"}`,
    `Termin: ${selectedOrder?.date || "-"} ${selectedOrder?.time || ""}`,
    "",
    "ANLAGE / PRODUKT",
    `Produkt: ${selectedProduct.name}`,
    `Status: ${selectedOrder?.status || "-"}`,
    `Untergrund: ${selectedOrder?.substrate || "-"}`,
    `Antrieb: ${selectedOrder?.drive || "-"}`,
    `Einbauart: ${selectedOrder?.installType || "-"}`,
    `Notizen Auftrag: ${selectedOrder?.notes || "-"}`,
    "",
    "VORLAGENINHALT",
    ...currentPdfTemplate.fields.map((field) => `${field.label}: ${getPdfValue(field) || "-"}`),
    "",
    "QUALITÄTSPRÜFUNG",
    `Checkliste: ${selectedChecklistDone}/${selectedChecklistItems.length} erledigt`,
    `Aufmaß: ${measurementFields.length - missingMeasurements.length}/${measurementFields.length} Pflichtfelder ausgefüllt`,
    `Offene Punkte: ${unresolvedQuality.length ? unresolvedQuality.map((item) => item.label).join(", ") : "keine"}`,
    "",
    "UNTERSCHRIFTEN",
    "Monteur/Vorarbeiter: _______________________________",
    "Kunde/Auftraggeber: _______________________________",
  ]);
  const appendOrderEvent = (orderId, note, status = "") => {
    if (!orderId) return;
    const at = new Date().toLocaleString("de-DE");
    setOrders((list) => list.map((order) => order.id === orderId ? { ...order, updatedAt: at, statusHistory: [...(order.statusHistory || []), { status: status || order.status, at, by: authUser?.name || "System", note }] } : order));
  };
  const savePdfDocument = () => {
    const doc = {
      id: `PDF-${Date.now()}`,
      orderId: selectedOrder?.id || "",
      customer: selectedOrder?.customer || "",
      template: pdfTarget,
      status: "Erstellt",
      fileName: pdfFileName,
      createdAt: new Date().toLocaleString("de-DE"),
      text: pdfPreviewLines,
      customerVisible: false,
      customerStatus: "wartet auf Freigabe",
      customerPreview: [
        company.name,
        currentPdfTemplate.title,
        `Auftrag: ${selectedOrder?.id || "-"}`,
        `Produkt: ${selectedProduct.name}`,
        `Termin: ${selectedOrder?.date || "-"} ${selectedOrder?.time || ""}`.trim(),
        `Adresse: ${selectedOrder?.address || "-"}`,
        "Dieses Dokument wurde vom Fachbetrieb für die Kundenansicht vorbereitet.",
      ],
    };
    setPdfDocuments((docs) => [doc, ...docs]);
    addToSyncQueue("PDF-Dokument gespeichert", { orderId: selectedOrder?.id, template: pdfTarget });
    appendOrderEvent(selectedOrder?.id, `${pdfTarget} erstellt`);
    showNotice("PDF-Dokument wurde intern gespeichert. Eine Kundenfreigabe ist noch erforderlich.");
  };
  const updatePdfDocumentStatus = (id, status) => {
    setPdfDocuments((docs) => docs.map((doc) => doc.id === id ? { ...doc, status } : doc));
    addToSyncQueue("PDF-Dokumentstatus geändert", { recordId: id, status }, { type: "pdfMetadata", recordId: id });
    const document = pdfDocuments.find((item) => item.id === id);
    appendOrderEvent(document?.orderId, `Dokumentstatus auf ${status} gesetzt`);
  };
  const updateCustomerDocumentVisibility = (id, customerVisible) => {
    if (!canManageOrders) return;
    const visibleAt = customerVisible ? new Date().toISOString() : "";
    setPdfDocuments((docs) => docs.map((doc) => doc.id === id ? { ...doc, customerVisible, customerVisibleAt: visibleAt, customerStatus: customerVisible ? "verfügbar" : "wartet auf Freigabe" } : doc));
    const document = pdfDocuments.find((item) => item.id === id);
    addToSyncQueue(customerVisible ? "Dokument für Kunden freigegeben" : "Dokumentfreigabe zurückgenommen", { recordId: id, orderId: document?.orderId || "", customerVisible }, { type: "pdfMetadata", recordId: id, immediate: true });
    appendOrderEvent(document?.orderId, customerVisible ? `${document?.template || "Dokument"} für Kunden freigegeben` : "Kundenfreigabe eines Dokuments zurückgenommen");
    showNotice(customerVisible ? "Dokument ist jetzt im Kundenportal sichtbar." : "Dokument ist nicht mehr im Kundenportal sichtbar.");
  };
  const updateOrderById = (orderId, changes) => setOrders((list) => list.map((order) => order.id === orderId ? { ...order, ...changes, updatedAt: new Date().toLocaleString("de-DE") } : order));
  const saveCustomerPortalAction = (type, orderId, payload, label, syncType) => {
    if (appRole !== "kunde" || !currentCustomerOrders.some((order) => order.id === orderId)) return;
    const action = createCustomerAction(type, orderId, payload);
    setOrders((list) => list.map((order) => order.id === orderId ? applyCustomerActionToOrder(order, action) : order));
    addToSyncQueue(label, { orderId, portalAction: action }, { type: syncType, recordId: orderId, immediate: true });
    showNotice(offline ? "Ihre Änderung wurde lokal gespeichert und wird später übertragen." : "Ihre Änderung wurde gespeichert.");
  };
  const confirmCustomerAppointment = (order, request = null) => {
    if (order.customerConfirmed && request?.status !== "neuer Termin vorgeschlagen") return;
    saveCustomerPortalAction("appointment_confirmation", order.id, { requestId: request?.id || "" }, "Kundentermin bestätigt", "customerAppointment");
  };
  const requestCustomerAppointmentChange = (order, request) => saveCustomerPortalAction("appointment_change", order.id, request, "Terminänderung angefragt", "customerAppointment");
  const saveCustomerMessage = (message) => saveCustomerPortalAction("customer_message", message.orderId, message, "Kundenrückfrage gespeichert", "customerMessage");
  const saveCustomerIssue = (issue) => saveCustomerPortalAction("customer_issue", issue.orderId, issue, "Kundenmeldung gespeichert", "customerIssue");
  const saveMaintenanceRequest = (request) => saveCustomerPortalAction("maintenance_request", request.orderId, request, "Wartung angefragt", "maintenanceRequest");
  const confirmCustomerDocument = (document) => saveCustomerPortalAction("customer_approval", document.orderId, { approvalType: `Kenntnisnahme ${document.template}`, documentId: document.id }, "Kundenfreigabe bestätigt", "customerApproval");
  const confirmCustomerApproval = (order, approvalType) => saveCustomerPortalAction("customer_approval", order.id, { approvalType }, "Kundenfreigabe bestätigt", "customerApproval");
  const updateCustomerEntry = (collection, entryId, changes) => {
    if (!selectedOrder || !canManageOrders) return;
    setOrders((list) => list.map((order) => order.id === selectedOrder.id ? updateCustomerPortalEntry(order, collection, entryId, changes) : order));
    addToSyncQueue("Kundenanfrage bearbeitet", { orderId: selectedOrder.id, recordId: entryId, collection }, { type: "order", recordId: selectedOrder.id, immediate: true });
  };
  const showNotice = (message) => { setNotice(message); setTimeout(() => setNotice(""), 1600); };
  const updateSyncQueue = (updater) => setSyncQueue((queue) => {
    const next = updater(queue);
    syncQueueRef.current = next;
    return next;
  });
  const addToSyncQueue = (action, data = {}, options = {}) => updateSyncQueue((queue) => enqueueSyncItem(queue, action, data, offline, options));
  const queueLocalChange = () => updateSyncQueue((queue) => replaceLocalChange(queue, offline, { ownerId: authUser?.id || "local", orderId: selectedOrder?.id || "" }));
  const ensureSyncRetryQueued = (message) => updateSyncQueue((queue) => ensureRetryQueued(queue, message, offline));
  const markQueueSynced = (identifiers) => updateSyncQueue((queue) => markQueueItemsSynced(queue, identifiers));
  const retrySync = () => {
    updateSyncQueue(retryFailedQueue);
    setSyncError("");
    showNotice(offline ? "Erneuter Sync vorgemerkt. Die App bleibt lokal nutzbar." : "Synchronisierung wird erneut versucht.");
  };
  const savePartRequestDraft = () => {
    const requestId = partRequest.id || `ET-${Date.now()}`;
    const existing = partRequests.find((request) => request.id === requestId);
    const photoChecklist = Object.fromEntries(partPhotoRequirements.map((item) => [item, Boolean(partPhotoChecks[item])]));
    const request = {
      ...partRequest,
      id: requestId,
      draftKey: partRequest.draftKey || requestId,
      orderId: partRequest.orderId || partRequestOrder?.id || "",
      customer: partRequest.customer || partRequestOrder?.customer || "",
      status: partRequest.status || "Entwurf",
      photoChecklist,
      photoComplete: partPhotoRequirements.every((item) => photoChecklist[item]),
      requestText: buildPartRequestText(partRequest, partRequestOrder, photoChecklist),
      createdAt: existing?.createdAt || new Date().toLocaleString("de-DE"),
      updatedAt: new Date().toLocaleString("de-DE"),
    };
    setPartRequests((requests) => existing ? requests.map((item) => item.id === requestId ? request : item) : [request, ...requests]);
    setPartRequest(request);
    addToSyncQueue("Ersatzteil-Anfrage als Entwurf gespeichert", { requestId, orderId: request.orderId });
    appendOrderEvent(request.orderId, `Ersatzteil-Anfrage ${requestId} als Entwurf gespeichert`);
    showNotice("Ersatzteil-Anfrage wurde lokal als Entwurf gespeichert.");
  };
  const loadPartRequestDraft = (request) => {
    setPartRequest({ ...createEmptyPartRequest(), ...request, draftKey: request.draftKey || request.id });
    setPartMode("request");
    if (request.orderId && orders.some((order) => order.id === request.orderId)) setSelectedOrderId(request.orderId);
    showNotice(`Entwurf ${request.id} wurde geladen.`);
  };
  const newPartRequestDraft = () => {
    setPartRequest(createEmptyPartRequest(selectedOrder));
    setPartMode("request");
    showNotice("Neue Ersatzteil-Anfrage vorbereitet.");
  };
  const updatePartRequestStatus = (requestId, status) => {
    setPartRequests((requests) => requests.map((request) => request.id === requestId ? { ...request, status, updatedAt: new Date().toLocaleString("de-DE") } : request));
    setPartRequest((request) => request.id === requestId ? { ...request, status } : request);
    addToSyncQueue("Ersatzteil-Status geändert", { requestId, status });
    const request = partRequests.find((item) => item.id === requestId);
    appendOrderEvent(request?.orderId, `Ersatzteil-Status auf ${status} gesetzt`);
    showNotice(`Status auf „${status}“ gesetzt. Es wurde keine E-Mail versendet.`);
  };
  const saveSketchRecord = (sketch) => {
    setSavedSketches((current) => [sketch, ...(Array.isArray(current) ? current : [])].slice(0, 30));
    setSketchImage(sketch.image);
    addToSyncQueue("Skizze gespeichert", { sketchId: sketch.id, orderId: sketch.orderId || "" });
    appendOrderEvent(sketch.orderId, `Skizze ${sketch.title || sketch.useCase || sketch.id} gespeichert`);
    showNotice("Skizze wurde lokal gespeichert.");
  };
  const deleteSketchRecord = (sketch) => {
    setSavedSketches((current) => (Array.isArray(current) ? current : []).filter((item) => item.id !== sketch.id));
    addToSyncQueue("Skizze gelöscht", { sketchId: sketch.id, orderId: sketch.orderId || "" });
    showNotice("Gespeicherte Skizze wurde gelöscht.");
  };
  const addSyncLog = (action, status = "ok") => setSyncLog((log) => [{ id: Date.now(), action, status, timestamp: new Date().toLocaleString("de-DE"), user: authUser?.name || "System" }, ...log].slice(0, 20));
  const setBackendMessage = (message) => { setSupabaseStatus(message); setNotice(message); setTimeout(() => setNotice(""), 1800); };
  const requireSupabase = () => {
    if (!isSupabaseConfigured || !supabase) {
      setBackendMessage("Supabase ist noch nicht verbunden. Prüfe VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in Vercel.");
      return false;
    }
    return true;
  };
  const rowToCompany = (row) => ({
    id: row.id,
    name: row.name,
    contactPhone: row.contact_phone || row.contactPhone || "",
    contactEmail: row.contact_email || row.contactEmail || "",
    createdAt: row.created_at ? new Date(row.created_at).toLocaleString("de-DE") : company.createdAt,
  });
  const companyToRow = (data, userId) => ({
    id: data.id,
    name: data.name,
    contact_phone: data.contactPhone || "",
    contact_email: data.contactEmail || "",
    owner_id: userId || null,
  });
  const personToRow = (person, companyId) => ({
    id: person.id,
    company_id: companyId,
    name: person.name,
    role: person.role,
    access_code: person.accessCode,
    status: person.status,
    phone: person.phone || "",
    email: person.email || "",
    address: person.address || "",
    team: person.team || "",
    training_year: person.trainingYear || "",
    progress: Number(person.progress || 0),
  });
  const rowToPerson = (row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    accessCode: row.access_code,
    status: row.status,
    phone: row.phone || "",
    email: row.email || "",
    address: row.address || "",
    team: row.team || "",
    trainingYear: row.training_year || "",
    progress: Number(row.progress || 0),
    createdAt: row.created_at ? new Date(row.created_at).toLocaleString("de-DE") : "",
  });
  const absenceToRow = (absence, companyId) => ({
    id: absence.id,
    company_id: companyId,
    person_id: absence.personId,
    start_date: absence.startDate,
    end_date: absence.endDate,
    type: absence.type,
    note: absence.note || "",
    created_at: absence.createdAt || new Date().toISOString(),
    updated_at: absence.updatedAt || new Date().toISOString(),
  });
  const rowToAbsence = (row) => ({
    id: row.id,
    companyId: row.company_id,
    personId: row.person_id,
    startDate: row.start_date,
    endDate: row.end_date,
    type: row.type,
    note: row.note || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  });
  const applyRemoteSnapshot = (snapshot = {}) => {
    if (snapshot.company) setCompany(snapshot.company);
    if (snapshot.companyPeople) setCompanyPeople(snapshot.companyPeople);
    if (Array.isArray(snapshot.planningAbsences)) setPlanningAbsences(snapshot.planningAbsences);
    if (snapshot.orders) setOrders(snapshot.orders);
    if (snapshot.checks) setChecks(snapshot.checks);
    if (snapshot.notes) setNotes(snapshot.notes);
    if (snapshot.savedReports) setSavedReports(snapshot.savedReports);
    if (snapshot.measurementValues) setMeasurementValues(snapshot.measurementValues);
    if (snapshot.manualQuality) setManualQuality(snapshot.manualQuality);
    if (snapshot.photos && typeof snapshot.photos === "object") setPhotos(snapshot.photos);
    if (snapshot.photoAnalyses) setPhotoAnalyses(snapshot.photoAnalyses);
    if (snapshot.pdfDocuments) setPdfDocuments(snapshot.pdfDocuments);
    if (snapshot.moduleChecks) setModuleChecks(snapshot.moduleChecks);
    if (Array.isArray(snapshot.partRequests)) setPartRequests(snapshot.partRequests);
    if (snapshot.learningProgress && typeof snapshot.learningProgress === "object") setLearningProgress(snapshot.learningProgress);
    if (snapshot.quizProgress && typeof snapshot.quizProgress === "object") setQuizProgress(snapshot.quizProgress);
    if (Array.isArray(snapshot.learningPracticeCases)) setLearningPracticeCases(snapshot.learningPracticeCases);
    if (Array.isArray(snapshot.learningAssignments)) setLearningAssignments(snapshot.learningAssignments);
    if (Array.isArray(snapshot.learningComments)) setLearningComments(snapshot.learningComments);
    if (snapshot.learningLists && typeof snapshot.learningLists === "object") setLearningLists(snapshot.learningLists);
    if (typeof snapshot.sketchImage === "string") setSketchImage(snapshot.sketchImage);
    if (Array.isArray(snapshot.savedSketches)) setSavedSketches(snapshot.savedSketches);
    if (Array.isArray(snapshot.manufacturerFavorites)) setManufacturerFavorites(snapshot.manufacturerFavorites);
    if (Array.isArray(snapshot.motorFavorites)) setMotorFavorites(snapshot.motorFavorites);
    if (Array.isArray(snapshot.technicalRecents)) setTechnicalRecents(snapshot.technicalRecents);
    if (snapshot.technicalNotes && typeof snapshot.technicalNotes === "object") setTechnicalNotes(snapshot.technicalNotes);
    if (Array.isArray(snapshot.diagnosisFavorites)) setDiagnosisFavorites(snapshot.diagnosisFavorites);
    if (Array.isArray(snapshot.diagnosisRecents)) setDiagnosisRecents(snapshot.diagnosisRecents);
    if (Array.isArray(snapshot.diagnosisSessions)) setDiagnosisSessions(snapshot.diagnosisSessions);
    if (snapshot.orders?.[0]?.id) setSelectedOrderId(snapshot.orders[0].id);
  };
  const applyPersonalLearningRecord = (personId, data = {}) => {
    if (!personId || !data || typeof data !== "object") return;
    const mergeRows = (current, incoming, belongsToPerson) => {
      const currentRows = Array.isArray(current) ? current : [];
      const others = currentRows.filter((item) => !belongsToPerson(item));
      const merged = new Map();
      for (const item of [...currentRows.filter(belongsToPerson), ...(Array.isArray(incoming) ? incoming : [])]) {
        const existing = merged.get(item.id);
        const itemTime = Date.parse(item.updatedAt || item.reviewedAt || item.createdAt || 0) || 0;
        const existingTime = Date.parse(existing?.updatedAt || existing?.reviewedAt || existing?.createdAt || 0) || 0;
        if (!existing || itemTime >= existingTime) merged.set(item.id, item);
      }
      return [...merged.values(), ...others];
    };
    if (data.learningProgress && typeof data.learningProgress === "object") setLearningProgress((current) => ({ ...(current || {}), [personId]: data.learningProgress }));
    if (data.quizProgress && typeof data.quizProgress === "object") setQuizProgress((current) => ({ ...(current || {}), [personId]: data.quizProgress }));
    if (data.learningLists && typeof data.learningLists === "object") setLearningLists((current) => ({ ...(current || {}), [personId]: data.learningLists }));
    if (Array.isArray(data.practiceCases)) setLearningPracticeCases((current) => mergeRows(current, data.practiceCases, (item) => item.learnerId === personId));
    if (Array.isArray(data.assignments)) setLearningAssignments((current) => mergeRows(current, data.assignments, (item) => item.learnerId === personId));
    if (Array.isArray(data.comments)) setLearningComments((current) => mergeRows(current, data.comments, (item) => item.learnerId === personId));
    if (Array.isArray(data.reports)) setSavedReports((current) => mergeRows(current, data.reports, (item) => item.createdBy === personId));
  };
  const saveAppToSupabase = async (overrideCompany = null, options = {}) => {
    if (!requireSupabase()) return false;
    if (offline) {
      ensureSyncRetryQueued("Offline");
      return false;
    }
    if (syncInFlightRef.current) {
      syncRetryRequestedRef.current = true;
      return false;
    }
    const currentQueue = syncQueueRef.current;
    const allSyncItems = getSyncableQueueItems(currentQueue, { includeFailed: Boolean(options.force) });
    const customerRole = authUser?.role === "kunde";
    const personalLearningRole = ["azubi", "monteur", "vorarbeiter"].includes(authUser?.role);
    const assignedFieldRole = ["monteur", "vorarbeiter"].includes(authUser?.role);
    const learningTypes = new Set(["learningProgress", "quizProgress", "practiceCase", "reportBook", "learningAssignment", "learningComment"]);
    const personalLearningItems = allSyncItems.filter((item) => learningTypes.has(item.type));
    const customerPortalItems = customerRole ? allSyncItems.filter((item) => CUSTOMER_SYNC_TYPES.has(item.type)) : [];
    const assignedOrderItems = assignedFieldRole ? allSyncItems.filter((item) => ["order", "planning"].includes(item.type)) : [];
    const hasPersonalChanges = personalLearningItems.length || assignedOrderItems.length;
    const syncItems = customerRole
      ? customerPortalItems
      : personalLearningRole
      ? (hasPersonalChanges ? allSyncItems.filter((item) => learningTypes.has(item.type) || ["order", "planning", "snapshot"].includes(item.type)) : [])
      : allSyncItems;
    const syncItemIds = syncItems.map((item) => item.id);
    if (!syncItemIds.length && !overrideCompany && !options.forceSnapshot) return true;

    if (syncItemIds.length) updateSyncQueue((queue) => markQueueSyncing(queue, syncItemIds));
    syncInFlightRef.current = true;
    setSyncing(true);
    try {
      const activeCompany = overrideCompany || company;
      const snapshot = { ...createSnapshot(), company: activeCompany, companyPeople, orders, savedAt: new Date().toISOString() };
      const timestamp = new Date().toISOString();
      const deletedOrderIds = syncItems
        .filter((item) => item.type === "order" && item.action.toLocaleLowerCase("de-DE").includes("gelöscht"))
        .map((item) => item.recordId)
        .filter(Boolean);
      const deletedAbsenceIds = syncItems
        .filter((item) => item.type === "absence" && item.action.toLocaleLowerCase("de-DE").includes("gelÃ¶scht"))
        .map((item) => item.recordId)
        .filter(Boolean);

      if (customerRole) {
        await saveCustomerPortalChanges({ client: supabase, companyId: activeCompany.id, items: customerPortalItems });
      } else if (personalLearningRole) {
        if (personalLearningItems.length) {
          await saveLearningRecord({
            client: supabase,
            learningRow: {
              company_id: activeCompany.id,
              person_id: learningUserId,
              data: {
                learningProgress: learningProgress?.[learningUserId] || {},
                quizProgress: quizProgress?.[learningUserId] || {},
                practiceCases: learningPracticeCases.filter((item) => item.learnerId === learningUserId),
                assignments: learningAssignments.filter((item) => item.learnerId === learningUserId),
                comments: learningComments.filter((item) => item.learnerId === learningUserId),
                learningLists: learningLists?.[learningUserId] || {},
                reports: savedReports.filter((item) => item.createdBy === learningUserId || (!item.createdBy && item.userName === learningUserName)),
              },
              updated_at: timestamp,
            },
          });
        }
        if (assignedOrderItems.length) {
          const changedOrderIds = new Set(assignedOrderItems.map((item) => item.recordId));
          await saveAssignedOrderChanges({ client: supabase, companyId: activeCompany.id, orders: orders.filter((order) => changedOrderIds.has(order.id)) });
        }
      } else {
        await saveCompanySnapshot({
          client: supabase,
          companyRow: companyToRow(activeCompany),
          peopleRows: companyPeople.map((person) => personToRow(person, activeCompany.id)),
          orderRows: orders.map((order) => ({ id: order.id, company_id: activeCompany.id, customer_id: order.customerPersonId || null, data: order, updated_at: timestamp })),
          deletedOrderIds,
          absenceRows: planningAbsences.map((absence) => absenceToRow(absence, activeCompany.id)),
          deletedAbsenceIds,
          snapshotRow: { company_id: activeCompany.id, snapshot, updated_at: timestamp },
        });
      }
      const syncedAt = new Date().toISOString();
      setLastSyncedAt(syncedAt);
      setSyncError("");
      addSyncLog(options.quiet ? "Auto-Sync gespeichert" : "Supabase gespeichert");
      if (syncItemIds.length) markQueueSynced(syncItemIds);
      if (!options.quiet) setBackendMessage("Daten wurden in Supabase gespeichert.");
      return true;
    } catch (error) {
      addSyncLog(`Supabase Fehler: ${error.message}`, "fehler");
      setSyncError(error.message || "Cloud-Sync fehlgeschlagen.");
      if (syncItemIds.length) updateSyncQueue((queue) => markQueueFailed(queue, syncItemIds, error.message));
      else ensureSyncRetryQueued(error.message || "Cloud-Sync fehlgeschlagen");
      if (!options.quiet) setBackendMessage("Änderungen wurden lokal gespeichert und später synchronisiert.");
      return false;
    } finally {
      syncInFlightRef.current = false;
      setSyncing(false);
      if (syncRetryRequestedRef.current && !offline) {
        syncRetryRequestedRef.current = false;
        window.setTimeout(() => saveAppToSupabase(null, { quiet: true }), 500);
      }
    }
  };
  const loadAppFromSupabase = async (companyId = company.id, targetRole = authUser?.role || appRole, targetPersonId = authUser?.personId) => {
    if (!requireSupabase()) return false;
    try {
      const isCustomerAccount = targetRole === "kunde";
      const preserveLocalChanges = !isCustomerAccount && getQueueSummary(syncQueueRef.current).unsynced > 0;
      const { absenceErrorMessage, learningRecord, learningRecordError, remoteAbsences, snap, portalData, portalErrorMessage, remotePeople, remoteOrders } = await withTimeout((async () => {
        let snap = null;
        let portalData = null;
        let portalErrorMessage = "";
        let remoteAbsences = null;
        let absenceErrorMessage = "";
        let learningRecord = null;
        let learningRecordError = "";
        if (isCustomerAccount) {
          const { data, error } = await supabase.rpc("get_customer_portal_data", { p_company_id: companyId });
          portalData = data || null;
          portalErrorMessage = error?.message || "";
        } else {
          const { data, error: snapError } = await supabase.from("app_snapshots").select("snapshot").eq("company_id", companyId).maybeSingle();
          if (snapError) throw snapError;
          snap = data;
        }
        let remotePeople = [];
        if (!isCustomerAccount) {
          const { data, error: peopleError } = await supabase.from("company_people").select("*").eq("company_id", companyId).order("created_at", { ascending: false });
          if (peopleError) throw peopleError;
          remotePeople = data || [];
        }
        let remoteOrders = [];
        if (!isCustomerAccount) {
          const { data, error: ordersError } = await supabase.from("orders").select("*").eq("company_id", companyId).order("updated_at", { ascending: false });
          if (ordersError) throw ordersError;
          remoteOrders = data || [];
          const { data: absenceRows, error: absenceError } = await supabase.from("company_absences").select("*").eq("company_id", companyId).order("start_date", { ascending: true });
          if (absenceError) absenceErrorMessage = absenceError.message || "Abwesenheiten konnten nicht geladen werden.";
          else remoteAbsences = absenceRows || [];
          if (targetPersonId) {
            try {
              const row = await loadLearningRecord({ client: supabase, companyId, personId: targetPersonId });
              learningRecord = row?.data || null;
            } catch (error) {
              learningRecordError = error.message || "Persönlicher Lernstand konnte nicht geladen werden.";
            }
          }
        }
        return { absenceErrorMessage, learningRecord, learningRecordError, remoteAbsences, snap, portalData, portalErrorMessage, remotePeople, remoteOrders };
      })());
      if (isCustomerAccount) {
        if (portalErrorMessage) throw new Error("Kundenportal konnte nicht sicher geladen werden.");
        if (portalData?.customer) setCompanyPeople([{ ...portalData.customer, role: "kunde", status: "aktiv" }]);
        else setCompanyPeople((people) => people.filter((person) => person.id === targetPersonId));
        if (portalData?.company) setCompany((current) => ({ ...current, ...portalData.company }));
        const pendingCustomerItems = syncQueueRef.current.filter((item) => item.status !== "synced" && CUSTOMER_SYNC_TYPES.has(item.type));
        setOrders((localOrders) => mergeCustomerPortalOrders(localOrders, Array.isArray(portalData?.orders) ? portalData.orders : [], pendingCustomerItems));
        setPdfDocuments(Array.isArray(portalData?.pdfDocuments) ? portalData.pdfDocuments : []);
      } else if (!preserveLocalChanges) {
        if (snap?.snapshot) applyRemoteSnapshot(snap.snapshot);
        if (remotePeople?.length) setCompanyPeople(remotePeople.map(rowToPerson));
        if (remoteOrders?.length) setOrders(remoteOrders.map((row) => row.data));
        if (Array.isArray(remoteAbsences)) setPlanningAbsences(remoteAbsences.map(rowToAbsence));
        if (learningRecord && targetPersonId) applyPersonalLearningRecord(targetPersonId, learningRecord);
      } else {
        addSyncLog("Lokale Änderungen vor Cloud-Stand priorisiert");
      }
      if (learningRecordError) addSyncLog(`Persönlicher Lern-Sync nicht verfügbar: ${learningRecordError}`, "fehler");
      if (absenceErrorMessage) addSyncLog(`Planungs-Sync nicht verfügbar: ${absenceErrorMessage}`, "fehler");
      if (!preserveLocalChanges) setLastSyncedAt(new Date().toISOString());
      setSyncError("");
      addSyncLog("Supabase geladen");
      return true;
    } catch (error) {
      addSyncLog(`Supabase Ladefehler: ${error.message}`, "fehler");
      setSyncError(error.message || "Cloud-Daten konnten nicht geladen werden.");
      return false;
    }
  };
  const loadCurrentCompanyFromSupabase = async () => {
    if (!requireSupabase()) return;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData?.user) throw new Error("Kein Supabase-Nutzer angemeldet.");
      const { data: membership, error: membershipError } = await supabase.from("company_people").select("*, companies(*)").eq("auth_user_id", authData.user.id).limit(1).maybeSingle();
      if (membershipError) throw membershipError;
      if (!membership) throw new Error("Für diesen Nutzer wurde noch keine Firma gefunden.");
      const nextCompany = rowToCompany(membership.companies);
      setCompany(nextCompany);
      setCloudCompanyId(nextCompany.id);
      const user = { id: authData.user.id, personId: membership.id, name: membership.name, email: authData.user.email || `${membership.access_code}@code.local`, role: membership.role, company: nextCompany.name, companyId: nextCompany.id, loginType: authData.user.is_anonymous ? "code" : "email", loggedInAt: new Date().toLocaleString("de-DE") };
      setAuthUser(user);
      setRole(membership.role);
      await loadAppFromSupabase(nextCompany.id, membership.role, membership.id);
      setBackendMessage("Supabase-Account geladen.");
    } catch (error) {
      setBackendMessage(`Supabase Loginfehler: ${error.message}`);
    }
  };
  const createCompanyForSignedInUser = async (registration = pendingRegistration || loginForm) => {
    if (!requireSupabase()) return;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData?.user) throw new Error("Bitte zuerst die E-Mail bestätigen oder einloggen.");
      const companyId = cloudCompanyId && cloudCompanyId !== "betrieb-muster" ? cloudCompanyId : `betrieb-${authData.user.id.slice(0, 8)}`;
      const adminName = registration?.name || loginForm.name || authData.user.email || "Firma Admin";
      const companyName = registration?.company || loginForm.company || "Mein Betrieb";
      const { data: rpcCompany, error: rpcError } = await supabase.rpc("create_company_for_current_user", { p_company_id: companyId, p_company_name: companyName, p_admin_name: adminName });
      if (rpcError) throw rpcError;
      const nextCompany = rowToCompany(Array.isArray(rpcCompany) ? rpcCompany[0] : rpcCompany);
      setCompany(nextCompany);
      setCloudCompanyId(nextCompany.id);
      setPendingRegistration(null);
      setAuthUser({ id: authData.user.id, name: adminName, email: authData.user.email || registration?.email || loginForm.email, role: "meister", company: nextCompany.name, companyId: nextCompany.id, loginType: "email", loggedInAt: new Date().toLocaleString("de-DE") });
      setRole("meister");
      await saveAppToSupabase(nextCompany);
      setBackendMessage("E-Mail bestätigt. Firma wurde erstellt und Cloud-Sync ist aktiv.");
    } catch (error) {
      setBackendMessage(`Firma konnte nicht erstellt werden: ${error.message}`);
    }
  };
  const registerCompanyWithSupabase = async () => {
    if (!requireSupabase()) return;
    try {
      const registration = { name: loginForm.name.trim(), email: loginForm.email.trim(), company: loginForm.company.trim(), createdAt: new Date().toISOString() };
      const { error: signUpError } = await supabase.auth.signUp({
        email: registration.email,
        password: loginForm.password,
        options: {
          data: { name: registration.name, role: "meister", company: registration.company },
          emailRedirectTo: window.location.origin,
        },
      });
      if (signUpError) throw signUpError;
      setPendingRegistration(registration);
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        setBackendMessage("Registrierung erstellt. Bitte bestätige deine E-Mail. Danach hier auf 'E-Mail bestätigt – weiter' klicken.");
        return;
      }
      await createCompanyForSignedInUser(registration);
    } catch (error) {
      setBackendMessage(`Registrierung fehlgeschlagen: ${error.message}`);
    }
  };
  const resendConfirmationEmail = async () => {
    if (!requireSupabase()) return;
    const email = pendingRegistration?.email || loginForm.email.trim();
    if (!email) {
      setBackendMessage("Bitte zuerst eine E-Mail-Adresse eintragen.");
      return;
    }
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setBackendMessage(`Bestätigungsmail wurde erneut an ${email} gesendet.`);
    } catch (error) {
      setBackendMessage(`Bestätigungsmail konnte nicht erneut gesendet werden: ${error.message}`);
    }
  };

  const finishEmailConfirmation = async () => {
    if (!requireSupabase()) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        setBackendMessage("Noch keine bestätigte Sitzung gefunden. Öffne den neuesten Bestätigungslink aus deiner E-Mail und klicke danach erneut auf 'E-Mail bestätigt – weiter'.");
        return;
      }
      await createCompanyForSignedInUser(pendingRegistration || loginForm);
    } catch (error) {
      setBackendMessage(`Bestätigung konnte nicht abgeschlossen werden: ${error.message}`);
    }
  };

  const clearPendingRegistration = () => {
    setPendingRegistration(null);
    setBackendMessage("Du kannst jetzt neue Anmeldedaten eintragen.");
  };

  const signInCompanyWithSupabase = async () => {
    if (!requireSupabase()) return;
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: loginForm.email, password: loginForm.password });
      if (error) throw error;
      await loadCurrentCompanyFromSupabase();
    } catch (error) {
      setBackendMessage(`Login fehlgeschlagen: ${error.message}`);
    }
  };
  const loginWithPersonalCodeSupabase = async () => {
    if (!requireSupabase()) return false;
    try {
      const { error: anonError } = await supabase.auth.signInAnonymously();
      if (anonError) throw new Error(`${anonError.message}. Prüfe in Supabase: Authentication → Providers → Anonymous Sign-ins aktivieren.`);
      const { data, error } = await supabase.rpc("claim_person_access", { p_name: codeLogin.name.trim(), p_code: codeLogin.code.trim().toUpperCase() });
      if (error) throw error;
      const result = Array.isArray(data) ? data[0] : data;
      if (!result?.person) throw new Error("Name oder Code wurde in Supabase nicht gefunden.");
      const nextCompany = result.company;
      const person = result.person;
      setCompany(nextCompany);
      setCloudCompanyId(nextCompany.id);
      const user = { id: result.auth_user_id || `LOGIN-${person.id}`, personId: person.id, name: person.name, email: `${person.accessCode.toLowerCase()}@code.local`, role: person.role, company: nextCompany.name, companyId: nextCompany.id, loginType: "supabase-code", loggedInAt: new Date().toLocaleString("de-DE") };
      setAuthUser(user);
      setRole(person.role);
      await loadAppFromSupabase(nextCompany.id, person.role, person.id);
      setActive("dashboard");
      setBackendMessage(`Angemeldet über Supabase als ${personRoleLabel(person.role)}.`);
      return true;
    } catch (error) {
      setBackendMessage(`Code-Login fehlgeschlagen: ${error.message}`);
      return false;
    }
  };
  const logoutSupabase = () => {
    setAuthUser(null);
    setInitialCloudLoaded(false);
    setSyncError("");
    setActive("dashboard");
    addSyncLog("Supabase Logout");
    setBackendMessage("Abgemeldet.");
    if (supabase) supabase.auth.signOut().catch(() => {});
  };

  const roleLabel = (roleId) => roles.find((r) => r.id === roleId)?.label || roleId;
  const personRoleLabel = (roleId) => teamRoleOptions.find((r) => r.id === roleId)?.label || roleLabel(roleId);
  const teamMembers = companyPeople.filter((p) => p.role !== "kunde");
  const companyCustomers = companyPeople.filter((p) => p.role === "kunde");
  const createCompanyPerson = () => {
    if (!personForm.name.trim()) { showNotice("Bitte Namen eintragen."); return; }
    const option = teamRoleOptions.find((item) => item.id === personForm.role) || teamRoleOptions.find((item) => item.id === "monteur") || teamRoleOptions[0];
    const person = {
      id: `P-${Date.now()}`,
      name: personForm.name.trim(),
      role: personForm.role,
      accessCode: makeCode(option.prefix),
      status: "aktiv",
      phone: personForm.phone,
      address: personForm.address,
      team: personForm.role === "kunde" ? "" : personForm.team,
      trainingYear: personForm.role === "azubi" ? personForm.trainingYear : "",
      progress: 0,
      createdAt: new Date().toLocaleString("de-DE"),
    };
    setCompanyPeople((list) => [person, ...list]);
    setPersonForm({ name: "", role: "monteur", phone: "", address: "", team: "Kolonne 1", trainingYear: "1" });
    addToSyncQueue("team.person.created", { personId: person.id });
    showNotice(`${personRoleLabel(person.role)} wurde erstellt. Code: ${person.accessCode}`);
  };
  const updateCompanyPerson = (personId, changes) => {
    setCompanyPeople((list) => list.map((person) => person.id === personId ? {
      ...person,
      ...changes,
      team: changes.role === "kunde" ? "" : changes.team,
      trainingYear: changes.role === "azubi" ? changes.trainingYear : "",
      updatedAt: new Date().toLocaleString("de-DE"),
    } : person));
    addToSyncQueue("team.person.updated", { personId });
    showNotice("Person wurde aktualisiert.");
  };
  const regeneratePersonCode = (personId) => {
    setCompanyPeople((list) => list.map((p) => {
      if (p.id !== personId) return p;
      const option = teamRoleOptions.find((item) => item.id === p.role) || teamRoleOptions.find((item) => item.id === "monteur") || teamRoleOptions[0];
      return { ...p, accessCode: makeCode(option.prefix), updatedAt: new Date().toLocaleString("de-DE") };
    }));
    addToSyncQueue("team.person.code-regenerated", { personId });
    showNotice("Persönlicher Code wurde neu generiert.");
  };
  const setPersonStatus = (personId, status) => {
    setCompanyPeople((list) => list.map((person) => person.id === personId ? {
      ...person,
      status,
      archivedAt: status === "archiviert" ? person.archivedAt : "",
      updatedAt: new Date().toLocaleString("de-DE"),
    } : person));
    addToSyncQueue("team.person.status", { personId, status });
    showNotice(status === "aktiv" ? "Zugang wurde aktiviert." : "Zugang wurde deaktiviert.");
  };
  const archivePerson = (personId) => {
    setCompanyPeople((list) => list.map((person) => person.id === personId ? {
      ...person,
      status: "archiviert",
      archivedAt: new Date().toISOString(),
      updatedAt: new Date().toLocaleString("de-DE"),
    } : person));
    addToSyncQueue("team.person.archived", { personId });
    showNotice("Person wurde archiviert. Bestehende Auftragszuweisungen bleiben erhalten.");
  };
  const loginWithPersonalCode = async () => {
    if (isSupabaseConfigured && supabase) {
      const ok = await loginWithPersonalCodeSupabase();
      if (ok) return;
    }
    const normalizedName = codeLogin.name.trim().toLowerCase();
    const normalizedCode = codeLogin.code.trim().toUpperCase();
    const person = companyPeople.find((p) => p.name.toLowerCase() === normalizedName && p.accessCode.toUpperCase() === normalizedCode);
    if (!person) { showNotice("Name oder Code nicht gefunden."); return; }
    if (person.status !== "aktiv") { showNotice("Dieser Zugang ist aktuell nicht aktiv. Bitte Firma/Büro kontaktieren."); return; }
    const user = { id: `LOGIN-${person.id}`, personId: person.id, name: person.name, email: `${person.accessCode.toLowerCase()}@code.local`, role: person.role, company: company.name, companyId: company.id, loginType: "code", loggedInAt: new Date().toLocaleString("de-DE") };
    setAuthUser(user);
    setRole(person.role);
    const firstOrder = orders.find((o) => (o.assignedMemberIds || []).includes(person.id) || o.customerPersonId === person.id || o.assignedTo === person.name || o.customer === person.name);
    if (firstOrder) setSelectedOrderId(firstOrder.id);
    setActive("dashboard");
    addSyncLog(`Code-Login lokal: ${person.name}`);
    showNotice(`Angemeldet als ${personRoleLabel(person.role)}.`);
  };
  const toggleAssignment = (personId) => {
    if (!selectedOrder) return;
    const currentIds = selectedOrder.assignedMemberIds || [];
    const nextIds = currentIds.includes(personId) ? currentIds.filter((id) => id !== personId) : [...currentIds, personId];
    const names = nextIds.map((id) => companyPeople.find((p) => p.id === id)?.name).filter(Boolean).join(", ");
    const person = companyPeople.find((item) => item.id === personId);
    updateSelectedOrder({ assignedMemberIds: nextIds, assignedTo: names }, { immediate: true, action: "Teamzuweisung geändert" });
    appendOrderEvent(selectedOrder.id, `${person?.name || "Teammitglied"} ${nextIds.includes(personId) ? "zugewiesen" : "aus der Zuweisung entfernt"}`);
  };
  const updatePlanningOrder = (orderId, changes, action = "Baustellenplanung geändert") => {
    if (!["dev", "meister", "buero"].includes(appRole)) { showNotice("Diese Planungsänderung ist nur für Büro, Meister oder Dev freigegeben."); return; }
    const stamp = new Date().toISOString();
    setOrders((list) => list.map((order) => order.id === orderId ? {
      ...order,
      ...changes,
      planningRevision: Number(order.planningRevision || 0) + 1,
      planningUpdatedAt: stamp,
      updatedAt: stamp,
      statusHistory: [...(order.statusHistory || []), { status: changes.status || order.status, at: stamp, by: authUser?.name || "Planung", note: action }],
    } : order));
    addToSyncQueue(action, { orderId, recordId: orderId, changeKeys: Object.keys(changes), baseRevision: Number(orders.find((order) => order.id === orderId)?.planningRevision || 0) }, { type: "planning", recordId: orderId, immediate: true });
    showNotice(offline ? "Planung lokal gespeichert. Änderung wartet auf Synchronisierung." : "Planung wurde gespeichert.");
  };
  const startPlanningOrder = (order) => {
    if (!order || !["dev", "meister", "buero", "vorarbeiter", "monteur"].includes(appRole)) return;
    if (!window.confirm(`Auftrag ${order.id} jetzt starten?`)) return;
    const stamp = new Date().toISOString();
    setOrders((list) => list.map((item) => item.id === order.id ? { ...item, status: "In Arbeit", startedAt: stamp, updatedAt: stamp, statusHistory: [...(item.statusHistory || []), { status: "In Arbeit", at: stamp, by: authUser?.name || "Montage", note: "Auftrag manuell gestartet" }] } : item));
    addToSyncQueue("Auftrag gestartet", { orderId: order.id, recordId: order.id, status: "In Arbeit" }, { type: "order", recordId: order.id, immediate: true });
    showNotice(offline ? "Auftrag lokal gestartet. Änderung wartet auf Synchronisierung." : "Auftrag wurde gestartet.");
  };
  const createPlanningAbsenceEntry = (values) => {
    if (!["dev", "meister", "buero"].includes(appRole)) return;
    const absence = createPlanningAbsence(values, company.id);
    setPlanningAbsences((current) => [absence, ...(Array.isArray(current) ? current : [])]);
    addToSyncQueue("Abwesenheit angelegt", { absenceId: absence.id, personId: absence.personId }, { type: "absence", recordId: absence.id, immediate: true });
    showNotice(offline ? "Abwesenheit lokal gespeichert und zum Sync vorgemerkt." : "Abwesenheit wurde gespeichert.");
  };
  const deletePlanningAbsence = (absenceId) => {
    if (!["dev", "meister", "buero"].includes(appRole)) return;
    setPlanningAbsences((current) => (Array.isArray(current) ? current : []).filter((absence) => absence.id !== absenceId));
    addToSyncQueue("Abwesenheit gelöscht", { absenceId }, { type: "absence", recordId: absenceId, immediate: true });
    showNotice("Abwesenheit wurde entfernt.");
  };
  const openPlanningOrder = (order) => {
    if (!order) return;
    setSelectedOrderId(order.id);
    setActive("orders");
  };
  const openPlanningOrderArea = (order, target) => {
    if (!order || !canOpenModule(target)) return;
    setSelectedOrderId(order.id);
    setActive(target);
  };
  const assignCustomerToOrder = (personId) => {
    const customer = companyPeople.find((p) => p.id === personId);
    if (!selectedOrder || !customer) return;
    updateSelectedOrder({ customerPersonId: customer.id, customer: customer.name, address: customer.address || selectedOrder.address, phone: customer.phone || selectedOrder.phone }, { immediate: true, action: "Kunde verknüpft" });
    appendOrderEvent(selectedOrder.id, `Kunde ${customer.name} verknüpft`);
  };
  const updateAzubiProgress = (personId, progress) => {
    setCompanyPeople((list) => list.map((p) => p.id === personId ? { ...p, progress: Number(progress) } : p));
    addToSyncQueue("Lernfortschritt geändert", { learnerId: personId, progress: Number(progress) });
  };

  const addOrder = (openChecklist = false) => { if (!newOrder.customer.trim()) { showNotice("Bitte mindestens einen Kundennamen eintragen."); return; } const id = `A-${Math.floor(1000 + Math.random() * 9000)}`; const stamp = new Date().toLocaleString("de-DE"); const order = { id, status: "Neu", createdAt: stamp, updatedAt: stamp, statusHistory: [{ status: "Neu", at: stamp, by: authUser?.name || "System", note: "Auftrag erstellt" }], ...newOrder, internalNotes: newOrder.notes || "" }; setOrders((list) => [order, ...list]); setSelectedOrderId(id); setChecks((current) => ({ ...current, [id]: buildEmptyChecklist(newOrder.product, newOrder) })); addToSyncQueue("Auftrag angelegt", { orderId: id }); setNewOrder({ customer: "", contact: "", phone: "", email: "", address: "", date: todayIso(), time: "08:00", assignedTo: "", product: "vorbaurollladen", substrate: "Beton", drive: "Funkmotor", installType: "Renovierung", windCritical: false, priority: "normal", materialStatus: "nicht geprüft", orderType: "Montage", notes: "" }); showNotice("Auftrag wurde gespeichert und als Baustellenakte geöffnet."); if (openChecklist) setActive("checklists"); else setActive("orders"); };
  const updateSelectedOrder = (changes, options = {}) => { if (!selectedOrder) return; setOrders((list) => list.map((order) => order.id === selectedOrder.id ? { ...order, ...changes, updatedAt: new Date().toLocaleString("de-DE") } : order)); if (options.immediate) addToSyncQueue(options.action || "Auftrag geändert", { orderId: selectedOrder.id, changes: Object.keys(changes) }, { immediate: true }); };
  const updateSelectedOrderStatus = (status, note = "Status geändert") => { if (!selectedOrder) return; const stamp = new Date().toLocaleString("de-DE"); setOrders((list) => list.map((order) => order.id === selectedOrder.id ? { ...order, status, updatedAt: stamp, statusHistory: [...(order.statusHistory || []), { status, at: stamp, by: authUser?.name || "System", note }] } : order)); addToSyncQueue("Status geändert", { orderId: selectedOrder.id, status }); showNotice(`Status geändert: ${status}`); };
  const updateSelectedOrderProduct = (productId) => { if (!selectedOrder) return; setOrders((list) => list.map((order) => order.id === selectedOrder.id ? { ...order, product: productId, updatedAt: new Date().toLocaleString("de-DE") } : order)); setChecks((current) => ({ ...current, [selectedOrder.id]: buildEmptyChecklist(productId, { ...selectedOrder, product: productId }) })); addToSyncQueue("Produkt/Checkliste geändert", { orderId: selectedOrder.id, productId }); showNotice("Produkt geändert und passende Checkliste neu geladen."); };
  const deleteSelectedOrder = () => { if (!selectedOrder) return; const remaining = orders.filter((order) => order.id !== selectedOrder.id); setOrders(remaining); setChecks((current) => { const next = { ...current }; delete next[selectedOrder.id]; return next; }); setSelectedOrderId(remaining[0]?.id || ""); addToSyncQueue("Auftrag gelöscht", { orderId: selectedOrder.id }); showNotice("Auftrag gelöscht."); };
  const duplicateSelectedOrder = () => { if (!selectedOrder) return; const id = `A-${Math.floor(1000 + Math.random() * 9000)}`; const stamp = new Date().toLocaleString("de-DE"); const copy = { ...selectedOrder, id, status: "Neu", createdAt: stamp, updatedAt: stamp, notes: `${selectedOrder.notes || ""}
Kopie/Nachfolgeauftrag aus ${selectedOrder.id}`.trim(), statusHistory: [{ status: "Neu", at: stamp, by: authUser?.name || "System", note: `Dupliziert aus ${selectedOrder.id}` }] }; setOrders((list) => [copy, ...list]); setSelectedOrderId(id); setChecks((current) => ({ ...current, [id]: buildEmptyChecklist(copy.product, copy) })); addToSyncQueue("Auftrag dupliziert", { from: selectedOrder.id, to: id }); showNotice("Auftrag wurde dupliziert."); };
  const archiveSelectedOrder = () => updateSelectedOrderStatus("Archiviert", "Auftrag archiviert");
  const createReworkOrder = (options = {}) => {
    const sourceOrder = options.sourceOrder || selectedOrder;
    if (!sourceOrder) return "";
    const id = `A-${Math.floor(1000 + Math.random() * 9000)}`;
    const stamp = new Date().toLocaleString("de-DE");
    const issueNote = options.issue?.description ? ` Kundenmeldung: ${options.issue.description}` : "";
    const rework = {
      ...sourceOrder,
      id,
      parentOrderId: sourceOrder.id,
      reworkOrderId: "",
      status: "Nacharbeit",
      priority: "dringend",
      orderType: "Nacharbeit",
      createdAt: stamp,
      updatedAt: stamp,
      notes: `Nacharbeit zu ${sourceOrder.id}: offene Punkte prüfen, Fotos ergänzen und Kunden informieren.${issueNote}`,
      internalNotes: `Nacharbeit zu ${sourceOrder.id}: offene Punkte prüfen, Fotos ergänzen und Kunden informieren.${issueNote}`,
      customerPortal: { ...sourceOrder.customerPortal, appointmentRequests: [], messages: [], issues: [], maintenanceRequests: [], approvals: [], feedback: [], activities: [] },
      statusHistory: [{ status: "Nacharbeit", at: stamp, by: authUser?.name || "System", note: `Nacharbeit aus ${sourceOrder.id} erstellt` }],
    };
    setOrders((list) => [rework, ...list.map((order) => order.id === sourceOrder.id ? { ...order, reworkOrderId: id, updatedAt: stamp, statusHistory: [...(order.statusHistory || []), { status: order.status, at: stamp, by: authUser?.name || "System", note: `Nacharbeitsauftrag ${id} angelegt` }] } : order)]);
    setPhotos((current) => ({ ...current, [id]: Object.fromEntries(Object.entries(current[sourceOrder.id] || {}).map(([category, photo]) => [category, { ...photo, id: `PHOTO-${Date.now()}-${category}`, orderId: id, createdAt: stamp }])) }));
    if (!options.keepSourceSelected) setSelectedOrderId(id);
    setChecks((current) => ({ ...current, [id]: buildEmptyChecklist(rework.product, rework) }));
    addToSyncQueue("Nacharbeit erstellt", { from: sourceOrder.id, to: id });
    showNotice(`Nacharbeitsauftrag ${id} wurde angelegt.`);
    return id;
  };
  const createReworkFromCustomerIssue = (issue) => {
    if (!selectedOrder || !canManageOrders) return;
    const reworkOrderId = createReworkOrder({ keepSourceSelected: true, sourceOrder: selectedOrder, issue });
    if (!reworkOrderId) return;
    setOrders((list) => list.map((order) => order.id === selectedOrder.id ? updateCustomerPortalEntry(order, "issues", issue.id, { status: "Nacharbeit geplant", reworkOrderId }) : order));
    addToSyncQueue("Nacharbeit aus Kundenmeldung erstellt", { from: selectedOrder.id, to: reworkOrderId, recordId: issue.id }, { type: "order", recordId: selectedOrder.id, immediate: true });
  };
  const startPartRequestForSelectedOrder = (navigate = true) => { if (!selectedOrder) return; const stamp = new Date().toLocaleString("de-DE"); setPartRequest(createEmptyPartRequest(selectedOrder)); setPartMode("request"); setOrders((list) => list.map((order) => order.id === selectedOrder.id ? { ...order, partRequestStartedAt: stamp, updatedAt: stamp, statusHistory: [...(order.statusHistory || []), { status: order.status, at: stamp, by: authUser?.name || "System", note: "Ersatzteil-Anfrage vorbereitet" }] } : order)); addToSyncQueue("Ersatzteil-Anfrage gestartet", { orderId: selectedOrder.id }); if (navigate) setActive("parts"); showNotice("Ersatzteil-Anfrage für den Auftrag wurde vorbereitet."); };
  const createOrderFromWorkflowTemplate = () => { const t = selectedWorkflowTemplate; const id = `A-${Math.floor(1000 + Math.random() * 9000)}`; const stamp = new Date().toLocaleString("de-DE"); const order = { id, customer: "Neuer Kunde", contact: "", phone: "", email: "", address: "", date: todayIso(), time: "08:00", assignedTo: "", product: t.product, substrate: "Beton", drive: "Funkmotor", installType: "Renovierung", windCritical: false, status: "Neu", priority: "normal", orderType: t.orderType, notes: t.notes, internalNotes: t.notes, createdAt: stamp, updatedAt: stamp, statusHistory: [{ status: "Neu", at: stamp, by: authUser?.name || "System", note: `Aus Vorlage ${t.name} erstellt` }] }; setOrders((list) => [order, ...list]); setSelectedOrderId(id); setChecks((current) => ({ ...current, [id]: buildEmptyChecklist(order.product, order) })); setActive("orders"); addToSyncQueue("Auftrag aus Vorlage erstellt", { template: t.id, orderId: id }); showNotice(`Vorlage erstellt: ${t.name}`); };
  const toggleCheck = (orderId, item) => { setChecks((current) => ({ ...current, [orderId]: { ...(current[orderId] || {}), [item]: !(current[orderId]?.[item]) } })); addToSyncQueue("Checkliste geändert", { orderId, item }); };
  const setMeasurementField = (field, value) => { setMeasurementValues((current) => ({ ...current, [selectedOrder?.id]: { ...(current[selectedOrder?.id] || {}), [field]: value } })); };
  const uploadPhoto = (category, file) => { if (!file || !selectedOrder) return; const reader = new FileReader(); reader.onload = () => { const record = { id: `PHOTO-${Date.now()}`, orderId: selectedOrder.id, diagnosisId: pendingPhotoDiagnosis?.orderId === selectedOrder.id ? pendingPhotoDiagnosis.sessionId : "", category, name: file.name, url: String(reader.result || ""), note: pendingPhotoDiagnosis?.orderId === selectedOrder.id ? `Zur Diagnose ${pendingPhotoDiagnosis.title || pendingPhotoDiagnosis.sessionId}` : "", createdAt: new Date().toLocaleString("de-DE"), required: REQUIRED_ORDER_PHOTOS.includes(category) }; setPhotos((current) => ({ ...current, [selectedOrder.id]: { ...(current[selectedOrder.id] || {}), [category]: record } })); addToSyncQueue("Foto hinzugefügt", { orderId: selectedOrder.id, diagnosisId: record.diagnosisId, photoType: category, fileName: file.name }); appendOrderEvent(selectedOrder.id, `${category}-Foto hinzugefügt${record.diagnosisId ? ` · Diagnose ${record.diagnosisId}` : ""}`); }; reader.onerror = () => showNotice("Foto konnte nicht lokal gelesen werden."); reader.readAsDataURL(file); };
  const updatePhotoNote = (category, note) => { if (!selectedOrder) return; setPhotos((current) => ({ ...current, [selectedOrder.id]: { ...(current[selectedOrder.id] || {}), [category]: { ...(current[selectedOrder.id]?.[category] || {}), note } } })); };
  const toggleQuality = (id) => { if (!selectedOrder) return; setManualQuality((current) => ({ ...current, [selectedOrder.id]: { ...(current[selectedOrder.id] || {}), [id]: !current[selectedOrder.id]?.[id] } })); addToSyncQueue("Abschlussprüfung geändert", { orderId: selectedOrder.id, id }); };
  const setQualityValue = (id, value) => { if (!selectedOrder) return; setManualQuality((current) => ({ ...current, [selectedOrder.id]: { ...(current[selectedOrder.id] || {}), [id]: value } })); addToSyncQueue("Abschlussentscheidung geändert", { orderId: selectedOrder.id, id, value }); };
  const completeSelectedOrder = () => { if (!selectedOrder) return; if (!closeReady) { showNotice(`${unresolvedQuality.length} Pflichtpunkt${unresolvedQuality.length === 1 ? " fehlt" : "e fehlen"}.`); return; } updateSelectedOrderStatus("Erledigt", "Abschlussprüfung vollständig"); };
  const applyReportTemplate = () => { setReportText(selectedReportTemplate.text); showNotice("Vorlage wurde übernommen."); };
  const importChecklistIntoReport = () => { const text = reportCheckedItems.length ? `Erledigte Checklistenpunkte: ${reportCheckedItems.join(", ")}.` : `Beim Auftrag ${selectedOrder?.id || ""} wurden noch keine Checklistenpunkte abgehakt.`; setReportText((current) => `${current}\n${text}`.trim()); showNotice("Checkliste wurde übernommen."); };
  const addPhotoNoteToReport = () => { const photoNames = Object.keys(orderPhotos); const text = photoNames.length ? `Fotodokumentation erstellt: ${photoNames.join(", ")}.` : "Fotodokumentation wurde vorbereitet, aber noch keine Fotos hinzugefügt."; setReportText((current) => `${current}\n${text}`.trim()); showNotice("Foto-Notiz eingefügt."); };
  const saveReportEntry = () => { const allowedOwnStatuses = ["Entwurf", "Fertig", "Zur Prüfung"]; const safeStatus = canViewLearningTeam || allowedOwnStatuses.includes(reportStatus) ? reportStatus : "Zur Prüfung"; const entry = { id: Date.now(), mode: reportMode, status: safeStatus, text: reportProposal, orderId: selectedOrder?.id || "", createdAt: new Date().toLocaleString("de-DE"), createdBy: currentPerson?.id || authUser?.id || "", userName: currentPerson?.name || authUser?.name || "", masterComment: canViewLearningTeam ? reportMasterComment : "" }; setSavedReports((entries) => [entry, ...entries]); addToSyncQueue("Berichtsheft gespeichert", { reportId: entry.id, orderId: entry.orderId, status: entry.status }); showNotice("Berichtsheft-Eintrag gespeichert."); };
  const generateWeeklyReport = () => { const weekOrders = orders.slice(0, 5); const text = `Wochenbericht automatisch erstellt. Berücksichtigte Aufträge: ${weekOrders.map((order) => `${order.id} ${productTypes.find((p) => p.id === order.product)?.name || "Produkt"} bei ${order.customer}`).join("; ")}. Schwerpunkte waren Aufmaß, Montagevorbereitung, Checklistenbearbeitung, Funktionsprüfung, Dokumentation und Kundenkommunikation.`; setReportMode("Wochenbericht"); setReportText(text); showNotice("Wochenbericht erzeugt."); };
  const exportCurrentReport = () => { const text = `BERICHTSHEFT-EXPORT\nDatum: ${new Date().toLocaleString("de-DE")}\nStatus: ${reportStatus}\nAuftrag: ${selectedOrder?.id || ""}\n\n${reportProposal}\n\nMeister-Kommentar:\n${reportMasterComment || "-"}`; setReportExportText(text); setBackupText(text); showNotice("Export erzeugt."); };
  const approveLatestReport = () => { if (!canViewLearningTeam) { showNotice("Nur Ausbildungsleitung, Büro oder Dev dürfen Berichte freigeben."); return; } if (!savedReports[0]) { showNotice("Es gibt noch keinen gespeicherten Bericht."); return; } const reportId = savedReports[0].id; setSavedReports((entries) => entries.map((entry, index) => index === 0 ? { ...entry, status: "Freigegeben", masterComment: reportMasterComment || entry.masterComment || "Freigegeben." } : entry)); setReportStatus("Freigegeben"); addToSyncQueue("Berichtsheft freigegeben", { reportId, status: "Freigegeben" }); showNotice("Letzter Bericht freigegeben."); };
  const deleteReport = (id) => { const report = savedReports.find((entry) => entry.id === id); if (!report || (!canViewLearningTeam && report.createdBy && report.createdBy !== learningUserId)) return; setSavedReports((entries) => entries.filter((entry) => entry.id !== id)); addToSyncQueue("Berichtsheft gelöscht", { reportId: id }); showNotice("Bericht gelöscht."); };
  const addNote = () => { if (!favorite.trim()) return; setNotes((n) => [{ id: Date.now(), text: favorite, module: active }, ...n]); setFavorite(""); };
  const runPhotoAnalysis = (label) => { const photo = orderPhotos[label]; const analysis = photo ? `${label}: Foto '${photo.name}' wurde Auftrag ${selectedOrder?.id || "ohne Auftrag"} zugeordnet. Vorschlag: im Protokoll verwenden und beim Abschluss prüfen.` : `${label}: Noch kein Foto vorhanden.`; if (selectedOrder) setPhotoAnalyses((current) => ({ ...current, [selectedOrder.id]: { ...(current[selectedOrder.id] || {}), [label]: analysis } })); };
  const saveDiagnosisToOrder = (draft) => { if (!selectedOrder) return; const entry = { id: `DIA-${Date.now()}`, ...draft, product: selectedOrder.product, manufacturer: selectedOrder.manufacturer || "", drive: selectedOrder.drive || "", substrate: selectedOrder.substrate || "", createdAt: new Date().toLocaleString("de-DE"), createdBy: authUser?.name || "System" }; setOrders((list) => list.map((order) => order.id === selectedOrder.id ? { ...order, diagnoses: [entry, ...(order.diagnoses || [])], updatedAt: entry.createdAt, statusHistory: [...(order.statusHistory || []), { status: order.status, at: entry.createdAt, by: entry.createdBy, note: `Diagnose gespeichert: ${entry.issue || entry.result || "Ergebnis"}` }] } : order)); addToSyncQueue("Diagnose zum Auftrag gespeichert", { orderId: selectedOrder.id, recordId: entry.id }); showNotice("Diagnose wurde in der Auftragsakte gespeichert."); };
  const persistDiagnosisSession = (session, options = {}) => {
    if (!session?.id) return;
    setDiagnosisSessions((current) => [session, ...(Array.isArray(current) ? current : []).filter((item) => item.id !== session.id)].slice(0, 50));
    if (options.queue) addToSyncQueue("Diagnose-Zwischenstand gespeichert", { recordId: session.id, orderId: session.context?.orderId || "", status: session.status }, { type: "diagnosis", recordId: session.id });
    if (options.notify) showNotice("Diagnose wurde lokal gespeichert und für die Synchronisierung vorgemerkt.");
  };
  const recordDiagnosisRecent = (treeId) => setDiagnosisRecents((current) => [treeId, ...(Array.isArray(current) ? current : []).filter((id) => id !== treeId)].slice(0, 8));
  const saveGuidedDiagnosisToOrder = (session, tree) => {
    const orderId = session?.context?.orderId || selectedOrder?.id;
    if (!orderId || !tree) { showNotice("Bitte zuerst einen Auftrag auswählen."); return; }
    const order = orders.find((item) => item.id === orderId);
    if (!order) { showNotice("Der zugeordnete Auftrag wurde nicht gefunden."); return; }
    const normalizedSession = { ...session, status: "completed", result: { ...session.result, orderStatus: session.orderStatus || session.result?.orderStatus || "offen" }, updatedAt: new Date().toISOString() };
    const entry = { ...formatDiagnosisForOrder(normalizedSession, tree, currentPerson?.name || authUser?.name || "System"), product: order.product, manufacturer: order.manufacturer || "", drive: order.drive || "", substrate: order.substrate || "" };
    setOrders((list) => list.map((item) => item.id === orderId ? { ...item, diagnoses: [entry, ...(item.diagnoses || []).filter((diagnosis) => diagnosis.id !== entry.id)], updatedAt: entry.updatedAt, statusHistory: [...(item.statusHistory || []), { status: item.status, at: entry.updatedAt, by: entry.createdBy, note: `Geführte Diagnose gespeichert: ${entry.issue} · ${entry.status}` }] } : item));
    persistDiagnosisSession(normalizedSession, { queue: false });
    addToSyncQueue("Geführte Diagnose zum Auftrag gespeichert", { orderId, recordId: entry.id, status: entry.status }, { type: "diagnosis", recordId: entry.id, immediate: true });
    showNotice(`Diagnose wurde Auftrag ${orderId} zugeordnet.`);
  };
  const openDiagnosisPhoto = (category = "Schaden", session = null) => { const orderId = session?.context?.orderId || selectedOrder?.id || ""; if (orderId) setSelectedOrderId(orderId); setPendingPhotoDiagnosis(session ? { sessionId: session.id, orderId, title: session.title } : null); setActive("photos"); showNotice(`Foto-Kategorie „${category}“ geöffnet. Das Foto wird Auftrag und Diagnose zugeordnet.`); };
  const openDiagnosisManufacturer = (tree) => { setManufacturerQuery(selectedOrder?.manufacturer || tree?.category || ""); setActive("manufacturers"); };
  const openDiagnosisLearning = (tree) => {
    if (!canOpenModule("learning")) { showNotice("Für diese Rolle ist der Lernbereich nicht freigegeben."); return; }
    setActive("learning");
    showNotice(`Passendes Lernthema: ${tree?.learningTargets?.[0] || tree?.category || "Diagnose"}.`);
  };
  const openDiagnosisKnowledge = (tree) => { setTechnicalQuery(tree?.title || tree?.category || ""); setActive("products"); };
  const openDiagnosisMotors = (session, tree) => {
    const drive = String(session?.context?.drive || selectedOrder?.drive || "").toLowerCase();
    const candidates = allMotorTypes.filter((motor) => (motor.diagnosisIds || []).includes(tree?.id) || (motor.productIds || []).includes(session?.context?.productId || selectedOrder?.product));
    const selectedMotor = candidates.find((motor) => drive.includes("funk") && motor.id === "funkmotor") || candidates[0] || allMotorTypes[0];
    setMotorQuery(selectedMotor?.name || session?.context?.drive || tree?.title || "");
    if (selectedMotor && session?.context?.orderId) {
      const scope = `motor-check-auftrag-${session.context.orderId}-${selectedMotor.id}`;
      const transferred = {};
      if (session.context.productId) transferred["Produkt identifiziert"] = true;
      if (session.context.manufacturer) transferred["Hersteller identifiziert"] = true;
      if (session.context.drive) transferred["Motortyp identifiziert"] = true;
      if (session.answers?.supply?.value === "Ja, durch Fachkraft") transferred["Spannungsversorgung fachgerecht geprüft"] = true;
      if (session.answers?.operation?.value && !["Nicht geprüft", "Nicht zutreffend"].includes(session.answers.operation.value)) transferred["Bedienung geprüft"] = true;
      setModuleChecks((current) => ({ ...current, [scope]: { ...(current[scope] || {}), ...transferred } }));
    }
    setActive("motors");
  };
  const generateKiAnswer = () => { const warnings = []; if (selectedOrder?.substrate === "WDVS") warnings.push("WDVS-Abstandsmontage und Abdichtung prüfen"); if (selectedOrder?.drive?.includes("Funk")) warnings.push("Senderkanal, Reichweite und Gruppensteuerung testen"); if (selectedOrder?.windCritical) warnings.push("Windklasse, Sensorik und Kundenhinweis dokumentieren"); setGeneratedAiResponse(`Prüfvorschlag für ${selectedOrder?.id || "aktuellen Auftrag"}: Produkt ${selectedProduct.name}, Untergrund ${selectedOrder?.substrate || "unbekannt"}, Antrieb ${selectedOrder?.drive || "unbekannt"}. Nächste Schritte: Aufmaß prüfen, Checkliste öffnen, Fotos ergänzen, ${warnings.length ? warnings.join("; ") : "Standardprüfung durchführen"}, Abschlussprüfung öffnen.`); };
  const recordTechnicalUse = (entry) => {
    if (!entry?.id || !entry?.label) return;
    setTechnicalRecents((current) => [{ id: entry.id, type: entry.type, label: entry.label, route: entry.route, usedAt: new Date().toISOString() }, ...(Array.isArray(current) ? current : []).filter((item) => !(item.id === entry.id && item.type === entry.type))].slice(0, 12));
  };
  const toggleTechnicalFavorite = (setter, id) => setter((current) => {
    const values = Array.isArray(current) ? current : [];
    if (values.includes(id)) return values.filter((item) => item !== id);
    if (values.length >= 8) { showNotice("Es können maximal acht Technik-Favoriten gespeichert werden."); return values; }
    return [...values, id];
  });
  const updateTechnicalNote = (key, value) => setTechnicalNotes((current) => ({ ...(current || {}), [key]: value }));
  const openNameplateAssistant = () => { setActive("photos"); showNotice("Typenschildfoto öffnen. Nur erkannte Werte übernehmen."); };
  const openTechnicalDiagnosis = (source) => {
    const diagnosis = source?.start ? source : allDiagnosisTrees.find((item) => (source?.diagnosisIds || []).includes(item.id));
    setDiagnosisCategory("all");
    setDiagnosisQuery(diagnosis?.title || source?.name || source?.label || "");
    setActive("diagnose");
    if (diagnosis) recordTechnicalUse({ type: "Diagnose", id: diagnosis.id, label: diagnosis.title, route: "diagnose" });
  };
  const openTechnicalParts = (source) => {
    setPartQuery(source?.partCategories?.[0] || source?.partCategory || source?.name || source?.label || "");
    setPartMode("search");
    setActive("parts");
  };
  const createPartRequestFromDiagnosis = (diagnosis, session = null) => {
    const diagnosisResult = session?.result;
    setPartRequest({ ...createEmptyPartRequest(selectedOrder), part: diagnosis?.partCategories?.[0] || "", requestedPart: diagnosis?.partCategories?.[0] || "", diagnosisId: session?.id || diagnosis?.id || "", errorDescription: [`Diagnose: ${diagnosis?.title || "Fehlerbild"}.`, diagnosisResult?.probableCause ? `Wahrscheinlicher Bereich: ${diagnosisResult.probableCause}.` : diagnosis?.start?.q, diagnosisResult?.recommendation ? `Empfehlung: ${diagnosisResult.recommendation}` : ""].filter(Boolean).join(" ").trim(), manufacturer: selectedOrder?.manufacturer || session?.context?.manufacturer || "", motor: selectedOrder?.drive || session?.context?.drive || "" });
    setPartMode("request");
    setActive("parts");
    if (diagnosis?.id) recordTechnicalUse({ type: "Diagnose", id: diagnosis.id, label: diagnosis.title, route: "diagnose" });
    showNotice("Diagnosedaten wurden in die Ersatzteil-Anfrage übernommen.");
  };
  const openTechnicalResult = (result) => {
    if (!result) return;
    recordTechnicalUse({ ...result, id: result.sourceId || result.id });
    if (result.route === "manufacturers") setManufacturerQuery(result.label || "");
    if (result.route === "motors") setMotorQuery(result.label || "");
    if (result.route === "diagnose") { setDiagnosisCategory("all"); setDiagnosisQuery(result.label || ""); }
    if (result.route === "parts") { setPartMode("search"); setPartQuery(result.label || ""); }
    navigateTo(result.route);
  };
  const openOrderTechnicalArea = (target) => {
    if (target === "manufacturers") setManufacturerQuery(selectedOrder?.manufacturer || selectedProduct?.name || "");
    if (target === "motors") setMotorQuery([selectedOrder?.drive, selectedOrder?.manufacturer, selectedProduct?.name].filter(Boolean).join(" "));
    if (target === "parts") { setPartMode("search"); setPartQuery(selectedProduct?.name || ""); }
    navigateTo(target === "diagnosis" ? "diagnose" : target);
  };
  const setOrderWaitingForMaterial = (orderId) => {
    if (!orderId) return;
    const stamp = new Date().toLocaleString("de-DE");
    setOrders((list) => list.map((order) => order.id === orderId ? { ...order, status: "Wartet auf Material", updatedAt: stamp, statusHistory: [...(order.statusHistory || []), { status: "Wartet auf Material", at: stamp, by: authUser?.name || "System", note: "Manuell aus Ersatzteil-Anfrage gesetzt" }] } : order));
    addToSyncQueue("Auftrag wartet auf Material", { orderId, status: "Wartet auf Material" }, { immediate: true });
    showNotice("Auftrag wurde auf „Wartet auf Material“ gesetzt.");
  };
  const createSnapshot = () => ({ version: "2.4-planning-system", exportedAt: new Date().toISOString(), authUser, company, companyPeople, planningAbsences, orders, checks, notes, savedReports, measurementValues, manualQuality, photos, photoAnalyses, pdfDocuments, moduleChecks, partRequests, learningProgress, quizProgress, learningPracticeCases, learningAssignments, learningComments, learningLists, sketchImage, savedSketches, manufacturerFavorites, motorFavorites, technicalRecents, technicalNotes, diagnosisFavorites, diagnosisRecents, diagnosisSessions });
    const pushToCloud = () => { const snapshot = createSnapshot(); saveJson(`rs-cloud-${cloudCompanyId}`, snapshot); setBackupText(JSON.stringify(snapshot, null, 2)); addSyncLog("Daten im lokalen Cloud-Snapshot gespeichert"); };
  const pullFromCloud = () => { const snapshot = loadJson(`rs-cloud-${cloudCompanyId}`, null); if (!snapshot) { addSyncLog("Kein lokaler Cloud-Snapshot gefunden", "fehlt"); return; } applyRemoteSnapshot(snapshot); updateSyncQueue(() => restoreSyncQueue(snapshot.syncQueue || [])); addSyncLog("Daten aus lokalem Cloud-Snapshot geladen"); };
  const exportBackup = () => { const text = JSON.stringify(createSnapshot(), null, 2); setBackupText(text); addSyncLog("Backup erzeugt"); };
  const importBackup = () => { try { const snapshot = JSON.parse(backupText); applyRemoteSnapshot(snapshot); updateSyncQueue(() => restoreSyncQueue(snapshot.syncQueue || [])); addSyncLog("Backup importiert"); } catch { addSyncLog("Backup konnte nicht gelesen werden", "fehler"); } };

  const screen = (content) => canOpenModule(active) ? <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <SectionTabs active={active} favorites={navigationFavorites} group={activeNavigationGroup} onNavigate={navigateTo} onToggleFavorite={toggleNavigationFavorite} />
    {content}
  </motion.main> : null;

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let mounted = true;
    const continueAfterEmailConfirm = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted || !data?.user || authUser) return;
      if (pendingRegistration) await createCompanyForSignedInUser(pendingRegistration);
      else await loadCurrentCompanyFromSupabase();
    };
    continueAfterEmailConfirm();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && !authUser) {
        if (pendingRegistration) createCompanyForSignedInUser(pendingRegistration);
        else loadCurrentCompanyFromSupabase();
      }
      if (!session && authUser?.loginType?.includes("supabase")) setAuthUser(null);
    });
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!authUser) {
      setInitialCloudLoaded(false);
      setSyncError("");
      return;
    }
    if (offline) {
      setInitialCloudLoaded(true);
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setInitialCloudLoaded(true);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      await loadAppFromSupabase(authUser.companyId || company.id, authUser.role, authUser.personId);
      if (!cancelled) setInitialCloudLoaded(true);
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [authUser?.id, authUser?.companyId, offline]);

  const syncOwnerKey = authUser ? `${authUser.id}:${authUser.companyId || company.id}` : "";
  const syncChangeToken = useMemo(() => ({}), [company, companyPeople, planningAbsences, orders, checks, notes, savedReports, measurementValues, manualQuality, photos, photoAnalyses, pdfDocuments, moduleChecks, partRequests, learningProgress, quizProgress, learningPracticeCases, learningAssignments, learningComments, learningLists, sketchImage, savedSketches, manufacturerFavorites, motorFavorites, technicalRecents, technicalNotes, diagnosisFavorites, diagnosisRecents, diagnosisSessions]);
  useAutoSync({
    ownerKey: syncOwnerKey,
    ready: initialCloudLoaded,
    enabled: Boolean(isSupabaseConfigured && supabase && authUser),
    offline,
    pendingVersion: pendingSyncVersion,
    syncDelay: autoSyncState.delay,
    changeToken: syncChangeToken,
    onLocalChange: queueLocalChange,
    onSync: () => saveAppToSupabase(null, { quiet: true }),
    trackLocalChanges: authUser?.role !== "kunde",
  });

  const canManageOrders = ["dev", "meister", "buero"].includes(appRole);
  const canEditOrderWork = ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"].includes(appRole);
  const diagnosisPageProps = {
    checkButton,
    diagnosisCategories,
    diagnosisCategory,
    diagnosisFavorites,
    diagnosisQuery,
    diagnosisRecents,
    diagnosisSessions,
    moduleChecks,
    onCreatePartRequest: createPartRequestFromDiagnosis,
    onOpenKnowledge: openDiagnosisKnowledge,
    onOpenLearning: openDiagnosisLearning,
    onOpenManufacturer: openDiagnosisManufacturer,
    onOpenMotors: openDiagnosisMotors,
    onOpenParts: openTechnicalParts,
    onOpenPhoto: openDiagnosisPhoto,
    onPersistSession: persistDiagnosisSession,
    onRecordRecent: recordDiagnosisRecent,
    onSaveLearningCase: saveDiagnosisAsLearningCase,
    onSaveSessionToOrder: saveGuidedDiagnosisToOrder,
    onToggleFavorite: (id) => toggleTechnicalFavorite(setDiagnosisFavorites, id),
    onUse: recordTechnicalUse,
    selectedOrder,
    selectedProduct,
    setDiagnosisCategory,
    setDiagnosisQuery,
  };
  const orderDetailProps = selectedOrder ? {
    order: selectedOrder,
    product: selectedProduct,
    companyPeople,
    canManage: canManageOrders,
    canEditWork: canEditOrderWork,
    canOpenModule,
    stages: workflowStages,
    syncStatus: selectedOrderSyncStatus,
    openItems: selectedOrderOpenItems,
    progressItems: orderProgressItems,
    roleLabel: personRoleLabel,
    checklist: { items: selectedChecklistItems, values: checks[selectedOrder.id] || {} },
    measurement: { fields: measurementFields, values: orderMeasurements, missing: missingMeasurements },
    photos: { values: orderPhotos, analyses: orderPhotoAnalyses },
    documents: { orderDocuments, openPartRequests: openOrderPartRequests },
    actions: {
      archive: archiveSelectedOrder,
      createRework: () => createReworkOrder({ keepSourceSelected: true }),
      createReworkFromCustomerIssue,
      customerActivityCount: customerPortalActivityCount(selectedOrder),
      navigate: openOrderTechnicalArea,
      update: updateSelectedOrder,
      updateStatus: (status) => updateSelectedOrderStatus(status, "Status in der Auftragsakte geändert"),
      updateProduct: updateSelectedOrderProduct,
      toggleAssignment,
      assignCustomer: assignCustomerToOrder,
      toggleCheck,
      setMeasurementField,
      uploadPhoto,
      updatePhotoNote,
      analyzePhoto: runPhotoAnalysis,
      startPartRequest: startPartRequestForSelectedOrder,
      saveDiagnosis: saveDiagnosisToOrder,
      createLearningCase: () => createLearningPracticeCaseFromOrder(selectedOrder, learningUserId),
      updateCustomerEntry,
    },
    panels: {
      sketches: <SketchesPage checkButton={checkButton} deleteSketch={deleteSketchRecord} orders={visibleOrders} saveSketch={saveSketchRecord} savedSketches={(Array.isArray(savedSketches) ? savedSketches : []).filter((sketch) => !sketch.orderId || sketch.orderId === selectedOrder.id)} selectedOrderId={selectedOrder.id} setSketchImage={setSketchImage} showNotice={showNotice} sketchImage={sketchImage} />,
      diagnosis: <DiagnosisPage {...diagnosisPageProps} />,
      parts: <PartsPage checkButton={checkButton} loadPartRequestDraft={loadPartRequestDraft} mode={partMode} moduleChecks={moduleChecks} newPartRequestDraft={newPartRequestDraft} notes={technicalNotes} onAnalyzeNameplate={openNameplateAssistant} onNoteChange={updateTechnicalNote} onSetOrderWaitingMaterial={setOrderWaitingForMaterial} onUse={recordTechnicalUse} orders={visibleOrders} partPhotoRequirements={partPhotoRequirements} partPhotoScope={partPhotoScope} partQuery={partQuery} partRequest={partRequest} partRequests={orderPartRequests} partRequestText={partRequestText} savePartRequestDraft={savePartRequestDraft} selectedOrder={selectedOrder} setMode={setPartMode} setPartQuery={setPartQuery} setPartRequest={setPartRequest} updatePartRequestStatus={updatePartRequestStatus} />,
      completion: (openArea) => <CloseOrderPage closeReady={closeReady} closingGroups={closingGroups} closingValues={closingValues} completionNote={selectedOrder.completionNote || ""} completeSelectedOrder={completeSelectedOrder} createReworkOrder={() => createReworkOrder({ keepSourceSelected: true })} missingClosingItems={unresolvedQuality} openArea={openArea} selectedChecklistProgress={selectedChecklistProgress} selectedOrder={selectedOrder} selectedProduct={selectedProduct} setQualityValue={setQualityValue} startPartRequest={() => startPartRequestForSelectedOrder(false)} toggleQuality={toggleQuality} updateCompletionNote={(value) => updateSelectedOrder({ completionNote: value })} />,
    },
  } : null;

  if (!authUser) {
    return <LoginGate
      device={device}
      loginForm={loginForm}
      setLoginForm={setLoginForm}
      companyAuthMode={companyAuthMode}
      setCompanyAuthMode={setCompanyAuthMode}
      registerCompanyWithSupabase={registerCompanyWithSupabase}
      signInCompanyWithSupabase={signInCompanyWithSupabase}
      createCompanyForSignedInUser={createCompanyForSignedInUser}
      pendingRegistration={pendingRegistration}
      resendConfirmationEmail={resendConfirmationEmail}
      finishEmailConfirmation={finishEmailConfirmation}
      clearPendingRegistration={clearPendingRegistration}
      codeLogin={codeLogin}
      setCodeLogin={setCodeLogin}
      loginWithPersonalCode={loginWithPersonalCode}
      supabaseStatus={supabaseStatus}
      isSupabaseConfigured={isSupabaseConfigured}
    />;
  }

  const navigationStatus = {
    offline,
    pendingCount: pendingSyncCount,
    failedCount: failedSyncCount,
    lastSyncedAt,
    error: syncError,
    syncing,
    onRetry: retrySync,
    showTechnicalDetails: authUser.role === "dev",
  };

  return <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-950 ${device.isMobile ? "p-3 pb-24" : "p-4"}`}>
    <div className={`mx-auto grid max-w-[1600px] gap-5 ${device.isMobile ? "" : sidebarCollapsed ? "grid-cols-[78px_minmax(0,1fr)]" : "grid-cols-[270px_minmax(0,1fr)]"}`}>
      {!device.isMobile && <DesktopSidebar active={active} collapsed={sidebarCollapsed} groups={roleNavigationGroups} onLogout={logoutSupabase} onNavigate={navigateTo} onToggleCollapsed={() => setSidebarCollapsed((value) => !value)} />}
      <main className="min-w-0">
        <TopBar role={appRole} setRole={setRole} offline={offline} pendingSyncCount={pendingSyncCount} failedSyncCount={failedSyncCount} lastSyncedAt={lastSyncedAt} syncError={syncError} syncing={syncing} onRetrySync={retrySync} compact={device.isMobile} currentUser={authUser} search={<GlobalSearch items={visibleNavigationItems} onNavigate={navigateTo} onOpenOrder={openSearchOrder} orders={appRole === "kunde" ? currentCustomerOrders : visibleOrders} />} />
        {notice && <div className="mb-4 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{notice}</div>}
        <Header role={appRole} orders={appRole === "kunde" ? currentCustomerOrders : visibleOrders} selectedOrder={appRole === "kunde" ? currentCustomerOrders.find((order) => order.id === selectedOrder?.id) : selectedOrder} compact={device.isMobile} moduleCount={visibleNavigationItems.length} />
        <QuickAccessBar favorites={navigationFavorites} items={visibleNavigationItems} onNavigate={navigateTo} onToggleFavorite={toggleNavigationFavorite} />
        {device.isMobile && <MobileBottomNav active={active} favorites={navigationFavorites} groups={roleNavigationGroups} items={mobilePrimaryItems} onLogout={logoutSupabase} onNavigate={navigateTo} onToggleFavorite={toggleNavigationFavorite} status={navigationStatus} />}
    {active === "dashboard" && screen(<DashboardPage activeOrders={activeOrders} allowedNav={visibleNavigationItems} appRole={appRole} canOpenModule={canOpenModule} company={company} currentUser={authUser} customerDocuments={currentCustomerDocuments} learningDashboard={learningDashboard} openReports={openReports} orders={orders} photos={photos} planningSummary={planningSummary} roleHome={roleHome} setActive={navigateTo} setSelectedOrderId={setSelectedOrderId} todaysOrders={todaysOrders} visibleOrders={currentCustomerOrders.length && appRole === "kunde" ? currentCustomerOrders : visibleOrders} />)}
    {active === "today" && screen(<PlanningPage absences={planningAbsences} appRole={appRole} currentPerson={currentPerson} initialTab="today" offline={offline} onCreateAbsence={createPlanningAbsenceEntry} onCreateLearningCase={createLearningPracticeCaseFromOrder} onDeleteAbsence={deletePlanningAbsence} onOpenOrder={openPlanningOrder} onOpenOrderArea={openPlanningOrderArea} onStartOrder={startPlanningOrder} onUpdateOrder={updatePlanningOrder} orders={orders} partRequests={partRequests} pendingOrderIds={pendingPlanningOrderIds} people={companyPeople} todayOnly />)}
    {active === "orders" && screen(<OrdersPage addOrder={addOrder} canCreate={canManageOrders} canManage={canManageOrders} deleteSelectedOrder={deleteSelectedOrder} detailProps={orderDetailProps} filteredOrders={filteredOrders} newOrder={newOrder} newOrderChecklistPreview={newOrderChecklistPreview} newOrderProduct={newOrderProduct} orderOpenCounts={orderOpenCounts} orderSearch={orderSearch} selectedOrder={selectedOrder} selectedOrderId={selectedOrderId} setNewOrder={setNewOrder} setOrderSearch={setOrderSearch} setSelectedOrderId={setSelectedOrderId} />)}
    {active === "workflow" && screen(<WorkflowPage archiveSelectedOrder={archiveSelectedOrder} canOpenModule={canOpenModule} createOrderFromWorkflowTemplate={createOrderFromWorkflowTemplate} createReworkOrder={createReworkOrder} currentOrderHistory={currentOrderHistory} duplicateSelectedOrder={duplicateSelectedOrder} orderWorkflowTemplates={orderWorkflowTemplates} selectedOrder={selectedOrder} selectedProduct={selectedProduct} selectedWorkflowTemplate={selectedWorkflowTemplate} setActive={setActive} setWorkflowTemplateId={setWorkflowTemplateId} workflowStages={workflowStages} workflowTemplateId={workflowTemplateId} />)}
    {active === "closeOrder" && screen(<CloseOrderPage closeReady={closeReady} closingGroups={closingGroups} closingValues={closingValues} completionNote={selectedOrder?.completionNote || ""} completeSelectedOrder={completeSelectedOrder} createReworkOrder={() => createReworkOrder({ keepSourceSelected: true })} missingClosingItems={unresolvedQuality} openArea={setActive} selectedChecklistProgress={selectedChecklistProgress} selectedOrder={selectedOrder} selectedProduct={selectedProduct} setQualityValue={setQualityValue} startPartRequest={startPartRequestForSelectedOrder} toggleQuality={toggleQuality} updateCompletionNote={(value) => updateSelectedOrder({ completionNote: value })} />)}
    {active === "products" && screen(<ProductLexiconPage checkButton={checkButton} moduleChecks={moduleChecks} selectedOrder={selectedOrder} selectedProduct={selectedProduct} />)}
  {active === "checklists" && screen(<OrderChecklist canEdit={canEditOrderWork} checks={checks[selectedOrder?.id] || {}} items={selectedChecklistItems} onProductChange={updateSelectedOrderProduct} onToggle={toggleCheck} order={selectedOrder} product={selectedProduct} />)}
    {active === "tools" && screen(<ToolsPage checkButton={checkButton} markScopeDone={markScopeDone} moduleChecks={moduleChecks} selectedOrder={selectedOrder} selectedProduct={selectedProduct} />)}
    {active === "substrates" && screen(<SubstratesPage checkButton={checkButton} moduleChecks={moduleChecks} selectedOrder={selectedOrder} selectedProduct={selectedProduct} />)}
    {active === "technical" && screen(<TechnicalSearchPage manufacturerFavorites={manufacturerFavorites} onOpenResult={openTechnicalResult} query={technicalQuery} recents={technicalRecents} setQuery={setTechnicalQuery} />)}
    {active === "motors" && screen(<MotorsPage checkButton={checkButton} favorites={motorFavorites} moduleChecks={moduleChecks} motorQuery={motorQuery} notes={technicalNotes} onAnalyzeNameplate={openNameplateAssistant} onNoteChange={updateTechnicalNote} onOpenDiagnosis={openTechnicalDiagnosis} onOpenParts={openTechnicalParts} onToggleFavorite={(id) => toggleTechnicalFavorite(setMotorFavorites, id)} onUse={recordTechnicalUse} selectedOrder={selectedOrder} selectedProduct={selectedProduct} setMotorQuery={setMotorQuery} />)}
    {active === "diagnose" && screen(<DiagnosisPage {...diagnosisPageProps} />)}
    {active === "manufacturers" && screen(<ManufacturersPage checkButton={checkButton} favorites={manufacturerFavorites} filteredMakers={filteredMakers} manufacturerQuery={manufacturerQuery} moduleChecks={moduleChecks} notes={technicalNotes} onAnalyzeNameplate={openNameplateAssistant} onNoteChange={updateTechnicalNote} onOpenDiagnosis={openTechnicalDiagnosis} onOpenMotors={(maker) => { setMotorQuery(maker.name); setActive("motors"); }} onOpenParts={openTechnicalParts} onToggleFavorite={(id) => toggleTechnicalFavorite(setManufacturerFavorites, id)} onUse={recordTechnicalUse} selectedOrder={selectedOrder} selectedProduct={selectedProduct} setManufacturerQuery={setManufacturerQuery} />)}
  {active === "measurement" && screen(<OrderMeasurement canEdit={canEditOrderWork} fields={measurementFields} missing={missingMeasurements} onChange={setMeasurementField} order={selectedOrder} product={selectedProduct} values={orderMeasurements} />)}
  {active === "offers" && screen(<div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]"><Card><SectionTitle icon={Euro} title="Angebotsassistent" subtitle="Grobe Kalkulation mit Material, Lohn, Anfahrt, WDVS-Zuschlag und Entsorgung." /><div className="grid gap-4 md:grid-cols-2">{Object.entries(calc).map(([k, v]) => <Field key={k} label={k} type="number" value={v} onChange={(value) => setCalc({ ...calc, [k]: value })} />)}</div></Card><Card><SectionTitle icon={Calculator} title="Preisvorschau" subtitle="Grobe Struktur für ein Angebots-PDF." /><div className="space-y-3"><div className="flex justify-between rounded-2xl bg-slate-50 p-4"><span>Netto</span><strong>{net.toFixed(2)} €</strong></div><div className="flex justify-between rounded-2xl bg-slate-50 p-4"><span>MwSt. 19%</span><strong>{(net * 0.19).toFixed(2)} €</strong></div><div className="flex justify-between rounded-2xl bg-slate-950 p-4 text-white"><span>Brutto</span><strong>{(net * 1.19).toFixed(2)} €</strong></div></div><CopyBox title="Angebotstext kopieren" text={`Wir bieten Ihnen die Lieferung und Montage von ${selectedProduct.name} gemäß Aufmaß und technischer Klärung an. Untergrund, Stromanschluss und Herstellerangaben sind vor Ausführung zu prüfen.`} /></Card></div>)}
  {active === "photos" && screen(<OrderPhotos canEdit={canEditOrderWork} onAnalyze={runPhotoAnalysis} onNoteChange={updatePhotoNote} onUpload={uploadPhoto} order={selectedOrder} photoAnalyses={orderPhotoAnalyses} photos={orderPhotos} />)}
    {active === "parts" && screen(<PartsPage checkButton={checkButton} loadPartRequestDraft={loadPartRequestDraft} mode={partMode} moduleChecks={moduleChecks} newPartRequestDraft={newPartRequestDraft} notes={technicalNotes} onAnalyzeNameplate={openNameplateAssistant} onNoteChange={updateTechnicalNote} onSetOrderWaitingMaterial={setOrderWaitingForMaterial} onUse={recordTechnicalUse} orders={visibleOrders} partPhotoRequirements={partPhotoRequirements} partPhotoScope={partPhotoScope} partQuery={partQuery} partRequest={partRequest} partRequests={partRequests} partRequestText={partRequestText} savePartRequestDraft={savePartRequestDraft} selectedOrder={selectedOrder} setMode={setPartMode} setPartQuery={setPartQuery} setPartRequest={setPartRequest} updatePartRequestStatus={updatePartRequestStatus} />)}
  {active === "customers" && screen(<Card><SectionTitle icon={MessageSquareText} title="Kundenkommunikation mit Auftragsdaten" subtitle="Texte mit Platzhaltern werden aus dem aktiven Auftrag gefüllt." /><div className="mb-5 rounded-3xl bg-slate-50 p-4 text-sm leading-6"><strong>Aktiver Auftrag:</strong> {selectedOrder?.customer} · {selectedProduct.name} · {selectedOrder?.date} {selectedOrder?.time}</div><div className="grid gap-4 md:grid-cols-2">{customerTemplates.map((t) => <CopyBox key={t.title} title={t.title} text={customerTemplateForOrder(t.text)} />)}</div></Card>)}
    {active === "maintenance" && screen(<MaintenancePage checkButton={checkButton} moduleChecks={moduleChecks} selectedOrder={selectedOrder} selectedProduct={selectedProduct} />)}
    {(active === "learning" || active === "quiz" || active === "azubiPlan") && screen(<LearningPage appRole={appRole} canViewTeam={canViewLearningTeam} companyPeople={companyPeople} currentLearnerId={learningUserId} currentPerson={currentPerson} initialView={active === "quiz" ? "quiz" : active === "azubiPlan" ? "progress" : "overview"} learningAssignments={learningAssignments} learningComments={learningComments} learningLists={learningLists} learningProgress={learningProgress} myReports={myReports} onCreatePracticeCaseFromOrder={createLearningPracticeCaseFromOrder} onOpenRelated={(target) => navigateTo(target === "diagnosis" ? "diagnose" : target)} onOpenReportBook={openLearningReportBook} onPrepareLearningReport={prepareLearningReport} onQuizAnswer={saveQuizAnswer} onReviewLearningReport={reviewLearningReport} onSaveLearningAssignment={saveLearningAssignment} onSaveLearningComment={saveLearningComment} onSavePracticeCase={saveLearningPracticeCase} onToggleLearningList={toggleLearningList} onUpdateLearningAssignment={updateLearningAssignment} onUpdateLearningComment={updateLearningComment} orders={visibleOrders} practiceCases={learningPracticeCases} quizProgress={quizProgress} updateLearningProgress={updateLearningProgress} />)}
    {active === "knowledge" && screen(<SketchesPage checkButton={checkButton} deleteSketch={deleteSketchRecord} orders={visibleOrders} saveSketch={saveSketchRecord} savedSketches={Array.isArray(savedSketches) ? savedSketches : []} selectedOrderId={selectedOrder?.id || selectedOrderId} setSketchImage={setSketchImage} showNotice={showNotice} sketchImage={sketchImage} />)}
  {active === "reportBook" && screen(<ReportBookPage canReview={canViewLearningTeam} onAddPhotoNote={addPhotoNoteToReport} onApplyTemplate={applyReportTemplate} onApproveLatest={approveLatestReport} onDelete={deleteReport} onExport={exportCurrentReport} onGenerateWeekly={generateWeeklyReport} onImportChecklist={importChecklistIntoReport} onSave={saveReportEntry} onSelectPdf={() => setPdfTarget("Berichtsheft-Eintrag")} reportExportText={reportExportText} reportLearningField={reportLearningField} reportMasterComment={reportMasterComment} reportMode={reportMode} reportProposal={reportProposal} reportReminder={reportReminder} reportStatus={reportStatus} reportTechnicalTerms={reportTerms} reportTemplateId={reportTemplateId} reportText={reportText} reportYear={reportYear} reports={myReports} setReportExportText={setReportExportText} setReportLearningField={setReportLearningField} setReportMasterComment={setReportMasterComment} setReportMode={setReportMode} setReportReminder={setReportReminder} setReportStatus={setReportStatus} setReportTemplateId={setReportTemplateId} setReportText={setReportText} setReportYear={setReportYear} showNotice={showNotice} />)}
  {active === "safety" && screen(<div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><SectionTitle icon={AlertTriangle} title="Sicherheits- und Warnsystem" subtitle="Kritische Kombinationen werden sichtbar gemacht." /><div className="space-y-3">{["WDVS: Lastabtragung und Abdichtung prüfen", "Markise: hohe Hebel- und Zugkräfte", "Elektro: Spannungsfreiheit und fachgerechte Messung", "Wind: Herstellerangaben und Sensorik beachten"].map((w) => <div key={w} className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-900">{w}</div>)}</div></Card><Card><SectionTitle icon={ShieldCheck} title="Warnhinweise" subtitle="Nicht als automatische Freigabe nutzen." /><p className="text-sm leading-6 text-slate-600">Herstellerangaben, Untergrund, Befestigung, Gebäudehöhe und Fachprüfung bleiben verbindlich.</p></Card></div>)}
    {active === "norms" && screen(<NormsPage checkButton={checkButton} moduleChecks={moduleChecks} selectedOrder={selectedOrder} selectedProduct={selectedProduct} />)}
    {(active === "pdf" || active === "documents") && screen(<PdfExportPage canManageCustomerDocuments={canManageOrders} currentPdfTemplate={currentPdfTemplate} getPdfValue={getPdfValue} pdfDocuments={pdfDocuments} pdfFileName={pdfFileName} pdfPreviewLines={pdfPreviewLines} pdfTarget={pdfTarget} pdfTemplateDefinitions={pdfTemplateDefinitions} resetPdfTemplate={resetPdfTemplate} savePdfDocument={savePdfDocument} selectedOrder={selectedOrder} selectedProduct={selectedProduct} setPdfField={setPdfField} setPdfTarget={setPdfTarget} updateCustomerDocumentVisibility={updateCustomerDocumentVisibility} updatePdfDocumentStatus={updatePdfDocumentStatus} />)}
    {active === "rights" && screen(<RightsPage navItems={navigationItems} />)}
  {active === "company" && screen(<CompanyTeamPage canManage={canViewLearningTeam} company={company} companyPeople={companyPeople} createCompanyPerson={createCompanyPerson} onArchivePerson={archivePerson} onRegenerateCode={regeneratePersonCode} onSetPersonStatus={setPersonStatus} onUpdatePerson={updateCompanyPerson} orders={orders} personForm={personForm} personRoleLabel={personRoleLabel} setCompany={setCompany} setPersonForm={setPersonForm} showNotice={showNotice} teamRoleOptions={teamRoleOptions} updateAzubiProgress={updateAzubiProgress} />)}
  {active === "planning" && screen(<PlanningPage absences={planningAbsences} appRole={appRole} currentPerson={currentPerson} offline={offline} onCreateAbsence={createPlanningAbsenceEntry} onCreateLearningCase={createLearningPracticeCaseFromOrder} onDeleteAbsence={deletePlanningAbsence} onOpenOrder={openPlanningOrder} onOpenOrderArea={openPlanningOrderArea} onStartOrder={startPlanningOrder} onUpdateOrder={updatePlanningOrder} orders={orders} partRequests={partRequests} pendingOrderIds={pendingPlanningOrderIds} people={companyPeople} />)}
    {(["portal", "customerDocuments", "customerCare", "customerContact"].includes(active)) && screen(<CustomerPortalPage company={company} currentCustomerOrders={currentCustomerOrders} customerDocuments={currentCustomerDocuments} confirmCustomerAppointment={confirmCustomerAppointment} confirmCustomerApproval={confirmCustomerApproval} confirmCustomerDocument={confirmCustomerDocument} initialSection={active} offline={offline} pendingSyncCount={pendingSyncCount} requestAppointmentChange={requestCustomerAppointmentChange} saveCustomerIssue={saveCustomerIssue} saveCustomerMessage={saveCustomerMessage} saveMaintenanceRequest={saveMaintenanceRequest} showNotice={showNotice} />)}
  {active === "azubiPlan" && screen(<div className="space-y-5">
    <Card><SectionTitle icon={GraduationCap} title="Azubi-Lernplan" subtitle="Lernmodule nach Ausbildungsjahr, Fortschritt und nächster Aufgabe." />
      <div className="grid gap-3 md:grid-cols-4"><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{currentPerson?.progress || companyPeople.find((p) => p.role === "azubi")?.progress || 0}%</p><p className="text-sm text-slate-600">Lernfortschritt</p></div><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{myReports.filter((r) => r.status !== "Freigegeben").length}</p><p className="text-sm text-slate-600">offene Berichte</p></div><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{quizCards.length}</p><p className="text-sm text-slate-600">Quizfragen</p></div><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{visibleOrders.length}</p><p className="text-sm text-slate-600">Baustellen</p></div></div>
    </Card>
    <Card><SectionTitle icon={BookOpen} title="Lernmodule" subtitle="Meister kann sehen, welche Themen für Azubis als nächstes sinnvoll sind." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{azubiLearningModules.map((module) => <article key={module.topic} className="rounded-3xl bg-slate-50 p-5"><div className="flex items-center justify-between"><h3 className="font-black">{module.topic}</h3><Badge>{module.year}. Jahr</Badge></div><p className="mt-3 text-sm leading-6 text-slate-600">{module.goal}</p><div className="mt-3 space-y-2">{module.tasks.map((task) => <div key={task} className="rounded-2xl bg-white p-3 text-xs font-bold text-slate-600">{task}</div>)}</div></article>)}</div></Card>
    <Card><SectionTitle icon={AlertTriangle} title="Empfehlung" subtitle="Automatische Lernhinweise aus Aufträgen, Berichten und Quiz." /><div className="rounded-3xl bg-amber-50 p-5 text-sm font-bold leading-6 text-amber-900">Diese Woche Motor-Endlagen, Funksteuerung und saubere Berichtsheft-Formulierungen wiederholen. Danach 10 Quizfragen lösen und einen Tagesbericht aus einem echten Auftrag erzeugen.</div></Card>
  </div>)}

  {active === "notes" && screen(<div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]"><Card><SectionTitle icon={Star} title="Favoriten & eigene Notizen" subtitle="Eigene Lösungen, Ersatzteilnummern oder häufige Hinweise speichern." /><TextArea label="Neue Notiz" value={favorite} onChange={setFavorite} /><button onClick={addNote} className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Notiz speichern</button></Card><Card><SectionTitle icon={PenTool} title="Gespeicherte Notizen" subtitle="Lokale Notizen im Browser." /><div className="space-y-3">{notes.map((n) => <div key={n.id} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6"><Badge>{n.module}</Badge><p className="mt-2">{n.text}</p></div>)}</div></Card></div>)}
  {active === "ki" && screen(<div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><SectionTitle icon={Sparkles} title="KI-Assistent" subtitle="Erzeugt Prüfschritte zum aktiven Auftrag." /><textarea placeholder="Beispiel: Vorbaurollladen auf WDVS mit Funkmotor, worauf achten?" className="h-40 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none" /><button onClick={generateKiAnswer} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"><Sparkles size={18} />Prüfschritte vorschlagen</button>{generatedAiResponse && <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">{generatedAiResponse}</div>}</Card><Card><SectionTitle icon={Layers} title="Antwort-Struktur" subtitle="So soll die KI später antworten." /><div className="space-y-3">{["Produkt und Auftrag erkennen", "Untergrund und Sicherheit prüfen", "Werkzeug und Checkliste anzeigen", "Diagnose oder Montageablauf vorschlagen", "Protokoll/Fotos/Notizen speichern"].map((s, i) => <div key={s} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold">{i + 1}. {s}</div>)}</div></Card></div>)}
      </main>
    </div>
  </div>;
}
