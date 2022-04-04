import { TEZOS_TOKEN } from '@config/tokens';
import { Token } from '@shared/types';

export const findNotTezToken = (tokens: Token[]) =>
  tokens.find(({ contractAddress }) => contractAddress !== TEZOS_TOKEN.contractAddress) || null;
