import React from 'react';

/* ─────────────────────────────────────────────────────────────────
   Eid Al-Adha greeting card – CSS/SVG recreation of the blue design
   ───────────────────────────────────────────────────────────────── */

const MosqueSVG: React.FC<{ s: number }> = ({ s }) => (
  <svg
    width={300 * s}
    height={140 * s}
    style={{ position: 'absolute', bottom: 60 * s, left: '50%', transform: 'translateX(-50%)' }}
  >
    {/* Base */}
    <rect x={10 * s} y={110 * s} width={280 * s} height={20 * s} rx={2 * s} fill="rgba(10,40,120,0.7)" />
    {/* Main building */}
    <rect x={50 * s} y={75 * s} width={200 * s} height={40 * s} fill="rgba(10,40,120,0.6)" />
    {/* Left wing */}
    <rect x={20 * s} y={85 * s} width={40 * s} height={30 * s} fill="rgba(10,40,120,0.5)" />
    {/* Right wing */}
    <rect x={240 * s} y={85 * s} width={40 * s} height={30 * s} fill="rgba(10,40,120,0.5)" />
    {/* Main dome */}
    <path d={`M ${75 * s},${75 * s} Q ${75 * s},${35 * s} ${150 * s},${30 * s} Q ${225 * s},${35 * s} ${225 * s},${75 * s} Z`}
      fill="rgba(12,50,140,0.65)" />
    {/* Left small dome */}
    <path d={`M ${20 * s},${85 * s} Q ${20 * s},${65 * s} ${40 * s},${62 * s} Q ${60 * s},${65 * s} ${60 * s},${85 * s} Z`}
      fill="rgba(12,50,140,0.55)" />
    {/* Right small dome */}
    <path d={`M ${240 * s},${85 * s} Q ${240 * s},${65 * s} ${260 * s},${62 * s} Q ${280 * s},${65 * s} ${280 * s},${85 * s} Z`}
      fill="rgba(12,50,140,0.55)" />
    {/* Left minaret */}
    <rect x={28 * s} y={30 * s} width={14 * s} height={60 * s} rx={2 * s} fill="rgba(10,38,115,0.6)" />
    <polygon points={`${28 * s},${30 * s} ${42 * s},${30 * s} ${35 * s},${15 * s}`} fill="rgba(10,38,115,0.6)" />
    {/* Right minaret */}
    <rect x={258 * s} y={30 * s} width={14 * s} height={60 * s} rx={2 * s} fill="rgba(10,38,115,0.6)" />
    <polygon points={`${258 * s},${30 * s} ${272 * s},${30 * s} ${265 * s},${15 * s}`} fill="rgba(10,38,115,0.6)" />
    {/* Crescent on main dome */}
    <text x={144 * s} y={52 * s} fontSize={16 * s} fill="rgba(200,180,80,0.7)" textAnchor="middle">☽</text>
  </svg>
);

const SheepSVG: React.FC<{ s: number }> = ({ s }) => (
  <svg
    width={130 * s}
    height={110 * s}
    style={{ position: 'absolute', bottom: 55 * s, right: 18 * s }}
    viewBox="0 0 130 110"
  >
    {/* Wool body bumps */}
    {[
      [20, 55, 16], [35, 44, 17], [52, 38, 17], [70, 35, 17],
      [88, 38, 16], [103, 46, 14], [115, 58, 12],
    ].map(([cx, cy, r], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.85} fill="#F2EDE4" />
    ))}
    {/* Body fill */}
    <ellipse cx={68} cy={62} rx={50} ry={24} fill="#EDE8DF" />
    {/* Head */}
    <ellipse cx={110} cy={56} rx={22} ry={20} fill="#EDE8DF" />
    {/* Face detail */}
    <ellipse cx={114} cy={60} rx={12} ry={10} fill="#D6D0C4" />
    {/* Eye */}
    <circle cx={118} cy={55} r={4} fill="#2a1a0a" />
    <circle cx={119} cy={54} r={1.5} fill="white" />
    {/* Nostril */}
    <ellipse cx={122} cy={62} rx={2} ry={1.5} fill="#b0a090" />
    {/* Left horn */}
    <path d="M 102 46 Q 92 32 100 26 Q 110 24 108 38" stroke="#8B7355" strokeWidth={3} fill="none" strokeLinecap="round" />
    {/* Right horn */}
    <path d="M 112 44 Q 124 32 132 37 Q 136 46 122 50" stroke="#8B7355" strokeWidth={3} fill="none" strokeLinecap="round" />
    {/* Ear */}
    <ellipse cx={92} cy={58} rx={8} ry={5} fill="#c8c0b0" transform="rotate(-20 92 58)" />
    {/* Legs */}
    {[28, 46, 68, 86].map((x, i) => (
      <rect key={i} x={x} y={82} width={10} height={24} rx={4} fill="#C8C0B0" />
    ))}
    {/* Hooves */}
    {[28, 46, 68, 86].map((x, i) => (
      <rect key={i} x={x + 1} y={102} width={8} height={6} rx={2} fill="#5a4a3a" />
    ))}
    {/* Tail */}
    <ellipse cx={16} cy={62} rx={9} ry={11} fill="#E8E4DC" />
  </svg>
);

