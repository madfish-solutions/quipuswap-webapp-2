import { BigNumber } from 'bignumber.js';

import { useLiquidityV3PoolStore } from '@modules/liquidity/hooks';

export const useV3AprAndVolume = () => {
  const { apiItem } = useLiquidityV3PoolStore();
  const { item } = apiItem;

  const apr = item?.apr ? new BigNumber(item?.apr) : null;
  const volume = item?.volumeForWeek ? new BigNumber(item?.volumeForWeek) : null;

  return {
    apr,
    volume
  };
};
