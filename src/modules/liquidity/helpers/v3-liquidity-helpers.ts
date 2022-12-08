import { BigNumber } from 'bignumber.js';

import { getBaseLog } from '@shared/helpers';

const TICK_BASE = 1.0001;

export const calculateTickIndex = (price: BigNumber): BigNumber =>
  new BigNumber(getBaseLog(TICK_BASE, price.toNumber()));
