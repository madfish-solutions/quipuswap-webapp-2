import { TEZOS_TOKEN } from '@app.config';
import { Nullable, WhitelistedToken } from '@utils/types';

import { isExist } from '.';

export const isTezIncluded = (tokens: Nullable<WhitelistedToken>[]) =>
  tokens
    .filter(isExist)
    .map(({ contractAddress }) => contractAddress)
    .includes(TEZOS_TOKEN.contractAddress);
