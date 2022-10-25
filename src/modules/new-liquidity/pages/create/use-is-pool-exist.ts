import { useEffect, useState } from 'react';

import { getCpmmPoolLink } from '@modules/new-liquidity/helpers';
import { getTokenPairSlug, isArrayPairTuple } from '@shared/helpers';
import { Token } from '@shared/types';

import { getDexTwoLiquidityItemApi } from '../../api/get-dex-two-liquidity-item.api';

export const useIsPoolExist = (chosenTokens: Array<Token>) => {
  const [isPoolExist, setIsPoolExist] = useState(false);
  const [poolLink, setPoolLink] = useState('');

  useEffect(() => {
    (async () => {
      if (isArrayPairTuple(chosenTokens)) {
        try {
          const tokenSlug = getTokenPairSlug(...chosenTokens);

          const result = await getDexTwoLiquidityItemApi(tokenSlug);
          if (result.item) {
            setIsPoolExist(true);
            setPoolLink(getCpmmPoolLink(chosenTokens));
          } else {
            setIsPoolExist(false);
            setPoolLink('');
          }
        } catch (error) {
          setIsPoolExist(false);
          setPoolLink('');
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([...chosenTokens])]);

  return { isPoolExist, link: poolLink };
};
