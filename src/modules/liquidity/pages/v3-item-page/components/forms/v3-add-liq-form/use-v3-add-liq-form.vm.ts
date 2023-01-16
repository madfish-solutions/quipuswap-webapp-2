import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { OPPOSITE_INDEX, ZERO_AMOUNT } from '@config/constants';
import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionStore,
  useGetLiquidityV3Position
} from '@modules/liquidity/hooks';
import { numberAsString, isNull, isExist } from '@shared/helpers';
import { useTokensBalancesOnly } from '@shared/hooks';
import { useTranslation } from '@translation';

import { findUserPosition } from '../../../helpers';
import { usePositionsWithStats } from '../../../hooks';
import { getCountOfTokens, getCurrentFormikKeyAdd, getValuesCorrectOrder } from '../helpers';
import { useCalculateValue, usePositionTicks } from '../hooks';
import { useCurrentTick } from '../hooks/use-current-tick';
import { useV3AddLiquidity } from '../hooks/use-v3-add-liquidity';
import { V3AddFormValues, V3AddTokenInput } from '../interface';
import { useV3AddLiqFormValidation } from './use-v3-add-liq-form.validation';

export const useV3AddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { lowerTick, upperTick } = usePositionTicks();
  const currentTick = useCurrentTick();
  const currentPrice = useLiquidityV3CurrentPrice();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const { calculateValue } = useCalculateValue();
  const { addLiquidity } = useV3AddLiquidity();
  const { delayedGetLiquidityV3Position } = useGetLiquidityV3Position();

  const position = findUserPosition(positionsWithStats, positionId);

  const minPrice = position?.stats.minRange;
  const maxPrice = position?.stats.maxRange;

  const tokens = getCountOfTokens(currentPrice, minPrice, maxPrice, [tokenX, tokenY]);
  const userBalances = useTokensBalancesOnly(tokens.filter(isExist));

  const initialValues: Record<string, string> = {
    [V3AddTokenInput.firstTokenInput]: '',
    [V3AddTokenInput.secondTokenInput]: ''
  };

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<V3AddFormValues>) => {
    actions.setSubmitting(true);
    const valuesCorrectOrder = getValuesCorrectOrder(values, tokens, tokenX);

    await addLiquidity(valuesCorrectOrder);
    await delayedGetLiquidityV3Position();

    actions.setSubmitting(false);
    actions.resetForm();
  };

  const validationSchema = useV3AddLiqFormValidation(userBalances, tokens);

  const handleInputChange = (index: number) => {
    return (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, tokens[index]?.metadata.decimals ?? ZERO_AMOUNT);

      if (isNull(currentTick) || isNull(upperTick) || isNull(lowerTick)) {
        return;
      }

      const localInput = getCurrentFormikKeyAdd(index);
      const notLocInput = getCurrentFormikKeyAdd(index, OPPOSITE_INDEX);

      const calculatedValue = calculateValue(localInput, inputAmount, tokens);

      formik.setValues({
        [localInput]: realValue,
        [notLocInput]: calculatedValue
      });
    };
  };

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  const data = tokens.map((token, index) => {
    const formikKey = getCurrentFormikKeyAdd(index);

    return {
      id: `v3-add-liq-form-${index}`,
      value: formik.values[formikKey],
      error: formik.errors[formikKey],
      balance: userBalances[index],
      label: t('common|Input'),
      tokens: token,
      onInputChange: handleInputChange(index)
    };
  });

  const disabled = formik.isSubmitting;

  return {
    data,
    isSubmitting: formik.isSubmitting,
    disabled,
    onSubmit: formik.handleSubmit
  };
};
