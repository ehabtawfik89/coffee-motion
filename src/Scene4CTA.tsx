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
import { Sprinkles } from './Sprinkles';

// Confetti piece
interface ConfettiPiece {
  x: number;
  vy: number;
  vx: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  shape: 'rect' | 'circle';
}

const CONFETTI: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
  x: (i / 40) * 1100 - 10,
  vy: 2 + (i % 5) * 1.2,
  vx: Math.sin(i * 1.3) * 1.5,
  color: [
    COLORS.sprinkleRed,
    COLORS.sprinkleBlue,
    COLORS.sprinkleYellow,
    COLORS.sprinkleGreen,
    COLORS.sprinklePink,
    COLORS.sprinkleOrange,
    COLORS.strawberry,
    COLORS.mint,
  ][i % 8],
  rotation: i * 17,
  rotationSpeed: 2 + (i % 4),
  size: 10 + (i % 4) * 5,
  shape: i % 3 === 0 ? 'circle' : 'rect',
}));

const ConfettiLayer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {CONFETTI.map((c, i) => {
        const y = -40 + c.vy * frame * 1.5 + Math.sin(frame * 0.05 + i) * 15;
        const x = c.x + c.vx * frame + Math.cos(frame * 0.04 + i) * 8;
        const rot = c.rotation + c.rotationSpeed * frame;
        const wrappedY = ((y % 1120) + 1120) % 1120;

        if (c.shape === 'circle') {
          return (
            <circle
              key={i}
              cx={x}
              cy={wrappedY}
              r={c.size / 2}
              fill={c.color}
              opacity={0.8}
            />
          );
        }
        return (
          <rect
            key={i}
            x={x - c.size / 2}
            y={wrappedY - c.size / 4}
            width={c.size}
            height={c.size / 2}
            rx={2}
            fill={c.color}
            opacity={0.8}
            transform={`rotate(${rot}, ${x}, ${wrappedY})`}
          />
        );
      })}
    </>
  );
};

export const Scene4CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Big headline
  const headSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const headScale = interpolate(headSpring, [0, 0.6, 0.85, 1], [0, 1.1, 0.97, 1]);
  const headOpacity = interpolate(headSpring, [0, 0.2], [0, 1]);

  // CTA button pulse
  const btnPulse = 1 + Math.sin(frame * 0.15) * 0.04;

  // Sub items
  const items = [
    { text: '🍓  Made with real fruit', delay: 15 },
    { text: '🥛  Premium cream', delay: 22 },
    { text: '🌿  No artificial colors', delay: 29 },
  ];

  // Cones entrance
  const leftConeSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12, stiffness: 90 } });
  const rightConeSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 12, stiffness: 90 } });
  const leftConeX = interpolate(leftConeSpring, [0, 1], [-200, 0]);
  const rightConeX = interpolate(rightConeSpring, [0, 1], [200, 0]);

  // Website URL entrance
  const urlSpring = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 14, stiffness: 80 } });
  const urlY = interpolate(urlSpring, [0, 1], [60, 0]);
  const urlOpacity = interpolate(urlSpring, [0, 0.3], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.textDark} 0%, #2D0A5E 50%, #1A0A2E 100%)`,
        overflow: 'hidden',
      }}
    >
      <svg width={1080} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* Confetti */}
        <ConfettiLayer />

        {/* Background glow circles */}
        {[
          { cx: 200, cy: 200, r: 250, color: COLORS.strawberry, op: 0.12 },
          { cx: 880, cy: 300, r: 200, color: COLORS.blueberry, op: 0.1 },
          { cx: 540, cy: 700, r: 300, color: COLORS.mint, op: 0.08 },
        ].map((g, i) => (
          <circle key={i} cx={g.cx} cy={g.cy} r={g.r} fill={g.color} opacity={g.op} />
        ))}

        {/* Sprinkles layer with lower opacity */}
        <Sprinkles opacity={0.25} />

        {/* Left cone */}
        <g transform={`translate(${140 + leftConeX}, 540)`}>
          <IceCreamCone x={0} y={0} scale={0.75} flavor="mint" wobble delayFrames={5} />
        </g>

        {/* Right cone */}
        <g transform={`translate(${940 + rightConeX}, 540)`}>
          <IceCreamCone x={0} y={0} scale={0.75} flavor="blueberry" wobble delayFrames={10} />
        </g>

        {/* Central content area */}
        {/* Headline */}
        <g
          transform={`translate(540, 300) scale(${headScale})`}
          opacity={headOpacity}
        >
          <text
            textAnchor="middle"
            y={-40}
            fontSize={88}
            fontWeight={900}
            fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
            fill={COLORS.white}
          >
            TREAT
          </text>
          <text
            textAnchor="middle"
            y={56}
            fontSize={88}
            fontWeight={900}
            fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
            fill={COLORS.strawberry}
          >
            YOURSELF!
          </text>
        </g>

        {/* Feature bullets */}
        {items.map((item, i) => {
          const bs = spring({
            frame: Math.max(0, frame - item.delay),
            fps,
            config: { damping: 14, stiffness: 100 },
          });
          const bx = interpolate(bs, [0, 1], [-80, 0]);
          const bo = interpolate(bs, [0, 0.3], [0, 1]);
          return (
            <text
              key={i}
              x={540 + bx}
              y={460 + i * 58}
              textAnchor="middle"
              fontSize={32}
              fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
              fill={COLORS.white}
              opacity={bo * 0.9}
            >
              {item.text}
            </text>
          );
        })}

        {/* CTA Button */}
        <g transform={`translate(540, 700) scale(${btnPulse})`}>
          {/* Button shadow */}
          <rect x={-185} y={-38} width={370} height={76} rx={38} fill={COLORS.strawberryDark} />
          {/* Button */}
          <rect x={-185} y={-42} width={370} height={76} rx={38} fill={COLORS.strawberry} />
          <text
            textAnchor="middle"
            y={12}
            fontSize={36}
            fontWeight={900}
            fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
            fill={COLORS.white}
            letterSpacing={2}
          >
            ORDER NOW 🍦
          </text>
        </g>

        {/* Divider */}
        <line x1={340} y1={770} x2={740} y2={770} stroke={COLORS.white} strokeWidth={1} opacity={0.2} />

        {/* Website URL */}
        <g transform={`translate(540, ${820 + urlY})`} opacity={urlOpacity}>
          <text
            textAnchor="middle"
            fontSize={28}
            fontFamily='"Arial", sans-serif'
            fill={COLORS.white}
            opacity={0.6}
          >
            www.scoopyicecream.com
          </text>
        </g>

        {/* Social media handles */}
        <g transform={`translate(540, ${870 + urlY})`} opacity={urlOpacity * 0.8}>
          <text
            textAnchor="middle"
            fontSize={24}
            fontFamily='"Arial", sans-serif'
            fill={COLORS.mint}
          >
            @scoopyofficial  •  #ScoopyMoment
          </text>
        </g>

        {/* Logo at bottom */}
        <g transform={`translate(540, ${960 + urlY})`} opacity={urlOpacity}>
          <text
            textAnchor="middle"
            fontSize={44}
            fontWeight={900}
            fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
            fill={COLORS.white}
            letterSpacing={4}
          >
            SCOOPY
          </text>
          <text
            textAnchor="middle"
            y={36}
            fontSize={20}
            fontFamily='"Georgia", serif'
            fontStyle="italic"
            fill={COLORS.strawberry}
          >
            ice cream
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
