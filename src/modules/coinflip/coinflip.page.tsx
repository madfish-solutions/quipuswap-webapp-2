import { FC } from 'react';

import { PageTitle, TestnetAlert, StateWrapper } from '@shared/components';
import { useTranslation } from '@translation';

import { useCoinflipPageViewModel } from './coinflip-page.vm';
import styles from './coinflip.page.module.scss';
import { CoinflipGame, CoinflipTokenSelector } from './components';
import { CoinflipDashboardStatsInfo } from './components/dashboard-general-stats-info/coinflip-dashboard-stats';

export const CoinflipPage: FC = () => {
  const { t } = useTranslation('coinflip');
  const { isInitialized } = useCoinflipPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('coinflip|Game')}</PageTitle>

      <CoinflipTokenSelector />

      <CoinflipDashboardStatsInfo />

      <div className={styles.game}>
        <CoinflipGame />
      </div>
    </StateWrapper>
  );
};
