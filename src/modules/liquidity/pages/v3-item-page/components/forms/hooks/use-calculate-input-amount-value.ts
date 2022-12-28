export const useCalculateInputAmountValue = () => {
  return '';
};

// import { useCallback } from 'react';

// import BigNumber from 'bignumber.js';

// import { EMPTY_STRING } from '@config/constants';
// import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
// import { toAtomic, toReal } from '@shared/helpers';

// import {
//   Tick,
//   calculateLiquidity,
//   calculateXTokenAmount,
//   calculateYTokenAmount
// } from '../../../helpers/v3-liquidity-helpers';
// import { V3AddTokenInput } from '../interface';

// export const useCalculateInputAmountValue = () => {
//   const { tokenX, tokenY } = useLiquidityV3ItemTokens();

//   return useCallback(
//     (
//       givenInputSlug: V3AddTokenInput,
//       currentTick: Tick,
//       upperTick: Tick,
//       lowerTick: Tick,
//       realInputAmount: BigNumber
//     ) => {
//       if (realInputAmount.isNaN()) {
//         return EMPTY_STRING;
//       }

//       const tokenGiven = givenInputSlug === V3AddTokenInput.firstTokenInput ? tokenX : tokenY;
//       const tokenToCalculate = tokenGiven === tokenX ? tokenY : tokenX;

//       const liquidity = calculateLiquidity(
//         currentTick.index,
//         lowerTick.index,
//         upperTick.index,
//         currentTick.price,
//         lowerTick.price,
//         upperTick.price,
//         tokenGiven === tokenX ? toAtomic(realInputAmount, tokenX) : new BigNumber(Infinity),
//         tokenGiven === tokenY ? toAtomic(realInputAmount, tokenY) : new BigNumber(Infinity)
//       );

//       const calculateTokenAmount = tokenToCalculate === tokenX ? calculateXTokenAmount : calculateYTokenAmount;
//       const tokenToCalculateAtomicAmount = calculateTokenAmount(
//         currentTick,
//         lowerTick,
//         upperTick,
//         liquidity
//       ).integerValue(BigNumber.ROUND_CEIL);

//       return toReal(tokenToCalculateAtomicAmount, tokenToCalculate).toFixed();
//     },
//     [tokenX, tokenY]
//   );
// };
