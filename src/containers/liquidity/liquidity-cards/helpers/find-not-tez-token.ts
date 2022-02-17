import { TEZOS_TOKEN } from '@app.config';
import { RawToken } from '@interfaces/types';

export const findNotTezToken = (tokens: RawToken[]) =>
  tokens.find(({ contractAddress }) => contractAddress !== TEZOS_TOKEN.contractAddress) || null;
