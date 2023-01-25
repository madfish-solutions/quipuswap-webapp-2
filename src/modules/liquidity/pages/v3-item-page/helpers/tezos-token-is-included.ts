import { isExist, isTezosToken } from '@shared/helpers';
import { Optional, TokenAddress } from '@shared/types';

export const tezosTokenIsIncluded = (dexTokens: Optional<TokenAddress>[]) =>
  dexTokens.some(token => isExist(token) && isTezosToken(token));
