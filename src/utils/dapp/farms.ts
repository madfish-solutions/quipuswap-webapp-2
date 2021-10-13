import { FARMS_INFO_ENDPOINT } from '@utils/defaults';
import { transformToken } from '@utils/helpers/transformToken';
import { FarmsFromServer, FarmsFromServerWithWhitelistedPair } from '@utils/types';

export const getFarms = async () => fetch(FARMS_INFO_ENDPOINT)
  .then((response) => response.json())
  .then((farms:FarmsFromServer[]):FarmsFromServerWithWhitelistedPair[] => farms.map((x) => ({
    ...x,
    tokenPair: {
      token1: transformToken(x.tokenPair.token1),
      token2: transformToken(x.tokenPair.token2),
    },
  })))
  .catch(() => []);
