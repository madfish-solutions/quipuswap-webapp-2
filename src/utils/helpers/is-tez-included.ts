import { TEZOS_TOKEN } from '@app.config';
import { Nullable, Token } from '@utils/types';

import { isExist } from '.';

export const isTezIncluded = (tokens: Nullable<Token>[]) =>
  tokens
    .filter(isExist)
    .map(({ contractAddress }) => contractAddress)
    .includes(TEZOS_TOKEN.contractAddress);
