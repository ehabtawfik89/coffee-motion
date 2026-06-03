import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

function Particle({ x, y, size, speed, frame }: { x: number; y: number; size: number; speed: number; frame: number }) {
  const t = (frame * speed) % 1;
  const opacity = Math.sin(t * Math.PI) * 0.5;
  const yPos = y - t * 300;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: yPos,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,220,120,0.6)',
        opacity,
        boxShadow: `0 0 ${size * 2}px rgba(255,200,80,0.4)`,
        pointerEvents: 'none',
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: 80 + (i * 47) % 920,
  y: 400 + (i * 83) % 1200,
  size: 2 + (i % 4),
  speed: 0.003 + (i % 5) * 0.001,
}));

export const MeatGain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Steak float + rotate
  const floatY = Math.sin(frame * 0.04) * 18;
  const rotateY = Math.sin(frame * 0.025) * 25;
  const rotateZ = Math.sin(frame * 0.02) * 4;

  // Number pulse
  const numScale = 1 + 0.025 * Math.sin(frame * 0.1);
  const numGlow = 0.7 + 0.3 * Math.sin(frame * 0.1);

  // Spotlight drift
  const spotX = 50 + Math.sin(frame * 0.015) * 6;

  // Entry spring
  const entryProgress = spring({ fps, frame, config: { damping: 14, stiffness: 80 }, durationInFrames: 40 });
  const entryY = interpolate(entryProgress, [0, 1], [80, 0]);
  const entryOpacity = interpolate(entryProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: 'radial-gradient(ellipse at 50% 30%, #0d1a2e 0%, #060e1c 50%, #020810 100%)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Drifting particles */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} frame={frame + i * 15} />
      ))}

      {/* Spotlight beam */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${spotX}%`,
          transform: 'translateX(-50%)',
          width: 500,
          height: 900,
          background: `linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 80%)`,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: entryOpacity,
          transform: `translateY(${entryY}px)`,
        }}
      >
        {/* Steak icon */}
        <div
          style={{
            marginBottom: 60,
            transform: `translateY(${floatY}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
            fontSize: 200,
            filter: 'drop-shadow(0 0 40px rgba(180,160,80,0.5)) drop-shadow(0 20px 60px rgba(0,0,0,0.8))',
            perspective: 600,
          }}
        >
          {/* SVG steak shape with metallic gradient */}
          <svg width="220" height="180" viewBox="0 0 220 180">
            <defs>
              <linearGradient id="steakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c0c0c0" />
                <stop offset="30%" stopColor="#888888" />
                <stop offset="60%" stopColor="#aaaaaa" />
                <stop offset="100%" stopColor="#606060" />
              </linearGradient>
              <linearGradient id="steakShine" x1="0%" y1="0%" x2="60%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <radialGradient id="rimLight" cx="80%" cy="20%" r="60%">
                <stop offset="0%" stopColor="rgba(210,160,60,0.6)" />
                <stop offset="100%" stopColor="rgba(210,160,60,0)" />
              </radialGradient>
            </defs>
            <ellipse cx="110" cy="95" rx="100" ry="72" fill="url(#steakGrad)" />
            {/* Swirl/marbling */}
            <path d="M 80 80 Q 110 60 140 80 Q 160 95 140 110 Q 110 125 80 110 Q 60 95 80 80 Z"
              fill="none" stroke="rgba(80,80,80,0.5)" strokeWidth="3" />
            <circle cx="108" cy="93" r="18" fill="#444" opacity="0.7" />
            <circle cx="108" cy="93" r="8" fill="#222" opacity="0.9" />
            {/* Shine */}
            <ellipse cx="110" cy="95" rx="100" ry="72" fill="url(#steakShine)" />
            <ellipse cx="110" cy="95" rx="100" ry="72" fill="url(#rimLight)" />
          </svg>
        </div>

        {/* +6.8% number */}
        <div
          style={{
            transform: `scale(${numScale})`,
            fontSize: 170,
            fontWeight: 900,
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#ffffff',
            textShadow: `0 0 ${40 * numGlow}px rgba(255,255,255,${0.6 * numGlow}), 0 0 80px rgba(255,255,255,0.3)`,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          +6.8%
        </div>

        {/* MEAT GAIN label */}
        <div
          style={{
            marginTop: 20,
            fontSize: 58,
            fontWeight: 700,
            fontFamily: 'Arial, sans-serif',
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: 8,
            textTransform: 'uppercase',
          }}
        >
          MEAT GAIN
        </div>
      </div>

      {/* Floor reflection */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 350,
          background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5))',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 400,
          height: 80,
          background: `radial-gradient(ellipse, rgba(255,255,255,${0.04 + 0.02 * Math.sin(frame * 0.06)}) 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
};
