import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

const DIGITS = '0123456789';

function randomDigit(seed: number): string {
  return DIGITS[Math.floor((seed * 1234567) % 10)];
}

function BlurryDigit({ frame, index }: { frame: number; index: number }) {
  const speed = index < 6 ? 3 + index * 0.4 : 1;
  const blur = index >= 7 ? 4 : index >= 5 ? 2 : 0;
  const digit = DIGITS[Math.floor((frame * speed + index * 7) % 10)];
  return (
    <span
      style={{
        display: 'inline-block',
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        color: '#ff2200',
        textShadow: '0 0 18px #ff3300, 0 0 40px #ff220088',
        fontFamily: "'Courier New', monospace",
        fontSize: 96,
        fontWeight: 900,
        letterSpacing: 2,
        minWidth: 58,
        textAlign: 'center',
      }}
    >
      {digit}
    </span>
  );
}

export const LossDayCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing glow
  const glowPulse = 0.7 + 0.3 * Math.sin(frame * 0.36);
  // Micro push-in camera
  const scale = interpolate(frame, [0, 90], [1, 1.04], { extrapolateRight: 'clamp' });
  // Background drift
  const bgX = Math.sin(frame * 0.03) * 18;
  const bgY = Math.cos(frame * 0.024) * 12;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: '#0a0000',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Drifting organic red background */}
      <div
        style={{
          position: 'absolute',
          inset: -80,
          backgroundImage: `radial-gradient(ellipse 500px 400px at ${50 + bgX * 0.05}% ${40 + bgY * 0.05}%, #3a0000 0%, #1a0000 40%, #080000 100%)`,
          transform: `translate(${bgX}px, ${bgY}px)`,
          opacity: 0.9,
        }}
      />
      {/* Red vein-like texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-radial-gradient(ellipse at ${30 + bgX * 0.03}% ${60 + bgY * 0.02}%, transparent 0px, #3a000033 2px, transparent 4px)`,
          opacity: 0.4,
        }}
      />

      {/* Device body */}
      <div
        style={{
          position: 'relative',
          transform: `scale(${scale})`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 820,
            borderRadius: 60,
            background: 'linear-gradient(160deg, #1a1a1a 0%, #111 40%, #0d0d0d 100%)',
            boxShadow: `0 0 80px 20px rgba(200,0,0,${0.15 * glowPulse}), 0 40px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)`,
            padding: '48px 40px 56px',
            border: '1px solid #2a2a2a',
          }}
        >
          {/* Label */}
          <div
            style={{
              color: '#ccc',
              fontSize: 34,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 400,
              letterSpacing: 4,
              textAlign: 'center',
              marginBottom: 24,
              textTransform: 'uppercase',
            }}
          >
            LOSS / DAY
          </div>

          {/* Display screen */}
          <div
            style={{
              background: '#050505',
              borderRadius: 18,
              padding: '28px 20px',
              boxShadow: `inset 0 2px 16px rgba(0,0,0,0.9), 0 0 ${30 * glowPulse}px rgba(255,30,0,${0.25 * glowPulse})`,
              border: '1px solid #1a1a1a',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Digit row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <React.Fragment key={i}>
                  {(i === 1 || i === 5 || i === 8) && (
                    <span
                      style={{
                        color: '#ff2200',
                        textShadow: '0 0 14px #ff3300',
                        fontSize: 80,
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 900,
                        paddingBottom: 4,
                        opacity: 0.9,
                      }}
                    >
                      ,
                    </span>
                  )}
                  <BlurryDigit frame={frame} index={i} />
                </React.Fragment>
              ))}
            </div>

            {/* Screen reflection shimmer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${20 + Math.sin(frame * 0.04) * 60}%`,
                width: '25%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Reflection below device */}
          <div
            style={{
              marginTop: 6,
              opacity: 0.15 + 0.05 * Math.sin(frame * 0.09),
              transform: 'scaleY(-0.35)',
              transformOrigin: 'top',
              filter: 'blur(3px)',
              color: '#ff2200',
              textShadow: '0 0 18px #ff3300',
              fontFamily: "'Courier New', monospace",
              fontSize: 96,
              fontWeight: 900,
              textAlign: 'center',
              letterSpacing: 2,
            }}
          >
            {Array.from({ length: 10 }, (_, i) => DIGITS[Math.floor((frame * (3 + i * 0.4) + i * 7) % 10)]).join('')}
          </div>
        </div>
      </div>

      {/* Ambient red glow at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 400,
          background: `radial-gradient(ellipse, rgba(200,0,0,${0.12 * glowPulse}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
