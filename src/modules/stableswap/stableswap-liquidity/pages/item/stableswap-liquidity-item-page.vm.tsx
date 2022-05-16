import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { useAccountPkh, useReady } from '@providers/use-dapp';
import { isUndefined } from '@shared/helpers';

import { getStableswapTitle } from '../../../helpers';
import { useGetStableswapItem, useStableswapItemStore } from '../../../hooks';

export const useStableswapLiquidityItemPageViewModel = () => {
  const params = useParams();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getStableswapItem } = useGetStableswapItem();
  const stableswapItemStore = useStableswapItemStore();
  const { itemStore } = stableswapItemStore;
  const { data: stableswapItem } = itemStore;

  const poolId = params.poolId;

  useEffect(() => {
    if ((!dAppReady || isUndefined(poolId)) && prevAccountPkhRef.current === accountPkh) {
      return;
    }
    void getStableswapItem(new BigNumber(`${poolId}`));
    prevAccountPkhRef.current = accountPkh;
  }, [getStableswapItem, dAppReady, poolId, accountPkh]);

  const title = getStableswapTitle(stableswapItem);

  return { title };
};
