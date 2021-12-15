import { WhitelistedToken } from '@utils/types';

import { shortize } from './shortize';

export const getWhitelistedTokenName = (token: WhitelistedToken, sliceAmount: number = 10): string =>
  (token.metadata.name.length > sliceAmount + 2
    ? `${token.metadata.name.slice(0, sliceAmount)}...`
    : token.metadata.name) ??
  token.metadata.symbol ??
  shortize(token.contractAddress) ??
  'Token';
