import { WhitelistedToken } from '@utils/types';

import { DEFAULT_TOKEN_ID } from './constants';

export const getTokenKey = (token: WhitelistedToken) => {
  return `${token.contractAddress}_${token.fa2TokenId ?? DEFAULT_TOKEN_ID}`;
};
