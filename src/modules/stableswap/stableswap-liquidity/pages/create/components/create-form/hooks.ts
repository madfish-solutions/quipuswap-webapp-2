import { useMemo, FormEvent, useCallback } from 'react';

import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { PERCENT } from '@config/constants';
import { TokenInputProps, RadioButtonProps, InputProps } from '@shared/components';
import {
  operationAmountSchema,
  getTokenSlug,
  getFirstElement,
  getFormikError,
  isNull,
  isEmptyString,
  isEmptyArray,
  setCaretPosition
} from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';
import { NumberAsStringSchema } from '@shared/validators';
import { i18n } from '@translation';

import {
  LIQUIDITY_PROVIDERS_FEE_FIELD_NAME,
  AMPLIFICATION_FIELD_NAME,
  createPoolAmplification,
  UPPER_LIQUIDITY_PROVIDERS_FEE,
  TOKEN_KEY,
  MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
  MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL
} from './constants';

const MAX_DECIMALS_AMOUNT = 10;
const MAX_REAL_VALUE_AMOUNT = new BigNumber(UPPER_LIQUIDITY_PROVIDERS_FEE.value);

export const useFormikParams = (tokens: Nullable<Array<Token>>, balances: Array<Nullable<BigNumber>>) => {
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
      schema.required('Value is required')
    ]);

    const liquidityProvidersFee = [
      LIQUIDITY_PROVIDERS_FEE_FIELD_NAME,
      operationAmountSchema(
        MAX_REAL_VALUE_AMOUNT,
        true,
        MAX_DECIMALS_AMOUNT,
        i18n.t('stableswap|noMoreDecimals', { decimalsAmount: MAX_DECIMALS_AMOUNT })
      ).required('Value is required')
    ];

    const tokensSchema = [
      TOKEN_KEY,
      yup.boolean().is(
        [true],
        i18n.t('stableswap|chooseTokensRecommendations', {
          min: MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL,
          max: MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL
        })
      )
    ];

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries([
      ...shapeMap,
      liquidityProvidersFee,
      tokensSchema
    ]);

    return yup.object().shape(shape);
  }, [balances, tokens]);

  const initialValues = useMemo(() => {
    const tokensInputs = tokens?.map(token => [getTokenSlug(token), '']) ?? [];

    return Object.fromEntries([
      ...tokensInputs,
      [AMPLIFICATION_FIELD_NAME, getFirstElement(createPoolAmplification).value],
      [LIQUIDITY_PROVIDERS_FEE_FIELD_NAME, ''],
      [TOKEN_KEY, false]
    ]);
  }, [tokens]);

  return { validationSchema, initialValues };
};

export const useInputTokenParams = (
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
          decimals: token.metadata.decimals,
          onInputChange: (value: string) => {
            formik.setFieldValue(tokenSlug, value);
          }
        };
      }),
    [balances, formik, tokens]
  );

  return { tokenInputsParams };
};

export const useLiquidityProvidersFeeInputParams = (formik: ReturnType<typeof useFormik>) => {
  const liquidityProvidersFeeInputParams: InputProps = useMemo(
    () => ({
      id: 'input-fee-field',
      label: `${i18n.t('stableswap|liquidityProvidersFee')} (0–1%)`,
      error: getFormikError(formik, LIQUIDITY_PROVIDERS_FEE_FIELD_NAME),
      value: isEmptyString(formik.values[LIQUIDITY_PROVIDERS_FEE_FIELD_NAME])
        ? formik.values[LIQUIDITY_PROVIDERS_FEE_FIELD_NAME]
        : `${formik.values[LIQUIDITY_PROVIDERS_FEE_FIELD_NAME]}${PERCENT}`,
      onChange: (event: FormEvent<HTMLInputElement>) => {
        if (isNull(event)) {
          return;
        }
        const input = document.getElementById('input-fee-field');
        const value = (event.target as HTMLInputElement).value.replace(PERCENT, '');

        setCaretPosition(input as HTMLInputElement);

        formik.setFieldValue(LIQUIDITY_PROVIDERS_FEE_FIELD_NAME, value);
      }
    }),
    [formik]
  );

  return { liquidityProvidersFeeInputParams };
};

export const useRadioButtonParams = (formik: ReturnType<typeof useFormik>) => {
  const radioButtonParams: RadioButtonProps = useMemo(
    () => ({
      onChange: async (value: string) => formik.setFieldValue(AMPLIFICATION_FIELD_NAME, value),
      value: formik.values[AMPLIFICATION_FIELD_NAME],
      values: createPoolAmplification
    }),
    [formik]
  );

  return { radioButtonParams };
};

export const useHandleTokensChange = (formik: ReturnType<typeof useFormik>) => {
  const handleTokensChange = useCallback(
    (chosenTokens: Nullable<Array<Token>>) => {
      formik.setValues((prev: Record<string, string>) => {
        const mainValues = {
          [AMPLIFICATION_FIELD_NAME]: prev[AMPLIFICATION_FIELD_NAME],
          [LIQUIDITY_PROVIDERS_FEE_FIELD_NAME]: prev[LIQUIDITY_PROVIDERS_FEE_FIELD_NAME]
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
    },
    [formik]
  );

  return { handleTokensChange };
};
