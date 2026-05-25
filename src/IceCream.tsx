import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from './colors';

interface IceCreamProps {
  x: number;
  y: number;
  scale?: number;
  flavor?: 'strawberry' | 'mint' | 'vanilla' | 'blueberry';
  wobble?: boolean;
  delayFrames?: number;
}

const SCOOP_COLORS: Record<string, { top: string; mid: string; dark: string }> = {
  strawberry: { top: '#FFB3CC', mid: COLORS.strawberry, dark: COLORS.strawberryDark },
  mint: { top: '#C8F5E6', mid: COLORS.mint, dark: COLORS.mintDark },
  vanilla: { top: '#FFF3D4', mid: COLORS.vanilla, dark: COLORS.vanillaDark },
  blueberry: { top: '#C3BFFF', mid: COLORS.blueberry, dark: COLORS.blueberryDark },
};

export const IceCreamCone: React.FC<IceCreamProps> = ({
  x,
  y,
  scale = 1,
  flavor = 'strawberry',
  wobble = false,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const effectiveFrame = Math.max(0, frame - delayFrames);

  const dropIn = spring({
    frame: effectiveFrame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });

  const scoopColors = SCOOP_COLORS[flavor];

  const wobbleAngle = wobble
    ? Math.sin(frame * 0.08) * 4
    : 0;

  const ty = interpolate(dropIn, [0, 1], [-300, 0]);

  return (
    <g transform={`translate(${x}, ${y + ty}) rotate(${wobbleAngle}, 0, 0) scale(${scale})`}>
      {/* Waffle cone body */}
      <polygon
        points="0,-10 70,180 -70,180"
        fill={COLORS.coneMain}
      />
      {/* Cone shading */}
      <polygon
        points="0,-10 10,180 -10,180"
        fill={COLORS.coneDark}
        opacity={0.3}
      />
      {/* Waffle pattern - diagonal lines */}
      {[-3, -1, 1, 3].map((i) => (
        <line
          key={`d1-${i}`}
          x1={i * 20 - 70}
          y1={180}
          x2={i * 10}
          y2={-10}
          stroke={COLORS.waffleLines}
          strokeWidth={1.5}
          opacity={0.5}
        />
      ))}
      {[-3, -1, 1, 3].map((i) => (
        <line
          key={`d2-${i}`}
          x1={-i * 20 + 70}
          y1={180}
          x2={-i * 10}
          y2={-10}
          stroke={COLORS.waffleLines}
          strokeWidth={1.5}
          opacity={0.5}
        />
      ))}
      {/* Cone highlight */}
      <polygon
        points="-30,20 -20,-8 -50,60"
        fill={COLORS.coneLight}
        opacity={0.4}
      />

      {/* Bottom scoop */}
      <ellipse cx={0} cy={-10} rx={72} ry={72} fill={scoopColors.dark} />
      <ellipse cx={0} cy={-10} rx={66} ry={66} fill={scoopColors.mid} />
      {/* Scoop highlight */}
      <ellipse cx={-18} cy={-32} rx={22} ry={18} fill={scoopColors.top} opacity={0.7} />

      {/* Middle scoop */}
      <ellipse cx={8} cy={-75} rx={62} ry={62} fill={COLORS.vanilla} opacity={0.2} />
      <ellipse cx={8} cy={-75} rx={56} ry={56} fill={scoopColors.mid} />
      <ellipse cx={8} cy={-75} rx={52} ry={52} fill={scoopColors.mid} />
      <ellipse cx={-8} cy={-92} rx={18} ry={15} fill={scoopColors.top} opacity={0.7} />

      {/* Top scoop */}
      <ellipse cx={-4} cy={-135} rx={50} ry={50} fill={scoopColors.dark} opacity={0.3} />
      <ellipse cx={-4} cy={-135} rx={46} ry={46} fill={scoopColors.mid} />
      <ellipse cx={-16} cy={-152} rx={15} ry={12} fill={scoopColors.top} opacity={0.8} />

      {/* Cherry on top */}
      <circle cx={-4} cy={-182} r={12} fill={COLORS.strawberryDark} />
      <circle cx={-7} cy={-186} r={5} fill={COLORS.strawberry} opacity={0.7} />
      {/* Cherry stem */}
      <path
        d="M -4,-170 Q 8,-160 12,-145"
        stroke="#4A7C2F"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />

      {/* Sprinkles on top scoop */}
      {[
        { x: 10, y: -148, r: 90, c: COLORS.sprinkleRed },
        { x: -20, y: -128, r: 30, c: COLORS.sprinkleBlue },
        { x: 18, y: -120, r: 150, c: COLORS.sprinkleYellow },
        { x: -8, y: -112, r: 60, c: COLORS.sprinkleGreen },
        { x: 28, y: -138, r: 120, c: COLORS.sprinklePink },
      ].map((s, i) => (
        <rect
          key={i}
          x={s.x - 5}
          y={s.y - 2}
          width={10}
          height={4}
          rx={2}
          fill={s.c}
          transform={`rotate(${s.r}, ${s.x}, ${s.y})`}
        />
      ))}

      {/* Drip on middle scoop */}
      <path
        d={`M 35,-35 Q 42,-20 38,5`}
        stroke={scoopColors.mid}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={38} cy={8} r={6} fill={scoopColors.mid} />

      {/* Second drip */}
      <path
        d={`M -40,-28 Q -46,-15 -44,8`}
        stroke={scoopColors.dark}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={-44} cy={11} r={5} fill={scoopColors.dark} />
    </g>
  );
};
