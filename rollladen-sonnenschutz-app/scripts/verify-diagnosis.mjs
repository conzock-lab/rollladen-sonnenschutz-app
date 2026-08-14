import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { allDiagnosisTrees, diagnosisSymptomGroups } from "../src/data/diagnosis.js";
import {
  answerDiagnosisStep,
  buildDiagnosisResult,
  createDiagnosisSession,
  pauseDiagnosisSession,
  rankDiagnosisCases,
  recognizeDiagnosisSymptoms,
  resumeDiagnosisSession,
} from "../src/lib/diagnosisAssistant.js";
import { createSyncQueueItem } from "../src/lib/syncQueue.js";
import { getAllowedPages } from "../src/config/navigation.js";

const originalIds = [
  "motor-faehrt-nicht", "motor-brummt", "rollladen-schief", "funk-reagiert-nicht", "markise-stoppt", "zipscreen-klemmt", "raffstore-wendet-falsch", "sensorik-falsch",
  "rollladen-klemmt-unten", "frost-problem", "gurt-schwer", "sender-verloren", "markise-schliesst-schief", "raffstore-klappert", "rolltor-reversiert", "insektenschutz-klemmt",
  "gateway-offline", "motor-eine-richtung", "anlage-faehrt-selbst",
];

assert.equal(allDiagnosisTrees.length, 19, "Alle 19 bestehenden Diagnosefälle müssen erhalten bleiben");
assert.deepEqual(new Set(allDiagnosisTrees.map((tree) => tree.id)), new Set(originalIds));
assert.ok(diagnosisSymptomGroups.length >= 6);
assert.equal(getAllowedPages("kunde").some((page) => page.id === "diagnose"), false, "Kunden dürfen den internen Diagnosebereich nicht öffnen");

for (const tree of allDiagnosisTrees) {
  for (const field of ["productCategories", "manufacturerIds", "motorCategories", "symptoms", "keywords", "requiredTools", "steps", "possibleCauses", "relatedParts", "relatedDiagnostics", "learningTargets", "knowledgeTargets"]) {
    assert.ok(Array.isArray(tree[field]), `${tree.id}: ${field} muss eine Liste sein`);
  }
  assert.ok(tree.steps.length >= 5, `${tree.id}: geführter Ablauf ist zu kurz`);
  assert.ok(tree.steps.every((step) => step.id && step.stage && step.question && Array.isArray(step.answerOptions) && step.answerOptions.length >= 2), `${tree.id}: Prüfschritte sind unvollständig`);
  assert.ok(tree.safetyLevel, `${tree.id}: Sicherheitsstufe fehlt`);
}

const examples = [
  { text: "Rollladen fährt nur hoch", productId: "vorbaurollladen", expected: "motor-eine-richtung" },
  { text: "Markise brummt und fährt nicht aus", productId: "markise", expected: "motor-brummt" },
  { text: "Funk reagiert nicht, Sender blinkt", productId: "vorbaurollladen", expected: "funk-reagiert-nicht" },
  { text: "Raffstore fährt hoch, aber nicht runter", productId: "raffstore", expected: "motor-eine-richtung" },
];

for (const example of examples) {
  const context = { productId: example.productId };
  const recognized = recognizeDiagnosisSymptoms(example.text, context);
  const ranked = rankDiagnosisCases({ cases: allDiagnosisTrees, context, query: example.text, symptoms: recognized.symptoms });
  assert.ok(ranked.slice(0, 3).some((tree) => tree.id === example.expected), `${example.text}: erwarteter Prüffall fehlt in den ersten drei Vorschlägen`);
}

const flowIds = ["motor-faehrt-nicht", "rollladen-schief", "funk-reagiert-nicht", "markise-stoppt", "rolltor-reversiert"];
for (const id of flowIds) {
  const tree = allDiagnosisTrees.find((item) => item.id === id);
  let session = createDiagnosisSession(tree, { orderId: "A-TEST", productId: tree.productIds[0], manufacturer: "Testhersteller", drive: "Testantrieb" }, { id: `TEST-${id}`, now: "2026-08-14T10:00:00.000Z" });
  while (session.currentStep < tree.steps.length) {
    const step = tree.steps[session.currentStep];
    const answer = step.answerOptions.includes("Ja") ? "Ja" : step.answerOptions[0];
    session = answerDiagnosisStep(session, tree, answer, { now: "2026-08-14T10:01:00.000Z" });
  }
  const result = session.result || buildDiagnosisResult(session, tree);
  assert.equal(session.status, "completed", `${id}: Ablauf muss abschließen`);
  assert.ok(result.probableCause && result.recommendation && result.uncertainty, `${id}: Ergebnis ist unvollständig`);
  assert.ok(result.checkedSteps.length >= 5, `${id}: automatische Checkmarks fehlen`);
  assert.notEqual(result.orderStatus, "behoben", `${id}: darf nicht automatisch als behoben gelten`);
}

const resumableTree = allDiagnosisTrees[0];
let resumable = createDiagnosisSession(resumableTree, { orderId: "A-OFFLINE" }, { id: "TEST-PAUSE", now: "2026-08-14T11:00:00.000Z" });
resumable = answerDiagnosisStep(resumable, resumableTree, "Ja", { now: "2026-08-14T11:01:00.000Z" });
const serialized = JSON.parse(JSON.stringify(pauseDiagnosisSession(resumable)));
const resumed = resumeDiagnosisSession(serialized);
assert.equal(resumed.currentStep, 1, "Pausierter Fortschritt muss fortsetzbar bleiben");
assert.equal(resumed.answers.safety.value, "Ja");

const queueItem = createSyncQueueItem("Diagnose-Zwischenstand gespeichert", { recordId: resumed.id, orderId: "A-OFFLINE" }, true);
assert.equal(queueItem.type, "diagnosis");
assert.equal(queueItem.status, "pending");
assert.equal(queueItem.queuedOffline, true);

const pageSource = await readFile(new URL("../src/pages/DiagnosisPage.jsx", import.meta.url), "utf8");
const resultSource = await readFile(new URL("../src/components/diagnosis/DiagnosisResult.jsx", import.meta.url), "utf8");
assert.match(pageSource, /DiagnosisWizard/);
assert.match(pageSource, /DiagnosisHistory/);
assert.match(resultSource, /Ersatzteil-Anfrage/);
assert.match(resultSource, /Motor-Assistent/);
assert.doesNotMatch(`${pageSource}\n${resultSource}`, /fetch\(|api[_-]?key|openai/i, "Diagnose darf keinen externen Dienst oder API-Key benötigen");

console.log(`Diagnoseprüfung erfolgreich: ${allDiagnosisTrees.length} Fälle, ${flowIds.length} vollständige Abläufe, ${examples.length} Texteingaben.`);
