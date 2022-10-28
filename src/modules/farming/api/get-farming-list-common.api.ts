import { FARMING_API_URL } from '@config/environment';

export const getFarmingListCommonApi = async () => {
  const farmingListCommonRaw = await fetch(`${FARMING_API_URL}/v3/all-farms`);

  return await farmingListCommonRaw.json();
};
