import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { T } from '../theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ENGAGEMENT_DATA = [7.1, 7.3, 7.0, 7.5, 7.7, 7.6, 7.9, 8.1, 8.0, 8.3, 8.5, 8.7];
const NPS_DATA        = [52,  55,  53,  59,  62,  60,  65,  68,  66,  71,  75,  78];

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const cp = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cp.toFixed(1)} ${pts[i - 1].y.toFixed(1)} ${cp.toFixed(1)} ${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }
  return d;
}

interface LineChartProps {
  width?: number;
  height?: number;
  drawProgress?: number;  // 0-1
  showNPS?: boolean;
  enterDelay?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  width = 920,
  height = 280,
  drawProgress,
  showNPS = true,
  enterDelay = 0,
}) => {
  const frame = useCurrentFrame();

  const progress = drawProgress !== undefined
    ? drawProgress
    : interpolate(frame, [enterDelay, enterDelay + 60], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const padL = 52, padR = 24, padT = 20, padB = 40;
  const W = width - padL - padR;
  const H = height - padT - padB;

  const yMin = 6.5, yMax = 9.2;
  const npsMin = 40, npsMax = 90;

  const toY1 = (v: number) => padT + H - ((v - yMin) / (yMax - yMin)) * H;
  const toY2 = (v: number) => padT + H - ((v - npsMin) / (npsMax - npsMin)) * H;
  const toX  = (i: number) => padL + (i / (MONTHS.length - 1)) * W;

  const engPts  = ENGAGEMENT_DATA.map((v, i) => ({ x: toX(i), y: toY1(v) }));
  const npsPts  = NPS_DATA.map((v, i) => ({ x: toX(i), y: toY2(v) }));
  const engPath = smoothPath(engPts);
  const npsPath = smoothPath(npsPts);
  const clipW   = padL + progress * W;

  // Y grid lines
  const gridLines = [7.0, 7.5, 8.0, 8.5, 9.0];

  // Tooltip – show at frame-based data point
  const tooltipIdx = Math.min(
    MONTHS.length - 1,
    Math.floor(progress * (MONTHS.length - 1))
  );
  const showTooltip = progress > 0.05;

  const tooltipX = toX(tooltipIdx);
  const tooltipY = toY1(ENGAGEMENT_DATA[tooltipIdx]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Chart header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text1, margin: 0 }}>
            Engagement Trend
          </h3>
          <p style={{ fontFamily: T.sans, fontSize: 12, color: T.text3, margin: '3px 0 0' }}>
            Engagement score & NPS — Jan–Dec 2024
          </p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { color: T.primary, label: 'Engagement' },
            { color: T.success, label: 'NPS Index' },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 24, height: 2, borderRadius: 2, background: l.color }} />
              <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text2 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          {/* Engagement area gradient */}
          <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.primary} stopOpacity={0.2} />
            <stop offset="100%" stopColor={T.primary} stopOpacity={0} />
          </linearGradient>
          {/* NPS area gradient */}
          <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.success} stopOpacity={0.12} />
            <stop offset="100%" stopColor={T.success} stopOpacity={0} />
          </linearGradient>
          {/* Clip to progress */}
          <clipPath id="chartProgress">
            <rect x={0} y={0} width={clipW} height={height + 4} />
          </clipPath>
        </defs>

        {/* Grid lines */}
        {gridLines.map((v) => {
          const y = toY1(v);
          return (
            <g key={v}>
              <line
                x1={padL} y1={y} x2={padL + W} y2={y}
                stroke={T.border}
                strokeWidth={1}
              />
              <text
                x={padL - 8} y={y + 4}
                textAnchor="end"
                fontSize={11}
                fontFamily={T.sans}
                fill={T.text3}
              >{v.toFixed(1)}</text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={toX(i)}
            y={height - 6}
            textAnchor="middle"
            fontSize={11}
            fontFamily={T.sans}
            fill={T.text3}
          >{m}</text>
        ))}

        {/* Baseline */}
        <line
          x1={padL} y1={padT + H} x2={padL + W} y2={padT + H}
          stroke={T.borderMid}
          strokeWidth={1}
        />

        {/* NPS area + line */}
        {showNPS && (
          <g clipPath="url(#chartProgress)">
            <path
              d={`${npsPath} L ${npsPts[npsPts.length - 1].x} ${padT + H} L ${npsPts[0].x} ${padT + H} Z`}
              fill="url(#npsGrad)"
            />
            <path
              d={npsPath}
              fill="none"
              stroke={T.success}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="5 4"
            />
          </g>
        )}

        {/* Engagement area + line */}
        <g clipPath="url(#chartProgress)">
          <path
            d={`${engPath} L ${engPts[engPts.length - 1].x} ${padT + H} L ${engPts[0].x} ${padT + H} Z`}
            fill="url(#engGrad)"
          />
          <path
            d={engPath}
            fill="none"
            stroke={T.primary}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>

        {/* Data point dots (appear as progress reaches them) */}
        {engPts.map((pt, i) => {
          const dotProgress = interpolate(
            progress,
            [i / (engPts.length - 1) - 0.02, i / (engPts.length - 1) + 0.02],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={dotProgress * 4}
              fill={T.primary}
              stroke={T.card}
              strokeWidth={2}
            />
          );
        })}

        {/* Tooltip */}
        {showTooltip && (
          <g>
            {/* Vertical line */}
            <line
              x1={tooltipX} y1={padT}
              x2={tooltipX} y2={padT + H}
              stroke={T.borderMid}
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            {/* Tooltip box */}
            <rect
              x={tooltipX + 10}
              y={tooltipY - 34}
              width={118}
              height={52}
              rx={8}
              fill={T.elevated}
              stroke={T.borderMid}
              strokeWidth={1}
            />
            <text
              x={tooltipX + 20}
              y={tooltipY - 14}
              fontSize={11}
              fontFamily={T.sans}
              fill={T.text3}
            >{MONTHS[tooltipIdx]} 2024</text>
            <text
              x={tooltipX + 20}
              y={tooltipY + 8}
              fontSize={15}
              fontWeight={700}
              fontFamily={T.sans}
              fill={T.text1}
            >
              {ENGAGEMENT_DATA[tooltipIdx].toFixed(1)}
            </text>
            <text
              x={tooltipX + 60}
              y={tooltipY + 8}
              fontSize={11}
              fontFamily={T.sans}
              fill={T.success}
            >/ 10</text>
            {/* Anchor dot */}
            <circle cx={tooltipX} cy={tooltipY} r={5} fill={T.primary} stroke={T.card} strokeWidth={2} />
          </g>
        )}
      </svg>
    </div>
  );
};
