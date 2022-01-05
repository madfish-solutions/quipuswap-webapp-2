import { BAKERS_API } from '@app.config';
import { Nullable } from '@utils/types';

interface BakerMetadataResponse {
  name: string;
  address: string;
  logo: string;
  freeSpace: number;
  fee: number;
}

export const getBakerMetadata = async (address: string): Promise<Nullable<BakerMetadataResponse>> => {
  const data = await fetch(`${BAKERS_API}/${address}`)
    .then(async res => res.json())
    .catch(() => null);

  if (data?.message) {
    return null;
  }

  return data;
};
