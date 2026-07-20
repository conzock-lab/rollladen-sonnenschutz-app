import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  Camera,
  Check,
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
  Wifi,
  WifiOff,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

const todayIso = () => new Date().toISOString().slice(0, 10);

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
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

const roles = [
  { id: "dev", label: "Dev / Alles sehen", description: "Entwickleransicht mit allen App-Bereichen." },
  { id: "azubi", label: "Azubi", description: "Lernen, Berichtsheft, Grundlagen, Sicherheit und einfache Baustellenhilfe." },
  { id: "vorarbeiter", label: "Vorarbeiter", description: "Kolonne, Baustellenzuweisung, Teamfortschritt, Fotos und Abschlussprüfung." },
  { id: "monteur", label: "Monteur / Geselle", description: "Aufträge, Montage, Diagnose, Fotos, Protokolle und Ersatzteile." },
  { id: "meister", label: "Meister / Bauleiter", description: "Planung, Qualität, Normen, Freigaben, Kalkulation und Sicherheit." },
  { id: "buero", label: "Büro", description: "Aufmaß, Angebote, Kundenkommunikation, PDF und Auftragsverwaltung." },
  { id: "kunde", label: "Kunde", description: "Pflege, Wartung, Bedienhinweise und Übergabeinformationen." },
];

