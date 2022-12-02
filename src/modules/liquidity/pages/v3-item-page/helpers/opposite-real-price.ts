import BigNumber from 'bignumber.js';

import { convertToRealPrice } from './convert-to-real-price';

export const oppositeRealPrice = (sqrtPrice: BigNumber) => new BigNumber(1).dividedBy(convertToRealPrice(sqrtPrice));
