import {
  BAKERS_API,
} from '@utils/defaults';

type BakerMetadataResponse = {
  name:string,
  address:string,
  logo: string,
  freeSpace: number,
  fee: number
} | null;

export const getBakerMetadata = async (address:string) : Promise<BakerMetadataResponse> => {
  const data = await fetch(`${BAKERS_API}/${address}`)
    .then((res) => res.json())
    .catch(() => (null));

  if (data?.message) return null;
  return data;
};
