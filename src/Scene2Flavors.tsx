import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { COLORS } from './colors';
import { IceCreamCone } from './IceCream';
import { Sprinkles } from './Sprinkles';

interface FlavorCardProps {
  x: number;
  y: number;
  flavor: 'strawberry' | 'mint' | 'vanilla' | 'blueberry';
  label: string;
  subtitle: string;
  color: string;
  lightColor: string;
  delayFrames: number;
}

const FLAVOR_BG: Record<string, string> = {
  strawberry: '#FFE4EE',
  mint: '#E4FAF1',
  vanilla: '#FFF8E7',
  blueberry: '#EDEAFF',
};

const FlavorCard: React.FC<FlavorCardProps> = ({
  x,
  y,
  flavor,
  label,
  subtitle,
  color,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ef = Math.max(0, frame - delayFrames);

  const pop = spring({ frame: ef, fps, config: { damping: 10, stiffness: 130, mass: 0.7 } });
  const scale = interpolate(pop, [0, 0.6, 0.85, 1], [0, 1.12, 0.96, 1]);
  const opacity = interpolate(pop, [0, 0.2], [0, 1]);
  const hover = Math.sin(frame * 0.06 + delayFrames) * 6;

  return (
    <g transform={`translate(${x}, ${y + hover}) scale(${scale})`} opacity={opacity}>
      {/* Card */}
      <rect x={-120} y={-220} width={240} height={380} rx={28} fill={FLAVOR_BG[flavor]} />
      <rect x={-120} y={-220} width={240} height={380} rx={28} fill="none" stroke={color} strokeWidth={3} opacity={0.4} />

      {/* Ice cream */}
      <IceCreamCone x={0} y={60} scale={0.55} flavor={flavor} delayFrames={delayFrames + 5} />

      {/* Label */}
      <text
        x={0}
        y={-140}
        textAnchor="middle"
        fontSize={32}
        fontWeight={800}
        fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
        fill={color}
      >
        {label}
      </text>

      {/* Subtitle */}
      <text
        x={0}
        y={-105}
        textAnchor="middle"
        fontSize={18}
        fontFamily='"Georgia", serif'
        fontStyle="italic"
        fill={COLORS.textMedium}
        opacity={0.8}
      >
        {subtitle}
      </text>
    </g>
  );
};

export const Scene2Flavors: React.FC = () => {
  const frame = useCurrentFrame();

  const flavors: FlavorCardProps[] = [
    {
      x: 150,
      y: 460,
      flavor: 'strawberry',
      label: 'Strawberry',
      subtitle: 'Berry sweet',
      color: COLORS.strawberry,
      lightColor: '#FFE4EE',
      delayFrames: 0,
    },
    {
      x: 390,
      y: 460,
      flavor: 'mint',
      label: 'Mint Chip',
      subtitle: 'Cool & fresh',
      color: COLORS.mintDark,
      lightColor: '#E4FAF1',
      delayFrames: 10,
    },
    {
      x: 630,
      y: 460,
      flavor: 'vanilla',
      label: 'Vanilla',
      subtitle: 'Classic bliss',
      color: COLORS.vanillaDark,
      lightColor: '#FFF8E7',
      delayFrames: 20,
    },
    {
      x: 870,
      y: 460,
      flavor: 'blueberry',
      label: 'Blueberry',
      subtitle: 'Wild & bold',
      color: COLORS.blueberry,
      lightColor: '#EDEAFF',
      delayFrames: 30,
    },
  ];

  // Heading animation
  const { fps } = useVideoConfig();
  const headSpring = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const headY = interpolate(headSpring, [0, 1], [-60, 0]);
  const headOpacity = interpolate(headSpring, [0, 0.3], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #FFF0F8 0%, #F0FFF8 50%, #F0F0FF 100%)`,
        overflow: 'hidden',
      }}
    >
      <svg width={1080} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Sprinkles opacity={0.5} />

        {/* Header section */}
        <g transform={`translate(540, ${90 + headY})`} opacity={headOpacity}>
          <text
            textAnchor="middle"
            fontSize={72}
            fontWeight={900}
            fontFamily='"Arial Rounded MT Bold", "Arial Black", sans-serif'
            fill={COLORS.textDark}
          >
            Our Flavors
          </text>
          <text
            textAnchor="middle"
            y={52}
            fontSize={28}
            fontFamily='"Georgia", serif'
            fontStyle="italic"
            fill={COLORS.textMedium}
          >
            Handcrafted with love, served with joy
          </text>
        </g>

        {/* Flavor cards */}
        {flavors.map((f) => (
          <FlavorCard key={f.flavor} {...f} />
        ))}

        {/* Bottom accent wave */}
        <path
          d="M 0,960 Q 270,920 540,960 Q 810,1000 1080,960 L 1080,1080 L 0,1080 Z"
          fill={COLORS.strawberry}
          opacity={0.12}
        />
      </svg>
    </AbsoluteFill>
  );
};
