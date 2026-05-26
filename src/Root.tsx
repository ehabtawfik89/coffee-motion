import React from 'react';
import { Composition } from 'remotion';
import { ZenithrAd }      from './ZenithrAd';
import { PremiumBlueBg }  from './PremiumBlueBg';

export const RemotionRoot: React.FC = () => (
  <>
    {/* ── Existing composition ─────────────────────────────────────────── */}
    <Composition
      id="ZenithrAd"
      component={ZenithrAd}
      durationInFrames={1350}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />

    {/* ── Premium blue motion background ──────────────────────────────── */}
    {/*   Deep-space planetary orb · 16:9 · 10 s · film grain overlay     */}
    <Composition
      id="PremiumBlueBg"
      component={PremiumBlueBg}
      durationInFrames={300}   /* 10 s × 30 fps */
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  </>
);
