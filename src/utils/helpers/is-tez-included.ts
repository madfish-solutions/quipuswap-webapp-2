import { TEZOS_TOKEN } from '@app.config';
import { Nullable, RawToken } from '@interfaces/types';

import { isExist } from '.';

export const isTezIncluded = (tokens: Nullable<RawToken>[]) =>
  tokens
    .filter(isExist)
    .map(({ contractAddress }) => contractAddress)
    .includes(TEZOS_TOKEN.contractAddress);
