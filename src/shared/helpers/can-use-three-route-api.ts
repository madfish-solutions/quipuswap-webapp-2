import { THREE_ROUTE_API_URL } from '@config/environment';

import { isExist } from './type-checks';

export const canUseThreeRouteApi = () => isExist(THREE_ROUTE_API_URL);
