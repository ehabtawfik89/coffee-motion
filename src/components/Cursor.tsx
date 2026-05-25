import React from 'react';
import { interpolate } from 'remotion';

export type Waypoint = { frame: number; x: number; y: number; click?: boolean };

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function getCursorPos(frame: number, waypoints: Waypoint[]): { x: number; y: number } {
  if (!waypoints.length) return { x: 960, y: 540 };
  if (frame <= waypoints[0].frame) return { x: waypoints[0].x, y: waypoints[0].y };
  const last = waypoints[waypoints.length - 1];
  if (frame >= last.frame) return { x: last.x, y: last.y };

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const raw = (frame - a.frame) / (b.frame - a.frame);
      const t = easeInOut(raw);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  return { x: last.x, y: last.y };
}

interface CursorProps {
  frame: number;
  waypoints: Waypoint[];
  /** Is the cursor actively clicking at this frame? */
  clicking?: boolean;
  opacity?: number;
}

export const Cursor: React.FC<CursorProps> = ({ frame, waypoints, clicking = false, opacity = 1 }) => {
  const { x, y } = getCursorPos(frame, waypoints);

  // Detect click frames from waypoints
  const isClick = waypoints.some(
    (w) => w.click && Math.abs(frame - w.frame) < 8
  );

  const clickRippleProgress = (() => {
    for (const w of waypoints) {
      if (w.click) {
        const d = frame - w.frame;
        if (d >= 0 && d < 18) return d / 18;
      }
    }
    return 0;
  })();

  const innerScale = isClick ? interpolate(frame % 30, [0, 4, 8], [1, 0.7, 1], { extrapolateRight: 'clamp' }) : 1;

  return (
    <g style={{ pointerEvents: 'none' }} opacity={opacity}>
      {/* Spotlight glow behind cursor */}
      <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(99,102,241,0.18)" />
        <stop offset="100%" stopColor="rgba(99,102,241,0)" />
      </radialGradient>
      <circle cx={x} cy={y} r={120} fill="url(#cursorGlow)" />

      {/* Click ripple */}
      {clickRippleProgress > 0 && (
        <circle
          cx={x}
          cy={y}
          r={interpolate(clickRippleProgress, [0, 1], [8, 40])}
          fill="none"
          stroke="rgba(99,102,241,0.5)"
          strokeWidth={2}
          opacity={1 - clickRippleProgress}
        />
      )}

      {/* Outer ring */}
      <circle
        cx={x}
        cy={y}
        r={14}
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1.5}
        transform={`scale(${innerScale})`}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      {/* Inner dot */}
      <circle
        cx={x}
        cy={y}
        r={3}
        fill="white"
        opacity={0.9}
      />
    </g>
  );
};

/** Spotlight overlay that follows the cursor */
export const Spotlight: React.FC<{ x: number; y: number; intensity?: number }> = ({
  x, y, intensity = 1
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(circle 480px at ${x}px ${y}px, rgba(99,102,241,${0.10 * intensity}) 0%, transparent 70%)`,
      pointerEvents: 'none',
    }}
  />
);
