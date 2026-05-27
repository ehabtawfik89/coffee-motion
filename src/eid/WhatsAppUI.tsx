import React from 'react';
import { interpolate } from 'remotion';
import { EidCard } from './EidCard';

/* ─────────────────────────────────────────────────────────────────
   WhatsApp UI states
   ───────────────────────────────────────────────────────────────── */

const WA_GREEN   = '#075E54';
const WA_LIGHT   = '#25D366';
const WA_BG      = '#ECE5DD';
const WA_HEADER  = '#128C7E';

// Contact data
const CONTACTS = [
  { name: 'Ahmed Hassan',    initial: 'A', color: '#25A18E', msg: 'Eid Mubarak! 🕌',             time: '10:23' },
  { name: 'Sara Mohamed',    initial: 'S', color: '#9B5DE5', msg: 'When is the family gathering?', time: '09:45' },
  { name: 'Omar Abdullah',   initial: 'O', color: '#F15BB5', msg: 'Did you get my message?',       time: '09:12' },
  { name: 'Fatima Ali',      initial: 'F', color: '#FEE440', msg: 'Happy Eid in advance! 🌙',      time: 'Yesterday' },
  { name: 'Khaled Ibrahim',  initial: 'K', color: '#00BBF9', msg: "We'll be there at 10",          time: 'Yesterday' },
  { name: 'Nour Youssef',    initial: 'N', color: '#00F5D4', msg: 'The kids are so excited!',      time: 'Yesterday' },
  { name: 'Tariq Mansour',   initial: 'T', color: '#FF6B6B', msg: 'Can you bring the sweets?',     time: 'Mon' },
  { name: 'Layla Hassan',    initial: 'L', color: '#FFD166', msg: 'Looking forward to seeing you!', time: 'Mon' },
  { name: 'Bilal Ahmad',     initial: 'B', color: '#06D6A0', msg: 'Salam! How is everyone?',       time: 'Sun' },
  { name: 'Zainab Karimi',   initial: 'Z', color: '#EF476F', msg: 'May Allah bless you all 🤲',    time: 'Sun' },
  { name: 'Rami Shaikh',     initial: 'R', color: '#118AB2', msg: 'Great memories last year!',     time: 'Sat' },
  { name: 'Dina Mustafa',    initial: 'D', color: '#FFB703', msg: 'Inshallah it will be amazing',  time: 'Sat' },
];

/* ─── Avatar circle ─── */
const Avatar: React.FC<{ initial: string; color: string; size: number }> = ({ initial, color, size }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    fontSize: size * 0.42,
    fontWeight: 700,
    color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  }}>
    {initial}
  </div>
);

