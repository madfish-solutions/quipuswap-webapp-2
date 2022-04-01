import { BAKERS_API, HANGZHOUNET_BAKERS, IS_NETWORK_MAINNET } from '@config/config';

export const getBakers = async () => {
  if (IS_NETWORK_MAINNET) {
    return fetch(BAKERS_API).then(async res => await res.json());
  }

  return HANGZHOUNET_BAKERS;
};
