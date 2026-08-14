import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  allQuizCards,
  learningCategories,
  learningCheckpoints,
  learningGlossary,
  learningModules,
  learningPaths,
} from "../src/data/learningModules.js";
import {
  buildPracticeReportDraft,
  calculateLearnerProgress,
  calculateModuleProgress,
  createPracticeCaseFromDiagnosis,
  createPracticeCaseFromOrder,
  getVisibleLearningTabs,
  quizModes,
  recommendLearningModules,
  recordQuizAnswer,
  selectQuizCards,
  suggestModulesForContext,
} from "../src/lib/learningSystem.js";
import { enqueueSyncItem, markQueueSynced } from "../src/lib/syncQueue.js";
import { getAllowedPages } from "../src/config/navigation.js";
import { saveLearningRecord } from "../src/services/supabaseSync.js";

const requiredModuleFields = ["id", "title", "category", "learningYear", "difficulty", "estimatedMinutes", "summary", "learningGoals", "theory", "practicalTask", "typicalMistakes", "safetyNotes", "relatedProducts", "relatedTools", "relatedDiagnostics", "relatedQuizIds", "prerequisites"];
const expectedCategories = ["Grundlagen", "Werkzeug & Material", "Untergründe & Befestigung", "Rollladen", "Markise", "Raffstore", "ZIP-Screen", "Insektenschutz", "Rolltor", "Motoren & Steuerungen", "Funk & Sensorik", "Fehlerdiagnose", "Aufmaß", "Wartung", "Normen & Dokumentation", "Kundenkommunikation"];

assert.ok(learningModules.length >= 50, "Der Lernkatalog muss deutlich erweitert sein");
assert.ok(allQuizCards.length >= 30, "Bestehende und neue Quizfragen müssen gemeinsam verfügbar sein");
assert.deepEqual(new Set(learningPaths.map((path) => path.year)), new Set([1, 2, 3, 4]));
assert.ok([1, 2, 3, 4].every((year) => learningModules.some((module) => module.year === year)), "Alle vier Ausbildungsjahre benötigen Module");
assert.ok(expectedCategories.every((category) => learningCategories.includes(category) || learningModules.some((module) => module.category === category)), "Die fachlichen Lernbereiche sind nicht vollständig");
assert.ok(learningCheckpoints.some((item) => item.id === "selfPerformed"));
assert.ok(learningCheckpoints.some((item) => item.id === "secure" && item.optional));
assert.ok(learningGlossary.length >= 10 && learningGlossary.every((item) => item.name && item.explanation && item.category));

for (const module of learningModules) {
  for (const field of requiredModuleFields) assert.notEqual(module[field], undefined, `${module.id}: ${field} fehlt`);
  assert.ok(module.learningGoals.length >= 2, `${module.id}: Lernziele fehlen`);
  assert.ok(module.typicalMistakes.length >= 1, `${module.id}: typische Fehler fehlen`);
  assert.ok(module.relatedQuizIds.length >= 1, `${module.id}: Quiz-Verknüpfung fehlt`);
}

const learnerId = "P-AZUBI";
const module = learningModules.find((item) => item.year === 1);
let progress = { [learnerId]: { [module.id]: {} } };
assert.equal(calculateModuleProgress(module, progress[learnerId][module.id]).status, "Neu");
progress[learnerId][module.id] = Object.fromEntries(module.requiredCheckpoints.map((id) => [id, true]));
assert.equal(calculateModuleProgress(module, progress[learnerId][module.id]).status, "In Arbeit", "100 % Checkmarks allein dürfen keine Qualifikation behaupten");
progress[learnerId][module.id].secure = true;
assert.equal(calculateModuleProgress(module, progress[learnerId][module.id]).status, "Sicher");
assert.deepEqual(JSON.parse(JSON.stringify(progress)), progress, "Lernfortschritt muss localStorage-kompatibel sein");

let quizProgress = {};
const wrongCard = allQuizCards[0];
quizProgress = recordQuizAnswer(quizProgress, learnerId, wrongCard, false, "2026-08-14T10:00:00.000Z");
quizProgress = recordQuizAnswer(quizProgress, learnerId, wrongCard, true, "2026-08-14T10:05:00.000Z");
assert.equal(quizProgress[learnerId].questions[wrongCard.id].wrongCount, 1);
assert.equal(quizProgress[learnerId].questions[wrongCard.id].lastStatus, "correct");
assert.ok(selectQuizCards({ learnerId, mode: "repeat", quizProgress }).some((card) => card.id === wrongCard.id), "Falsche Frage muss wiederholbar sein");
assert.deepEqual(new Set(quizModes.map((mode) => mode.id)), new Set(["quick", "module", "repeat", "exam", "daily"]));
assert.equal(selectQuizCards({ learnerId, mode: "quick", quizProgress }).length, 5);
assert.equal(selectQuizCards({ learnerId, mode: "exam", quizProgress }).length, 20);
assert.ok(selectQuizCards({ learnerId, mode: "module", moduleId: module.id, quizProgress }).length > 0, "Jedes Modul benötigt einen Wissenstest");

