import { NETWORK } from '@config/config';
import { TEZOS_TOKEN } from '@config/tokens';

import { isTezosToken } from '../helpers';
import { TokenAddress } from '../types';

const DEFAULT_TOKEN_ID = 0;

export interface RawTokenMetadata {
  token_id?: string;
  name: string;
  symbol: string;
  decimals: number;
  thumbnailUri: string;
}

export const getTokenMetadata = async ({
  contractAddress,
  fa2TokenId
}: TokenAddress): Promise<RawTokenMetadata | null> => {
  if (isTezosToken({ contractAddress })) {
    return TEZOS_TOKEN.metadata;
  }

  const data = await fetch(`${NETWORK.metadata}/${contractAddress}/${fa2TokenId || DEFAULT_TOKEN_ID}`)
    .then(async res => res.json())
    .catch(() => null);

  return data?.message ? null : data;
};
