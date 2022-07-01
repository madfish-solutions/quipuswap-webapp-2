import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, TestnetAlert, StateWrapper, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { useCoinflipPageViewModel } from './coinflip-page.vm';
import { CoinflipGame, CoinflipTokenSelector, CoinflipRewardInfo, CoinflipDetails } from './components';

export const CoinflipPage: FC = observer(() => {
  const { isInitialized } = useCoinflipPageViewModel();
  const { t } = useTranslation();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('coinflip|Game')}</PageTitle>

      <CoinflipRewardInfo />

      <CoinflipTokenSelector />

      {/* <CoinflipDashboardStatsInfo isLoading={isLoading} /> */}

      <StickyBlock>
        <CoinflipGame />
        <CoinflipDetails />
      </StickyBlock>
    </StateWrapper>
  );
});
