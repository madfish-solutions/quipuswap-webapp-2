import { BAKERS_API, HANGZHOUNET_BAKERS, ITHACANET_BAKERS, NETWORK_ID } from '@app.config';

import { QSNets } from '../types';

export const getBakers = async () => {
  switch (NETWORK_ID) {
    case QSNets.hangzhounet:
      return HANGZHOUNET_BAKERS;
    case QSNets.ithacanet:
      return ITHACANET_BAKERS;
    default:
      return fetch(BAKERS_API).then(async res => await res.json());
  }
};
