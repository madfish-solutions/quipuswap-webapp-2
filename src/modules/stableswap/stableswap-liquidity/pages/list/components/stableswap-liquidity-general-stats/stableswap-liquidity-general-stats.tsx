import { FC } from 'react';

import { DashboardStatsInfo } from '@shared/components';

import { PoolCreation } from '../pool-creation';
import { Tvl } from '../tvl';
import styles from './stableswap-liquidity-general-stats.module.scss';

export const StableswapLiquidityGeneralStats: FC = () => (
  <DashboardStatsInfo
    cards={[<Tvl />, <PoolCreation />]}
    contentClassName={styles.cardContent}
    className={styles.dashboardStatsInfoMB}
  />
);