const order = { id: "A-LERN", customer: "Privatkunde Geheim", address: "Geheime Straße 7", product: "markise", productName: "Markise", orderType: "Montage", substrate: "Beton", drive: "Funkmotor", manufacturer: "Beispielhersteller", notes: "Konsolen montieren" };
const orderCase = createPracticeCaseFromOrder(order, learnerId, "Markise", learningModules, { id: "PRAXIS-ORDER", now: "2026-08-14T11:00:00.000Z" });
assert.equal(orderCase.sourceId, order.id);
assert.doesNotMatch(JSON.stringify(orderCase), /Privatkunde Geheim|Geheime Straße 7/, "Praxisfall darf keine unnötigen Kundendaten kopieren");
assert.ok(orderCase.moduleIds.length > 0, "Auftragskontext muss Module vorschlagen");
assert.ok(suggestModulesForContext(order).some((item) => ["Markise", "Untergründe & Befestigung", "Funk & Sensorik"].includes(item.category)));

const diagnosisSession = { id: "DIA-LERN", context: { productId: "vorbaurollladen", productName: "Rollladen", drive: "Funkmotor", customer: "Nicht übernehmen" }, symptoms: ["Sender reagiert nicht"], result: { checkedSteps: ["Batterie geprüft"], probableCause: "Funkweg", openSteps: ["Empfänger prüfen"] } };
const diagnosisTree = { id: "funk-reagiert-nicht", title: "Funk reagiert nicht", requiredTools: ["Prüfsender"] };
const diagnosisCase = createPracticeCaseFromDiagnosis(diagnosisSession, diagnosisTree, learnerId, learningModules, { id: "PRAXIS-DIA", now: "2026-08-14T12:00:00.000Z" });
assert.equal(diagnosisCase.sourceType, "diagnosis");
assert.doesNotMatch(JSON.stringify(diagnosisCase), /Nicht übernehmen/);
assert.match(buildPracticeReportDraft(orderCase), /Diesen Entwurf habe ich geprüft/);

const recommendations = recommendLearningModules({ learnerId, year: 2, progress, quizProgress, practiceCases: [orderCase], orders: [order] });
assert.ok(recommendations.length > 0 && recommendations.every((item) => item.module && item.reason));
const learnerSummary = calculateLearnerProgress({ learnerId, year: 2, progress, quizProgress, practiceCases: [orderCase] });
assert.ok(learnerSummary.overall >= 0 && learnerSummary.overall <= 100);

assert.equal(getVisibleLearningTabs("kunde").length, 0);
assert.ok(getVisibleLearningTabs("azubi").some((tab) => tab.id === "reports"));
assert.ok(getVisibleLearningTabs("meister", true).some((tab) => tab.id === "progress"));
assert.equal(getAllowedPages("kunde").some((page) => ["learning", "quiz", "reportBook", "azubiPlan"].includes(page.id)), false);
assert.ok(getAllowedPages("monteur").some((page) => page.id === "learning"));

let offlineQueue = enqueueSyncItem([], "Quizantwort gespeichert", { learnerId, questionId: wrongCard.id }, true);
offlineQueue = enqueueSyncItem(offlineQueue, "Praxisfall gespeichert", { learnerId, recordId: orderCase.id }, true);
assert.ok(offlineQueue.every((item) => item.status === "pending" && item.queuedOffline));
assert.deepEqual(new Set(offlineQueue.map((item) => item.type)), new Set(["quizProgress", "practiceCase"]));
offlineQueue = markQueueSynced(offlineQueue, offlineQueue.map((item) => item.id));
assert.ok(offlineQueue.every((item) => item.status === "synced"), "Queue muss nach erfolgreichem Sync enden");

const cloudCalls = [];
const learningClient = {
  auth: { getUser: async () => ({ data: { user: { id: "auth-azubi" } }, error: null }) },
  from(table) { return { upsert: async (data) => { cloudCalls.push({ table, data }); return { error: null }; } }; },
};
await saveLearningRecord({ client: learningClient, learningRow: { company_id: "firma", person_id: learnerId, data: { quizProgress: quizProgress[learnerId] } }, timeoutMs: 100 });
assert.equal(cloudCalls[0].table, "learning_records");
assert.equal(cloudCalls[0].data.updated_by, "auth-azubi");

const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const pageSource = await readFile(new URL("../src/pages/LearningPage.jsx", import.meta.url), "utf8");
const practiceSource = await readFile(new URL("../src/components/learning/LearningPracticeCases.jsx", import.meta.url), "utf8");
const quizSource = await readFile(new URL("../src/components/learning/LearningQuiz.jsx", import.meta.url), "utf8");
const diagnosisResultSource = await readFile(new URL("../src/components/diagnosis/DiagnosisResult.jsx", import.meta.url), "utf8");
const migrationSource = await readFile(new URL("../supabase/20260814_learning_records.sql", import.meta.url), "utf8");
assert.match(appSource, /learningPracticeCases/);
assert.match(appSource, /learningAssignments/);
assert.match(appSource, /learningComments/);
assert.match(appSource, /quizProgress/);
assert.match(appSource, /learningLists/);
assert.match(appSource, /reviewLearningReport/);
assert.match(pageSource, /overflow-x-auto|LearningTabs/);
assert.match(pageSource, /grid-cols-5/);
assert.match(practiceSource, /keine Kundenadresse und kein Kundenname/);
assert.match(quizSource, /eine kurze ErklÃ¤rung|eine kurze Erklärung/);
assert.match(diagnosisResultSource, /Als Lernfall speichern/);
assert.match(migrationSource, /create table if not exists public\.learning_records/);
assert.match(migrationSource, /enable row level security/);
assert.doesNotMatch(migrationSource, /drop table|truncate|delete from/i);

console.log(`Lernsystem-Prüfung erfolgreich: ${learningModules.length} Module, ${allQuizCards.length} Quizfragen, 4 Lernpfade, Offline-Queue und Rollen geprüft.`);
