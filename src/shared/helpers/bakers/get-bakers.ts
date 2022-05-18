import { NetworkType } from '@airgap/beacon-sdk';

import { HANGZHOUNET_BAKERS, ITHACANET_BAKERS } from '@config/bakers';
import { BAKERS_API, NETWORK_ID } from '@config/enviroment';

export const getBakers = async () => {
  switch (NETWORK_ID) {
    case NetworkType.HANGZHOUNET:
      return HANGZHOUNET_BAKERS;
    case NetworkType.ITHACANET:
      return ITHACANET_BAKERS;
    default:
      return fetch(BAKERS_API).then(async res => await res.json());
  }
};
