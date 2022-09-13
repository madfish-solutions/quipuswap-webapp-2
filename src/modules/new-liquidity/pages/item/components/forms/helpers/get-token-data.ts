import { BigNumber } from 'bignumber.js';

import { extractTokens } from '@shared/helpers';
import { Token } from '@shared/types';

interface DexTwoLiqTokensInfo {
  token: Token;
  atomicTokenTvl: BigNumber;
}

export const getTokenData = (tokensInfo: Array<DexTwoLiqTokensInfo>, index: number) => {
  const extractedTokens = extractTokens(tokensInfo);

  const token = extractedTokens[index];
  const decimals = token.metadata.decimals;
  const atomicTokenTvl = tokensInfo[index].atomicTokenTvl;

  return { token, decimals, atomicTokenTvl };
};
