import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

const DEPARTMENTS = [
  { name: 'Engineering', count: 142, color: T.primary },
  { name: 'Sales',       count: 98,  color: T.success },
  { name: 'Product',     count: 67,  color: T.accent },
  { name: 'Marketing',   count: 45,  color: T.warning },
  { name: 'Finance',     count: 31,  color: T.cyan },
  { name: 'HR',          count: 23,  color: T.rose },
];

interface BarChartProps {
  width?: number;
  height?: number;
  enterDelay?: number;
  progress?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  width = 600,
  height = 240,
  enterDelay = 0,
  progress: externalProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerSp = spring({
    frame: Math.max(0, frame - enterDelay),
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const containerOpacity = interpolate(containerSp, [0, 1], [0, 1]);

  const maxCount = Math.max(...DEPARTMENTS.map((d) => d.count));
  const padL = 16, padR = 16, padT = 20, padB = 36;
  const W = width - padL - padR;
  const H = height - padT - padB;
  const barW = (W / DEPARTMENTS.length) * 0.55;
  const gap  = W / DEPARTMENTS.length;

  return (
    <div style={{ opacity: containerOpacity }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text1, margin: 0 }}>
          Headcount by Department
        </h3>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.text3, margin: '3px 0 0' }}>
          Total: 406 employees
        </p>
      </div>
      <svg width={width} height={height}>
        <defs>
          {DEPARTMENTS.map((d) => (
            <linearGradient key={d.name} id={`bar${d.name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={d.color} stopOpacity={0.5} />
            </linearGradient>
          ))}
        </defs>

        {/* Subtle grid */}
        {[0.25, 0.5, 0.75, 1.0].map((frac) => {
          const y = padT + H - frac * H;
          const val = Math.round(frac * maxCount);
          return (
            <g key={frac}>
              <line x1={padL} y1={y} x2={padL + W} y2={y}
                stroke={T.border} strokeWidth={1} />
              <text x={padL - 4} y={y + 4} textAnchor="end"
                fontSize={10} fontFamily={T.sans} fill={T.text3}>{val}</text>
            </g>
          );
        })}

        {/* Bars */}
        {DEPARTMENTS.map((dept, i) => {
          const barSp = spring({
            frame: Math.max(0, frame - enterDelay - i * 6),
            fps,
            config: { damping: 18, stiffness: 130 },
          });
          const barH = (externalProgress !== undefined
            ? externalProgress
            : interpolate(barSp, [0, 1], [0, 1])
          ) * (dept.count / maxCount) * H;

          const x = padL + i * gap + (gap - barW) / 2;
          const y = padT + H - barH;

          return (
            <g key={dept.name}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                fill={`url(#bar${dept.name})`}
              />
              {/* Glow */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.min(barH, 3)}
                rx={4}
                fill={dept.color}
                opacity={0.8}
              />
              {/* Value label */}
              {barH > 20 && (
                <text
                  x={x + barW / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fontFamily={T.sans}
                  fill={T.text1}
                >{dept.count}</text>
              )}
              {/* X label */}
              <text
                x={x + barW / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize={10}
                fontFamily={T.sans}
                fill={T.text3}
              >{dept.name.slice(0, 7)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