/* ─── Single contact row ─── */
const ContactRow: React.FC<{
  contact: typeof CONTACTS[0];
  checked: boolean;
  checkProgress: number; // 0-1
  height: number;
  showCheck?: boolean;
}> = ({ contact, checked, checkProgress, height, showCheck }) => {
  const avSize = height * 0.68;
  const checkScale = interpolate(checkProgress, [0, 1], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      height,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 12,
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      background: checked ? 'rgba(37,211,102,0.08)' : 'transparent',
      transition: 'background 0.2s',
      flexShrink: 0,
    }}>
      {/* Avatar with check overlay */}
      <div style={{ position: 'relative' }}>
        <Avatar initial={contact.initial} color={contact.color} size={avSize} />
        {showCheck && checked && (
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: WA_LIGHT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${checkScale})`,
            opacity: checkProgress,
          }}>
            <svg width={avSize * 0.55} height={avSize * 0.55} viewBox="0 0 24 24">
              <polyline points="4,12 9,17 20,6" stroke="white" strokeWidth={2.5}
                fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{
          fontSize: height * 0.22,
          fontWeight: 600,
          color: '#1a1a1a',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{contact.name}</div>
        <div style={{
          fontSize: height * 0.18,
          color: '#666',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: 2,
        }}>{contact.msg}</div>
      </div>

      {/* Time */}
      <div style={{
        fontSize: height * 0.16,
        color: '#aaa',
        flexShrink: 0,
        alignSelf: 'flex-start',
        marginTop: height * 0.12,
      }}>{contact.time}</div>
    </div>
  );
};

/* ─── Status bar ─── */
const StatusBar: React.FC<{ width: number; time?: string; light?: boolean }> = ({ width, time = '10:30', light }) => (
  <div style={{
    width, height: 44,
    background: 'transparent',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px 0 20px',
    flexShrink: 0,
  }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: light ? '#fff' : '#000' }}>{time}</div>
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      <svg width={16} height={12} viewBox="0 0 16 12">
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={i * 4} y={12 - (i + 1) * 3} width={3} height={(i + 1) * 3}
            rx={1} fill={light ? '#fff' : '#000'} opacity={i < 3 ? 1 : 0.3} />
        ))}
      </svg>
      <svg width={18} height={12} viewBox="0 0 18 12">
        <path d="M9,2 Q15,2 17,6 Q15,10 9,10 Q3,10 1,6 Q3,2 9,2" stroke={light ? '#fff' : '#000'} strokeWidth={1.2} fill="none" />
        <path d="M9,4 Q13,4 15,6 Q13,8 9,8 Q5,8 3,6 Q5,4 9,4" fill={light ? '#fff' : '#000'} opacity={0.5} />
        <circle cx={9} cy={6} r={2} fill={light ? '#fff' : '#000'} />
      </svg>
      <div style={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <div style={{ width: 22, height: 11, border: `1.5px solid ${light ? '#fff' : '#000'}`, borderRadius: 2.5, position: 'relative', opacity: 0.8 }}>
          <div style={{ position: 'absolute', inset: 2, background: light ? '#fff' : '#000', borderRadius: 1, width: '70%' }} />
        </div>
      </div>
    </div>
  </div>
);

/* ─── WhatsApp Logo ─── */
const WhatsAppLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 50 50">
    <circle cx={25} cy={25} r={25} fill="#25D366" />
    <path
      d="M25 8.5C16.0 8.5 8.5 16.0 8.5 25c0 2.9.76 5.7 2.2 8.1L8 42l9.2-2.7c2.3 1.3 4.9 2 7.8 2C34.0 41.5 41.5 34.0 41.5 25S34.0 8.5 25 8.5zm0 2.8c7.5 0 13.7 6.2 13.7 13.7 0 7.5-6.2 13.7-13.7 13.7-2.5 0-4.8-.68-6.8-1.9l-.48-.28-5.5 1.6 1.6-5.4-.32-.5C13.2 29.8 12.3 27.4 12.3 25c0-7.5 6.2-13.7 13.7-13.7zm-5.8 7.5c-.28 0-.73.1-1.1.52-.38.42-1.5 1.5-1.5 3.6 0 2.1 1.5 4.2 1.75 4.5.25.3 3 4.7 7.4 6.5 1 .44 1.8.7 2.4.9.99.3 1.9.26 2.6.16.8-.12 2.5-1.0 2.8-2.0.3-.99.3-1.8.22-2.0-.08-.2-.3-.3-.62-.46-.32-.16-1.9-.93-2.2-1.0-.3-.1-.5-.15-.72.15-.22.3-.86 1.0-1.06 1.2-.2.22-.4.25-.74.08-.34-.17-1.4-.52-2.7-1.65-.99-.88-1.65-1.97-1.85-2.3-.2-.34-.02-.52.15-.68.15-.15.34-.4.5-.6.17-.2.22-.34.33-.56.1-.22.05-.42-.02-.58-.07-.16-.72-1.7-.98-2.35-.26-.63-.52-.54-.72-.55-.18 0-.4 0-.62 0z"
      fill="white"
    />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   SCENE A: WhatsApp Splash / Opening (0-1)
   ═══════════════════════════════════════════════════════════════ */
export const WhatsAppSplash: React.FC<{ progress: number; w: number; h: number }> = ({ progress, w, h }) => {
  const logoScale = interpolate(progress, [0, 0.5, 1], [0, 1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const logoOp    = interpolate(progress, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: w, height: h,
      background: '#075E54',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16,
    }}>
      <div style={{ transform: `scale(${logoScale})`, opacity: logoOp }}>
        <WhatsAppLogo size={80} />
      </div>
      <div style={{
        color: '#fff', fontSize: 22, fontWeight: 300, letterSpacing: 1,
        opacity: interpolate(progress, [0.4, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>WhatsApp</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SCENE B: Chat list — normal state
   ═══════════════════════════════════════════════════════════════ */
export const WhatsAppChatList: React.FC<{
  w: number; h: number;
  scrollY: number;
}> = ({ w, h, scrollY }) => {
  const rowH = h * 0.1;

  return (
    <div style={{ width: w, height: h, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <StatusBar width={w} light />

      {/* Header */}
      <div style={{
        background: WA_GREEN,
        padding: '8px 16px 10px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: 0.3 }}>WhatsApp</div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            {/* Camera */}
            <svg width={22} height={18} viewBox="0 0 24 20" fill="none">
              <path d="M23 17a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="rgba(255,255,255,0.85)" strokeWidth={1.8} />
              <circle cx={12} cy={12} r={3.5} stroke="rgba(255,255,255,0.85)" strokeWidth={1.8} />
            </svg>
            {/* Search */}
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <circle cx={11} cy={11} r={7} stroke="rgba(255,255,255,0.85)" strokeWidth={1.8} />
              <line x1={16.5} y1={16.5} x2={22} y2={22} stroke="rgba(255,255,255,0.85)" strokeWidth={1.8} strokeLinecap="round" />
            </svg>
            {/* More */}
            <svg width={4} height={18} viewBox="0 0 4 18">
              {[2, 9, 16].map(y => <circle key={y} cx={2} cy={y} r={2} fill="rgba(255,255,255,0.85)" />)}
            </svg>
          </div>
        </div>

        {/* Profile / EHAB */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#128C7E', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>E</div>
          <div>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>EHAB</div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>● Online</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: WA_GREEN,
        display: 'flex',
        borderBottom: '2px solid rgba(255,255,255,0.3)',
        flexShrink: 0,
      }}>
        {['Chats', 'Status', 'Calls'].map((tab, i) => (
          <div key={tab} style={{
            flex: 1, padding: '8px 0', textAlign: 'center',
            color: i === 0 ? '#fff' : 'rgba(255,255,255,0.55)',
            fontSize: 13, fontWeight: i === 0 ? 700 : 400,
            borderBottom: i === 0 ? '2px solid #fff' : '2px solid transparent',
            marginBottom: -2,
          }}>{tab}</div>
        ))}
      </div>

      {/* Search bar */}
      <div style={{
        background: '#F6F6F6', margin: '8px', borderRadius: 20,
        padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <circle cx={11} cy={11} r={7} stroke="#aaa" strokeWidth={2} />
          <line x1={16.5} y1={16.5} x2={22} y2={22} stroke="#aaa" strokeWidth={2} strokeLinecap="round" />
        </svg>
        <span style={{ color: '#bbb', fontSize: 13 }}>Search or start new chat</span>
      </div>

      {/* Contact rows with scroll */}
      <div style={{
        flex: 1, overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ transform: `translateY(-${scrollY}px)` }}>
          {CONTACTS.map((c, i) => (
            <ContactRow key={i} contact={c} checked={false} checkProgress={0} height={rowH} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SCENE C: Select-All mode
   ═══════════════════════════════════════════════════════════════ */
export const WhatsAppSelectAll: React.FC<{
  w: number; h: number;
  checkProgress: number;  // 0-1 drives the ripple
  selectedCount: number;
}> = ({ w, h, checkProgress, selectedCount }) => {
  const rowH = h * 0.1;
  const totalContacts = CONTACTS.length;

  return (
    <div style={{ width: w, height: h, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <StatusBar width={w} light />

      {/* Selection header */}
      <div style={{
        background: '#1282A0',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
            {selectedCount} selected
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['SELECT ALL', 'SEND'].map((label, i) => (
            <div key={label} style={{
              color: '#fff', fontSize: 13, fontWeight: 700,
              opacity: i === 0 ? 0.9 : 1,
              background: i === 1 ? WA_LIGHT : 'transparent',
              padding: i === 1 ? '5px 12px' : '5px 0',
              borderRadius: i === 1 ? 16 : 0,
            }}>{label}</div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {CONTACTS.map((c, i) => {
          const threshold = i / totalContacts;
          const rowProgress = interpolate(checkProgress, [threshold, threshold + 0.12], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return (
            <ContactRow
              key={i}
              contact={c}
              checked={rowProgress > 0.5}
              checkProgress={rowProgress}
              height={rowH}
              showCheck
            />
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SCENE D: Eid card preview (full screen on phone)
   ═══════════════════════════════════════════════════════════════ */
export const WhatsAppEidPreview: React.FC<{
  w: number; h: number;
  slideProgress: number; // 0 = bottom, 1 = final pos
  sendProgress: number;  // 0-1 for send button tap
}> = ({ w, h, slideProgress, sendProgress }) => {
  const cardScale = interpolate(slideProgress, [0, 1], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY = interpolate(slideProgress, [0, 1], [h * 0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sendScale  = interpolate(sendProgress, [0, 0.3, 0.6, 1], [1, 0.88, 0.88, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cardW = w * 0.88;
  const cardH = cardW * (450 / 320); // keep EidCard aspect ratio

  return (
    <div style={{
      width: w, height: h,
      background: '#111',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <StatusBar width={w} light />

      {/* Top bar */}
      <div style={{
        background: '#1c1c1c', padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        </svg>
        <div style={{ color: '#fff', fontSize: 14 }}>Ahmed & 246 others</div>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <circle cx={12} cy={12} r={2} fill="#fff" />
          <circle cx={19} cy={12} r={2} fill="#fff" />
          <circle cx={5} cy={12} r={2} fill="#fff" />
        </svg>
      </div>

      {/* Card preview area */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `translateY(${translateY}px)`,
        opacity: slideProgress,
      }}>
        <div style={{ transform: `scale(${cardScale})` }}>
          <EidCard scale={cardW / 320} />
        </div>
      </div>

      {/* Caption + send bar */}
      <div style={{
        background: '#1c1c1c',
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0,
        opacity: slideProgress,
      }}>
        <div style={{
          flex: 1, background: '#2a2a2a', borderRadius: 24,
          padding: '9px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 13,
        }}>
          عيد الأضحى مبارك 🕌
        </div>
        {/* Send button */}
        <div style={{
          width: 46, height: 46,
          borderRadius: '50%',
          background: WA_LIGHT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${sendScale})`,
          boxShadow: sendProgress > 0.1
            ? `0 0 ${20 * sendProgress}px rgba(37,211,102,${sendProgress * 0.8})`
            : 'none',
          flexShrink: 0,
        }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SCENE E: Confirmation screen
   ═══════════════════════════════════════════════════════════════ */