const navItems = [
  { id: "dashboard", label: "Start", icon: Home, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero", "kunde"] },
  { id: "today", label: "Heute", icon: ClipboardList, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "orders", label: "Aufträge", icon: BriefcaseBusiness, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "closeOrder", label: "Abschluss", icon: CheckCircle2, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "products", label: "Produkte", icon: Sun, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "checklists", label: "Checklisten", icon: ClipboardCheck, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "tools", label: "Werkzeug", icon: Hammer, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "substrates", label: "Untergrund", icon: HardHat, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "motors", label: "Motoren", icon: Zap, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "diagnose", label: "Diagnose", icon: HelpCircle, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "manufacturers", label: "Hersteller", icon: Database, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "measurement", label: "Aufmaß", icon: Wrench, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "offers", label: "Angebot", icon: Euro, roles: ["meister", "buero"] },
  { id: "photos", label: "Foto-KI", icon: Camera, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "parts", label: "Ersatzteile", icon: PackageSearch, roles: ["vorarbeiter", "monteur", "meister", "buero"] },
  { id: "customers", label: "Kunden", icon: MessageSquareText, roles: ["vorarbeiter", "monteur", "meister", "buero", "kunde"] },
  { id: "maintenance", label: "Wartung", icon: RefreshCw, roles: ["azubi", "vorarbeiter", "monteur", "meister", "kunde"] },
  { id: "learning", label: "Lernen", icon: GraduationCap, roles: ["azubi", "meister"] },
  { id: "knowledge", label: "Skizzen", icon: Layers, roles: ["azubi", "vorarbeiter", "monteur", "meister"] },
  { id: "reportBook", label: "Berichtsheft", icon: BookOpen, roles: ["azubi", "meister"] },
  { id: "safety", label: "Warnsystem", icon: AlertTriangle, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "norms", label: "Normen", icon: ShieldCheck, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "pdf", label: "PDF Export", icon: Download, roles: ["vorarbeiter", "monteur", "meister", "buero", "kunde"] },
  { id: "offline", label: "Offline", icon: WifiOff, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "rights", label: "Rechte", icon: Settings, roles: ["meister", "buero"] },
  { id: "data", label: "Login/Cloud", icon: Database, roles: ["meister", "buero"] },
  { id: "company", label: "Firma & Team", icon: UserRound, roles: ["meister", "buero"] },
  { id: "planning", label: "Baustellenplanung", icon: BriefcaseBusiness, roles: ["meister", "buero", "vorarbeiter"] },
  { id: "notes", label: "Notizen", icon: Star, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
  { id: "ki", label: "KI", icon: Sparkles, roles: ["azubi", "vorarbeiter", "monteur", "meister", "buero"] },
];

const productTypes = [
  { id: "vorbaurollladen", name: "Vorbaurollladen", category: "Rollladen", description: "Nachrüstung oder Renovierung. Kasten und Führung sitzen außen vor dem Fenster oder in der Laibung.", steps: ["Aufmaß prüfen", "Untergrund prüfen", "Kasten/Schienen ausrichten", "bohren und befestigen", "Panzerlauf prüfen", "Motor/Bedienung einstellen", "Übergabe dokumentieren"], tools: ["Maßband", "Laser", "Bohrmaschine", "Akkuschrauber", "Steinbohrer", "Nietzange", "Einstellkabel", "Multimeter"], risks: ["Revision verbaut", "Schienen nicht parallel", "Kabelauslass falsch", "WDVS falsch befestigt"] },
  { id: "aufsatzrollladen", name: "Aufsatzrollladen", category: "Rollladen", description: "Kasten sitzt auf dem Fenster. Relevant bei Neubau oder Fenstertausch.", steps: ["Fenstermaß abstimmen", "Kasten mit Fenster verbinden", "Dichtung/Dämmung prüfen", "Führung montieren", "Funktion testen"], tools: ["Fensterbau-Werkzeug", "Montagekeile", "Laser", "Dichtband", "Akkuschrauber", "Multimeter"], risks: ["Luftdichtheit", "Revision nicht zugänglich", "Fenstermaß passt nicht"] },
  { id: "markise", name: "Gelenkarm-/Kassettenmarkise", category: "Markise", description: "Terrassen- oder Balkonschutz mit hohen Kräften auf Konsolen und Untergrund.", steps: ["Montagehöhe und Ausfall prüfen", "Untergrund bewerten", "Konsolen anzeichnen", "Befestigung setzen", "Markise einhängen", "Neigung/Endlagen einstellen", "Windhinweis erklären"], tools: ["Bohrhammer", "Laser", "Drehmomentschlüssel", "Montagelift", "Injektionszubehör", "Steckschlüssel", "Sender"], risks: ["hohe Zugkräfte", "WDVS", "falsche Konsole", "Windklasse falsch verstanden"] },
  { id: "raffstore", name: "Raffstore / Außenjalousie", category: "Außenjalousie", description: "Außenliegende Lamellenanlage für Sonnenschutz und Lichtlenkung.", steps: ["Blende/Kasten prüfen", "Führungen ausrichten", "Lamellenpaket einsetzen", "Wendung prüfen", "Windwächter testen"], tools: ["Laser", "Akkuschrauber", "Bohrmaschine", "Nietzange", "Seilschneider", "Einstellkabel"], risks: ["Lamellen verdreht", "Wendepunkt falsch", "Windgrenze unklar", "Führung locker"] },
  { id: "zipscreen", name: "ZIP-Screen", category: "Textilscreen", description: "Textiler Sonnenschutz mit seitlicher ZIP-Führung.", steps: ["Öffnung prüfen", "Kasten setzen", "Schienen parallel montieren", "Tuchlauf prüfen", "Endlagen exakt einstellen"], tools: ["Laser", "Akkuschrauber", "Bohrmaschine", "Kunststoffkeile", "Sender", "weiche Bürste"], risks: ["Schienen schief", "Tuch verkantet", "Schmutz in ZIP-Führung"] },
  { id: "insektenschutz", name: "Insektenschutz", category: "Zubehör", description: "Spannrahmen, Drehrahmen, Schiebeanlage oder Rollo gegen Insekten.", steps: ["lichte Maße prüfen", "Rahmen vorbereiten", "Bürsten einsetzen", "montieren", "Schließung/Lauf prüfen"], tools: ["Maßband", "Gehrungssäge", "Gummihammer", "Feile", "Akkuschrauber", "Cuttermesser"], risks: ["Rahmen verzogen", "Bürste zu stramm", "Griffposition nicht beachtet"] },
  { id: "rolltor", name: "Rolltor / Rollgitter", category: "Tor", description: "Abschluss für Garage, Halle oder Gewerbe mit besonderem Sicherheitsbedarf.", steps: ["Öffnung prüfen", "Führungen/Welle montieren", "Panzer einsetzen", "Sicherheitseinrichtungen prüfen", "Notbedienung erklären"], tools: ["Bohrhammer", "Laser", "Montagelift", "Steckschlüssel", "Drehmomentschlüssel", "Multimeter", "Prüfprotokoll"], risks: ["Sicherheitseinrichtung fehlt", "Notentriegelung unklar", "Endlage falsch"] },
];

const checklistTemplates = {
  vorbaurollladen: ["Auftrag und Maße geprüft", "Kabelauslass geklärt", "Untergrund geprüft", "Schienen parallel markiert", "Kasten befestigt", "Panzerlauf getestet", "Endlagen eingestellt", "Fotos gemacht", "Kunde eingewiesen"],
  aufsatzrollladen: ["Fenstermaß abgestimmt", "Kastenverbindung geprüft", "Luftdichtheit/Dämmung geprüft", "Führungsschienen montiert", "Revision zugänglich", "Antrieb getestet", "Übergabe dokumentiert"],
  markise: ["Untergrund bewertet", "Konsolenposition geprüft", "Befestigungssystem gewählt", "Bohrlöcher gereinigt", "Drehmoment geprüft", "Neigung eingestellt", "Windhinweis erklärt", "Protokoll erstellt"],
  raffstore: ["Paketraum geprüft", "Führung montiert", "Lamellenlauf geprüft", "Wendung getestet", "Windwächter geprüft", "Kunde eingewiesen"],
  zipscreen: ["Öffnung rechtwinklig geprüft", "Schienen parallel", "Tuchlauf sauber", "Endlagen exakt", "Schienenreinigung erklärt"],
  insektenschutz: ["lichte Maße geprüft", "Rahmen rechtwinklig", "Bürsten angepasst", "Schließung/Lauf getestet", "Pflegehinweis gegeben"],
  rolltor: ["Sicherheitsabstände geprüft", "Führungen befestigt", "Panzerlauf geprüft", "Sicherheitseinrichtungen getestet", "Notbedienung erklärt", "Wartungshinweis gegeben"],
};
const dynamicChecklistRules = [
  { when: { substrate: "WDVS" }, items: ["Dämmstärke ermittelt", "Abstandsmontagesystem gewählt", "Lastabtragung in tragenden Untergrund geprüft", "Abdichtung dokumentiert"] },
  { when: { drive: "Funkmotor" }, items: ["Senderkanal beschriftet", "Funkreichweite geprüft", "Gruppensteuerung erklärt", "Batteriehinweis gegeben"] },
  { when: { drive: "Tastermotor" }, items: ["Tasterposition geprüft", "Drehrichtung geprüft", "Anschluss dokumentiert", "Bedienung erklärt"] },
  { when: { installType: "Renovierung" }, items: ["Altanlage demontiert", "Entsorgung geklärt", "Bestandsschäden dokumentiert"] },
  { when: { windCritical: true }, items: ["Windlage bewertet", "Windklasse/Herstellerangabe geprüft", "Kundenhinweis Wind dokumentiert", "Sensorik geprüft"] },
];
const measurementRequiredFields = {
  vorbaurollladen: ["Breite", "Höhe", "Kastenform", "Führungsschiene", "Bedienseite", "Motorseite", "Revision", "Kabelauslass", "Untergrund", "Farbe", "Fensterfoto"],
  markise: ["Breite", "Ausfall", "Montagehöhe", "Neigung", "Untergrund", "Konsolenposition", "Windlage", "Stromanschluss", "Tuchfarbe", "Montagefoto"],
  raffstore: ["Breite", "Höhe", "Paketraum", "Führung", "Lamellentyp", "Bedienung", "Windwächter", "Fassadenlage", "Foto"],
  zipscreen: ["Breite", "Höhe", "Schienenmaß", "Kastenmaß", "Tuchfarbe", "Motorseite", "Untergrund", "Rechtwinkligkeit", "Foto"],
  insektenschutz: ["lichte Breite", "lichte Höhe", "Rahmentyp", "Griffposition", "Bürstenhöhe", "Farbe", "Foto"],
  rolltor: ["lichte Breite", "lichte Höhe", "Sturzhöhe", "Seitenplatz", "Strom", "Sicherheitseinrichtung", "Notbedienung", "Foto"],
};
const qualityRequirements = [
  { id: "checklist", label: "Produkt-Checkliste vollständig", type: "checklist" },
  { id: "photos", label: "Vorher-, Nachher- und Typenschildfoto vorhanden", type: "photos" },
  { id: "customer", label: "Kunde eingewiesen", type: "manual" },
  { id: "motor", label: "Motor/Bedienung getestet", type: "manual" },
  { id: "protocol", label: "Protokoll/Notizen ausgefüllt", type: "notes" },
  { id: "pdf", label: "PDF/Export vorbereitet", type: "manual" },
];

const toolKits = [
  { group: "Messen & Anzeichnen", items: ["Maßband", "Gliedermaßstab", "Laser-Entfernungsmesser", "Kreuzlinienlaser", "Wasserwaage", "Schlagschnur", "Winkel", "Schieblehre"] },
  { group: "Bohren & Befestigen", items: ["Akkuschrauber", "Bohrmaschine", "Bohrhammer", "Steinbohrer", "Betonbohrer", "Metallbohrer", "Holzbohrer", "Bit-Satz", "Drehmomentschlüssel", "Bohrlochbürste", "Ausbläser"] },
  { group: "Elektro & Motor", items: ["Spannungsprüfer", "Multimeter", "Einstellkabel", "Prüfkabel", "Abisolierzange", "Aderendhülsenzange", "Klemmen", "Handsender", "Ersatzbatterien"] },
  { group: "Montage & Zuschnitt", items: ["Nietzange", "Blechschere", "Feile", "Entgrater", "Cuttermesser", "Metallsäge", "Gehrungssäge", "Gummihammer", "Montagekissen", "Montagelift"] },
  { group: "Abdichten & Reinigen", items: ["Kartuschenpistole", "Silikon", "MS-Polymer", "Dichtband", "Isopropanol", "weiche Bürste", "Staubsauger", "Lappen"] },
  { group: "Sicherheit", items: ["PSA", "Handschuhe", "Schutzbrille", "Gehörschutz", "Leiter", "Gerüst", "Absperrband", "Leitungssucher", "Erste-Hilfe-Set"] },
];
const substrates = [
  { name: "Beton", tools: ["Bohrhammer", "SDS-Bohrer", "Bohrlochbürste", "Ausbläser", "Drehmomentschlüssel"], fasteners: ["Schwerlastanker", "Betonschraube", "Injektionsanker"], warning: "Randabstände und Bohrlochreinigung beachten." },
  { name: "Vollstein", tools: ["Steinbohrer", "Bohrmaschine", "Drehmomentschlüssel"], fasteners: ["Rahmendübel", "Langschaftdübel", "Injektionsanker"], warning: "Altbau kann wechselnde Festigkeit haben." },
  { name: "Lochstein", tools: ["Bohrmaschine ohne Schlag", "Ziegelbohrer", "Siebhülse", "Injektionspistole"], fasteners: ["Injektionssystem", "Spezialdübel"], warning: "Normale Dübel können ausreißen." },
  { name: "Porenbeton", tools: ["Bohrmaschine ohne Schlag", "Porenbetonbohrer", "Spezialsetzwerkzeug"], fasteners: ["Porenbetondübel", "Spezialanker"], warning: "Für schwere Markisen kritisch prüfen." },
  { name: "WDVS", tools: ["langer Bohrer", "Abstandsmontagesystem", "Injektionszubehör", "Dichtmittel"], fasteners: ["zugelassenes Abstandsmontagesystem", "Thermotrennelement"], warning: "Lasten nicht in Dämmung, sondern in tragenden Untergrund ableiten." },
  { name: "Holz", tools: ["Holzbohrer", "Akkuschrauber", "Vorbohrer", "Korrosionsschutz-Schrauben"], fasteners: ["Holzschrauben", "Schlüsselschrauben", "Gegenplatte"], warning: "Tragende Stärke prüfen, Verkleidung reicht nicht." },
  { name: "Stahl", tools: ["Metallbohrer", "Körner", "Schneidöl", "Gewindeschneider"], fasteners: ["Maschinenschraube", "Gewindebolzen", "Klemmkonsole"], warning: "Statik und Korrosionsschutz beachten." },
];
const motorTypes = [
  { name: "Mechanischer Rohrmotor", details: "Endlagen werden mit Einstellschrauben oder Einstelltasten gesetzt.", checks: ["Drehrichtung", "untere Endlage", "obere Endlage", "Probefahrten", "Dokumentation"], mistakes: ["Endlage zu hoch", "falscher Adapter", "Taster vertauscht"] },
  { name: "Elektronischer Rohrmotor", details: "Endlagen werden elektronisch, automatisch oder per Einstellkabel gesetzt.", checks: ["Modell bestimmen", "Lernfahrt", "Hinderniserkennung", "Festfrierschutz", "Speicherung"], mistakes: ["falsche Lernsequenz", "schwergängiger Panzer", "Endlage nicht gespeichert"] },
  { name: "Funkmotor", details: "Motor mit internem oder externem Empfänger für Handsender, Wandsender oder Smart Home.", checks: ["einzeln Spannung geben", "Kanal wählen", "Sender koppeln", "Endlagen", "Reichweite"], mistakes: ["mehrere Motoren gekoppelt", "falscher Kanal", "Batterie schwach"] },
  { name: "Solarmotor", details: "Akku-Motor mit Solarpanel, oft bei Nachrüstung ohne Zuleitung.", checks: ["Akkustand", "Panelposition", "Stecker", "Endlagen", "Winterhinweis"], mistakes: ["Panel verschattet", "Akku leer", "Steckverbindung lose"] },
  { name: "Steuerungen & Sensorik", details: "Taster, Zentralsteuerung, Wind-Sonnen-Sensor, Zeitschaltuhr und Smart Home.", checks: ["Nutzerwunsch", "Sensorposition", "Fahrzeiten", "Prioritäten", "Kundeneinweisung"], mistakes: ["Sensor falsch montiert", "Windgrenze zu hoch", "Automatik nicht erklärt"] },
];
const manufacturers = [
  { name: "Somfy", protocols: ["RTS", "io"], topics: ["Sender einlernen", "Endlagen", "Reset", "Smart Home"], note: "Modell genau bestimmen, weil Tastfolgen stark variieren." },
  { name: "Becker", protocols: ["Centronic", "B-Tronic"], topics: ["Rohrmotor", "Funk", "Hinderniserkennung", "Endlagen"], note: "Motortyp und Serie vor Einstellung prüfen." },
  { name: "Selve", protocols: ["commeo", "iveo"], topics: ["Funk", "Gruppensteuerung", "Reset", "Sensorik"], note: "Bei Mehrfachanlagen einzeln programmieren." },
  { name: "Elero", protocols: ["ProLine", "Combio"], topics: ["Funkempfänger", "Endlagen", "Sensorik", "Handsender"], note: "Drehrichtung und Endlagen mehrfach testen." },
  { name: "Cherubini", protocols: ["CRC", "Funk/Kabel"], topics: ["Rohrmotor", "Sender", "Reset", "Programmierung"], note: "Serie und Senderkompatibilität prüfen." },
  { name: "Warema / Roma / Alulux", protocols: ["Systemabhängig"], topics: ["Rollladen", "Raffstore", "Steuerung", "Systemkomponenten"], note: "Systemdatenblatt und Montageanleitung verwenden." },
];
const diagnosisTrees = [
  { id: "motor-faehrt-nicht", title: "Motor fährt nicht", category: "Motor / Elektro", tools: ["Spannungsprüfer", "Multimeter", "Sender", "Einstellkabel"], firstSteps: ["Anlage nicht weiter belasten", "Sichtprüfung", "Motortyp feststellen"], start: { q: "Brummt der Motor?", yes: "Mechanische Blockade, schwergängiger Panzer oder defekter Motor möglich. Laufweg, Welle, Lager und Endlagen prüfen.", no: "Stromversorgung, Sicherung, Taster, Sender, Empfänger und Klemmen prüfen." } },
  { id: "motor-brummt", title: "Motor brummt, bewegt aber nicht", category: "Motor / Mechanik", tools: ["Spannungsprüfer", "Schraubendreher", "Einstellkabel"], firstSteps: ["Sofort stoppen", "Blockade ausschließen", "Panzer entlasten"], start: { q: "Lässt sich der Panzer mechanisch frei bewegen?", yes: "Motor, Kondensator, Bremse, Adapter oder Endlage prüfen.", no: "Blockade in Führung, Panzer, Endstab, Welle oder Aufhängung suchen." } },
  { id: "rollladen-schief", title: "Rollladen läuft schief", category: "Rollladen", tools: ["Laser", "Wasserwaage", "Akkuschrauber"], firstSteps: ["Lauf stoppen", "Führung prüfen", "Panzer prüfen"], start: { q: "Sind Führungsschienen parallel und frei?", yes: "Panzer, Lamellen, Aufhängungen, Welle und Lager prüfen.", no: "Schienen reinigen, neu ausrichten und Abstand oben/unten vergleichen." } },
  { id: "funk-reagiert-nicht", title: "Funk reagiert nicht", category: "Funk / Steuerung", tools: ["Ersatzbatterie", "Handsender", "Spannungsprüfer"], firstSteps: ["Batterie prüfen", "Kanal prüfen", "Reichweite prüfen"], start: { q: "Reagiert ein anderer Sender oder Kanal?", yes: "Problem liegt wahrscheinlich am einzelnen Sender, Kanal oder der Batterie.", no: "Empfänger/Motor mit Spannung versorgen, Reichweite prüfen und Einlernen kontrollieren." } },
  { id: "markise-stoppt", title: "Markise stoppt früh", category: "Markise", tools: ["Sender", "Einstellkabel", "Multimeter"], firstSteps: ["Hindernis prüfen", "Windautomatik prüfen", "Gelenkarme prüfen"], start: { q: "Ist Windautomatik oder Hindernis aktiv?", yes: "Windwächter, Hindernis, Gelenkarme und Sensorstatus prüfen.", no: "Endlagen, Motorschutz, Tuchwicklung und Schwergängigkeit prüfen." } },
  { id: "zipscreen-klemmt", title: "ZIP-Screen klemmt oder läuft schief", category: "ZIP-Screen", tools: ["Laser", "weiche Bürste", "Akkuschrauber"], firstSteps: ["Schienen reinigen", "Parallelität prüfen", "Tuchführung prüfen"], start: { q: "Sind die Seitenschienen sauber und parallel?", yes: "Tuchführung, ZIP-Keder, Endlagen und Tuchspannung prüfen.", no: "Schienen reinigen und neu ausrichten. Danach langsame Probefahrt." } },
  { id: "raffstore-wendet-falsch", title: "Raffstore wendet falsch", category: "Raffstore", tools: ["Sender", "Einstellkabel", "Laser"], firstSteps: ["Drehrichtung prüfen", "Wendepunkt prüfen", "Lamellen prüfen"], start: { q: "Stimmt die Drehrichtung?", yes: "Wendepunkt, Aufzugsbänder, Lamellenpaket und Steuerung prüfen.", no: "Drehrichtung nach Herstellerangabe korrigieren." } },
  { id: "sensorik-falsch", title: "Wind-/Sonnensensor reagiert falsch", category: "Sensorik", tools: ["Sender", "Herstelleranleitung", "Leiter"], firstSteps: ["Sensorposition prüfen", "Sensor reinigen", "Grenzwerte prüfen"], start: { q: "Ist der Sensor richtig positioniert und sauber?", yes: "Grenzwerte, Funkverbindung, Batterien und Automatikmodus prüfen.", no: "Sensor reinigen, ausrichten oder Montageort ändern." } },
];
const partCatalog = [
  { group: "Rollladen", product: "Rollladen", name: "Gurtwickler", asks: ["Gurtbreite", "Aufputz/Einlass", "Lochabstand", "Farbe"], tip: "Federkraft prüfen und Gurt nicht verdrehen." },
  { group: "Rollladen", product: "Rollladen", name: "Gurtscheibe", asks: ["Welle", "Gurtbreite", "Durchmesser", "Lagerseite"], tip: "Passend zur Welle und zum Gurt wählen." },
  { group: "Rollladen", product: "Rollladen", name: "Rollladenwelle SW40/SW60", asks: ["Länge", "Wellentyp", "Lager", "Motor/Gurt"], tip: "Welle gerade zuschneiden und entgraten." },
  { group: "Motor", product: "Motor", name: "Rohrmotor", asks: ["Nm", "Welle", "Länge", "Funk/Kabel", "Endlagenart"], tip: "Drehmoment anhand Panzergewicht/Größe prüfen." },
  { group: "Motor", product: "Motor", name: "Motoradapter / Mitnehmer", asks: ["Motormarke", "Wellentyp", "Serie"], tip: "Falscher Adapter verursacht Spiel oder Blockade." },
  { group: "Markise", product: "Markise", name: "Markisentuch", asks: ["Breite", "Ausfall", "Tuchnummer", "Volant"], tip: "Wickelrichtung und Tuchspannung dokumentieren." },
  { group: "Markise", product: "Markise", name: "Gelenkarm", asks: ["Hersteller", "Ausfall", "Seite", "Armtyp"], tip: "Federgespannte Arme nur gesichert bearbeiten." },
  { group: "Raffstore", product: "Raffstore", name: "Aufzugsband", asks: ["Breite", "Länge", "Hersteller", "Lamellentyp"], tip: "Bänder nicht verdrehen." },
  { group: "Insektenschutz", product: "Insektenschutz", name: "Bürstendichtung", asks: ["Nutmaß", "Bürstenhöhe", "Farbe"], tip: "Dicht, aber nicht bremsend einsetzen." },
];
const maintenanceTips = [
  { product: "Rollladen", title: "Führungsschienen reinigen", steps: ["Laub und Sand entfernen", "mit weicher Bürste ausfegen", "feucht nachwischen", "kein Öl einbringen", "Probelauf machen"] },
  { product: "Markise", title: "Tuch pflegen", steps: ["trocken abbürsten", "milden Reiniger nutzen", "vollständig trocknen lassen", "bei Wind einfahren"] },
  { product: "Raffstore", title: "Lamellen prüfen", steps: ["Lamellen optisch prüfen", "Bänder auf Verdrehung prüfen", "Führungen nachziehen", "Windwächter testen"] },
  { product: "ZIP-Screen", title: "ZIP-Führung sauber halten", steps: ["Schienen ausbürsten", "Tuchlauf langsam testen", "Schiefstand prüfen", "keine Gewalt anwenden"] },
];
const customerTemplates = [
  { title: "Terminbestätigung", text: "Hallo {kunde}, wir bestätigen den Montagetermin für {produkt}. Termin: {termin}. Adresse: {adresse}. Bitte sorgen Sie dafür, dass der Montagebereich frei zugänglich ist." },
  { title: "Montagevorbereitung", text: "Hallo {kunde}, bitte räumen Sie den Bereich für {produkt} vor dem Termin frei. Termin: {termin}." },
  { title: "Bedenkenhinweis Untergrund", text: "Hallo {kunde}, bei Ihrem Auftrag {produkt} haben wir festgestellt, dass der Untergrund zusätzliche Maßnahmen erfordert. Wir dokumentieren dies und stimmen die sichere Ausführung ab." },
  { title: "Pflegehinweis Rollladen", text: "Bitte halten Sie die Führungsschienen sauber. Laub, Sand und Schmutz mit einer weichen Bürste entfernen. Keine öligen oder aggressiven Mittel verwenden." },
  { title: "Reklamation", text: "Bitte senden Sie uns ein Foto oder kurzes Video der Situation sowie eine kurze Fehlerbeschreibung. Wir prüfen den Fall und melden uns mit einer Einschätzung." },
  { title: "Bewertung anfragen", text: "Vielen Dank für Ihren Auftrag. Wenn Sie mit unserer Arbeit zufrieden sind, freuen wir uns sehr über eine kurze Bewertung." },
];
const norms = [
  { title: "DIN EN 13659", text: "Außenabschlüsse und Außenjalousien, z. B. Rollläden und Raffstores. In der App als Orientierung zu Sicherheit und Windwiderstand führen." },
  { title: "DIN EN 13561", text: "Markisen. Relevant für Leistungs- und Sicherheitsanforderungen sowie Windwiderstandsklassen." },
  { title: "Windklassen", text: "Windklasse ist keine pauschale Freigabe. Produktgröße, Untergrund, Befestigung, Gebäudehöhe, Lage und Herstellerangaben sind entscheidend." },
  { title: "Herstelleranleitung", text: "Immer verbindlich für Montage, Anschluss, Einstellung, Wartung und Produktgrenzen." },
];
const reportActivityTemplates = [
  { id: "montage", label: "Montage", text: "Ich habe bei der Montage einer Sonnenschutzanlage mitgearbeitet. Dabei wurden Maße geprüft, Bauteile vorbereitet, Führungselemente ausgerichtet, Befestigungspunkte gesetzt und die Funktion der Anlage kontrolliert." },
  { id: "aufmass", label: "Aufmaß", text: "Ich habe ein Aufmaß vorbereitet beziehungsweise unterstützt. Dabei wurden Breite, Höhe, Einbausituation, Bedienseite, Untergrund, Stromanschluss und Besonderheiten dokumentiert." },
  { id: "wartung", label: "Wartung", text: "Ich habe Wartungs- und Pflegearbeiten durchgeführt. Dabei wurden Führungsschienen gereinigt, bewegliche Bauteile geprüft, die Funktion getestet und Kundenhinweise vorbereitet." },
  { id: "diagnose", label: "Fehlerdiagnose", text: "Ich habe bei der Fehlersuche unterstützt. Das Fehlerbild wurde aufgenommen, mögliche Ursachen wurden systematisch geprüft und die Ergebnisse wurden dokumentiert." },
  { id: "motor", label: "Motor & Steuerung", text: "Ich habe Arbeiten an Antrieb und Steuerung begleitet. Dabei wurden Motortyp, Bedienart, Laufrichtung, Endlagen und die Funktion der Steuerung geprüft." },
];
const reportLearningFields = ["Montage und Instandhaltung", "Aufmaß und Planung", "Antriebe und Steuerungen", "Fehlerdiagnose und Wartung", "Kundenkommunikation", "Arbeitssicherheit", "Dokumentation und Qualitätssicherung"];
const reportTechnicalTerms = {
  "1": ["Aufmaß", "Führungsschiene", "Rollladenpanzer", "Montagebereich", "Werkzeugauswahl", "Arbeitssicherheit"],
  "2": ["Rohrmotor", "Endlage", "Untergrundprüfung", "Befestigungspunkt", "Funktionsprüfung", "Kundenübergabe"],
  "3": ["Steuerung", "Sensorik", "Windwiderstand", "Fehlerdiagnose", "Dokumentation", "Qualitätssicherung"],
};
const quizCards = [
  { y: 1, t: "Grundlagen", q: "Warum müssen Führungsschienen parallel sein?", options: ["Freier Lauf ohne Klemmen", "schnellerer Motor", "mehr Farbe"], correctIndex: 0, explanation: "Parallele Schienen verhindern Reibung und Schieflauf." },
  { y: 1, t: "Grundlagen", q: "Was ist eine Endlage?", options: ["Kastenfarbe", "Motor-Abschaltpunkt oben/unten", "Schraubentyp"], correctIndex: 1, explanation: "Endlagen begrenzen die Fahrbewegung." },
  { y: 1, t: "Werkzeug", q: "Warum Bohrloch reinigen?", options: ["Optik", "weniger Lärm", "bessere Haltekraft"], correctIndex: 2, explanation: "Staub schwächt Dübel und Injektionsanker." },
  { y: 1, t: "Sicherheit", q: "Was bedeutet Revision?", options: ["Zugang für Wartung", "Lamellenfarbe", "Rabatt"], correctIndex: 0, explanation: "Bauteile müssen erreichbar bleiben." },
  { y: 1, t: "Untergrund", q: "Was ist bei WDVS wichtig?", options: ["in Dämmung schrauben", "Last in tragenden Untergrund", "nur kleben"], correctIndex: 1, explanation: "Dämmung trägt keine schweren Lasten." },
  { y: 2, t: "Motor", q: "Was vor Motor-Einstellung klären?", options: ["Motortyp/Hersteller", "Fensterfarbe", "Kundenalter"], correctIndex: 0, explanation: "Einstelllogik hängt vom Motortyp ab." },
  { y: 2, t: "Motor", q: "Warum nur einen Funkmotor bestromen?", options: ["falsches Einlernen vermeiden", "mehr Licht", "weniger Werkzeug"], correctIndex: 0, explanation: "Sonst koppeln mehrere Motoren falsch." },
  { y: 3, t: "Normen", q: "Windklasse bedeutet ...", options: ["Orientierung, keine pauschale Freigabe", "immer egal", "nur innen"], correctIndex: 0, explanation: "Einbausituation bleibt entscheidend." },
];
const sketchCards = [
  { title: "Aufbau Rollladen", parts: ["Kasten", "Welle", "Lager", "Panzer", "Endstab", "Führungsschiene", "Bedienung/Motor"], tip: "Beim Lernen von oben nach unten denken: Kasten → Welle → Panzer → Führung → Bedienung." },
  { title: "Rohrmotor in der Welle", parts: ["Motorkopf", "Adapter", "Mitnehmer", "Achtkantwelle", "Lager", "Endlagen"], tip: "Adapter und Mitnehmer müssen zur Welle und zum Motor passen." },
  { title: "Markise", parts: ["Konsolen", "Tragrohr", "Tuchwelle", "Gelenkarme", "Ausfallprofil", "Motor", "Sensorik"], tip: "Konsolen nehmen hohe Kräfte auf. Untergrund immer ernst nehmen." },
  { title: "WDVS-Abstandsmontage", parts: ["Putz", "Dämmstoff", "tragender Untergrund", "Abstandssystem", "Dichtung", "Konsole"], tip: "Lasten gehören in den tragenden Untergrund, nicht in den Dämmstoff." },
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
  { area: "Login", status: "Demo aktiv", note: "Nutzer werden lokal gespeichert; echter Login braucht später Supabase/Firebase." },
  { area: "Team-Codes", status: "Aktiv", note: "Firma erzeugt persönliche Codes für Vorarbeiter, Monteure, Azubis und Kunden." },
  { area: "Cloud", status: "Sync-Simulation aktiv", note: "Daten werden in einem lokalen Cloud-Speicher simuliert." },
  { area: "Aufträge", status: "Aktiv", note: "Anlegen, Bearbeiten, Suchen, Löschen, Status und lokale Speicherung funktionieren." },
  { area: "Baustellenplanung", status: "Aktiv", note: "Aufträge können Teammitgliedern und Kunden zugewiesen werden." },
  { area: "Berichtsheft", status: "Aktiv", note: "Erzeugen, Speichern, Freigeben, Löschen, Wochenbericht und Export sind als Prototyp eingebaut." },
  { area: "Fotos", status: "Demo aktiv", note: "Upload und Analyse-Simulation funktionieren; echte KI-Erkennung braucht ein Modell/API." },
];

const teamRoleOptions = [
  { id: "vorarbeiter", label: "Vorarbeiter", prefix: "VOR", description: "Sieht eigene Kolonne, Team-Baustellen und kann Fortschritt prüfen." },
  { id: "monteur", label: "Monteur", prefix: "MON", description: "Sieht zugewiesene Baustellen, Checklisten, Fotos, Diagnose und Abschluss." },
  { id: "azubi", label: "Azubi", prefix: "AZU", description: "Sieht Lernen, Berichtsheft und zugewiesene Baustellen als Unterstützung." },
  { id: "kunde", label: "Kunde", prefix: "KUN", description: "Sieht nur eigene Termine, Pflegehinweise, Aufträge und Freigaben." },
];
const makeCode = (prefix = "APP") => `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
const defaultCompany = () => ({
  id: "betrieb-demo",
  name: "Mein Sonnenschutz-Betrieb",
  adminCode: makeCode("ADM"),
  azubiCode: makeCode("AZU"),
  customerCode: makeCode("KUN"),
  monteurCode: makeCode("MON"),
  createdAt: new Date().toLocaleString("de-DE"),
});
const defaultCompanyPeople = () => [
  { id: "P-100", name: "Max Vorarbeiter", role: "vorarbeiter", accessCode: makeCode("VOR"), status: "aktiv", team: "Kolonne 1", trainingYear: "", progress: 0, phone: "", address: "", createdAt: new Date().toLocaleString("de-DE") },
  { id: "P-101", name: "Tom Monteur", role: "monteur", accessCode: makeCode("MON"), status: "aktiv", team: "Kolonne 1", trainingYear: "", progress: 0, phone: "", address: "", createdAt: new Date().toLocaleString("de-DE") },
  { id: "P-102", name: "Leon Azubi", role: "azubi", accessCode: makeCode("AZU"), status: "aktiv", team: "Kolonne 1", trainingYear: "2", progress: 35, phone: "", address: "", createdAt: new Date().toLocaleString("de-DE") },
  { id: "P-103", name: "Herr Muster", role: "kunde", accessCode: makeCode("KUN"), status: "wartet auf Freigabe", team: "", trainingYear: "", progress: 0, phone: "", address: "Beispielstraße 1", createdAt: new Date().toLocaleString("de-DE") },
];


function Badge({ children }) { return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>; }
function Card({ children, className = "" }) { return <section className={`rounded-[2rem] bg-white p-4 shadow-sm md:p-6 ${className}`}>{children}</section>; }
function SectionTitle({ icon: Icon, title, subtitle }) { return <div className="mb-5 flex items-start gap-3"><div className="rounded-2xl bg-slate-950 p-3 text-white"><Icon size={20} /></div><div><h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{title}</h2><p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">{subtitle}</p></div></div>; }
function Field({ label, value, onChange, placeholder = "", type = "text" }) { return <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800">{label}<input type={type} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-slate-950" /></label>; }
function TextArea({ label, value, onChange, placeholder = "" }) { return <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800">{label}<textarea value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className="mt-2 h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-slate-950" /></label>; }
function CopyBox({ title, text }) { const [copied, setCopied] = useState(false); const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {} }; return <article className="rounded-3xl bg-slate-50 p-5"><h3 className="font-bold">{title}</h3><textarea readOnly value={text} className="mt-3 h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm leading-6" /><button onClick={copy} className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Kopiert" : "Text kopieren"}</button></article>; }
function TopBar({ role, setRole, offline, setOffline, compact }) { const selected = roles.find((r) => r.id === role) || roles[0]; return <div className="sticky top-3 z-20 mb-4 rounded-[1.5rem] border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur"><div className={compact ? "space-y-3" : "grid gap-3 md:grid-cols-[1fr_auto] md:items-center"}><div className={compact ? "space-y-2" : "flex flex-col gap-2 sm:flex-row sm:items-center"}><div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-white"><UserRound size={18} /><span className="text-sm font-bold">Rolle</span></div><select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none sm:w-auto">{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>{!compact && <p className="text-xs leading-5 text-slate-500">{selected.description}</p>}</div><button onClick={() => setOffline(!offline)} className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${offline ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>{offline ? <WifiOff size={18} /> : <Wifi size={18} />}{offline ? "Offline" : "Online"}</button></div></div>; }
function Header({ role, orders, selectedOrder, offline, compact }) { const selectedRole = roles.find((r) => r.id === role)?.label || role; return <header className="mb-5 rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl md:p-8"><div className={compact ? "space-y-4" : "grid gap-6 md:grid-cols-[1.4fr_0.6fr] md:items-center"}><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 md:text-sm"><Sun size={16} />{selectedRole}</div><h1 className={compact ? "text-2xl font-black tracking-tight" : "text-3xl font-black tracking-tight md:text-5xl"}>Monteur-App</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base md:leading-7">Rollladen & Sonnenschutz Assistent</p></div>{!compact && <div className="grid grid-cols-2 gap-3"><div className="rounded-3xl bg-white/10 p-4"><p className="text-3xl font-black">{orders.length}</p><p className="text-sm text-white/70">Aufträge</p></div><div className="rounded-3xl bg-white/10 p-4"><p className="text-3xl font-black">{selectedOrder ? "Ja" : "Nein"}</p><p className="text-sm text-white/70">Aktiver Auftrag</p></div><div className="rounded-3xl bg-white/10 p-4"><p className="text-3xl font-black">{offline ? "An" : "Aus"}</p><p className="text-sm text-white/70">Offline</p></div><div className="rounded-3xl bg-white/10 p-4"><p className="text-3xl font-black">{navItems.length}</p><p className="text-sm text-white/70">Module</p></div></div>}</div></header>; }
function MobileBottomNav({ items, active, setActive }) { const [openMore, setOpenMore] = useState(false); const mainItems = items.slice(0, 5); const moreItems = items.slice(5); return <>{openMore && <div className="fixed inset-x-3 bottom-24 z-40 max-h-[55vh] overflow-y-auto rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-2xl"><p className="mb-3 px-2 text-xs font-bold uppercase tracking-wide text-slate-500">Weitere Bereiche</p><div className="grid grid-cols-2 gap-2">{moreItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setActive(id); setOpenMore(false); }} className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left text-xs font-bold ${active === id ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"}`}><Icon size={17} />{label}</button>)}</div></div>}<nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-2xl backdrop-blur"><div className="grid grid-cols-6 gap-1">{mainItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActive(id)} className={`flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-bold ${active === id ? "bg-slate-950 text-white" : "text-slate-600"}`}><Icon size={18} /><span className="mt-1 max-w-full truncate">{label}</span></button>)}<button onClick={() => setOpenMore((v) => !v)} className="flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-bold text-slate-600"><Layers size={18} /><span className="mt-1">Mehr</span></button></div></nav></>; }
function QuizTrainer({ cards }) { const [year, setYear] = useState("all"); const [topic, setTopic] = useState("all"); const filtered = cards.filter((c) => (year === "all" || String(c.y) === year) && (topic === "all" || c.t === topic)); const topics = [...new Set(cards.map((c) => c.t))]; const [idx, setIdx] = useState(0); const [selected, setSelected] = useState(null); const card = filtered[idx] || filtered[0]; useEffect(() => { setIdx(0); setSelected(null); }, [year, topic]); if (!card) return null; if (idx >= filtered.length) return <div className="rounded-3xl bg-slate-950 p-6 text-white"><h3 className="text-2xl font-black">Quiz abgeschlossen</h3><button onClick={() => { setIdx(0); setSelected(null); }} className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-950">Neu starten</button></div>; const choose = (i) => { if (selected !== null) return; setSelected(i); if (i === card.correctIndex) setTimeout(() => { setIdx((v) => v + 1); setSelected(null); }, 850); }; return <div className="rounded-3xl bg-slate-50 p-5"><div className="mb-4 grid gap-3 md:grid-cols-3"><select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold"><option value="all">Alle Ausbildungsjahre</option><option value="1">1. Jahr</option><option value="2">2. Jahr</option><option value="3">3. Jahr</option></select><select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold"><option value="all">Alle Themen</option>{topics.map((t) => <option key={t}>{t}</option>)}</select><div className="rounded-2xl bg-white px-3 py-3 text-sm font-bold">Frage {idx + 1} von {filtered.length}</div></div><article className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="text-xl font-black leading-8">{card.q}</h3><div className="mt-5 space-y-3">{card.options.map((option, i) => { const correct = selected !== null && i === card.correctIndex; const wrong = selected === i && i !== card.correctIndex; return <button key={option} onClick={() => choose(i)} className={`w-full rounded-2xl border p-4 text-left text-sm font-bold ${correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : wrong ? "border-rose-200 bg-rose-50 text-rose-900" : "border-slate-100 bg-slate-50 hover:bg-white"}`}><span className="mr-2">{String.fromCharCode(65 + i)}.</span>{option}</button>; })}</div>{selected !== null && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6"><strong>Erklärung:</strong> {card.explanation}</div>}{selected !== null && selected !== card.correctIndex && <button onClick={() => setSelected(null)} className="mt-4 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Nochmal versuchen</button>}</article></div>; }
function DiagnosisStepMode({ trees }) { const [treeId, setTreeId] = useState(trees[0]?.id || ""); const [answer, setAnswer] = useState(null); const tree = trees.find((item) => item.id === treeId) || trees[0]; if (!tree) return null; return <div className="mb-5 rounded-3xl bg-slate-950 p-5 text-white"><div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase text-white/50">Interaktiver Schrittmodus</p><h3 className="mt-1 text-xl font-black">{tree.title}</h3></div><select value={treeId} onChange={(e) => { setTreeId(e.target.value); setAnswer(null); }} className="rounded-2xl bg-white px-3 py-2 text-sm font-bold text-slate-950">{trees.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div><div className="rounded-2xl bg-white/10 p-4 text-sm font-bold leading-6">{tree.start.q}</div><div className="mt-4 grid gap-3 md:grid-cols-2"><button onClick={() => setAnswer("yes")} className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-900">Ja</button><button onClick={() => setAnswer("no")} className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-black text-rose-900">Nein</button></div>{answer && <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-slate-900"><strong>Nächster Prüfschritt:</strong> {answer === "yes" ? tree.start.yes : tree.start.no}</div>}</div>; }

