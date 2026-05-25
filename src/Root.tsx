import React from 'react';
import { Composition } from 'remotion';
import { IceCreamAd } from './IceCreamAd';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IceCreamAd"
        component={IceCreamAd}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
