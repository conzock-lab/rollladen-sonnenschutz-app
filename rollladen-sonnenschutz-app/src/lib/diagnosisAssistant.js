import { diagnosisSafetyLevels, diagnosisSymptomGroups } from "../data/diagnosis.js";

export const diagnosisOrderStatuses = ["offen", "Ursache eingegrenzt", "behoben", "Ersatzteil nötig", "Fachbetrieb nötig", "Kunde informiert"];

const symptomAliases = {
  "fährt nicht": ["fahrt nicht", "geht nicht", "keine bewegung", "bewegt sich nicht", "fahrt nicht aus"],
  "fährt nur eine Richtung": ["nur hoch", "nur runter", "nicht hoch", "nicht runter", "eine richtung"],
  "läuft schief": ["schief", "einseitig", "hangt schrag"],
  "stoppt früh": ["stoppt", "bleibt stehen", "fahrt nur kurz"],
  reversiert: ["reversiert", "fahrt zuruck", "kehrt um"],
  "fährt selbstständig": ["fahrt selbst", "von allein", "unerwartet"],
  brummt: ["brummt", "summt"],
  klappert: ["klappert", "rappelt"],
  knackt: ["knackt", "knacken"],
  schleift: ["schleift", "reibt"],
  "Funk reagiert nicht": ["funk", "fernbedienung", "sender blinkt", "sender reagiert nicht"],
  "Sender verloren": ["sender verloren", "handsender weg"],
  "Taster ohne Funktion": ["taster", "schalter ohne funktion"],
  "Gateway offline": ["gateway offline", "app offline", "smart home offline"],
  klemmt: ["klemmt", "blockiert", "fest"],
  schwergängig: ["schwergangig", "schwer", "ruckelt"],
  verdreht: ["verdreht", "verwickelt"],
  "Endleiste blockiert": ["endleiste", "unten fest"],
  Frost: ["frost", "eis", "angefroren"],
  Wind: ["wind", "sturm"],
  "Sonne / Automatik": ["sonne", "automatik", "szene", "zeitplan"],
  Feuchtigkeit: ["feucht", "wasser", "regen"],
  Rollladen: ["rollladen", "rolladen", "panzer"],
  Markise: ["markise", "gelenkarm", "ausfallprofil"],
  Raffstore: ["raffstore", "jalousie", "lamellen"],
  "ZIP-Screen": ["zip screen", "zipscreen", "screen"],
  Insektenschutz: ["insektenschutz", "fliegengitter"],
  Rolltor: ["rolltor", "tor"],
};

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLocaleLowerCase("de-DE");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function recognizeDiagnosisSymptoms(text = "", context = {}, selectedSymptoms = []) {
  const contextText = [context.productName, context.productId, context.manufacturer, context.drive, context.motor, ...(context.previousDiagnoses || [])].filter(Boolean).join(" ");
  const normalized = normalizeText(`${text} ${contextText}`);
  const matched = [];
  for (const group of diagnosisSymptomGroups) {
    for (const item of group.items) {
      const terms = [item, ...(symptomAliases[item] || [])].map(normalizeText);
      if (terms.some((term) => term && normalized.includes(term))) matched.push(item);
    }
  }
  const symptoms = unique([...selectedSymptoms, ...matched]);
  const groupIds = diagnosisSymptomGroups.filter((group) => group.items.some((item) => symptoms.includes(item))).map((group) => group.id);
  return { symptoms, groupIds, matchedTerms: matched };
}

function caseSearchText(tree) {
  return normalizeText([
    tree.title,
    tree.category,
    tree.start?.q,
    tree.start?.yes,
    tree.start?.no,
    ...(tree.symptoms || []),
    ...(tree.keywords || []),
    ...(tree.productIds || []),
    ...(tree.possibleCauses || []),
  ].join(" "));
}

