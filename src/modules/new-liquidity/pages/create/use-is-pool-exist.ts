import { useEffect, useState } from 'react';

import { AppRootRoutes } from '@app.router';
import { NewLiquidityRoutes } from '@modules/new-liquidity/new-liquidity-routes.enum';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { getTokenPairSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { getDexTwoLiquidityItemApi } from '../../api/get-dex-two-liquidity-item.api';

export const useIsPoolExist = (chosenTokens: Array<Token>) => {
  const [isPoolExist, setIsPoolExist] = useState(false);
  const [poolLink, setPoolLink] = useState('');

  useEffect(() => {
    (async () => {
      if (chosenTokens.length === 2) {
        try {
          const result = await getDexTwoLiquidityItemApi(getTokenPairSlug(...(chosenTokens as [Token, Token])));
          if (result.item) {
            setIsPoolExist(true);
            const [aToken, bToken] = chosenTokens;

            setPoolLink(
              `${AppRootRoutes.NewLiquidity}${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.add}/${getTokenPairSlug(
                aToken,
                bToken
              )}`
            );
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
