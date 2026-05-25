import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from './colors';

/**
 * Swipe wipe transition — a colored panel sweeps across the screen.
 * duration: total frames for the wipe in + wipe out
 */
interface TransitionProps {
  color?: string;
  durationFrames?: number;
}

export const WipeTransition: React.FC<TransitionProps> = ({
  color = COLORS.strawberry,
  durationFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const half = durationFrames / 2;

  // First half: panel sweeps in from left
  // Second half: panel sweeps out to right
  let clipX: number;
  if (frame <= half) {
    clipX = interpolate(frame, [0, half], [0, 100]);
  } else {
    clipX = interpolate(frame, [half, durationFrames], [100, 200]);
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${clipX - 100}%`,
          width: '100%',
          height: '100%',
          background: color,
          borderRadius: 0,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Circle-burst transition: a circle expands from center then contracts
 */
export const CircleBurstTransition: React.FC<TransitionProps> = ({
  color = COLORS.strawberry,
  durationFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const half = durationFrames / 2;
  const maxR = 900;

  let r: number;
  let opacity = 1;
  if (frame <= half) {
    r = interpolate(frame, [0, half], [0, maxR]);
  } else {
    r = interpolate(frame, [half, durationFrames], [maxR, 0]);
    opacity = interpolate(frame, [half, durationFrames], [1, 0]);
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg
        width="1080"
        height="1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        <circle cx={540} cy={540} r={r} fill={color} opacity={opacity} />
      </svg>
    </AbsoluteFill>
  );
};
