import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { EmployeeGrid } from '../components/EmployeeCards';
import { Cursor, Spotlight, Waypoint } from '../components/Cursor';

const CURSOR_WAYPOINTS: Waypoint[] = [
  { frame: 0,   x: 550,  y: 400 },
  { frame: 20,  x: 550,  y: 400, click: true },
  { frame: 55,  x: 960,  y: 400 },
  { frame: 75,  x: 960,  y: 400, click: true },
  { frame: 110, x: 1380, y: 400 },
  { frame: 130, x: 1380, y: 400, click: true },
  { frame: 155, x: 720,  y: 700 },
];

export const Scene5Profiles: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn  = interpolate(frame, [0,  15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Camera: wide → slight zoom on grid, then scan right
  const zoom = interpolate(frame, [0, 40], [1.05, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const panX = interpolate(frame, [100, 170], [0, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Highlight card based on cursor proximity
  const highlightIdx = (() => {
    if (frame >= 15 && frame < 60) return 0;
    if (frame >= 60 && frame < 105) return 1;
    if (frame >= 105 && frame < 145) return 2;
    return -1;
  })();

  const cursorX = interpolate(
    frame, CURSOR_WAYPOINTS.map(w => w.frame), CURSOR_WAYPOINTS.map(w => w.x),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const cursorY = interpolate(
    frame, CURSOR_WAYPOINTS.map(w => w.frame), CURSOR_WAYPOINTS.map(w => w.y),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 40% 40%, #0D0A22 0%, ${T.bg} 65%)`,
        opacity: Math.min(fadeIn, fadeOut),
        overflow: 'hidden',
      }}
    >
      <Spotlight x={cursorX} y={cursorY} intensity={1.2} />

      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${zoom}) translateX(${panX}px)`,
        transformOrigin: '50% 50%',
      }}>
        <Sidebar activeItem="people" />
        <div style={{
          position: 'absolute', left: 240, top: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          <Header title="People" subtitle="406 employees · sorted by score" />

          <div style={{ flex: 1, padding: '24px 32px', overflowY: 'hidden' }}>
            {/* Filter bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 20,
            }}>
              {['All', 'Engineering', 'Product', 'Sales', 'Marketing'].map((f, i) => {
                const sp = spring({
                  frame: Math.max(0, frame - i * 5),
                  fps: 30,
                  config: { damping: 18, stiffness: 130 },
                });
                const op = interpolate(sp, [0, 0.4], [0, 1]);
                const tx = interpolate(sp, [0, 1], [12, 0]);
                return (
                  <div key={f} style={{
                    padding: '6px 16px',
                    borderRadius: 100,
                    background: i === 0 ? T.primaryDim : T.elevated,
                    border: `1px solid ${i === 0 ? T.primary + '50' : T.border}`,
                    fontFamily: T.sans, fontSize: 13, fontWeight: i === 0 ? 600 : 400,
                    color: i === 0 ? T.primary : T.text2,
                    opacity: op,
                    transform: `translateX(${tx}px)`,
                  }}>{f}</div>
                );
              })}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text3 }}>Sort: </span>
                <div style={{
                  padding: '6px 14px',
                  background: T.elevated, border: `1px solid ${T.border}`,
                  borderRadius: T.r8, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text2 }}>Engagement ↓</span>
                </div>
              </div>
            </div>

            <EmployeeGrid highlightIndex={highlightIdx} enterDelay={5} />
          </div>
        </div>
      </div>

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Cursor frame={frame} waypoints={CURSOR_WAYPOINTS} opacity={1} />
      </svg>
    </AbsoluteFill>
  );
};
