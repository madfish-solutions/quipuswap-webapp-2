import { useEffect, useRef } from 'react';

import { BigNumber } from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { extractTokens } from '@modules/stableswap/helpers';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { getSymbolsString, isUndefined } from '@shared/helpers';

import { useGetStableDividendsItem, useStableDividendsItemStore } from '../../../hooks';

export const useStableDividendsItemPageViewModel = () => {
  const params = useParams();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  const { getStableDividendsItem } = useGetStableDividendsItem();
  const stableDividendsItemStore = useStableDividendsItemStore();
  const poolId = params.poolId;

  useEffect(() => {
    const loadItem = async () => {
      if ((!dAppReady || isUndefined(poolId)) && prevAccountPkhRef.current === accountPkh) {
        return;
      }

      await getStableDividendsItem(new BigNumber(`${poolId}`));
    };

    void loadItem();
  }, [dAppReady, poolId, accountPkh, getStableDividendsItem]);

  const title = stableDividendsItemStore.item
    ? getSymbolsString(extractTokens(stableDividendsItemStore.item.tokensInfo))
    : '';

  return { title };
};
