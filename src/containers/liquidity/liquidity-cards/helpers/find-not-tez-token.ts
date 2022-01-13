import { TEZOS_TOKEN } from '@app.config';
import { WhitelistedToken } from '@utils/types';

export const findNotTezToken = (tokens: WhitelistedToken[]) =>
  tokens.find(({ contractAddress }) => contractAddress !== TEZOS_TOKEN.contractAddress) || null;
