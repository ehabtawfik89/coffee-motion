import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * Premium dark-blue crescent / glowing-sphere motion background.
 * Recreates the reference (portrait) rotated 90° CW → 16:9 landscape.
 * Motion pace is 3× the previous BlueMotionBackground composition.
 */
export const CrescentMotionBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const t   = frame / durationInFrames;
  const TAU = Math.PI * 2;
  const SPEED = 3; // 3× faster than v1

  // Oscillators
  const slow  = Math.sin(TAU * t * 0.6  * SPEED);
  const med   = Math.sin(TAU * t * 1.1  * SPEED);
  const fast  = Math.sin(TAU * t * 1.9  * SPEED);
  const ultra = Math.sin(TAU * t * 3.1  * SPEED);

  // Ken Burns
  const scale = interpolate(t, [0, 1], [1.035, 0.995]);
  const panX  = interpolate(t, [0, 1], [-14, 14]);
  const panY  = interpolate(t, [0, 1], [-7,  7]);

  // ── Sphere geometry (landscape: sphere mostly above the frame, peeking down)
  const cx = width  * (0.50 + slow * 0.012);
  const cy = height * (0.10 + med  * 0.018);
  const r  = width  * (0.55 + slow * 0.008);

  // Shadow sphere offset (creates the crescent shape).
  // Negative offset → crescent appears on lower-right of sphere.
  const offX = -r * (0.055 + slow  * 0.012);
  const offY = -r * (0.085 + med   * 0.012);

  // Highlight position — where the bright glow is centered within the crescent
  const hx = cx + r * (0.32 + fast * 0.015);
  const hy = cy + r * (0.48 + med  * 0.015);
  const hr = r  * (0.55 + slow * 0.020);

  // Bloom intensity
  const bloomOp     = 0.85 + fast  * 0.10;
  const atmoOp      = 0.45 + slow  * 0.08;
  const sharpOp     = 0.95 + ultra * 0.05;

  // Film-grain seed (cycles each frame for live grain shimmer)
  const grainSeed = frame % 64;

  // Helper to format rgba inline
  const rgba = (r: number, g: number, b: number, a: number) =>
    `rgba(${r},${g},${b},${a})`;

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
        background: '#000206',
      }}
    >
      {/* ── L1 — Deep base wash ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 110% 90% at 50% 110%,' +
            '  #03101f 0%,' +
            '  #010812 45%,' +
            '  #000308 80%,' +
            '  #00010500 100%' +
            ')',
        }}
      />

      {/* ── L2 — Soft outer atmosphere (extends beyond sphere) ─────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale}) translate(${panX * 0.6}px, ${panY * 0.6}px)`,
          transformOrigin: 'center center',
          background:
            `radial-gradient(ellipse 75% 65% at ${50 + slow * 1.5}% ${28 + med * 2}%,` +
            `  ${rgba(38,  98,  180, atmoOp * 0.55)}  0%,` +
            `  ${rgba(20,  60,  140, atmoOp * 0.30)}  35%,` +
            `  ${rgba(10,  30,   80, atmoOp * 0.12)}  60%,` +
            `  transparent 85%` +
            `)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* ── L3 — The sphere + crescent (SVG, all in one) ───────────────── */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          transformOrigin: 'center center',
        }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          {/* Sphere body shading — slight diagonal volume */}
          <radialGradient
            id="sphere-body"
            cx={cx + r * 0.15}
            cy={cy + r * 0.20}
            r={r * 1.05}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#0e2a5e" />
            <stop offset="35%"  stopColor="#08194a" />
            <stop offset="65%"  stopColor="#040f2e" />
            <stop offset="100%" stopColor="#01081a" />
          </radialGradient>

          {/* The crescent glow gradient — brightest at highlight pt */}
          <radialGradient
            id="crescent-glow"
            cx={hx}
            cy={hy}
            r={hr}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor={rgba(225, 240, 255, sharpOp)} />
            <stop offset="12%"  stopColor={rgba(170, 210, 250, sharpOp * 0.92)} />
            <stop offset="32%"  stopColor={rgba(95,  165, 235, sharpOp * 0.72)} />
            <stop offset="55%"  stopColor={rgba(40,  100, 195, sharpOp * 0.42)} />
            <stop offset="80%"  stopColor={rgba(15,  50,  130, sharpOp * 0.18)} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Crescent mask: sphere minus offset shadow-sphere = crescent */}
          <mask id="crescent-mask" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={width} height={height} fill="black" />
            <circle cx={cx} cy={cy} r={r} fill="white" />
            <circle
              cx={cx + offX}
              cy={cy + offY}
              r={r * 0.965}
              fill="black"
            />
          </mask>

          {/* Sphere clipPath (for inner glow) */}
          <clipPath id="sphere-clip">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>

          {/* Bloom filters */}
          <filter id="bloom-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="bloom-big" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="55" />
          </filter>
          <filter id="bloom-huge" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="140" />
          </filter>
        </defs>

        {/* Outer wide bloom (atmosphere halo around the crescent) */}
        <rect
          width={width}
          height={height}
          fill="url(#crescent-glow)"
          mask="url(#crescent-mask)"
          filter="url(#bloom-huge)"
          opacity={bloomOp * 0.85}
        />

        {/* Sphere body (dark side of the planet) */}
        <circle cx={cx} cy={cy} r={r} fill="url(#sphere-body)" />

        {/* Medium bloom of the crescent (the diffuse glow) */}
        <rect
          width={width}
          height={height}
          fill="url(#crescent-glow)"
          mask="url(#crescent-mask)"
          filter="url(#bloom-big)"
          opacity={bloomOp * 0.95}
        />

        {/* Soft bloom of the crescent */}
        <rect
          width={width}
          height={height}
          fill="url(#crescent-glow)"
          mask="url(#crescent-mask)"
          filter="url(#bloom-soft)"
          opacity={bloomOp}
        />

        {/* Crisp inner crescent — the bright edge itself */}
        <rect
          width={width}
          height={height}
          fill="url(#crescent-glow)"
          mask="url(#crescent-mask)"
          opacity={bloomOp}
        />

        {/* Subtle inner rim highlight on sphere edge */}
        <g clipPath="url(#sphere-clip)">
          <circle
            cx={cx + offX * 0.4}
            cy={cy + offY * 0.4}
            r={r * 0.995}
            fill="none"
            stroke={rgba(160, 210, 250, 0.18 + ultra * 0.04)}
            strokeWidth="2"
            filter="url(#bloom-soft)"
          />
        </g>
      </svg>

      {/* ── L4 — Subtle hot-spot (the pinpoint brightest dot) ──────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            `radial-gradient(circle ${4 + fast * 0.5}% at ${(hx / width) * 100}% ${(hy / height) * 100}%,` +
            `  ${rgba(255, 255, 255, 0.55 + ultra * 0.10)} 0%,` +
            `  ${rgba(200, 230, 255, 0.20)} 35%,` +
            `  transparent 70%` +
            `)`,
          mixBlendMode: 'screen',
          filter: 'blur(8px)',
        }}
      />

      {/* ── L5 — Wide ambient blue cast (subtle colour bleed into darks) ─ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            `radial-gradient(ellipse 95% 70% at 55% 35%,` +
            `  ${rgba(15, 45, 105, 0.20)} 0%,` +
            `  transparent 70%` +
            `)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* ── L6 — Vignette ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 92% 92% at 50% 50%,' +
            '  transparent 48%,' +
            '  rgba(0, 1, 5, 0.45) 80%,' +
            '  rgba(0, 0, 3, 0.70) 100%' +
            ')',
        }}
      />

      {/* ── L7 — Film grain (overlay) ──────────────────────────────────── */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'overlay',
          opacity: 0.32,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter
            id="grain-c"
            colorInterpolationFilters="sRGB"
            x="0%" y="0%" width="100%" height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              seed={grainSeed}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grain-c)" />
      </svg>

      {/* ── L8 — Film grain (soft-light, texture depth) ─────────────────── */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'soft-light',
          opacity: 0.20,
          pointerEvents: 'none',
        }}
      >
        <rect width="100%" height="100%" filter="url(#grain-c)" />
      </svg>
    </div>
  );
};
