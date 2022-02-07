import { FoundDex } from '@quipuswap/sdk';

import { TEZOS_TOKEN } from '@app.config';
import { getTokenSlug } from '@utils/helpers/get-token-slug';
import { Nullable, WhitelistedToken } from '@utils/types';

export const isTezIncluded = (tokens: WhitelistedToken[]) =>
  tokens.map(({ contractAddress }) => contractAddress).includes(TEZOS_TOKEN.contractAddress);

export const isSameTokens = (token1: Nullable<WhitelistedToken>, token2: Nullable<WhitelistedToken>) => {
  if (token1 && token2) {
    return getTokenSlug(token1) === getTokenSlug(token2);
  }

  return false;
};

export const isSameDex = (dex1: Nullable<FoundDex>, dex2: Nullable<FoundDex>) => {
  if (dex1 && dex2) {
    return dex1.contract.address === dex2.contract.address;
  }

  return false;
};
