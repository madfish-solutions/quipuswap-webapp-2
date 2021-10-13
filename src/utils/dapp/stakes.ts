import { STAKES_INFO_ENDPOINT } from '@utils/defaults';

export const getStakes = () => fetch(STAKES_INFO_ENDPOINT)
  .then((response) => response.json())
  .then((response) => response);
