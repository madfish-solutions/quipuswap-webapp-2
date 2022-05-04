import { StableswapTokensInfo } from '@modules/stableswap/types';
import { getTokenSymbol } from '@shared/helpers';

export const extractTokens = (tokensInfo: Array<StableswapTokensInfo>) => tokensInfo.map(({ token }) => token);

export const preparePoolAmounts = (tokensInfo: Array<StableswapTokensInfo>) => {
  return tokensInfo.map(({ token, reserves, reservesInUsd }) => ({
    amount: reserves,
    dollarEquivalent: reservesInUsd,
    currency: getTokenSymbol(token)
  }));
};
