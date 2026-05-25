import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

// ─── Tiny sparkline SVG ──────────────────────────────────────────────────────
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  progress?: number;
}

const Sparkline: React.FC<SparklineProps> = ({
  data, width = 120, height = 36, color = T.primary, progress = 1,
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 6) - 3,
  }));

  // Smooth bezier path
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cp} ${pts[i - 1].y} ${cp} ${pts[i].y} ${pts[i].x} ${pts[i].y}`;
  }

  // Area
  let area = `${d} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

  const clipWidth = progress * width;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`sc${color.replace('#', '')}`}>
          <rect x={0} y={0} width={clipWidth} height={height + 4} />
        </clipPath>
      </defs>
      <g clipPath={`url(#sc${color.replace('#', '')})`}>
        <path d={area} fill={`url(#sg${color.replace('#', '')})`} />
        <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        {/* Last point dot */}
        {progress > 0.9 && (
          <circle
            cx={pts[pts.length - 1].x}
            cy={pts[pts.length - 1].y}
            r={3}
            fill={color}
          />
        )}
      </g>
    </svg>
  );
};

// ─── Animated number counter ─────────────────────────────────────────────────
function useCountUp(target: number, frame: number, startFrame: number, duration: number, decimals = 0) {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const value = target * progress;
  return value.toFixed(decimals);
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
interface KPICardProps {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  change: number;
  changeLabel?: string;
  sparkData: number[];
  color: string;
  icon: React.ReactNode;
  delay?: number;
  highlighted?: boolean;
  animProgress?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  label, value, decimals = 0, suffix = '', prefix = '',
  change, changeLabel = 'vs last quarter', sparkData, color, icon,
  delay = 0, highlighted = false, animProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 18, stiffness: 120 } });
  const cardScale = interpolate(sp, [0, 0.6, 0.85, 1], [0.88, 1.04, 0.98, 1]);
  const opacity = interpolate(sp, [0, 0.3], [0, 1]);

  const sparkProgress = animProgress !== undefined
    ? animProgress
    : interpolate(frame, [delay + 10, delay + 50], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const countedValue = useCountUp(value, frame, delay, 45, decimals);
  const positive = change >= 0;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: highlighted
          ? `linear-gradient(135deg, ${color}18 0%, ${T.card} 100%)`
          : T.card,
        border: `1px solid ${highlighted ? color + '40' : T.border}`,
        borderRadius: T.r16,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        transform: `scale(${cardScale})`,
        opacity,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: highlighted ? `0 0 40px ${color}22, 0 2px 16px rgba(0,0,0,0.5)` : '0 2px 16px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top accent line */}
      {highlighted && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 500, color: T.text2, letterSpacing: 0.1 }}>
          {label}
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        {prefix && <span style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 600, color: T.text2 }}>{prefix}</span>}
        <span style={{
          fontFamily: T.sans,
          fontSize: 44,
          fontWeight: 800,
          color: T.text1,
          letterSpacing: -2,
          lineHeight: 1,
        }}>
          {countedValue}
        </span>
        {suffix && <span style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 500, color: T.text2 }}>{suffix}</span>}
      </div>

      {/* Change badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          background: positive ? T.successDim : T.dangerDim,
          color: positive ? T.success : T.danger,
          borderRadius: T.r4,
          padding: '2px 7px',
          fontFamily: T.sans,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {positive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text3 }}>{changeLabel}</span>
      </div>

      {/* Sparkline */}
      <Sparkline
        data={sparkData}
        width={140}
        height={38}
        color={color}
        progress={sparkProgress}
      />
    </div>
  );
};

// ─── KPI Row (4 cards) ───────────────────────────────────────────────────────
interface KPIRowProps {
  highlightIndex?: number;
  enterDelay?: number;
  animProgress?: number;
}

export const KPIRow: React.FC<KPIRowProps> = ({
  highlightIndex = -1,
  enterDelay = 0,
  animProgress,
}) => {
  const cards = [
    {
      label: 'Employee NPS',
      value: 78.4, decimals: 1,
      change: 12.3,
      sparkData: [52, 58, 55, 62, 60, 66, 68, 65, 70, 72, 75, 78.4],
      color: T.primary,
      icon: (
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <circle cx={5} cy={4} r={2} fill="currentColor" opacity={0.7} />
          <circle cx={9} cy={4} r={2} fill="currentColor" />
          <path d="M2 12c0-2.2 1.3-3.5 3-3.5h4c1.7 0 3 1.3 3 3.5" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Engagement Score',
      value: 8.2, decimals: 1, suffix: '/10',
      change: 9.8,
      sparkData: [7.1, 7.3, 7.0, 7.4, 7.6, 7.5, 7.7, 7.9, 8.0, 7.9, 8.1, 8.2],
      color: T.success,
      icon: (
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <polyline points="1,10 4,6 7,8 10,3 13,5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Retention Rate',
      value: 94.1, decimals: 1, suffix: '%',
      change: -0.3,
      sparkData: [96, 95.5, 95.8, 95.2, 94.8, 95.0, 94.5, 94.3, 94.6, 94.2, 94.0, 94.1],
      color: T.cyan,
      icon: (
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <circle cx={7} cy={7} r={5.5} stroke="currentColor" strokeWidth={1.3} />
          <path d="M7 4V7L9 9" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Avg Tenure',
      value: 3.2, decimals: 1, suffix: ' yrs',
      change: 14.2,
      sparkData: [2.1, 2.3, 2.4, 2.5, 2.6, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2],
      color: T.warning,
      icon: (
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <rect x={1.5} y={2.5} width={11} height={9} rx={1.5} stroke="currentColor" strokeWidth={1.3} />
          <path d="M4 1.5V3.5M10 1.5V3.5M1.5 5.5H12.5" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {cards.map((card, i) => (
        <KPICard
          key={card.label}
          {...card}
          delay={enterDelay + i * 12}
          highlighted={highlightIndex === i}
          animProgress={animProgress}
        />
      ))}
    </div>
  );
};
