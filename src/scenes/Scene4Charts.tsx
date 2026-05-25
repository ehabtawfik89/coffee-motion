import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { LineChart } from '../components/LineChart';
import { BarChart } from '../components/BarChart';
import { DonutChart } from '../components/DonutChart';
import { Cursor, Spotlight, Waypoint } from '../components/Cursor';

const CURSOR_WAYPOINTS: Waypoint[] = [
  { frame: 0,   x: 700, y: 600 },
  { frame: 30,  x: 500, y: 520 },
  { frame: 60,  x: 800, y: 480 },
  { frame: 90,  x: 1100, y: 490 },
  { frame: 130, x: 1400, y: 500 },
  { frame: 160, x: 1200, y: 700 },
];

// Animated stat badge
const StatBadge: React.FC<{ value: string; label: string; color: string; delay: number; x: number; y: number }> = ({
  value, label, color, delay, x, y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 150 } });
  const s = interpolate(sp, [0, 0.5, 0.8, 1], [0, 1.1, 0.95, 1]);
  const op = interpolate(sp, [0, 0.25], [0, 1]);

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `scale(${s})`, opacity: op,
      background: T.elevated,
      border: `1px solid ${color}40`,
      borderRadius: T.r12,
      padding: '12px 20px',
      boxShadow: `0 0 20px ${color}20`,
      pointerEvents: 'none',
      minWidth: 120,
    }}>
      <div style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 900, color: color, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.text3, marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
};

export const Scene4Charts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0,  15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Camera: start focused on chart area, gently pan
  const zoom   = interpolate(frame, [0, 40, 160, 180], [1.22, 1.12, 1.12, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const panY   = interpolate(frame, [0, 40], [-100, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const panX   = interpolate(frame, [60, 160], [0, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Charts animate in
  const chartProgress = interpolate(frame, [10, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
        background: `radial-gradient(ellipse at 50% 50%, #0D0A22 0%, ${T.bg} 65%)`,
        opacity: Math.min(fadeIn, fadeOut),
        overflow: 'hidden',
      }}
    >
      <Spotlight x={cursorX} y={cursorY} intensity={1.3} />

      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
        transformOrigin: '50% 50%',
      }}>
        <Sidebar activeItem="analytics" />
        <div style={{
          position: 'absolute', left: 240, top: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          <Header title="Analytics" subtitle="Trends & Distributions" />

          <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Main chart — full width */}
            <div style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: T.r16,
              padding: '22px 28px',
            }}>
              <LineChart
                width={1580}
                height={300}
                drawProgress={chartProgress}
                showNPS={true}
              />
            </div>

            {/* Bottom: bar + donut side by side */}
            <div style={{ display: 'flex', gap: 20, flex: 1 }}>
              <div style={{
                flex: 1,
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: T.r16,
                padding: '22px 28px',
              }}>
                <BarChart
                  width={920}
                  height={260}
                  enterDelay={20}
                  progress={chartProgress}
                />
              </div>

              <div style={{
                width: 440,
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: T.r16,
                padding: '22px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <h3 style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text1, margin: '0 0 20px' }}>
                  Sentiment Distribution
                </h3>
                <DonutChart size={200} enterDelay={30} progress={chartProgress} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating stat badges */}
      <StatBadge value="8.7" label="Avg score Oct" color={T.primary} delay={60} x={300} y={80} />
      <StatBadge value="+22%" label="YoY NPS growth" color={T.success} delay={80} x={700} y={80} />
      <StatBadge value="142" label="Eng headcount" color={T.accent} delay={100} x={1200} y={80} />

      {/* Cursor */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Cursor frame={frame} waypoints={CURSOR_WAYPOINTS} opacity={0.9} />
      </svg>
    </AbsoluteFill>
  );
};
