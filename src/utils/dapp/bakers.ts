import { BAKERS_API } from '@app.config';

export const getBakers = async () =>
  fetch(BAKERS_API)
    .then(async res => res.json())
    .then(json => json)
    .catch(() => []);
