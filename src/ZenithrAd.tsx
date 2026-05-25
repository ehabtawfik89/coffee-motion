import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { Scene1Brand }     from './scenes/Scene1Brand';
import { Scene2Dashboard } from './scenes/Scene2Dashboard';
import { Scene3KPIs }      from './scenes/Scene3KPIs';
import { Scene4Charts }    from './scenes/Scene4Charts';
import { Scene5Profiles }  from './scenes/Scene5Profiles';
import { Scene6OrgChart }  from './scenes/Scene6OrgChart';
import { Scene7Analytics } from './scenes/Scene7Analytics';
import { Scene8Outro }     from './scenes/Scene8Outro';
import { T } from './theme';

/**
 * Zenithr Employee Experience — 45-second SaaS explainer
 * 1350 frames @ 30fps = 45 seconds · 1920 × 1080
 *
 * Scene map:
 *   Scene 1  Brand intro           0   – 119  (4s)
 *   Scene 2  Dashboard overview    120 – 389  (9s)
 *   Scene 3  KPI spotlight         390 – 569  (6s)
 *   Scene 4  Charts & analytics    570 – 749  (6s)
 *   Scene 5  People & profiles     750 – 929  (6s)
 *   Scene 6  Org chart             930 – 1109 (6s)
 *   Scene 7  Pulse & analytics     1110 – 1259 (5s)
 *   Scene 8  Outro / CTA           1260 – 1349 (3s)
 *
 * All transitions: 15-frame crossfade (opacity handled per scene at edges).
 */

// Crossfade overlay between scenes
const CrossFade: React.FC<{ durationIn?: number }> = ({ durationIn = 15 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, durationIn], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ background: T.bg, opacity, pointerEvents: 'none', zIndex: 100 }} />
  );
};

export const ZenithrAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: T.bg }}>

      {/* ── Scene 1: Brand intro ─────────────────────────────── 0-119 */}
      <Sequence from={0} durationInFrames={120}>
        <Scene1Brand />
      </Sequence>

      {/* ── Scene 2: Dashboard overview ─────────────────────── 120-389 */}
      <Sequence from={120} durationInFrames={270}>
        <Scene2Dashboard />
        <CrossFade durationIn={15} />
      </Sequence>

      {/* ── Scene 3: KPI spotlight ──────────────────────────── 390-569 */}
      <Sequence from={390} durationInFrames={180}>
        <Scene3KPIs />
        <CrossFade durationIn={15} />
      </Sequence>

      {/* ── Scene 4: Charts & analytics ─────────────────────── 570-749 */}
      <Sequence from={570} durationInFrames={180}>
        <Scene4Charts />
        <CrossFade durationIn={15} />
      </Sequence>

      {/* ── Scene 5: People & profiles ──────────────────────── 750-929 */}
      <Sequence from={750} durationInFrames={180}>
        <Scene5Profiles />
        <CrossFade durationIn={15} />
      </Sequence>

      {/* ── Scene 6: Org chart ──────────────────────────────── 930-1109 */}
      <Sequence from={930} durationInFrames={180}>
        <Scene6OrgChart />
        <CrossFade durationIn={15} />
      </Sequence>

      {/* ── Scene 7: Pulse & analytics ──────────────────────── 1110-1259 */}
      <Sequence from={1110} durationInFrames={150}>
        <Scene7Analytics />
        <CrossFade durationIn={15} />
      </Sequence>

      {/* ── Scene 8: Outro ──────────────────────────────────── 1260-1349 */}
      <Sequence from={1260} durationInFrames={90}>
        <Scene8Outro />
      </Sequence>

    </AbsoluteFill>
  );
};
