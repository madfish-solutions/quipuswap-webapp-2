import {
  MAINNET_BAKERS,
} from '@utils/defaults';

export const getBakers = async () => fetch(MAINNET_BAKERS)
  .then((res) => res.json())
  .then((json) => json)
  .catch(() => ([]));
