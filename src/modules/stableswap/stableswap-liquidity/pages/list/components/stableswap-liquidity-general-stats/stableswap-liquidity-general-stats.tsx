import { FC } from 'react';

import { DashboardStatsInfo } from '@shared/components';

import { Tvl } from '../tvl';
import styles from './stableswap-liquidity-general-stats.module.scss';

// TODO: add PoolCreation
export const StableswapLiquidityGeneralStats: FC = () => (
  <DashboardStatsInfo cards={[<Tvl />]} contentClassName={styles.cardContent} className={styles.dashboardStatsInfoMB} />
);
