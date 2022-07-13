import { useCallback, useState } from 'react';

import { FormikHelpers, useFormik } from 'formik';

import { useTokensBalancesOnly } from '@shared/hooks';
//TODO: fix circlar dependencies
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { Token } from '@shared/types';

import { usePoolCreationPrice } from '../../../../../hooks';
import { MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL, MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL, TOKEN_KEY } from './constants';
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