export const WhatsAppConfirm: React.FC<{
  w: number; h: number;
  progress: number; // 0-1
}> = ({ w, h, progress }) => {
  const textOp   = interpolate(progress, [0.3, 0.7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const checkSc  = interpolate(progress, [0.1, 0.5], [0, 1.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: w, height: h,
      background: 'linear-gradient(160deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20,
    }}>
      {/* Big check circle */}
      <div style={{
        width: w * 0.28, height: w * 0.28,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        border: '3px solid rgba(255,255,255,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${checkSc})`,
      }}>
        <svg width={w * 0.14} height={w * 0.14} viewBox="0 0 50 50">
          <polyline points="8,25 20,37 42,13" stroke="white" strokeWidth={4}
            fill="none" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={60}
            strokeDashoffset={60 * (1 - Math.min(progress * 2, 1))}
          />
        </svg>
      </div>

      <div style={{ textAlign: 'center', opacity: textOp }}>
        <div style={{ color: '#fff', fontSize: w * 0.055, fontWeight: 700, letterSpacing: 0.5 }}>
          Sent to all contacts
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.7)', fontSize: w * 0.038, marginTop: 8,
        }}>247 contacts received your greeting</div>
      </div>

      {/* Double tick */}
      <div style={{ opacity: textOp, display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width={28} height={20} viewBox="0 0 28 20">
          <polyline points="1,10 7,16 16,4" stroke="rgba(255,255,255,0.8)" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="8,10 14,16 24,4" stroke="rgba(255,255,255,0.8)" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: w * 0.032 }}>Delivered</div>
      </div>
    </div>
  );
};
