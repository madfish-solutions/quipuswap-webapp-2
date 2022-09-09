import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StateWrapper, StickyBlock, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { useCoinflipPageViewModel } from './coinflip-page.vm';
import {
  CoinflipDetails,
  CoinflipGame,
  CoinflipResultModal,
  CoinflipRewardInfo,
  CoinflipRules,
  CoinflipTokenSelector
} from './components';

export const CoinflipPage: FC = observer(() => {
  const { isInitialized, result, currency, wonAmount } = useCoinflipPageViewModel();
  const { t } = useTranslation();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />
      <PageTitle data-test-id="coinflipPageTitle">{t('coinflip|Game')}</PageTitle>
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
