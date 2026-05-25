import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  initials: string;
  gradient: [string, string];
  score?: number;
  children?: OrgNode[];
}

const ORG: OrgNode = {
  id: 'ceo',
  name: 'James Liu',
  role: 'Chief Executive Officer',
  initials: 'JL',
  gradient: ['#6366F1', '#8B5CF6'],
  score: 9.6,
  children: [
    {
      id: 'cto',
      name: 'Priya Patel',
      role: 'Chief Technology Officer',
      initials: 'PP',
      gradient: ['#06B6D4', '#6366F1'],
      score: 9.4,
      children: [
        { id: 'vpe', name: 'Marcus Johnson', role: 'VP Engineering', initials: 'MJ', gradient: ['#10B981', '#06B6D4'], score: 8.7, children: [
          { id: 'em1', name: 'Emma Wilson', role: 'Sr. Engineer', initials: 'EW', gradient: ['#F59E0B', '#EF4444'], score: 9.0 },
          { id: 'em2', name: 'Ryan Park', role: 'Engineer II', initials: 'RP', gradient: ['#6366F1', '#8B5CF6'], score: 8.3 },
        ]},
        { id: 'vpp', name: 'Sarah Chen', role: 'VP Product', initials: 'SC', gradient: ['#8B5CF6', '#F43F5E'], score: 9.2, children: [
          { id: 'pm1', name: 'Alex Kim', role: 'Product Manager', initials: 'AK', gradient: ['#F43F5E', '#F59E0B'], score: 8.9 },
        ]},
      ],
    },
    {
      id: 'cfo',
      name: 'David Martinez',
      role: 'Chief Financial Officer',
      initials: 'DM',
      gradient: ['#F59E0B', '#F43F5E'],
      score: 8.8,
      children: [
        { id: 'fp1', name: 'Lisa Nguyen', role: 'FP&A Manager', initials: 'LN', gradient: ['#10B981', '#06B6D4'], score: 8.5 },
      ],
    },
    {
      id: 'cmo',
      name: 'Taylor Brooks',
      role: 'Chief Marketing Officer',
      initials: 'TB',
      gradient: ['#F43F5E', '#8B5CF6'],
      score: 8.9,
      children: [
        { id: 'mm1', name: 'Jordan Cruz', role: 'Marketing Lead', initials: 'JC', gradient: ['#F59E0B', '#EF4444'], score: 8.6 },
        { id: 'mm2', name: 'Sam Rivera', role: 'Brand Manager', initials: 'SR', gradient: ['#6366F1', '#06B6D4'], score: 8.2 },
      ],
    },
  ],
};

interface NodeProps {
  node: OrgNode;
  cx: number;
  cy: number;
  w: number;
  h: number;
  delay: number;
  drawLine?: { fromX: number; fromY: number };
  lineProgress?: number;
}

