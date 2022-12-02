import BigNumber from 'bignumber.js';

import { DEFAULT_TOKEN_ID } from '@config/constants';
import { isEqual } from '@shared/helpers';

import { convertToRealPrice, oppositeRealPrice } from '../pages/v3-item-page/helpers';

export const getCurrentPrice = (sqrtPrice: BigNumber, activeTokenId: number) =>
  isEqual(DEFAULT_TOKEN_ID, activeTokenId) ? convertToRealPrice(sqrtPrice) : oppositeRealPrice(sqrtPrice);
