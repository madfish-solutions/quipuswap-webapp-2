import { BAKERS_API, HANGZHOUNET_BAKERS, NETWORK } from '@app.config';

import { QSNets } from '../types';

export const getBakers = async () => {
  if (NETWORK.id === QSNets.mainnet) {
    return fetch(BAKERS_API)
      .then(async res => res.json())
      .then(json => json)
      .catch(() => []);
  }

  return HANGZHOUNET_BAKERS;
};
