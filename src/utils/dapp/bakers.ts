import {
  BAKERS_API,
} from '@utils/defaults';

export const getBakers = async () => fetch(BAKERS_API)
  .then((res) => res.json())
  .then((json) => json)
  .catch(() => ([]));
