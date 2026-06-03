import React from 'react';
import { useCurrentFrame, spring, interpolate } from 'remotion';

function Particle({ x, y, size, speed, frame, delay }: { x: number; y: number; size: number; speed: number; frame: number; delay: number }) {
  const t = ((frame + delay) * speed) % 1;
  const opacity = Math.sin(t * Math.PI) * 0.3;
  const yPos = y - t * 400;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: yPos,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(160,200,255,0.7)',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: 60 + (i * 61) % 960,
  y: 500 + (i * 97) % 1000,
  size: 2 + (i % 3),
  speed: 0.002 + (i % 4) * 0.0008,
  delay: i * 22,
}));

export const MilkYield: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const floatY = Math.sin(frame * 0.035) * 15;
  const numScale = 1 + 0.02 * Math.sin(frame * 0.09);
  const numGlow = 0.7 + 0.3 * Math.sin(frame * 0.09);
  const dropPulse = 1 + 0.04 * Math.sin(frame * 0.07);

  const entryProgress = spring({ fps, frame, config: { damping: 16, stiffness: 70 }, durationInFrames: 45 });
  const entryOpacity = interpolate(entryProgress, [0, 1], [0, 1]);
  const entryScale = interpolate(entryProgress, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: 'radial-gradient(ellipse at 50% 40%, #0a1628 0%, #060e1e 60%, #020810 100%)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} frame={frame} />
      ))}

      {/* Card */}
      <div
        style={{
          opacity: entryOpacity,
          transform: `scale(${entryScale}) translateY(${floatY}px)`,
          width: 780,
          borderRadius: 48,
          background: 'linear-gradient(160deg, #0d1b35 0%, #091326 50%, #060f1e 100%)',
          boxShadow: `0 0 0 1px rgba(100,160,255,0.1), 0 40px 120px rgba(0,0,0,0.7), 0 0 60px rgba(80,130,255,0.08)`,
          padding: '70px 60px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Card shimmer overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${-30 + Math.sin(frame * 0.025) * 80}%`,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Milk drop icon */}
        <div
          style={{
            marginBottom: 50,
            transform: `scale(${dropPulse})`,
            filter: `drop-shadow(0 0 ${20 * numGlow}px rgba(255,255,255,${0.5 * numGlow}))`,
          }}
        >
          <svg width="110" height="140" viewBox="0 0 110 140">
            <defs>
              <radialGradient id="dropGrad" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f0f0f0" />
                <stop offset="50%" stopColor="#c8c8c8" />
                <stop offset="100%" stopColor="#909090" />
              </radialGradient>
              <radialGradient id="dropShine" cx="35%" cy="25%" r="40%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            {/* Drop shape */}
            <path
              d="M 55 10 C 55 10 20 60 20 88 C 20 110 35 130 55 130 C 75 130 90 110 90 88 C 90 60 55 10 55 10 Z"
              fill="url(#dropGrad)"
            />
            <path
              d="M 55 10 C 55 10 20 60 20 88 C 20 110 35 130 55 130 C 75 130 90 110 90 88 C 90 60 55 10 55 10 Z"
              fill="url(#dropShine)"
            />
          </svg>
        </div>

        {/* +3.8% */}
        <div
          style={{
            transform: `scale(${numScale})`,
            fontSize: 150,
            fontWeight: 900,
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#ffffff',
            textShadow: `0 0 ${35 * numGlow}px rgba(255,255,255,${0.7 * numGlow}), 0 0 70px rgba(255,255,255,0.2)`,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          +3.8%
        </div>

        {/* MILK YIELD label */}
        <div
          style={{
            marginTop: 24,
            fontSize: 52,
            fontWeight: 600,
            fontFamily: 'Arial, sans-serif',
            color: '#4ade80',
            letterSpacing: 6,
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(74,222,128,0.4)',
          }}
        >
          MILK YIELD
        </div>
      </div>

      {/* Floor reflection */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 200,
          background: `radial-gradient(ellipse, rgba(80,130,255,${0.04 + 0.02 * Math.sin(frame * 0.05)}) 0%, transparent 70%)`,
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
