import BigNumber from 'bignumber.js';
import { FormikErrors, FormikHelpers, FormikValues, useFormik } from 'formik';

import { OPPOSITE_INDEX } from '@config/constants';
import { calculateOutputWithLp } from '@modules/new-liquidity/helpers/calculate-output-with-lp';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useRemoveLiquidity } from '@modules/new-liquidity/hooks/blockchain';
import {
  calculateOutputWithToken,
  calculateShares,
  getInputsAmountFormFormikValues,
  numberAsString,
  saveBigNumber,
  toAtomicIfPossible,
  toFixed,
  toRealIfPossible
} from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { useTranslation } from '@translation';

import { getTokenData } from '../helpers';
import { getInputSlugByIndexRemove, getUserBalances } from '../helpers/forms.helpers';
import { MOCK_ITEM } from '../helpers/mock-item';
import { LP_TOKEN } from '../helpers/mock-lp-token';
import { Input, NewLiquidityRemoveFormValues } from './dex-two-remove-liq-form.interface';
import { useDexTwoRemoveLiqValidation } from './use-dex-two-remove-liq-form-validation';

export const useDexTwoRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { removeLiquidity } = useRemoveLiquidity();
  const newLiquidityItemStore = useNewLiquidityItemStore();
  const item = newLiquidityItemStore.item ?? MOCK_ITEM; // TODO: fix MOCK, when store will be ready

  const userBalances = getUserBalances(item.tokensInfo);

  const lpTokenBalance = useTokenBalance(LP_TOKEN) ?? null;

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<NewLiquidityRemoveFormValues>) => {
    actions.setSubmitting(true);

    const inputAmounts = getInputsAmountFormFormikValues(values);

    await removeLiquidity(inputAmounts);

    actions.resetForm();
    actions.setSubmitting(false);
  };

  const validationSchema = useDexTwoRemoveLiqValidation(userBalances, item, LP_TOKEN);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [Input.FIRST_ADD_LIQ_INPUT]: '',
      [Input.SECOND_ADD_LIQ_INPUT]: '',
      [Input.LP_INPUT]: ''
    },
    onSubmit: handleSubmit
  });

  const formikValues = formik.values;

  const handleLpInputChange = () => {
    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, LP_TOKEN.metadata.decimals);

      (formikValues as FormikValues)[Input.LP_INPUT] = realValue;

      const inputAmountBN = saveBigNumber(fixedValue, null);
      const atomicInputAmout = toAtomicIfPossible(inputAmountBN, LP_TOKEN);
      const tokenOutputs = calculateOutputWithLp(atomicInputAmout, item.totalSupply, item.tokensInfo);

      tokenOutputs.forEach((tokenOutput, indexOfTokenInput) => {
        (formikValues as FormikValues)[getInputSlugByIndexRemove(indexOfTokenInput)] = toFixed(
          toRealIfPossible(tokenOutput?.output, tokenOutput?.decimals)?.decimalPlaces(
            tokenOutput?.decimals ?? BigNumber.ROUND_DOWN
          )
        );
      });

      formik.setValues(formikValues);
    };
  };

  const handleInputChange = (index: number) => {
    const notLocalTokenIndex = Math.abs(index - OPPOSITE_INDEX);

    const { decimals: locDecimals, atomicTokenTvl: locAtomicTokenTvl } = getTokenData(item.tokensInfo, index);
    const {
      token: notLocToken,
      decimals: notLocDecimals,
      atomicTokenTvl: notLocAtomicTokenTvl
    } = getTokenData(item.tokensInfo, notLocalTokenIndex);

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, locDecimals);
      const atomicInputAmountBN = toAtomicIfPossible(saveBigNumber(fixedValue, null), locDecimals);

      const lpValue = calculateShares(atomicInputAmountBN, locAtomicTokenTvl, item.totalSupply);
      const realLpValue = toRealIfPossible(lpValue, LP_TOKEN.metadata.decimals);

      const notLocalInputValue = calculateOutputWithToken(lpValue, item.totalSupply, notLocAtomicTokenTvl, notLocToken);
      const realNotLocalInputValue = toRealIfPossible(notLocalInputValue, notLocDecimals);

      (formikValues as FormikValues)[getInputSlugByIndexRemove(index)] = realValue;

      formikValues[Input.LP_INPUT] = toFixed(realLpValue?.decimalPlaces(LP_TOKEN.metadata.decimals));

      (formikValues as FormikValues)[getInputSlugByIndexRemove(notLocalTokenIndex)] = toFixed(
        realNotLocalInputValue?.decimalPlaces(notLocDecimals, BigNumber.ROUND_DOWN)
      );

      formik.setValues(formikValues);
    };
  };

  const lpData = {
    disabled: false,
    value: (formik.values as FormikValues)[Input.LP_INPUT],
    error: (formik.errors as FormikErrors<FormikValues>)[Input.LP_INPUT] as string,
    label: t('common|Input'),
    tokens: LP_TOKEN,
    balance: lpTokenBalance,
    onInputChange: handleLpInputChange()
  };

  const data = item.tokensInfo.map((_, index) => {
    const inputSlug = getInputSlugByIndexRemove(index);
    const value = (formik.values as FormikValues)[inputSlug];
    const error = (formik.errors as FormikErrors<FormikValues>)[inputSlug] as string;
    const token = item.tokensInfo[index].token;
    const decimals = token.metadata.decimals;

    return {
      value,
      error,
      index,
      decimals,
      tokens: token,
      label: t('common|Input'),
      balance: userBalances[index],
      onInputChange: handleInputChange(index)
    };
  });

  return { data, onSubmit: formik.handleSubmit, lpData };
};
