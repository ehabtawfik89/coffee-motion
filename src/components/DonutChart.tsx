import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

const SEGMENTS = [
  { label: 'Promoters',  value: 62, color: T.success },
  { label: 'Passives',   value: 24, color: T.warning },
  { label: 'Detractors', value: 14, color: T.danger },
];

interface DonutChartProps {
  size?: number;
  enterDelay?: number;
  progress?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  size = 180,
  enterDelay = 0,
  progress: externalProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({
    frame: Math.max(0, frame - enterDelay),
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  const animProgress = externalProgress !== undefined
    ? externalProgress
    : interpolate(sp, [0, 1], [0, 1]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.18;
  const circumference = 2 * Math.PI * r;

  // Build arc segments
  let currentAngle = -Math.PI / 2; // start at 12 o'clock
  const total = SEGMENTS.reduce((s, d) => s + d.value, 0);

  const arcs = SEGMENTS.map((seg) => {
    const fraction = (seg.value / total) * animProgress;
    const sweep = fraction * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle + 0.03; // small gap

    // SVG arc
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = sweep > Math.PI ? 1 : 0;

    return {
      ...seg,
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      midAngle: startAngle + sweep / 2,
    };
  });

  // Scale entrance
  const scale = interpolate(sp, [0, 0.5, 0.8, 1], [0.5, 1.05, 0.97, 1]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {/* Donut */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg
          width={size}
          height={size}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        >
          {/* Background ring */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={T.border}
            strokeWidth={strokeW}
          />

          {/* Segments */}
          {arcs.map((arc) => (
            <path
              key={arc.label}
              d={arc.path}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeW}
              strokeLinecap="butt"
            />
          ))}

          {/* Glow ring on top segment */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={SEGMENTS[0].color}
            strokeWidth={2}
            strokeDasharray={`${(SEGMENTS[0].value / total) * animProgress * circumference} ${circumference}`}
            strokeDashoffset={circumference / 4}
            opacity={0.4}
          />

          {/* Center text */}
          <text x={cx} y={cy - 8} textAnchor="middle"
            fontSize={size * 0.18} fontWeight={800}
            fontFamily={T.sans} fill={T.text1}>
            78.4
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle"
            fontSize={size * 0.09} fontFamily={T.sans} fill={T.text3}>
            eNPS Score
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SEGMENTS.map((seg, i) => {
          const legendSp = spring({
            frame: Math.max(0, frame - enterDelay - i * 8),
            fps,
            config: { damping: 18, stiffness: 120 },
          });
          const legendOp = interpolate(legendSp, [0, 0.4], [0, 1]);
          const legendX = interpolate(legendSp, [0, 1], [12, 0]);

          return (
            <div
              key={seg.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: legendOp,
                transform: `translateX(${legendX}px)`,
              }}
            >
              <div style={{
                width: 10, height: 10, borderRadius: 3,
                background: seg.color, flexShrink: 0,
              }} />
              <div>
                <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.text1 }}>
                  {seg.value}%
                </div>
                <div style={{ fontFamily: T.sans, fontSize: 11, color: T.text3 }}>
                  {seg.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
