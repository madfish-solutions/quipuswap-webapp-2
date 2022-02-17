import { QSNetwork } from '@interfaces/types';

interface RawTokenMetadata {
  token_id?: string;
  name: string;
  symbol: string;
  decimals: number;
  thumbnailUri: string;
}

export const getTokenMetadata = async (
  network: QSNetwork,
  address: string,
  tokenId?: number
): Promise<RawTokenMetadata | null> => {
  const data = await fetch(`${network.metadata}/${address}/${tokenId || 0}`)
    .then(async res => res.json())
    .catch(() => null);

  if (data?.message) {
    return null;
  }

  return data;
};
