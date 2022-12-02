import { DEFAULT_TOKEN_ID } from '@config/constants';
import { getSymbolsString, isEqual, RawOrMappedToken } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const getSymbolsStringByActiveToken = (tokens: Array<Nullable<RawOrMappedToken>>, activeTokenId: number) => {
  const tokenDirection = isEqual(DEFAULT_TOKEN_ID, activeTokenId) ? tokens : tokens.reverse();

  return getSymbolsString(tokenDirection);
};
