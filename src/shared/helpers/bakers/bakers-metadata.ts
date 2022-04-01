import { BAKERS_API, TZKT_API_DELEGATE_URL } from '@config/config';
import { Nullable } from '@shared/types';

interface BakerMetadataResponse {
  name: string;
  address: string;
  logo: string;
  freeSpace: number;
  fee: number;
}

const BAKER_TYPE = 'delegate';

export const isAddressBelongsToBaker = async (address: string) => {
  try {
    const response = await fetch(`${TZKT_API_DELEGATE_URL}/${address}`);
    const data = await response.json();

    if (data?.type == BAKER_TYPE) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

export const getBakerMetadata = async (address: string): Promise<Nullable<BakerMetadataResponse>> => {
  const data = await fetch(`${BAKERS_API}/${address}`)
    .then(async res => res.json())
    .catch(() => null);

  if (data?.message) {
    return null;
  }

  return data;
};
