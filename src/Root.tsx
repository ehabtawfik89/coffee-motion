import React from 'react';
import { Composition } from 'remotion';
import { ZenithrAd } from './ZenithrAd';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ZenithrAd"
      component={ZenithrAd}
      durationInFrames={1350}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  </>
);
