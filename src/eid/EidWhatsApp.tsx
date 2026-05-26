import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

import { PhoneFrame }          from './PhoneFrame';
import {
  WhatsAppSplash,
  WhatsAppChatList,
  WhatsAppSelectAll,
  WhatsAppEidPreview,
  WhatsAppConfirm,
}                              from './WhatsAppUI';
import { SendingEffect, AmbientGlow } from './SendEffect';

/* ──────────────────────────────────────────────────────────────────
   Timing map  (30 fps, 450 frames = 15 s)
   ────────────────────────────────────────────────────────────────── */
const T = {
  // Phone intro
  phoneFadeIn:   [0,  25],
  phoneRise:     [8,  50],

  // Screen wakes
  screenOn:      [45, 70],

  // WA splash
  waSplash:      [60, 110],

  // Chat list slides in
  chatSlide:     [100, 135],

  // Contacts scroll
  scrollStart:   130,
  scrollEnd:     175,

  // Long-press / select-all menu
  menuPop:       [170, 190],
  checkRipple:   [185, 255],   // checkmarks ripple across contacts

  // Eid card preview
  cardSlide:     [250, 290],

  // Send tap
  sendTap:       [300, 325],
  sendRipple:    [320, 385],   // bubbles fly

  // Confirmation
  confirmIn:     [380, 420],
  sparkles:      [400, 450],
};

/* ──────────────────────────────────────────────────────────────────
   Helper – spring interpolate shorthand
   ────────────────────────────────────────────────────────────────── */
const sp = (frame: number, fps: number, from: number, to: number,
  config = { damping: 80, stiffness: 280, mass: 1 }) =>
  spring({ frame, fps, from, to, config });

/* ──────────────────────────────────────────────────────────────────
   Background particles (deterministic)
   ────────────────────────────────────────────────────────────────── */
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const BG_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x: rand(i * 3 + 1),
  y: rand(i * 7 + 2),
  r: 1.5 + rand(i * 5) * 3,
  speed: 0.0004 + rand(i * 11) * 0.0008,
  phase: rand(i * 13) * Math.PI * 2,
}));

const BackgroundScene: React.FC<{ frame: number; w: number; h: number }> = ({ frame, w, h }) => (
  <>
    {/* Gradient backdrop */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 80% 70% at 50% 50%, #0f1f3a 0%, #060c18 60%, #020508 100%)',
    }} />

    {/* Subtle grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
    }} />

    {/* Floating dust particles */}
    {BG_PARTICLES.map((p, i) => {
      const ox = Math.sin(frame * p.speed + p.phase) * 30;
      const oy = Math.cos(frame * p.speed * 0.7 + p.phase) * 20;
      return (
        <div key={i} style={{
          position: 'absolute',
          left: p.x * w + ox,
          top: p.y * h + oy,
          width: p.r * 2,
          height: p.r * 2,
          borderRadius: '50%',
          background: 'rgba(37,211,102,0.35)',
          opacity: 0.4 + Math.sin(frame * 0.03 + p.phase) * 0.2,
          filter: 'blur(0.5px)',
        }} />
      );
    })}

    {/* Corner gold accents */}
    <svg width={180} height={180} style={{ position: 'absolute', top: 0, left: 0, opacity: 0.12 }}>
      <g stroke="#D4AF37" strokeWidth={0.8} fill="none">
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i * 60 * Math.PI) / 180;
          return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 180} y2={Math.sin(a) * 180} />;
        })}
        {[60, 100, 150].map(r => <circle key={r} cx={0} cy={0} r={r} opacity={0.5} />)}
      </g>
    </svg>
    <svg width={180} height={180} style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.12, transform: 'rotate(180deg)' }}>
      <g stroke="#D4AF37" strokeWidth={0.8} fill="none">
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i * 60 * Math.PI) / 180;
          return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 180} y2={Math.sin(a) * 180} />;
        })}
        {[60, 100, 150].map(r => <circle key={r} cx={0} cy={0} r={r} opacity={0.5} />)}
      </g>
    </svg>
  </>
);

