import { TEZOS_TOKEN } from '@config/tokens';
import { isExist, isTokenEqual } from '@shared/helpers';
import { Optional, TokenAddress } from '@shared/types';

export const tokenIsIncluded = (dexTokens: Optional<TokenAddress>[], token: TokenAddress) =>
  dexTokens.some(dexToken => isExist(dexToken) && isTokenEqual(dexToken, token));

export const tezosTokenIsIncluded = (dexTokens: Optional<TokenAddress>[]) => tokenIsIncluded(dexTokens, TEZOS_TOKEN);
