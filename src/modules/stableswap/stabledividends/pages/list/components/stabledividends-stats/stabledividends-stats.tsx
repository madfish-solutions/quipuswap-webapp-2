import { FC } from 'react';

import { DashboardCard, DashboardStatsInfo } from '@shared/components';
import { isNull } from '@shared/helpers';

import styles from './stabledividends-stats.module.scss';
import { useStableDividendsStatsViewModel } from './use-stabledividends-stats.vm';

export const StableDividendsStats: FC = () => {
  const { label, tvl } = useStableDividendsStatsViewModel();

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
