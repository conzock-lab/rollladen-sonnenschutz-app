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
const LEARNING_ROLES = ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"];
const REPORT_BOOK_ROLES = ["dev", "meister", "buero", "azubi"];

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
    id: "orders",
    label: "Aufträge",
    icon: BriefcaseBusiness,
    defaultId: "orders",
    items: [
      { id: "today", label: "Heute", icon: CalendarDays, roles: ALL_INTERNAL_ROLES, keywords: ["tagesplanung", "termine"] },
      { id: "orders", label: "Aufträge", shortLabel: "Aufträge", icon: BriefcaseBusiness, roles: ALL_INTERNAL_ROLES, mobilePriority: 2, keywords: ["auftrag", "auftragsnummer", "kunde", "baustelle"] },
      { id: "customers", label: "Kunden", icon: UsersRound, roles: ["dev", "meister", "buero", "vorarbeiter"], keywords: ["kundenname", "kommunikation", "rückfrage"] },
      { id: "measurement", label: "Aufmaß", icon: Wrench, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"], keywords: ["maße", "messen", "breite", "höhe"] },
      { id: "checklists", label: "Checklisten", icon: ClipboardCheck, roles: FIELD_ROLES, keywords: ["prüfschritte", "montage", "kontrolle"] },
      { id: "closeOrder", label: "Auftrag abschließen", icon: CheckCircle2, roles: ["dev", "meister", "vorarbeiter", "monteur"], keywords: ["abschluss", "erledigt", "nacharbeit"] },
      { id: "offers", label: "Angebote", icon: Euro, roles: ["dev", "meister", "buero"], keywords: ["angebot", "preis", "kalkulation"] },
      { id: "documents", label: "Dokumente", icon: Files, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"], keywords: ["dokument", "pdf", "protokoll", "druck", "montageprotokoll", "archiv", "status"] },
    ],
  },
  {
    id: "technology",
    label: "Technik",
    icon: Wrench,
    defaultId: "diagnose",
    items: [
      { id: "technical", label: "Technik-Suche", icon: Search, roles: ALL_INTERNAL_ROLES, keywords: ["technik", "hersteller", "motor", "ersatzteil", "diagnose"] },
      { id: "diagnose", label: "Erweiterte Fehlerdiagnose", shortLabel: "Diagnose", icon: HelpCircle, roles: ALL_INTERNAL_ROLES, mobilePriority: 3, keywords: ["motor brummt", "fehler", "störung", "gurtwickler"] },
      { id: "motors", label: "Motoren & Steuerungen", icon: Zap, roles: ALL_INTERNAL_ROLES, keywords: ["somfy", "rohrmotor", "funkmotor", "sensor", "steuerung"] },
      { id: "substrates", label: "Untergrund-Assistent", icon: HardHat, roles: ALL_INTERNAL_ROLES, keywords: ["wdvs", "beton", "lochstein", "klinker", "holz", "stahl"] },
      { id: "parts", label: "Ersatzteil-Finder", icon: PackageSearch, roles: ALL_INTERNAL_ROLES, keywords: ["ersatzteil", "profil", "welle", "führung"] },
      { id: "photos", label: "Foto-KI", shortLabel: "Foto", icon: Camera, roles: ALL_INTERNAL_ROLES, mobilePriority: 4, keywords: ["foto", "typenschild", "schaden"] },
      { id: "ki", label: "KI-Assistent", icon: Search, roles: ALL_INTERNAL_ROLES, keywords: ["assistent", "prüfschritte", "auftrag"] },
    ],
  },
  {
    id: "knowledge",
    label: "Wissen",
    icon: BookOpen,
    defaultId: "products",
    items: [
      { id: "products", label: "Produkt-Lexikon", icon: Sun, roles: ALL_INTERNAL_ROLES, keywords: ["markise", "raffstore", "zip-screen", "rollladen", "insektenschutz"] },
      { id: "manufacturers", label: "Herstellerdatenbank", icon: Database, roles: ALL_INTERNAL_ROLES, keywords: ["somfy", "selve", "elero", "hersteller"] },
      { id: "tools", label: "Werkzeug & Material", icon: Hammer, roles: ALL_INTERNAL_ROLES, keywords: ["werkzeug", "bohrer", "material"] },
      { id: "maintenance", label: "Wartung & Pflege", icon: RefreshCw, roles: ALL_INTERNAL_ROLES, keywords: ["pflege", "wartung", "inspektion"] },
      { id: "norms", label: "Normen & Sicherheit", icon: ShieldCheck, roles: ALL_INTERNAL_ROLES, keywords: ["din", "norm", "sicherheit", "vorschrift"] },
      { id: "safety", label: "Sicherheits-Hinweise", icon: ShieldCheck, roles: ALL_INTERNAL_ROLES, keywords: ["warnsystem", "elektro", "wind", "befestigung"] },
      { id: "knowledge", label: "Skizzen", icon: Layers, roles: ALL_INTERNAL_ROLES, keywords: ["skizze", "aufmaß", "bohrpunkte"] },
    ],
  },
  {
    id: "learning",
    label: "Lernen",
    icon: GraduationCap,
    defaultId: "learning",
    items: [
      { id: "learning", label: "Lernmodule", icon: GraduationCap, roles: LEARNING_ROLES, keywords: ["lernen", "ausbildungsjahr", "fortschritt"] },
      { id: "quiz", label: "Quiz", icon: ClipboardCheck, roles: LEARNING_ROLES, keywords: ["fragen", "wissenstest"] },
      { id: "reportBook", label: "Berichtsheft", icon: NotebookPen, roles: REPORT_BOOK_ROLES, keywords: ["tagesbericht", "wochenbericht", "ausbildung"] },
      { id: "azubiPlan", label: "Azubi-Fortschritt", icon: GraduationCap, roles: REPORT_BOOK_ROLES, keywords: ["lernstand", "lernplan", "fortschritt"] },
    ],
  },
  {
    id: "company",
    label: "Firma",
    icon: Building2,
    defaultId: "company",
    items: [
      { id: "company", label: "Firma & Team", icon: UserRound, roles: ["dev", "meister", "buero"], keywords: ["mitarbeiter", "team", "code", "firma"] },
      { id: "planning", label: "Baustellenplanung", icon: ClipboardList, roles: ["dev", "meister", "buero", "vorarbeiter"], keywords: ["tagesplanung", "wochenplanung", "kolonne", "team zuweisen", "abwesenheit", "nacharbeit"] },
      { id: "rights", label: "Rechte & Rollen", icon: ShieldCheck, roles: ["dev", "meister", "buero"], keywords: ["rolle", "berechtigung", "rls"] },
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
    id: "customerAppointments",
    label: "Meine Aufträge",
    icon: CalendarDays,
    customerOnly: true,
    items: [
      { id: "portal", label: "Meine Aufträge", shortLabel: "Aufträge", icon: CalendarDays, roles: ["kunde"], mobilePriority: 2, keywords: ["termin", "auftrag", "status"] },
    ],
  },
  {
    id: "customerDocuments",
    label: "Dokumente",
    icon: FileText,
    customerOnly: true,
    items: [
      { id: "customerDocuments", label: "Dokumente", shortLabel: "Dokumente", icon: FileText, roles: ["kunde"], mobilePriority: 3, keywords: ["pdf", "protokoll", "dokument"] },
    ],
  },
  {
    id: "customerCare",
    label: "Pflege & Wartung",
    icon: RefreshCw,
    customerOnly: true,
    items: [
      { id: "customerCare", label: "Pflege & Wartung", shortLabel: "Pflege", icon: RefreshCw, roles: ["kunde"], mobilePriority: 4, keywords: ["pflege", "wartung", "bedienung"] },
    ],
  },
  {
    id: "customerContact",
    label: "Kontakt",
    icon: MessageSquareText,
    customerOnly: true,
    items: [
      { id: "customerContact", label: "Kontakt", shortLabel: "Kontakt", icon: MessageSquareText, roles: ["kunde"], keywords: ["kontakt", "frage", "ansprechpartner", "problem"] },
    ],
  },
];

export const hiddenPages = [
  { id: "workflow", label: "Auftrags-Workflow", icon: ClipboardList, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur"] },
  { id: "pdf", label: "PDF / Protokolle", icon: FileText, roles: ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"] },
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
