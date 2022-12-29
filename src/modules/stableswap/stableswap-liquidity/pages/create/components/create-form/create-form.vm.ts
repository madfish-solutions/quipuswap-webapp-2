import { useCallback, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { TEZOS_TOKEN } from '@config/tokens';
import { CreationParams } from '@modules/stableswap/api';
import {
  getTokenIdFromSlug,
  isEmptyArray,
  isExist,
  isTokenEqual,
  prepareNumberAsString,
  sortTokens,
  stringToBigNumber,
  toAtomic,
  toFraction
} from '@shared/helpers';
import { useTokensBalancesOnly } from '@shared/hooks';
//TODO: fix circular dependencies
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { Nullable, Token } from '@shared/types';

import { useCreateStableswapPool, usePoolCreationPrice } from '../../../../../hooks';
import {
  AMPLIFICATION_FIELD_NAME,
  LIQUIDITY_PROVIDERS_FEE_FIELD_NAME,
  MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
  MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
  TOKEN_KEY
} from './constants';
import {
  useFormikParams,
  useHandleTokensChange,
  useInputTokenParams,
  useLiquidityProvidersFeeInputParams,
  useRadioButtonParams
} from './hooks';
import { getPrecisionMultiplier, getPrecisionRate } from './precision.helper';

export const useCreateFormViewModel = () => {
  const { creationPrice } = usePoolCreationPrice();
  const { chooseTokens } = useChooseTokens();
  const { createStableswapPool } = useCreateStableswapPool();
  const [tokens, setTokens] = useState<Nullable<Array<Token>>>(null);

  const balances = useTokensBalancesOnly(tokens);

  const handleSubmit = useCallback(
    async <T extends Record<PropertyKey, string>>(values: T, actions: FormikHelpers<T>) => {
      if (isEmptyArray(tokens)) {
        return;
      }

      actions.setSubmitting(true);

      const valuesArray = Object.entries(values);

      const creationParams: Array<CreationParams> = valuesArray
        .map(([key, value]) => ({ value, tokenId: getTokenIdFromSlug(key) }))
        .map(({ tokenId, value }) => ({ token: tokens?.find(token_ => isTokenEqual(token_, tokenId)), value }))
        .map(({ value, token }) => {
          if (!isExist(token)) {
            return null;
          }
          const { decimals } = token.metadata;

          return {
            reserves: toAtomic(stringToBigNumber(value), decimals),
            precisionMultiplierF: getPrecisionMultiplier(decimals),
            rateF: getPrecisionRate(decimals),
            token
          };
        })
        .filter(isExist)
        .sort((a, b) => sortTokens(a.token, b.token));

      try {
        await createStableswapPool({
          amplificationParameter: new BigNumber(values[AMPLIFICATION_FIELD_NAME]),
          fee: {
            liquidityProvidersFee: toFraction(prepareNumberAsString(values[LIQUIDITY_PROVIDERS_FEE_FIELD_NAME]))
          },
          creationParams,
          creationPrice
        });

        actions.resetForm();
        setTokens(null);
      } finally {
        actions.setSubmitting(false);
      }
    },
    [createStableswapPool, creationPrice, tokens]
  );

  const { validationSchema, initialValues } = useFormikParams(tokens, balances);

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  const { handleTokensChange } = useHandleTokensChange(formik);

  const handleSelectTokensClick = useCallback(async () => {
    const chosenTokens = await chooseTokens({
      tokens,
      disabledTokens: [TEZOS_TOKEN],
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
