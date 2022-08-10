import { NetworkType } from '@airgap/beacon-sdk';

import { GHOSTNET_BAKERS } from '@config/bakers';
import { BAKERS_API } from '@config/config';
import { NETWORK_ID } from '@config/environment';

export const getBakers = async () => {
  if (NETWORK_ID === NetworkType.GHOSTNET) {
    return GHOSTNET_BAKERS;
  }

  return fetch(BAKERS_API).then(async res => await res.json());
};
