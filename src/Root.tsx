import React from 'react';
import { Composition } from 'remotion';
import { ZenithrAd } from './ZenithrAd';
import { LossDayCounter } from './scenes/LossDayCounter';
import { MeatGain } from './scenes/MeatGain';
import { MilkYield } from './scenes/MilkYield';
import { MethaneReduced } from './scenes/MethaneReduced';

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
    <Composition
      id="LossDayCounter"
      component={LossDayCounter}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
    <Composition
      id="MeatGain"
      component={MeatGain}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
    <Composition
      id="MilkYield"
      component={MilkYield}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
    <Composition
      id="MethaneReduced"
      component={MethaneReduced}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  </>
);
