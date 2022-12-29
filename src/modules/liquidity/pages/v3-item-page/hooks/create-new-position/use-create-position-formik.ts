import { FormikHelpers, useFormik } from 'formik';

import { DELAY_BEFORE_DATA_UPDATE, EMPTY_STRING } from '@config/constants';
import { useLiquidityV3PoolStore, useV3NewPosition } from '@modules/liquidity/hooks';
import { sleep, stringToBigNumber } from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';

import { CreatePositionFormValues, CreatePositionInput } from '../../types/create-position-form';
import { useCreateNewPositionFormValidationSchema } from './use-create-new-position-form-validation-schema';

export const useCreatePositionFormik = (
  initialMinPrice: string,
  initialMaxPrice: string,
  tokensWithBalances: BalanceToken[]
) => {
  const { createNewV3Position } = useV3NewPosition();
  const poolStore = useLiquidityV3PoolStore();

  const handleSubmit = async (values: CreatePositionFormValues, actions: FormikHelpers<CreatePositionFormValues>) => {
    actions.setSubmitting(true);
    try {
      await createNewV3Position(
        stringToBigNumber(values[CreatePositionInput.MIN_PRICE]),
        stringToBigNumber(values[CreatePositionInput.MAX_PRICE]),
        stringToBigNumber(values[CreatePositionInput.FIRST_AMOUNT_INPUT]),
        stringToBigNumber(values[CreatePositionInput.SECOND_AMOUNT_INPUT])
      );
      actions.setSubmitting(false);
      actions.resetForm();
      await sleep(DELAY_BEFORE_DATA_UPDATE);
      void poolStore.itemSore.load();
      void poolStore.contractBalanceStore.load();
    } catch {}
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
