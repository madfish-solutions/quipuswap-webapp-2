import { IS_NETWORK_HANGZHOUNET, IS_NETWORK_ITHACANET } from '@config/enviroment';

const FARM_ID_FOR_RESTAKE_MAINNET = 3;
const FARM_ID_FOR_RESTAKE_HANGZHOUNET = 16;
const FARM_ID_FOR_RESTAKE_ITHACANET = 6;

export const getFarmIdForRestake = () => {
  if (IS_NETWORK_HANGZHOUNET) {
    return FARM_ID_FOR_RESTAKE_HANGZHOUNET;
  }

  if (IS_NETWORK_ITHACANET) {
    return FARM_ID_FOR_RESTAKE_ITHACANET;
  }

  return FARM_ID_FOR_RESTAKE_MAINNET;
};
