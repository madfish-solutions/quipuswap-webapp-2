import { useCallback, useState } from 'react';

import { FormikHelpers, isEmptyArray, useFormik } from 'formik';

import { getTokenSlug } from '@shared/helpers';
import { useTokensBalancesOnly } from '@shared/hooks';
//TODO: fix circlar dependencies
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { Token } from '@shared/types';

import {
  MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
  MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
  RADIO_BUTTON_NAME,
  LIQUIDITY_PRODIFDERS_FEE,
  creationCost,
  TOKEN_KEY
} from './constants';
import {
  useFormikParams,
  useInputTokenParams,
  useLiquidityProvidersFeeInputParams,
  useRadioButtonParams
} from './hooks';

export const useCreateFormViewModel = () => {
  const { chooseTokens } = useChooseTokens();
  const [tokens, setTokens] = useState<Nullable<Array<Token>>>(null);

  const balances = useTokensBalancesOnly(tokens);

  const handleSubmit = async <T extends Record<PropertyKey, unknown>>(values: T, actions: FormikHelpers<T>) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  const { validationSchema, initialValues } = useFormikParams(tokens, balances);

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  const handleSelectTokensClick = useCallback(async () => {
    const chosenTokens = await chooseTokens({
      tokens,
      min: MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
      max: MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL
    });

    formik.setValues((prev: Record<string, string>) => {
      const mainValues = {
        [RADIO_BUTTON_NAME]: prev[RADIO_BUTTON_NAME],
        [LIQUIDITY_PRODIFDERS_FEE]: prev[LIQUIDITY_PRODIFDERS_FEE]
      };

      if (chosenTokens && !isEmptyArray(chosenTokens)) {
        const tokensValues = Object.fromEntries(
          chosenTokens.map(chosenToken => {
            const tokenSlug = getTokenSlug(chosenToken);

            return [tokenSlug, formik.values[tokenSlug] ?? ''];
          })
        );

        return {
          ...mainValues,
          ...tokensValues,
          [TOKEN_KEY]: true
        };
      } else {
        return {
          ...mainValues,
          [TOKEN_KEY]: false
        };
      }
    });

    setTokens(chosenTokens);
  }, [chooseTokens, formik, tokens]);

  const { tokenInputsParams } = useInputTokenParams(tokens, balances, formik);
  const { liquidityProvidersFeeInputParams } = useLiquidityProvidersFeeInputParams(formik);
  const { radioButtonParams } = useRadioButtonParams(formik);

  return {
    liquidityProvidersFeeInputParams,
    tokenInputsParams,
    radioButtonParams,
    tokensInputValidationMessage: formik.errors['tokens'] as string,
    creationCost,

    handleSelectTokensClick,
    handleSubmit: formik.handleSubmit
  };
};
