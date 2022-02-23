import { BAKERS_API, HANGZHOUNET_BAKERS, IS_NETWORK_MAINNET } from '@app.config';

export const getBakers = async () => {
  if (IS_NETWORK_MAINNET) {
    return fetch(BAKERS_API).then(async res => res.json());
  }

  return HANGZHOUNET_BAKERS;
};
