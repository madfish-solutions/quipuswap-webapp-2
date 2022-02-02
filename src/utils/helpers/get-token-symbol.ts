import { Token } from '@utils/types';

import { shortize } from './shortize';

export const getTokenSymbol = (token: Token, sliceAmount = 10): string =>
  (token.metadata.symbol.length > sliceAmount + 2
    ? `${token.metadata.symbol.slice(0, sliceAmount)}...`
    : token.metadata.symbol) ??
  (token.metadata.name.length > sliceAmount + 2
    ? `${token.metadata.name.slice(0, sliceAmount)}...`
    : token.metadata.name) ??
  shortize(token.contractAddress) ??
  'Token';
