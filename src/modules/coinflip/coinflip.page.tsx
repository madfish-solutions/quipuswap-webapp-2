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
import animationData from './data.json';

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
          animationData: animationData
        }}
        height={500}
        width={500}
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