const LeftLeaves: React.FC<{ s: number }> = ({ s }) => (
  <svg width={70 * s} height={160 * s} style={{ position: 'absolute', bottom: 55 * s, left: 5 * s }}>
    <g opacity="0.85">
      {/* Stems */}
      <path d={`M ${35 * s},${150 * s} Q ${20 * s},${100 * s} ${15 * s},${60 * s}`} stroke="#C8A740" strokeWidth={1.5 * s} fill="none" />
      <path d={`M ${35 * s},${150 * s} Q ${45 * s},${100 * s} ${50 * s},${70 * s}`} stroke="#4a6e8a" strokeWidth={1.2 * s} fill="none" />
      {/* Gold leaves */}
      {[
        [15, 60, -30], [22, 90, -20], [12, 110, -35],
      ].map(([x, y, rot], i) => (
        <ellipse key={i} cx={x * s} cy={y * s} rx={10 * s} ry={5 * s}
          transform={`rotate(${rot}, ${x * s}, ${y * s})`}
          fill="#C8A740" opacity={0.9} />
      ))}
      {/* Blue leaves */}
      {[
        [50, 70, 20], [42, 95, 15], [55, 115, 25],
      ].map(([x, y, rot], i) => (
        <ellipse key={i} cx={x * s} cy={y * s} rx={10 * s} ry={5 * s}
          transform={`rotate(${rot}, ${x * s}, ${y * s})`}
          fill="#1a5280" opacity={0.85} />
      ))}
    </g>
  </svg>
);

const RightLeaves: React.FC<{ s: number }> = ({ s }) => (
  <svg width={60 * s} height={100 * s} style={{ position: 'absolute', bottom: 160 * s, right: 8 * s }}>
    <g opacity="0.8">
      <path d={`M ${30 * s},${90 * s} Q ${15 * s},${60 * s} ${10 * s},${30 * s}`} stroke="#C8A740" strokeWidth={1.2 * s} fill="none" />
      <path d={`M ${30 * s},${90 * s} Q ${45 * s},${60 * s} ${50 * s},${35 * s}`} stroke="#1a5280" strokeWidth={1.2 * s} fill="none" />
      {[
        [10, 30, 25], [18, 55, 15],
      ].map(([x, y, rot], i) => (
        <ellipse key={i} cx={x * s} cy={y * s} rx={9 * s} ry={4.5 * s}
          transform={`rotate(${rot}, ${x * s}, ${y * s})`}
          fill="#C8A740" opacity={0.9} />
      ))}
      {[
        [50, 35, -20], [42, 58, -15],
      ].map(([x, y, rot], i) => (
        <ellipse key={i} cx={x * s} cy={y * s} rx={9 * s} ry={4.5 * s}
          transform={`rotate(${rot}, ${x * s}, ${y * s})`}
          fill="#1a5280" opacity={0.85} />
      ))}
    </g>
  </svg>
);

