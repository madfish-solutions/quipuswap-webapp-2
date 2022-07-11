/* eslint-disable no-console */
import { useCallback, useMemo, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';

import { TokenInputProps } from '@shared/components';
import { getFirstElement, getFormikError, getTokenSlug, operationAmountSchema } from '@shared/helpers';
import { useTokensBalancesOnly } from '@shared/hooks';
//TODO: fix circlar dependencies
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { Optional, Token } from '@shared/types';
import { NumberAsStringSchema } from '@shared/validators';
import { i18n } from '@translation';

const MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL = 2;
const MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL = 3;

const RADIO_BUTTON_NAME = 'amplification';

const radioButtonValues = [
  {
    radioName: RADIO_BUTTON_NAME,
    value: '10',
    label: i18n.t('stableswap|amplification10')
  },
  {
    radioName: RADIO_BUTTON_NAME,
    value: '100',
    label: i18n.t('stableswap|amplification100')
  },
  {
    radioName: RADIO_BUTTON_NAME,
    value: '200',
    label: i18n.t('stableswap|amplification200')
  }
];

const creationCost = {
  burned: '20',
  devFee: '1200',
  total: '1220'
};

const useFormikParams = (tokens: Nullable<Array<Token>>, balances: Array<Nullable<BigNumber>>) => {
  const validationSchema = useMemo(() => {
    const inputAmountSchemas: Array<NumberAsStringSchema> =
      tokens?.map((token, index) => {
        const { metadata } = token;
        const balance = balances[index];

        return operationAmountSchema(
          balance,
          false,
          metadata?.decimals,
          metadata &&
            i18n.t('common|tokenDecimalsOverflowError', {
              tokenSymbol: metadata.symbol,
              decimalPlaces: metadata.decimals
            })
        );
      }) ?? [];

    const shapeMap: Array<[string, NumberAsStringSchema]> = inputAmountSchemas.map((schema, index) => [
      getTokenSlug(tokens![index]),
      schema
    ]);

    const liquidityProvidersFee = ['liquidityProvidersFee', ''];

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries([...shapeMap, liquidityProvidersFee]);

    return yup.object().shape(shape);
  }, [balances, tokens]);

  const initialValues = useMemo(() => {
    const tokensInputs = tokens?.map(token => [getTokenSlug(token), '']) ?? [];

    return Object.fromEntries([...tokensInputs, [RADIO_BUTTON_NAME, getFirstElement(radioButtonValues).value]]);
  }, [tokens]);

  return { validationSchema, initialValues };
};

const useInputTokenParams = (
  tokens: Nullable<Array<Token>>,
  balances: Array<Nullable<BigNumber>>,
  formik: ReturnType<typeof useFormik>
) => {
  const tokenInputsParams: Optional<Array<TokenInputProps>> = useMemo(
    () =>
      tokens?.map((token, index) => {
        const tokenSlug = getTokenSlug(token);

        return {
          balance: balances[index],
          tokens: token,
          error: getFormikError(formik, tokenSlug),
          value: formik.values[tokenSlug] ?? '',
          label: i18n.t('common|Input'),
          onInputChange: (value: string) => {
            formik.setFieldValue(tokenSlug, value);
          }
        };
      }),
    [balances, formik, tokens]
  );

  return { tokenInputsParams };
};

export const useCreateFormViewModel = () => {
  const { chooseTokens } = useChooseTokens();
  const [tokens, setTokens] = useState<Nullable<Array<Token>>>(null);

  const balances = useTokensBalancesOnly(tokens);

  const handleSelectTokensClick = useCallback(async () => {
    const chosenTokens = await chooseTokens({
      tokens,
      min: MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
      max: MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL
    });

    setTokens(chosenTokens);
  }, [chooseTokens, tokens]);

  const handleSubmit = async <T extends Record<PropertyKey, unknown>>(values: T, actions: FormikHelpers<T>) => {
    console.log(values);
  };

  const { validationSchema, initialValues } = useFormikParams(tokens, balances);

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  const { tokenInputsParams } = useInputTokenParams(tokens, balances, formik);

  const handleRadioButtonChange = (value: string) => {
    formik.setFieldValue(RADIO_BUTTON_NAME, value);
  };

  return {
    radioButtonValue: formik.values[RADIO_BUTTON_NAME],
    handleRadioButtonChange,

    tokenInputsParams,
    creationCost,
    radioButtonValues,
    handleSelectTokensClick,
    handleSubmit: formik.handleSubmit
  };
};
