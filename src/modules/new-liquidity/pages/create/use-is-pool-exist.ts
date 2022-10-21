import { useEffect, useState } from 'react';

import { getTokenPairSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { getDexTwoLiquidityItemApi } from '../../api/get-dex-two-liquidity-item.api';

export const useIsPoolExist = (chosenTokens: Array<Token>) => {
  const [isPoolExist, setIsPoolExist] = useState(false);

  useEffect(() => {
    (async () => {
      if (chosenTokens.length === 2) {
        try {
          const result = await getDexTwoLiquidityItemApi(getTokenPairSlug(...(chosenTokens as [Token, Token])));
          if (result.item) {
            setIsPoolExist(true);
          } else {
            setIsPoolExist(false);
          }
        } catch (error) {
          setIsPoolExist(false);
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([...chosenTokens])]);

  return { isPoolExist };
};