export function rankDiagnosisCases({ cases = [], context = {}, query = "", symptoms = [], category = "all" } = {}) {
  const normalizedQuery = normalizeText(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter((token) => token.length > 2);
  const contextProduct = normalizeText(context.productId || context.productName || "");
  const contextDrive = normalizeText(context.drive || context.motor || "");
  const contextManufacturer = normalizeText(context.manufacturer || "");
  return cases
    .filter((tree) => category === "all" || tree.category === category)
    .map((tree, index) => {
      const haystack = caseSearchText(tree);
      let score = 0;
      if (contextProduct && (tree.productIds || []).some((id) => contextProduct.includes(normalizeText(id)) || normalizeText(id).includes(contextProduct))) score += 12;
      if (contextProduct && haystack.includes(contextProduct)) score += 5;
      if (contextDrive && haystack.includes(contextDrive)) score += 4;
      if (contextManufacturer && haystack.includes(contextManufacturer)) score += 2;
      for (const symptom of symptoms) {
        const normalizedSymptom = normalizeText(symptom);
        if ((tree.symptoms || []).some((item) => normalizeText(item) === normalizedSymptom)) score += 9;
        else if (haystack.includes(normalizedSymptom)) score += 3;
      }
      for (const token of queryTokens) if (haystack.includes(token)) score += 2;
      if (normalizedQuery && normalizeText(tree.title).includes(normalizedQuery)) score += 10;
      return { tree, score, index };
    })
    .filter((entry) => !normalizedQuery && !symptoms.length ? true : entry.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ tree, score }) => ({ ...tree, matchScore: score }));
}

function sessionId(now = Date.now()) {
  if (globalThis.crypto?.randomUUID) return `DIA-${globalThis.crypto.randomUUID()}`;
  return `DIA-${now}-${Math.random().toString(16).slice(2)}`;
}

export function createDiagnosisSession(tree, context = {}, options = {}) {
  const now = options.now || new Date().toISOString();
  return {
    id: options.id || sessionId(options.timestamp),
    treeId: tree.id,
    title: tree.title,
    status: "in_progress",
    orderStatus: "offen",
    currentStep: 0,
    answers: {},
    notes: "",
    query: options.query || "",
    symptoms: unique(options.symptoms || []),
    context: {
      orderId: context.orderId || context.id || "",
      customer: context.customer || "",
      productId: context.productId || context.product?.id || context.product || "",
      productName: context.productName || context.product?.name || "",
      manufacturer: context.manufacturer || "",
      drive: context.drive || context.motor || "",
      previousDiagnoses: Array.isArray(context.previousDiagnoses) ? context.previousDiagnoses.slice(0, 5) : [],
    },
    createdAt: now,
    updatedAt: now,
    result: null,
  };
}

export function answerDiagnosisStep(session, tree, answer, options = {}) {
  const step = tree.steps?.[session.currentStep];
  if (!step) return session;
  const updatedAt = options.now || new Date().toISOString();
  const answers = { ...session.answers, [step.id]: { value: answer, answeredAt: updatedAt, stage: step.stage } };
  const stopped = step.stopOn && answer === step.stopOn;
  const nextStep = stopped ? session.currentStep : Math.min(session.currentStep + 1, tree.steps.length);
  const complete = !stopped && nextStep >= tree.steps.length;
  const nextSession = {
    ...session,
    answers,
    currentStep: nextStep,
    status: stopped ? "paused" : complete ? "completed" : "in_progress",
    updatedAt,
  };
  return { ...nextSession, result: complete || stopped ? buildDiagnosisResult(nextSession, tree) : null };
}

export function setDiagnosisStep(session, stepIndex) {
  return { ...session, currentStep: Math.max(0, Number(stepIndex) || 0), status: "in_progress", updatedAt: new Date().toISOString() };
}

