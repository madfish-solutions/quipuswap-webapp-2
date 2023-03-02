import { FARMING_COMMON_LIST_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

export const getFarmingListCommonApi = async () => await jsonFetch(FARMING_COMMON_LIST_API_URL);
