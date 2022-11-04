import { FARMING_COMMON_LIST_API_URL } from '@config/constants';

export const getFarmingListCommonApi = async () => {
  const farmingListCommonRaw = await fetch(FARMING_COMMON_LIST_API_URL);

  return await farmingListCommonRaw.json();
};
