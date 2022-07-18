/* eslint-disable no-console */
import { useCallback, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { CONTRACT_DECIMALS_PRECISION_POWER } from '@config/constants';
import { CreationParams } from '@modules/stableswap/api';
import { getTokenIdFromSlug, isEmptyArray, isExist, isTokenEqual, toDecimals } from '@shared/helpers';
import { useTokensBalancesOnly } from '@shared/hooks';
//TODO: fix circlar dependencies
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { Token } from '@shared/types';

import { useCreateStableswapPool, usePoolCreationPrice } from '../../../../../hooks';
import {
  MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
  MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
  TOKEN_KEY,
  AMPLIFICATION_FIELD_NAME,
  LIQUIDITY_PRODIFDERS_FEE_FIELD_NAME
} from './constants';
import {
  useFormikParams,
  useInputTokenParams,
  useLiquidityProvidersFeeInputParams,
  useRadioButtonParams,
  useHandleTokensCahange
} from './hooks';

export const useCreateFormViewModel = () => {
  const { creationPrice } = usePoolCreationPrice();
  const { chooseTokens } = useChooseTokens();
  const { createStableswapPool } = useCreateStableswapPool();
  const [tokens, setTokens] = useState<Nullable<Array<Token>>>(null);

  const balances = useTokensBalancesOnly(tokens);

  const handleSubmit = async <T extends Record<PropertyKey, string>>(values: T, actions: FormikHelpers<T>) => {
    if (isEmptyArray(tokens)) {
      return;
    }

    actions.setSubmitting(true);

    const valuesArray = Object.entries(values);

    const creationParams: Array<CreationParams> = valuesArray
      .map(([key, value]) => {
        const tokenId = getTokenIdFromSlug(key);
        const token = tokens?.find(token_ => isTokenEqual(token_, tokenId));
        if (token) {
          const { decimals } = token.metadata;

          return {
            reserves: toDecimals(new BigNumber(value), decimals),
            precisionMultiplierF: new BigNumber(10).pow(
              new BigNumber(CONTRACT_DECIMALS_PRECISION_POWER).minus(decimals)
            ),
            rateF: new BigNumber(10)
              .pow(new BigNumber(CONTRACT_DECIMALS_PRECISION_POWER).minus(decimals))
              .multipliedBy(CONTRACT_DECIMALS_PRECISION_POWER),
            token
          };
        }
      })
      .filter(isExist);

    await createStableswapPool({
      amplificationParameter: new BigNumber(values[AMPLIFICATION_FIELD_NAME]),
      fee: { liquidityProvidersFee: new BigNumber(values[LIQUIDITY_PRODIFDERS_FEE_FIELD_NAME]) },
      creationParams
    });

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const { validationSchema, initialValues } = useFormikParams(tokens, balances);

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  const { handleTokensChange } = useHandleTokensCahange(formik);

  const handleSelectTokensClick = useCallback(async () => {
    const chosenTokens = await chooseTokens({
      tokens,
      min: MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
      max: MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL
    });

    handleTokensChange(chosenTokens);

    setTokens(chosenTokens);
  }, [chooseTokens, tokens, handleTokensChange]);

  const { tokenInputsParams } = useInputTokenParams(tokens, balances, formik);
  const { liquidityProvidersFeeInputParams } = useLiquidityProvidersFeeInputParams(formik);
  const { radioButtonParams } = useRadioButtonParams(formik);

  return {
    liquidityProvidersFeeInputParams,
    tokenInputsParams,
    radioButtonParams,
    tokensInputValidationMessage: formik.errors[TOKEN_KEY] as string,
    creationPrice,

    handleSelectTokensClick,
    handleSubmit: formik.handleSubmit
  };
};
