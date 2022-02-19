import BigNumber from 'bignumber.js';

import { TEZOS_TOKEN } from '@app.config';

export const toSixDecimals = (value: string) =>
  new BigNumber(value).decimalPlaces(TEZOS_TOKEN.metadata.decimals).toNumber();
