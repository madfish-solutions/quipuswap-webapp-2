import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { useAccountPkh, useReady } from '@providers/use-dapp';
import { isUndefined } from '@shared/helpers';

import { getStableswapTitle } from '../../../helpers';
import { useStableswapItemFormStore, useGetStableswapItem, useStableswapItemStore } from '../../../hooks';

export const useStableswapLiquidityRemoveItemPageViewModel = () => {
  const params = useParams();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getStableswapItem } = useGetStableswapItem();
  const stableswapItemStore = useStableswapItemStore();
  const { itemStore } = stableswapItemStore;
  const { model: stableswapItem } = itemStore;

  const poolId = params.poolId;

  useEffect(() => {
    const loadItem = async () => {
      if ((!dAppReady || isUndefined(poolId)) && prevAccountPkhRef.current === accountPkh) {
        return;
      }

      await getStableswapItem(new BigNumber(`${poolId}`));

      prevAccountPkhRef.current = accountPkh;
    };

    void loadItem();
  }, [getStableswapItem, dAppReady, poolId, accountPkh, stableswapItemStore, stableswapItemFormStore]);

  const title = getStableswapTitle(stableswapItem);

  return { title };
};
