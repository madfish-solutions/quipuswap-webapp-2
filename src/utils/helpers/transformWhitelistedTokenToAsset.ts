import { TEZOS_TOKEN } from '@app.config';
import { WhitelistedToken } from '@utils/types';

export const transformWhitelistedTokenToAsset = (token: WhitelistedToken) =>
  token.contractAddress === TEZOS_TOKEN.contractAddress
    ? 'tez'
    : {
        contract: token.contractAddress,
        id: token.fa2TokenId ?? undefined
      };
