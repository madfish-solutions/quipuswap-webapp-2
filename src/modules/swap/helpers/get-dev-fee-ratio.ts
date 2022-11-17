import BigNumber from 'bignumber.js';
import { DexTypeEnum, TradeOperation } from 'swap-router-sdk';

import { CONTRACT_DECIMALS_PRECISION, STABLESWAP_PRECISION_FEE, ZERO_AMOUNT_BN } from '@config/constants';
import { isEqual } from '@shared/helpers';

const WHOLE_PART = 3;
const FRACTIONAL_PART = 2;

export const getDevFeeRatio = (route: TradeOperation) => {
  if (isEqual(route.dexType, DexTypeEnum.QuipuSwap20)) {
    return new BigNumber(1).minus(
      route.fees?.auctionFee
        ?.dividedBy(WHOLE_PART)
        .multipliedBy(FRACTIONAL_PART)
        .dividedBy(CONTRACT_DECIMALS_PRECISION) ?? ZERO_AMOUNT_BN
    );
  }

  return new BigNumber(1).minus(route.fees?.devFee?.dividedBy(STABLESWAP_PRECISION_FEE) ?? ZERO_AMOUNT_BN);
};
