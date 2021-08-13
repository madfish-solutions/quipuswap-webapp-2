import { QSNetwork } from '@utils/types';

export const getTokenMetadata = async (network: QSNetwork, address:string, tokenId?:number) => {
  const data = await fetch(`${network.id}/${address}/${tokenId || 0}`)
    .then((res) => res.json())
    .catch(() => (null));

  if (data?.message) return null;
  return data;
};
