import { useEffect, useRef } from 'react';

import { BigNumber } from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { Version } from '@modules/stableswap/types';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { extractTokens, getSymbolsString, isUndefined } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { useGetStableDividendsItem, useStableDividendsItemStore } from '../../../hooks';

export const useStableDividendsItemPageViewModel = () => {
  const params = useParams();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  const { getStableDividendsItem } = useGetStableDividendsItem();
  const stableDividendsItemStore = useStableDividendsItemStore();
  const poolId = params.poolId;
  const version = params.version;

  useEffect(() => {
    const loadItem = async () => {
      if ((!dAppReady || !version || isUndefined(poolId)) && prevAccountPkhRef.current === accountPkh) {
        return;
      }
      if (!version) {
        return;
      }

      await getStableDividendsItem(new BigNumber(`${poolId}`), version as Version);
    };

    void loadItem();
  }, [dAppReady, poolId, accountPkh, getStableDividendsItem, version]);

  const title = stableDividendsItemStore.item
    ? getSymbolsString(extractTokens(stableDividendsItemStore.item.tokensInfo))
    : '';

  return { title };
};
