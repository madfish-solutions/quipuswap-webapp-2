import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { useAccountPkh, useReady } from '@providers/use-dapp';
import { getSymbolsString, isExist, isUndefined } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useGetStableswapItem, useStableswapItemStore } from '../../../hooks';
import { extractTokens } from '../list/components/pool-card/pool-card.helpers';

export const useStableswapLiquidityItemPageViewModel = () => {
  const params = useParams();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const stableswapItemStore = useStableswapItemStore();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getStableswapItem } = useGetStableswapItem();
  const { t } = useTranslation();

  const poolId = params.poolId;

  useEffect(() => {
    if ((!dAppReady || isUndefined(poolId)) && prevAccountPkhRef.current === accountPkh) {
      return;
    }
    void getStableswapItem(new BigNumber(`${poolId}`));
    prevAccountPkhRef.current = accountPkh;
  }, [getStableswapItem, dAppReady, poolId, accountPkh]);

  const { itemStore } = stableswapItemStore;
  const { data: stableswapItem } = itemStore;

  const getTitle = () => {
    if (isExist(stableswapItem)) {
      const { tokensInfo } = stableswapItem;
      const tokenSymbols = getSymbolsString(extractTokens(tokensInfo));

      return `${t('liquidity|Liquidity')} ${tokenSymbols}`;
    }
  };

  return { getTitle };
};
