import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { T } from '../theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const WEEKS = 12;

// Generate pseudo-random heatmap data (seeded, deterministic)
function seededRandom(seed: number) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const HEATMAP_DATA: number[][] = Array.from({ length: DAYS.length }, (_, d) =>
  Array.from({ length: WEEKS }, (_, w) =>
    Math.round(seededRandom(d * 100 + w * 7) * 100)
  )
);

function heatColor(value: number): string {
  if (value < 20) return T.elevated;
  if (value < 40) return `${T.primary}35`;
  if (value < 60) return `${T.primary}60`;
  if (value < 80) return `${T.primary}90`;
  return T.primary;
}

interface HeatmapProps {
  enterDelay?: number;
  label?: string;
}

export const EngagementHeatmap: React.FC<HeatmapProps> = ({
  enterDelay = 0,
  label = 'Engagement Activity',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [enterDelay, enterDelay + 45],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cellW = 28;
  const cellH = 22;
  const gapX  = 4;
  const gapY  = 4;
  const padL  = 40;
  const padT  = 32;

  const totalW = padL + WEEKS * (cellW + gapX);
  const totalH = padT + DAYS.length * (cellH + gapY) + 20;

  // Week labels (last 12 weeks)
  const weekLabels = Array.from({ length: WEEKS }, (_, i) => {
    const d = new Date(2024, 9, 1); // Oct 2024
    d.setDate(d.getDate() + i * 7);
    return i % 3 === 0 ? `W${i + 1}` : '';
  });

  const totalCells = DAYS.length * WEEKS;
  const cellsVisible = Math.floor(progress * totalCells);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text1, margin: 0 }}>
          {label}
        </h3>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.text3, margin: '3px 0 0' }}>
          Check-ins per week — last 12 weeks
        </p>
      </div>

      <svg width={totalW} height={totalH}>
        {/* Day labels */}
        {DAYS.map((day, d) => (
          <text
            key={day}
            x={padL - 8}
            y={padT + d * (cellH + gapY) + cellH / 2 + 4}
            textAnchor="end"
            fontSize={11}
            fontFamily={T.sans}
            fill={T.text3}
          >{day}</text>
        ))}

        {/* Week labels */}
        {weekLabels.map((wl, w) => wl && (
          <text
            key={w}
            x={padL + w * (cellW + gapX) + cellW / 2}
            y={padT - 10}
            textAnchor="middle"
            fontSize={10}
            fontFamily={T.sans}
            fill={T.text3}
          >{wl}</text>
        ))}

        {/* Cells */}
        {DAYS.map((_, d) =>
          Array.from({ length: WEEKS }, (__, w) => {
            const cellIdx = d * WEEKS + w;
            const revealed = cellIdx < cellsVisible;
            const val = HEATMAP_DATA[d][w];
            const cx = padL + w * (cellW + gapX);
            const cy = padT + d * (cellH + gapY);

            return (
              <rect
                key={`${d}-${w}`}
                x={cx}
                y={cy}
                width={cellW}
                height={cellH}
                rx={4}
                fill={heatColor(revealed ? val : 0)}
                opacity={revealed ? 1 : 0.15}
              />
            );
          })
        )}

        {/* Legend */}
        <g transform={`translate(${padL}, ${totalH - 16})`}>
          <text x={0} y={0} fontSize={10} fontFamily={T.sans} fill={T.text3}>Less</text>
          {[0, 20, 40, 60, 80, 100].map((v, i) => (
            <rect key={v} x={36 + i * 20} y={-12} width={16} height={12} rx={3} fill={heatColor(v)} />
          ))}
          <text x={36 + 6 * 20 + 4} y={0} fontSize={10} fontFamily={T.sans} fill={T.text3}>More</text>
        </g>
      </svg>
    </div>
  );
};

// ─── Gauge / Score widget ─────────────────────────────────────────────────────
interface GaugeProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  delay?: number;
}

export const ScoreGauge: React.FC<GaugeProps> = ({ label, value, max = 10, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [delay, delay + 40],
    [0, value / max],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const size = 88;
  const r = 34;
  const circ = 2 * Math.PI * r;
  const arcLen = circ * 0.75; // 270° sweep
  const filled = arcLen * progress;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={T.elevated} strokeWidth={6}
          strokeDasharray={`${arcLen} ${circ - arcLen}`} strokeLinecap="round" />
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div style={{ marginTop: -60, textAlign: 'center' }}>
        <div style={{ fontFamily: T.sans, fontSize: 22, fontWeight: 800, color: T.text1, lineHeight: 1 }}>
          {(progress * max).toFixed(1)}
        </div>
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.text2, textAlign: 'center', marginTop: 8 }}>
        {label}
      </div>
    </div>
  );
};
