import BigNumber from 'bignumber.js';
import { FormikErrors, FormikHelpers, FormikValues, useFormik } from 'formik';

import { calculateOutputWithLp } from '@modules/new-liquidity/helpers/calculate-output-with-lp';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useRemoveLiquidity } from '@modules/new-liquidity/hooks/blockchain';
import {
  calculateOutputWithToken,
  extractTokens,
  getInputsAmountFormFormikValues,
  isNull,
  numberAsString,
  saveBigNumber,
  toAtomic,
  toFixed,
  toReal
} from '@shared/helpers';
// import { useTokenBalance } from '@shared/hooks';
import { useTokenBalance } from '@shared/hooks';
import { useTranslation } from '@translation';

import { getInputSlugByIndexRemove, getUserBalances } from '../helpers/forms.helpers';
import { LP_TOKEN } from '../helpers/mock-lp-token';
import { Input, NewLiquidityRemoveFormValues } from './dex-two-remove-liq-form.interface';
import { useDexTwoRemoveLiqValidation } from './use-dex-two-remove-liq-form-validation';

export const useDexTwoRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { removeLiquidity } = useRemoveLiquidity();
  const { item } = useNewLiquidityItemStore();

  const userBalances = getUserBalances(item!.tokensInfo);

  const lpTokenBalance = useTokenBalance(LP_TOKEN) ?? null;
  const lpTokenMetadata = LP_TOKEN.metadata;

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<NewLiquidityRemoveFormValues>) => {
    actions.setSubmitting(true);

    const inputAmounts = getInputsAmountFormFormikValues(values);

    await removeLiquidity(inputAmounts, lpTokenBalance);

    actions.resetForm();
    actions.setSubmitting(false);
  };

  const validationSchema = useDexTwoRemoveLiqValidation(userBalances, item!, lpTokenBalance!, lpTokenMetadata);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLpInputChange = (): any => {
    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, LP_TOKEN.metadata.decimals);

      (formikValues as FormikValues)[Input.LP_INPUT] = realValue;

      const inputAmountBN = saveBigNumber(fixedValue, new BigNumber('0'));
      const atomicInputAmout = toAtomic(inputAmountBN, LP_TOKEN);
      const tokenOutputs = calculateOutputWithLp(atomicInputAmout, item!.totalSupply, item!.tokensInfo);

      // eslint-disable-next-line no-console
      console.log(tokenOutputs);

      tokenOutputs.forEach((to, indexOfTokenInput) => {
        (formikValues as FormikValues)[getInputSlugByIndexRemove(indexOfTokenInput)] = toFixed(
          toReal(to!.output, to?.decimals)
        );
      });

      formik.setValues(formikValues);
    };
  };

  const calculateShares = (
    inputAmount: Nullable<BigNumber>,
    tokenDec: number,
    reserve: BigNumber,
    totalLpSupply: BigNumber
  ): Nullable<BigNumber> =>
    isNull(inputAmount) ? null : toAtomic(inputAmount, tokenDec).multipliedBy(totalLpSupply).dividedBy(reserve);

  const handleInputChange = (reserves: BigNumber, index: number) => {
    const localToken = extractTokens(item!.tokensInfo)[index];
    const localTokenDecimals = localToken.metadata.decimals;

    // return async (inputAmount: string) => {
    //   const { realValue } = numberAsString(inputAmount, localTokenDecimals);
    //   const formikKey = getInputSlugByIndexRemove(index);

    //   formik.setFieldValue(formikKey, realValue);
    // };

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, localTokenDecimals);
      const inputAmountBN = saveBigNumber(fixedValue, null);

      (formikValues as FormikValues)[getInputSlugByIndexRemove(index)] = realValue;
      const lpValue = calculateShares(inputAmountBN, localTokenDecimals, reserves, item!.totalSupply)?.decimalPlaces(
        LP_TOKEN.metadata.decimals
      );

      formikValues[Input.LP_INPUT] = toFixed(toReal(lpValue!, LP_TOKEN));

      const calculatedValues = item!.tokensInfo.map(({ atomicTokenTvl, token }, indexOfCalculatedInput) => {
        if (index === indexOfCalculatedInput) {
          return inputAmountBN;
        }

        return calculateOutputWithToken(lpValue, item!.totalSupply, atomicTokenTvl, token);
      });

      // eslint-disable-next-line no-console
      console.log(calculatedValues.map(item1 => item1?.toNumber()));

      calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
        if (indexOfCalculatedInput !== index && calculatedValue) {
          (formikValues as FormikValues)[getInputSlugByIndexRemove(indexOfCalculatedInput)] = toFixed(calculatedValue);
        }
      });

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

  const data = item!.tokensInfo.map((_, index) => {
    const inputSlug = getInputSlugByIndexRemove(index);
    const value = (formik.values as FormikValues)[inputSlug];
    const error = (formik.errors as FormikErrors<FormikValues>)[inputSlug] as string;
    const token = item!.tokensInfo[index].token;

    return {
      value,
      error,
      index,
      decimals: token.metadata.decimals,
      tokens: token,
      label: t('common|Output'),
      balance: userBalances[index],
      hiddenPercentSelector: true,
      onInputChange: handleInputChange(item!.tokensInfo[index].atomicTokenTvl, index)
    };
  });

  return { data, onSubmit: formik.handleSubmit, lpData };
};
