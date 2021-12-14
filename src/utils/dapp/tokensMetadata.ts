import { QSNetwork } from '@utils/types';

type RawTokenMetadata = {
  token_id?: string;
  name: string;
  symbol: string;
  decimals: number;
  thumbnailUri: string;
};

export const getTokenMetadata = async (
  network: QSNetwork,
  address: string,
  tokenId?: number,
): Promise<RawTokenMetadata | null> => {
  const data = await fetch(`${network.metadata}/${address}/${tokenId || 0}`)
    .then((res) => res.json())
    .catch(() => (null));

  if (data?.message) return null;
  return data;
};
