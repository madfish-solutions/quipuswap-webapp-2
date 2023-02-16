import BigNumber from 'bignumber.js';

import { DEFAULT_TOKEN_ID } from '@config/constants';
import { isEqual } from '@shared/helpers';

import { oppositeCurrentPrice } from '../pages/v3-item-page/helpers';

export const convertPrice = (actualPrice: BigNumber, activeTokenIndex: number) =>
  isEqual(DEFAULT_TOKEN_ID, activeTokenIndex) ? actualPrice : oppositeCurrentPrice(actualPrice);
