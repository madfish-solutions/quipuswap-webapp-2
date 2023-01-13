import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { FIRST_INDEX, PERCENTAGE_100, PERCENT_100, SLASH, PERCENT } from '@config/constants';
import {
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore,
  useLiquidityV3PositionStore
} from '@modules/liquidity/hooks';
import { useGetLiquidityV3Position } from '@modules/liquidity/hooks/loaders/use-get-liquidity-v3-position';
import { LiquidityRoutes } from '@modules/liquidity/liquidity-routes.enum';
import { setCaretPosition } from '@modules/stableswap/stableswap-liquidity/pages/create/components/create-form/positions.helper';
import { isEmptyString, isEqual, isNull, numberAsString } from '@shared/helpers';
import { useTranslation } from '@translation';

import { findUserPosition } from '../../../helpers';
import { usePositionsWithStats } from '../../../hooks';
import {
  calculateOutput,
  isOneOfTheOutputNotZero,
  preventRedundantRecalculation,
  removePercentFromInputValue
} from '../helpers';
import { useV3RemoveLiquidity } from '../hooks';
import { V3RemoveFormValues, V3RemoveTokenInput } from '../interface';
import { useV3RemoveLiqFormValidation } from './use-v3-remove-liq-form.validation';

const PERCENTAGE_INPUT_DECIMALS = 2;

export const useV3RemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const { removeLiquidity } = useV3RemoveLiquidity();
  const { delayedGetLiquidityV3Position } = useGetLiquidityV3Position();
  const poolStore = useLiquidityV3PoolStore();
  const navigate = useNavigate();

  const item = poolStore.item;
  const backHref = `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}${SLASH}${poolStore.poolId}`;

  const tokens = [tokenX, tokenY];
  const userPosition = findUserPosition(positionsWithStats, positionId);

  const handleSubmit = async (values: FormikValues, actions: FormikHelpers<V3RemoveFormValues>) => {
    const isAddLiqPossible = isOneOfTheOutputNotZero(values);

    if (!isAddLiqPossible) {
      return;
    }

    actions.setSubmitting(true);

    await removeLiquidity(values);

    if (isEqual(Number(values[V3RemoveTokenInput.percantageInput]), PERCENT_100)) {
      navigate(backHref);
    }

    await delayedGetLiquidityV3Position();

    actions.setSubmitting(false);
    actions.resetForm();
  };

  const handleInputChange = () => {
    return (inputAmount: string) => {
      const { realValue } = numberAsString(removePercentFromInputValue(inputAmount), PERCENTAGE_INPUT_DECIMALS);
      if (isNull(item) || isNull(userPosition) || isNull(tokenX) || isNull(tokenY)) {
        return;
      }
      const _inputAmount = preventRedundantRecalculation(realValue);

      const input = document.getElementById('v3-lp-input');
      setCaretPosition(input as HTMLInputElement);

      const { tokenXDeposit, tokenYDeposit } = calculateOutput(
        _inputAmount,
        userPosition,
        item.storage,
        tokenX,
        tokenY
      );

      formik.setValues({
        [V3RemoveTokenInput.percantageInput]: realValue,
        [V3RemoveTokenInput.tokenXOutput]: tokenXDeposit,
        [V3RemoveTokenInput.tokenYOutput]: tokenYDeposit
      });
    };
  };

  const validationSchema = useV3RemoveLiqFormValidation();

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [V3RemoveTokenInput.percantageInput]: '',
      [V3RemoveTokenInput.tokenXOutput]: '',
      [V3RemoveTokenInput.tokenYOutput]: ''
    },
    onSubmit: handleSubmit
  });

  const outputData = tokens.map((token, index) => {
    const formikId = isEqual(FIRST_INDEX, index) ? V3RemoveTokenInput.tokenXOutput : V3RemoveTokenInput.tokenYOutput;

    return {
      id: `v3-output-${index}`,
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

  const percantageInputData = {
    id: 'v3-lp-input',
    value: isEmptyString(formik.values[V3RemoveTokenInput.percantageInput])
      ? formik.values[V3RemoveTokenInput.percantageInput]
      : `${formik.values[V3RemoveTokenInput.percantageInput]}${PERCENT}`,
    error: formik.errors[V3RemoveTokenInput.percantageInput],
    balance: PERCENTAGE_100,
    decimals: PERCENTAGE_INPUT_DECIMALS,
    label: t('common|Amount'),
    tokens: [tokenX, tokenY],
    hiddenBalance: true,
    onInputChange: handleInputChange()
  };

  const disabled = formik.isSubmitting;

  return {
    percantageInputData,
    data: outputData,
    disabled,
    isSubmitting: formik.isSubmitting,
    onSubmit: formik.handleSubmit
  };
};
