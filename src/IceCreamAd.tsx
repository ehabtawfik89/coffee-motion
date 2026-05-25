import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1Intro } from './Scene1Intro';
import { Scene2Flavors } from './Scene2Flavors';
import { Scene3Hero } from './Scene3Hero';
import { Scene4CTA } from './Scene4CTA';
import { CircleBurstTransition, WipeTransition } from './Transition';
import { COLORS } from './colors';

/**
 * IceCreamAd — Full 9s ad at 30fps = 270 frames
 *
 * Scene breakdown:
 *   0–74    Scene 1: Brand intro / logo reveal         (2.5s)
 *   60–74   Transition 1: circle burst (15 frames)
 *   75–149  Scene 2: Flavour showcase                  (2.5s)
 *  135–149  Transition 2: wipe (15 frames)
 *  150–224  Scene 3: Hero product shot + price badge   (2.5s)
 *  210–224  Transition 3: circle burst (15 frames)
 *  225–270  Scene 4: CTA + order now                  (1.5s)
 */
export const IceCreamAd: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* ── Scene 1 ── */}
      <Sequence from={0} durationInFrames={75}>
        <Scene1Intro />
      </Sequence>

      {/* ── Transition 1 (scene 1 → 2) ── */}
      <Sequence from={60} durationInFrames={20}>
        <CircleBurstTransition color={COLORS.mint} durationFrames={20} />
      </Sequence>

      {/* ── Scene 2 ── */}
      <Sequence from={75} durationInFrames={75}>
        <Scene2Flavors />
      </Sequence>

      {/* ── Transition 2 (scene 2 → 3) ── */}
      <Sequence from={135} durationInFrames={20}>
        <WipeTransition color={COLORS.strawberry} durationFrames={20} />
      </Sequence>

      {/* ── Scene 3 ── */}
      <Sequence from={150} durationInFrames={75}>
        <Scene3Hero />
      </Sequence>

      {/* ── Transition 3 (scene 3 → 4) ── */}
      <Sequence from={210} durationInFrames={20}>
        <CircleBurstTransition color={COLORS.textDark} durationFrames={20} />
      </Sequence>

      {/* ── Scene 4 ── */}
      <Sequence from={225} durationInFrames={45}>
        <Scene4CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
