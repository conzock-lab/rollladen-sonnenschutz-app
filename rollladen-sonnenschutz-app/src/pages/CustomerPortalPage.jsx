import React, { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FileText,
  MapPin,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import CopyBox from "../components/CopyBox";
import SectionTitle from "../components/SectionHeader";
import { allMaintenanceTips } from "../data/maintenance";
import { allProductTypes } from "../data/products";

const appointmentTime = (order) => {
  const value = new Date(`${order.date || "1970-01-01"}T${order.time || "00:00"}`);
  return Number.isNaN(value.getTime()) ? 0 : value.getTime();
};

const productName = (productId) => allProductTypes.find((product) => product.id === productId)?.name || "Produkt nicht angegeben";

const contactPerson = (order) => {
  if (order.contactPerson) return order.contactPerson;
  const firstAssignedPerson = String(order.assignedTo || "").split(",").map((name) => name.trim()).filter(Boolean)[0];
  return firstAssignedPerson || "Ihr Kundenservice";
};

const documentLabel = (document) => document.status || "bereitgestellt";

export default function CustomerPortalPage({
  currentCustomerOrders = [],
  customerDocuments = [],
  confirmCustomerAppointment,
  initialSection = "portal",
  openCustomerOrder,
}) {
  const sortedOrders = useMemo(
    () => {
      const now = Date.now();
      return [...currentCustomerOrders].sort((left, right) => {
        const leftTime = appointmentTime(left);
        const rightTime = appointmentTime(right);
        const leftIsPast = leftTime < now;
        const rightIsPast = rightTime < now;
        return leftIsPast === rightIsPast ? leftTime - rightTime : leftIsPast ? 1 : -1;
      });
    },
    [currentCustomerOrders],
  );
  const [openCareOrderId, setOpenCareOrderId] = useState("");
  const [questionOrderId, setQuestionOrderId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [preparedQuestion, setPreparedQuestion] = useState("");

  const nextOrder = sortedOrders.find((order) => appointmentTime(order) >= Date.now());
  const confirmedCount = currentCustomerOrders.filter((order) => order.customerConfirmed).length;
  const sectionHeading = {
    customerDocuments: ["Meine Dokumente", "Freigegebene PDFs und Dokumentstatus nach Auftrag."],
    customerCare: ["Pflegehinweise", "Passende Hinweise zu Ihren Produkten und Anlagen."],
    customerContact: ["Kontakt & Rückfrage", "Eine Rückfrage vorbereiten, ohne dass automatisch etwas versendet wird."],
    portal: ["Meine Termine & Aufträge", "Ihre persönliche Übersicht – ohne interne Notizen, Teamdaten oder Verwaltungsbereiche."],
  }[initialSection] || ["Meine Termine & Aufträge", "Ihre persönliche Übersicht."];

  useEffect(() => {
    const firstOrder = nextOrder || sortedOrders[0];
    if (!firstOrder) return;
    if (initialSection === "customerCare") setOpenCareOrderId(firstOrder.id);
    if (initialSection === "customerContact") setQuestionOrderId(firstOrder.id);
  }, [initialSection, nextOrder?.id, sortedOrders[0]?.id]);

  const prepareQuestion = (order) => {
    const question = questionText.trim();
    if (!question) return;
    setPreparedQuestion([
      "Guten Tag,",
      "",
      `ich habe eine Rückfrage zu meinem Auftrag ${order.id} (${productName(order.product)}).`,
      `Termin: ${order.date || "noch offen"}${order.time ? ` um ${order.time} Uhr` : ""}`,
      `Meine Rückfrage: ${question}`,
      "",
      "Bitte melden Sie sich bei mir. Vielen Dank.",
    ].join("\n"));
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle
          icon={BriefcaseBusiness}
          title={sectionHeading[0]}
          subtitle={sectionHeading[1]}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-3xl font-black">{currentCustomerOrders.length}</p>
            <p className="text-sm text-slate-600">Aufträge</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-4">
            <p className="text-3xl font-black text-emerald-900">{confirmedCount}</p>
            <p className="text-sm text-emerald-800">Termine bestätigt</p>
          </div>
          <div className="rounded-3xl bg-sky-50 p-4">
            <p className="text-3xl font-black text-sky-900">{customerDocuments.length}</p>
            <p className="text-sm text-sky-800">Dokumente</p>
          </div>
        </div>
        {nextOrder && (
          <button
            type="button"
            onClick={() => openCustomerOrder(nextOrder)}
            className="mt-4 flex w-full items-center justify-between gap-4 rounded-3xl bg-slate-950 p-4 text-left text-white"
          >
            <span>
              <span className="block text-xs font-bold uppercase text-white/60">Nächster Termin</span>
              <span className="mt-1 block font-black">{nextOrder.date || "Termin offen"} {nextOrder.time || ""} · {productName(nextOrder.product)}</span>
            </span>
            <CalendarDays className="shrink-0" />
          </button>
        )}
      </Card>

      <div className="space-y-4">
        {sortedOrders.map((order) => {
          const documents = customerDocuments.filter((document) => document.orderId === order.id);
          const careTips = allMaintenanceTips.filter((tip) => tip.productIds?.includes(order.product));
          const careOpen = openCareOrderId === order.id;
          const questionOpen = questionOrderId === order.id;

          return (
            <Card key={order.id}>
              <button type="button" onClick={() => openCustomerOrder(order)} className="w-full text-left">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Auftrag {order.id}</p>
                    <h2 className="mt-1 text-xl font-black">{productName(order.product)}</h2>
                  </div>
                  <Badge>{order.customerConfirmed ? "Termin bestätigt" : order.status || "offen"}</Badge>
                </div>
              </button>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500"><CalendarDays size={15} />Termin</p>
                  <p className="mt-2 text-sm font-black">{order.date || "noch offen"} {order.time || ""}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500"><UserRound size={15} />Ansprechpartner</p>
                  <p className="mt-2 text-sm font-black">{contactPerson(order)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 sm:col-span-2">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500"><MapPin size={15} />Adresse</p>
                  <p className="mt-2 text-sm font-black">{order.address || "noch nicht hinterlegt"}</p>
                </div>
              </div>

              {order.customerConfirmed && (
                <div role="status" className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
                  <div>
                    <p className="font-black">Termin erfolgreich bestätigt</p>
                    <p className="mt-1">Ihre Bestätigung ist lokal gespeichert{order.customerConfirmedAt ? ` · ${order.customerConfirmedAt}` : ""}.</p>
                  </div>
                </div>
              )}

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  disabled={order.customerConfirmed}
                  onClick={() => confirmCustomerAppointment(order)}
                  className={`rounded-2xl px-4 py-3 text-sm font-black ${order.customerConfirmed ? "cursor-default bg-emerald-100 text-emerald-800" : "bg-slate-950 text-white"}`}
                >
                  {order.customerConfirmed ? "Termin bestätigt" : "Termin bestätigen"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuestionOrderId(questionOpen ? "" : order.id);
                    setQuestionText("");
                    setPreparedQuestion("");
                  }}
                  className="rounded-2xl bg-sky-100 px-4 py-3 text-sm font-black text-sky-900"
                >
                  Rückfrage vorbereiten
                </button>
                <button
                  type="button"
                  onClick={() => setOpenCareOrderId(careOpen ? "" : order.id)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-900"
                >
                  Pflegehinweise öffnen <ChevronDown size={17} className={careOpen ? "rotate-180" : ""} />
                </button>
              </div>

              {questionOpen && (
                <div className="mt-4 rounded-3xl bg-sky-50 p-4">
                  <p className="flex items-center gap-2 font-black text-sky-950"><CircleHelp size={18} />Rückfrage als Text vorbereiten</p>
                  <p className="mt-1 text-xs text-sky-800">Es wird nichts automatisch versendet.</p>
                  <textarea
                    value={questionText}
                    onChange={(event) => setQuestionText(event.target.value)}
                    placeholder="Was möchten Sie zum Termin oder Auftrag fragen?"
                    className="mt-3 h-28 w-full resize-none rounded-2xl border border-sky-200 bg-white p-3 text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    disabled={!questionText.trim()}
                    onClick={() => prepareQuestion(order)}
                    className="mt-2 rounded-2xl bg-sky-900 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Textentwurf erstellen
                  </button>
                  {preparedQuestion && <div className="mt-3"><CopyBox title="Rückfrage kopieren" text={preparedQuestion} /></div>}
                </div>
              )}

              {careOpen && (
                <div className="mt-4 rounded-3xl bg-emerald-50 p-4">
                  <p className="flex items-center gap-2 font-black text-emerald-950"><RefreshCw size={18} />Pflegehinweise für dieses Produkt</p>
                  <div className="mt-3 space-y-3">
                    {careTips.map((tip) => (
                      <article key={tip.id} className="rounded-2xl bg-white p-4">
                        <h3 className="font-black">{tip.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{tip.note}</p>
                        <ul className="mt-3 space-y-1 text-sm text-slate-700">
                          {tip.steps.map((step) => <li key={step}>• {step}</li>)}
                        </ul>
                      </article>
                    ))}
                    {careTips.length === 0 && <p className="text-sm font-bold text-emerald-900">Für dieses Produkt sind noch keine Pflegehinweise hinterlegt.</p>}
                  </div>
                </div>
              )}

              <div className="mt-4 rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 font-black"><FileText size={18} />Dokumente & PDFs</p>
                  <Badge>{documents.length ? `${documents.length} bereitgestellt` : "noch keine"}</Badge>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {documents.map((document) => (
                    <div key={document.id} className="rounded-2xl bg-slate-50 p-3">
                      <p className="truncate text-sm font-black">{document.fileName || document.template || "Dokument"}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">Status: {documentLabel(document)}</p>
                    </div>
                  ))}
                  {documents.length === 0 && <p className="text-sm text-slate-600">Sobald ein Dokument freigegeben wurde, erscheint sein Status hier.</p>}
                </div>
              </div>
            </Card>
          );
        })}

        {sortedOrders.length === 0 && (
          <Card>
            <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">
              Ihrem Kundenkonto ist noch kein Auftrag zugeordnet. Es werden keine fremden Aufträge angezeigt.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
