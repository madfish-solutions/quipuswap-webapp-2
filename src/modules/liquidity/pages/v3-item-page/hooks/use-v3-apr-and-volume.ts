import { BigNumber } from 'bignumber.js';

import { useLiquidityV3PoolStore } from '@modules/liquidity/hooks';

export const useV3AprAndVolume = () => {
  const { apiItem, itemIsLoading } = useLiquidityV3PoolStore();
  const { item } = apiItem;

  const apr = !itemIsLoading ? new BigNumber(item?.apr ?? '0') : null;
  const volume = item?.volumeForWeek ? new BigNumber(item.volumeForWeek) : null;

  return {
    apr,
    volume
  };
};
