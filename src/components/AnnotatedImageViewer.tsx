import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Eye,
  EyeOff,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { ReviewFinding, FindingSeverity } from '../types';

interface AnnotatedImageViewerProps {
  imageUrl: string;
  findings: ReviewFinding[];
  selectedFindingId: string | null;
  onSelectFinding: (findingId: string) => void;
}

export const AnnotatedImageViewer: React.FC<AnnotatedImageViewerProps> = ({
  imageUrl,
  findings,
  selectedFindingId,
  onSelectFinding,
}) => {
  // Viewer state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<string>('ALL');
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Check if image is already loaded on mount (e.g. cached or data url)
  useEffect(() => {
    if (imageRef.current && (imageRef.current.complete || imageRef.current.naturalWidth > 0)) {
      setImageLoaded(true);
    }
  }, [imageUrl]);

  // Helper to extract normalized 0.0 - 1.0 coordinates
  const getNormalizedBox = useCallback((finding: ReviewFinding) => {
    const box = finding.bounding_box;
    if (!box) return null;
    if (box.is_uncertain) return null;

    // Check if x, y, width, height are valid
    if (
      typeof box.x === 'number' &&
      typeof box.y === 'number' &&
      typeof box.width === 'number' &&
      typeof box.height === 'number' &&
      box.width > 0 &&
      box.height > 0
    ) {
      const isScale1000 = box.x > 1 || box.y > 1 || box.width > 1 || box.height > 1;
      const divisor = isScale1000 ? 1000 : 1;
      return {
        x: Math.max(0, Math.min(1, box.x / divisor)),
        y: Math.max(0, Math.min(1, box.y / divisor)),
        width: Math.max(0.015, Math.min(1, box.width / divisor)),
        height: Math.max(0.015, Math.min(1, box.height / divisor)),
      };
    }

    // Check if box2d array [ymin, xmin, ymax, xmax] is available
    if (Array.isArray(box.box2d) && box.box2d.length === 4) {
      const [ymin, xmin, ymax, xmax] = box.box2d;
      if (ymax > ymin && xmax > xmin) {
        const isScale1000 = ymin > 1 || xmin > 1 || ymax > 1 || xmax > 1;
        const divisor = isScale1000 ? 1000 : 1;
        const x = xmin / divisor;
        const y = ymin / divisor;
        const width = (xmax - xmin) / divisor;
        const height = (ymax - ymin) / divisor;
        return {
          x: Math.max(0, Math.min(1, x)),
          y: Math.max(0, Math.min(1, y)),
          width: Math.max(0.015, Math.min(1, width)),
          height: Math.max(0.015, Math.min(1, height)),
        };
      }
    }

    return null;
  }, []);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(3.0, Number((prev + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.75, Number((prev - 0.25).toFixed(2))));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };
  const handleFitScreen = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // When a user selects a finding from the list, auto-focus & center the box
  useEffect(() => {
    if (!selectedFindingId) return;
    const finding = findings.find((f) => f.id === selectedFindingId);
    if (!finding) return;

    const box = getNormalizedBox(finding);
    if (box) {
      // Zoom into the box
      const targetZoom = Math.max(1.6, zoomLevel);
      const imgWidth = imageRef.current?.clientWidth || 450;
      const imgHeight = imageRef.current?.clientHeight || 450;

      // Center of the bounding box relative to image center (0.5, 0.5)
      const boxCenterX = (box.x + box.width / 2) - 0.5;
      const boxCenterY = (box.y + box.height / 2) - 0.5;

      // Pan offset to bring the box center into viewport center
      const targetPanX = -boxCenterX * imgWidth * targetZoom;
      const targetPanY = -boxCenterY * imgHeight * targetZoom;

      setZoomLevel(targetZoom);
      setPanOffset({ x: targetPanX, y: targetPanY });
    }
  }, [selectedFindingId, findings, getNormalizedBox]);

  // Pan / drag mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Filter findings for visual annotations
  const visibleFindings = findings.filter((f) => {
    if (!showAnnotations) return false;
    if (activeSeverityFilter === 'ALL') return true;
    return f.severity === activeSeverityFilter;
  });

  // Strict user requirement: Red for Critical & High, Orange for Medium, Yellow for Low
  const getSeverityStyle = (sev: FindingSeverity) => {
    switch (sev) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          border: 'border-red-600',
          bg: 'bg-red-600/20',
          badge: 'bg-red-600 text-white',
          glow: 'shadow-[0_0_20px_rgba(220,38,38,0.75)] ring-4 ring-red-400/80',
          badgeSelected: 'bg-red-700 ring-4 ring-white',
          text: 'text-red-700',
        };
      case 'MEDIUM':
        return {
          border: 'border-orange-500',
          bg: 'bg-orange-500/20',
          badge: 'bg-orange-600 text-white',
          glow: 'shadow-[0_0_20px_rgba(249,115,22,0.75)] ring-4 ring-orange-400/80',
          badgeSelected: 'bg-orange-700 ring-4 ring-white',
          text: 'text-orange-700',
        };
      case 'LOW':
      case 'INFORMATIONAL':
      default:
        return {
          border: 'border-yellow-400',
          bg: 'bg-yellow-400/20',
          badge: 'bg-yellow-500 text-slate-900',
          glow: 'shadow-[0_0_20px_rgba(234,179,8,0.75)] ring-4 ring-yellow-300/80',
          badgeSelected: 'bg-yellow-600 text-slate-900 ring-4 ring-white',
          text: 'text-yellow-800',
        };
    }
  };

  const selectedFinding = findings.find((f) => f.id === selectedFindingId);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Toggle Original vs Annotated Image */}
          <button
            type="button"
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${
              showAnnotations
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
            title="Toggle between annotated view and original creative"
          >
            {showAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAnnotations ? 'Annotated View' : 'Original Image'}</span>
          </button>

          {/* Severity Filter Dropdown */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 text-xs">
            <span className="text-slate-500 hidden sm:inline">Filter:</span>
            <select
              value={activeSeverityFilter}
              onChange={(e) => setActiveSeverityFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </select>
          </div>
        </div>

        {/* Zoom & Fit Controls */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-mono font-semibold text-slate-700 px-2 select-none min-w-[42px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleFitScreen}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[520px] bg-slate-950 flex items-center justify-center overflow-hidden select-none ${
          zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
      >
        {/* Transform wrapper for Zoom and Pan */}
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative inline-block leading-none max-h-full max-w-full"
        >
          {/* Exact-fit image container: strictly matches rendered image size */}
          <div className="relative inline-block leading-none overflow-visible">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Audited creative advertisement"
              onLoad={() => setImageLoaded(true)}
              className="block max-h-[480px] max-w-full w-auto h-auto pointer-events-none rounded select-none shadow-2xl"
              draggable={false}
            />

            {/* Interactive Bounding Box Overlays (100% normalized to exact image coordinates) */}
            {showAnnotations && imageLoaded && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {visibleFindings.map((finding, idx) => {
                  const box = getNormalizedBox(finding);
                  if (!box) return null;

                  const isSelected = selectedFindingId === finding.id;
                  const style = getSeverityStyle(finding.severity);
                  const issueNum = finding.issue_number || idx + 1;

                  return (
                    <div
                      key={finding.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFinding(finding.id);
                      }}
                      style={{
                        left: `${box.x * 100}%`,
                        top: `${box.y * 100}%`,
                        width: `${box.width * 100}%`,
                        height: `${box.height * 100}%`,
                      }}
                      className={`absolute border-2 transition-all duration-200 cursor-pointer pointer-events-auto rounded-sm ${
                        style.border
                      } ${style.bg} ${
                        isSelected
                          ? `z-40 border-[3px] ${style.glow}`
                          : 'z-20 hover:border-[3px] hover:scale-[1.01] hover:z-30'
                      }`}
                    >
                      {/* Numbered Marker Badge */}
                      <div
                        className={`absolute -top-3.5 -left-3.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-md border-2 border-white transition-all ${
                          isSelected ? style.badgeSelected : style.badge
                        }`}
                        title={`Finding #${issueNum}: ${finding.finding_title}`}
                      >
                        #{issueNum}
                      </div>

                      {/* Active Tooltip Callout on Selected Finding */}
                      {isSelected && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-3 py-2 rounded-lg text-[11px] shadow-2xl border border-slate-700 whitespace-nowrap z-50 animate-in fade-in zoom-in-95 pointer-events-auto flex flex-col gap-0.5"
                        >
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-emerald-400">#{issueNum}:</span>
                            <span className="max-w-[260px] truncate">{finding.finding_title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                              -{finding.deduction}pts
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-300 font-normal truncate max-w-[280px]">
                            {finding.solution || finding.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Finding Floating Quick Bar */}
        {selectedFinding && (
          <div className="absolute bottom-3 left-4 right-4 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-xl p-3 flex items-center justify-between shadow-2xl z-30 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${
                  getSeverityStyle(selectedFinding.severity).badge
                }`}
              >
                #{selectedFinding.issue_number || 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-white truncate max-w-sm">
                    {selectedFinding.finding_title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 border border-slate-600">
                    {selectedFinding.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Location: {selectedFinding.location_description || 'Identified on visual canvas'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate max-w-xl mt-0.5">
                  <span className="text-emerald-400 font-semibold">Solution: </span>
                  {selectedFinding.solution || selectedFinding.recommendation}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectFinding('')}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors shrink-0 ml-3 cursor-pointer"
            >
              Clear Focus
            </button>
          </div>
        )}
      </div>

      {/* Clear Legend Explaining Annotation Colors */}
      <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
          <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
          <span>Visual Highlighting Legend:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-600 border border-red-700 inline-block" />
            <span className="font-semibold text-slate-700">Critical &amp; High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-orange-500 border border-orange-600 inline-block" />
            <span className="font-semibold text-slate-700">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-yellow-400 border border-yellow-500 inline-block" />
            <span className="font-semibold text-slate-700">Low / Informational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border-2 border-dashed border-slate-400 inline-block" />
            <span className="text-slate-500">Location Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
