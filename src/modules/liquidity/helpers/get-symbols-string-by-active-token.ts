import { FIRST_TOKEN_ID } from '@config/constants';
import { getSymbolsString, isEqual, RawOrMappedToken } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const getSymbolsStringByActiveToken = (tokens: Array<Nullable<RawOrMappedToken>>, activeTokenId: number) =>
  isEqual(FIRST_TOKEN_ID, activeTokenId) ? getSymbolsString(tokens) : getSymbolsString(tokens.reverse());