export function buildDiagnosisResult(session, tree) {
  const checkedSteps = [];
  const openSteps = [];
  for (const step of tree.steps || []) {
    const value = session.answers?.[step.id]?.value;
    if (value && !["Nicht geprüft", "Nicht zutreffend"].includes(value)) checkedSteps.push(`${step.stage}: ${value}`);
    else openSteps.push(step.stage);
  }

  const safetyAnswer = session.answers?.safety?.value;
  const mechanics = session.answers?.mechanics?.value;
  const supply = session.answers?.supply?.value;
  const operation = session.answers?.operation?.value;
  const causeHints = [...(tree.possibleCauses || [])];
  if (["Auffällig", "Nein"].includes(mechanics)) causeHints.sort((a, b) => Number(/block|führung|welle|mechan|lamelle|behang/i.test(b)) - Number(/block|führung|welle|mechan|lamelle|behang/i.test(a)));
  if (supply === "Auffällig") causeHints.sort((a, b) => Number(/versorgung|anschluss|empfänger/i.test(b)) - Number(/versorgung|anschluss|empfänger/i.test(a)));
  if (operation === "Nein") causeHints.sort((a, b) => Number(/sender|kanal|bedien|funk/i.test(b)) - Number(/sender|kanal|bedien|funk/i.test(a)));

  const specific = session.answers?.specific?.value;
  const specificStep = tree.steps?.find((step) => step.id === "specific");
  const recommendation = safetyAnswer === "Nein"
    ? "Prüfung abbrechen, Anlage sichern und fachliche Unterstützung veranlassen."
    : specific === "Ja"
      ? specificStep?.yesRecommendation
      : specific === "Nein"
        ? specificStep?.noRecommendation
        : openSteps.length
          ? `Als Nächstes prüfen: ${openSteps[0]}.`
          : "Ergebnis dokumentieren, Herstellerunterlage abgleichen und sichere Funktionsprüfung durchführen.";

  const professionalRequired = safetyAnswer === "Nein" || tree.safetyLevel === diagnosisSafetyLevels.PROFESSIONAL || tree.safetyLevel === diagnosisSafetyLevels.STOP;
  const orderStatus = professionalRequired && openSteps.length ? "Fachbetrieb nötig" : openSteps.length <= 1 ? "Ursache eingegrenzt" : "offen";
  return {
    probableCause: causeHints[0] || "Ursache noch nicht ausreichend eingegrenzt",
    possibleCauses: causeHints.slice(0, 4),
    checkedSteps,
    openSteps,
    recommendation,
    orderStatus,
    safetyLevel: tree.safetyLevel,
    uncertainty: "Regelbasierte Orientierung: Ursache vor Reparatur anhand Herstellerangaben und realer Mess-/Sichtprüfung bestätigen.",
  };
}

export function buildAssistantResponse(tree, session) {
  const step = tree.steps?.[session.currentStep];
  const remaining = Math.max(0, (tree.steps?.length || 0) - session.currentStep);
  return {
    summary: `${tree.title} · ${session.context.productName || session.context.productId || tree.category}`,
    warning: tree.safetyLevel === diagnosisSafetyLevels.BASIC ? "Nur sichere Sicht- und Bedienprüfung durchführen." : `${tree.safetyLevel}. Herstellerangaben und geltende Vorschriften beachten.`,
    nextSteps: step ? [step.question, step.explanation, step.toolHint].filter(Boolean).slice(0, 3) : [],
    remaining,
  };
}

export function pauseDiagnosisSession(session) {
  return { ...session, status: "paused", updatedAt: new Date().toISOString() };
}

export function resumeDiagnosisSession(session) {
  return { ...session, status: "in_progress", updatedAt: new Date().toISOString() };
}

export function formatDiagnosisForOrder(session, tree, userName = "System") {
  const result = session.result || buildDiagnosisResult(session, tree);
  return {
    id: session.id,
    sessionId: session.id,
    treeId: tree.id,
    issue: tree.title,
    symptoms: session.symptoms,
    steps: result.checkedSteps.join("; "),
    result: `Wahrscheinlicher Bereich: ${result.probableCause}`,
    possibleCauses: result.possibleCauses,
    openSteps: result.openSteps,
    recommendation: result.recommendation,
    status: session.orderStatus || result.orderStatus,
    safetyLevel: result.safetyLevel,
    uncertainty: result.uncertainty,
    createdAt: new Date(session.createdAt).toLocaleString("de-DE"),
    updatedAt: new Date(session.updatedAt).toLocaleString("de-DE"),
    createdBy: userName,
  };
}
