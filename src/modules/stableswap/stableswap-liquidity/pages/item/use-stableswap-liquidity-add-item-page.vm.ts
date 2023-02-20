import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { useAccountPkh, useReady } from '@providers/use-dapp';
import { isGreaterThanZero, isUndefined } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getStableswapTitle } from '../../../helpers';
import { useStableswapItemFormStore, useGetStableswapItem, useStableswapItemStore } from '../../../hooks';
import { opportunityHelper } from './opportunity.helper';

export const useStableswapLiquiditAddItemPageViewModel = () => {
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
  const opportunities = stableswapItem?.opportunities
    ?.map(opportunityHelper)
    .filter(({ apr }) => isGreaterThanZero(apr));

  return { title, opportunities: opportunities ?? [] };
};
