import { FC } from 'react';

import { observer } from 'mobx-react-lite';

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

export const CoinflipPage: FC = observer(() => {
  const { isInitialized, result, currency, wonAmount } = useCoinflipPageViewModel();
  const { t } = useTranslation();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('coinflip|Game')}</PageTitle>

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
