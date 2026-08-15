import React, { useEffect, useRef } from "react";
import { Eraser, PenTool, Save } from "lucide-react";

const WIDTH = 900;
const HEIGHT = 220;

export default function SignaturePad({ label, onChange, value = {} }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const prepare = (context) => {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 4;
    context.strokeStyle = "#0f172a";
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    prepare(context);
  };

  useEffect(() => {
    clearCanvas();
    if (!value?.dataUrl) return;
    const image = new Image();
    image.onload = () => canvasRef.current?.getContext("2d")?.drawImage(image, 0, 0, WIDTH, HEIGHT);
    image.src = value.dataUrl;
  }, [value?.dataUrl]);

  const point = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * WIDTH, y: ((event.clientY - rect.top) / rect.height) * HEIGHT };
  };

  const start = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = point(event);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const next = point(event);
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    prepare(context);
    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.lineTo(next.x, next.y);
    context.stroke();
    lastPointRef.current = next;
  };

  const stop = (event) => {
    drawingRef.current = false;
    if (event?.currentTarget?.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const save = () => {
    const dataUrl = canvasRef.current?.toDataURL("image/png") || "";
    if (!dataUrl) return;
    onChange({ ...value, dataUrl, signedAt: new Date().toISOString() });
  };

  const remove = () => {
    clearCanvas();
    onChange({ name: value?.name || "", dataUrl: "", signedAt: "" });
  };

  return <section className="document-block rounded-3xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="flex items-center gap-2 font-black"><PenTool size={17} />{label}</h3><p className="mt-1 text-xs font-semibold text-slate-500">Mit Maus, Finger oder Touch-Stift erfassen.</p></div>{value?.signedAt && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900">gespeichert</span>}</div>
    <label className="mt-3 block text-xs font-bold text-slate-600">Name, optional<input value={value?.name || ""} onChange={(event) => onChange({ ...value, name: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm" /></label>
    <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} onPointerDown={start} onPointerMove={draw} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop} aria-label={`Unterschriftsfläche ${label}`} className="mt-3 h-36 w-full touch-none rounded-2xl border border-slate-200 bg-white shadow-inner" style={{ touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }} />
    <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={remove} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white text-xs font-black"><Eraser size={16} />Löschen</button><button type="button" onClick={save} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-black text-white"><Save size={16} />Unterschrift speichern</button></div>
    <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">Digitale Erfassung zur Dokumentation – keine qualifizierte elektronische Signatur.</p>
  </section>;
}