/* ──────────────────────────────────────────────────────────────────
   Tap gesture indicator
   ────────────────────────────────────────────────────────────────── */
const TapIndicator: React.FC<{ x: number; y: number; frame: number; triggerAt: number }> = ({ x, y, frame, triggerAt }) => {
  const f = frame - triggerAt;
  if (f < 0 || f > 30) return null;
  const scale   = interpolate(f, [0, 8, 22, 30], [0, 1.1, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(f, [0, 5, 22, 30], [0, 0.9, 0.7, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute',
      left: x - 22, top: y - 22,
      width: 44, height: 44,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.25)',
      border: '2px solid rgba(255,255,255,0.6)',
      transform: `scale(${scale})`,
      opacity,
      pointerEvents: 'none',
      zIndex: 999,
    }} />
  );
};

/* ──────────────────────────────────────────────────────────────────
   Main composition
   ────────────────────────────────────────────────────────────────── */
export const EidWhatsApp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  /* Phone dimensions */
  const phoneW = width * 0.56;
  const phoneH = phoneW * 2.16;       // ~iPhone 14 aspect ratio
  const phoneCX = width / 2;
  const phoneCY = height / 2;

  /* ── Scene transitions ── */

  // Phone entrance
  const bgOpacity   = interpolate(frame, T.phoneFadeIn as [number,number], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const phoneY      = sp(frame - T.phoneRise[0], fps, phoneH * 0.18, 0, { damping: 70, stiffness: 240, mass: 1 });
  const phoneOpac   = interpolate(frame, T.phoneFadeIn as [number,number], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const phoneRotX   = interpolate(frame, [T.phoneRise[0], T.phoneRise[0] + 40, T.phoneRise[0] + 80], [6, 2, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Screen glow
  const screenGlow  = interpolate(frame, T.screenOn as [number,number], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Chat list slide
  const chatSlide   = sp(Math.max(0, frame - T.chatSlide[0]), fps, 1, 0, { damping: 85, stiffness: 320, mass: 0.9 });

  // Scroll
  const scrollY     = interpolate(frame, [T.scrollStart, T.scrollEnd], [0, 85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });

  // Select all check progress
  const checkP      = interpolate(frame, T.checkRipple as [number,number], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const selectedCount = Math.round(interpolate(frame, T.checkRipple as [number,number], [0, 247], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  // Card preview
  const cardSlideP  = interpolate(frame, T.cardSlide as [number,number], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  // Send tap
  const sendTapP    = interpolate(frame, T.sendTap as [number,number], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Sending ripple
  const rippleF     = Math.max(0, frame - T.sendRipple[0]);

  // Confirmation
  const confirmP    = interpolate(frame, T.confirmIn as [number,number], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const sparkleF    = Math.max(0, frame - T.sparkles[0]);

  /* ── Which screen to show ── */
  const showSplash   = frame < T.chatSlide[0];
  const showChatList = frame >= T.chatSlide[0] && frame < T.menuPop[0];
  const showSelect   = frame >= T.menuPop[0]   && frame < T.cardSlide[0];
  const showCard     = frame >= T.cardSlide[0]  && frame < T.confirmIn[0];
  const showConfirm  = frame >= T.confirmIn[0];

  /* ── Ambient glow behind phone ── */
  const glowIntensity = interpolate(frame,
    [T.screenOn[0], T.sendRipple[1]],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, opacity: bgOpacity }}>
        <BackgroundScene frame={frame} w={width} h={height} />
      </div>

      {/* Ambient glow behind phone */}
      <AmbientGlow cx={phoneCX} cy={phoneCY} intensity={glowIntensity} color="#25D366" />

      {/* Phone container */}
      <div style={{
        position: 'absolute',
        left: phoneCX - phoneW / 2,
        top: phoneCY - phoneH / 2 + (typeof phoneY === 'number' ? phoneY : 0),
        opacity: phoneOpac,
        transform: `perspective(1800px) rotateX(${phoneRotX}deg)`,
        transformOrigin: 'center center',
        zIndex: 20,
      }}>
        <PhoneFrame width={phoneW} height={phoneH} screenGlow={screenGlow}>

          {/* SPLASH */}
          {showSplash && (
            <div style={{
              position: 'absolute', inset: 0,
              transform: `translateX(${chatSlide * phoneW}px)`,
              opacity: frame > T.screenOn[0] ? 1 : 0,
            }}>
              <WhatsAppSplash
                progress={interpolate(frame, T.waSplash as [number,number], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                w={phoneW}
                h={phoneH}
              />
            </div>
          )}

          {/* CHAT LIST */}
          {showChatList && (
            <div style={{
              position: 'absolute', inset: 0,
              transform: `translateX(${(1 - sp(Math.max(0, frame - T.chatSlide[0]), fps, 0, 1)) * phoneW}px)`,
            }}>
              <WhatsAppChatList w={phoneW} h={phoneH} scrollY={scrollY} />
            </div>
          )}

          {/* SELECT ALL */}
          {showSelect && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <WhatsAppSelectAll
                w={phoneW} h={phoneH}
                checkProgress={checkP}
                selectedCount={selectedCount}
              />
            </div>
          )}

          {/* EID CARD PREVIEW */}
          {showCard && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <WhatsAppEidPreview
                w={phoneW} h={phoneH}
                slideProgress={cardSlideP}
                sendProgress={sendTapP}
              />
            </div>
          )}

          {/* CONFIRMATION */}
          {showConfirm && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <WhatsAppConfirm w={phoneW} h={phoneH} progress={confirmP} />
            </div>
          )}

        </PhoneFrame>
      </div>

      {/* ── Tap gesture dot (on phone screen) ── */}
      {/* Menu tap */}
      <TapIndicator
        x={phoneCX + phoneW * 0.15}
        y={phoneCY - phoneH * 0.28}
        frame={frame}
        triggerAt={T.menuPop[0]}
      />
      {/* Send tap */}
      <TapIndicator
        x={phoneCX + phoneW * 0.38}
        y={phoneCY + phoneH * 0.42}
        frame={frame}
        triggerAt={T.sendTap[0] + 8}
      />

      {/* ── Sending ripple effect (outside phone) ── */}
      {frame >= T.sendRipple[0] && frame < T.sparkles[0] && (
        <SendingEffect
          cx={phoneCX}
          cy={phoneCY}
          frame={rippleF}
          totalFrames={T.sendRipple[1] - T.sendRipple[0]}
          mode="bubbles"
        />
      )}

      {/* ── Sparkles on confirmation ── */}
      {frame >= T.sparkles[0] && (
        <SendingEffect
          cx={phoneCX}
          cy={phoneCY - phoneH * 0.1}
          frame={sparkleF}
          totalFrames={50}
          mode="sparkles"
        />
      )}

      {/* ── "Sent to all contacts" text above phone (frame 400+) ── */}
      {frame >= T.sparkles[0] && (
        <div style={{
          position: 'absolute',
          bottom: phoneCY - phoneH / 2 - 60,
          left: 0, right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [T.sparkles[0], T.sparkles[0] + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          zIndex: 30,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(37,211,102,0.18)',
            border: '1px solid rgba(37,211,102,0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: 40,
            padding: '10px 28px',
          }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <circle cx={12} cy={12} r={11} fill="#25D366" />
              <polyline points="6,12 10,16 18,8" stroke="white" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              color: '#fff', fontSize: 18, fontWeight: 600, letterSpacing: 0.3,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}>
              Sent to all contacts
            </span>
          </div>
        </div>
      )}

      {/* ── Vignette ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.45) 100%)',
        zIndex: 5,
      }} />
    </AbsoluteFill>
  );
};
