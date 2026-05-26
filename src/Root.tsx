import React from 'react';
import { Composition } from 'remotion';
import { ZenithrAd } from './ZenithrAd';
import { BlueMotionBackground } from './BlueMotionBackground';
import { CrescentMotionBackground } from './CrescentMotionBackground';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Original composition */}
    <Composition
      id="ZenithrAd"
      component={ZenithrAd}
      durationInFrames={1350}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />

    {/* Premium blue motion background — 16:9, 10 seconds */}
    <Composition
      id="BlueMotionBackground"
      component={BlueMotionBackground}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />

    {/* Premium crescent/sphere motion background — 16:9, 10 seconds, 3× pace */}
    <Composition
      id="CrescentMotionBackground"
      component={CrescentMotionBackground}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  </>
);
