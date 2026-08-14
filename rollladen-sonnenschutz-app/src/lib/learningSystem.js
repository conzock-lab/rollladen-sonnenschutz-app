import { allQuizCards, isLearningModuleComplete, learningModules } from "../data/learningModules.js";

export const learningTabs = [
  { id: "overview", label: "Übersicht" },
  { id: "path", label: "Lernpfad" },
  { id: "modules", label: "Module" },
  { id: "practice", label: "Praxisfälle" },
  { id: "quiz", label: "Quiz" },
  { id: "exam", label: "Prüfung" },
  { id: "reports", label: "Berichtsheft" },
  { id: "progress", label: "Fortschritt" },
];

export const quizModes = [
  { id: "quick", label: "Schnelltest", count: 5 },
  { id: "module", label: "Lernmodul-Test", count: 10 },
  { id: "repeat", label: "Fehler wiederholen", count: 10 },
  { id: "exam", label: "Prüfungstraining", count: 20 },
  { id: "daily", label: "Tagesquiz", count: 7 },
];

export function clampLearningYear(value) {
  return Math.max(1, Math.min(4, Number(value) || 1));
}

export function getVisibleLearningTabs(role, canViewTeam = false) {
  if (role === "kunde") return [];
  if (canViewTeam || role === "dev") return learningTabs;
  if (role === "azubi") return learningTabs;
  return learningTabs.filter((tab) => !["reports"].includes(tab.id));
}

export function getModuleRequiredCheckpoints(module) {
  return module.requiredCheckpoints || ["read", "understood", "practiceSeen", "selfPerformed", "masterAsked"];
}

export function calculateModuleProgress(module, record = {}) {
  const required = getModuleRequiredCheckpoints(module);
  const completed = required.filter((id) => Boolean(record[id])).length;
  const percent = required.length ? Math.round((completed / required.length) * 100) : 0;
  const status = percent === 0 ? "Neu" : percent === 100 && (record.secure || record.quizPassed || record.masterApproved) ? "Sicher" : "In Arbeit";
  return { completed, total: required.length, percent, status };
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("de-DE");
}

