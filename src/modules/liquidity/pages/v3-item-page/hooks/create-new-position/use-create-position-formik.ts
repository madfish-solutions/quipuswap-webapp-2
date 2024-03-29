import { FormikHelpers, useFormik } from 'formik';

import { DELAY_BEFORE_DATA_UPDATE, EMPTY_STRING } from '@config/constants';
import { useLiquidityV3PoolStore, useV3NewPosition } from '@modules/liquidity/hooks';
import { getInvertedValue, sleep, stringToBigNumber } from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';

import { useCreateNewPositionFormValidationSchema } from './use-create-new-position-form-validation-schema';
import { CreatePositionFormValues, CreatePositionInput } from '../../types/create-position-form';

export const useCreatePositionFormik = (
  initialMinPrice: string,
  initialMaxPrice: string,
  tokensWithBalances: BalanceToken[]
) => {
  const { createNewV3Position } = useV3NewPosition();
  const poolStore = useLiquidityV3PoolStore();

  const handleSubmit = async (values: CreatePositionFormValues, actions: FormikHelpers<CreatePositionFormValues>) => {
    const shouldShowTokenXToYPrice = poolStore.localShouldShowXToYPrice;
    actions.setSubmitting(true);
    try {
      const displayedMinPrice = stringToBigNumber(values[CreatePositionInput.MIN_PRICE]);
      const displayedMaxPrice = stringToBigNumber(values[CreatePositionInput.MAX_PRICE]);
      await createNewV3Position(
        shouldShowTokenXToYPrice ? getInvertedValue(displayedMaxPrice) : displayedMinPrice,
        shouldShowTokenXToYPrice ? getInvertedValue(displayedMinPrice) : displayedMaxPrice,
        stringToBigNumber(values[CreatePositionInput.FIRST_AMOUNT_INPUT]),
        stringToBigNumber(values[CreatePositionInput.SECOND_AMOUNT_INPUT])
      );
      actions.setSubmitting(false);
      actions.resetForm();
      await sleep(DELAY_BEFORE_DATA_UPDATE);
      void poolStore.poolStore.load();
      void poolStore.itemStore.load();
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
