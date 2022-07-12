import BigNumber from 'bignumber.js';

import { isExist } from '@shared/helpers';

export const amountGreaterThanValue = (amount: BigNumber, value: string) =>
  isExist(amount) && amount.gt(new BigNumber(value));
