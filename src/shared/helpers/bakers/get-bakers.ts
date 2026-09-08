import { NetworkType } from '@ecadlabs/beacon-types';

import { GHOSTNET_BAKERS } from '@config/bakers';
import { BAKERS_API } from '@config/config';
import { NETWORK_ID } from '@config/environment';
import { jsonFetch } from '@shared/api';

export const getBakers = async () => {
  if (NETWORK_ID === NetworkType.GHOSTNET) {
    return GHOSTNET_BAKERS;
  }

  return await jsonFetch(BAKERS_API);
};
