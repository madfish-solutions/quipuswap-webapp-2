import { FormikHelpers, useFormik } from 'formik';

import { EMPTY_STRING } from '@config/constants';
import { useLiquidityV3ItemTokens, useV3NewPosition, useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { stringToBigNumber, toAtomic } from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';

import { CreatePositionFormValues, CreatePositionInput } from '../../types/create-position-form';
import { useCreateNewPositionFormValidationSchema } from './use-create-new-position-form-validation-schema';

export const useCreatePositionFormik = (
  initialMinPrice: string,
  initialMaxPrice: string,
  tokensWithBalances: BalanceToken[]
) => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const priceDecimals = useV3PoolPriceDecimals();
  const { createNewV3Position } = useV3NewPosition();

  const handleSubmit = async (values: CreatePositionFormValues, actions: FormikHelpers<CreatePositionFormValues>) => {
    actions.setSubmitting(true);
    await createNewV3Position(
      toAtomic(stringToBigNumber(values[CreatePositionInput.MIN_PRICE]), priceDecimals),
      toAtomic(stringToBigNumber(values[CreatePositionInput.MAX_PRICE]), priceDecimals),
      toAtomic(stringToBigNumber(values[CreatePositionInput.FIRST_AMOUNT_INPUT]), tokenX),
      toAtomic(stringToBigNumber(values[CreatePositionInput.SECOND_AMOUNT_INPUT]), tokenY)
    );
    actions.setSubmitting(false);
  };
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
