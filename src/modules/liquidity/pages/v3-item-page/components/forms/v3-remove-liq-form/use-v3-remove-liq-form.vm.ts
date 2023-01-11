import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { FIRST_INDEX, PERCENTAGE_100, ZERO_AMOUNT } from '@config/constants';
import {
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore,
  useLiquidityV3PositionStore
} from '@modules/liquidity/hooks';
import { useGetLiquidityV3Position } from '@modules/liquidity/hooks/loaders/use-get-liquidity-v3-position';
import { isEqual, isNull, numberAsString } from '@shared/helpers';
import { useTranslation } from '@translation';

import { findUserPosition } from '../../../helpers';
import { usePositionsWithStats } from '../../../hooks';
import { calculateOutput, isOneOfTheOutputNotZero, preventRedundantRecalculation } from '../helpers';
import { useV3RemoveLiquidity } from '../hooks';
import { V3RemoveFormValues, V3RemoveTokenInput } from '../interface';
import { useV3RemoveLiqFormValidation } from './use-v3-remove-liq-form.validation';

export const useV3RemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const { removeLiquidity } = useV3RemoveLiquidity();
  const { delayedGetLiquidityV3Position } = useGetLiquidityV3Position();
  const poolStore = useLiquidityV3PoolStore();
  const item = poolStore.item;

  const tokens = [tokenX, tokenY];
  const userPosition = findUserPosition(positionsWithStats, positionId);

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<V3RemoveFormValues>) => {
    const isAddLiqPossible = isOneOfTheOutputNotZero(values);

    if (!isAddLiqPossible) {
      return;
    }

    actions.setSubmitting(true);

    await removeLiquidity(values);

    await delayedGetLiquidityV3Position();

    actions.setSubmitting(false);
    actions.resetForm();
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
        [V3RemoveTokenInput.percantageInput]: realValue,
        [V3RemoveTokenInput.tokenXOutput]: tokenXDeposit,
        [V3RemoveTokenInput.tokenYOutput]: tokenYDeposit
      });
    };
  };

  const validationSchema = useV3RemoveLiqFormValidation();

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [V3RemoveTokenInput.percantageInput]: '',
      [V3RemoveTokenInput.tokenXOutput]: '',
      [V3RemoveTokenInput.tokenYOutput]: ''
    },
    onSubmit: handleSubmit
  });

  const outputData = tokens.map((token, index) => {
    const formikId = isEqual(FIRST_INDEX, index) ? V3RemoveTokenInput.tokenXOutput : V3RemoveTokenInput.tokenYOutput;

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

  const percantageInputData = {
    id: 'v3-lp-input',
    value: formik.values[V3RemoveTokenInput.percantageInput],
    error: formik.errors[V3RemoveTokenInput.percantageInput],
    balance: PERCENTAGE_100,
    label: t('common|Amount'),
    tokens: [tokenX, tokenY],
    hiddenBalance: true,
    onInputChange: handleInputChange()
  };

  const disabled = formik.isSubmitting;

  return {
    percantageInputData,
    data: outputData,
    disabled,
    isSubmitting: formik.isSubmitting,
    onSubmit: formik.handleSubmit
  };
};
