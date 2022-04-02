import { getTokenSlug, getTokenSymbol, transformTokenDataToAnalyticsLink } from '@shared/helpers';
import { DexPair, Token } from '@shared/types';

import { RouteProps } from '../route';

export const dexRouteToQuipuUiKitRoute = (inputToken: Token, dexRoute: DexPair[]) => {
  if (dexRoute.length === 0) {
    return [];
  }
  //TODO

  return dexRoute.reduce<{ displayedRoute: RouteProps['routes']; currentToken: Token }>(
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
            name: getTokenSymbol(newCurrentToken),
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
          name: getTokenSymbol(inputToken),
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
