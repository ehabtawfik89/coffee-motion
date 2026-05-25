import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { EngagementHeatmap, ScoreGauge } from '../components/Heatmap';
import { NotificationPanel } from '../components/NotificationPanel';
import { Cursor, Spotlight, Waypoint } from '../components/Cursor';

const CURSOR_WAYPOINTS: Waypoint[] = [
  { frame: 0,   x: 700, y: 540 },
  { frame: 35,  x: 500, y: 580 },
  { frame: 70,  x: 800, y: 620 },
  { frame: 105, x: 1600, y: 400 },
  { frame: 140, x: 1600, y: 550, click: true },
];

// Team comparison table
const TeamTable: React.FC<{ enterDelay?: number }> = ({ enterDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const teams = [
    { name: 'Platform Eng', lead: 'Marcus Johnson', score: 8.7, nps: 72, surveys: 94, trend: +0.4 },
    { name: 'Product Design', lead: 'Alex Kim', score: 8.9, nps: 76, surveys: 98, trend: +0.2 },
    { name: 'Frontend Eng', lead: 'Emma Wilson', score: 9.0, nps: 80, surveys: 100, trend: +0.5 },
    { name: 'Sales EMEA', lead: 'Ryan Park', score: 7.8, nps: 58, surveys: 82, trend: -0.1 },
    { name: 'Marketing', lead: 'Jordan Cruz', score: 8.4, nps: 68, surveys: 91, trend: +0.3 },
  ];

  const sp = spring({ frame: Math.max(0, frame - enterDelay), fps, config: { damping: 20, stiffness: 100 } });
  const opacity = interpolate(sp, [0, 0.4], [0, 1]);
  const ty = interpolate(sp, [0, 1], [20, 0]);

  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: T.r16,
      overflow: 'hidden',
      opacity,
      transform: `translateY(${ty}px)`,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '14px 20px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.text1, flex: 1 }}>Team Leaderboard</span>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text3 }}>Q4 2024</span>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '200px 1fr 80px 70px 80px 80px',
        padding: '8px 20px', borderBottom: `1px solid ${T.border}`,
      }}>
        {['Team', 'Lead', 'Score', 'NPS', 'Surveys', 'Trend'].map((h) => (
          <span key={h} style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.text3, letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {teams.map((team, i) => {
        const rowSp = spring({ frame: Math.max(0, frame - enterDelay - i * 8), fps, config: { damping: 18, stiffness: 120 } });
        const rowOp = interpolate(rowSp, [0, 0.4], [0, 1]);
        const rowTx = interpolate(rowSp, [0, 1], [-16, 0]);
        const positive = team.trend >= 0;

        return (
          <div key={team.name} style={{
            display: 'grid', gridTemplateColumns: '200px 1fr 80px 70px 80px 80px',
            padding: '10px 20px',
            borderBottom: i < teams.length - 1 ? `1px solid ${T.border}` : 'none',
            alignItems: 'center',
            opacity: rowOp,
            transform: `translateX(${rowTx}px)`,
          }}>
            <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.text1 }}>{team.name}</span>
            <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text2 }}>{team.lead}</span>
            {/* Score bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 4, borderRadius: 2,
                background: T.elevated, overflow: 'hidden',
              }}>
                <div style={{ width: `${(team.score / 10) * 100}%`, height: '100%', background: T.primary, borderRadius: 2 }} />
              </div>
              <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.text1 }}>{team.score}</span>
            </div>
            <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text2 }}>{team.nps}</span>
            <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text2 }}>{team.surveys}%</span>
            <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: positive ? T.success : T.danger }}>
              {positive ? '↑' : '↓'} {Math.abs(team.trend)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const Scene7Analytics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0,  15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [135, 150], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const zoom = interpolate(frame, [0, 40], [1.06, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
        background: `radial-gradient(ellipse at 40% 60%, #0D0A22 0%, ${T.bg} 65%)`,
        opacity: Math.min(fadeIn, fadeOut),
        overflow: 'hidden',
      }}
    >
      <Spotlight x={cursorX} y={cursorY} intensity={1.1} />

      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${zoom})`,
        transformOrigin: '50% 50%',
      }}>
        <Sidebar activeItem="pulse" />
        <div style={{
          position: 'absolute', left: 240, top: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          <Header title="Pulse & Analytics" subtitle="Live engagement signals" />

          <div style={{ flex: 1, padding: '20px 32px', display: 'flex', gap: 20, overflow: 'hidden' }}>
            {/* Left column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Score gauges row */}
              <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: T.r16, padding: '20px 28px',
              }}>
                <h3 style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.text1, margin: '0 0 20px' }}>
                  Pulse Scores — October
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
                  <ScoreGauge label="Engagement" value={8.2} max={10} color={T.primary} delay={10} />
                  <ScoreGauge label="Manager NPS" value={7.8} max={10} color={T.accent} delay={20} />
                  <ScoreGauge label="Wellbeing" value={8.6} max={10} color={T.success} delay={30} />
                  <ScoreGauge label="Belonging" value={8.0} max={10} color={T.cyan} delay={40} />
                  <ScoreGauge label="Growth" value={7.5} max={10} color={T.warning} delay={50} />
                </div>
              </div>

              {/* Heatmap */}
              <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: T.r16, padding: '20px 28px',
                flex: 1,
              }}>
                <EngagementHeatmap enterDelay={20} />
              </div>

              {/* Team table */}
              <TeamTable enterDelay={30} />
            </div>

            {/* Right column: notifications */}
            <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <NotificationPanel enterDelay={5} slideFromRight />

              {/* Mini info card */}
              <div style={{
                background: T.card, border: `1px solid ${T.primaryGlow}`,
                borderRadius: T.r16, padding: '18px 20px',
                boxShadow: `0 0 32px ${T.primaryGlow}`,
              }}>
                <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.text1, marginBottom: 10 }}>
                  AI Insights
                </div>
                {[
                  { text: 'Sales team shows 18% drop in survey participation', icon: '⚠', color: T.warning },
                  { text: 'Engineering NPS at 6-month high — share learnings', icon: '★', color: T.success },
                  { text: '3 employees at flight risk — schedule 1-on-1s', icon: '!', color: T.danger },
                ].map((insight, i) => {
                  const iSp = spring({ frame: Math.max(0, frame - 30 - i * 10), fps, config: { damping: 18, stiffness: 120 } });
                  const iOp = interpolate(iSp, [0, 0.4], [0, 1]);
                  const iTx = interpolate(iSp, [0, 1], [10, 0]);
                  return (
                    <div key={i} style={{
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                      padding: '8px 0',
                      borderTop: i > 0 ? `1px solid ${T.border}` : 'none',
                      opacity: iOp, transform: `translateX(${iTx}px)`,
                    }}>
                      <span style={{ color: insight.color, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{insight.icon}</span>
                      <p style={{ fontFamily: T.sans, fontSize: 12, color: T.text2, margin: 0, lineHeight: 1.5 }}>
                        {insight.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Cursor frame={frame} waypoints={CURSOR_WAYPOINTS} opacity={0.9} />
      </svg>
    </AbsoluteFill>
  );
};
