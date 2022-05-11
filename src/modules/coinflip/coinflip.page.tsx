import { FC } from 'react';

import { PageTitle, TestnetAlert, DashboardStatsInfo, DashboardCard } from '@shared/components';

import styles from './coinflip.page.module.scss';

export const CoinflipPage: FC = () => {
  return (
    <>
      <TestnetAlert />
      <PageTitle>Game</PageTitle>
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
    </>
  );
};
