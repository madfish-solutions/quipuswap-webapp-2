import {
  METADATA_API,
} from '@utils/defaults';

export const getTokenMetadata = async (address:string, tokenId?:number) => {
  const data = await fetch(`${METADATA_API}/${address}/${tokenId || 0}`)
    .then((res) => res.json())
    .catch(() => (null));

  if (data.message) return null;
  return data;
};
