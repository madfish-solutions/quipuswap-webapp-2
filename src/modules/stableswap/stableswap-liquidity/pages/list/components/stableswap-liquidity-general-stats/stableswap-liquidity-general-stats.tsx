import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DashboardStatsInfo } from '@shared/components';

import { Tvl } from '../tvl';
import styles from './stableswap-liquidity-general-stats.module.scss';
import { useStableswapLiquidityGeneralStatsViewModel } from './stableswap-liquidity-general-stats.vm';

// TODO: add PoolCreation
export const StableswapLiquidityGeneralStats: FC = observer(() => {
  const { tvl } = useStableswapLiquidityGeneralStatsViewModel();

  return (
    <DashboardStatsInfo
      cards={[<Tvl amount={tvl} />]}
      contentClassName={styles.cardContent}
      className={styles.dashboardStatsInfoMB}
    />
  );
});
