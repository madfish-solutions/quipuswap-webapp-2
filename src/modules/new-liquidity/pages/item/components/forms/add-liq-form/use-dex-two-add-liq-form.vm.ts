import { BigNumber } from 'bignumber.js';
import { FormikErrors, FormikHelpers, FormikValues, useFormik } from 'formik';

import { TEZOS_TOKEN } from '@config/tokens';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useAddLiquidity } from '@modules/new-liquidity/hooks/blockchain';
import {
  calculateOutputWithToken,
  extractTokens,
  getInputsAmountFormFormikValues,
  isNull,
  isTezosToken,
  numberAsString,
  saveBigNumber,
  toAtomic,
  toFixed,
  toReal
} from '@shared/helpers';
import { WhitelistedBaker } from '@shared/types';
import { useTranslation } from '@translation';

import { getInputSlugByIndexAdd, getUserBalances } from '../helpers/forms.helpers';
import { MOCK_ITEM } from '../helpers/mock-item';
import { Input, NewLiquidityAddFormValues } from './dex-two-add-liq-form.interface';
import { useDexTwoAddLiqValidation } from './use-dex-two-add-liq-form-validation';

export const useDexTwoAddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const newLiquidityItemStore = useNewLiquidityItemStore();
  const item = newLiquidityItemStore.item ?? MOCK_ITEM;
  const { addLiquidity } = useAddLiquidity();

  const tokensInfo = item.tokensInfo.map(tokenInfo =>
    isTezosToken(tokenInfo.token) ? { ...tokenInfo, token: TEZOS_TOKEN } : tokenInfo
  );

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<NewLiquidityAddFormValues>) => {
    actions.setSubmitting(true);

    const candidate = values[Input.BAKER_INPUT];
    const inputAmounts = getInputsAmountFormFormikValues(values);

    await addLiquidity(inputAmounts, candidate);

    actions.resetForm();
    actions.setSubmitting(false);
  };

  const userBalances = getUserBalances(tokensInfo);

  const shouldShowBakerInput = tokensInfo.some(({ token }) => isTezosToken(token));

  const validationSchema = useDexTwoAddLiqValidation(userBalances, item, shouldShowBakerInput);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [Input.FIRST_ADD_LIQ_INPUT]: '',
      [Input.SECOND_ADD_LIQ_INPUT]: '',
      [Input.BAKER_INPUT]: ''
    },
    onSubmit: handleSubmit
  });

  const calculateShares = (
    inputAmount: Nullable<BigNumber>,
    reserve: BigNumber,
    totalLpSupply: BigNumber,
    tokenDec: number
  ): Nullable<BigNumber> =>
    isNull(inputAmount) ? null : toAtomic(inputAmount, tokenDec).multipliedBy(totalLpSupply).dividedBy(reserve);

  const formikValues = formik.values;

  const handleInputChange = (reserves: BigNumber, index: number) => {
    const localToken = extractTokens(tokensInfo)[index];
    const localTokenDecimals = localToken.metadata.decimals;
    const notLocalTokenDecimals = extractTokens(tokensInfo)[Math.abs(index - 1)].metadata.decimals;

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, localTokenDecimals);
      const inputAmountBN = saveBigNumber(fixedValue, null);

      (formikValues as FormikValues)[getInputSlugByIndexAdd(index)] = realValue;
      const shares = calculateShares(inputAmountBN, reserves, item.totalSupply, localTokenDecimals);

      const calculatedValues = item.tokensInfo.map(({ atomicTokenTvl, token }, indexOfCalculatedInput) => {
        if (index === indexOfCalculatedInput) {
          return inputAmountBN;
        }

        return calculateOutputWithToken(shares, item.totalSupply, atomicTokenTvl, token);
      });

      calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
        if (indexOfCalculatedInput !== index && calculatedValue) {
          (formikValues as FormikValues)[getInputSlugByIndexAdd(indexOfCalculatedInput)] = toFixed(
            toReal(calculatedValue, notLocalTokenDecimals).decimalPlaces(notLocalTokenDecimals)
          );
        }
      });

      formik.setValues(formikValues);
    };
  };

  const onBakerChange = (baker: WhitelistedBaker) => {
    formik.setFieldValue(Input.BAKER_INPUT, baker.address);
  };

  const data = tokensInfo.map(({ atomicTokenTvl }, index) => {
    const inputSlug = getInputSlugByIndexAdd(index);
    const value = (formik.values as FormikValues)[inputSlug];
    const error = (formik.errors as FormikErrors<FormikValues>)[inputSlug] as string;
    const token = tokensInfo[index].token;
    const decimals = token.metadata.decimals;

    return {
      value,
      error,
      index,
      decimals: decimals,
      tokens: token,
      label: t('common|Input'),
      balance: userBalances[index],
      onInputChange: handleInputChange(atomicTokenTvl, index)
    };
  });

  const bakerData = {
    value: (formik.values as FormikValues)[Input.BAKER_INPUT],
    error: (formik.errors as FormikErrors<FormikValues>)[Input.BAKER_INPUT] as string,
    handleChange: onBakerChange,
    shouldShowBakerInput
  };

  return { data, onSubmit: formik.handleSubmit, bakerData };
};
