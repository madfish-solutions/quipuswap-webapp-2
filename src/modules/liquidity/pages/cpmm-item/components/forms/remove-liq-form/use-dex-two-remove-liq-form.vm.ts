import { useMemo } from 'react';

import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { FIRST_INDEX } from '@config/constants';
import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { useGetLiquidityItem, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useRemoveLiquidity } from '@modules/liquidity/hooks/blockchain';
import { isEqual, toReal } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { Standard } from '@shared/types';
import { useTranslation } from '@translation';

import { useDexTwoRemoveLiqValidation } from './use-dex-two-remove-liq-form-validation';
import { getUserBalances, getFormikInitialValues, getInputsAmountFormFormikValues } from '../helpers';
import { MOCK_ITEM } from '../helpers/mock-item';
import { useCalculateValues } from '../hooks';
import { Input, LiquidityFormValues } from '../interface';

const LP_INDEX = 2;

export const useDexTwoRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { removeLiquidity } = useRemoveLiquidity();
  const liquidityItemStore = useLiquidityItemStore();
  const item = liquidityItemStore.item ?? MOCK_ITEM; // TODO: fix MOCK, when store will be ready
  const { handleInputChange, handleLpInputChange } = useCalculateValues();
  const { delayedGetLiquidityItem } = useGetLiquidityItem();

  const lpToken = useMemo(
    () => ({
      type: Standard.Fa2,
      contractAddress: DEX_TWO_CONTRACT_ADDRESS,
      fa2TokenId: item.id.toNumber(),
      isWhitelisted: true,
      metadata: {
        name: 'Quipuswap LP Token',
        symbol: 'QPT',
        decimals: 6,
        description: 'Quipuswap LP token represents user share in the liquidity pool',
        thumbnailUri: 'https://quipuswap.com/QPLP.png',
        shouldPreferSymbol: 'true'
      }
    }),
    [item.id]
  );

  const userBalances = getUserBalances(item.tokensInfo);

  const lpTokenBalance = useTokenBalance(lpToken) ?? null;

  const lockeds = item.tokensInfo.map(tokenInfo => toReal(tokenInfo.atomicTokenTvl, tokenInfo.token));

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<LiquidityFormValues>) => {
    actions.setSubmitting(true);

    const inputAmounts = getInputsAmountFormFormikValues(values);
    const shares = inputAmounts[LP_INDEX];
    inputAmounts.pop();

    await removeLiquidity(inputAmounts, shares);

    actions.resetForm();
    actions.setSubmitting(false);

    await delayedGetLiquidityItem();
  };

  const validationSchema = useDexTwoRemoveLiqValidation(lockeds, item, lpToken, lpTokenBalance);

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValues(),
    onSubmit: handleSubmit
  });

  const lpData = {
    disabled: false,
    value: formik.values[Input.THIRD_INPUT],
    error: formik.errors[Input.THIRD_INPUT],
    label: t('common|Input'),
    tokens: lpToken,
    balance: lpTokenBalance,
    onInputChange: handleLpInputChange(item, formik)
  };

  const data = item.tokensInfo.map((_, index) => {
    const inputSlug = isEqual(index, FIRST_INDEX) ? Input.FIRST_LIQ_INPUT : Input.SECOND_LIQ_INPUT;
    const value = formik.values[inputSlug];
    const error = formik.errors[inputSlug];
    const token = item.tokensInfo[index].token;
    const decimals = token.metadata.decimals;
    const id = 'remove-liq-input';

    return {
      id,
      value,
      error,
      index,
      decimals,
      tokens: token,
      label: t('common|Input'),
      hiddenPercentSelector: true,
      balance: userBalances[index],
      onInputChange: handleInputChange(index, item, formik)
    };
  });

  return { data, onSubmit: formik.handleSubmit, lpData };
};
