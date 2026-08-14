import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Database,
  Euro,
  FileText,
  Files,
  GraduationCap,
  Hammer,
  HardHat,
  HelpCircle,
  Home,
  Layers,
  MessageSquareText,
  NotebookPen,
  PackageSearch,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  UsersRound,
  Wrench,
  Zap,
} from "lucide-react";

const ALL_INTERNAL_ROLES = ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"];
const FIELD_ROLES = ["dev", "meister", "vorarbeiter", "monteur", "azubi"];

export const navigationGroups = [
  {
    id: "start",
    label: "Start",
    icon: Home,
    items: [
      { id: "dashboard", label: "Dashboard / Start", shortLabel: "Start", icon: Home, roles: [...ALL_INTERNAL_ROLES, "kunde"], mobilePriority: 1, keywords: ["übersicht", "heute", "start"] },
    ],
  },
  {
    id: "work",
    label: "Arbeit",
    icon: BriefcaseBusiness,
    items: [
      { id: "today", label: "Heute", icon: CalendarDays, roles: ALL_INTERNAL_ROLES, keywords: ["tagesplanung", "termine"] },
      { id: "orders", label: "Aufträge", shortLabel: "Aufträge", icon: BriefcaseBusiness, roles: ALL_INTERNAL_ROLES, mobilePriority: 2, keywords: ["auftrag", "auftragsnummer", "kunde", "baustelle"] },
      { id: "customers", label: "Kunden", icon: UsersRound, roles: ["dev", "meister", "buero", "vorarbeiter"], keywords: ["kundenname", "kommunikation", "rückfrage"] },
      { id: "measurement", label: "Aufmaß", icon: Wrench, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"], keywords: ["maße", "messen", "breite", "höhe"] },
      { id: "closeOrder", label: "Auftrag abschließen", icon: CheckCircle2, roles: ["dev", "meister", "vorarbeiter", "monteur"], keywords: ["abschluss", "erledigt", "nacharbeit"] },
    ],
  },
  {
    id: "technology",
    label: "Technik",
    icon: Wrench,
    items: [
      { id: "diagnose", label: "Fehlerdiagnose", shortLabel: "Diagnose", icon: HelpCircle, roles: FIELD_ROLES, mobilePriority: 3, keywords: ["motor brummt", "fehler", "störung", "gurtwickler"] },
      { id: "motors", label: "Motoren & Steuerungen", icon: Zap, roles: FIELD_ROLES, keywords: ["somfy", "rohrmotor", "funkmotor", "sensor", "steuerung"] },
      { id: "substrates", label: "Untergrund-Assistent", icon: HardHat, roles: FIELD_ROLES, keywords: ["wdvs", "beton", "lochstein", "klinker", "holz", "stahl"] },
      { id: "parts", label: "Ersatzteil-Finder", icon: PackageSearch, roles: FIELD_ROLES, keywords: ["ersatzteil", "profil", "welle", "führung"] },
      { id: "photos", label: "Foto-KI", shortLabel: "Foto", icon: Camera, roles: FIELD_ROLES, mobilePriority: 4, keywords: ["foto", "typenschild", "schaden"] },
    ],
  },
  {
    id: "knowledge",
    label: "Wissen",
    icon: BookOpen,
    items: [
      { id: "products", label: "Produkt-Lexikon", icon: Sun, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"], keywords: ["markise", "raffstore", "zip-screen", "rollladen", "insektenschutz"] },
      { id: "manufacturers", label: "Hersteller", icon: Database, roles: ["dev", "meister", "buero", "vorarbeiter", "azubi"], keywords: ["somfy", "selve", "elero", "hersteller"] },
      { id: "tools", label: "Werkzeug & Material", icon: Hammer, roles: FIELD_ROLES, keywords: ["werkzeug", "bohrer", "material"] },
      { id: "maintenance", label: "Wartung & Pflege", icon: RefreshCw, roles: FIELD_ROLES, keywords: ["pflege", "wartung", "inspektion"] },
      { id: "norms", label: "Normen & Sicherheit", icon: ShieldCheck, roles: ["dev", "meister", "buero", "vorarbeiter", "azubi"], keywords: ["din", "norm", "sicherheit", "vorschrift"] },
      { id: "knowledge", label: "Skizzen", icon: Layers, roles: FIELD_ROLES, keywords: ["skizze", "aufmaß", "bohrpunkte"] },
    ],
  },
  {
    id: "training",
    label: "Ausbildung",
    icon: GraduationCap,
    items: [
      { id: "learning", label: "Lernmodus", icon: GraduationCap, roles: ["dev", "meister", "azubi"], keywords: ["lernen", "ausbildungsjahr", "fortschritt"] },
      { id: "quiz", label: "Quiz", icon: ClipboardCheck, roles: ["dev", "meister", "azubi"], keywords: ["fragen", "wissenstest"] },
      { id: "reportBook", label: "Berichtsheft", icon: NotebookPen, roles: ["dev", "meister", "azubi"], keywords: ["tagesbericht", "wochenbericht", "ausbildung"] },
    ],
  },
  {
    id: "documents",
    label: "Dokumente",
    icon: Files,
    items: [
      { id: "pdf", label: "PDF / Protokolle", icon: FileText, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur"], keywords: ["pdf", "protokoll", "druck", "montageprotokoll"] },
      { id: "offers", label: "Angebote", icon: Euro, roles: ["dev", "meister", "buero"], keywords: ["angebot", "preis", "kalkulation"] },
      { id: "documents", label: "Dokumentenübersicht", icon: Files, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur"], keywords: ["dokument", "archiv", "status"] },
    ],
  },
  {
    id: "administration",
    label: "Verwaltung",
    icon: Building2,
    items: [
      { id: "company", label: "Firma & Team", icon: UserRound, roles: ["dev", "meister", "buero"], keywords: ["mitarbeiter", "team", "code", "firma"] },
      { id: "rights", label: "Rechte", icon: ShieldCheck, roles: ["dev", "meister", "buero"], keywords: ["rolle", "berechtigung", "rls"] },
      { id: "planning", label: "Planung / Baustellenplanung", icon: ClipboardList, roles: ["dev", "meister", "buero", "vorarbeiter"], keywords: ["kolonne", "team zuweisen", "planung"] },
    ],
  },
  {
    id: "more",
    label: "Mehr",
    icon: Settings,
    items: [
      { id: "notes", label: "Einstellungen & Notizen", icon: Settings, roles: ALL_INTERNAL_ROLES, keywords: ["einstellungen", "favoriten", "notizen"] },
    ],
  },
  {
    id: "customer",
    label: "Kundenbereich",
    icon: Home,
    customerOnly: true,
    items: [
      { id: "portal", label: "Meine Termine & Aufträge", shortLabel: "Termine", icon: CalendarDays, roles: ["kunde"], mobilePriority: 2, keywords: ["termin", "auftrag", "status"] },
      { id: "customerDocuments", label: "Dokumente", shortLabel: "Dokumente", icon: FileText, roles: ["kunde"], mobilePriority: 3, keywords: ["pdf", "protokoll", "dokument"] },
      { id: "customerCare", label: "Pflegehinweise", shortLabel: "Pflege", icon: RefreshCw, roles: ["kunde"], mobilePriority: 4, keywords: ["pflege", "wartung", "bedienung"] },
      { id: "customerContact", label: "Kontakt / Rückfrage", icon: MessageSquareText, roles: ["kunde"], keywords: ["kontakt", "frage", "ansprechpartner"] },
    ],
  },
];

export const hiddenPages = [
  { id: "checklists", label: "Checklisten", icon: ClipboardCheck, roles: FIELD_ROLES },
  { id: "workflow", label: "Auftrags-Workflow", icon: ClipboardList, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur"] },
  { id: "azubiPlan", label: "Azubi-Plan", icon: GraduationCap, roles: ["dev", "meister", "azubi"] },
  { id: "safety", label: "Warnsystem", icon: ShieldCheck, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"] },
  { id: "ki", label: "KI-Assistent", icon: Search, roles: ALL_INTERNAL_ROLES },
];

const isAllowed = (entry, role) => role === "dev" || entry.roles?.includes(role);

export const navigationItems = navigationGroups.flatMap((group) => group.items);

export function getNavigationGroups(role) {
  return navigationGroups
    .filter((group) => role === "kunde" ? group.id === "start" || group.customerOnly : !group.customerOnly)
    .map((group) => ({ ...group, items: group.items.filter((item) => isAllowed(item, role)) }))
    .filter((group) => group.items.length > 0);
}

export function getAllowedPages(role) {
  return [...navigationItems, ...hiddenPages].filter((item) => isAllowed(item, role));
}

export function getMobilePrimaryItems(role) {
  return getNavigationGroups(role)
    .flatMap((group) => group.items)
    .filter((item) => Number.isFinite(item.mobilePriority))
    .sort((a, b) => a.mobilePriority - b.mobilePriority)
    .slice(0, 4);
}

export function findNavigationItem(id) {
  return [...navigationItems, ...hiddenPages].find((item) => item.id === id);
}

