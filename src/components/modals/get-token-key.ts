import { Token } from '@utils/types';

import { DEFAULT_TOKEN_ID } from './constants';

export const getTokenKey = (token: Token) => {
  return `${token.contractAddress}_${token.fa2TokenId ?? DEFAULT_TOKEN_ID}`;
};
