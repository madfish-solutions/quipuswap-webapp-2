import { FC } from 'react';

import { DashboardCard, DashboardStatsInfo } from '@shared/components';
import { isNull } from '@shared/helpers';

import styles from './farm-stats.module.scss';
import { useFarmStatsViewModel } from './use-farm-stats.vm';

export const FarmStats: FC = () => {
  const { label, tvl } = useFarmStatsViewModel();

  return (
    <DashboardStatsInfo
      cards={[
        <DashboardCard
          size="extraLarge"
          volume={tvl}
          loading={isNull(tvl)}
          label={label}
          currency="$"
          data-test-id="TVL"
        />
      ]}
      contentClassName={styles.cardContent}
      className={styles.dashboardStatsInfoMB}
    />
  );
};
