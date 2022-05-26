import { NETWORK } from '@config/config';
import { TEZOS_TOKEN } from '@config/tokens';

import { isTezosToken } from '../helpers';
import { TokenAddress } from '../types';

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

  const data = await fetch(`${NETWORK.metadata}/${contractAddress}/${fa2TokenId || 0}`)
    .then(async res => res.json())
    .catch(() => null);

  if (data?.message) {
    return null;
  }

  return data;
};
