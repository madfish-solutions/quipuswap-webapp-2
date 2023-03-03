import { BigNumber } from 'bignumber.js';

import { useLiquidityV3PoolStore } from '@modules/liquidity/hooks';

export const useV3AprAndVolume = () => {
  const { apiItem, itemIsLoading } = useLiquidityV3PoolStore();
  const { item } = apiItem;

  const apr = itemIsLoading ? null : new BigNumber(item?.apr ?? '0');
  const volume = item?.volumeForWeek ? new BigNumber(item.volumeForWeek) : null;

  return {
    apr,
    volume
  };
};
