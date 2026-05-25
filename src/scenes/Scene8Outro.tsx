import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

const STATS = [
  { value: '94.1%', label: 'Retention Rate', color: T.cyan },
  { value: '8.7', label: 'Avg Engagement', color: T.primary },
  { value: '+22%', label: 'NPS Growth YoY', color: T.success },
  { value: '406', label: 'Employees Active', color: T.accent },
];

export const Scene8Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Logo entrance
  const logoSp = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const logoScale = interpolate(logoSp, [0, 0.5, 0.8, 1], [0, 1.1, 0.97, 1]);
  const logoOp = interpolate(logoSp, [0, 0.3], [0, 1]);

  // Tagline
  const tagSp = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 16, stiffness: 80 } });
  const tagOp = interpolate(tagSp, [0, 0.5], [0, 1]);
  const tagY  = interpolate(tagSp, [0, 1], [16, 0]);

  // CTA button
  const ctaSp = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 14, stiffness: 100 } });
  const ctaScale = interpolate(ctaSp, [0, 0.5, 0.8, 1], [0, 1.08, 0.97, 1]);
  const ctaOp = interpolate(ctaSp, [0, 0.3], [0, 1]);

  // Pulsing glow on CTA
  const ctaGlow = 0.4 + Math.sin(frame * 0.12) * 0.15;

  // Particle grid fade
  const gridOp = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #0E0B20 0%, ${T.bg} 65%)`,
        opacity: fadeIn,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Grid background */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: gridOp * 0.5 }}>
        {Array.from({ length: 32 }, (_, i) => (
          <line key={`v${i}`}
            x1={i * 60} y1={0} x2={i * 60} y2={1080}
            stroke="rgba(255,255,255,0.03)" strokeWidth={1}
          />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`h${i}`}
            x1={0} y1={i * 60} x2={1920} y2={i * 60}
            stroke="rgba(255,255,255,0.03)" strokeWidth={1}
          />
        ))}
        <radialGradient id="outroGlow" cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor={T.primaryGlow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <ellipse cx={960} cy={540} rx={480} ry={340} fill="url(#outroGlow)" opacity={0.6} />
      </svg>

      {/* Stats row – top */}
      <div style={{
        position: 'absolute', top: 80,
        display: 'flex', gap: 60, alignItems: 'center',
      }}>
        {STATS.map((stat, i) => {
          const sp = spring({ frame: Math.max(0, frame - 8 - i * 8), fps, config: { damping: 14, stiffness: 120 } });
          const op = interpolate(sp, [0, 0.4], [0, 1]);
          const ty = interpolate(sp, [0, 1], [-18, 0]);
          return (
            <div key={stat.label} style={{
              textAlign: 'center', opacity: op, transform: `translateY(${ty}px)`,
            }}>
              <div style={{ fontFamily: T.sans, fontSize: 40, fontWeight: 900, color: stat.color, letterSpacing: -1, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 14, color: T.text3, marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider line */}
      {frame > 20 && (
        <div style={{
          position: 'absolute', top: 180, left: '50%', transform: 'translateX(-50%)',
          width: interpolate(frame, [20, 50], [0, 700], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 1, background: T.border,
        }} />
      )}

      {/* Center: Logo + tagline */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Logo mark */}
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: `linear-gradient(135deg, ${T.primary} 0%, ${T.accent} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          transform: `scale(${logoScale})`,
          opacity: logoOp,
          boxShadow: `0 0 60px ${T.primaryGlow}, 0 8px 40px rgba(0,0,0,0.6)`,
        }}>
          <svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <path d="M8 34L22 10L36 34" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 24H30" stroke="white" strokeWidth={4} strokeLinecap="round" opacity={0.65} />
          </svg>
        </div>

        <div style={{
          fontFamily: T.sans, fontSize: 80, fontWeight: 900, color: T.text1,
          letterSpacing: -3, lineHeight: 1,
          opacity: logoOp,
          transform: `scale(${logoScale})`,
          display: 'inline-block',
        }}>
          Zenithr
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: T.sans, fontSize: 24, fontWeight: 400, color: T.text2,
          margin: '16px 0 48px', letterSpacing: 0.3,
          opacity: tagOp, transform: `translateY(${tagY}px)`,
        }}>
          The modern platform for&nbsp;
          <span style={{ color: T.primaryLight, fontWeight: 600 }}>employee-first</span>
          &nbsp;organizations
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: 16, justifyContent: 'center',
          transform: `scale(${ctaScale})`, opacity: ctaOp,
        }}>
          <div style={{
            padding: '16px 40px',
            background: T.primary,
            borderRadius: T.r12,
            fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: 'white',
            boxShadow: `0 0 40px ${T.primary + Math.round(ctaGlow * 255).toString(16).padStart(2, '0')}, 0 4px 20px rgba(0,0,0,0.5)`,
            letterSpacing: 0.2,
          }}>
            Start Free Trial
          </div>
          <div style={{
            padding: '16px 40px',
            background: T.elevated,
            border: `1px solid ${T.borderMid}`,
            borderRadius: T.r12,
            fontFamily: T.sans, fontSize: 18, fontWeight: 600, color: T.text1,
          }}>
            Request a Demo
          </div>
        </div>

        {/* URL */}
        <p style={{
          fontFamily: T.sans, fontSize: 16, color: T.text3,
          margin: '32px 0 0', opacity: ctaOp,
        }}>
          zenithr.io · hello@zenithr.io
        </p>
      </div>

      {/* Bottom tagline strip */}
      {frame > 50 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 48,
          background: T.surface,
          borderTop: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 40,
          opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {['Employee NPS', 'Pulse Surveys', 'Performance Reviews', 'Org Analytics', 'Goal Tracking'].map((item) => (
            <span key={item} style={{ fontFamily: T.sans, fontSize: 14, color: T.text3 }}>
              {item}
            </span>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
