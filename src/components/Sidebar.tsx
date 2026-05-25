import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

// ─── SVG Icon primitives ─────────────────────────────────────────────────────
const DashIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <rect x={1} y={1} width={6} height={6} rx={1.5} fill="currentColor" />
    <rect x={9} y={1} width={6} height={6} rx={1.5} fill="currentColor" opacity={0.5} />
    <rect x={1} y={9} width={6} height={6} rx={1.5} fill="currentColor" opacity={0.5} />
    <rect x={9} y={9} width={6} height={6} rx={1.5} fill="currentColor" />
  </svg>
);

const PeopleIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <circle cx={5.5} cy={4} r={2.5} fill="currentColor" opacity={0.6} />
    <circle cx={10.5} cy={4} r={2.5} fill="currentColor" />
    <path d="M1 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
    <path d="M7 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <polyline points="1,12 5,7 9,9 15,3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={5} cy={7} r={1.5} fill="currentColor" opacity={0.7} />
    <circle cx={9} cy={9} r={1.5} fill="currentColor" opacity={0.7} />
    <circle cx={15} cy={3} r={1.5} fill="currentColor" />
  </svg>
);

const GoalsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <circle cx={8} cy={8} r={6.5} stroke="currentColor" strokeWidth={1.3} opacity={0.4} />
    <circle cx={8} cy={8} r={4} stroke="currentColor" strokeWidth={1.3} opacity={0.7} />
    <circle cx={8} cy={8} r={1.8} fill="currentColor" />
  </svg>
);

const PulseIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <polyline points="1,8 4,8 5,4 7,12 9,6 11,8 15,8" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReviewsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <rect x={1.5} y={2.5} width={13} height={10} rx={2} stroke="currentColor" strokeWidth={1.3} />
    <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" opacity={0.7} />
  </svg>
);

const SettingsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <circle cx={8} cy={8} r={2.5} stroke="currentColor" strokeWidth={1.3} />
    <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"
      stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
  </svg>
);

const NAV = [
  { label: 'Dashboard',  Icon: DashIcon,      id: 'dashboard' },
  { label: 'People',     Icon: PeopleIcon,    id: 'people' },
  { label: 'Analytics',  Icon: AnalyticsIcon, id: 'analytics' },
  { label: 'Goals',      Icon: GoalsIcon,     id: 'goals' },
  { label: 'Pulse',      Icon: PulseIcon,     id: 'pulse' },
  { label: 'Reviews',    Icon: ReviewsIcon,   id: 'reviews' },
];

interface SidebarProps {
  activeItem?: string;
  enterDelay?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard', enterDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame: Math.max(0, frame - enterDelay), fps, config: { damping: 22, stiffness: 120 } });
  const tx = interpolate(sp, [0, 1], [-240, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
        display: 'flex',
        flexDirection: 'column',
        transform: `translateX(${tx}px)`,
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '28px 24px 24px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo mark */}
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: `linear-gradient(135deg, ${T.primary} 0%, ${T.accent} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <path d="M3 14L9 4L15 14" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5.5 10H12.5" stroke="white" strokeWidth={2.2} strokeLinecap="round" opacity={0.6} />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, color: T.text1, letterSpacing: -0.4 }}>
              Zenithr
            </div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.text3, letterSpacing: 0.3, marginTop: 1 }}>
              Employee Experience
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: T.text3,
          letterSpacing: 1, textTransform: 'uppercase', padding: '4px 12px', marginBottom: 4 }}>
          Main Menu
        </div>
        {NAV.map(({ label, Icon, id }, i) => {
          const itemSp = spring({ frame: Math.max(0, frame - enterDelay - i * 6), fps,
            config: { damping: 20, stiffness: 140 } });
          const itemOpacity = interpolate(itemSp, [0, 1], [0, 1]);
          const active = id === activeItem;
          return (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: T.r8,
                background: active ? T.primaryDim : 'transparent',
                color: active ? T.primary : T.text2,
                cursor: 'pointer',
                position: 'relative',
                opacity: itemOpacity,
              }}
            >
              {active && (
                <div style={{
                  position: 'absolute',
                  left: -12,
                  top: 8,
                  bottom: 8,
                  width: 3,
                  borderRadius: '0 3px 3px 0',
                  background: T.primary,
                }} />
              )}
              <Icon />
              <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: active ? 600 : 400 }}>{label}</span>
              {id === 'pulse' && (
                <span style={{
                  marginLeft: 'auto',
                  background: T.danger,
                  color: 'white',
                  borderRadius: 9,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 7px',
                  fontFamily: T.sans,
                }}>3</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Workspace selector */}
      <div style={{ padding: '12px', borderTop: `1px solid ${T.border}` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
          borderRadius: T.r8, background: T.elevated, border: `1px solid ${T.border}`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: `linear-gradient(135deg, #F59E0B, #EF4444)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'white', fontFamily: T.sans,
          }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Acme Corp</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.text3 }}>Pro Plan · 406 members</div>
          </div>
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <path d="M3 5.5L7 9.5L11 5.5" stroke={T.text3} strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
