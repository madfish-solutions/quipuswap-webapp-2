import { BigNumber } from 'bignumber.js';
import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { DEX_TWO_DEFAULT_BAKER_ADDRESS, FISRT_INDEX, OPPOSITE_INDEX } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { useGetLiquidityItem, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useAddLiquidity, useCreateLiquidityPool } from '@modules/liquidity/hooks/blockchain';
import { useBakers } from '@providers/dapp-bakers';
import {
  calculateOutputWithToken,
  calculateShares,
  defined,
  getInputsAmountFormFormikValues,
  getLastElementFromArray,
  isEqual,
  isTezosToken,
  numberAsString,
  saveBigNumber,
  toAtomic,
  toAtomicIfPossible,
  toFixed,
  toRealIfPossible
} from '@shared/helpers';
import { WhitelistedBaker } from '@shared/types';
import { useTranslation } from '@translation';

import { getTokenAndFieldData, getFormikInitialValues, getUserBalances, getEverstakeBaker } from '../helpers';
import { Input, LiquidityFormValues } from '../interface';
import { useDexTwoAddLiqValidation } from './use-dex-two-add-liq-form-validation';

export const useDexTwoAddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const liquidityItemStore = useLiquidityItemStore();
  const item = defined(liquidityItemStore.item, 'liquidityItemStore.item');
  const { addLiquidity } = useAddLiquidity();
  const { createNewLiquidityPool } = useCreateLiquidityPool();
  const poolIsEmpty = item.totalSupply.isZero();
  const { delayedGetLiquidityItem } = useGetLiquidityItem();
  const { data: bakers } = useBakers();

  const tokensInfo = item.tokensInfo.map(tokenInfo =>
    isTezosToken(tokenInfo.token) ? { ...tokenInfo, token: TEZOS_TOKEN } : tokenInfo
  );
  const shouldShowBakerInput = tokensInfo.some(({ token }) => isTezosToken(token));

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<LiquidityFormValues>) => {
    actions.setSubmitting(true);

    const candidate = values[Input.THIRD_INPUT];
    // TODO: https://madfish.atlassian.net/browse/QUIPU-571
    const inputAmounts = getInputsAmountFormFormikValues(values, ([aKey], [bKey]) => {
      const aValue = Number(getLastElementFromArray(aKey.split('-')));
      const bValue = Number(getLastElementFromArray(bKey.split('-')));

      return aValue - bValue;
    });

    if (poolIsEmpty) {
      await createNewLiquidityPool(
        tokensInfo.map((tokenInfo, index) => {
          const token = tokenInfo.token;

          return { amount: toAtomic(inputAmounts[index], token), token };
        }),
        shouldShowBakerInput ? candidate : DEX_TWO_DEFAULT_BAKER_ADDRESS
      );
    } else {
      await addLiquidity(inputAmounts, candidate);
    }

    actions.resetForm();
    actions.setSubmitting(false);

    await delayedGetLiquidityItem();
  };

  const userBalances = getUserBalances(tokensInfo);

  const validationSchema = useDexTwoAddLiqValidation(userBalances, item, shouldShowBakerInput);

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValues(),
    onSubmit: handleSubmit
  });

  const handleInputChange = (index: number) => {
    const notLocalTokenIndex = Math.abs(index - OPPOSITE_INDEX);

    const {
      decimals: locDecimals,
      atomicTokenTvl: locAtomicTokenTvl,
      inputField: locInputField
    } = getTokenAndFieldData(item.tokensInfo, index);

    const {
      token: notLocToken,
      decimals: notLocDecimals,
      atomicTokenTvl: notLocAtomicTokenTvl,
      inputField: notLocInputField
    } = getTokenAndFieldData(item.tokensInfo, notLocalTokenIndex);

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, locDecimals);
      const atomicInputAmountBN = toAtomicIfPossible(saveBigNumber(fixedValue, null), locDecimals);

      if (poolIsEmpty) {
        formik.setFieldValue(locInputField, realValue);
      } else {
        const shares = calculateShares(atomicInputAmountBN, locAtomicTokenTvl, item.totalSupply);

        const notLocalInputValue = calculateOutputWithToken(
          shares,
          item.totalSupply,
          notLocAtomicTokenTvl,
          notLocToken
        );
        const realNotLocalInputValue = toRealIfPossible(notLocalInputValue, notLocDecimals);

        formik.setValues({
          [locInputField]: realValue,
          [notLocInputField]: toFixed(realNotLocalInputValue?.decimalPlaces(notLocDecimals, BigNumber.ROUND_DOWN))
        });
      }
    };
  };

  const onBakerChange = (baker: WhitelistedBaker) => {
    formik.setFieldValue(Input.THIRD_INPUT, baker.address);
  };

  const data = tokensInfo.map((_, index) => {
    const inputSlug = isEqual(index, FISRT_INDEX) ? Input.FIRST_LIQ_INPUT : Input.SECOND_LIQ_INPUT;
    const value = formik.values[inputSlug];
    const error = formik.errors[inputSlug];
    const token = tokensInfo[index].token;
    const decimals = token.metadata.decimals;
    const id = 'add-liq-input';

    return {
      id,
      value,
      error,
      index,
      decimals,
      tokens: token,
      label: t('common|Input'),
      balance: userBalances[index],
      hiddenPercentage: true,
      onInputChange: handleInputChange(index)
    };
  });

  const bakerData = {
    value: formik.values[Input.THIRD_INPUT],
    error: formik.errors[Input.THIRD_INPUT],
    handleChange: onBakerChange,
    shouldShowBakerInput,
    defaultBaker: getEverstakeBaker(bakers)
  };
  const warningMessage = poolIsEmpty ? t('liquidity|emptyPoolWarning') : null;

  return {
    data,
    onSubmit: formik.handleSubmit,
    bakerData,
    isSubmitting: formik.isSubmitting,
    setSubmitting: formik.setSubmitting,
    warningMessage
  };
};
