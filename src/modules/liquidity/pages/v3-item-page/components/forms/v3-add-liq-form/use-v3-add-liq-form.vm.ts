// import BigNumber from 'bignumber.js';
import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { FIRST_INDEX } from '@config/constants';
import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { numberAsString, getUserBalances, isEqual } from '@shared/helpers';
import { useTranslation } from '@translation';

// import { useCalculateInputAmountValue, usePositionTicks } from '../hooks';
// import { useCurrentTick } from '../hooks/use-current-tick';
import { V3AddFormValues, V3AddTokenInput } from '../interface';
import { useV3AddLiqFormValidation } from './use-v3-add-liq-form.validation';

/* eslint-disable no-console */
export const useV3AddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  // const calculateInoutAmountValue = useCalculateInputAmountValue();
  // const { lowerTick, upperTick } = usePositionTicks();
  // const currentTick = useCurrentTick();

  const tokens = [tokenX, tokenY];
  const userBalances = getUserBalances(tokens);

  const handleSubmit = (values: FormikValues, actions: FormikHelpers<V3AddFormValues>) => {
    actions.setSubmitting(true);
    console.log(values, actions);
    actions.setSubmitting(false);
  };

  // currentTick: Tick,
  // upperTick: Tick,
  // lowerTick: Tick,
  // realInputAmount: BigNumber

  const validationSchema = useV3AddLiqFormValidation(userBalances, tokens);

  // TODO: Add calculations when it will be possible
  const handleInputChange = (index: number) => {
    return (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, tokens[index]?.metadata.decimals ?? 0);

      // if (isNull(currentTick) || isNull(upperTick) || isNull(lowerTick)) {
      //   return;
      // }

      // const formikId = isEqual(FIRST_INDEX, index) ? V3AddTokenInput.firstTokenInput : V3AddTokenInput.secondTokenInput;

      // const calculatedValue = calculateInoutAmountValue(
      //   formikId,
      //   currentTick,
      //   upperTick,
      //   lowerTick,
      //   new BigNumber(inputAmount)
      // );

      // console.log(calculatedValue);

      formik.setValues({
        [V3AddTokenInput.firstTokenInput]: realValue,
        [V3AddTokenInput.secondTokenInput]: realValue
      });
    };
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [V3AddTokenInput.firstTokenInput]: '',
      [V3AddTokenInput.secondTokenInput]: ''
    },
    onSubmit: handleSubmit
  });

  const data = tokens.map((token, index) => {
    const formikId = isEqual(FIRST_INDEX, index) ? V3AddTokenInput.firstTokenInput : V3AddTokenInput.secondTokenInput;

    return {
      value: formik.values[formikId],
      error: formik.errors[formikId],
      balance: userBalances[index],
      label: t('common|Input'),
      tokens: token,
      onInputChange: handleInputChange(index)
    };
  });

  return {
    data,
    onSubmit: formik.handleSubmit
  };
};