function dateValue(value) {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

export function getQuizQuestionRecord(quizProgress = {}, learnerId, questionId) {
  return quizProgress?.[learnerId]?.questions?.[questionId] || {};
}

export function recordQuizAnswer(quizProgress = {}, learnerId, card, correct, now = new Date().toISOString()) {
  const learner = quizProgress?.[learnerId] || {};
  const previous = learner.questions?.[card.id] || {};
  return {
    ...quizProgress,
    [learnerId]: {
      ...learner,
      questions: {
        ...(learner.questions || {}),
        [card.id]: {
          questionId: card.id,
          category: card.category || card.t,
          wrongCount: Number(previous.wrongCount || 0) + (correct ? 0 : 1),
          correctCount: Number(previous.correctCount || 0) + (correct ? 1 : 0),
          lastAttempt: now,
          lastStatus: correct ? "correct" : "wrong",
        },
      },
      totalAnswers: Number(learner.totalAnswers || 0) + 1,
      correctAnswers: Number(learner.correctAnswers || 0) + (correct ? 1 : 0),
      updatedAt: now,
    },
  };
}

function deterministicOrder(cards, seed = "daily") {
  return [...cards].sort((left, right) => `${seed}:${left.id}`.localeCompare(`${seed}:${right.id}`));
}

export function selectQuizCards({ cards = allQuizCards, learnerId = "local", mode = "quick", moduleId = "", quizProgress = {}, count } = {}) {
  const modeDefinition = quizModes.find((item) => item.id === mode) || quizModes[0];
  const limit = count || modeDefinition.count;
  const learnerQuestions = quizProgress?.[learnerId]?.questions || {};
  let selected = cards;
  if (mode === "module" && moduleId) {
    const module = learningModules.find((item) => item.id === moduleId);
    const relatedQuizIds = new Set(module?.relatedQuizIds || []);
    selected = cards.filter((card) => card.moduleIds?.includes(moduleId) || relatedQuizIds.has(card.id));
  }
  if (mode === "repeat") selected = cards.filter((card) => Number(learnerQuestions[card.id]?.wrongCount || 0) > 0).sort((left, right) => Number(learnerQuestions[right.id]?.wrongCount || 0) - Number(learnerQuestions[left.id]?.wrongCount || 0));
  if (mode === "daily") selected = deterministicOrder(cards, new Date().toISOString().slice(0, 10));
  if (mode === "exam") selected = deterministicOrder(cards, `exam:${learnerId}`);
  if (mode === "quick") selected = deterministicOrder(cards, `quick:${learnerId}:${quizProgress?.[learnerId]?.totalAnswers || 0}`);
  return selected.slice(0, limit);
}

export function summarizeQuizAnswers(answers = []) {
  const byCategory = {};
  for (const answer of answers) {
    const category = answer.category || "Allgemein";
    byCategory[category] ||= { correct: 0, total: 0 };
    byCategory[category].total += 1;
    if (answer.correct) byCategory[category].correct += 1;
  }
  const categories = Object.entries(byCategory).map(([category, values]) => ({ category, ...values, percent: Math.round((values.correct / values.total) * 100) })).sort((left, right) => right.percent - left.percent);
  return {
    correct: answers.filter((answer) => answer.correct).length,
    total: answers.length,
    percent: answers.length ? Math.round((answers.filter((answer) => answer.correct).length / answers.length) * 100) : 0,
    strongest: categories.slice(0, 3),
    weakest: [...categories].sort((left, right) => left.percent - right.percent).slice(0, 3),
  };
}

function moduleSearchText(module) {
  return normalize([module.title, module.category, module.summary, module.practicalTask, ...(module.learningGoals || []), ...(module.typicalMistakes || []), ...(module.relatedProducts || []), ...(module.relatedTools || []), ...(module.relatedDiagnostics || [])].join(" "));
}

export function suggestModulesForContext(context = {}, modules = learningModules) {
  const terms = [context.productId, context.product, context.productName, context.substrate, context.drive, context.motor, context.manufacturer, context.orderType, ...(context.diagnosisIds || []), ...(context.symptoms || [])].map(normalize).filter(Boolean);
  return modules.map((module) => ({ module, score: terms.reduce((score, term) => score + (moduleSearchText(module).includes(term) ? 3 : 0), 0) })).filter((entry) => entry.score > 0).sort((left, right) => right.score - left.score).slice(0, 6).map((entry) => entry.module);
}

export function createPracticeCaseFromOrder(order, learnerId, productName = "", modules = learningModules, options = {}) {
  const suggested = suggestModulesForContext({ ...order, productId: order.product, productName }, modules);
  const now = options.now || new Date().toISOString();
  return {
    id: options.id || `PRAXIS-${Date.now()}`,
    learnerId,
    sourceType: "order",
    sourceId: order.id,
    title: `${productName || order.product || "Anlage"} · ${order.orderType || "Praxisauftrag"}`,
    task: order.orderType || "Arbeiten am Sonnenschutzsystem",
    initialSituation: [productName || order.product, order.substrate, order.drive, order.manufacturer].filter(Boolean).join(" · "),
    approach: "",
    tools: [],
    learned: "",
    difficult: "",
    openQuestion: "",
    moduleIds: suggested.map((module) => module.id),
    technicalContext: {
      productId: order.product || "",
      orderType: order.orderType || "",
      substrate: order.substrate || "",
      drive: order.drive || "",
      manufacturer: order.manufacturer || "",
      diagnosisAreas: (order.diagnoses || []).map((entry) => entry.treeId || entry.issue).filter(Boolean).slice(0, 5),
      activities: [order.notes, order.technicianNote].filter(Boolean).map((text) => String(text).slice(0, 240)),
    },
    status: "Entwurf",
    createdAt: now,
    updatedAt: now,
  };
}

export function createPracticeCaseFromDiagnosis(session, tree, learnerId, modules = learningModules, options = {}) {
  const result = session.result || {};
  const suggested = suggestModulesForContext({ productId: session.context?.productId, drive: session.context?.drive, diagnosisIds: [tree.id], symptoms: session.symptoms }, modules);
  const now = options.now || new Date().toISOString();
  return {
    id: options.id || `PRAXIS-DIA-${Date.now()}`,
    learnerId,
    sourceType: "diagnosis",
    sourceId: session.id,
    title: `Diagnose-Lernfall · ${tree.title}`,
    task: tree.title,
    initialSituation: [session.context?.productName || session.context?.productId, session.context?.drive, ...(session.symptoms || [])].filter(Boolean).join(" · "),
    approach: result.checkedSteps?.join("; ") || "",
    tools: tree.requiredTools || [],
    learned: result.probableCause ? `Der wahrscheinliche Fehlerbereich wurde auf „${result.probableCause}“ eingegrenzt. Die Ursache muss vor einer Reparatur fachlich bestätigt werden.` : "",
    difficult: "",
    openQuestion: result.openSteps?.length ? `Noch offen: ${result.openSteps.join(", ")}` : "",
    moduleIds: suggested.map((module) => module.id),
    technicalContext: { productId: session.context?.productId || "", drive: session.context?.drive || "", diagnosisId: tree.id, symptoms: session.symptoms || [], checkedSteps: result.checkedSteps || [], result: result.probableCause || "" },
    status: "Entwurf",
    createdAt: now,
    updatedAt: now,
  };
}

export function buildPracticeReportDraft(practiceCase, modules = learningModules) {
  const moduleTitles = (practiceCase.moduleIds || []).map((id) => modules.find((module) => module.id === id)?.title).filter(Boolean);
  return [
    `Praxisfall: ${practiceCase.title}.`,
    practiceCase.initialSituation ? `Ausgangslage: ${practiceCase.initialSituation}.` : "",
    practiceCase.approach ? `Mein Vorgehen: ${practiceCase.approach}.` : "",
    practiceCase.tools?.length ? `Verwendete Werkzeuge: ${practiceCase.tools.join(", ")}.` : "",
    practiceCase.learned ? `Gelernt: ${practiceCase.learned}.` : "",
    moduleTitles.length ? `Bearbeitete Lernmodule: ${moduleTitles.join(", ")}.` : "",
    "Diesen Entwurf habe ich geprüft und in eigenen Worten ergänzt.",
  ].filter(Boolean).join("\n");
}

export function recommendLearningModules({ learnerId, year = 1, progress = {}, quizProgress = {}, practiceCases = [], reports = [], orders = [], modules = learningModules } = {}) {
  const learnerProgress = progress?.[learnerId] || {};
  const questionProgress = quizProgress?.[learnerId]?.questions || {};
  const wrongModuleScores = {};
  for (const card of allQuizCards) {
    const wrongCount = Number(questionProgress[card.id]?.wrongCount || 0);
    for (const moduleId of card.moduleIds || []) wrongModuleScores[moduleId] = (wrongModuleScores[moduleId] || 0) + wrongCount * 5;
  }
  const orderSuggestions = orders.flatMap((order) => suggestModulesForContext({ ...order, productId: order.product }, modules).slice(0, 3).map((module) => module.id));
  const practiceModuleIds = practiceCases.filter((item) => item.learnerId === learnerId).flatMap((item) => item.moduleIds || []);
  const hasOpenReport = reports.some((report) => (report.createdBy === learnerId || !report.createdBy) && !["Freigegeben", "freigegeben"].includes(report.status));
  return modules
    .filter((module) => module.year <= clampLearningYear(year) + 1 && !isLearningModuleComplete(learnerProgress[module.id], module))
    .map((module) => {
      let score = module.year <= year ? 10 : 2;
      const reasons = [];
      if (wrongModuleScores[module.id]) { score += wrongModuleScores[module.id]; reasons.push("Quiz-Wiederholung"); }
      if (orderSuggestions.includes(module.id)) { score += 7; reasons.push("passend zum Auftrag"); }
      if (practiceModuleIds.includes(module.id)) { score += 3; reasons.push("Praxisfall ergänzen"); }
      if (hasOpenReport && ["Normen & Dokumentation", "Grundlagen"].includes(module.category)) { score += 2; reasons.push("Berichtsheft offen"); }
      const missingPrerequisites = (module.prerequisites || []).filter((id) => !isLearningModuleComplete(learnerProgress[id], modules.find((item) => item.id === id)));
      if (missingPrerequisites.length) reasons.push("Voraussetzung empfohlen");
      return { module, score, reason: reasons[0] || "nächster offener Lernschritt", missingPrerequisites };
    })
    .sort((left, right) => right.score - left.score || left.module.year - right.module.year)
    .slice(0, 6);
}

export function calculateCategoryProgress(modules = learningModules, progress = {}) {
  const categories = [...new Set(modules.map((module) => module.category))];
  return categories.map((category) => {
    const categoryModules = modules.filter((module) => module.category === category);
    const percent = categoryModules.length ? Math.round(categoryModules.reduce((sum, module) => sum + calculateModuleProgress(module, progress[module.id]).percent, 0) / categoryModules.length) : 0;
    return { category, percent, moduleCount: categoryModules.length };
  }).sort((left, right) => right.percent - left.percent);
}

export function calculateLearnerProgress({ learnerId, year, progress = {}, quizProgress = {}, practiceCases = [], modules = learningModules } = {}) {
  const curriculum = modules.filter((module) => module.year <= clampLearningYear(year));
  const modulePercent = curriculum.length ? Math.round(curriculum.reduce((sum, module) => sum + calculateModuleProgress(module, progress?.[learnerId]?.[module.id]).percent, 0) / curriculum.length) : 0;
  const quiz = quizProgress?.[learnerId] || {};
  const quizPercent = quiz.totalAnswers ? Math.round((Number(quiz.correctAnswers || 0) / quiz.totalAnswers) * 100) : 0;
  const learnerCases = practiceCases.filter((item) => item.learnerId === learnerId);
  const documentedCases = learnerCases.filter((item) => item.status !== "Entwurf" && (item.learned || item.approach)).length;
  const practicePercent = learnerCases.length ? Math.round((documentedCases / learnerCases.length) * 100) : 0;
  const overall = Math.round(modulePercent * 0.7 + quizPercent * 0.15 + practicePercent * 0.15);
  return { overall, modulePercent, quizPercent, practicePercent, completedModules: curriculum.filter((module) => isLearningModuleComplete(progress?.[learnerId]?.[module.id], module)).length, totalModules: curriculum.length, quizAnswers: Number(quiz.totalAnswers || 0), practiceCases: learnerCases.length };
}

export function getLearningWeekStats({ learnerId, progress = {}, quizProgress = {}, practiceCases = [], reports = [], now = Date.now() } = {}) {
  const since = now - 7 * 24 * 60 * 60 * 1000;
  const learnerProgress = progress?.[learnerId] || {};
  const completedModules = Object.values(learnerProgress).filter((record) => record.updatedAt && dateValue(record.updatedAt) >= since && record.secure).length;
  const cases = practiceCases.filter((item) => item.learnerId === learnerId && dateValue(item.updatedAt || item.createdAt) >= since).length;
  const openReports = reports.filter((report) => (report.createdBy === learnerId || !report.createdBy) && !["Freigegeben", "freigegeben"].includes(report.status)).length;
  const learnerQuiz = quizProgress?.[learnerId] || {};
  const quizAnswers = Object.values(learnerQuiz.questions || {}).filter((record) => dateValue(record.lastAttempt) >= since).reduce((sum, record) => sum + Number(record.correctCount || 0) + Number(record.wrongCount || 0), 0);
  const learningDays = new Set([
    ...Object.values(learnerProgress).map((record) => record.updatedAt),
    ...Object.values(learnerQuiz.questions || {}).map((record) => record.lastAttempt),
    ...practiceCases.filter((item) => item.learnerId === learnerId).map((item) => item.updatedAt || item.createdAt),
  ].filter((value) => dateValue(value) >= since).map((value) => new Date(value).toISOString().slice(0, 10))).size;
  return { completedModules, practiceCases: cases, openReports, quizAnswers, learningDays };
}
