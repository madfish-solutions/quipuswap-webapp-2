import { useCallback } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { EMPTY_STRING } from '@config/constants';
import { useLiquidityV3ItemTokens, useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { stringToBigNumber, toAtomic } from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';

import { calculateLiquidity, calculateTick } from '../../helpers';
import { CreatePositionFormValues, CreatePositionInput } from '../../types/create-position-form';
import { useCreateNewPositionFormValidationSchema } from './use-create-new-position-form-validation-schema';
import { useCurrentTick } from './use-current-tick';
import { useTickSpacing } from './use-tick-spacing';

export const useCreatePositionFormik = (
  initialMinPrice: string,
  initialMaxPrice: string,
  tokensWithBalances: BalanceToken[]
) => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const tickSpacing = useTickSpacing();
  const currentTick = useCurrentTick();
  const priceDecimals = useV3PoolPriceDecimals();

  const handleSubmit = useCallback(
    (values: CreatePositionFormValues) => {
      // eslint-disable-next-line no-console
      console.log('TODO: send a transaction');
      // TODO: remove calculations and console output below as soon as transaction sending is implemented
      const realTokenXAmount = new BigNumber(values[CreatePositionInput.FIRST_AMOUNT_INPUT]);
      const x = toAtomic(realTokenXAmount, tokenX);
      const realTokenYAmount = new BigNumber(values[CreatePositionInput.SECOND_AMOUNT_INPUT]);
      const y = toAtomic(realTokenYAmount, tokenY);
      const realMaxPrice = stringToBigNumber(values[CreatePositionInput.MAX_PRICE]);
      const realMinPrice = stringToBigNumber(values[CreatePositionInput.MIN_PRICE]);
      const lowerTick = calculateTick(toAtomic(realMinPrice, priceDecimals), tickSpacing);
      const upperTick = calculateTick(toAtomic(realMaxPrice, priceDecimals), tickSpacing);
      const liquidity = calculateLiquidity(
        currentTick!.index,
        lowerTick.index,
        upperTick.index,
        currentTick!.price,
        lowerTick.price,
        upperTick.price,
        x,
        y
      );
      // eslint-disable-next-line no-console
      console.log(`Partial transaction parameters: x=${x.toFixed()}, y=${y.toFixed()}, \
liquidity=${liquidity.toFixed()}, upper_tick_index=${upperTick.index.toFixed()}, \
lower_tick_index=${lowerTick.index.toFixed()}`);
    },
    [currentTick, priceDecimals, tickSpacing, tokenX, tokenY]
  );
  const validationSchema = useCreateNewPositionFormValidationSchema(tokensWithBalances);

  return useFormik<CreatePositionFormValues>({
    initialValues: {
      [CreatePositionInput.MIN_PRICE]: initialMinPrice,
      [CreatePositionInput.MAX_PRICE]: initialMaxPrice,
      [CreatePositionInput.FULL_RANGE_POSITION]: false,
      [CreatePositionInput.FIRST_AMOUNT_INPUT]: EMPTY_STRING,
      [CreatePositionInput.SECOND_AMOUNT_INPUT]: EMPTY_STRING
    },
    onSubmit: handleSubmit,
    validationSchema
  });
};
