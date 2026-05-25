import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

const EMPLOYEES = [
  {
    name: 'Priya Patel',
    role: 'VP Engineering',
    dept: 'Engineering',
    score: 9.4,
    change: '+0.6',
    positive: true,
    initials: 'PP',
    gradient: ['#6366F1', '#8B5CF6'],
    spark: [8.4, 8.6, 8.7, 8.9, 9.0, 9.1, 9.2, 9.3, 9.3, 9.4],
    badges: ['Top Performer', 'Mentor'],
  },
  {
    name: 'Sarah Chen',
    role: 'Head of Product',
    dept: 'Product',
    score: 9.2,
    change: '+0.4',
    positive: true,
    initials: 'SC',
    gradient: ['#06B6D4', '#3B82F6'],
    spark: [8.2, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2],
    badges: ['Rising Star'],
  },
  {
    name: 'Marcus Johnson',
    role: 'Lead Engineer',
    dept: 'Engineering',
    score: 8.7,
    change: '+0.3',
    positive: true,
    initials: 'MJ',
    gradient: ['#10B981', '#06B6D4'],
    spark: [8.0, 8.1, 8.2, 8.2, 8.3, 8.4, 8.5, 8.5, 8.6, 8.7],
    badges: ['Collaborator'],
  },
  {
    name: 'Emma Wilson',
    role: 'Sr. Engineer',
    dept: 'Engineering',
    score: 9.0,
    change: '+0.5',
    positive: true,
    initials: 'EW',
    gradient: ['#F59E0B', '#EF4444'],
    spark: [7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0],
    badges: ['Top Performer'],
  },
  {
    name: 'Alex Kim',
    role: 'UX Designer',
    dept: 'Product',
    score: 8.9,
    change: '+0.2',
    positive: true,
    initials: 'AK',
    gradient: ['#F43F5E', '#F59E0B'],
    spark: [8.3, 8.4, 8.5, 8.5, 8.6, 8.7, 8.7, 8.8, 8.8, 8.9],
    badges: ['Creative Lead'],
  },
  {
    name: 'David Lee',
    role: 'Product Manager',
    dept: 'Product',
    score: 8.1,
    change: '-0.1',
    positive: false,
    initials: 'DL',
    gradient: ['#8B5CF6', '#F43F5E'],
    spark: [8.0, 8.2, 8.1, 8.3, 8.2, 8.1, 8.2, 8.1, 8.2, 8.1],
    badges: ['Needs Support'],
  },
];

// Radial score arc
const ScoreArc: React.FC<{ score: number; size: number; color: string }> = ({ score, size, color }) => {
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const fraction = (score / 10) * 0.75; // 75% of full circle
  const offset = circ * (1 - fraction);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-135deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={T.elevated} strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={`${circ * fraction} ${circ * (1 - fraction)}`}
        strokeLinecap="round" />
    </svg>
  );
};

// Mini bar sparkline
const MiniBar: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const h = 28;
  return (
    <svg width={80} height={h}>
      {data.map((v, i) => {
        const barH = ((v - min) / (max - min || 1)) * (h - 4) + 4;
        return (
          <rect
            key={i}
            x={i * 8 + 1}
            y={h - barH}
            width={6}
            height={barH}
            rx={2}
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
};

interface EmployeeCardProps {
  employee: typeof EMPLOYEES[number];
  delay: number;
  highlighted?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee: e, delay, highlighted }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16, stiffness: 110 } });
  const ty = interpolate(sp, [0, 1], [40, 0]);
  const opacity = interpolate(sp, [0, 0.3], [0, 1]);
  const scale = interpolate(sp, [0, 0.6, 0.85, 1], [0.94, 1.02, 0.99, 1]);

  const deptColors: Record<string, string> = {
    Engineering: T.primary,
    Product: T.cyan,
    Sales: T.success,
    Marketing: T.warning,
    HR: T.rose,
    Finance: T.accent,
  };
  const deptColor = deptColors[e.dept] || T.primary;

  return (
    <div
      style={{
        background: highlighted ? `linear-gradient(135deg, ${e.gradient[0]}18, ${T.card})` : T.card,
        border: `1px solid ${highlighted ? e.gradient[0] + '50' : T.border}`,
        borderRadius: T.r16,
        padding: '20px',
        transform: `translateY(${ty}px) scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: highlighted ? `0 0 32px ${e.gradient[0]}20` : '0 2px 12px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      {highlighted && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${e.gradient[0]}, ${e.gradient[1]})`,
        }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: `linear-gradient(135deg, ${e.gradient[0]}, ${e.gradient[1]})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: 'white', fontFamily: T.sans,
          flexShrink: 0,
          boxShadow: `0 0 16px ${e.gradient[0]}50`,
        }}>
          {e.initials}
        </div>

        {/* Name + role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {e.name}
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 12, color: T.text2, marginTop: 2 }}>
            {e.role}
          </div>
        </div>

        {/* Score arc */}
        <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
          <ScoreArc score={e.score} size={52} color={e.gradient[0]} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            marginTop: 4,
          }}>
            <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 800, color: T.text1, lineHeight: 1 }}>
              {e.score}
            </div>
          </div>
        </div>
      </div>

      {/* Dept + badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          background: `${deptColor}18`, color: deptColor,
          borderRadius: T.r4, padding: '2px 8px',
          fontFamily: T.sans, fontSize: 11, fontWeight: 600,
        }}>{e.dept}</span>
        {e.badges.map((b) => (
          <span key={b} style={{
            background: T.elevated, color: T.text2,
            borderRadius: T.r4, padding: '2px 8px',
            fontFamily: T.sans, fontSize: 11,
            border: `1px solid ${T.border}`,
          }}>{b}</span>
        ))}
      </div>

      {/* Bottom row: sparkline + trend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MiniBar data={e.spark} color={e.gradient[0]} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: e.positive ? T.success : T.danger,
          fontFamily: T.sans, fontSize: 12, fontWeight: 600,
        }}>
          <span>{e.positive ? '↑' : '↓'}</span>
          <span>{e.change} this quarter</span>
        </div>
      </div>
    </div>
  );
};

interface EmployeeGridProps {
  highlightIndex?: number;
  enterDelay?: number;
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  highlightIndex = -1,
  enterDelay = 0,
}) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  }}>
    {EMPLOYEES.map((emp, i) => (
      <EmployeeCard
        key={emp.name}
        employee={emp}
        delay={enterDelay + i * 10}
        highlighted={highlightIndex === i}
      />
    ))}
  </div>
);
