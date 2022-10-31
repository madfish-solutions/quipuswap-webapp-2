import { BigNumber } from 'bignumber.js';

import { FISRT_INDEX } from '@config/constants';
import { extractTokens, isEqual } from '@shared/helpers';
import { Token } from '@shared/types';

import { Input } from '../interface';

interface DexTwoLiqTokensInfo {
  token: Token;
  atomicTokenTvl: BigNumber;
}

export const getTokenAndFieldData = (tokensInfo: Array<DexTwoLiqTokensInfo>, index: number) => {
  const extractedTokens = extractTokens(tokensInfo);

  const token = extractedTokens[index];
  const decimals = token.metadata.decimals;
  const atomicTokenTvl = tokensInfo[index].atomicTokenTvl;

  const inputField = isEqual(index, FISRT_INDEX) ? Input.FIRST_LIQ_INPUT : Input.SECOND_LIQ_INPUT;

  return { token, decimals, atomicTokenTvl, inputField };
};
