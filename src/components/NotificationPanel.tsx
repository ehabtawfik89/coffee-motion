import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T } from '../theme';

const NOTIFICATIONS = [
  {
    type: 'success',
    icon: '↑',
    title: 'Pulse score increased',
    body: 'Engineering team NPS up 12% this sprint',
    time: '2m ago',
    color: T.success,
  },
  {
    type: 'info',
    icon: '★',
    title: 'New review completed',
    body: 'Priya Patel submitted Q4 performance review',
    time: '14m ago',
    color: T.primary,
  },
  {
    type: 'warning',
    icon: '!',
    title: 'Action required',
    body: '3 team goals are behind schedule',
    time: '1h ago',
    color: T.warning,
  },
  {
    type: 'info',
    icon: '+',
    title: 'New hire onboarding',
    body: 'Alex Kim joined — Day 1 onboarding started',
    time: '3h ago',
    color: T.cyan,
  },
  {
    type: 'success',
    icon: '✓',
    title: 'Milestone reached',
    body: 'Retention rate held above 94% for 6 months',
    time: '1d ago',
    color: T.success,
  },
];

interface NotificationPanelProps {
  enterDelay?: number;
  slideFromRight?: boolean;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  enterDelay = 0,
  slideFromRight = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame: Math.max(0, frame - enterDelay), fps, config: { damping: 20, stiffness: 100 } });
  const tx = interpolate(sp, [0, 1], [slideFromRight ? 80 : -80, 0]);
  const opacity = interpolate(sp, [0, 0.3], [0, 1]);

  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.r16,
        overflow: 'hidden',
        transform: `translateX(${tx}px)`,
        opacity,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: T.danger,
            boxShadow: `0 0 8px ${T.danger}`,
            animation: 'none',
          }} />
          <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.text1 }}>
            Activity Feed
          </span>
        </div>
        <span style={{
          background: T.dangerDim, color: T.danger,
          borderRadius: 10, padding: '2px 8px',
          fontFamily: T.sans, fontSize: 11, fontWeight: 700,
        }}>3 new</span>
      </div>

      {/* Notification list */}
      <div style={{ padding: '8px 0' }}>
        {NOTIFICATIONS.map((notif, i) => {
          const itemSp = spring({
            frame: Math.max(0, frame - enterDelay - i * 10),
            fps,
            config: { damping: 18, stiffness: 130 },
          });
          const itemTx = interpolate(itemSp, [0, 1], [24, 0]);
          const itemOp = interpolate(itemSp, [0, 0.3], [0, 1]);

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 20px',
                borderBottom: i < NOTIFICATIONS.length - 1 ? `1px solid ${T.border}` : 'none',
                transform: `translateX(${itemTx}px)`,
                opacity: itemOp,
                background: i === 0 ? `${T.primary}08` : 'transparent',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: `${notif.color}18`,
                color: notif.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800,
                flexShrink: 0,
                fontFamily: T.sans,
              }}>
                {notif.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 3,
                }}>
                  <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.text1 }}>
                    {notif.title}
                  </span>
                  <span style={{ fontFamily: T.sans, fontSize: 11, color: T.text3, flexShrink: 0 }}>
                    {notif.time}
                  </span>
                </div>
                <p style={{
                  fontFamily: T.sans, fontSize: 12, color: T.text2,
                  margin: 0, lineHeight: 1.5,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {notif.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: `1px solid ${T.border}`,
        display: 'flex', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.primary, cursor: 'pointer' }}>
          View all activity →
        </span>
      </div>
    </div>
  );
};
