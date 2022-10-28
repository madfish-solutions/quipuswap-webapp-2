import { useCallback, useEffect, useState } from 'react';

import { DexLink } from '@modules/liquidity/helpers';
import { getTokenPairSlug, isArrayPairTuple } from '@shared/helpers';
import { Token } from '@shared/types';

import { getDexTwoLiquidityItemApi } from '../../api/get-dex-two-liquidity-item.api';
import { PoolLinkExist, PoolLinkNotExist } from './components/dex-two-create-form/dex-two-create-form.types';

export const useIsPoolExist = (chosenTokens: Array<Token>): PoolLinkExist | PoolLinkNotExist => {
  const [isPoolExist, setIsPoolExist] = useState(false);
  const [existingPoolLink, setExistingPoolLink] = useState<Nullable<string>>(null);

  const reset = useCallback(() => {
    setIsPoolExist(false);
    setExistingPoolLink(null);
  }, []);

  useEffect(() => {
    (async () => {
      if (!isArrayPairTuple(chosenTokens)) {
        reset();

        return;
      }

      try {
        const tokenSlug = getTokenPairSlug(...chosenTokens);

        const result = await getDexTwoLiquidityItemApi(tokenSlug);
        if (!result.item) {
          throw new Error('Pool not found');
        }

        setIsPoolExist(true);
        setExistingPoolLink(DexLink.getCpmmPoolLink(chosenTokens));
      } catch (error) {
        reset();
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([...chosenTokens])]);

  return { isPoolExist, existingPoolLink } as PoolLinkExist | PoolLinkNotExist;
};
