import BigNumber from 'bignumber.js';

import { DEFAULT_TOKEN_ID } from '@config/constants';
import { getInvertedValue, isEqual } from '@shared/helpers';

export const convertPrice = (actualPrice: BigNumber, activeTokenIndex: number) =>
  isEqual(DEFAULT_TOKEN_ID, activeTokenIndex) ? actualPrice : getInvertedValue(actualPrice);
