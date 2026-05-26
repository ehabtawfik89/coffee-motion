import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// ─── Deterministic pseudo-random (no Math.random() inside render) ──────────
function sr(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

// ─── Pre-baked horizontal streak data (portrait-left side → landscape-top) ─
const NUM_STREAKS = 52;
interface StreakDef {
  yPct:   number;
  hPx:    number;
  op:     number;
  r: number; g: number; b: number;
  phase:  number;
  speed:  number;
  skewPx: number; // slight x-position jitter
}
const STREAKS: StreakDef[] = Array.from({ length: NUM_STREAKS }, (_, i) => ({
  yPct:   sr(i * 2)  * 100,
  hPx:    1.0 + sr(i * 3)  * 2.8,
  op:     0.028 + sr(i * 5)  * 0.065,
  r:      Math.round(55  + sr(i * 7)  * 55),
  g:      Math.round(105 + sr(i * 11) * 85),
  b:      Math.round(185 + sr(i * 13) * 70),
  phase:  sr(i * 17) * Math.PI * 2,
  speed:  0.012 + sr(i * 19) * 0.022,
  skewPx: (sr(i * 23) - 0.5) * 30,
}));

// ─── Component ─────────────────────────────────────────────────────────────
export const BlueMotionBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const t    = frame / durationInFrames;          // 0 → 1 over full duration
  const TAU  = Math.PI * 2;

  // Oscillators (all deterministic per frame)
  const slow  = Math.sin(TAU * t * 0.75);        // ~0.75 cycle / 10 s
  const med   = Math.sin(TAU * t * 1.4);         // ~1.4 cycles
  const fast  = Math.sin(TAU * t * 2.3);         // ~2.3 cycles
  const ultra = Math.sin(TAU * t * 3.7);         // fine shimmer

  // ── Ken Burns: very subtle zoom + slow pan ────────────────────────────
  const scale = interpolate(t, [0, 1], [1.045, 0.995]);
  const panX  = interpolate(t, [0, 1], [-14, 14]);
  const panY  = interpolate(t, [0, 1], [-6,  8]);

  // ── Horizontal S-wave (the dramatic fold) ────────────────────────────
  // Wave sits near the vertical centre; slowly breathes up/down
  const waveCenterY = height * (0.47 + slow * 0.03);
  // S-curve bend amplitude — how curvy the fold is
  const sCurveAmp   = height * (0.12 + slow * 0.025);
  // The S-wave path encloses the TOP (dark) zone
  const waveTopPath = [
    `M 0 ${waveCenterY + sCurveAmp * 0.5}`,
    `C ${width * 0.22} ${waveCenterY - sCurveAmp},`,
    `  ${width * 0.55} ${waveCenterY + sCurveAmp},`,
    `  ${width * 0.78} ${waveCenterY - sCurveAmp * 0.3}`,
    `C ${width * 0.92} ${waveCenterY - sCurveAmp * 0.6},`,
    `  ${width}        ${waveCenterY - sCurveAmp * 0.1},`,
    `  ${width}        ${waveCenterY}`,
    `L ${width} 0 L 0 0 Z`,
  ].join(' ');

  // Crease line (same bezier, no fill)
  const creasePath = [
    `M 0 ${waveCenterY + sCurveAmp * 0.5}`,
    `C ${width * 0.22} ${waveCenterY - sCurveAmp},`,
    `  ${width * 0.55} ${waveCenterY + sCurveAmp},`,
    `  ${width * 0.78} ${waveCenterY - sCurveAmp * 0.3}`,
    `C ${width * 0.92} ${waveCenterY - sCurveAmp * 0.6},`,
    `  ${width}        ${waveCenterY - sCurveAmp * 0.1},`,
    `  ${width}        ${waveCenterY}`,
  ].join(' ');

  // ── Bloom (bright bottom area — portrait's bright right side) ─────────
  const bloomOpacity = 0.58 + fast * 0.09 + ultra * 0.03;
  const bloomSizeW   = 72 + slow * 5;   // % of width
  const bloomSizeH   = 58 + med  * 4;   // % of height
  const bloomX       = 55 + slow * 3;   // % from left
  const bloomY       = 78 + med  * 3;   // % from top  (bottom half)

  // ── Purple accent — portrait's bottom-right → landscape bottom-left ───
  const purpleOp = 0.42 + med * 0.06;

  // ── Film-grain seed — cycles every frame, capped so SVG rerenders fast ─
  const grainSeed = frame % 64;

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
        background: '#020a18',
      }}
    >
      {/* ── SVG filter definitions ─────────────────────────────────────── */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Film grain */}
          <filter
            id="grain"
            colorInterpolationFilters="sRGB"
            x="0%" y="0%" width="100%" height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves="4"
              seed={grainSeed}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          </filter>

          {/* Soft glow for crease highlight */}
          <filter id="crease-glow" x="-10%" y="-300%" width="120%" height="700%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feBlend in="SourceGraphic" in2="blur" mode="screen" />
          </filter>

          {/* Directional blur for streaks (horizontal motion feel) */}
          <filter id="streak-blur" x="-2%" y="-50%" width="104%" height="200%">
            <feGaussianBlur stdDeviation="0 1.2" />
          </filter>
        </defs>
      </svg>

      {/* ── L1 — Base gradient ─────────────────────────────────────────── */}
      {/* Top: deep navy (portrait's dark left)
          Bottom: blue-white (portrait's bright right) */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          transformOrigin: 'center center',
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          background:
            'linear-gradient(180deg,' +
            '  #030d22  0%,' +
            '  #051628  8%,' +
            '  #0a2248  20%,' +
            '  #0e3068  34%,' +
            '  #184890  48%,' +
            '  #2462b8  60%,' +
            '  #3a84d0  72%,' +
            '  #58aadf  84%,' +
            '  #7cc6ee  94%,' +
            '  #9dd8f8  100%' +
            ')',
        }}
      />

      {/* ── L2 — Horizontal streaks ────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          transformOrigin: 'center center',
          transform: `scale(${scale * 1.008}) translate(${panX * 0.65}px, ${panY * 0.65}px)`,
          filter: 'url(#streak-blur)',
        }}
      >
        {STREAKS.map((s, i) => {
          const anim = Math.sin(frame * s.speed + s.phase);
          const op   = s.op * (0.72 + anim * 0.28);
          const xShift = s.skewPx + anim * 6;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${s.yPct}%`,
                left:  `${xShift < 0 ? xShift : 0}px`,
                right: `${xShift > 0 ? -xShift : 0}px`,
                height: s.hPx,
                background:
                  `linear-gradient(90deg,` +
                  `  transparent 0%,` +
                  `  rgba(${s.r},${s.g},${s.b},${op * 0.6}) 10%,` +
                  `  rgba(${s.r},${s.g},${s.b},${op})       35%,` +
                  `  rgba(${s.r},${s.g},${s.b},${op * 1.25}) 55%,` +
                  `  rgba(${s.r},${s.g},${s.b},${op})       80%,` +
                  `  transparent 100%` +
                  `)`,
              }}
            />
          );
        })}
      </div>

      {/* ── L3 — Dark top-zone overlay (above the wave crease) ─────────── */}
      <svg
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <path d={waveTopPath} fill="rgba(2, 10, 26, 0.38)" />
      </svg>

      {/* ── L4 — Wave crease: dark line + blue-glow highlight ─────────── */}
      <svg
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Blue glow beside crease */}
        <path
          d={creasePath}
          stroke={`rgba(65, 155, 230, ${0.55 + slow * 0.12})`}
          strokeWidth="9"
          fill="none"
          filter="url(#crease-glow)"
        />
        {/* Fine light-blue highlight */}
        <path
          d={creasePath}
          stroke={`rgba(140, 210, 255, ${0.45 + fast * 0.08})`}
          strokeWidth="1.8"
          fill="none"
        />
        {/* Dark crease line itself */}
        <path
          d={creasePath}
          stroke="rgba(0, 4, 14, 0.92)"
          strokeWidth="2.2"
          fill="none"
        />
      </svg>

      {/* ── L5 — Bright bloom (lower area) ────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            `radial-gradient(ellipse ${bloomSizeW}% ${bloomSizeH}% at ${bloomX}% ${bloomY}%,` +
            `  rgba(215, 242, 255, ${bloomOpacity})       0%,` +
            `  rgba(165, 215, 248, ${bloomOpacity * 0.60}) 28%,` +
            `  rgba(95,  168, 232, ${bloomOpacity * 0.30}) 52%,` +
            `  transparent 68%` +
            `)`,
          mixBlendMode: 'screen',
          filter: 'blur(7px)',
        }}
      />

      {/* ── L6 — Mid blue fill (keeps the blue saturation rich) ────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            `radial-gradient(ellipse 90% 55% at 50% 65%,` +
            `  rgba(22, 88, 165, 0.28) 0%,` +
            `  transparent 72%` +
            `)`,
        }}
      />

      {/* ── L7 — Purple accent (bottom-left) ──────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            `radial-gradient(ellipse 40% 48% at 5% 90%,` +
            `  rgba(108, 40, 158, ${purpleOp})       0%,` +
            `  rgba(68,  22, 108, ${purpleOp * 0.52}) 42%,` +
            `  transparent 66%` +
            `)`,
        }}
      />

      {/* ── L8 — Dark top-edge gradient (deeper shadow at top) ─────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg,' +
            '  rgba(1, 5, 14, 0.55) 0%,' +
            '  rgba(2, 8, 22, 0.18) 18%,' +
            '  transparent 38%' +
            ')',
        }}
      />

      {/* ── L9 — Edge vignette ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 86% 86% at 50% 50%,' +
            '  transparent 50%,' +
            '  rgba(1, 4, 12, 0.42) 78%,' +
            '  rgba(0, 2, 8,  0.62) 100%' +
            ')',
        }}
      />

      {/* ── L10 — Shimmer highlight sweep (adds extra premium motion) ──── */}
      {/* A very faint diagonal light band that slowly drifts */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            `linear-gradient(` +
            `  ${108 + slow * 6}deg,` +
            `  transparent 30%,` +
            `  rgba(160, 210, 255, ${0.04 + ultra * 0.015}) 50%,` +
            `  transparent 70%` +
            `)`,
        }}
      />

      {/* ── L11 — Film grain overlay ────────────────────────────────────── */}
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
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── L12 — Second grain pass (soft-light for texture depth) ──────── */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'soft-light',
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      >
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
};
