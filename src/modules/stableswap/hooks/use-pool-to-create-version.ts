import { parse as parseQueryParams } from 'qs';
import { useLocation } from 'react-router-dom';

import { StableswapVersion } from '../types';

export const usePoolToCreateVersion = () => {
  const location = useLocation();
  const { v2: useV2 } = parseQueryParams(location.search, { ignoreQueryPrefix: true });

  return useV2 === String(true) ? StableswapVersion.V2 : StableswapVersion.V1;
};
