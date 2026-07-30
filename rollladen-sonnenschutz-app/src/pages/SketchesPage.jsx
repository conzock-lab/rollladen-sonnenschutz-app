import React, { useEffect, useRef, useState } from "react";
import { Eraser, FolderOpen, Layers, Save, Trash2, Undo2 } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import { sketchCards } from "../data/learningModules";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const USE_CASES = [
  "Aufmaß-Skizze",
  "Einbausituation",
  "Fehlerstelle",
  "Führungsschienen/Bohrpunkte",
  "Kundenhinweis",
];
const STROKE_WIDTHS = [2, 4, 6, 10, 14];

function DrawingPad({ image, resetKey, strokeWidth, setStrokeWidth, onSave, onNotice }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const undoStackRef = useRef([]);
  const [canUndo, setCanUndo] = useState(false);

  const prepareContext = (context) => {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#0f172a";
    context.lineWidth = strokeWidth;
  };

  const paintCanvas = (source = "") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    prepareContext(context);
    if (!source) return;
    const loadedImage = new Image();
    loadedImage.onload = () => {
      context.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
      prepareContext(context);
    };
    loadedImage.src = source;
  };

  useEffect(() => {
    paintCanvas(image);
    undoStackRef.current = [];
    setCanUndo(false);
  }, [image, resetKey]);

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (context) context.lineWidth = strokeWidth;
  }, [strokeWidth]);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const rememberCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    undoStackRef.current = [...undoStackRef.current.slice(-11), canvas.toDataURL("image/png")];
    setCanUndo(true);
  };

  const startDrawing = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    rememberCanvas();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;
    const point = getPoint(event);
    lastPointRef.current = point;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    prepareContext(context);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x + 0.01, point.y + 0.01);
    context.stroke();
  };

  const draw = (event) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const nextPoint = getPoint(event);
    prepareContext(context);
    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.stroke();
    lastPointRef.current = nextPoint;
  };

  const stopDrawing = (event) => {
    drawingRef.current = false;
    if (event?.currentTarget?.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const clearCanvas = () => {
    rememberCanvas();
    paintCanvas("");
    onNotice?.("Zeichenfläche wurde geleert. Rückgängig ist weiterhin möglich.");
  };

  const undo = () => {
    const previousImage = undoStackRef.current.pop();
    if (!previousImage) return;
    paintCanvas(previousImage);
    setCanUndo(undoStackRef.current.length > 0);
    onNotice?.("Letzter Zeichenschritt wurde rückgängig gemacht.");
  };

  const save = () => {
    const savedImage = canvasRef.current?.toDataURL("image/png") || "";
    if (!savedImage) return;
    onSave?.({ image: savedImage, strokeWidth });
  };

  return (
    <div className="rounded-3xl bg-slate-50 p-3 md:p-5">
      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h3 className="font-black">Freie Zeichenfläche</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">Mit Maus, Finger oder Touch-Stift zeichnen. Während des Zeichnens bleibt die Seite stehen.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <label className="col-span-2 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-slate-700 sm:col-span-1">
            Strichstärke
            <select value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))} className="ml-2 rounded-xl border border-slate-200 bg-white px-2 py-1">
              {STROKE_WIDTHS.map((width) => <option key={width} value={width}>{width} px</option>)}
            </select>
          </label>
          <button type="button" onClick={undo} disabled={!canUndo} className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><Undo2 size={16} />Rückgängig</button>
          <button type="button" onClick={clearCanvas} className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-black text-slate-700"><Eraser size={16} />Fläche löschen</button>
          <button type="button" onClick={save} className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white sm:col-span-1"><Save size={16} />Skizze speichern</button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
        className="h-[300px] w-full touch-none rounded-2xl border border-slate-200 bg-white shadow-inner md:h-[460px]"
        style={{ touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }}
        aria-label="Freie Zeichenfläche für Baustellenskizzen"
      />
    </div>
  );
}

