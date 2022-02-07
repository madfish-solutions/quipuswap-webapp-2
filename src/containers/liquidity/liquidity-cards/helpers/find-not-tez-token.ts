import { TEZOS_TOKEN } from '@app.config';
import { Token } from '@utils/types';

export const findNotTezToken = (tokens: Token[]) =>
  tokens.find(({ contractAddress }) => contractAddress !== TEZOS_TOKEN.contractAddress) || null;
