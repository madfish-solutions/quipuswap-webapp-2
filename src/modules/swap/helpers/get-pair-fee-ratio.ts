import BigNumber from 'bignumber.js';
import { DexTypeEnum } from 'swap-router-sdk';
import { RoutePairWithDirection } from 'swap-router-sdk/dist/interface/route-pair-with-direction.interface';

import { CONTRACT_DECIMALS_PRECISION, STABLESWAP_PRECISION_FEE } from '@config/constants';
import { getSumOfNumbers, isEqual } from '@shared/helpers';

// TODO: https://madfish.atlassian.net/browse/QUIPU-699
// Remove this file, when '@swap-router-sdk' will be ready to import all of code below

type FixedFeeDexTypeEnum = Exclude<DexTypeEnum, DexTypeEnum.QuipuSwapCurveLike | DexTypeEnum.QuipuSwap20>;

const PAIR_FEE_PERCENT_RECORD: Record<FixedFeeDexTypeEnum, number> = {
  [DexTypeEnum.QuipuSwap]: 0.3,
  [DexTypeEnum.QuipuSwapTokenToTokenDex]: 0.3,
  [DexTypeEnum.Plenty]: 0.35,
  [DexTypeEnum.PlentyBridge]: 0,
  [DexTypeEnum.PlentyStableSwap]: 0.1,
  [DexTypeEnum.PlentyVolatileSwap]: 0.34482758620689657,
  [DexTypeEnum.PlentyCtez]: 0.1,
  [DexTypeEnum.LiquidityBaking]: 0.21,
  [DexTypeEnum.Youves]: 0.15,
  [DexTypeEnum.Vortex]: 0.28,
  [DexTypeEnum.Spicy]: 0.3,
  [DexTypeEnum.SpicyWrap]: 0.1
};

export const getPairFeeRatio = (pair: RoutePairWithDirection) => {
  switch (pair.dexType) {
    case DexTypeEnum.QuipuSwapCurveLike:
    case DexTypeEnum.QuipuSwap20:
      const feeShare = getSumOfNumbers(Object.values(pair.fees!)).div(
        isEqual(pair.dexType, DexTypeEnum.QuipuSwap20) ? CONTRACT_DECIMALS_PRECISION : STABLESWAP_PRECISION_FEE
      );

      return new BigNumber(1).minus(feeShare);
    default:
      const feePercent = PAIR_FEE_PERCENT_RECORD[pair.dexType];

      return new BigNumber(100).minus(feePercent).dividedBy(100);
  }
};
