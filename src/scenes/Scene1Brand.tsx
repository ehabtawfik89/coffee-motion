import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

// Animated grid background
const GridBg: React.FC<{ frame: number }> = ({ frame }) => {
  const gridSize = 64;
  const cols = Math.ceil(1920 / gridSize) + 1;
  const rows = Math.ceil(1080 / gridSize) + 1;

  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={T.primaryGlow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Grid lines */}
      {Array.from({ length: cols }, (_, i) => (
        <line key={`v${i}`}
          x1={i * gridSize} y1={0}
          x2={i * gridSize} y2={1080}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <line key={`h${i}`}
          x1={0} y1={i * gridSize}
          x2={1920} y2={i * gridSize}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />
      ))}

      {/* Center glow */}
      <ellipse cx={960} cy={540} rx={500} ry={350} fill="url(#bgGrad)" opacity={0.5} />

      {/* Floating dots */}
      {[
        { x: 200, y: 180, r: 3 }, { x: 1720, y: 220, r: 2 }, { x: 340, y: 780, r: 2.5 },
        { x: 1600, y: 800, r: 3 }, { x: 960, y: 120, r: 2 }, { x: 100, y: 540, r: 2.5 },
        { x: 1820, y: 540, r: 2 }, { x: 540, y: 960, r: 3 }, { x: 1380, y: 960, r: 2.5 },
      ].map((d, i) => {
        const pulse = 0.5 + Math.sin(frame * 0.04 + i * 1.2) * 0.5;
        return (
          <circle key={i} cx={d.x} cy={d.y} r={d.r}
            fill={T.primary} opacity={pulse * 0.6} />
        );
      })}

      {/* Connecting lines between dots */}
      {[
        [200, 180, 340, 780], [1720, 220, 1600, 800], [960, 120, 1820, 540],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={`cl${i}`}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={T.primary}
          strokeWidth={0.8}
          opacity={0.12}
        />
      ))}
    </svg>
  );
};

export const Scene1Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo mark scale-in
  const logoSp = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const logoScale = interpolate(logoSp, [0, 0.5, 0.8, 1], [0, 1.15, 0.95, 1]);
  const logoOpacity = interpolate(logoSp, [0, 0.25], [0, 1]);

  // Company name: letter-by-letter reveal
  const name = 'ZENITHR';
  const lettersVisible = interpolate(frame, [20, 55], [0, name.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tagline fade-in
  const taglineSp = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 16, stiffness: 80 } });
  const taglineOpacity = interpolate(taglineSp, [0, 0.5], [0, 1]);
  const taglineY = interpolate(taglineSp, [0, 1], [16, 0]);

  // Subtitle pills
  const pills = ['Employee Experience', 'Performance', 'Engagement Analytics'];
  const pillDelay = 70;

  // Fade out
  const totalFrames = 120;
  const fadeOut = interpolate(frame, [totalFrames - 15, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #0E0B20 0%, ${T.bg} 70%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      <GridBg frame={frame} />

      {/* Content */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        zIndex: 2,
      }}>
        {/* Logo mark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: `linear-gradient(135deg, ${T.primary} 0%, ${T.accent} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginBottom: 28,
            boxShadow: `0 0 60px ${T.primaryGlow}, 0 8px 40px rgba(0,0,0,0.6)`,
          }}
        >
          <svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <path d="M8 34L22 10L36 34" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 24H30" stroke="white" strokeWidth={4} strokeLinecap="round" opacity={0.65} />
            <circle cx={22} cy={22} r={2.5} fill="white" opacity={0.4} />
          </svg>
        </div>

        {/* Company name */}
        <div style={{
          display: 'flex',
          gap: 2,
          marginBottom: 16,
        }}>
          {name.split('').map((char, i) => {
            const charSp = spring({
              frame: Math.max(0, frame - 20 - i * 4),
              fps,
              config: { damping: 14, stiffness: 120 },
            });
            const charY = interpolate(charSp, [0, 1], [-24, 0]);
            const charOp = interpolate(charSp, [0, 0.4], [0, 1]);
            return (
              <span
                key={i}
                style={{
                  fontFamily: T.sans,
                  fontSize: 72,
                  fontWeight: 900,
                  color: T.text1,
                  letterSpacing: -1,
                  transform: `translateY(${charY}px)`,
                  opacity: charOp,
                  display: 'inline-block',
                }}
              >{char}</span>
            );
          })}
        </div>

        {/* Tagline */}
        <div style={{
          transform: `translateY(${taglineY}px)`,
          opacity: taglineOpacity,
          marginBottom: 40,
        }}>
          <p style={{
            fontFamily: T.sans,
            fontSize: 22,
            fontWeight: 400,
            color: T.text2,
            textAlign: 'center',
            margin: 0,
            letterSpacing: 0.5,
          }}>
            The modern platform for&nbsp;
            <span style={{ color: T.primaryLight, fontWeight: 600 }}>employee-first</span>
            &nbsp;organizations
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 12 }}>
          {pills.map((pill, i) => {
            const pillSp = spring({
              frame: Math.max(0, frame - pillDelay - i * 10),
              fps,
              config: { damping: 14, stiffness: 130 },
            });
            const pillScale = interpolate(pillSp, [0, 0.6, 0.85, 1], [0, 1.08, 0.96, 1]);
            const pillOp = interpolate(pillSp, [0, 0.3], [0, 1]);
            return (
              <div
                key={pill}
                style={{
                  padding: '8px 20px',
                  borderRadius: 100,
                  background: T.elevated,
                  border: `1px solid ${T.border}`,
                  fontFamily: T.sans,
                  fontSize: 13,
                  fontWeight: 500,
                  color: T.text2,
                  transform: `scale(${pillScale})`,
                  opacity: pillOp,
                }}
              >{pill}</div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
