import React, { useMemo } from "react";
import { AlertTriangle, Zap } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allMotorTypes } from "../data/motors";

function isMotorRelevant(motor, selectedOrder, selectedProduct) {
  if (motor.productIds.includes(selectedProduct?.id)) return true;
  const drive = String(selectedOrder?.drive || "").toLowerCase();
  return (drive.includes("funk") && motor.id === "funkmotor") || (drive.includes("taster") && motor.id === "kabelmotor") || (drive.includes("smart") && motor.id === "gateway");
}

export default function MotorsPage({ checkButton, moduleChecks, selectedOrder, selectedProduct }) {
  const groups = allMotorTypes.flatMap((motor) => [
    { scope: `motor-check-${motor.name}`, items: motor.checks },
    { scope: `motor-fehler-${motor.name}`, items: motor.mistakes },
  ]);
  const sortedMotors = useMemo(() => [...allMotorTypes].sort((a, b) => Number(isMotorRelevant(b, selectedOrder, selectedProduct)) - Number(isMotorRelevant(a, selectedOrder, selectedProduct))), [selectedOrder?.drive, selectedProduct?.id]);

  return (
    <Card>
      <SectionTitle icon={Zap} title="Motoren & Steuerungen" subtitle="Rohrmotor, Funk, Sensorik, Gateway und Torsteuerung mit praktischen Prüf- und Fehlerpunkten." />
      <ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Motor- und Steuerungspunkte" />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text={`Antrieb im Auftrag: ${selectedOrder?.drive || "nicht angegeben"}`} />
      <div className="mb-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Netzanschlüsse und elektrische Messungen nur durch eine Elektrofachkraft. Herstellerangaben und geltende Vorschriften beachten.</div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sortedMotors.map((motor) => {
          const relevant = isMotorRelevant(motor, selectedOrder, selectedProduct);
          const motorGroups = [
            { scope: `motor-check-${motor.name}`, items: motor.checks },
            { scope: `motor-fehler-${motor.name}`, items: motor.mistakes },
          ];
          return (
            <article key={motor.id} className={`rounded-3xl border p-5 ${relevant ? "border-sky-200 bg-sky-50/60" : "border-transparent bg-slate-50"}`}>
              <div className="flex flex-wrap items-center gap-2">{relevant && <Badge>Zum Auftrag</Badge>}{motor.safety && <Badge>Sicherheit</Badge>}</div>
              <h3 className="mt-2 text-lg font-black">{motor.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{motor.details}</p>
              <InlineProgress moduleChecks={moduleChecks} groups={motorGroups} />
              <details className="mt-3 rounded-2xl bg-white p-3" open={relevant}>
                <summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Prüfschritte</summary>
                <div className="mt-2 space-y-2">{motor.checks.map((item) => checkButton(`motor-check-${motor.name}`, item))}</div>
              </details>
              <details className="mt-2 rounded-2xl bg-white p-3">
                <summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Typische Fehler ausschließen</summary>
                <div className="mt-2 space-y-2">{motor.mistakes.map((item) => checkButton(`motor-fehler-${motor.name}`, item))}</div>
              </details>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
