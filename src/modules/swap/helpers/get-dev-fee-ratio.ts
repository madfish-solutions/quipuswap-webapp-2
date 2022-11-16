import BigNumber from 'bignumber.js';
import { TradeOperation } from 'swap-router-sdk';

import { PERCENTAGE_100, ZERO_AMOUNT_BN } from '@config/constants';

export const getDevFeeRatio = (route: TradeOperation) =>
  new BigNumber(PERCENTAGE_100).minus(route.fees?.devFee ?? ZERO_AMOUNT_BN).dividedBy(PERCENTAGE_100);
