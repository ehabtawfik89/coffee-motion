import React from 'react';

/* ─────────────────────────────────────────────────────────────────
   Realistic smartphone frame — iPhone-style proportions
   ───────────────────────────────────────────────────────────────── */

interface PhoneFrameProps {
  width: number;
  height: number;
  children?: React.ReactNode;
  screenGlow?: number; // 0-1
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  width,
  height,
  children,
  screenGlow = 0,
}) => {
  const borderR = width * 0.12;      // border-radius proportional
  const bezel   = width * 0.03;      // bezel thickness
  const notchW  = width * 0.28;
  const notchH  = height * 0.025;
  const screenW = width - bezel * 2;
  const screenH = height - bezel * 2;

  return (
    <div style={{
      width,
      height,
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Drop shadow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: borderR,
        boxShadow: [
          `0 ${height * 0.06}px ${height * 0.12}px rgba(0,0,0,0.85)`,
          `0 ${height * 0.02}px ${height * 0.04}px rgba(0,0,0,0.6)`,
          `0 0 ${width * 0.15}px rgba(0,0,0,0.4)`,
        ].join(', '),
      }} />

      {/* Phone body */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: borderR,
        background: 'linear-gradient(160deg, #2e2e2e 0%, #1c1c1c 45%, #141414 100%)',
        border: '1.5px solid rgba(80,80,80,0.5)',
        overflow: 'hidden',
      }}>
        {/* Top highlight */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: height * 0.03,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.12), transparent)',
          borderRadius: `${borderR}px ${borderR}px 0 0`,
        }} />
        {/* Side reflection */}
        <div style={{
          position: 'absolute', top: '15%', bottom: '15%', right: 0,
          width: 2,
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent)',
        }} />

        {/* Side buttons */}
        <div style={{
          position: 'absolute', right: -3, top: '20%',
          width: 4, height: height * 0.08,
          background: '#2a2a2a',
          borderRadius: '0 3px 3px 0',
          boxShadow: '1px 0 3px rgba(0,0,0,0.5)',
        }} />
        <div style={{
          position: 'absolute', left: -3, top: '16%',
          width: 4, height: height * 0.06,
          background: '#2a2a2a',
          borderRadius: '3px 0 0 3px',
        }} />
        <div style={{
          position: 'absolute', left: -3, top: '24%',
          width: 4, height: height * 0.1,
          background: '#2a2a2a',
          borderRadius: '3px 0 0 3px',
        }} />

        {/* Screen area */}
        <div style={{
          position: 'absolute',
          top: bezel, left: bezel,
          width: screenW, height: screenH,
          background: screenGlow > 0 ? '#050a10' : '#000',
          borderRadius: borderR * 0.75,
          overflow: 'hidden',
          transition: 'background 0.3s',
          boxShadow: screenGlow > 0
            ? `inset 0 0 ${width * 0.05}px rgba(37,211,102,${screenGlow * 0.15})`
            : 'none',
        }}>
          {/* Screen on glow */}
          {screenGlow > 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at 50% 30%, rgba(37,211,102,${screenGlow * 0.08}), transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 100,
            }} />
          )}

          {/* Dynamic Island / Notch */}
          <div style={{
            position: 'absolute',
            top: height * 0.012,
            left: '50%',
            transform: 'translateX(-50%)',
            width: notchW,
            height: notchH,
            background: '#000',
            borderRadius: notchH * 0.5,
            zIndex: 200,
          }} />

          {/* Screen content */}
          <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
          }}>
            {children}
          </div>
        </div>

        {/* Screen glass reflection */}
        <div style={{
          position: 'absolute',
          top: bezel, left: bezel,
          width: screenW * 0.5,
          height: screenH,
          background: 'linear-gradient(120deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
          borderRadius: `${borderR * 0.75}px 0 0 ${borderR * 0.75}px`,
          pointerEvents: 'none',
          zIndex: 150,
        }} />
      </div>
    </div>
  );
};
