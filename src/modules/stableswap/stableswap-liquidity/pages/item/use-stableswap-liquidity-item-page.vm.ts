import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { useAccountPkh, useReady } from '@providers/use-dapp';
import { getSymbolsString, isExist, isUndefined } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useGetStableswapItem, useStableswapItemFormStore, useStableswapItemStore } from '../../../hooks';

const ZERO_LENGTH = 0;

export const useStableswapLiquidityItemPageViewModel = () => {
  const params = useParams();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getStableswapItem } = useGetStableswapItem();
  const { t } = useTranslation();

  const poolId = params.poolId;

  useEffect(() => {
    const loadItem = async () => {
      if ((!dAppReady || isUndefined(poolId)) && prevAccountPkhRef.current === accountPkh) {
        return;
      }

      await getStableswapItem(new BigNumber(`${poolId}`));

      const length = stableswapItemStore.item?.tokensInfo.length ?? ZERO_LENGTH;

      stableswapItemFormStore.initInputAmounts(length);
      prevAccountPkhRef.current = accountPkh;
    };

    void loadItem();
  }, [getStableswapItem, dAppReady, poolId, accountPkh, stableswapItemStore, stableswapItemFormStore]);

  const { itemStore } = stableswapItemStore;
  const { data: stableswapItem } = itemStore;

  const getTitle = () => {
    if (isExist(stableswapItem)) {
      const tokenSymbols = stableswapItem.tokensInfo.map(({ token }) => getSymbolsString(token));

      return `${t('liquidity|Liquidity')} ${tokenSymbols.join('/')}`;
    }
  };

  return { getTitle };
};
