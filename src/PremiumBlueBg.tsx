import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * PremiumBlueBg — 10-second premium motion background
 * 1920 × 1080 · 300 frames @ 30 fps
 *
 * Inspired by the reference: a close-up of a glowing planetary orb in
 * deep cerulean blues against dark space.  The source portrait image is
 * "rotated 90° clockwise" for widescreen — so the illuminated sphere
 * surface that occupied the left side now fills the lower portion of the
 * landscape frame, its bright limb sweeping as a horizontal arc.
 *
 * Motion elements:
 *   • Gentle glow "breath" — 1 full sine cycle over the 10 s clip
 *   • Slow atmospheric shimmer — offset frequency adds organic life
 *   • Micro positional drift — the sphere center sways imperceptibly
 *   • Animated film grain — two SVG feTurbulence layers (10 fps flicker)
 *     to emulate the premium tactile texture of high-end motion graphics
 */
export const PremiumBlueBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // ── Timing ────────────────────────────────────────────────────────────────
  const t = frame / durationInFrames; // 0 → 1 over the clip

  // Primary breath: 3 full sine cycles (3× original speed).
  const breathe = (Math.sin(t * Math.PI * 6 - Math.PI / 2) + 1) / 2;

  // Atmospheric shimmer — 3× speed, same 1.3 relative offset
  const shimmer = (Math.sin(t * Math.PI * 7.8 + 0.9) + 1) / 2;

  // ── Grain seed ────────────────────────────────────────────────────────────
  // Change every frame → 30 fps grain flicker (3× original)
  const gs = frame;

  // ── Sphere drift ─────────────────────────────────────────────────────────
  // 3× faster sway, slightly wider amplitude so fast motion reads clearly
  const cx = 50 + Math.sin(t * Math.PI * 2.55) * 2.2;         // % x
  const cy = 116 + Math.sin(t * Math.PI * 1.86 + 0.7) * 1.4;  // % y — below frame

  // ── Opacity drivers ───────────────────────────────────────────────────────
  const coreOp = interpolate(breathe, [0, 1], [0.86, 1.00]);   // body glow
  const limbOp = interpolate(shimmer, [0, 1], [0.68, 0.96]);   // rim brightness
  const hazeOp = interpolate(breathe, [0, 1], [0.52, 0.74]);   // corona haze

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>

      {/* ── 0 · Deep space base ──────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, background: '#010912' }} />

      {/* ── 1 · Planet body ──────────────────────────────────────────────── */}
      {/*   A massive sphere centred below the frame; its upper cap fills     */}
      {/*   the lower section of the widescreen canvas.                       */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(
          ellipse 100% 88% at ${cx}% ${cy}%,
          rgba(155, 210, 255, ${0.94 * coreOp})  0%,
          rgba( 70, 148, 238, ${0.88 * coreOp}) 13%,
          rgba( 26,  80, 195, ${0.80 * coreOp}) 29%,
          rgba(  8,  34, 118, ${0.62 * coreOp}) 46%,
          rgba(  2,  11,  44, 0.38)             62%,
          transparent                           80%
        )`,
      }} />

      {/* ── 2 · Bright atmospheric limb / rim highlight ───────────────────── */}
      {/*   The luminous crescent where sunlight grazes the atmosphere.        */}
      {/*   Sits slightly inside the sphere edge to simulate limb darkening.   */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(
          ellipse 96% 84% at ${cx + 0.4}% ${cy - 0.8}%,
          transparent                           59%,
          rgba(165, 215, 255, ${0.32 * limbOp}) 62%,
          rgba(215, 240, 255, ${0.78 * limbOp}) 64.8%,
          rgba(245, 252, 255, ${0.92 * limbOp}) 65.8%,
          rgba(200, 232, 255, ${0.52 * limbOp}) 67.2%,
          rgba( 80, 158, 240, ${0.14 * limbOp}) 70.0%,
          transparent                           74%
        )`,
      }} />

      {/* ── 3 · Extended atmospheric corona ─────────────────────────────── */}
      {/*   Soft blue haze that bleeds outward beyond the sharp rim.           */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(
          ellipse 108% 92% at ${cx}% ${cy}%,
          transparent                           73%,
          rgba( 18,  62, 175, ${0.22 * hazeOp}) 79%,
          rgba(  7,  26,  88, ${0.14 * hazeOp}) 87%,
          transparent                           95%
        )`,
      }} />

      {/* ── 4 · Deep space darkness — upper frame ───────────────────────── */}
      {/*   Matches the dark right side of the portrait original which,        */}
      {/*   after a 90° CW rotation, becomes the top of the landscape frame.  */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(
          to bottom,
          rgba(0,  4, 14, 0.95)  0%,
          rgba(0,  6, 20, 0.68) 20%,
          rgba(0,  4, 14, 0.14) 46%,
          transparent           60%
        )`,
      }} />

      {/* ── 5 · Side vignettes — gentle frame edges ─────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(
          to right,
          rgba(0, 2, 10, 0.48)  0%,
          transparent           16%,
          transparent           84%,
          rgba(0, 2, 10, 0.48) 100%
        )`,
      }} />

      {/* ── 6 · Specular surface shimmer (very subtle) ───────────────────── */}
      {/*   A slow-moving soft highlight drifts across the upper sphere         */}
      {/*   surface, giving the orb a sense of three-dimensional rotation.     */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(
          ellipse 40% 28% at ${cx - 12 + Math.sin(t * Math.PI * 5.1) * 6}% ${cy - 35}%,
          rgba(190, 228, 255, ${0.10 * coreOp * shimmer}) 0%,
          rgba(130, 190, 255, ${0.06 * coreOp * shimmer}) 40%,
          transparent 100%
        )`,
      }} />

      {/* ── 7 · Film grain — primary coarse layer ───────────────────────── */}
      {/*   Emulates photographic grain.  Screen blend adds bright sparkle     */}
      {/*   without crushing darks.  Opacity ~5 % keeps it subliminal.        */}
      <svg
        key={`grain-a-${gs}`}
        width={width}
        height={height}
        style={{
          position: 'absolute', top: 0, left: 0,
          opacity: 0.052,
          // @ts-ignore — mixBlendMode is valid in Remotion / Chromium
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter
            id={`g-a-${gs}`}
            x="0%" y="0%" width="100%" height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.70"
              numOctaves="4"
              seed={gs}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#g-a-${gs})`} />
      </svg>

      {/* ── 8 · Film grain — fine halation layer ────────────────────────── */}
      {/*   Higher spatial frequency gives a tactile "depth" to the grain.    */}
      {/*   Overlay blend gently increases micro-contrast throughout.          */}
      <svg
        key={`grain-b-${gs}`}
        width={width}
        height={height}
        style={{
          position: 'absolute', top: 0, left: 0,
          opacity: 0.030,
          // @ts-ignore
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter
            id={`g-b-${gs}`}
            x="0%" y="0%" width="100%" height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.22"
              numOctaves="3"
              seed={gs + 397}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#g-b-${gs})`} />
      </svg>

    </div>
  );
};
