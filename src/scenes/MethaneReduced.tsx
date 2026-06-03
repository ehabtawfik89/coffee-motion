import React from 'react';
import { useCurrentFrame, spring, interpolate } from 'remotion';

function Bubble({ x, startY, size, speed, frame, delay }: {
  x: number; startY: number; size: number; speed: number; frame: number; delay: number;
}) {
  const t = Math.min(((frame + delay) * speed), 1);
  const y = startY - t * 500;
  const opacity = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - (t - 0.7) / 0.3) : 1;
  const scale = 1 + t * 0.3;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - (size * scale) / 2,
        top: y - (size * scale) / 2,
        width: size * scale,
        height: size * scale,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, rgba(255,100,100,0.9), rgba(180,0,0,0.6))',
        opacity: opacity * 0.8,
        boxShadow: `0 0 ${size}px rgba(255,50,50,0.4), inset 0 0 ${size * 0.3}px rgba(255,200,200,0.3)`,
        pointerEvents: 'none',
      }}
    />
  );
}

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  x: 380 + (i * 41) % 320,
  startY: 750 + (i % 3) * 60,
  size: 18 + (i % 4) * 14,
  speed: 0.004 + (i % 3) * 0.002,
  delay: i * 18,
}));

function BokehDot({ x, y, size, frame, phase }: { x: number; y: number; size: number; frame: number; phase: number }) {
  const opacity = 0.1 + 0.08 * Math.sin(frame * 0.03 + phase);
  const driftX = Math.sin(frame * 0.015 + phase) * 20;
  const driftY = Math.cos(frame * 0.012 + phase) * 15;
  return (
    <div
      style={{
        position: 'absolute',
        left: x + driftX,
        top: y + driftY,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,80,80,0.8), transparent)',
        opacity,
        filter: `blur(${size * 0.4}px)`,
        pointerEvents: 'none',
      }}
    />
  );
}

const BOKEH = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 73) % 1080,
  y: (i * 127) % 1920,
  size: 30 + (i % 5) * 20,
  phase: i * 0.7,
}));

export const MethaneReduced: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const numGlow = 0.7 + 0.3 * Math.sin(frame * 0.1);
  const numScale = 1 + 0.02 * Math.sin(frame * 0.1);
  const arrowPulse = 1 + 0.06 * Math.sin(frame * 0.12);
  const floatY = Math.sin(frame * 0.03) * 12;

  const entryProgress = spring({ fps, frame, config: { damping: 14, stiffness: 75 }, durationInFrames: 40 });
  const entryOpacity = interpolate(entryProgress, [0, 1], [0, 1]);
  const entryScale = interpolate(entryProgress, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: 'radial-gradient(ellipse at 50% 40%, #0e0d18 0%, #080812 60%, #040408 100%)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Red bokeh background */}
      {BOKEH.map((b, i) => (
        <BokehDot key={i} {...b} frame={frame} />
      ))}

      {/* Bubbles */}
      {BUBBLES.map((b, i) => (
        <Bubble key={i} {...b} frame={frame} />
      ))}

      {/* Card */}
      <div
        style={{
          opacity: entryOpacity,
          transform: `scale(${entryScale}) translateY(${floatY}px)`,
          width: 760,
          borderRadius: 44,
          background: 'linear-gradient(160deg, rgba(20,16,35,0.92) 0%, rgba(14,12,26,0.95) 100%)',
          boxShadow: `0 0 0 1px rgba(200,80,80,0.15), 0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(180,0,0,0.08)`,
          padding: '80px 60px 90px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Bubbles cluster icon */}
        <div style={{ marginBottom: 50, position: 'relative', width: 140, height: 110 }}>
          {[
            { cx: 70, cy: 72, r: 36, delay: 0 },
            { cx: 105, cy: 65, r: 28, delay: 5 },
            { cx: 44, cy: 60, r: 20, delay: 10 },
            { cx: 92, cy: 40, r: 14, delay: 15 },
            { cx: 58, cy: 35, r: 10, delay: 20 },
          ].map((bubble, i) => {
            const floatOffset = Math.sin(frame * 0.04 + bubble.delay * 0.3) * 4;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: bubble.cx - bubble.r,
                  top: bubble.cy - bubble.r + floatOffset,
                  width: bubble.r * 2,
                  height: bubble.r * 2,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 30%, rgba(255,150,150,0.9), rgba(200,0,0,0.7))`,
                  boxShadow: `0 0 ${bubble.r * 0.8}px rgba(255,50,50,0.5), inset 0 0 ${bubble.r * 0.4}px rgba(255,220,220,0.2)`,
                  opacity: 0.9,
                }}
              />
            );
          })}
        </div>

        {/* -21% with arrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transform: `scale(${numScale})`,
          }}
        >
          <div
            style={{
              fontSize: 148,
              fontWeight: 900,
              fontFamily: 'Arial Black, Arial, sans-serif',
              color: '#ff6060',
              textShadow: `0 0 ${35 * numGlow}px rgba(255,60,60,${0.7 * numGlow}), 0 0 70px rgba(255,0,0,0.25)`,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            -21%
          </div>
          {/* Downward arrow */}
          <div
            style={{
              transform: `scale(${arrowPulse})`,
              fontSize: 100,
              color: '#ff4444',
              textShadow: `0 0 20px rgba(255,50,50,${0.8 * numGlow})`,
              lineHeight: 1,
              marginTop: 10,
            }}
          >
            ↓
          </div>
        </div>

        {/* METHANE REDUCED label */}
        <div
          style={{
            marginTop: 28,
            fontSize: 50,
            fontWeight: 700,
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            letterSpacing: 5,
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          METHANE{'\n'}REDUCED
        </div>

        {/* Red underline */}
        <div
          style={{
            marginTop: 16,
            width: 160,
            height: 3,
            background: `linear-gradient(90deg, transparent, rgba(255,60,60,${0.6 + 0.4 * numGlow}), transparent)`,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Bottom glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 200,
          background: `radial-gradient(ellipse, rgba(200,0,0,${0.06 * numGlow}) 0%, transparent 70%)`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