export default function App() {
  const device = useDeviceLayout();
  const [role, setRoleState] = useState(() => loadJson("rs-role", "dev"));
  const [offline, setOfflineState] = useState(() => loadJson("rs-offline", false));
  const [active, setActive] = useState("dashboard");
  const [orders, setOrders] = useState(() => loadJson("rs-orders", [{ id: "A-1001", customer: "Musterkunde", contact: "Herr Muster", phone: "", email: "", address: "Beispielstraße 1", date: todayIso(), time: "08:00", assignedTo: "Connor", product: "vorbaurollladen", substrate: "WDVS", drive: "Funkmotor", installType: "Renovierung", windCritical: true, status: "offen", priority: "normal", orderType: "Montage", notes: "3 Elemente, Funkmotor, WDVS prüfen" }]));
  const [selectedOrderId, setSelectedOrderId] = useState(() => loadJson("rs-selected-order", "A-1001"));
  const [checks, setChecks] = useState(() => loadJson("rs-checks", {}));
  const [photos, setPhotos] = useState({});
  const [notes, setNotes] = useState(() => loadJson("rs-notes", []));
  const [savedReports, setSavedReports] = useState(() => loadJson("rs-saved-reports", []));
  const [measurementValues, setMeasurementValues] = useState(() => loadJson("rs-measurements", {}));
  const [manualQuality, setManualQuality] = useState(() => loadJson("rs-quality", {}));
  const [authUser, setAuthUser] = useState(() => loadJson("rs-auth-user", null));
  const [syncLog, setSyncLog] = useState(() => loadJson("rs-sync-log", []));
  const [photoAnalyses, setPhotoAnalyses] = useState(() => loadJson("rs-photo-analyses", {}));
  const [newOrder, setNewOrder] = useState({ customer: "", contact: "", phone: "", email: "", address: "", date: todayIso(), time: "08:00", assignedTo: "", product: "vorbaurollladen", substrate: "Beton", drive: "Funkmotor", installType: "Renovierung", windCritical: false, priority: "normal", orderType: "Montage", notes: "" });
  const [orderSearch, setOrderSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [diagnosisQuery, setDiagnosisQuery] = useState("");
  const [diagnosisCategory, setDiagnosisCategory] = useState("all");
  const [partQuery, setPartQuery] = useState("");
  const [partGroup, setPartGroup] = useState("all");
  const [partRequest, setPartRequest] = useState({ product: "Rollladen", manufacturer: "", part: "", measure: "", color: "", shaft: "", motor: "", serial: "", urgent: false });
  const [manufacturerQuery, setManufacturerQuery] = useState("");
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
  const [loginForm, setLoginForm] = useState({ name: "Connor", email: "conzock92@gmail.com", password: "demo123", company: "Mein Sonnenschutz-Betrieb", role: "dev" });
  const [cloudCompanyId, setCloudCompanyId] = useState(() => loadJson("rs-cloud-company", "betrieb-demo"));
  const [techStack, setTechStack] = useState("supabase");
  const [favorite, setFavorite] = useState("");
  const [generatedAiResponse, setGeneratedAiResponse] = useState("");
  const [pdfTarget, setPdfTarget] = useState("Montageprotokoll");
  const [company, setCompany] = useState(() => loadJson("rs-company", defaultCompany()));
  const [companyPeople, setCompanyPeople] = useState(() => loadJson("rs-company-people", defaultCompanyPeople()));
  const [personForm, setPersonForm] = useState({ name: "", role: "monteur", phone: "", address: "", team: "Kolonne 1", trainingYear: "1" });
  const [codeLogin, setCodeLogin] = useState({ name: "", code: "" });
  const [teamSearch, setTeamSearch] = useState("");
  const [supabaseStatus, setSupabaseStatus] = useState("");
  const [companyAuthMode, setCompanyAuthMode] = useState("register");

  const setRole = (value) => { setRoleState(value); saveJson("rs-role", value); };
  const setOffline = (value) => { setOfflineState(value); saveJson("rs-offline", value); };
  const allowedNav = useMemo(() => role === "dev" ? navItems : navItems.filter((n) => n.roles.includes(role)), [role]);
  useEffect(() => { if (!allowedNav.some((n) => n.id === active)) setActive("dashboard"); }, [allowedNav, active]);
  useEffect(() => saveJson("rs-orders", orders), [orders]);
  useEffect(() => saveJson("rs-selected-order", selectedOrderId), [selectedOrderId]);
  useEffect(() => saveJson("rs-checks", checks), [checks]);
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

  const currentPerson = authUser?.personId ? companyPeople.find((p) => p.id === authUser.personId) : null;
  const isCompanyAdmin = ["dev", "meister", "buero"].includes(role);
  const visibleOrders = useMemo(() => {
    if (isCompanyAdmin) return orders;
    if (!currentPerson) return orders;
    if (["monteur", "vorarbeiter", "azubi"].includes(currentPerson.role)) {
      return orders.filter((o) => (o.assignedMemberIds || []).includes(currentPerson.id) || o.assignedTo === currentPerson.name);
    }
    if (currentPerson.role === "kunde") {
      return orders.filter((o) => o.customerPersonId === currentPerson.id || o.customer === currentPerson.name);
    }
    return orders;
  }, [orders, isCompanyAdmin, currentPerson?.id, currentPerson?.role, currentPerson?.name]);
  const selectedOrder = visibleOrders.find((o) => o.id === selectedOrderId) || visibleOrders[0] || orders[0];
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
  const closeChecks = qualityRequirements.map((item) => { let done = false; if (item.type === "checklist") done = selectedChecklistItems.length > 0 && selectedChecklistItems.every((check) => checks[selectedOrder?.id]?.[check]); if (item.type === "photos") done = ["Vorher", "Nachher", "Typenschild"].every((key) => photos[key]); if (item.type === "notes") done = Boolean(selectedOrder?.notes?.trim()); if (item.type === "manual") done = Boolean(manualQuality[selectedOrder?.id]?.[item.id]); return { ...item, done }; });
  const closeReady = closeChecks.every((item) => item.done);
  const filteredOrders = visibleOrders.filter((o) => [o.id, o.customer, o.address, o.status, o.priority, o.notes, productTypes.find((p) => p.id === o.product)?.name || "", ...(o.assignedMemberIds || []).map((id) => companyPeople.find((p) => p.id === id)?.name || "")].join(" ").toLowerCase().includes(orderSearch.toLowerCase()));
  const todaysOrders = visibleOrders.filter((o) => o.date === todayIso());
  const openReports = savedReports.filter((r) => r.status !== "Freigegeben");
  const diagnosisCategories = ["all", ...new Set(diagnosisTrees.map((d) => d.category))];
  const filteredDiagnosisTrees = diagnosisTrees.filter((d) => (diagnosisCategory === "all" || d.category === diagnosisCategory) && [d.title, d.category, d.start.q, d.start.yes, d.start.no, ...(d.tools || []), ...(d.firstSteps || [])].join(" ").toLowerCase().includes(diagnosisQuery.toLowerCase()));
  const filteredParts = partCatalog.filter((p) => (partGroup === "all" || p.group === partGroup) && [p.name, p.group, p.product, ...p.asks].join(" ").toLowerCase().includes(partQuery.toLowerCase()));
  const filteredMakers = manufacturers.filter((m) => [m.name, ...m.protocols, ...m.topics, m.note].join(" ").toLowerCase().includes(manufacturerQuery.toLowerCase()));
  const net = Number(calc.count) * Number(calc.material) + Number(calc.labor) * Number(calc.rate) + Number(calc.travel) + Number(calc.wdvs) + Number(calc.disposal);
  const selectedReportTemplate = reportActivityTemplates.find((template) => template.id === reportTemplateId) || reportActivityTemplates[0];
  const reportCheckedItems = selectedChecklistItems.filter((item) => checks[selectedOrder?.id]?.[item]);
  const reportTerms = reportTechnicalTerms[reportYear] || [];
  const reportProposal = reportMode === "Wochenbericht" ? `Wochenbericht im Bereich Rollladen- und Sonnenschutztechnik. In dieser Woche habe ich am Auftrag ${selectedOrder?.id || "ohne Auftragsnummer"} für ${selectedOrder?.customer || "einen Kunden"} mitgearbeitet. Schwerpunkt war ${selectedProduct.name}. Folgende Tätigkeiten wurden durchgeführt: ${reportText}. Berücksichtigte Checklistenpunkte: ${reportCheckedItems.length ? reportCheckedItems.join(", ") : "noch keine"}. Lernfeld: ${reportLearningField}. Ausbildungsjahr: ${reportYear}. Fachbegriffe: ${reportTerms.join(", ")}.` : `Tagesbericht im Bereich Rollladen- und Sonnenschutztechnik. Ich habe am Auftrag ${selectedOrder?.id || "ohne Auftragsnummer"} für ${selectedOrder?.customer || "einen Kunden"} gearbeitet. Produkt/Anlage: ${selectedProduct.name}. Tätigkeitsschwerpunkt: ${selectedReportTemplate.label}. ${selectedReportTemplate.text} Eigene Stichpunkte: ${reportText}. Berücksichtigte Checklistenpunkte: ${reportCheckedItems.length ? reportCheckedItems.join(", ") : "noch keine"}. Lernfeld: ${reportLearningField}. Ausbildungsjahr: ${reportYear}. Verwendete Fachbegriffe: ${reportTerms.join(", ")}. Status: ${reportStatus}.`;
  const partRequestText = `Ersatzteil-Anfrage für ${partRequest.product}: Gesucht wird ${partRequest.part || "ein Ersatzteil"}. Hersteller: ${partRequest.manufacturer || "unbekannt"}. Maß/Angabe: ${partRequest.measure || "bitte prüfen"}. Farbe: ${partRequest.color || "nicht angegeben"}. Welle: ${partRequest.shaft || "nicht angegeben"}. Motortyp: ${partRequest.motor || "nicht angegeben"}. Seriennummer: ${partRequest.serial || "nicht vorhanden"}. Dringlichkeit: ${partRequest.urgent ? "dringend" : "normal"}. Foto vorhanden: ${Object.keys(photos).length ? "ja" : "nein"}.`;
  const customerTemplateForOrder = (text) => text.replaceAll("{kunde}", selectedOrder?.customer || "Kunde").replaceAll("{produkt}", selectedProduct.name).replaceAll("{termin}", `${selectedOrder?.date || "Termin"} ${selectedOrder?.time || ""}`.trim()).replaceAll("{adresse}", selectedOrder?.address || "Adresse");
  const showNotice = (message) => { setNotice(message); setTimeout(() => setNotice(""), 1600); };
  const addSyncLog = (action, status = "ok") => setSyncLog((log) => [{ id: Date.now(), action, status, timestamp: new Date().toLocaleString("de-DE"), user: authUser?.name || "Demo" }, ...log].slice(0, 20));
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
    adminCode: row.admin_code,
    azubiCode: row.azubi_code,
    customerCode: row.customer_code,
    monteurCode: row.monteur_code,
    createdAt: row.created_at ? new Date(row.created_at).toLocaleString("de-DE") : company.createdAt,
  });
  const companyToRow = (data, userId) => ({
    id: data.id,
    name: data.name,
    owner_id: userId || null,
    admin_code: data.adminCode,
    azubi_code: data.azubiCode,
    customer_code: data.customerCode,
    monteur_code: data.monteurCode,
  });
  const personToRow = (person, companyId) => ({
    id: person.id,
    company_id: companyId,
    name: person.name,
    role: person.role,
    access_code: person.accessCode,
    status: person.status,
    phone: person.phone || "",
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
    address: row.address || "",
    team: row.team || "",
    trainingYear: row.training_year || "",
    progress: Number(row.progress || 0),
    createdAt: row.created_at ? new Date(row.created_at).toLocaleString("de-DE") : "",
  });
  const applyRemoteSnapshot = (snapshot = {}) => {
    if (snapshot.company) setCompany(snapshot.company);
    if (snapshot.companyPeople) setCompanyPeople(snapshot.companyPeople);
    if (snapshot.orders) setOrders(snapshot.orders);
    if (snapshot.checks) setChecks(snapshot.checks);
    if (snapshot.notes) setNotes(snapshot.notes);
    if (snapshot.savedReports) setSavedReports(snapshot.savedReports);
    if (snapshot.measurementValues) setMeasurementValues(snapshot.measurementValues);
    if (snapshot.manualQuality) setManualQuality(snapshot.manualQuality);
    if (snapshot.photoAnalyses) setPhotoAnalyses(snapshot.photoAnalyses);
    if (snapshot.orders?.[0]?.id) setSelectedOrderId(snapshot.orders[0].id);
  };
  const saveAppToSupabase = async (overrideCompany = null) => {
    if (!requireSupabase()) return;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData?.user) throw new Error("Bitte zuerst mit E-Mail oder persönlichem Code anmelden.");
      const activeCompany = overrideCompany || company;
      const snapshot = { ...createSnapshot(), company: activeCompany, companyPeople, orders, savedAt: new Date().toISOString() };
      const { error: companyError } = await supabase.from("companies").upsert(companyToRow(activeCompany, authData.user.id));
      if (companyError) throw companyError;
      if (companyPeople.length) {
        const { error: peopleError } = await supabase.from("company_people").upsert(companyPeople.map((person) => personToRow(person, activeCompany.id)));
        if (peopleError) throw peopleError;
      }
      if (orders.length) {
        const { error: ordersError } = await supabase.from("orders").upsert(orders.map((order) => ({ id: order.id, company_id: activeCompany.id, data: order, updated_at: new Date().toISOString() })));
        if (ordersError) throw ordersError;
      }
      const { error: snapshotError } = await supabase.from("app_snapshots").upsert({ company_id: activeCompany.id, snapshot, updated_by: authData.user.id, updated_at: new Date().toISOString() });
      if (snapshotError) throw snapshotError;
      addSyncLog("Supabase gespeichert");
      setBackendMessage("Daten wurden in Supabase gespeichert.");
    } catch (error) {
      addSyncLog(`Supabase Fehler: ${error.message}`, "fehler");
      setBackendMessage(`Supabase Fehler: ${error.message}`);
    }
  };
  const loadAppFromSupabase = async (companyId = company.id) => {
    if (!requireSupabase()) return;
    try {
      const { data: snap, error: snapError } = await supabase.from("app_snapshots").select("snapshot").eq("company_id", companyId).maybeSingle();
      if (snapError) throw snapError;
      if (snap?.snapshot) applyRemoteSnapshot(snap.snapshot);
      const { data: remotePeople, error: peopleError } = await supabase.from("company_people").select("*").eq("company_id", companyId).order("created_at", { ascending: false });
      if (peopleError) throw peopleError;
      if (remotePeople?.length) setCompanyPeople(remotePeople.map(rowToPerson));
      const { data: remoteOrders, error: ordersError } = await supabase.from("orders").select("*").eq("company_id", companyId).order("updated_at", { ascending: false });
      if (ordersError) throw ordersError;
      if (remoteOrders?.length) setOrders(remoteOrders.map((row) => row.data));
      addSyncLog("Supabase geladen");
      setBackendMessage("Daten wurden aus Supabase geladen.");
    } catch (error) {
      addSyncLog(`Supabase Ladefehler: ${error.message}`, "fehler");
      setBackendMessage(`Supabase Ladefehler: ${error.message}`);
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
      await loadAppFromSupabase(nextCompany.id);
      setBackendMessage("Supabase-Account geladen.");
    } catch (error) {
      setBackendMessage(`Supabase Loginfehler: ${error.message}`);
    }
  };
  const createCompanyForSignedInUser = async () => {
    if (!requireSupabase()) return;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData?.user) throw new Error("Bitte zuerst mit E-Mail einloggen.");
      const companyId = cloudCompanyId && cloudCompanyId !== "betrieb-demo" ? cloudCompanyId : `betrieb-${authData.user.id.slice(0, 8)}`;
      const { data: rpcCompany, error: rpcError } = await supabase.rpc("create_company_for_current_user", { p_company_id: companyId, p_company_name: loginForm.company, p_admin_name: loginForm.name || loginForm.email });
      if (rpcError) throw rpcError;
      const nextCompany = rowToCompany(Array.isArray(rpcCompany) ? rpcCompany[0] : rpcCompany);
      setCompany(nextCompany);
      setCloudCompanyId(nextCompany.id);
      setAuthUser({ id: authData.user.id, name: loginForm.name, email: authData.user.email || loginForm.email, role: "meister", company: nextCompany.name, companyId: nextCompany.id, loginType: "email", loggedInAt: new Date().toLocaleString("de-DE") });
      setRole("meister");
      await saveAppToSupabase(nextCompany);
      setBackendMessage("Firma wurde für den angemeldeten Supabase-Nutzer erstellt.");
    } catch (error) {
      setBackendMessage(`Firma konnte nicht erstellt werden: ${error.message}`);
    }
  };
  const registerCompanyWithSupabase = async () => {
    if (!requireSupabase()) return;
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: loginForm.email,
        password: loginForm.password,
        options: { data: { name: loginForm.name, role: "meister", company: loginForm.company } },
      });
      if (signUpError) throw signUpError;
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        setBackendMessage("Registrierung erstellt. Bitte E-Mail bestätigen, danach einloggen und 'Firma für Account erstellen' klicken.");
        return;
      }
      await createCompanyForSignedInUser();
    } catch (error) {
      setBackendMessage(`Registrierung fehlgeschlagen: ${error.message}`);
    }
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
      await loadAppFromSupabase(nextCompany.id);
      setActive("dashboard");
      setBackendMessage(`Angemeldet über Supabase als ${personRoleLabel(person.role)}.`);
      return true;
    } catch (error) {
      setBackendMessage(`Code-Login fehlgeschlagen: ${error.message}`);
      return false;
    }
  };
  const logoutSupabase = async () => {
    if (supabase) await supabase.auth.signOut();
    setAuthUser(null);
    addSyncLog("Supabase Logout");
    setBackendMessage("Abgemeldet.");
  };

  const roleLabel = (roleId) => roles.find((r) => r.id === roleId)?.label || roleId;
  const personRoleLabel = (roleId) => teamRoleOptions.find((r) => r.id === roleId)?.label || roleLabel(roleId);
  const teamMembers = companyPeople.filter((p) => p.role !== "kunde");
  const companyCustomers = companyPeople.filter((p) => p.role === "kunde");
  const filteredCompanyPeople = companyPeople.filter((p) => [p.name, p.role, p.accessCode, p.status, p.team, p.address, p.phone].join(" ").toLowerCase().includes(teamSearch.toLowerCase()));
  const createCompanyPerson = () => {
    if (!personForm.name.trim()) { showNotice("Bitte Namen eintragen."); return; }
    const option = teamRoleOptions.find((r) => r.id === personForm.role) || teamRoleOptions[1];
    const person = {
      id: `P-${Date.now()}`,
      name: personForm.name.trim(),
      role: personForm.role,
      accessCode: makeCode(option.prefix),
      status: personForm.role === "kunde" ? "wartet auf Freigabe" : "aktiv",
      phone: personForm.phone,
      address: personForm.address,
      team: personForm.role === "kunde" ? "" : personForm.team,
      trainingYear: personForm.role === "azubi" ? personForm.trainingYear : "",
      progress: personForm.role === "azubi" ? 0 : 0,
      createdAt: new Date().toLocaleString("de-DE"),
    };
    setCompanyPeople((list) => [person, ...list]);
    setPersonForm({ name: "", role: "monteur", phone: "", address: "", team: "Kolonne 1", trainingYear: "1" });
    showNotice(`${personRoleLabel(person.role)} wurde erstellt. Code: ${person.accessCode}`);
  };
  const regeneratePersonCode = (personId) => {
    setCompanyPeople((list) => list.map((p) => {
      if (p.id !== personId) return p;
      const option = teamRoleOptions.find((r) => r.id === p.role) || teamRoleOptions[1];
      return { ...p, accessCode: makeCode(option.prefix) };
    }));
    showNotice("Persönlicher Code wurde neu generiert.");
  };
  const setPersonStatus = (personId, status) => setCompanyPeople((list) => list.map((p) => p.id === personId ? { ...p, status } : p));
  const deletePerson = (personId) => {
    setCompanyPeople((list) => list.filter((p) => p.id !== personId));
    setOrders((list) => list.map((o) => ({ ...o, assignedMemberIds: (o.assignedMemberIds || []).filter((id) => id !== personId), customerPersonId: o.customerPersonId === personId ? "" : o.customerPersonId })));
    showNotice("Person wurde entfernt.");
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
    if (person.status !== "aktiv") { showNotice("Dieser Zugang wartet noch auf Freigabe der Firma."); return; }
    const user = { id: `LOGIN-${person.id}`, personId: person.id, name: person.name, email: `${person.accessCode.toLowerCase()}@demo.local`, role: person.role, company: company.name, companyId: company.id, loginType: "code", loggedInAt: new Date().toLocaleString("de-DE") };
    setAuthUser(user);
    setRole(person.role);
    const firstOrder = orders.find((o) => (o.assignedMemberIds || []).includes(person.id) || o.customerPersonId === person.id || o.assignedTo === person.name || o.customer === person.name);
    if (firstOrder) setSelectedOrderId(firstOrder.id);
    setActive("dashboard");
    addSyncLog(`Code-Login lokal: ${person.name}`);
    showNotice(`Angemeldet als ${personRoleLabel(person.role)}.`);
  };
  const regenerateCompanyCode = (key, prefix) => {
    setCompany((current) => ({ ...current, [key]: makeCode(prefix) }));
    showNotice("Firmen-Code wurde neu generiert.");
  };
  const toggleAssignment = (personId) => {
    if (!selectedOrder) return;
    const currentIds = selectedOrder.assignedMemberIds || [];
    const nextIds = currentIds.includes(personId) ? currentIds.filter((id) => id !== personId) : [...currentIds, personId];
    const names = nextIds.map((id) => companyPeople.find((p) => p.id === id)?.name).filter(Boolean).join(", ");
    updateSelectedOrder({ assignedMemberIds: nextIds, assignedTo: names });
  };
  const assignCustomerToOrder = (personId) => {
    const customer = companyPeople.find((p) => p.id === personId);
    if (!selectedOrder || !customer) return;
    updateSelectedOrder({ customerPersonId: customer.id, customer: customer.name, address: customer.address || selectedOrder.address, phone: customer.phone || selectedOrder.phone });
  };
  const updateAzubiProgress = (personId, progress) => setCompanyPeople((list) => list.map((p) => p.id === personId ? { ...p, progress: Number(progress) } : p));

  const addOrder = (openChecklist = false) => { if (!newOrder.customer.trim()) { showNotice("Bitte mindestens einen Kundennamen eintragen."); return; } const id = `A-${Math.floor(1000 + Math.random() * 9000)}`; const order = { id, status: "offen", createdAt: new Date().toLocaleString("de-DE"), updatedAt: new Date().toLocaleString("de-DE"), ...newOrder }; setOrders((list) => [order, ...list]); setSelectedOrderId(id); setChecks((current) => ({ ...current, [id]: buildEmptyChecklist(newOrder.product, newOrder) })); setNewOrder({ customer: "", contact: "", phone: "", email: "", address: "", date: todayIso(), time: "08:00", assignedTo: "", product: "vorbaurollladen", substrate: "Beton", drive: "Funkmotor", installType: "Renovierung", windCritical: false, priority: "normal", orderType: "Montage", notes: "" }); showNotice("Auftrag wurde im Browser gespeichert."); if (openChecklist) setActive("checklists"); };
  const updateSelectedOrder = (changes) => { if (!selectedOrder) return; setOrders((list) => list.map((order) => order.id === selectedOrder.id ? { ...order, ...changes, updatedAt: new Date().toLocaleString("de-DE") } : order)); showNotice("Änderung gespeichert."); };
  const updateSelectedOrderProduct = (productId) => { if (!selectedOrder) return; setOrders((list) => list.map((order) => order.id === selectedOrder.id ? { ...order, product: productId, updatedAt: new Date().toLocaleString("de-DE") } : order)); setChecks((current) => ({ ...current, [selectedOrder.id]: buildEmptyChecklist(productId, { ...selectedOrder, product: productId }) })); showNotice("Produkt geändert und passende Checkliste neu geladen."); };
  const deleteSelectedOrder = () => { if (!selectedOrder) return; const remaining = orders.filter((order) => order.id !== selectedOrder.id); setOrders(remaining); setChecks((current) => { const next = { ...current }; delete next[selectedOrder.id]; return next; }); setSelectedOrderId(remaining[0]?.id || ""); showNotice("Auftrag gelöscht."); };
  const toggleCheck = (orderId, item) => setChecks((current) => ({ ...current, [orderId]: { ...(current[orderId] || {}), [item]: !(current[orderId]?.[item]) } }));
  const setMeasurementField = (field, value) => setMeasurementValues((current) => ({ ...current, [selectedOrder?.id]: { ...(current[selectedOrder?.id] || {}), [field]: value } }));
  const uploadPhoto = (id, file) => { if (!file) return; setPhotos((p) => ({ ...p, [id]: { name: file.name, url: URL.createObjectURL(file) } })); };
  const toggleQuality = (id) => setManualQuality((current) => ({ ...current, [selectedOrder?.id]: { ...(current[selectedOrder?.id] || {}), [id]: !current[selectedOrder?.id]?.[id] } }));
  const completeSelectedOrder = () => { if (!selectedOrder || !closeReady) return; updateSelectedOrder({ status: "erledigt" }); setActive("dashboard"); };
  const applyReportTemplate = () => { setReportText(selectedReportTemplate.text); showNotice("Vorlage wurde übernommen."); };
  const importChecklistIntoReport = () => { const text = reportCheckedItems.length ? `Erledigte Checklistenpunkte: ${reportCheckedItems.join(", ")}.` : `Beim Auftrag ${selectedOrder?.id || ""} wurden noch keine Checklistenpunkte abgehakt.`; setReportText((current) => `${current}\n${text}`.trim()); showNotice("Checkliste wurde übernommen."); };
  const addPhotoNoteToReport = () => { const photoNames = Object.keys(photos); const text = photoNames.length ? `Fotodokumentation erstellt: ${photoNames.join(", ")}.` : "Fotodokumentation wurde vorbereitet, aber noch keine Fotos hinzugefügt."; setReportText((current) => `${current}\n${text}`.trim()); showNotice("Foto-Notiz eingefügt."); };
  const saveReportEntry = () => { const entry = { id: Date.now(), mode: reportMode, status: reportStatus, text: reportProposal, orderId: selectedOrder?.id || "", createdAt: new Date().toLocaleString("de-DE"), masterComment: reportMasterComment }; setSavedReports((entries) => [entry, ...entries]); showNotice("Berichtsheft-Eintrag gespeichert."); };
  const generateWeeklyReport = () => { const weekOrders = orders.slice(0, 5); const text = `Wochenbericht automatisch erstellt. Berücksichtigte Aufträge: ${weekOrders.map((order) => `${order.id} ${productTypes.find((p) => p.id === order.product)?.name || "Produkt"} bei ${order.customer}`).join("; ")}. Schwerpunkte waren Aufmaß, Montagevorbereitung, Checklistenbearbeitung, Funktionsprüfung, Dokumentation und Kundenkommunikation.`; setReportMode("Wochenbericht"); setReportText(text); showNotice("Wochenbericht erzeugt."); };
  const exportCurrentReport = () => { const text = `BERICHTSHEFT-EXPORT\nDatum: ${new Date().toLocaleString("de-DE")}\nStatus: ${reportStatus}\nAuftrag: ${selectedOrder?.id || ""}\n\n${reportProposal}\n\nMeister-Kommentar:\n${reportMasterComment || "-"}`; setReportExportText(text); setBackupText(text); showNotice("Export erzeugt."); };
  const approveLatestReport = () => { if (!savedReports[0]) { showNotice("Es gibt noch keinen gespeicherten Bericht."); return; } setSavedReports((entries) => entries.map((entry, index) => index === 0 ? { ...entry, status: "Freigegeben", masterComment: reportMasterComment || entry.masterComment || "Freigegeben." } : entry)); setReportStatus("Freigegeben"); showNotice("Letzter Bericht freigegeben."); };
  const deleteReport = (id) => { setSavedReports((entries) => entries.filter((entry) => entry.id !== id)); showNotice("Bericht gelöscht."); };
  const addNote = () => { if (!favorite.trim()) return; setNotes((n) => [{ id: Date.now(), text: favorite, module: active }, ...n]); setFavorite(""); };
  const runPhotoAnalysis = (label) => { const analysis = photos[label] ? `${label}: Foto '${photos[label].name}' wurde Auftrag ${selectedOrder?.id || "ohne Auftrag"} zugeordnet. Vorschlag: im Protokoll verwenden und beim Abschluss prüfen.` : `${label}: Noch kein Foto vorhanden.`; setPhotoAnalyses((current) => ({ ...current, [label]: analysis })); };
  const generateKiAnswer = () => { const warnings = []; if (selectedOrder?.substrate === "WDVS") warnings.push("WDVS-Abstandsmontage und Abdichtung prüfen"); if (selectedOrder?.drive?.includes("Funk")) warnings.push("Senderkanal, Reichweite und Gruppensteuerung testen"); if (selectedOrder?.windCritical) warnings.push("Windklasse, Sensorik und Kundenhinweis dokumentieren"); setGeneratedAiResponse(`Prüfvorschlag für ${selectedOrder?.id || "aktuellen Auftrag"}: Produkt ${selectedProduct.name}, Untergrund ${selectedOrder?.substrate || "unbekannt"}, Antrieb ${selectedOrder?.drive || "unbekannt"}. Nächste Schritte: Aufmaß prüfen, Checkliste öffnen, Fotos ergänzen, ${warnings.length ? warnings.join("; ") : "Standardprüfung durchführen"}, Abschlussprüfung öffnen.`); };
  const createSnapshot = () => ({ version: "1.1-team-demo", exportedAt: new Date().toISOString(), authUser, company, companyPeople, orders, checks, notes, savedReports, measurementValues, manualQuality, photoAnalyses });
  const demoLogin = () => { const user = { id: `U-${Date.now()}`, name: loginForm.name || "Demo Nutzer", email: loginForm.email, role: loginForm.role, company: loginForm.company, companyId: cloudCompanyId, loggedInAt: new Date().toLocaleString("de-DE") }; setAuthUser(user); setRole(loginForm.role); addSyncLog("Demo-Login durchgeführt"); };
  const demoLogout = () => { addSyncLog("Logout durchgeführt"); setAuthUser(null); };
  const pushToCloud = () => { const snapshot = createSnapshot(); saveJson(`rs-cloud-${cloudCompanyId}`, snapshot); setBackupText(JSON.stringify(snapshot, null, 2)); addSyncLog("Daten in Demo-Cloud gespeichert"); };
  const pullFromCloud = () => { const snapshot = loadJson(`rs-cloud-${cloudCompanyId}`, null); if (!snapshot) { addSyncLog("Keine Demo-Cloud-Daten gefunden", "fehlt"); return; } setOrders(snapshot.orders || []); setChecks(snapshot.checks || {}); setNotes(snapshot.notes || []); setSavedReports(snapshot.savedReports || []); setMeasurementValues(snapshot.measurementValues || {}); setManualQuality(snapshot.manualQuality || {}); setPhotoAnalyses(snapshot.photoAnalyses || {}); setCompany(snapshot.company || defaultCompany()); setCompanyPeople(snapshot.companyPeople || defaultCompanyPeople()); addSyncLog("Daten aus Demo-Cloud geladen"); };
  const exportBackup = () => { const text = JSON.stringify(createSnapshot(), null, 2); setBackupText(text); addSyncLog("Backup erzeugt"); };
  const importBackup = () => { try { const snapshot = JSON.parse(backupText); setOrders(snapshot.orders || []); setChecks(snapshot.checks || {}); setNotes(snapshot.notes || []); setSavedReports(snapshot.savedReports || []); setMeasurementValues(snapshot.measurementValues || {}); setManualQuality(snapshot.manualQuality || {}); setPhotoAnalyses(snapshot.photoAnalyses || {}); setCompany(snapshot.company || defaultCompany()); setCompanyPeople(snapshot.companyPeople || defaultCompanyPeople()); addSyncLog("Backup importiert"); } catch { addSyncLog("Backup konnte nicht gelesen werden", "fehler"); } };

  const screen = (content) => <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{content}</motion.main>;

  return <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-950 ${device.isMobile ? "p-3 pb-24" : "p-4 md:p-8"}`}><div className="mx-auto max-w-7xl"><TopBar role={role} setRole={setRole} offline={offline} setOffline={setOffline} compact={device.isMobile} /><Header role={role} orders={orders} selectedOrder={selectedOrder} offline={offline} compact={device.isMobile} />{!device.isMobile && <nav className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5 xl:grid-cols-8">{allowedNav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActive(id)} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold shadow-sm transition ${active === id ? "bg-slate-950 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}><Icon size={17} />{label}</button>)}</nav>}{device.isMobile && <MobileBottomNav items={allowedNav} active={active} setActive={setActive} />}{notice && <div className="mb-4 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{notice}</div>}

  {active === "dashboard" && screen(<div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><Card><SectionTitle icon={Home} title="Start / Tagesübersicht" subtitle="Schneller Einstieg in offene Aufträge, Fotos, Checklisten, Kundenkommunikation und Protokolle." /><div className="grid gap-3 md:grid-cols-2">{orders.slice(0, 4).map((o) => <button key={o.id} onClick={() => { setSelectedOrderId(o.id); setActive("orders"); }} className="rounded-3xl bg-slate-50 p-4 text-left hover:bg-white hover:shadow-md"><div className="flex items-center justify-between"><strong>{o.id}</strong><Badge>{o.priority}</Badge></div><p className="mt-2 font-bold">{o.customer}</p><p className="text-sm text-slate-600">{o.address}</p><p className="mt-2 text-xs text-slate-500">{productTypes.find((p) => p.id === o.product)?.name}</p></button>)}</div></Card><Card><SectionTitle icon={BriefcaseBusiness} title="Aktiver Auftrag" subtitle="Alle Module beziehen sich auf diesen Auftrag." />{selectedOrder && <div className="rounded-3xl bg-slate-50 p-5"><h3 className="text-xl font-black">{selectedOrder.customer}</h3><p className="mt-2 text-sm text-slate-600">{selectedOrder.address}</p><div className="mt-3 flex flex-wrap gap-2"><Badge>{selectedOrder.id}</Badge><Badge>{selectedProduct.name}</Badge><Badge>{selectedOrder.status}</Badge></div><p className="mt-4 text-sm leading-6 text-slate-600">{selectedOrder.notes}</p></div>}</Card></div>)}
  {active === "today" && screen(<div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]"><Card><SectionTitle icon={ClipboardList} title="Heute / Tagesplanung" subtitle="Heutige Aufträge, offene Berichte und Schnellaktionen." /><div className="grid gap-3 md:grid-cols-3"><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{todaysOrders.length}</p><p className="text-sm text-slate-600">heutige Aufträge</p></div><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{openReports.length}</p><p className="text-sm text-slate-600">offene Berichte</p></div><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{Object.keys(photos).length}</p><p className="text-sm text-slate-600">Fotos</p></div></div><div className="mt-5 space-y-3">{todaysOrders.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Heute sind noch keine Aufträge geplant.</div>}{todaysOrders.map((o) => <button key={o.id} onClick={() => { setSelectedOrderId(o.id); setActive("orders"); }} className="w-full rounded-3xl bg-slate-50 p-4 text-left hover:bg-white hover:shadow-md"><div className="flex items-center justify-between"><strong>{o.time} · {o.customer}</strong><Badge>{o.status}</Badge></div><p className="mt-1 text-sm text-slate-600">{o.address}</p><div className="mt-2 flex flex-wrap gap-2"><Badge>{productTypes.find((p) => p.id === o.product)?.name}</Badge><Badge>{o.assignedTo || "ohne Monteur"}</Badge></div></button>)}</div></Card><Card><SectionTitle icon={CheckCircle2} title="Schnellprüfung" subtitle="Was heute offen sein könnte." /><div className="space-y-3">{["Aufträge mit Status offen prüfen", "Checklisten vor Ort abhaken", "Vorher-/Nachher-Fotos ergänzen", "Berichtsheft am Tagesende speichern", "Kundennachricht bei Verzögerung senden"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold">{item}</div>)}</div></Card></div>)}
  {active === "orders" && screen(<div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><SectionTitle icon={Plus} title="Auftrag anlegen" subtitle="Der Auftrag ist der Mittelpunkt: alle Fotos, Checklisten, Protokolle und Berichte können später damit verbunden werden." /><div className="space-y-3"><div className="grid gap-3 md:grid-cols-2"><Field label="Kunde" value={newOrder.customer} onChange={(v) => setNewOrder({ ...newOrder, customer: v })} /><Field label="Ansprechpartner" value={newOrder.contact} onChange={(v) => setNewOrder({ ...newOrder, contact: v })} /><Field label="Telefon" value={newOrder.phone} onChange={(v) => setNewOrder({ ...newOrder, phone: v })} /><Field label="E-Mail" value={newOrder.email} onChange={(v) => setNewOrder({ ...newOrder, email: v })} /><Field label="Adresse" value={newOrder.address} onChange={(v) => setNewOrder({ ...newOrder, address: v })} /><Field label="Monteur" value={newOrder.assignedTo} onChange={(v) => setNewOrder({ ...newOrder, assignedTo: v })} /><Field label="Datum" type="date" value={newOrder.date} onChange={(v) => setNewOrder({ ...newOrder, date: v })} /><Field label="Uhrzeit" type="time" value={newOrder.time} onChange={(v) => setNewOrder({ ...newOrder, time: v })} /></div><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Produkt<select value={newOrder.product} onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{productTypes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><div className="rounded-3xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase text-slate-500">Checkliste wird automatisch gewählt</p><h3 className="mt-1 font-black">{newOrderProduct.name}</h3></div><Badge>{newOrderChecklistPreview.length} Punkte</Badge></div><div className="mt-3 grid gap-2">{newOrderChecklistPreview.slice(0, 5).map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-700">{item}</div>)}</div></div><div className="grid gap-3 md:grid-cols-2"><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Untergrund<select value={newOrder.substrate} onChange={(e) => setNewOrder({ ...newOrder, substrate: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Beton</option><option>Lochstein</option><option>WDVS</option><option>Holz</option><option>Stahl</option></select></label><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Antrieb<select value={newOrder.drive} onChange={(e) => setNewOrder({ ...newOrder, drive: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Gurt</option><option>Kurbel</option><option>Tastermotor</option><option>Funkmotor</option><option>Solarmotor</option></select></label><Field label="Priorität" value={newOrder.priority} onChange={(v) => setNewOrder({ ...newOrder, priority: v })} /><TextArea label="Notizen" value={newOrder.notes} onChange={(v) => setNewOrder({ ...newOrder, notes: v })} /></div><div className="grid gap-3 md:grid-cols-2"><button onClick={() => addOrder(false)} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Auftrag speichern</button><button onClick={() => addOrder(true)} className="w-full rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">Speichern & Checkliste öffnen</button></div></div></Card><Card><SectionTitle icon={ClipboardList} title="Auftragsliste" subtitle="Aufträge werden lokal gespeichert. Aktiven Auftrag bearbeiten, Status ändern oder löschen." />{selectedOrder && <div className="mb-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase text-slate-500">Aktiven Auftrag bearbeiten</p><div className="mt-3 grid gap-3 md:grid-cols-2"><Field label="Kunde" value={selectedOrder.customer || ""} onChange={(v) => updateSelectedOrder({ customer: v })} /><Field label="Adresse" value={selectedOrder.address || ""} onChange={(v) => updateSelectedOrder({ address: v })} /><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Produkt<select value={selectedOrder.product} onChange={(e) => updateSelectedOrderProduct(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{productTypes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Status<select value={selectedOrder.status || "offen"} onChange={(e) => updateSelectedOrder({ status: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>offen</option><option>in Arbeit</option><option>wartet auf Teile</option><option>erledigt</option><option>abgerechnet</option></select></label><TextArea label="Notizen" value={selectedOrder.notes || ""} onChange={(v) => updateSelectedOrder({ notes: v })} /></div><button onClick={deleteSelectedOrder} className="mt-4 rounded-2xl bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">Auftrag löschen</button></div>}<div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search size={18} /><input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Auftrag suchen ..." className="w-full outline-none" /></div><div className="space-y-3">{filteredOrders.map((o) => <button key={o.id} onClick={() => setSelectedOrderId(o.id)} className={`w-full rounded-3xl border p-4 text-left ${selectedOrderId === o.id ? "border-slate-950 bg-white shadow-md" : "border-slate-100 bg-slate-50"}`}><div className="flex items-center justify-between"><strong>{o.id} · {o.customer}</strong><Badge>{o.status}</Badge></div><p className="mt-1 text-sm text-slate-600">{o.address}</p><div className="mt-2 flex flex-wrap gap-2"><Badge>{productTypes.find((p) => p.id === o.product)?.name}</Badge><Badge>{o.priority}</Badge></div><p className="mt-2 text-xs text-slate-500">{o.notes}</p></button>)}</div></Card></div>)}
  {active === "closeOrder" && screen(<div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]"><Card><SectionTitle icon={CheckCircle2} title="Auftrag abschließen" subtitle="Vor dem Abschluss prüft die App Checkliste, Fotos, Protokoll, Kundeneinweisung, Motorprüfung und PDF-Vorbereitung." /><div className="mb-5 rounded-3xl bg-slate-50 p-4"><h3 className="font-black">{selectedOrder?.id} · {selectedOrder?.customer}</h3><p className="mt-1 text-sm text-slate-600">{selectedProduct.name} · Status: {selectedOrder?.status}</p></div><div className="space-y-3">{closeChecks.map((item) => <label key={item.id} className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-bold ${item.done ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>{item.type === "manual" ? <input type="checkbox" checked={Boolean(manualQuality[selectedOrder?.id]?.[item.id])} onChange={() => toggleQuality(item.id)} className="h-5 w-5 accent-slate-950" /> : item.done ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}<span>{item.label}</span></label>)}</div><button disabled={!closeReady} onClick={completeSelectedOrder} className={`mt-5 w-full rounded-2xl px-5 py-4 text-sm font-black ${closeReady ? "bg-slate-950 text-white" : "bg-slate-200 text-slate-500"}`}>{closeReady ? "Auftrag als erledigt markieren" : "Abschluss noch nicht möglich"}</button></Card><Card><SectionTitle icon={FileText} title="Fehlende Punkte" subtitle="Diese Punkte sollten vor Abschluss geklärt werden." />{closeChecks.filter((c) => !c.done).length === 0 ? <div className="rounded-3xl bg-emerald-50 p-5 text-sm font-bold text-emerald-900">Alles erledigt.</div> : <div className="space-y-3">{closeChecks.filter((c) => !c.done).map((c) => <div key={c.id} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold">{c.label}</div>)}</div>}</Card></div>)}
  {active === "products" && screen(<Card><SectionTitle icon={Sun} title="Produkt-Lexikon" subtitle="Mit Arbeitsschritten, Werkzeugen und Risiken pro Produkt." /><div className="grid gap-4 lg:grid-cols-2">{productTypes.map((p) => <article key={p.id} className="rounded-3xl bg-slate-50 p-5"><div className="flex items-center justify-between"><h3 className="text-lg font-black">{p.name}</h3><Badge>{p.category}</Badge></div><p className="mt-3 text-sm leading-6 text-slate-600">{p.description}</p><p className="mt-4 text-xs font-bold uppercase text-slate-500">Ablauf</p><ol className="mt-2 space-y-2">{p.steps.map((s, i) => <li key={s} className="rounded-2xl bg-white p-3 text-sm">{i + 1}. {s}</li>)}</ol><p className="mt-4 text-xs font-bold uppercase text-slate-500">Werkzeug</p><div className="mt-2 flex flex-wrap gap-2">{p.tools.map((t) => <Badge key={t}>{t}</Badge>)}</div></article>)}</div></Card>)}
  {active === "checklists" && screen(<Card><SectionTitle icon={ClipboardCheck} title="Checklisten pro Produkt" subtitle="Checkliste richtet sich automatisch nach Produkt, Untergrund, Antrieb und Windlage." /><div className="mb-5 rounded-3xl bg-slate-50 p-4"><div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]"><div><strong>{selectedOrder?.id} · {selectedProduct.name}</strong><p className="mt-1 text-sm text-slate-600">{selectedOrder?.customer}</p><label className="mt-4 block text-sm font-bold text-slate-800">Produkt<select value={selectedOrder?.product || ""} onChange={(e) => updateSelectedOrderProduct(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold">{productTypes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div><div className="rounded-3xl bg-white p-4"><div className="flex items-center justify-between text-sm font-bold"><span>Fortschritt</span><span>{selectedChecklistDone}/{selectedChecklistItems.length}</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-950 transition-all" style={{ width: `${selectedChecklistProgress}%` }} /></div><p className="mt-2 text-xs font-semibold text-slate-500">{selectedChecklistProgress}% erledigt</p></div></div></div><div className="grid gap-3 md:grid-cols-2">{selectedChecklistItems.map((item) => <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold"><input type="checkbox" checked={Boolean(checks[selectedOrder?.id]?.[item])} onChange={() => toggleCheck(selectedOrder?.id, item)} className="h-5 w-5 accent-slate-950" />{item}</label>)}</div></Card>)}
  {active === "tools" && screen(<Card><SectionTitle icon={Hammer} title="Werkzeug & Material" subtitle="Werkzeuglisten für Montage, Elektro, Zuschnitt, Reinigung und Sicherheit." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{toolKits.map((kit) => <article key={kit.group} className="rounded-3xl bg-slate-50 p-5"><h3 className="font-black">{kit.group}</h3><div className="mt-3 flex flex-wrap gap-2">{kit.items.map((i) => <Badge key={i}>{i}</Badge>)}</div></article>)}</div></Card>)}
  {active === "substrates" && screen(<Card><SectionTitle icon={HardHat} title="Untergrund-Assistent" subtitle="Werkzeuge, Befestigung und Risiken pro Untergrund." /><div className="grid gap-4 lg:grid-cols-2">{substrates.map((s) => <article key={s.name} className="rounded-3xl bg-slate-50 p-5"><h3 className="text-lg font-black">{s.name}</h3><p className="mt-4 text-xs font-bold uppercase text-slate-500">Werkzeuge</p><div className="mt-2 flex flex-wrap gap-2">{s.tools.map((t) => <Badge key={t}>{t}</Badge>)}</div><p className="mt-4 text-xs font-bold uppercase text-slate-500">Befestigung</p><div className="mt-2 flex flex-wrap gap-2">{s.fasteners.map((f) => <Badge key={f}>{f}</Badge>)}</div><div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">{s.warning}</div></article>)}</div></Card>)}
  {active === "motors" && screen(<Card><SectionTitle icon={Zap} title="Motoren & Steuerungen" subtitle="Motortypen, Prüfpunkte und typische Fehler. Herstelleranleitung bleibt verbindlich." /><div className="grid gap-4 lg:grid-cols-2">{motorTypes.map((m) => <article key={m.name} className="rounded-3xl bg-slate-50 p-5"><h3 className="text-lg font-black">{m.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{m.details}</p><p className="mt-4 text-xs font-bold uppercase text-slate-500">Prüfen</p><div className="mt-2 flex flex-wrap gap-2">{m.checks.map((c) => <Badge key={c}>{c}</Badge>)}</div><p className="mt-4 text-xs font-bold uppercase text-slate-500">Typische Fehler</p><div className="mt-2 flex flex-wrap gap-2">{m.mistakes.map((c) => <Badge key={c}>{c}</Badge>)}</div></article>)}</div></Card>)}
  {active === "diagnose" && screen(<Card><SectionTitle icon={HelpCircle} title="Erweiterte Fehlerdiagnose" subtitle="Diagnose mit Kategorie, Werkzeug, ersten Schritten und Ja/Nein-Entscheidung." /><DiagnosisStepMode trees={filteredDiagnosisTrees.length ? filteredDiagnosisTrees : diagnosisTrees} /><div className="mb-5 grid gap-3 md:grid-cols-[0.8fr_1.2fr]"><select value={diagnosisCategory} onChange={(e) => setDiagnosisCategory(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><option value="all">Alle Kategorien</option>{diagnosisCategories.filter((c) => c !== "all").map((category) => <option key={category}>{category}</option>)}</select><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search size={18} /><input value={diagnosisQuery} onChange={(e) => setDiagnosisQuery(e.target.value)} placeholder="Diagnose suchen ..." className="w-full outline-none" /></div></div><div className="grid gap-4 lg:grid-cols-2">{filteredDiagnosisTrees.map((d) => <article key={d.id} className="rounded-3xl bg-slate-50 p-5"><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-black">{d.title}</h3><Badge>{d.category}</Badge></div><p className="mt-4 text-xs font-bold uppercase text-slate-500">Werkzeuge</p><div className="mt-2 flex flex-wrap gap-2">{d.tools.map((tool) => <Badge key={tool}>{tool}</Badge>)}</div><p className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold">{d.start.q}</p><div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><strong>Wenn Ja:</strong> {d.start.yes}</div><div className="rounded-2xl bg-rose-50 p-4 text-sm leading-6 text-rose-900"><strong>Wenn Nein:</strong> {d.start.no}</div></div></article>)}</div></Card>)}
  {active === "manufacturers" && screen(<Card><SectionTitle icon={Database} title="Herstellerdatenbank" subtitle="Struktur für Modelle, Funkprotokolle, Endlagen, Reset, Fehlercodes, Anleitungslinks und eigene Notizen." /><div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search size={18} /><input value={manufacturerQuery} onChange={(e) => setManufacturerQuery(e.target.value)} placeholder="Hersteller, Protokoll, Thema suchen ..." className="w-full outline-none" /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredMakers.map((m) => <article key={m.name} className="rounded-3xl bg-slate-50 p-5"><h3 className="font-black">{m.name}</h3><p className="mt-3 text-xs font-bold uppercase text-slate-500">Protokolle</p><div className="mt-2 flex flex-wrap gap-2">{m.protocols.map((p) => <Badge key={p}>{p}</Badge>)}</div><p className="mt-3 text-xs font-bold uppercase text-slate-500">Themen</p><div className="mt-2 flex flex-wrap gap-2">{m.topics.map((p) => <Badge key={p}>{p}</Badge>)}</div><p className="mt-4 text-sm leading-6 text-slate-600">{m.note}</p></article>)}</div></Card>)}
  {active === "measurement" && screen(<div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]"><Card><SectionTitle icon={Wrench} title="Intelligenter Aufmaß-Assistent" subtitle="Pflichtfelder ändern sich je nach Produkt des aktiven Auftrags." /><div className="mb-4 rounded-3xl bg-slate-50 p-4"><h3 className="font-black">{selectedProduct.name}</h3><p className="mt-1 text-sm text-slate-600">Auftrag: {selectedOrder?.id} · {selectedOrder?.customer}</p></div><div className="grid gap-4 md:grid-cols-2">{measurementFields.map((field) => <Field key={field} label={field} value={orderMeasurements[field] || ""} onChange={(value) => setMeasurementField(field, value)} placeholder={`${field} eintragen`} />)}</div></Card><Card><SectionTitle icon={AlertTriangle} title="Aufmaß-Vollständigkeit" subtitle="Die App prüft fehlende Pflichtfelder." /><div className="mb-4 rounded-3xl bg-slate-950 p-5 text-white"><p className="text-4xl font-black">{measurementFields.length - missingMeasurements.length}/{measurementFields.length}</p><p className="text-sm text-white/70">Pflichtfelder ausgefüllt</p></div>{missingMeasurements.length === 0 ? <div className="rounded-3xl bg-emerald-50 p-5 text-sm font-bold text-emerald-900">Aufmaß vollständig.</div> : <div className="space-y-2">{missingMeasurements.map((field) => <div key={field} className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">Fehlt: {field}</div>)}</div>}</Card></div>)}
  {active === "offers" && screen(<div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]"><Card><SectionTitle icon={Euro} title="Angebotsassistent" subtitle="Grobe Kalkulation mit Material, Lohn, Anfahrt, WDVS-Zuschlag und Entsorgung." /><div className="grid gap-4 md:grid-cols-2">{Object.entries(calc).map(([k, v]) => <Field key={k} label={k} type="number" value={v} onChange={(value) => setCalc({ ...calc, [k]: value })} />)}</div></Card><Card><SectionTitle icon={Calculator} title="Preisvorschau" subtitle="Grobe Struktur für ein Angebots-PDF." /><div className="space-y-3"><div className="flex justify-between rounded-2xl bg-slate-50 p-4"><span>Netto</span><strong>{net.toFixed(2)} €</strong></div><div className="flex justify-between rounded-2xl bg-slate-50 p-4"><span>MwSt. 19%</span><strong>{(net * 0.19).toFixed(2)} €</strong></div><div className="flex justify-between rounded-2xl bg-slate-950 p-4 text-white"><span>Brutto</span><strong>{(net * 1.19).toFixed(2)} €</strong></div></div><CopyBox title="Angebotstext kopieren" text={`Wir bieten Ihnen die Lieferung und Montage von ${selectedProduct.name} gemäß Aufmaß und technischer Klärung an. Untergrund, Stromanschluss und Herstellerangaben sind vor Ausführung zu prüfen.`} /></Card></div>)}
  {active === "photos" && screen(<Card><SectionTitle icon={Camera} title="Foto-KI Workflow" subtitle="Fotos hochladen, zuordnen und als Demo auswerten." /><div className="grid gap-4 md:grid-cols-3">{["Typenschild", "Ersatzteil", "Untergrund", "Schaden", "Vorher", "Nachher"].map((label) => <div key={label} className="rounded-3xl bg-slate-50 p-5"><h3 className="font-black">{label}</h3><label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4 text-sm font-bold"><Upload className="mb-2" />Foto hinzufügen<input type="file" accept="image/*" className="hidden" onChange={(e) => uploadPhoto(label, e.target.files?.[0])} /></label>{photos[label] && <img src={photos[label].url} alt={label} className="mt-4 h-40 w-full rounded-2xl object-cover" />}<button onClick={() => runPhotoAnalysis(label)} className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">{label} auswerten</button>{photoAnalyses[label] && <div className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">{photoAnalyses[label]}</div>}</div>)}</div></Card>)}
  {active === "parts" && screen(<Card><SectionTitle icon={PackageSearch} title="Ersatzteil-Finder mit Anfrageformular" subtitle="Filter und fertige Ersatzteil-Anfrage." /><div className="mb-5 rounded-3xl bg-slate-50 p-5"><h3 className="font-black">Ersatzteil-Anfrage vorbereiten</h3><div className="mt-4 grid gap-3 md:grid-cols-3"><Field label="Produktart" value={partRequest.product} onChange={(v) => setPartRequest({ ...partRequest, product: v })} /><Field label="Hersteller" value={partRequest.manufacturer} onChange={(v) => setPartRequest({ ...partRequest, manufacturer: v })} /><Field label="Bauteil" value={partRequest.part} onChange={(v) => setPartRequest({ ...partRequest, part: v })} /><Field label="Maß / Typ" value={partRequest.measure} onChange={(v) => setPartRequest({ ...partRequest, measure: v })} /><Field label="Farbe" value={partRequest.color} onChange={(v) => setPartRequest({ ...partRequest, color: v })} /><Field label="Welle" value={partRequest.shaft} onChange={(v) => setPartRequest({ ...partRequest, shaft: v })} /></div><div className="mt-4"><CopyBox title="Ersatzteil-Anfrage kopieren" text={partRequestText} /></div></div><div className="mb-4 grid gap-3 md:grid-cols-[0.5fr_1fr]"><select value={partGroup} onChange={(e) => setPartGroup(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><option value="all">Alle Gruppen</option>{[...new Set(partCatalog.map((p) => p.group))].map((g) => <option key={g}>{g}</option>)}</select><input value={partQuery} onChange={(e) => setPartQuery(e.target.value)} placeholder="z. B. SW60, Sender ..." className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none" /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredParts.map((p) => <article key={p.name} className="rounded-3xl bg-slate-50 p-5"><h3 className="font-black">{p.name}</h3><div className="mt-2 flex gap-2"><Badge>{p.group}</Badge><Badge>{p.product}</Badge></div><p className="mt-4 text-xs font-bold uppercase text-slate-500">Abfragen</p><div className="mt-2 flex flex-wrap gap-2">{p.asks.map((a) => <Badge key={a}>{a}</Badge>)}</div><p className="mt-4 text-sm leading-6 text-slate-600">{p.tip}</p></article>)}</div></Card>)}
  {active === "customers" && screen(<Card><SectionTitle icon={MessageSquareText} title="Kundenkommunikation mit Auftragsdaten" subtitle="Texte mit Platzhaltern werden aus dem aktiven Auftrag gefüllt." /><div className="mb-5 rounded-3xl bg-slate-50 p-4 text-sm leading-6"><strong>Aktiver Auftrag:</strong> {selectedOrder?.customer} · {selectedProduct.name} · {selectedOrder?.date} {selectedOrder?.time}</div><div className="grid gap-4 md:grid-cols-2">{customerTemplates.map((t) => <CopyBox key={t.title} title={t.title} text={customerTemplateForOrder(t.text)} />)}</div></Card>)}
  {active === "maintenance" && screen(<Card><SectionTitle icon={RefreshCw} title="Wartung & Pflege" subtitle="Konkrete Schritt-für-Schritt-Tipps." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{maintenanceTips.map((m) => <article key={m.title} className="rounded-3xl bg-slate-50 p-5"><Badge>{m.product}</Badge><h3 className="mt-3 font-black">{m.title}</h3><ol className="mt-3 space-y-2">{m.steps.map((s, i) => <li key={s} className="rounded-2xl bg-white p-3 text-sm">{i + 1}. {s}</li>)}</ol></article>)}</div></Card>)}
  {active === "learning" && screen(<Card><SectionTitle icon={GraduationCap} title="Lernmodus mit Quiz-Trainer" subtitle="Nach Ausbildungsjahr und Thema filterbar." /><QuizTrainer cards={quizCards} /></Card>)}
  {active === "knowledge" && screen(<Card><SectionTitle icon={Layers} title="Wissensbereich mit Skizzenkarten" subtitle="Platzhalter für spätere Bilder und Skizzen." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sketchCards.map((card) => <article key={card.title} className="rounded-3xl bg-slate-50 p-5"><div className="mb-4 rounded-2xl bg-white p-4 text-center text-sm font-black text-slate-500 shadow-sm">Skizze: {card.title}</div><h3 className="font-black">{card.title}</h3><div className="mt-3 flex flex-wrap gap-2">{card.parts.map((part) => <Badge key={part}>{part}</Badge>)}</div><p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">{card.tip}</p></article>)}</div></Card>)}
  {active === "reportBook" && screen(<div className="space-y-5"><Card><SectionTitle icon={BookOpen} title="Berichtsheft-Funktionen" subtitle="Tages-/Wochenbericht, Vorlage, Checklistenübernahme, Foto-Notiz, Status/Freigabe, Erinnerung, Speichern und Export." /><div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"><div className="space-y-4"><div className="grid gap-3 md:grid-cols-2"><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Berichtsart<select value={reportMode} onChange={(e) => setReportMode(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Tagesbericht</option><option>Wochenbericht</option></select></label><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Ausbildungsjahr<select value={reportYear} onChange={(e) => setReportYear(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option value="1">1. Ausbildungsjahr</option><option value="2">2. Ausbildungsjahr</option><option value="3">3. Ausbildungsjahr</option></select></label><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Lernfeld<select value={reportLearningField} onChange={(e) => setReportLearningField(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{reportLearningFields.map((field) => <option key={field}>{field}</option>)}</select></label><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Tätigkeits-Vorlage<select value={reportTemplateId} onChange={(e) => setReportTemplateId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{reportActivityTemplates.map((template) => <option key={template.id} value={template.id}>{template.label}</option>)}</select></label></div><div className="grid gap-3 md:grid-cols-3"><button onClick={applyReportTemplate} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Vorlage übernehmen</button><button onClick={importChecklistIntoReport} className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">Checkliste übernehmen</button><button onClick={addPhotoNoteToReport} className="rounded-2xl bg-sky-100 px-4 py-3 text-sm font-bold text-sky-800">Foto-Notiz einfügen</button><button onClick={generateWeeklyReport} className="rounded-2xl bg-violet-100 px-4 py-3 text-sm font-bold text-violet-800">Wochenbericht erzeugen</button><button onClick={approveLatestReport} className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">Letzten Bericht freigeben</button><button onClick={exportCurrentReport} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800">Bericht exportieren</button></div><TextArea label="Stichpunkte / eigener Text" value={reportText} onChange={setReportText} /><div className="rounded-3xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">Fachbegriffe</p><div className="mt-3 flex flex-wrap gap-2">{reportTerms.map((term) => <Badge key={term}>{term}</Badge>)}</div></div><div className="grid gap-3 md:grid-cols-2"><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Status<select value={reportStatus} onChange={(e) => setReportStatus(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Entwurf</option><option>Zur Prüfung</option><option>Änderung nötig</option><option>Freigegeben</option></select></label><Field label="Erinnerung" value={reportReminder} onChange={setReportReminder} /></div><TextArea label="Meister-Kommentar" value={reportMasterComment} onChange={setReportMasterComment} /></div><div className="space-y-4"><CopyBox title="Bericht-Vorschlag kopieren" text={reportProposal} /><div className="grid gap-3 md:grid-cols-3"><button onClick={saveReportEntry} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"><Save size={17} />Speichern</button><button onClick={() => setPdfTarget("Berichtsheft-Eintrag")} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800"><FileText size={17} />Für PDF</button><button onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800"><Printer size={17} />Drucken</button></div>{reportExportText && <CopyBox title="Berichtsheft-Export kopieren" text={reportExportText} />}</div></div></Card><Card><SectionTitle icon={Save} title="Gespeicherte Berichte" subtitle="Berichte werden lokal gespeichert." /><div className="grid gap-4 md:grid-cols-2">{savedReports.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Noch keine Berichte gespeichert.</div>}{savedReports.map((entry) => <article key={entry.id} className="rounded-3xl bg-slate-50 p-5"><div className="flex flex-wrap items-center gap-2"><Badge>{entry.mode}</Badge><Badge>{entry.status}</Badge><Badge>{entry.orderId || "ohne Auftrag"}</Badge></div><p className="mt-3 text-xs font-bold text-slate-500">{entry.createdAt}</p><textarea readOnly value={entry.text} className="mt-3 h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm leading-6" /><div className="mt-3 grid gap-2 md:grid-cols-2"><button onClick={() => { setReportExportText(entry.text); showNotice("Bericht für Export ausgewählt."); }} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Export auswählen</button><button onClick={() => deleteReport(entry.id)} className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-bold text-rose-800">Bericht löschen</button></div></article>)}</div></Card></div>)}
  {active === "safety" && screen(<div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><SectionTitle icon={AlertTriangle} title="Sicherheits- und Warnsystem" subtitle="Kritische Kombinationen werden sichtbar gemacht." /><div className="space-y-3">{["WDVS: Lastabtragung und Abdichtung prüfen", "Markise: hohe Hebel- und Zugkräfte", "Elektro: Spannungsfreiheit und fachgerechte Messung", "Wind: Herstellerangaben und Sensorik beachten"].map((w) => <div key={w} className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-900">{w}</div>)}</div></Card><Card><SectionTitle icon={ShieldCheck} title="Warnhinweise" subtitle="Nicht als automatische Freigabe nutzen." /><p className="text-sm leading-6 text-slate-600">Herstellerangaben, Untergrund, Befestigung, Gebäudehöhe und Fachprüfung bleiben verbindlich.</p></Card></div>)}
  {active === "norms" && screen(<Card><SectionTitle icon={ShieldCheck} title="Normen & Windklassen" subtitle="Orientierung, keine automatische Freigabe." /><div className="grid gap-4 md:grid-cols-2">{norms.map((n) => <article key={n.title} className="rounded-3xl bg-slate-50 p-5"><h3 className="font-black">{n.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{n.text}</p></article>)}</div></Card>)}
  {active === "pdf" && screen(<div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><SectionTitle icon={Download} title="PDF-Export Vorbereitung" subtitle="Browser-Druck/PDF und Exportvorschau." /><select value={pdfTarget} onChange={(e) => setPdfTarget(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><option>Montageprotokoll</option><option>Aufmaßblatt</option><option>Wartungsprotokoll</option><option>Kundenübergabe</option><option>Angebotsentwurf</option><option>Berichtsheft-Eintrag</option></select><button onClick={() => window.print()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"><Printer size={18} />Druck/PDF öffnen</button></Card><Card><SectionTitle icon={FileText} title="Vorschau" subtitle="Diese Daten würden in den Export einfließen." /><div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7"><strong>{pdfTarget}</strong><br />Auftrag: {selectedOrder?.id}<br />Kunde: {selectedOrder?.customer}<br />Produkt: {selectedProduct.name}<br />Notizen: {selectedOrder?.notes}</div></Card></div>)}
  {active === "offline" && screen(<Card><SectionTitle icon={WifiOff} title="Offline-Modus" subtitle="Status wird lokal gespeichert. Später: Aufträge, Fotos, Checklisten und Protokolle synchronisieren." /><button onClick={() => setOffline(!offline)} className={`rounded-2xl px-5 py-3 text-sm font-black ${offline ? "bg-emerald-100 text-emerald-800" : "bg-slate-950 text-white"}`}>{offline ? "Offline aktiv" : "Offline aktivieren"}</button><div className="mt-5 grid gap-3 md:grid-cols-3">{["Aufträge offline", "Fotos zwischenspeichern", "Checklisten abhaken", "Protokolle schreiben", "später synchronisieren", "Konflikte anzeigen"].map((i) => <div key={i} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold">{i}</div>)}</div></Card>)}
  {active === "rights" && screen(<Card><SectionTitle icon={Settings} title="Rechte-System" subtitle="Welche Rolle darf was? Dev sieht alles." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{roles.map((r) => <article key={r.id} className="rounded-3xl bg-slate-50 p-5"><h3 className="font-black">{r.label}</h3><p className="mt-2 text-sm text-slate-600">{r.description}</p><div className="mt-3 flex flex-wrap gap-2">{(r.id === "dev" ? navItems : navItems.filter((n) => n.roles.includes(r.id))).map((n) => <Badge key={n.id}>{n.label}</Badge>)}</div></article>)}</div></Card>)}

  {active === "company" && screen(<div className="space-y-5"><div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><SectionTitle icon={UserRound} title="Firma & Team" subtitle="Firma legt Monteure, Vorarbeiter, Azubis und Kunden an. Jede Person bekommt einen persönlichen Code für Anmeldung mit Name + Code." /><div className="rounded-3xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">Betrieb</p><Field label="Firmenname" value={company.name} onChange={(v) => setCompany({ ...company, name: v })} /><div className="mt-3 grid gap-2 md:grid-cols-3"><CopyBox title="Azubi-Code" text={company.azubiCode} /><CopyBox title="Kunden-Code" text={company.customerCode} /><CopyBox title="Monteur-Code" text={company.monteurCode} /></div><div className="mt-3 grid gap-2 md:grid-cols-3"><button onClick={() => regenerateCompanyCode("azubiCode", "AZU")} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold">Azubi-Code neu</button><button onClick={() => regenerateCompanyCode("customerCode", "KUN")} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold">Kunden-Code neu</button><button onClick={() => regenerateCompanyCode("monteurCode", "MON")} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold">Monteur-Code neu</button></div></div><div className="mt-5 rounded-3xl bg-white p-0"><h3 className="mb-3 font-black">Person erstellen</h3><div className="grid gap-3 md:grid-cols-2"><Field label="Name" value={personForm.name} onChange={(v) => setPersonForm({ ...personForm, name: v })} /><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Rolle<select value={personForm.role} onChange={(e) => setPersonForm({ ...personForm, role: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{teamRoleOptions.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label><Field label="Telefon" value={personForm.phone} onChange={(v) => setPersonForm({ ...personForm, phone: v })} /><Field label="Adresse / Bereich" value={personForm.address} onChange={(v) => setPersonForm({ ...personForm, address: v })} /><Field label="Kolonne / Team" value={personForm.team} onChange={(v) => setPersonForm({ ...personForm, team: v })} /><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Ausbildungsjahr<select value={personForm.trainingYear} onChange={(e) => setPersonForm({ ...personForm, trainingYear: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option value="1">1. Jahr</option><option value="2">2. Jahr</option><option value="3">3. Jahr</option></select></label></div><button onClick={createCompanyPerson} className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Person anlegen & Code erzeugen</button></div></Card><Card><SectionTitle icon={ShieldCheck} title="Anmelden mit Name + Code" subtitle="Monteur, Vorarbeiter, Azubi oder Kunde meldet sich ohne E-Mail mit persönlichem Zugangscode an." /><div className="grid gap-3 md:grid-cols-2"><Field label="Name" value={codeLogin.name} onChange={(v) => setCodeLogin({ ...codeLogin, name: v })} /><Field label="Persönlicher Code" value={codeLogin.code} onChange={(v) => setCodeLogin({ ...codeLogin, code: v.toUpperCase() })} placeholder="z. B. MON-48291" /></div><button onClick={loginWithPersonalCode} className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Mit Code anmelden</button><div className="mt-5 rounded-3xl bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">Kunden stehen nach Erstellung zuerst auf „wartet auf Freigabe“. Firma/Meister/Büro schaltet sie im Verzeichnis aktiv.</div><div className="mt-5 grid gap-3 md:grid-cols-2"><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{teamMembers.length}</p><p className="text-sm text-slate-600">Teammitglieder</p></div><div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{companyCustomers.length}</p><p className="text-sm text-slate-600">Kunden</p></div></div></Card></div><Card><SectionTitle icon={Search} title="Verzeichnis" subtitle="Firma sieht alle Vorarbeiter, Monteure, Azubis und Kunden inklusive Code, Status, Lernfortschritt und Baustellen." /><div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search size={18} /><input value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)} placeholder="Suchen: Name, Code, Rolle, Status ..." className="w-full outline-none" /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredCompanyPeople.map((p) => { const assignedCount = orders.filter((o) => (o.assignedMemberIds || []).includes(p.id) || o.customerPersonId === p.id).length; return <article key={p.id} className="rounded-3xl bg-slate-50 p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-black">{p.name}</h3><p className="mt-1 text-sm text-slate-600">{personRoleLabel(p.role)} · {p.team || p.address || "ohne Bereich"}</p></div><Badge>{p.status}</Badge></div><div className="mt-3"><CopyBox title="Persönlicher Zugangscode" text={p.accessCode} /></div>{p.role === "azubi" && <div className="mt-3 rounded-2xl bg-white p-3"><p className="text-xs font-bold uppercase text-slate-500">Lernfortschritt</p><input type="range" min="0" max="100" value={p.progress || 0} onChange={(e) => updateAzubiProgress(p.id, e.target.value)} className="mt-2 w-full" /><p className="text-sm font-black">{p.progress || 0}% · {p.trainingYear || "?"}. Ausbildungsjahr</p></div>}<div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => setPersonStatus(p.id, p.status === "aktiv" ? "inaktiv" : "aktiv")} className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-bold text-white">{p.status === "aktiv" ? "Deaktivieren" : "Aktivieren"}</button><button onClick={() => regeneratePersonCode(p.id)} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold">Code neu</button><button onClick={() => deletePerson(p.id)} className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-800">Löschen</button><div className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-slate-600">{assignedCount} Baustellen</div></div></article>; })}</div></Card></div>)}

  {active === "planning" && screen(<div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><Card><SectionTitle icon={BriefcaseBusiness} title="Baustellenplanung" subtitle="Aufträge werden Vorarbeitern, Monteuren, Azubis und Kunden zugewiesen. Danach sehen Code-Logins nur ihre passenden Baustellen." /><div className="space-y-3">{orders.map((o) => <button key={o.id} onClick={() => setSelectedOrderId(o.id)} className={`w-full rounded-3xl border p-4 text-left ${selectedOrder?.id === o.id ? "border-slate-950 bg-white shadow-md" : "border-slate-100 bg-slate-50"}`}><div className="flex items-center justify-between"><strong>{o.date} {o.time} · {o.customer}</strong><Badge>{o.status}</Badge></div><p className="mt-1 text-sm text-slate-600">{o.address}</p><p className="mt-2 text-xs font-bold text-slate-500">Team: {(o.assignedMemberIds || []).map((id) => companyPeople.find((p) => p.id === id)?.name).filter(Boolean).join(", ") || o.assignedTo || "noch niemand"}</p></button>)}</div></Card><Card><SectionTitle icon={UserRound} title="Zuweisung für aktiven Auftrag" subtitle="Wähle Teammitglieder und Kunden aus dem Firmenverzeichnis." /><div className="mb-4 rounded-3xl bg-slate-50 p-4"><h3 className="font-black">{selectedOrder?.id} · {selectedOrder?.customer}</h3><p className="mt-1 text-sm text-slate-600">{selectedProduct.name} · {selectedOrder?.date} {selectedOrder?.time}</p></div><p className="mb-2 text-xs font-bold uppercase text-slate-500">Team zuweisen</p><div className="space-y-2">{teamMembers.map((p) => <label key={p.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold"><span>{p.name} · {personRoleLabel(p.role)}</span><input type="checkbox" checked={(selectedOrder?.assignedMemberIds || []).includes(p.id)} onChange={() => toggleAssignment(p.id)} className="h-5 w-5 accent-slate-950" /></label>)}</div><p className="mb-2 mt-5 text-xs font-bold uppercase text-slate-500">Kunde zuweisen</p><div className="space-y-2">{companyCustomers.map((p) => <button key={p.id} onClick={() => assignCustomerToOrder(p.id)} className={`w-full rounded-2xl p-3 text-left text-sm font-bold ${selectedOrder?.customerPersonId === p.id ? "bg-slate-950 text-white" : "bg-slate-50"}`}>{p.name} · {p.status} · {p.address || "ohne Adresse"}</button>)}</div></Card></div>)}

  {active === "data" && screen(<div className="space-y-5">
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <SectionTitle icon={Database} title="Supabase Login & Firma" subtitle="Firma mit E-Mail registrieren oder einloggen. Monteure, Vorarbeiter, Azubis und Kunden nutzen Name + persönlichen Code." />
        <div className={`mb-4 rounded-3xl p-4 text-sm font-bold ${isSupabaseConfigured ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
          {isSupabaseConfigured ? "Supabase-Variablen sind vorhanden." : "Supabase-Variablen fehlen: VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in Vercel prüfen."}
          {supabaseStatus && <p className="mt-2 text-slate-700">Letzte Meldung: {supabaseStatus}</p>}
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">Aktueller Nutzer</p>
          {authUser ? <div className="mt-2"><h3 className="text-xl font-black">{authUser.name}</h3><p className="text-sm text-slate-600">{authUser.email} · Rolle: {authUser.role} · Betrieb: {authUser.company}</p><button onClick={logoutSupabase} className="mt-3 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Abmelden</button></div> : <p className="mt-2 text-sm font-bold text-slate-600">Nicht angemeldet</p>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button onClick={() => setCompanyAuthMode("register")} className={`rounded-xl px-3 py-2 text-sm font-black ${companyAuthMode === "register" ? "bg-white shadow" : "text-slate-500"}`}>Firma registrieren</button>
          <button onClick={() => setCompanyAuthMode("login")} className={`rounded-xl px-3 py-2 text-sm font-black ${companyAuthMode === "login" ? "bg-white shadow" : "text-slate-500"}`}>Firma einloggen</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Name Meister/Büro" value={loginForm.name} onChange={(v) => setLoginForm({ ...loginForm, name: v })} />
          <Field label="Betrieb" value={loginForm.company} onChange={(v) => setLoginForm({ ...loginForm, company: v })} />
          <Field label="E-Mail" value={loginForm.email} onChange={(v) => setLoginForm({ ...loginForm, email: v })} />
          <Field label="Passwort" type="password" value={loginForm.password} onChange={(v) => setLoginForm({ ...loginForm, password: v })} />
          <Field label="Cloud/Betriebs-ID" value={cloudCompanyId} onChange={setCloudCompanyId} />
          <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Rolle Demo
            <select value={loginForm.role} onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
          </label>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <button onClick={companyAuthMode === "register" ? registerCompanyWithSupabase : signInCompanyWithSupabase} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">{companyAuthMode === "register" ? "Firma in Supabase erstellen" : "Mit Supabase einloggen"}</button>
          <button onClick={demoLogin} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800">Nur Demo-Login</button>
          <button onClick={loadCurrentCompanyFromSupabase} className="rounded-2xl bg-sky-100 px-4 py-3 text-sm font-bold text-sky-800">Account laden</button><button onClick={createCompanyForSignedInUser} className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">Firma für Account erstellen</button>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={ShieldCheck} title="Name + Code Login" subtitle="Vorarbeiter, Monteur, Azubi oder Kunde meldet sich nur mit Name und persönlichem Code an. Mit Supabase wird vorher automatisch ein anonymer Auth-Nutzer erstellt." />
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Name" value={codeLogin.name} onChange={(v) => setCodeLogin({ ...codeLogin, name: v })} />
          <Field label="Persönlicher Code" value={codeLogin.code} onChange={(v) => setCodeLogin({ ...codeLogin, code: v.toUpperCase() })} placeholder="z. B. MON-48291" />
        </div>
        <button onClick={loginWithPersonalCode} className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Mit Name + Code anmelden</button>
        <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          Tipp: Aktiviere in Supabase zusätzlich <strong>Anonymous Sign-ins</strong>, damit Code-Nutzer ohne E-Mail technisch angemeldet werden können.
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <CopyBox title="Azubi Firmen-Code" text={company.azubiCode} />
          <CopyBox title="Kunden Firmen-Code" text={company.customerCode} />
        </div>
      </Card>
    </div>

    <Card>
      <SectionTitle icon={Wifi} title="Echte Cloud-Synchronisation" subtitle="Speichert oder lädt Firma, Verzeichnis, Aufträge, Checklisten, Aufmaß und Berichte aus Supabase. Die alte lokale Demo-Cloud bleibt zusätzlich als Backup verfügbar." />
      <div className="grid gap-3 md:grid-cols-4">
        <button onClick={() => saveAppToSupabase()} className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">In Supabase speichern</button>
        <button onClick={() => loadAppFromSupabase()} className="rounded-2xl bg-sky-100 px-4 py-3 text-sm font-bold text-sky-800">Aus Supabase laden</button>
        <button onClick={pushToCloud} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800">Lokale Demo-Cloud</button>
        <button onClick={exportBackup} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Backup erzeugen</button>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <button onClick={pullFromCloud} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800">Lokale Demo-Cloud laden</button>
        <button onClick={importBackup} className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-900">Backup importieren</button>
      </div>
      <textarea value={backupText} onChange={(e) => setBackupText(e.target.value)} placeholder="Backup JSON oder Exporttext erscheint hier ..." className="mt-4 h-56 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono outline-none" />
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">{syncLog.slice(0, 9).map((log) => <div key={log.id} className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-600"><span className="block text-slate-950">{log.action}</span>{log.timestamp} · {log.status}</div>)}</div>
    </Card>

    <Card>
      <SectionTitle icon={Settings} title="Technik & Datenbank" subtitle="Supabase ist als echter Backend-Weg vorbereitet. SQL-Datei liegt im Projekt unter supabase/company-codes-schema.sql." />
      <div className="grid gap-5 lg:grid-cols-[0.6fr_1.4fr]">
        <div className="rounded-3xl bg-slate-50 p-5"><label className="text-sm font-bold">Technik-Stack<select value={techStack} onChange={(e) => setTechStack(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option value="supabase">Supabase</option><option value="firebase">Firebase</option></select></label><div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600"><strong>Empfehlung:</strong> {techStacks[techStack].bestFor}</div></div>
        <div className="grid gap-3 md:grid-cols-3">{Object.entries(techStacks[techStack]).filter(([key]) => !["name", "bestFor", "nextSteps"].includes(key)).map(([key, value]) => <div key={key} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">{key}</p><p className="mt-1 font-black">{value}</p></div>)}</div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2"><div className="rounded-3xl bg-slate-50 p-5"><h3 className="font-black">Nächste Schritte</h3><ol className="mt-3 space-y-2">{techStacks[techStack].nextSteps.map((step, index) => <li key={step} className="rounded-2xl bg-white p-3 text-sm font-bold">{index + 1}. {step}</li>)}</ol></div><div className="rounded-3xl bg-slate-50 p-5"><h3 className="font-black">Datenbank-Tabellen</h3><div className="mt-3 grid gap-2 md:grid-cols-2">{databaseTables.map((table) => <div key={table.name} className="rounded-2xl bg-white p-3"><p className="font-black">{table.name}</p><p className="mt-1 text-xs leading-5 text-slate-500">{table.fields.join(", ")}</p></div>)}</div></div></div>
    </Card>
  </div>)}
  {active === "notes" && screen(<div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]"><Card><SectionTitle icon={Star} title="Favoriten & eigene Notizen" subtitle="Eigene Lösungen, Ersatzteilnummern oder häufige Hinweise speichern." /><TextArea label="Neue Notiz" value={favorite} onChange={setFavorite} /><button onClick={addNote} className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Notiz speichern</button></Card><Card><SectionTitle icon={PenTool} title="Gespeicherte Notizen" subtitle="Lokale Notizen im Browser." /><div className="space-y-3">{notes.map((n) => <div key={n.id} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6"><Badge>{n.module}</Badge><p className="mt-2">{n.text}</p></div>)}</div></Card></div>)}
  {active === "ki" && screen(<div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><SectionTitle icon={Sparkles} title="KI-Assistent" subtitle="Demo: erzeugt Prüfschritte zum aktiven Auftrag." /><textarea placeholder="Beispiel: Vorbaurollladen auf WDVS mit Funkmotor, worauf achten?" className="h-40 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none" /><button onClick={generateKiAnswer} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"><Sparkles size={18} />Prüfschritte vorschlagen</button>{generatedAiResponse && <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">{generatedAiResponse}</div>}</Card><Card><SectionTitle icon={Layers} title="Antwort-Struktur" subtitle="So soll die KI später antworten." /><div className="space-y-3">{["Produkt und Auftrag erkennen", "Untergrund und Sicherheit prüfen", "Werkzeug und Checkliste anzeigen", "Diagnose oder Montageablauf vorschlagen", "Protokoll/Fotos/Notizen speichern"].map((s, i) => <div key={s} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold">{i + 1}. {s}</div>)}</div></Card></div>)}
</div></div>;
}