const OrgNodeCard: React.FC<NodeProps> = ({ node, cx, cy, w, h, delay, drawLine, lineProgress = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16, stiffness: 120 } });
  const scale = interpolate(sp, [0, 0.6, 0.85, 1], [0, 1.06, 0.97, 1]);
  const opacity = interpolate(sp, [0, 0.25], [0, 1]);

  const x = cx - w / 2;
  const y = cy - h / 2;

  return (
    <g>
      {/* Connector line from parent */}
      {drawLine && lineProgress > 0 && (
        <line
          x1={drawLine.fromX}
          y1={drawLine.fromY}
          x2={cx}
          y2={cy - h / 2}
          stroke={T.borderMid}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          strokeDashoffset={0}
          opacity={lineProgress}
        />
      )}

      {/* Card */}
      <g transform={`translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`} opacity={opacity}>
        {/* Card background */}
        <rect x={x} y={y} width={w} height={h} rx={10} fill={T.card} stroke={T.border} strokeWidth={1} />

        {/* Gradient accent top */}
        <defs>
          <linearGradient id={`node${node.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={node.gradient[0]} />
            <stop offset="100%" stopColor={node.gradient[1]} />
          </linearGradient>
        </defs>
        <rect x={x} y={y} width={w} height={3} rx={2} fill={`url(#node${node.id})`} />

        {/* Avatar circle */}
        <circle cx={x + 22} cy={cy} r={16}
          fill={`url(#node${node.id})`} opacity={0.9} />
        <text x={x + 22} y={cy + 5} textAnchor="middle"
          fontSize={10} fontWeight={700} fontFamily={T.sans} fill="white">
          {node.initials}
        </text>

        {/* Name */}
        <text x={x + 46} y={cy - 5}
          fontSize={11} fontWeight={700} fontFamily={T.sans} fill={T.text1}>
          {node.name}
        </text>

        {/* Role */}
        <text x={x + 46} y={cy + 9}
          fontSize={9} fontFamily={T.sans} fill={T.text3}>
          {node.role.length > 22 ? node.role.slice(0, 22) + '…' : node.role}
        </text>

        {/* Score badge */}
        {node.score !== undefined && (
          <>
            <rect x={x + w - 38} y={cy - 10} width={28} height={20} rx={5}
              fill={T.success + '22'} />
            <text x={x + w - 24} y={cy + 5}
              textAnchor="middle" fontSize={11} fontWeight={700}
              fontFamily={T.sans} fill={T.success}>
              {node.score}
            </text>
          </>
        )}
      </g>
    </g>
  );
};

interface OrgChartProps {
  width?: number;
  height?: number;
  enterDelay?: number;
}

export const OrgChartViz: React.FC<OrgChartProps> = ({
  width = 1600,
  height = 680,
  enterDelay = 0,
}) => {
  const frame = useCurrentFrame();

  const nodeW = 180;
  const nodeH = 56;
  const levelH = [80, 220, 400, 570]; // y positions per level

  // Level 0: CEO
  const ceo = { node: ORG, cx: width / 2, cy: levelH[0] };

  // Level 1: C-Suite (3 nodes)
  const children1 = ORG.children || [];
  const level1Spacing = 520;
  const level1Nodes = children1.map((node, i) => ({
    node,
    cx: width / 2 + (i - 1) * level1Spacing,
    cy: levelH[1],
  }));

  // Level 2: VPs
  const level2Nodes: { node: OrgNode; cx: number; cy: number; parentCx: number }[] = [];
  level1Nodes.forEach((l1) => {
    const kids = l1.node.children || [];
    kids.forEach((kid, i) => {
      const offset = (i - (kids.length - 1) / 2) * 220;
      level2Nodes.push({
        node: kid,
        cx: l1.cx + offset,
        cy: levelH[2],
        parentCx: l1.cx,
      });
    });
  });

  // Level 3: ICs
  const level3Nodes: { node: OrgNode; cx: number; cy: number; parentCx: number }[] = [];
  level2Nodes.forEach((l2) => {
    (l2.node.children || []).forEach((kid, i) => {
      const kids = l2.node.children || [];
      const offset = (i - (kids.length - 1) / 2) * 200;
      level3Nodes.push({
        node: kid,
        cx: l2.cx + offset,
        cy: levelH[3],
        parentCx: l2.cx,
      });
    });
  });

  // Line draw progress per level
  const lineProgress = (level: number) =>
    interpolate(frame, [enterDelay + level * 20, enterDelay + level * 20 + 25], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {/* Level 1 connectors */}
      {level1Nodes.map((l1) => {
        const lp = lineProgress(1);
        return (
          <line key={`line1-${l1.node.id}`}
            x1={ceo.cx} y1={ceo.cy + nodeH / 2}
            x2={l1.cx} y2={l1.cy - nodeH / 2}
            stroke={T.borderMid} strokeWidth={1.5}
            opacity={lp}
          />
        );
      })}

      {/* Level 2 connectors */}
      {level2Nodes.map((l2) => {
        const lp = lineProgress(2);
        return (
          <line key={`line2-${l2.node.id}`}
            x1={l2.parentCx} y1={levelH[1] + nodeH / 2}
            x2={l2.cx} y2={l2.cy - nodeH / 2}
            stroke={T.borderMid} strokeWidth={1.5}
            opacity={lp}
          />
        );
      })}

      {/* Level 3 connectors */}
      {level3Nodes.map((l3) => {
        const lp = lineProgress(3);
        return (
          <line key={`line3-${l3.node.id}`}
            x1={l3.parentCx} y1={levelH[2] + nodeH / 2}
            x2={l3.cx} y2={l3.cy - nodeH / 2}
            stroke={T.borderMid} strokeWidth={1.5}
            opacity={lp}
          />
        );
      })}

      {/* Nodes — deepest first so CEO is on top */}
      {level3Nodes.map((l3, i) => (
        <OrgNodeCard key={l3.node.id} node={l3.node}
          cx={l3.cx} cy={l3.cy} w={nodeW} h={nodeH}
          delay={enterDelay + 60 + i * 6}
        />
      ))}
      {level2Nodes.map((l2, i) => (
        <OrgNodeCard key={l2.node.id} node={l2.node}
          cx={l2.cx} cy={l2.cy} w={nodeW} h={nodeH}
          delay={enterDelay + 35 + i * 8}
        />
      ))}
      {level1Nodes.map((l1, i) => (
        <OrgNodeCard key={l1.node.id} node={l1.node}
          cx={l1.cx} cy={l1.cy} w={nodeW} h={nodeH}
          delay={enterDelay + 12 + i * 8}
        />
      ))}
      <OrgNodeCard node={ceo.node} cx={ceo.cx} cy={ceo.cy} w={nodeW + 20} h={nodeH + 4}
        delay={enterDelay}
      />
    </svg>
  );
};
