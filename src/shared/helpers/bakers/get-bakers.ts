import { HANGZHOUNET_BAKERS, ITHACANET_BAKERS } from '@config/bakers';
import { BAKERS_API, NETWORK_ID } from '@config/enviroment';
import { QSNets } from '@shared/types';

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
