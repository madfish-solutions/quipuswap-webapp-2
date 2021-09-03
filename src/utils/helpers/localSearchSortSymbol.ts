import { WhitelistedToken } from '@utils/types';

export const localSearchSortSymbol = (
  { metadata: metadataA } : WhitelistedToken,
  { metadata: metadataB } : WhitelistedToken,
  input: string,
) => {
  const isSymbolA = metadataA?.symbol?.toLowerCase().includes(input.toLowerCase());
  const isSymbolB = metadataB?.symbol?.toLowerCase().includes(input.toLowerCase());
  return +isSymbolA - +isSymbolB;
};