export const EidCard: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const S = scale;
  const W = 320 * S;
  const H = 450 * S;

  return (
    <div style={{
      width: W,
      height: H,
      background: 'linear-gradient(175deg, #0d3285 0%, #0a2570 35%, #081d60 65%, #06144a 100%)',
      borderRadius: 6 * S,
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Noto Naskh Arabic','Arabic Typesetting','Amiri',serif",
    }}>

      {/* Gold outer border */}
      <div style={{
        position: 'absolute', inset: 6 * S,
        border: `${1.5 * S}px solid rgba(212,175,55,0.6)`,
        borderRadius: 4 * S,
        pointerEvents: 'none',
        zIndex: 20,
      }} />

      {/* Top corner Islamic star patterns */}
      <svg width={65 * S} height={65 * S} style={{ position: 'absolute', top: 0, left: 0, opacity: 0.65 }}>
        <g stroke="#D4AF37" strokeWidth={0.8 * S} fill="none">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            const a2 = ((i * 45 + 22.5) * Math.PI) / 180;
            return (
              <line key={i}
                x1={0} y1={0}
                x2={Math.cos(a) * 60 * S} y2={Math.sin(a) * 60 * S}
              />
            );
          })}
          {[0.3, 0.55, 0.8].map((r, i) => (
            <circle key={i} cx={0} cy={0} r={r * 60 * S} opacity={0.5} />
          ))}
        </g>
      </svg>
      <svg width={65 * S} height={65 * S} style={{ position: 'absolute', top: 0, right: 0, opacity: 0.65, transform: 'scaleX(-1)' }}>
        <g stroke="#D4AF37" strokeWidth={0.8 * S} fill="none">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 60 * S} y2={Math.sin(a) * 60 * S} />;
          })}
          {[0.3, 0.55, 0.8].map((r, i) => (
            <circle key={i} cx={0} cy={0} r={r * 60 * S} opacity={0.5} />
          ))}
        </g>
      </svg>

      {/* Islamic arch SVG */}
      <svg width={W} height={H} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 5 }}>
        <defs>
          <linearGradient id={`gold${S}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="40%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>
        {/* Pointed arch */}
        <path
          d={`M ${42 * S},${340 * S} L ${42 * S},${155 * S} Q ${42 * S},${52 * S} ${160 * S},${38 * S} Q ${278 * S},${52 * S} ${278 * S},${155 * S} L ${278 * S},${340 * S}`}
          fill="none"
          stroke={`url(#gold${S})`}
          strokeWidth={2.5 * S}
        />
        {/* Arch keystone ornament */}
        <circle cx={160 * S} cy={36 * S} r={6 * S} fill="#D4AF37" />
        <circle cx={160 * S} cy={36 * S} r={3.5 * S} fill="#FFD700" />
        {/* Bottom arch base ornaments */}
        <circle cx={42 * S} cy={340 * S} r={5 * S} fill="#D4AF37" opacity={0.8} />
        <circle cx={278 * S} cy={340 * S} r={5 * S} fill="#D4AF37" opacity={0.8} />
      </svg>

      {/* Small stars */}
      {[
        { x: 25, y: 180 }, { x: 295, y: 195 }, { x: 18, y: 240 },
        { x: 302, y: 155 }, { x: 155, y: 12 }, { x: 168, y: 20 },
        { x: 30, y: 310 }, { x: 290, y: 275 },
      ].map((st, i) => (
        <div key={i} style={{
          position: 'absolute', left: st.x * S, top: st.y * S,
          width: 3 * S, height: 3 * S, borderRadius: '50%',
          background: '#D4AF37', opacity: 0.7, zIndex: 6,
        }} />
      ))}

      {/* Crescent moon - left */}
      <svg width={62 * S} height={68 * S} style={{ position: 'absolute', left: 10 * S, top: 148 * S, zIndex: 8 }}>
        <defs>
          <linearGradient id={`moon${S}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#C8A020" />
          </linearGradient>
        </defs>
        <circle cx={34 * S} cy={36 * S} r={26 * S} fill={`url(#moon${S})`} />
        <circle cx={46 * S} cy={30 * S} r={22 * S} fill="#0a2570" />
        {/* Star */}
        <polygon
          points={`${17 * S},${7 * S} ${20 * S},${13 * S} ${26 * S},${13 * S} ${21 * S},${17 * S} ${23 * S},${23 * S} ${17 * S},${19 * S} ${11 * S},${23 * S} ${13 * S},${17 * S} ${8 * S},${13 * S} ${14 * S},${13 * S}`}
          fill="#D4AF37"
        />
      </svg>

      {/* ─── Arabic text block ─── */}
      <div style={{
        position: 'absolute',
        top: 48 * S,
        left: 0, right: 0,
        textAlign: 'center',
        direction: 'rtl',
        zIndex: 15,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* عيد الأضحى */}
        <div style={{
          fontSize: 50 * S,
          fontWeight: 700,
          color: '#fff',
          textShadow: `0 2px ${8 * S}px rgba(0,0,0,0.7), 0 0 ${25 * S}px rgba(212,175,55,0.25)`,
          lineHeight: 1.25,
        }}>عيد الأضحى</div>

        {/* مبارك */}
        <div style={{
          fontSize: 32 * S, fontWeight: 700,
          color: '#D4AF37',
          textShadow: `0 0 ${14 * S}px rgba(212,175,55,0.7)`,
          marginTop: 2 * S,
          letterSpacing: 2 * S,
        }}>✦ مبارك ✦</div>

        {/* Divider */}
        <div style={{
          width: 200 * S, height: 1,
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          margin: `${8 * S}px 0`,
          opacity: 0.8,
        }} />

        {/* Blessing text */}
        <div style={{
          fontSize: 12.5 * S,
          color: 'rgba(230,230,240,0.92)',
          lineHeight: 1.9,
          padding: `0 ${40 * S}px`,
        }}>
          تقبل الله منا ومنكم صالح الأعمال
          <br />
          وأعاده الله علينا وعليكم باليمن والبركات
        </div>

        {/* Bottom ornament */}
        <div style={{ marginTop: 6 * S, color: '#D4AF37', fontSize: 16 * S, opacity: 0.9 }}>❧ ❦ ❧</div>
      </div>

      {/* Mosque */}
      <MosqueSVG s={S} />

      {/* Sheep */}
      <SheepSVG s={S} />

      {/* Botanical */}
      <LeftLeaves s={S} />
      <RightLeaves s={S} />
    </div>
  );
};
