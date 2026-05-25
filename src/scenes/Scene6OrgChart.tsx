import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { OrgChartViz } from '../components/OrgChart';
import { Cursor, Spotlight, Waypoint } from '../components/Cursor';

const CURSOR_WAYPOINTS: Waypoint[] = [
  { frame: 0,   x: 960,  y: 200  },
  { frame: 35,  x: 480,  y: 380, click: true },
  { frame: 75,  x: 960,  y: 380  },
  { frame: 110, x: 1440, y: 380  },
  { frame: 145, x: 750,  y: 560  },
  { frame: 170, x: 1170, y: 560  },
];

// Floating stat overlay for org chart
const OrgStat: React.FC<{ label: string; value: string; color: string; x: number; y: number; delay: number }> = ({
  label, value, color, x, y, delay
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 160 } });
  const s = interpolate(sp, [0, 0.5, 0.8, 1], [0, 1.1, 0.95, 1]);
  const op = interpolate(sp, [0, 0.25], [0, 1]);

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `scale(${s})`, opacity: op,
      background: T.card,
      border: `1px solid ${color}40`,
      borderRadius: T.r12,
      padding: '10px 18px',
      boxShadow: `0 0 24px ${color}15`,
      pointerEvents: 'none',
    }}>
      <div style={{ fontFamily: T.sans, fontSize: 22, fontWeight: 900, color: color }}>{value}</div>
      <div style={{ fontFamily: T.sans, fontSize: 11, color: T.text3, marginTop: 2 }}>{label}</div>
    </div>
  );
};

export const Scene6OrgChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0,  15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Camera: start slightly above center, then pull back to show full tree
  const zoom   = interpolate(frame, [0, 50, 160, 180], [1.18, 1.0, 1.0, 1.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const panY   = interpolate(frame, [0, 50], [-80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
        background: `radial-gradient(ellipse at 50% 30%, #0D0A22 0%, ${T.bg} 65%)`,
        opacity: Math.min(fadeIn, fadeOut),
        overflow: 'hidden',
      }}
    >
      <Spotlight x={cursorX} y={cursorY} intensity={1.2} />

      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${zoom}) translateY(${panY}px)`,
        transformOrigin: '50% 40%',
      }}>
        <Sidebar activeItem="people" />
        <div style={{
          position: 'absolute', left: 240, top: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          <Header title="Org Chart" subtitle="Acme Corp · 406 employees" />

          <div style={{ flex: 1, padding: '20px 32px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
            {/* Depth / legend bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '10px 16px',
              background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r12,
            }}>
              {[
                { label: 'C-Suite', color: T.primary },
                { label: 'VPs', color: T.accent },
                { label: 'Managers', color: T.success },
                { label: 'ICs', color: T.cyan },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text2 }}>{item.label}</span>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                {[
                  { label: 'Avg NPS', value: '9.1', color: T.success },
                  { label: 'Departments', value: '6', color: T.primary },
                  { label: 'Headcount', value: '406', color: T.accent },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontFamily: T.sans, fontSize: 10, color: T.text3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Org tree */}
            <div style={{
              flex: 1,
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: T.r16,
              padding: '24px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}>
              <OrgChartViz width={1560} height={660} enterDelay={0} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating stats */}
      {frame > 60 && <OrgStat label="Top score" value="9.6" color={T.success} x={80} y={180} delay={60} />}
      {frame > 90 && <OrgStat label="Avg tenure" value="3.2y" color={T.warning} x={80} y={310} delay={90} />}
      {frame > 120 && <OrgStat label="Open roles" value="14" color={T.info} x={1740} y={180} delay={120} />}

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Cursor frame={frame} waypoints={CURSOR_WAYPOINTS} opacity={0.9} />
      </svg>
    </AbsoluteFill>
  );
};
