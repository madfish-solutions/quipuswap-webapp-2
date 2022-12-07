import BigNumber from 'bignumber.js';

import { DEFAULT_TOKEN_ID } from '@config/constants';
import { isEqual } from '@shared/helpers';

import { oppositeCurrentPrice } from '../pages/v3-item-page/helpers';

export const getCurrentPrice = (currentPrice: BigNumber, activeTokenIndex: number) =>
  isEqual(DEFAULT_TOKEN_ID, activeTokenIndex) ? currentPrice : oppositeCurrentPrice(currentPrice);
