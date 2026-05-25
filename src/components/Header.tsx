import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  enterDelay?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Dashboard',
  subtitle = 'Q4 2024 Overview',
  enterDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame: Math.max(0, frame - enterDelay), fps, config: { damping: 20, stiffness: 100 } });
  const ty = interpolate(sp, [0, 1], [-24, 0]);
  const opacity = interpolate(sp, [0, 0.4], [0, 1]);

  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        borderBottom: `1px solid ${T.border}`,
        background: `${T.surface}CC`,
        backdropFilter: 'blur(12px)',
        transform: `translateY(${ty}px)`,
        opacity,
        flexShrink: 0,
        zIndex: 5,
      }}
    >
      {/* Left: breadcrumb + title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text3 }}>Zenithr</span>
          <span style={{ color: T.text3, fontSize: 12 }}>/</span>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text2 }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h1 style={{ fontFamily: T.sans, fontSize: 20, fontWeight: 700, color: T.text1, margin: 0, letterSpacing: -0.4 }}>
            {title}
          </h1>
          <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text3 }}>{subtitle}</span>
        </div>
      </div>

      {/* Right: search + notifs + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Search bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: T.elevated,
          border: `1px solid ${T.border}`,
          borderRadius: T.r8,
          padding: '7px 14px',
          width: 200,
        }}>
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <circle cx={6} cy={6} r={4.5} stroke={T.text3} strokeWidth={1.3} />
            <path d="M9.5 9.5L12.5 12.5" stroke={T.text3} strokeWidth={1.3} strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text3 }}>Search people...</span>
        </div>

        {/* Date range pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: T.elevated,
          border: `1px solid ${T.border}`,
          borderRadius: T.r8,
          padding: '7px 14px',
        }}>
          <svg width={13} height={13} viewBox="0 0 13 13" fill="none">
            <rect x={1} y={2} width={11} height={10} rx={1.5} stroke={T.text3} strokeWidth={1.2} />
            <path d="M4 1V3M9 1V3M1 5H12" stroke={T.text3} strokeWidth={1.2} strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text2 }}>Oct 2024</span>
        </div>

        {/* Notification bell */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: T.r8,
          background: T.elevated,
          border: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path d="M8 2C5.8 2 4 3.8 4 6v4l-1.5 2H13.5L12 10V6C12 3.8 10.2 2 8 2Z"
              stroke={T.text2} strokeWidth={1.3} strokeLinejoin="round" />
            <path d="M6.5 13.5C6.5 14.3 7.2 15 8 15s1.5-.7 1.5-1.5" stroke={T.text2} strokeWidth={1.3} />
          </svg>
          <div style={{
            position: 'absolute',
            top: 6, right: 6,
            width: 7, height: 7,
            borderRadius: '50%',
            background: T.danger,
            border: `1.5px solid ${T.surface}`,
          }} />
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `linear-gradient(135deg, #6366F1, #8B5CF6)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: 'white',
            fontFamily: T.sans,
          }}>JL</div>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.text1 }}>James Liu</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.text3 }}>CEO · Admin</div>
          </div>
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke={T.text3} strokeWidth={1.4} strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
