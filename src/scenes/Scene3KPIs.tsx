import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KPIRow } from '../components/KPICards';
import { Cursor, Spotlight, Waypoint } from '../components/Cursor';

// Cursor moves card to card, clicking each one
const CURSOR_WAYPOINTS: Waypoint[] = [
  { frame: 0,   x: 420,  y: 285 },
  { frame: 25,  x: 420,  y: 285, click: true },
  { frame: 55,  x: 840,  y: 285 },
  { frame: 75,  x: 840,  y: 285, click: true },
  { frame: 105, x: 1260, y: 285 },
  { frame: 125, x: 1260, y: 285, click: true },
  { frame: 155, x: 1680, y: 285 },
  { frame: 175, x: 1680, y: 285, click: true },
];

// Animated callout label that pops in
const Callout: React.FC<{ x: number; y: number; value: string; label: string; color: string; delay: number }> = ({
  x, y, value, label, color, delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 160 } });
  const scale = interpolate(sp, [0, 0.5, 0.8, 1], [0, 1.15, 0.95, 1]);
  const opacity = interpolate(sp, [0, 0.2], [0, 1]);

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `scale(${scale})`,
      transformOrigin: 'bottom center',
      opacity,
      background: color,
      borderRadius: T.r12,
      padding: '10px 18px',
      boxShadow: `0 4px 24px ${color}40, 0 0 0 1px ${color}60`,
      textAlign: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{ fontFamily: T.sans, fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>
        {label}
      </div>
      {/* Arrow down */}
      <div style={{
        position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: `8px solid ${color}`,
      }} />
    </div>
  );
};

export const Scene3KPIs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera: zoomed into KPI row
  const zoom = interpolate(frame, [0, 30, 150, 180], [1.08, 1.5, 1.5, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const panY = interpolate(frame, [0, 30], [0, -200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine which card the cursor is near (highlight it)
  const highlightIdx = (() => {
    if (frame < 40) return 0;
    if (frame < 90) return 1;
    if (frame < 140) return 2;
    return 3;
  })();

  const fadeIn  = interpolate(frame, [0,  15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Cursor position
  const cxInterp = interpolate(
    frame,
    CURSOR_WAYPOINTS.map(w => w.frame),
    CURSOR_WAYPOINTS.map(w => w.x),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const cyInterp = interpolate(
    frame,
    CURSOR_WAYPOINTS.map(w => w.frame),
    CURSOR_WAYPOINTS.map(w => w.y),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 30%, #0D0A22 0%, ${T.bg} 60%)`,
        opacity: Math.min(fadeIn, fadeOut),
        overflow: 'hidden',
      }}
    >
      <Spotlight x={cxInterp} y={cyInterp} intensity={1.5} />

      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${zoom}) translateY(${panY}px)`,
        transformOrigin: '50% 28%',
      }}>
        <Sidebar activeItem="dashboard" />
        <div style={{ position: 'absolute', left: 240, top: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          <Header title="Dashboard" subtitle="KPI Overview" />
          <div style={{ padding: '24px 32px' }}>
            <KPIRow highlightIndex={highlightIdx} enterDelay={0} animProgress={1} />
          </div>
        </div>
      </div>

      {/* Floating callout labels */}
      {frame > 30 && (
        <Callout x={320} y={120} value="+12.3%" label="NPS Growth" color={T.primary} delay={30} />
      )}
      {frame > 80 && (
        <Callout x={740} y={120} value="↑ 9.8%" label="Engagement" color={T.success} delay={80} />
      )}
      {frame > 130 && (
        <Callout x={1160} y={120} value="94.1%" label="Retention" color={T.cyan} delay={130} />
      )}
      {frame > 160 && (
        <Callout x={1570} y={120} value="3.2 yrs" label="Avg Tenure" color={T.warning} delay={160} />
      )}

      {/* Cursor */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Cursor frame={frame} waypoints={CURSOR_WAYPOINTS} opacity={1} />
      </svg>
    </AbsoluteFill>
  );
};
