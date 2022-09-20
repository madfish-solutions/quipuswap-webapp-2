import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { FISRT_INDEX } from '@config/constants';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useRemoveLiquidity } from '@modules/new-liquidity/hooks/blockchain';
import { getInputsAmountFormFormikValues, isEqual } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { useTranslation } from '@translation';

import { getUserBalances, getFormikInitialValues } from '../helpers';
import { MOCK_ITEM } from '../helpers/mock-item';
import { LP_TOKEN } from '../helpers/mock-lp-token';
import { useCalculateValues } from '../hooks';
import { Input, NewLiquidityFormValues } from '../interface';
import { useDexTwoRemoveLiqValidation } from './use-dex-two-remove-liq-form-validation';

export const useDexTwoRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { removeLiquidity } = useRemoveLiquidity();
  const newLiquidityItemStore = useNewLiquidityItemStore();
  const item = newLiquidityItemStore.item ?? MOCK_ITEM; // TODO: fix MOCK, when store will be ready
  const { handleInputChange, handleLpInputChange } = useCalculateValues();

  const userBalances = getUserBalances(item.tokensInfo);

  const lpTokenBalance = useTokenBalance(LP_TOKEN) ?? null;

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<NewLiquidityFormValues>) => {
    actions.setSubmitting(true);

    const inputAmounts = getInputsAmountFormFormikValues(values);

    await removeLiquidity(inputAmounts);

    actions.resetForm();
    actions.setSubmitting(false);
  };

  const validationSchema = useDexTwoRemoveLiqValidation(userBalances, item, LP_TOKEN);

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
    tokens: LP_TOKEN,
    balance: lpTokenBalance,
    onInputChange: handleLpInputChange(item, formik)
  };

  const data = item.tokensInfo.map((_, index) => {
    const inputSlug = isEqual(index, FISRT_INDEX) ? Input.FIRST_LIQ_INPUT : Input.SECOND_LIQ_INPUT;
    const value = formik.values[inputSlug];
    const error = formik.errors[inputSlug];
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
      onInputChange: handleInputChange(index, item, formik)
    };
  });

  return { data, onSubmit: formik.handleSubmit, lpData };
};
