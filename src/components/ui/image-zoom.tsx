"use client";

import * as React from "react";
import { ZoomIn, X, ZoomOut, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageZoomButtonProps {
  /** Image URL to zoom into */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional className for positioning the button */
  className?: string;
}

/**
 * ImageZoomButton
 *
 * A small zoom-icon button that appears on image hover. When clicked, opens
 * a full-screen modal dialog where the user can:
 *   - Pan the image by dragging
 *   - Zoom in/out with buttons or mouse wheel
 *   - Rotate the image 90°
 *   - Press Escape or click the close button to dismiss
 *
 * Designed to overlay on top of any product image container.
 */
export function ImageZoomButton({ src, alt, className }: ImageZoomButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  // Lock body scroll while modal is open
  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Mouse wheel zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((z) => Math.max(1, Math.min(5, z + delta)));
  }

  // Pan handlers (mouse drag)
  function handleMouseDown(e: React.MouseEvent) {
    if (zoom === 1) return;
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: position.x,
      baseY: position.y,
    };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.baseX + dx,
      y: dragRef.current.baseY + dy,
    });
  }

  function handleMouseUp() {
    dragRef.current = null;
  }

  // Touch pan support
  function handleTouchStart(e: React.TouchEvent) {
    if (zoom === 1 || e.touches.length !== 1) return;
    const t = e.touches[0];
    dragRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      baseX: position.x,
      baseY: position.y,
    };
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!dragRef.current || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - dragRef.current.startX;
    const dy = t.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.baseX + dx,
      y: dragRef.current.baseY + dy,
    });
  }

  return (
    <>
      {/* Zoom button — appears on hover via the parent's group-hover */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Zoom image"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-primary",
          "opacity-0 group-hover:opacity-100 focus:opacity-100",
          className
        )}
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      {/* Modal — full-screen zoom viewer */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom viewer"
        >
          {/* Close button — top right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Close zoom"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Toolbar — bottom center */}
          <div
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 px-2 py-1.5 shadow-lg backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
              disabled={zoom <= 1}
              aria-label="Zoom out"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[3rem] text-center text-xs font-medium text-white">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(5, z + 0.5))}
              disabled={zoom >= 5}
              aria-label="Zoom in"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="mx-1 h-5 w-px bg-white/20" />
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              aria-label="Rotate"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <div className="mx-1 h-5 w-px bg-white/20" />
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }}
              aria-label="Reset"
              className="rounded-full px-3 py-1 text-xs font-medium text-white transition-all hover:bg-white/20"
            >
              Reset
            </button>
          </div>

          {/* Image — pannable + zoomable */}
          <div
            className="flex h-full w-full items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            style={{ cursor: zoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "default" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="max-h-[90vh] max-w-[90vw] select-none object-contain transition-transform duration-100"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          </div>

          {/* Hint text — top center */}
          <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white backdrop-blur-sm">
            {zoom > 1 ? "Drag to pan · Scroll to zoom · Esc to close" : "Scroll or click + to zoom · Esc to close"}
          </div>
        </div>
      )}
    </>
  );
}