export default function SketchesPage({
  checkButton,
  deleteSketch,
  orders = [],
  saveSketch,
  savedSketches = [],
  selectedOrderId = "",
  setSketchImage,
  showNotice,
  sketchImage,
}) {
  const [useCase, setUseCase] = useState(USE_CASES[0]);
  const [orderId, setOrderId] = useState(selectedOrderId);
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (selectedOrderId && !orderId) setOrderId(selectedOrderId);
  }, [selectedOrderId, orderId]);

  const handleSave = ({ image, strokeWidth: savedStrokeWidth }) => {
    const order = orders.find((item) => item.id === orderId);
    const createdAt = new Date();
    saveSketch?.({
      id: "SK-" + Date.now(),
      image,
      useCase,
      orderId,
      orderLabel: order ? order.id + " · " + order.customer : "",
      strokeWidth: savedStrokeWidth,
      createdAt: createdAt.toISOString(),
      createdLabel: createdAt.toLocaleString("de-DE"),
      storage: "local",
      syncStatus: "lokal gespeichert",
      syncReady: true,
    });
  };

  const loadSketch = (sketch) => {
    setUseCase(sketch.useCase || USE_CASES[0]);
    setOrderId(sketch.orderId || "");
    setStrokeWidth(Number(sketch.strokeWidth) || 6);
    setSketchImage(sketch.image);
    setResetKey((current) => current + 1);
    showNotice?.("Gespeicherte Skizze wurde geladen.");
  };

  const removeSketch = (sketch) => {
    if (!window.confirm("Gespeicherte Skizze wirklich löschen?")) return;
    deleteSketch?.(sketch);
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle icon={Layers} title="Skizzenbereich" subtitle="Freie Baustellenskizzen mit Maus, Finger oder Touch-Stift erstellen, lokal speichern und einem Auftrag zuordnen." />

        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Nutzungsfall</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {USE_CASES.map((item) => (
                <button key={item} type="button" onClick={() => setUseCase(item)} className={"rounded-2xl px-3 py-2 text-xs font-black transition " + (useCase === item ? "bg-slate-950 text-white" : "bg-white text-slate-700")}>{item}</button>
              ))}
            </div>
          </div>
          <label className="block rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-800">
            Auftrag zuordnen
            <select value={orderId} onChange={(event) => setOrderId(event.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold">
              <option value="">Ohne Auftrag</option>
              {orders.map((order) => <option key={order.id} value={order.id}>{order.id} · {order.customer}</option>)}
            </select>
          </label>
        </div>

        <DrawingPad image={sketchImage} resetKey={resetKey} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} onSave={handleSave} onNotice={showNotice} />

        <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-900">
          Lokale Speicherung aktiv · neue oder gelöschte Skizzen werden in die Sync-Warteschlange aufgenommen.
        </div>
      </Card>

      <Card>
        <SectionTitle icon={FolderOpen} title="Gespeicherte Skizzen" subtitle="Lokal gespeicherte Skizzen erneut laden oder entfernen." />
        {savedSketches.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">Noch keine Skizze gespeichert.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedSketches.map((sketch) => (
              <article key={sketch.id} className="overflow-hidden rounded-3xl bg-slate-50">
                <img src={sketch.image} alt={sketch.useCase || "Gespeicherte Skizze"} className="h-44 w-full border-b border-slate-200 bg-white object-contain" />
                <div className="p-4">
                  <div className="flex flex-wrap gap-2"><Badge>{sketch.useCase || "Skizze"}</Badge><Badge>{sketch.orderLabel || "ohne Auftrag"}</Badge></div>
                  <p className="mt-3 text-xs font-bold text-slate-500">{sketch.createdLabel || sketch.createdAt}</p>
                  <p className="mt-1 text-xs font-semibold text-amber-700">{sketch.syncReady ? "lokal gespeichert · sync-fähig" : (sketch.syncStatus || "lokal gespeichert")}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => loadSketch(sketch)} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-xs font-black text-white"><FolderOpen size={15} />Laden</button>
                    <button type="button" onClick={() => removeSketch(sketch)} className="flex items-center justify-center gap-2 rounded-2xl bg-rose-100 px-3 py-2 text-xs font-black text-rose-800"><Trash2 size={15} />Löschen</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle icon={Layers} title="Skizzenkarten" subtitle="Kontrollpunkte für typische Aufmaß- und Einbausituationen." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sketchCards.map((card) => (
            <article key={card.title} className="rounded-3xl bg-slate-50 p-5">
              <div className="mb-4 rounded-2xl bg-white p-4 text-center text-sm font-black text-slate-500 shadow-sm">Skizze: {card.title}</div>
              <h3 className="font-black">{card.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">{card.parts.map((part) => <Badge key={part}>{part}</Badge>)}</div>
              <div className="mt-4 space-y-2">{card.parts.slice(0, 4).map((part) => checkButton("skizze-" + card.title, part))}</div>
              <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">{card.tip}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
