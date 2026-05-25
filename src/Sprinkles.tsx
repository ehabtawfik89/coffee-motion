import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from './colors';

const SPRINKLE_DATA = [
  { x: 80, y: 120, r: 30, color: COLORS.sprinkleRed, delay: 0 },
  { x: 950, y: 200, r: -45, color: COLORS.sprinkleBlue, delay: 3 },
  { x: 150, y: 350, r: 60, color: COLORS.sprinkleYellow, delay: 6 },
  { x: 900, y: 400, r: -20, color: COLORS.sprinkleGreen, delay: 2 },
  { x: 200, y: 700, r: 80, color: COLORS.sprinklePink, delay: 8 },
  { x: 870, y: 650, r: -55, color: COLORS.sprinkleOrange, delay: 5 },
  { x: 100, y: 900, r: 15, color: COLORS.sprinkleRed, delay: 10 },
  { x: 960, y: 880, r: -70, color: COLORS.sprinkleBlue, delay: 4 },
  { x: 50, y: 500, r: 40, color: COLORS.sprinkleYellow, delay: 7 },
  { x: 1020, y: 530, r: -30, color: COLORS.sprinkleGreen, delay: 1 },
  { x: 300, y: 80, r: 90, color: COLORS.sprinklePink, delay: 9 },
  { x: 750, y: 100, r: -80, color: COLORS.sprinkleOrange, delay: 3 },
  { x: 400, y: 950, r: 50, color: COLORS.sprinkleRed, delay: 6 },
  { x: 680, y: 930, r: -40, color: COLORS.sprinkleBlue, delay: 2 },
  // Extra scattered ones
  { x: 130, y: 200, r: 110, color: COLORS.sprinkleYellow, delay: 11 },
  { x: 930, y: 300, r: -100, color: COLORS.sprinklePink, delay: 4 },
  { x: 60, y: 760, r: 70, color: COLORS.sprinkleOrange, delay: 8 },
  { x: 1000, y: 750, r: -60, color: COLORS.sprinkleGreen, delay: 5 },
  { x: 350, y: 30, r: 35, color: COLORS.sprinkleRed, delay: 12 },
  { x: 720, y: 50, r: -25, color: COLORS.sprinkleBlue, delay: 7 },
];

interface SprinklesProps {
  opacity?: number;
}

export const Sprinkles: React.FC<SprinklesProps> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();

  return (
    <>
      {SPRINKLE_DATA.map((s, i) => {
        const floatY = Math.sin((frame + i * 17) * 0.04) * 8;
        const floatX = Math.cos((frame + i * 23) * 0.03) * 5;
        const pop = Math.min(1, Math.max(0, (frame - s.delay * 2) / 8));

        return (
          <rect
            key={i}
            x={s.x + floatX - 14}
            y={s.y + floatY - 5}
            width={28}
            height={10}
            rx={5}
            fill={s.color}
            transform={`rotate(${s.r}, ${s.x + floatX}, ${s.y + floatY})`}
            opacity={interpolate(pop, [0, 1], [0, opacity * 0.85])}
          />
        );
      })}
    </>
  );
};
