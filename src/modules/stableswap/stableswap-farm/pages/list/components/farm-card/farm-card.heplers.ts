import { getTokenSymbol } from '@shared/helpers';

import { StableswapTokensInfo } from '../../../../../types';

export const prepareFarmAmounts = (tokensInfo: Array<StableswapTokensInfo>) => {
  return tokensInfo.map(({ token, reserves, reservesInUsd }) => ({
    amount: reserves,
    dollarEquivalent: reservesInUsd,
    currency: getTokenSymbol(token)
  }));
};
