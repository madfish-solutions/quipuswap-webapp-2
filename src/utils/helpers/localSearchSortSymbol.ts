import BigNumber from 'bignumber.js';

import { WhitelistedToken } from '@utils/types';

export const localSearchSortSymbol = (
  { metadata: metadataA, fa2TokenId: fa2TokenIdA }: WhitelistedToken,
  { metadata: metadataB, fa2TokenId: fa2TokenIdB }: WhitelistedToken,
  input: string,
  inputToken: string
) => {
  const isSymbolA = metadataA?.symbol?.toLowerCase().includes(input.toLowerCase());
  const isFa2A = new BigNumber(fa2TokenIdA ?? '-1').eq(new BigNumber(inputToken));
  const isSymbolB = metadataB?.symbol?.toLowerCase().includes(input.toLowerCase());
  const isFa2B = new BigNumber(fa2TokenIdB ?? '-1').eq(new BigNumber(inputToken));

  return +isSymbolA - +isSymbolB || +isFa2A - +isFa2B;
};
