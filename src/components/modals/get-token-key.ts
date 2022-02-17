import { RawToken } from '@interfaces/types';

import { DEFAULT_TOKEN_ID } from './constants';

export const getTokenKey = (token: RawToken) => {
  return `${token.contractAddress}_${token.fa2TokenId ?? DEFAULT_TOKEN_ID}`;
};
