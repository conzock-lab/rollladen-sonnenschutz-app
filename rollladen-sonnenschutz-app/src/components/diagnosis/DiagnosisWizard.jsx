import React from "react";
import DiagnosisStep from "./DiagnosisStep";

export default function DiagnosisWizard({ onAnswer, onBack, onPause, onPhoto, session, tree }) {
  const step = tree.steps?.[session.currentStep];
  if (!step) return null;
  return <DiagnosisStep answer={session.answers?.[step.id]?.value} current={session.currentStep} onAnswer={onAnswer} onBack={onBack} onPause={onPause} onPhoto={() => onPhoto?.(step)} step={step} total={tree.steps.length} />;
}
