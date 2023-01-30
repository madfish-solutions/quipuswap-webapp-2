import BigNumber from 'bignumber.js';
import { DexTypeEnum, TradeOperation } from 'swap-router-sdk';

import {
  CONTRACT_DECIMALS_PRECISION,
  FEE_BASE_POINTS_PRECISION,
  STABLESWAP_PRECISION_FEE,
  ZERO_AMOUNT_BN
} from '@config/constants';

const WHOLE_PART = 3;
const FRACTIONAL_PART = 2;

export const getDevFeeRatio = (route: TradeOperation) => {
  switch (route.dexType) {
    case DexTypeEnum.QuipuSwap20:
      return new BigNumber(1).minus(
        route.fees?.auctionFee
          ?.dividedBy(WHOLE_PART)
          .multipliedBy(FRACTIONAL_PART)
          .dividedBy(CONTRACT_DECIMALS_PRECISION) ?? ZERO_AMOUNT_BN
      );
    case DexTypeEnum.QuipuSwapV3:
      return new BigNumber(1).minus(
        route.fees?.devFee && route.fees.liquidityProvidersFee
          ? route.fees.devFee.dividedBy(route.fees.liquidityProvidersFee).dividedBy(FEE_BASE_POINTS_PRECISION ** 2)
          : ZERO_AMOUNT_BN
      );
    default:
      return new BigNumber(1).minus(route.fees?.devFee?.dividedBy(STABLESWAP_PRECISION_FEE) ?? ZERO_AMOUNT_BN);
  }
};
