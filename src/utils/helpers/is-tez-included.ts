import { TEZOS_TOKEN } from '@app.config';
import { WhitelistedToken } from '@utils/types';

export const isTezIncluded = (tokens: WhitelistedToken[]) =>
  tokens.map(({ contractAddress }) => contractAddress).includes(TEZOS_TOKEN.contractAddress);
