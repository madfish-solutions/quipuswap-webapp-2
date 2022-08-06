import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import Lottie from 'react-lottie';

import { PageTitle, TestnetAlert, StateWrapper, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { useCoinflipPageViewModel } from './coinflip-page.vm';
import {
  CoinflipDetails,
  CoinflipGame,
  CoinflipTokenSelector,
  CoinflipRewardInfo,
  CoinflipRules,
  CoinflipResultModal
} from './components';
import animationData6 from './data6.json';
import animationData7 from './data7.json';
import animationData8 from './data8.json';

const animation6 = {
  animationData: animationData6,
  realWidth: 1920,
  realHeight: 756,
  width: 300,
  getHeight: () => Math.round((animation6.width * animation6.realHeight) / animation6.realWidth)
};

const animation7 = {
  animationData: animationData7,
  realWidth: 1056,
  realHeight: 600,
  width: 300,
  getHeight: () => Math.round((animation7.width * animation7.realHeight) / animation7.realWidth)
};

const animation8 = {
  animationData: animationData8,
  realWidth: 1056,
  realHeight: 600,
  width: 300,
  getHeight: () => Math.round((animation8.width * animation8.realHeight) / animation8.realWidth)
};

export const CoinflipPage: FC = observer(() => {
  const { isInitialized, result, currency, wonAmount } = useCoinflipPageViewModel();
  const { t } = useTranslation();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('coinflip|Game')}</PageTitle>

      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animation6.animationData
        }}
        height={animation6.getHeight()}
        width={animation6.width}
      />

      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animation7.animationData
        }}
        height={animation7.getHeight()}
        width={animation7.width}
      />

      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animation8.animationData
        }}
        height={animation8.getHeight()}
        width={animation8.width}
      />

      <CoinflipResultModal result={result} wonAmount={wonAmount} currency={currency} />

      <CoinflipRewardInfo />

      <CoinflipTokenSelector />

      <StickyBlock>
        <CoinflipGame />
        <CoinflipDetails />
      </StickyBlock>
      <CoinflipRules />
    </StateWrapper>
  );
});
