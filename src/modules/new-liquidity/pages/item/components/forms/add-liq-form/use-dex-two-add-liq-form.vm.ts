import { BigNumber } from 'bignumber.js';
import { FormikErrors, FormikHelpers, FormikValues, useFormik } from 'formik';

import { OPPOSITE_INDEX } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useAddLiquidity } from '@modules/new-liquidity/hooks/blockchain';
import {
  calculateOutputWithToken,
  calculateShares,
  getInputsAmountFormFormikValues,
  isTezosToken,
  numberAsString,
  saveBigNumber,
  toAtomicIfPossible,
  toFixed,
  toRealIfPossible
} from '@shared/helpers';
import { WhitelistedBaker } from '@shared/types';
import { useTranslation } from '@translation';

import { getTokenData } from '../helpers';
import { getInputSlugByIndexAdd, getUserBalances } from '../helpers/forms.helpers';
import { MOCK_ITEM } from '../helpers/mock-item';
import { Input, NewLiquidityAddFormValues } from './dex-two-add-liq-form.interface';
import { useDexTwoAddLiqValidation } from './use-dex-two-add-liq-form-validation';

export const useDexTwoAddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const newLiquidityItemStore = useNewLiquidityItemStore();
  const item = newLiquidityItemStore.item ?? MOCK_ITEM; // TODO: fix MOCK, when store will be ready
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

  const formikValues = formik.values;

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

      const shares = calculateShares(atomicInputAmountBN, locAtomicTokenTvl, item.totalSupply);

      const notLocalInputValue = calculateOutputWithToken(shares, item.totalSupply, notLocAtomicTokenTvl, notLocToken);
      const realNotLocalInputValue = toRealIfPossible(notLocalInputValue, notLocDecimals);

      (formikValues as FormikValues)[getInputSlugByIndexAdd(index)] = realValue;

      (formikValues as FormikValues)[getInputSlugByIndexAdd(notLocalTokenIndex)] = toFixed(
        realNotLocalInputValue?.decimalPlaces(notLocDecimals, BigNumber.ROUND_DOWN)
      );

      formik.setValues(formikValues);
    };
  };

  const onBakerChange = (baker: WhitelistedBaker) => {
    formik.setFieldValue(Input.BAKER_INPUT, baker.address);
  };

  const data = tokensInfo.map((_, index) => {
    const inputSlug = getInputSlugByIndexAdd(index);
    const value = (formik.values as FormikValues)[inputSlug];
    const error = (formik.errors as FormikErrors<FormikValues>)[inputSlug] as string;
    const token = tokensInfo[index].token;
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

  const bakerData = {
    value: (formik.values as FormikValues)[Input.BAKER_INPUT],
    error: (formik.errors as FormikErrors<FormikValues>)[Input.BAKER_INPUT] as string,
    handleChange: onBakerChange,
    shouldShowBakerInput
  };

  return { data, onSubmit: formik.handleSubmit, bakerData };
};
