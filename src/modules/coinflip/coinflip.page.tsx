import { FC } from 'react';

import { PageTitle, TestnetAlert, StateWrapper, DashboardStatsInfo, DashboardCard } from '@shared/components';

import { useCoinflipPageViewModel } from './coinflip-page.vm';
import styles from './coinflip.page.module.scss';
import { CoinflipGame, CoinflipTokenSelector } from './components';

export const CoinflipPage: FC = () => {
  const { isInitialized } = useCoinflipPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>Game</PageTitle>

      <CoinflipTokenSelector />

      <DashboardStatsInfo
        header="Game Info"
        cards={[
          <DashboardCard
            size="large"
            volume="1000"
            label="Bank"
            currency="QUIPU"
            hideTooltip
            className={styles.dashboardCard}
          />,
          <DashboardCard
            size="large"
            volume="1.99"
            label="Payout coefficient"
            currency="X"
            hideTooltip
            className={styles.dashboardCard}
          />,
          <DashboardCard
            size="large"
            volume="1000"
            label="Total wins"
            currency="QUIPU"
            hideTooltip
            className={styles.dashboardCard}
          />,
          <DashboardCard size="large" volume="123" label="Games count" hideTooltip className={styles.dashboardCard} />
        ]}
        countOfRightElements={1}
      />

      <div style={{ width: '50%', marginTop: 24 }}>
        <CoinflipGame />
      </div>
    </StateWrapper>
  );
};
