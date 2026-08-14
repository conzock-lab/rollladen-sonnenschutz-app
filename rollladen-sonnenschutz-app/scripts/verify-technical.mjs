import assert from "node:assert/strict";
import { getAllowedPages } from "../src/config/navigation.js";
import { allDiagnosisTrees } from "../src/data/diagnosis.js";
import { allManufacturers } from "../src/data/manufacturers.js";
import { allMotorTypes, getMotorDiagnosisIds } from "../src/data/motors.js";
import { allPartCatalog, getPartPhotoRequirements, searchPartCandidates } from "../src/data/parts.js";
import { allProductTypes } from "../src/data/products.js";
import { buildPartRequestText, createEmptyPartRequest, PART_REQUEST_STATUSES } from "../src/lib/partsHelpers.js";
import { buildTechnicalSearchResults } from "../src/lib/technicalSearch.js";

const requiredManufacturers = ["Somfy", "Becker", "SELVE", "elero", "Cherubini", "Geiger", "Simu", "WAREMA", "ROMA", "Alulux", "heroal", "Schüco", "Reflexa", "weinor", "markilux", "Lewens", "Klaiber", "Hella"];
for (const name of requiredManufacturers) {
  assert.ok(allManufacturers.some((item) => item.name.toLocaleLowerCase("de-DE") === name.toLocaleLowerCase("de-DE")), `${name} fehlt`);
}
for (const maker of allManufacturers) {
  for (const key of ["categories", "typicalProducts", "motors", "controls", "protocols", "sensors", "smartHome", "partCategories", "diagnosisIds"]) {
    assert.ok(Array.isArray(maker[key]), `${maker.name}.${key} muss strukturiert sein`);
  }
}

for (const category of ["Rohrmotoren", "Raffstore", "Markise", "ZIP-Screen", "Rolltor", "Steuerungen", "Sensorik", "Smart Home"]) {
  assert.ok(allMotorTypes.some((item) => item.category === category), `Motorkategorie ${category} fehlt`);
}
assert.deepEqual(getMotorDiagnosisIds({ reacts: "Nein", radio: "Ja", hums: "Ja" }), ["motor-brummt", "funk-reagiert-nicht", "motor-faehrt-nicht"]);

for (const product of ["Rollladen", "Markise", "Raffstore", "ZIP-Screen", "Insektenschutz", "Rolltor"]) {
  assert.ok(allPartCatalog.some((item) => item.productCategory === product), `Ersatzteilgruppen für ${product} fehlen`);
  assert.ok(getPartPhotoRequirements(product).length >= 5, `Foto-Checkliste für ${product} ist zu kurz`);
}
const sw60Candidates = searchPartCandidates({ query: "SW60 Mitnehmer", productCategory: "Alle" });
assert.ok(sw60Candidates.some((item) => item.partCategory.includes("Adapter") || item.partCategory === "Welle"));

const technicalResults = buildTechnicalSearchResults({
  query: "Somfy Funkmotor",
  manufacturers: allManufacturers,
  motors: allMotorTypes,
  parts: allPartCatalog,
  diagnoses: allDiagnosisTrees,
  products: allProductTypes,
});
assert.ok(technicalResults.some((item) => item.type === "Hersteller" && item.label === "Somfy"));
assert.ok(technicalResults.some((item) => item.type === "Motoren"));

const order = { id: "A-TECH", customer: "Testobjekt", product: "markise", manufacturer: "Somfy", drive: "Funkmotor", address: "Interne Testadresse" };
const request = { ...createEmptyPartRequest(order), part: "Gelenkarm", errorDescription: "Arm läuft ungleichmäßig", includeAddress: false };
const requestText = buildPartRequestText(request, order, { Gesamtansicht: true });
assert.ok(requestText.includes("Gelenkarm"));
assert.ok(!requestText.includes(order.address), "Adresse darf ohne ausdrückliche Auswahl nicht in den Entwurf");
assert.ok(requestText.includes("nicht automatisch versendet"));
for (const status of ["Entwurf", "Anfrage vorbereitet", "Angefragt", "Rückfrage", "Bestellt", "Liefertermin bekannt", "Geliefert", "Verbaut", "Erledigt"]) assert.ok(PART_REQUEST_STATUSES.includes(status));

for (const role of ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"]) {
  assert.ok(getAllowedPages(role).some((item) => item.id === "technical"), `${role} muss Technik-Suche öffnen können`);
}
const customerPages = getAllowedPages("kunde").map((item) => item.id);
assert.ok(!customerPages.some((id) => ["technical", "manufacturers", "motors", "parts", "diagnose"].includes(id)));

console.log(`Technik-Prüfung erfolgreich: ${allManufacturers.length} Hersteller, ${allMotorTypes.length} Motor-/Steuerungstypen, ${allPartCatalog.length} Ersatzteilgruppen und ${allDiagnosisTrees.length} Diagnosefälle.`);
