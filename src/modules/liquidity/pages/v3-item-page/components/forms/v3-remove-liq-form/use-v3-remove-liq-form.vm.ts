import BigNumber from 'bignumber.js';
import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { FIRST_INDEX, PERCENT_100, ZERO_AMOUNT } from '@config/constants';
import {
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore,
  useLiquidityV3PositionStore
} from '@modules/liquidity/hooks';
import { isEqual, isNull, numberAsString, toFixed, toReal } from '@shared/helpers';
import { useTranslation } from '@translation';

import { calculateDeposit, findUserPosition } from '../../../helpers';
import { usePositionsWithStats } from '../../../hooks';
import { V3RemoveFormValues, V3RemoveTokenInput } from '../interface';
import { useV3RemoveLiqFormValidation } from './use-v3-remove-liq-form.validation';

/* eslint-disable no-console */
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
    if (Object.values(values).some(value => new BigNumber(value).isGreaterThan(ZERO_AMOUNT))) {
      actions.setSubmitting(true);
      console.log(values, actions);
      actions.setSubmitting(false);
    }
  };

  const validationSchema = useV3RemoveLiqFormValidation();

  const handleInputChange = () => {
    return (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, 0);
      if (isNull(item) || isNull(userPosition) || isNull(tokenX) || isNull(tokenY) || Number(inputAmount) >= 1000) {
        return;
      }

      const { x: tokenXAtomicDeposit, y: tokenYAtomicDeposit } = calculateDeposit(userPosition, item.storage);

      const realTokenXAtomicDeposit = toReal(tokenXAtomicDeposit, tokenX.metadata.decimals).decimalPlaces(
        tokenX.metadata.decimals,
        BigNumber.ROUND_DOWN
      );

      const realTokenYAtomicDeposit = toReal(tokenYAtomicDeposit, tokenY.metadata.decimals).decimalPlaces(
        tokenY.metadata.decimals,
        BigNumber.ROUND_DOWN
      );

      const calculatedTokenXDeposit = toFixed(
        realTokenXAtomicDeposit.dividedBy(PERCENT_100).multipliedBy(new BigNumber(inputAmount))
      );
      const calculatedTokenYDeposit = toFixed(
        realTokenYAtomicDeposit.dividedBy(PERCENT_100).multipliedBy(new BigNumber(inputAmount))
      );

      formik.setValues({
        [V3RemoveTokenInput.firstTokenInput]: realValue,
        [V3RemoveTokenInput.secondTokenInput]: calculatedTokenXDeposit,
        [V3RemoveTokenInput.thirdTokenInput]: calculatedTokenYDeposit
      });
    };
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [V3RemoveTokenInput.firstTokenInput]: '',
      [V3RemoveTokenInput.secondTokenInput]: '',
      [V3RemoveTokenInput.thirdTokenInput]: ''
    },
    onSubmit: handleSubmit
  });

  const outputData = tokens.map((token, index) => {
    const formikId = isEqual(FIRST_INDEX, index)
      ? V3RemoveTokenInput.secondTokenInput
      : V3RemoveTokenInput.thirdTokenInput;

    return {
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

  return {
    lpData: {
      value: formik.values[V3RemoveTokenInput.firstTokenInput],
      error: formik.errors[V3RemoveTokenInput.firstTokenInput],
      label: t('common|Amount'),
      tokens: [tokenX, tokenY],
      hiddenBalance: true,
      onInputChange: handleInputChange()
    },
    data: outputData,
    onSubmit: formik.handleSubmit
  };
};
