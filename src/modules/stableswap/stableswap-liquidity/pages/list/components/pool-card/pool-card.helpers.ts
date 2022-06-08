import { getTokenSymbol } from '@shared/helpers';

import { StableswapTokensInfo } from '../../../../../types';

export const preparePoolAmounts = (tokensInfo: Array<StableswapTokensInfo>) => {
  return tokensInfo.map(({ token, reserves, reservesInUsd }) => ({
    amount: reserves,
    dollarEquivalent: reservesInUsd,
    currency: getTokenSymbol(token)
  }));
};
