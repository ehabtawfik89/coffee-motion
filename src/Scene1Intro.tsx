import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from './colors';
import { Sprinkles } from './Sprinkles';

// Animated bubbly circles background
const BubbleBg: React.FC = () => {
  const frame = useCurrentFrame();
  const circles = [
    { cx: 100, cy: 100, r: 180, color: COLORS.strawberry, speed: 0.015 },
    { cx: 980, cy: 150, r: 160, color: COLORS.mint, speed: 0.02 },
    { cx: 80, cy: 900, r: 200, color: COLORS.vanilla, speed: 0.012 },
    { cx: 1000, cy: 920, r: 170, color: COLORS.blueberry, speed: 0.018 },
    { cx: 540, cy: 50, r: 120, color: COLORS.vanilla, speed: 0.025 },
  ];

  return (
    <>
      {circles.map((c, i) => {
        const pulse = 1 + Math.sin(frame * c.speed + i) * 0.06;
        return (
          <circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r * pulse}
            fill={c.color}
            opacity={0.18}
          />
        );
      })}
    </>
  );
};

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo / brand name entrance
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const subtitleDelay = 15;
  const subtitleSpring = spring({
    frame: Math.max(0, frame - subtitleDelay),
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const taglineDelay = 30;
  const taglineSpring = spring({
    frame: Math.max(0, frame - taglineDelay),
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  // Title comes from above
  const titleY = interpolate(titleSpring, [0, 1], [-150, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 0.3], [0, 1]);

  // Subtitle from below
  const subtitleY = interpolate(subtitleSpring, [0, 1], [80, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 0.3], [0, 1]);

  // Tagline scale pop
  const taglineScale = interpolate(taglineSpring, [0, 0.6, 0.8, 1], [0, 1.15, 0.95, 1]);
  const taglineOpacity = interpolate(taglineSpring, [0, 0.2], [0, 1]);

  // Big wavy text wobble
  const wobble = Math.sin(frame * 0.1) * 3;

  return (
    <AbsoluteFill style={{ background: COLORS.creamBg, overflow: 'hidden' }}>
      {/* SVG layer */}
      <svg width={1080} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <BubbleBg />
        <Sprinkles opacity={0.6} />

        {/* Decorative rings */}
        {[200, 280, 360].map((r, i) => (
          <circle
            key={i}
            cx={540}
            cy={540}
            r={r}
            fill="none"
            stroke={COLORS.strawberry}
            strokeWidth={2}
            opacity={0.08 - i * 0.02}
          />
        ))}

        {/* Scoopy brand mark - simplified big cone icon */}
        <g transform={`translate(540, 420) scale(1.6) rotate(${wobble})`}>
          {/* Cone */}
          <polygon points="0,30 55,180 -55,180" fill={COLORS.coneMain} opacity={0.9} />
          <polygon points="-8,30 8,30 5,180 -5,180" fill={COLORS.coneDark} opacity={0.4} />
          {/* Single big scoop */}
          <circle cx={0} cy={0} r={58} fill={COLORS.strawberry} />
          <circle cx={0} cy={0} r={52} fill={COLORS.strawberry} />
          <ellipse cx={-14} cy={-18} rx={18} ry={14} fill="#FFB3CC" opacity={0.7} />
          {/* Sprinkles */}
          {[
            { x: 18, y: -20, r: 45 },
            { x: -22, y: 8, r: -30 },
            { x: 5, y: 28, r: 80 },
            { x: -28, y: -8, r: 10 },
            { x: 30, y: 12, r: -60 },
          ].map((sp, i) => (
            <rect
              key={i}
              x={sp.x - 8}
              y={sp.y - 3}
              width={16}
              height={6}
              rx={3}
              fill={[COLORS.sprinkleRed, COLORS.sprinkleBlue, COLORS.sprinkleYellow, COLORS.sprinkleGreen, COLORS.sprinklePink][i]}
              transform={`rotate(${sp.r}, ${sp.x}, ${sp.y})`}
            />
          ))}
        </g>
      </svg>

      {/* Text layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {/* Main Title */}
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            marginTop: 220,
          }}
        >
          <div
            style={{
              fontSize: 130,
              fontWeight: 900,
              fontFamily: '"Arial Rounded MT Bold", "Arial Black", sans-serif',
              color: COLORS.textDark,
              letterSpacing: -3,
              textAlign: 'center',
              lineHeight: 1,
              textShadow: `4px 6px 0px ${COLORS.strawberry}`,
            }}
          >
            SCOOPY
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleOpacity,
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              fontFamily: '"Arial Rounded MT Bold", "Arial Black", sans-serif',
              color: COLORS.strawberry,
              letterSpacing: 12,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Ice Cream
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            transform: `scale(${taglineScale})`,
            opacity: taglineOpacity,
            marginTop: 32,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontFamily: '"Georgia", serif',
              fontStyle: 'italic',
              color: COLORS.textMedium,
              textAlign: 'center',
              letterSpacing: 2,
            }}
          >
            Every scoop tells a story ✨
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
