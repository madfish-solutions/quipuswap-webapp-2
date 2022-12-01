import BigNumber from 'bignumber.js';

import { FIRST_TOKEN_ID } from '@config/constants';
import { isEqual } from '@shared/helpers';

import { convertToRealPrice } from '../pages/v3-item-page/helpers';

export const getCurrentPrice = (sqrtPrice: BigNumber, activeTokenId: number) =>
  isEqual(FIRST_TOKEN_ID, activeTokenId)
    ? convertToRealPrice(sqrtPrice)
    : new BigNumber(1).dividedBy(convertToRealPrice(sqrtPrice));
