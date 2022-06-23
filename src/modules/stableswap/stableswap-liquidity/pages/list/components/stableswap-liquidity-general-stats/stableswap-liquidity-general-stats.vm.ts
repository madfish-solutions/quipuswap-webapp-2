import { useStableswapListStore } from '@modules/stableswap/hooks';

export const useStableswapLiquidityGeneralStatsViewModel = () => {
  const { stats } = useStableswapListStore();

  return {
    tvl: stats?.totalTvlInUsd ?? null
  };
};
