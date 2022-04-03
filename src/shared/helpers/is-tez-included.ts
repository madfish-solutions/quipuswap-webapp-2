import { TEZOS_TOKEN } from '@config/config';
import { Nullable, Token } from '@shared/types';

import { isExist } from './type-checks';

export const isTezIncluded = (tokens: Nullable<Token>[]) =>
  tokens
    .filter(isExist)
    .map(({ contractAddress }) => contractAddress)
    .includes(TEZOS_TOKEN.contractAddress);
