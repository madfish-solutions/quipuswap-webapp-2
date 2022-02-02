import { TEZOS_TOKEN } from '@app.config';
import { Token } from '@utils/types';

export const isTezIncluded = (tokens: Token[]) =>
  tokens.map(({ contractAddress }) => contractAddress).includes(TEZOS_TOKEN.contractAddress);
