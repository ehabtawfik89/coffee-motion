import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from './colors';
import { IceCreamCone } from './IceCream';

// Animated drip paths for decoration
const DripDecoration: React.FC<{ x: number; y: number; color: string; length: number; delay: number }> = ({
  x, y, color, length, delay
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prog = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  const dripLen = interpolate(prog, [0, 1], [0, length]);

  return (
    <g>
      <path
        d={`M ${x},${y} Q ${x + 5},${y + dripLen * 0.5} ${x},${y + dripLen}`}
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        fill="none"
      />
      {dripLen > length * 0.8 && (
        <circle cx={x} cy={y + dripLen} r={7} fill={color} />
      )}
    </g>
  );
};

// Star burst
const StarBurst: React.FC<{ cx: number; cy: number; r: number; color: string; frame: number; delay: number }> = ({
  cx, cy, r, color, frame, delay
}) => {
  const { fps } = useVideoConfig();
  const prog = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const scale = interpolate(prog, [0, 0.5, 0.8, 1], [0, 1.2, 0.9, 1]);
  const points = 8;
  const pts = Array.from({ length: points * 2 }, (_, i) => {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    return `${cx + Math.cos(angle) * radius * scale},${cy + Math.sin(angle) * radius * scale}`;
  }).join(' ');

  return <polygon points={pts} fill={color} opacity={0.9} />;
};

export const Scene3Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Central cone entrance
  const coneSpring = spring({ frame, fps, config: { damping: 11, stiffness: 90 } });
  const coneScale = interpolate(coneSpring, [0, 0.6, 0.85, 1], [0, 1.15, 0.95, 1]);

  // Text reveals
  const priceDelay = 25;
  const priceSpring = spring({
    frame: Math.max(0, frame - priceDelay),
    fps,
    config: { damping: 10, stiffness: 160 },
  });
  const priceScale = interpolate(priceSpring, [0, 0.5, 0.8, 1], [0, 1.3, 0.9, 1]);

  const badgeDelay = 18;
  const badgeSpring = spring({
    frame: Math.max(0, frame - badgeDelay),
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 0.6, 0.85, 1], [0, 1.1, 0.95, 1]);

  // Rotating gradient ring
  const ringRotation = interpolate(frame, [0, 300], [0, 360]);

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    cx: 540 + Math.cos((i / 12) * Math.PI * 2) * 380,
    cy: 540 + Math.sin((i / 12) * Math.PI * 2) * 380,
    r: 6 + (i % 3) * 4,
    color: [COLORS.strawberry, COLORS.mint, COLORS.blueberry, COLORS.vanilla][i % 4],
    phase: i * 0.5,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, #FFF0F8 0%, #F8F0FF 40%, #F0FFF8 100%)`,
        overflow: 'hidden',
      }}
    >
      <svg width={1080} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* Outer rotating ring */}
        <g transform={`rotate(${ringRotation}, 540, 540)`}>
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const x1 = 540 + Math.cos(angle) * 440;
            const y1 = 540 + Math.sin(angle) * 440;
            const x2 = 540 + Math.cos(angle) * 470;
            const y2 = 540 + Math.sin(angle) * 470;
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={[COLORS.strawberry, COLORS.mint, COLORS.blueberry, COLORS.vanilla][i % 4]}
                strokeWidth={4}
                opacity={0.4}
              />
            );
          })}
        </g>

        {/* Background gradient circles */}
        <circle cx={540} cy={540} r={420} fill={COLORS.strawberry} opacity={0.05} />
        <circle cx={540} cy={540} r={340} fill={COLORS.mint} opacity={0.07} />
        <circle cx={540} cy={540} r={260} fill={COLORS.blueberry} opacity={0.05} />

        {/* Floating particles */}
        {particles.map((p, i) => {
          const floatY = Math.sin(frame * 0.05 + p.phase) * 12;
          const floatX = Math.cos(frame * 0.04 + p.phase) * 8;
          return (
            <circle
              key={i}
              cx={p.cx + floatX}
              cy={p.cy + floatY}
              r={p.r}
              fill={p.color}
              opacity={0.7}
            />
          );
        })}

        {/* Star bursts */}
        <StarBurst cx={200} cy={200} r={40} color={COLORS.sprinkleYellow} frame={frame} delay={20} />
        <StarBurst cx={880} cy={180} r={32} color={COLORS.sprinkleRed} frame={frame} delay={30} />
        <StarBurst cx={160} cy={820} r={36} color={COLORS.sprinkleBlue} frame={frame} delay={25} />
        <StarBurst cx={900} cy={840} r={44} color={COLORS.sprinkleGreen} frame={frame} delay={35} />

        {/* Top banner drips */}
        <rect x={0} y={0} width={1080} height={80} fill={COLORS.strawberry} />
        {[60, 120, 200, 280, 340, 440, 520, 600, 680, 760, 840, 920, 980].map((x, i) => (
          <DripDecoration
            key={i}
            x={x}
            y={80}
            color={COLORS.strawberry}
            length={30 + (i % 3) * 20}
            delay={i * 3}
          />
        ))}

        {/* Bottom banner */}
        <rect x={0} y={980} width={1080} height={100} fill={COLORS.strawberry} />

        {/* Central hero ice cream */}
        <g transform={`translate(540, 560) scale(${coneScale})`}>
          <IceCreamCone x={0} y={0} scale={1.2} flavor="strawberry" wobble />
        </g>

        {/* "ONLY" badge */}
        <g transform={`translate(820, 290) scale(${badgeScale})`}>
          <circle cx={0} cy={0} r={88} fill={COLORS.sprinkleYellow} />
          <circle cx={0} cy={0} r={82} fill={COLORS.sprinkleYellow} />
          <circle cx={0} cy={0} r={82} fill="none" stroke={COLORS.coneMain} strokeWidth={3} strokeDasharray="8 5" />
          <text
            textAnchor="middle"
            y={-18}
            fontSize={22}
            fontWeight={900}
            fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
            fill={COLORS.textDark}
          >
            ONLY
          </text>
          <text
            textAnchor="middle"
            y={28}
            fontSize={52}
            fontWeight={900}
            fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
            fill={COLORS.textDark}
            transform={`scale(${priceScale})`}
          >
            $3
          </text>
          <text
            textAnchor="middle"
            y={55}
            fontSize={20}
            fontFamily='"Georgia", serif'
            fill={COLORS.textMedium}
          >
            per scoop
          </text>
        </g>

        {/* Side text - Freshly Made */}
        <g transform={`translate(180, 350)`}>
          {['FRESHLY', 'MADE', 'DAILY'].map((word, i) => {
            const ws = spring({
              frame: Math.max(0, frame - i * 8),
              fps,
              config: { damping: 14, stiffness: 100 },
            });
            const wx = interpolate(ws, [0, 1], [-120, 0]);
            const wo = interpolate(ws, [0, 0.3], [0, 1]);
            return (
              <text
                key={word}
                x={wx}
                y={i * 68}
                fontSize={54}
                fontWeight={900}
                fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
                fill={[COLORS.strawberry, COLORS.mintDark, COLORS.blueberry][i]}
                opacity={wo}
              >
                {word}
              </text>
            );
          })}
        </g>

        {/* Quality stars */}
        {[0, 1, 2, 3, 4].map((i) => {
          const ss = spring({
            frame: Math.max(0, frame - 40 - i * 5),
            fps,
            config: { damping: 8, stiffness: 200 },
          });
          const sScale = interpolate(ss, [0, 0.5, 0.8, 1], [0, 1.4, 0.9, 1]);
          return (
            <text
              key={i}
              x={390 + i * 62}
              y={950}
              textAnchor="middle"
              fontSize={44}
              transform={`scale(${sScale})`}
              style={{ transformOrigin: `${390 + i * 62}px 950px` }}
            >
              ⭐
            </text>
          );
        })}

        {/* Bottom white text */}
        <g transform={`translate(540, 1010)`}>
          {(() => {
            const ts = spring({
              frame: Math.max(0, frame - 45),
              fps,
              config: { damping: 14, stiffness: 100 },
            });
            const ty = interpolate(ts, [0, 1], [30, 0]);
            const to = interpolate(ts, [0, 0.3], [0, 1]);
            return (
              <text
                textAnchor="middle"
                y={ty}
                fontSize={30}
                fontWeight={700}
                fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
                fill={COLORS.white}
                opacity={to}
                letterSpacing={6}
              >
                SCOOPY ICE CREAM
              </text>
            );
          })()}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
