import { useEffect, useRef } from 'react';

import { BigNumber } from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { extractTokens } from '@modules/stableswap/helpers';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { getSymbolsString, isUndefined } from '@shared/helpers';

import { useGetStableFarmItem, useStableFarmItemStore } from '../../../hooks';

export const useStableswapFarmAddItemPageViewModel = () => {
  const params = useParams();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  const { getStableFarmItem } = useGetStableFarmItem();
  const stableFarmItemStore = useStableFarmItemStore();
  const poolId = params.poolId;

  useEffect(() => {
    const loadItem = async () => {
      if ((!dAppReady || isUndefined(poolId)) && prevAccountPkhRef.current === accountPkh) {
        return;
      }

      await getStableFarmItem(new BigNumber(`${poolId}`));
    };

    void loadItem();
  }, [dAppReady, poolId, accountPkh, getStableFarmItem]);

  const title = stableFarmItemStore.item ? getSymbolsString(extractTokens(stableFarmItemStore.item.tokensInfo)) : '';

  return { title };
};
