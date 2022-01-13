import { RouteProps } from '@quipuswap/ui-kit';

import { getTokenSlug, getWhitelistedTokenSymbol, transformTokenDataToAnalyticsLink } from '@utils/helpers';
import { DexPair, WhitelistedToken } from '@utils/types';

export const dexRouteToQuipuUiKitRoute = (inputToken: WhitelistedToken, dexRoute: DexPair[]) => {
  if (dexRoute.length === 0) {
    return [];
  }

  return dexRoute.reduce<{ displayedRoute: RouteProps['routes']; currentToken: WhitelistedToken }>(
    ({ displayedRoute, currentToken }, { token1, token2 }, index) => {
      const token1IsNext = getTokenSlug(token2) === getTokenSlug(currentToken);
      const newCurrentToken = token1IsNext ? token1 : token2;
      const {
        contractAddress,
        type: tokenType,
        fa2TokenId,
        metadata: { decimals }
      } = newCurrentToken;

      return {
        displayedRoute: [
          ...displayedRoute,
          {
            id: index + 1,
            name: getWhitelistedTokenSymbol(newCurrentToken),
            link: transformTokenDataToAnalyticsLink({
              token: {
                address: contractAddress,
                type: tokenType,
                id: fa2TokenId,
                decimals
              },
              balance: '0'
            })
          }
        ],
        currentToken: newCurrentToken
      };
    },
    {
      displayedRoute: [
        {
          id: 0,
          name: getWhitelistedTokenSymbol(inputToken),
          link: transformTokenDataToAnalyticsLink({
            token: {
              address: inputToken.contractAddress,
              type: inputToken.type,
              id: inputToken.fa2TokenId,
              decimals: inputToken.metadata.decimals
            },
            balance: '0'
          })
        }
      ],
      currentToken: inputToken
    }
  ).displayedRoute;
};
