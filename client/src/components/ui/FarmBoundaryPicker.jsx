import React, { useState, useEffect, useRef } from "react";
import { Trash2, ShieldAlert, Sparkles, Navigation } from "lucide-react";

const FarmBoundaryPicker = ({ value, onChange }) => {
  const [points, setPoints] = useState([]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  // Guards the initial-value parse below so it only ever runs once for a
  // value supplied by the parent (e.g. loaded asynchronously after mount)
  // rather than re-firing on every click this component reports upward.
  const initializedRef = useRef(false);

  // Parse initial coordinates if provided
  useEffect(() => {
    if (initializedRef.current) return;
    if (value?.coordinates?.[0]) {
      initializedRef.current = true;
      // Map back to grid coordinates (assuming canvas scale representation)
      const mapped = value.coordinates[0].map(([lng, lat]) => ({
        x: (lng - 7.5) * 1000 + 200,
        y: (13.0 - lat) * 1000 + 200,
      }));
      // Remove closing coordinate duplicate if present
      if (mapped.length > 1 && mapped[0].x === mapped[mapped.length - 1].x) {
        mapped.pop();
      }
      setPoints(mapped);
    }
  }, [value]);

  const drawGrid = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Draw agricultural field texture background
    ctx.fillStyle = "#0f172a"; // Slate-900 background
    ctx.fillRect(0, 0, width, height);

    // Draw coordinate grid lines
    ctx.strokeStyle = "#334155"; // Slate-700
    ctx.lineWidth = 1;
    const step = 40;

    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Compass Rose Info
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("N (Katsina Pilot Area)", width / 2 - 50, 20);
  };

  const drawPolygon = (ctx) => {
    if (points.length === 0) return;

    // Draw vertex points
    points.forEach((pt, index) => {
      ctx.fillStyle = index === 0 ? "#10b981" : "#3b82f6"; // Green for start, Blue for others
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw point numbers
      ctx.fillStyle = "#ffffff";
      ctx.font = "9px Arial";
      ctx.fillText(index + 1, pt.x - 3, pt.y - 8);
    });

    // Draw boundary lines
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    // Close path automatically if more than 2 points
    if (points.length > 2) {
      ctx.lineTo(points[0].x, points[0].y);
      ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
      ctx.fill();
    }
    ctx.stroke();
  };

  // Shoelace formula to calculate polygon area in square units
  const calculateArea = () => {
    if (points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      area += points[i].x * points[next].y;
      area -= points[next].x * points[i].y;
    }
    area = Math.abs(area) / 2;
    // Map grid area to simulated hectares
    return parseFloat((area / 400).toFixed(2));
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = [...points, { x, y }];
    setPoints(newPoints);
    triggerChange(newPoints);
  };

  const handleClear = () => {
    setPoints([]);
    if (onChange) {
      onChange(null);
    }
  };

  const triggerChange = (pts) => {
    if (pts.length < 3) return;

    // Convert canvas coordinates back to simulated GPS for Katsina pilot area (Latitude ~13.0, Longitude ~7.5)
    const coordinates = pts.map((pt) => [
      parseFloat((7.5 + (pt.x - 200) / 1000).toFixed(6)),
      parseFloat((13.0 - (pt.y - 200) / 1000).toFixed(6)),
    ]);

    // GeoJSON requires closed loop (first point matches last)
    coordinates.push([...coordinates[0]]);

    const area = parseFloat((pts.reduce((acc, curr, index) => {
      const next = (index + 1) % pts.length;
      return acc + (curr.x * pts[next].y - pts[next].x * curr.y);
    }, 0) / 800).toFixed(2));

    onChange({
      type: "Polygon",
      coordinates: [coordinates],
      hectarage: Math.abs(area) || 0.5,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    drawGrid(ctx, width, height);
    drawPolygon(ctx);
  }, [points]);

  const hectarage = calculateArea();

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="flex justify-between items-center bg-slate-900/10 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="text-amber-500" size={15} />
            Farm Plot Polygon Plotter
          </h4>
          <p className="text-xs text-slate-500">Click on the grid map to trace your boundary vertices</p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="p-2 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1"
        >
          <Trash2 size={13} />
          Reset Plot
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          onClick={handleCanvasClick}
          className="w-full cursor-crosshair block"
        />

        {/* Floating Hectarage Badge */}
        {points.length >= 3 && (
          <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-lg">
            <Navigation size={12} className="text-blue-400 rotate-45" />
            <span>Plot Area: <strong>{hectarage} hectares</strong></span>
          </div>
        )}
      </div>

      {points.length < 3 && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <ShieldAlert size={12} />
          Trace at least 3 points to define the closed farm plot boundary.
        </p>
      )}
    </div>
  );
};

export default FarmBoundaryPicker;
