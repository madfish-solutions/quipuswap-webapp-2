import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, TestnetAlert, StateWrapper } from '@shared/components';
import { useTranslation } from '@translation';

import { useCoinflipPageViewModel } from './coinflip-page.vm';
import styles from './coinflip.page.module.scss';
import { CoinflipGame, CoinflipTokenSelector, CoinflipDashboardStatsInfo } from './components';
import { CoinflipRewardInfo } from './components/coinflip-reward-info';
import { useCoinflipGeneralStats, useGamesUserInfo } from './hooks';

export const CoinflipPage: FC = observer(() => {
  const { isInitialized } = useCoinflipPageViewModel();
  const { t } = useTranslation();
  const { isLoading } = useCoinflipGeneralStats();
  const { isLoadingGamesInfo } = useGamesUserInfo();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('coinflip|Game')}</PageTitle>

      <CoinflipRewardInfo isLoading={isLoadingGamesInfo} />

      <CoinflipTokenSelector />

      <CoinflipDashboardStatsInfo isLoading={isLoading} />

      <div className={styles.game}>
        <CoinflipGame />
      </div>
    </StateWrapper>
  );
});
