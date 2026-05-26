import React from 'react';
import { interpolate } from 'remotion';

/* ─────────────────────────────────────────────────────────────────
   Flying message bubbles + sparkle particles
   ───────────────────────────────────────────────────────────────── */

interface Particle {
  id: number;
  angle: number;     // radians
  speed: number;     // relative
  delay: number;     // frames delay
  size: number;
  color: string;
  isStar: boolean;
}

// Deterministic "random" from seed
const rand = (seed: number, min = 0, max = 1) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return min + (x - Math.floor(x)) * (max - min);
};

const BUBBLE_COLORS = ['#25D366', '#128C7E', '#075E54', '#34D399', '#6EE7B7'];
const STAR_COLORS   = ['#FFD700', '#FFC107', '#FFB300', '#FBBF24', '#F59E0B'];

// Generate sending bubbles
const BUBBLES: Particle[] = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  angle: (i / 18) * Math.PI * 2,
  speed: 0.6 + rand(i * 3 + 1) * 0.7,
  delay: Math.floor(rand(i * 7 + 2) * 25),
  size: 22 + rand(i * 5 + 3) * 16,
  color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
  isStar: false,
}));

// Sparkle stars for final scene
const SPARKLES: Particle[] = Array.from({ length: 28 }, (_, i) => ({
  id: i + 100,
  angle: (i / 28) * Math.PI * 2 + rand(i) * 0.5,
  speed: 0.3 + rand(i * 13) * 0.6,
  delay: Math.floor(rand(i * 11 + 5) * 20),
  size: 6 + rand(i * 4) * 10,
  color: STAR_COLORS[i % STAR_COLORS.length],
  isStar: true,
}));

/* ─── Message bubble flying out ─── */
const FlyingBubble: React.FC<{
  particle: Particle;
  cx: number; cy: number;
  frame: number;
  totalFrames: number;
  radius: number;
}> = ({ particle, cx, cy, frame, totalFrames, radius }) => {
  const localFrame = frame - particle.delay;
  if (localFrame < 0) return null;

  const progress = interpolate(localFrame, [0, totalFrames * 0.7], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const opacity = interpolate(localFrame, [0, 8, totalFrames * 0.5, totalFrames * 0.8], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  if (opacity <= 0) return null;

  const dist = progress * radius * particle.speed;
  const x = cx + Math.cos(particle.angle) * dist;
  const y = cy + Math.sin(particle.angle) * dist;

  if (particle.isStar) {
    // Star shape sparkle
    return (
      <div style={{
        position: 'absolute',
        left: x - particle.size / 2,
        top: y - particle.size / 2,
        width: particle.size,
        height: particle.size,
        opacity,
        pointerEvents: 'none',
      }}>
        <svg width={particle.size} height={particle.size} viewBox="0 0 20 20">
          <polygon
            points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
            fill={particle.color}
          />
        </svg>
      </div>
    );
  }

  // WhatsApp-style message bubble with ✓✓
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y - particle.size * 0.5,
      background: particle.color,
      borderRadius: `${particle.size * 0.45}px ${particle.size * 0.45}px ${particle.size * 0.45}px ${particle.size * 0.12}px`,
      padding: `${particle.size * 0.2}px ${particle.size * 0.35}px`,
      opacity,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
      minWidth: particle.size * 1.2,
    }}>
      <div style={{ width: particle.size * 0.25, height: particle.size * 0.25, borderRadius: 2, background: 'rgba(255,255,255,0.7)' }} />
      {/* Double tick */}
      <svg width={particle.size * 0.5} height={particle.size * 0.35} viewBox="0 0 14 10">
        <polyline points="1,5 4,8 8,2" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="5,5 8,8 13,2" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/* ─── Ripple ring ─── */
export const RippleRing: React.FC<{
  cx: number; cy: number;
  frame: number;
  delay?: number;
  color?: string;
  maxRadius?: number;
}> = ({ cx, cy, frame, delay = 0, color = '#25D366', maxRadius = 200 }) => {
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const progress = interpolate(localFrame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const r = progress * maxRadius;
  const opacity = interpolate(localFrame, [0, 10, 35, 40], [0, 0.6, 0.2, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (opacity <= 0) return null;

  return (
    <div style={{
      position: 'absolute',
      left: cx - r,
      top: cy - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      border: `2px solid ${color}`,
      opacity,
      pointerEvents: 'none',
    }} />
  );
};

/* ─── Main sending effect overlay (drawn over the phone area) ─── */
export const SendingEffect: React.FC<{
  cx: number; cy: number;       // origin point (phone center on canvas)
  frame: number;
  totalFrames?: number;
  mode: 'bubbles' | 'sparkles';
}> = ({ cx, cy, frame, totalFrames = 60, mode }) => {
  const particles = mode === 'sparkles' ? SPARKLES : BUBBLES;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {/* Ripple rings */}
      {mode === 'bubbles' && [0, 12, 24, 36].map(d => (
        <RippleRing key={d} cx={cx} cy={cy} frame={frame} delay={d} maxRadius={Math.max(cx, cy) * 1.2} />
      ))}

      {/* Particles */}
      {particles.map(p => (
        <FlyingBubble
          key={p.id}
          particle={p}
          cx={cx} cy={cy}
          frame={frame}
          totalFrames={totalFrames}
          radius={Math.max(cx, cy) * 1.4}
        />
      ))}
    </div>
  );
};

/* ─── Background ambient glow ─── */
export const AmbientGlow: React.FC<{
  cx: number; cy: number;
  intensity: number; // 0-1
  color?: string;
}> = ({ cx, cy, intensity, color = '#25D366' }) => {
  if (intensity <= 0) return null;
  return (
    <div style={{
      position: 'absolute',
      left: cx - 300,
      top: cy - 300,
      width: 600,
      height: 600,
      borderRadius: '50%',
      background: `radial-gradient(ellipse, ${color}${Math.round(intensity * 0.22 * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
      pointerEvents: 'none',
      zIndex: 10,
    }} />
  );
};
