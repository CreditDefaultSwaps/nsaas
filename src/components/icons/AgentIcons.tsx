'use client';

// Architect — blueprint compass/triangle with grid
export function ArchitectIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Main triangle: points at top, bottom-left, bottom-right */}
      <path d="M12 4L4 20h16L12 4z" />
      {/* Inner horizontal lines at 1/3 and 2/3 height */}
      <path d="M6 14h12" />
      <path d="M8 10h8" />
      {/* Small circle at top vertex */}
      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Frontend — overlapping window frames / browser layers
export function FrontendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Back window (offset) */}
      <rect x="6" y="3" width="14" height="12" rx="1.5" />
      <circle cx="8.5" cy="6" r="0.8" fill="currentColor" />
      <circle cx="10.5" cy="6" r="0.8" fill="currentColor" />
      {/* Front window */}
      <rect x="4" y="7" width="14" height="12" rx="1.5" />
      <circle cx="6.5" cy="10" r="0.8" fill="currentColor" />
      <circle cx="8.5" cy="10" r="0.8" fill="currentColor" />
    </svg>
  );
}

// Backend — stacked server cylinders
export function BackendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top cylinder */}
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      {/* Middle cylinder */}
      <ellipse cx="12" cy="12" rx="8" ry="3" />
      {/* Bottom cylinder */}
      <ellipse cx="12" cy="19" rx="8" ry="3" />
      {/* Vertical lines connecting them on left and right */}
      <path d="M4 5v14M20 5v14" />
      {/* Small indicator dot on middle cylinder */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Security — shield with single circuit line
export function SecurityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Shield outline (classic pointed bottom) */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      {/* Single diagonal circuit line inside with 90-degree bend */}
      <path d="M8 10l3 3-2 2" />
      {/* Small dot at circuit endpoint */}
      <circle cx="9" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

// DevOps — infinity loop / circular pipeline
export function DevOpsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Infinity symbol (∞) — two overlapping circles */}
      <path d="M6 9c-2.2 0-4 1.8-4 4s1.8 4 4 4c2.5 0 5.5-4 6-4.5.5.5 3.5 4.5 6 4.5 2.2 0 4-1.8 4-4s-1.8-4-4-4c-2.5 0-5.5 4-6 4.5C11.5 13 8.5 9 6 9z" />
      {/* Small arrow heads to show flow direction */}
      <path d="M18 9l1.5-1.5M18 9l1.5 1.5" />
      <path d="M6 15l-1.5 1.5M6 15l-1.5-1.5" />
    </svg>
  );
}

// Data — waveform / signal bars
export function DataIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 5 vertical bars of varying heights (like signal/chart) */}
      {/* Heights: 8, 14, 20, 14, 8 — centered, symmetric */}
      <path d="M4 14v4" />
      <path d="M8 11v7" />
      <path d="M12 8v10" />
      <path d="M16 11v7" />
      <path d="M20 14v4" />
      {/* Thin baseline underneath */}
      <path d="M2 20h20" />
    </svg>
  );
}

// QA — magnifying glass with checkmark
export function QAIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Circle with handle (magnifying glass) */}
      <circle cx="10" cy="10" r="6" />
      <path d="M14.5 14.5L20 20" />
      {/* Small checkmark (L-shape) inside the circle */}
      <path d="M7 10l2 2 4-4" />
    </svg>
  );
}

// Docs — document with code lines
export function DocsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Rectangle with folded top-right corner (dog-ear) */}
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      {/* 3 horizontal lines at different widths inside (representing text/code) */}
      {/* Line 1: full width */}
      <path d="M6 12h12" />
      {/* Line 2: 75% */}
      <path d="M6 16h9" />
      {/* Line 3: 50% */}
      <path d="M6 20h6" />
    </svg>
  );
}

// PM — network nodes
export function PMIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Central node (circle) */}
      <circle cx="12" cy="12" r="2.5" />
      {/* 3 outer nodes (circles) */}
      <circle cx="12" cy="4" r="2" />
      <circle cx="4" cy="18" r="2" />
      <circle cx="20" cy="18" r="2" />
      {/* Lines connecting center to each outer node */}
      <path d="M12 9.5V6" />
      <path d="M9.8 13.7L5.7 16.3" />
      <path d="M14.2 13.7L18.3 16.3" />
    </svg>
  );
}

// Cyprus — satellite SVG from Logo.tsx
export function CyprusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Satellite body */}
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      {/* Solar panels */}
      <path d="M3 11h6M15 11h6" strokeOpacity="0.6" />
      <path d="M3 13h6M15 13h6" strokeOpacity="0.6" />
      {/* Antenna */}
      <path d="M12 3v6M12 15v6" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      {/* Signal waves */}
      <path d="M12 21c2 0 3-1 3-3" strokeOpacity="0.4" />
      <path d="M12 21c-2 0-3-1-3-3" strokeOpacity="0.4" />
      {/* Orbit lines */}
      <ellipse cx="12" cy="12" rx="10" ry="3" strokeOpacity="0.2" transform="rotate(-45 12 12)" />
    </svg>
  );
}
