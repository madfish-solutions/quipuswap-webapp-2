import { BAKERS_API, TZKT_API_DELEGATE_URL } from '@config/config';
import { jsonFetch } from '@shared/api';

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
    const data = await jsonFetch(`${TZKT_API_DELEGATE_URL}/${address}`);

    return data?.type === BAKER_TYPE;
  } catch (err) {
    return false;
  }
};

export const getBakerMetadata = async (address: string) => {
  const data = await jsonFetch<BakerMetadataResponse | { message: string }>(`${BAKERS_API}/${address}`).catch(
    () => null
  );

  if (data && 'message' in data) {
    return null;
  }

  return data;
};
