import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KPIRow } from '../components/KPICards';
import { LineChart } from '../components/LineChart';
import { DonutChart } from '../components/DonutChart';
import { BarChart } from '../components/BarChart';
import { NotificationPanel } from '../components/NotificationPanel';
import { Cursor, Spotlight, Waypoint } from '../components/Cursor';

const CURSOR_WAYPOINTS: Waypoint[] = [
  { frame: 0,   x: 960,  y: 540  },
  { frame: 40,  x: 500,  y: 230  },
  { frame: 80,  x: 900,  y: 230  },
  { frame: 120, x: 1300, y: 230  },
  { frame: 160, x: 1700, y: 230  },
  { frame: 200, x: 700,  y: 580  },
  { frame: 240, x: 960,  y: 700  },
  { frame: 270, x: 1600, y: 650  },
];

interface ActivityFeedProps {
  enterDelay?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ enterDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: Math.max(0, frame - enterDelay), fps, config: { damping: 20, stiffness: 100 } });
  const opacity = interpolate(sp, [0, 0.4], [0, 1]);

  const items = [
    { initials: 'PP', g: ['#6366F1', '#8B5CF6'], name: 'Priya Patel', action: 'completed pulse survey', time: '5m' },
    { initials: 'SC', g: ['#06B6D4', '#3B82F6'], name: 'Sarah Chen', action: 'updated team OKRs', time: '22m' },
    { initials: 'MJ', g: ['#10B981', '#06B6D4'], name: 'Marcus Johnson', action: 'gave peer feedback', time: '1h' },
    { initials: 'AK', g: ['#F43F5E', '#F59E0B'], name: 'Alex Kim', action: 'joined Engineering guild', time: '2h' },
  ];

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r16, overflow: 'hidden', opacity }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.text1 }}>Recent Activity</span>
      </div>
      <div>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 18px',
            borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : 'none',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${item.g[0]}, ${item.g[1]})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'white', fontFamily: T.sans,
              flexShrink: 0,
            }}>{item.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.text1 }}>{item.name}</span>
              <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text2 }}> {item.action}</span>
            </div>
            <span style={{ fontFamily: T.sans, fontSize: 11, color: T.text3, flexShrink: 0 }}>{item.time} ago</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Scene2Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera: starts zoomed in slightly, pulls out to overview, then zooms to top
  const zoom = interpolate(frame, [0, 60, 210, 270], [1.06, 1.0, 1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const panY = interpolate(frame, [210, 270], [0, -60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade in/out
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [255, 270], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Chart progress
  const chartProgress = interpolate(frame, [50, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Cursor pos from waypoints
  const cursorX = interpolate(
    frame,
    CURSOR_WAYPOINTS.map(w => w.frame),
    CURSOR_WAYPOINTS.map(w => w.x),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const cursorY = interpolate(
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
      {/* Spotlight */}
      <Spotlight x={cursorX} y={cursorY} intensity={1.2} />

      {/* Camera wrapper */}
      <div style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${zoom}) translateY(${panY}px)`,
        transformOrigin: '50% 30%',
      }}>
        {/* Sidebar */}
        <Sidebar activeItem="dashboard" enterDelay={0} />

        {/* Main content area */}
        <div style={{
          position: 'absolute',
          left: 240,
          top: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Header title="Dashboard" subtitle="Q4 2024 Overview" enterDelay={8} />

          {/* Body */}
          <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'hidden' }}>
            {/* KPI Row */}
            <KPIRow enterDelay={15} animProgress={chartProgress} />

            {/* Charts row */}
            <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
              {/* Main line chart */}
              <div style={{
                flex: '1 1 0',
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: T.r16,
                padding: '20px 24px',
              }}>
                <LineChart drawProgress={chartProgress} enterDelay={30} />
              </div>

              {/* Right column */}
              <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Donut */}
                <div style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.r16,
                  padding: '16px 20px',
                }}>
                  <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.text1, marginBottom: 14 }}>
                    Sentiment Split
                  </div>
                  <DonutChart size={150} enterDelay={40} progress={chartProgress} />
                </div>

                {/* Activity feed */}
                <ActivityFeed enterDelay={55} />
              </div>
            </div>

            {/* Bottom row */}
            <div style={{ display: 'flex', gap: 20, height: 280 }}>
              <div style={{
                flex: 1,
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: T.r16,
                padding: '20px 24px',
              }}>
                <BarChart enterDelay={60} progress={chartProgress} />
              </div>

              <div style={{ width: 340 }}>
                <NotificationPanel enterDelay={70} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cursor overlay */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Cursor frame={frame} waypoints={CURSOR_WAYPOINTS} opacity={0.9} />
      </svg>
    </AbsoluteFill>
  );
};
