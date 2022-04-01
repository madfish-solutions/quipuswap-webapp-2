import { Standard, TokenId, TokenIdFa2 } from '@shared/types';

import { isExist } from '../type-checks';

export const isTokenTypeFa2 = (type: Standard): type is Standard.Fa2 => type.toUpperCase() === Standard.Fa2;

export const isTokenTypeFa12 = (type: Standard): type is Standard.Fa12 => type.toUpperCase() === Standard.Fa12;

export const isTokenFa2 = (token: TokenId): token is TokenIdFa2 =>
  isTokenTypeFa2(token.type) || ('fa2TokenId' in token && isExist(token.fa2TokenId));

export const isTokenFa12 = (token: TokenId) => isTokenTypeFa12(token.type);
