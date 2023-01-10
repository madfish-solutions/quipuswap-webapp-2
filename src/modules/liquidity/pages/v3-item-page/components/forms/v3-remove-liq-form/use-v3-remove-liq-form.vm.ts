import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { FIRST_INDEX, PERCENTAGE_100, ZERO_AMOUNT } from '@config/constants';
import {
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore,
  useLiquidityV3PositionStore
} from '@modules/liquidity/hooks';
import { isEqual, isNull, numberAsString } from '@shared/helpers';
import { useTranslation } from '@translation';

import { findUserPosition } from '../../../helpers';
import { usePositionsWithStats } from '../../../hooks';
import { calculateOutput, isOneOfTheOutputNotZero, preventRedundantRecalculation } from '../helpers';
import { V3RemoveFormValues, V3RemoveTokenInput } from '../interface';
import { useV3RemoveLiqFormValidation } from './use-v3-remove-liq-form.validation';

export const useV3RemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const poolStore = useLiquidityV3PoolStore();
  const item = poolStore.item;

  const tokens = [tokenX, tokenY];
  const userPosition = findUserPosition(positionsWithStats, positionId);

  const handleSubmit = (values: FormikValues, actions: FormikHelpers<V3RemoveFormValues>) => {
    const isAddLiqPossible = isOneOfTheOutputNotZero(values);

    if (!isAddLiqPossible) {
      return;
    }

    actions.setSubmitting(true);
    actions.setSubmitting(false);
  };

  const handleInputChange = () => {
    return (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, ZERO_AMOUNT);
      if (isNull(item) || isNull(userPosition) || isNull(tokenX) || isNull(tokenY)) {
        return;
      }

      const _inputAmount = preventRedundantRecalculation(inputAmount);

      const { tokenXDeposit, tokenYDeposit } = calculateOutput(
        _inputAmount,
        userPosition,
        item.storage,
        tokenX,
        tokenY
      );

      formik.setValues({
        [V3RemoveTokenInput.lpTokenInput]: realValue,
        [V3RemoveTokenInput.tokenXInput]: tokenXDeposit,
        [V3RemoveTokenInput.tokenYInput]: tokenYDeposit
      });
    };
  };

  const validationSchema = useV3RemoveLiqFormValidation();

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [V3RemoveTokenInput.lpTokenInput]: '',
      [V3RemoveTokenInput.tokenXInput]: '',
      [V3RemoveTokenInput.tokenYInput]: ''
    },
    onSubmit: handleSubmit
  });

  const outputData = tokens.map((token, index) => {
    const formikId = isEqual(FIRST_INDEX, index) ? V3RemoveTokenInput.tokenXInput : V3RemoveTokenInput.tokenYInput;

    return {
      id: `v3-output-${index}`,
      value: formik.values[formikId],
      error: formik.errors[formikId],
      label: t('common|Output'),
      tokens: token,
      hiddenPercentSelector: true,
      disabled: true,
      hiddenBalance: true,
      onInputChange: handleInputChange()
    };
  });

  const lpData = {
    id: 'v3-lp-input',
    value: formik.values[V3RemoveTokenInput.lpTokenInput],
    error: formik.errors[V3RemoveTokenInput.lpTokenInput],
    balance: PERCENTAGE_100,
    label: t('common|Amount'),
    tokens: [tokenX, tokenY],
    hiddenBalance: true,
    onInputChange: handleInputChange()
  };

  const disabled = formik.isSubmitting;

  return {
    lpData,
    data: outputData,
    disabled,
    isSubmitting: formik.isSubmitting,
    onSubmit: formik.handleSubmit
  };
};
