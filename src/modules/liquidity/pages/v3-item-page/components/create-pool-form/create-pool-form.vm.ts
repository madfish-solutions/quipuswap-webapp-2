import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';

import { TokenSelectProps } from '@shared/components/token-select';
import { getFormikError, isExist, isTezosToken, operationAmountSchema, sortTokens } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { Token } from '@shared/types';
import { i18n, useTranslation } from '@translation';

import { useDoCreateV3Pool } from '../../use-create-new-pool-page.vm';
import styles from './create-pool-form.module.scss';

enum eCreatePoolValues {
  feeRate = 'feeRate',
  initialPrice = 'initialPrice',
  tokens = 'tokens'
}

interface CreatePoolValues {
  [eCreatePoolValues.feeRate]: number;
  [eCreatePoolValues.initialPrice]: string;
  [eCreatePoolValues.tokens]: Array<Token>;
}

export const feeRateRadioButtonOptions = [
  {
    radioName: eCreatePoolValues.feeRate,
    value: 0.01,
    label: i18n.t('liquidity|feeRates001')
  },
  {
    radioName: eCreatePoolValues.feeRate,
    value: 0.05,
    label: i18n.t('liquidity|feeRates005')
  },
  {
    radioName: eCreatePoolValues.feeRate,
    value: 0.3,
    label: i18n.t('liquidity|feeRates03')
  },
  {
    radioName: eCreatePoolValues.feeRate,
    value: 1,
    label: i18n.t('liquidity|feeRates1')
  }
];

const standardTokenSelectProps = {
  className: styles.tokenSelect,
  value: 0,
  label: i18n.t('common|Input'),
  hiddenPercentSelector: true,
  hiddenBalance: true,

  onAmountChange: noopMap,
  blackListedTokens: []
};

const validationSchema = yup.object().shape({
  [eCreatePoolValues.feeRate]: yup.number().required(),
  [eCreatePoolValues.initialPrice]: operationAmountSchema(
    null,
    true,
    6,
    'The value should be less than 6 decimals.'
  ).required(),
  [eCreatePoolValues.tokens]: yup
    .array()
    .length(2)
    .test(eCreatePoolValues.tokens, 'You should select 2 tokens', (tokens?: Array<Token>) => {
      if (!isExist(tokens)) {
        return false;
      }

      const [firstToken, secondToken] = tokens;

      return isExist(firstToken) && isExist(secondToken);
    })
});

const initialValues: CreatePoolValues = {
  [eCreatePoolValues.feeRate]: feeRateRadioButtonOptions[0].value,
  [eCreatePoolValues.initialPrice]: '',
  [eCreatePoolValues.tokens]: []
};

export const useCreatePoolFormViewModel = () => {
  const { t } = useTranslation();

  const { doCreatePool } = useDoCreateV3Pool();

  const handleSubmit = useCallback(
    async (values: CreatePoolValues, actions: FormikHelpers<CreatePoolValues>) => {
      actions.setSubmitting(true);
      const feeRate = new BigNumber(values[eCreatePoolValues.feeRate]);
      const [token0, token1] = values[eCreatePoolValues.tokens].sort(sortTokens);
      const initialPrice = new BigNumber(values[eCreatePoolValues.initialPrice]);

      await doCreatePool(feeRate, token0, token1, initialPrice);
      actions.setSubmitting(false);
    },
    [doCreatePool]
  );

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  const radioButtonParams = {
    onChange: (value: number) => {
      formik.setFieldValue(eCreatePoolValues.feeRate, Number(value));
    },
    value: formik.values[eCreatePoolValues.feeRate],
    values: feeRateRadioButtonOptions
  };

  const setInitialPriceValue = (value: string) => {
    formik.setFieldValue(eCreatePoolValues.initialPrice, value);
  };

  const token0 = formik.values[eCreatePoolValues.tokens][0];
  const token1 = formik.values[eCreatePoolValues.tokens][1];

  const tokensSelectData: Array<TokenSelectProps> = [
    {
      ...standardTokenSelectProps,
      token: token0,
      onTokenChange(token) {
        formik.setFieldValue(eCreatePoolValues.tokens, [token, token1]);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: !token0 ? getFormikError(formik as any, eCreatePoolValues.tokens) : undefined,
      blackListedTokens: token1 ? [token1] : []
    },
    {
      ...standardTokenSelectProps,
      token: token1,
      onTokenChange(token) {
        formik.setFieldValue(eCreatePoolValues.tokens, [token0, token]);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: !token1 ? getFormikError(formik as any, eCreatePoolValues.tokens) : undefined,
      blackListedTokens: token0 ? [token0] : []
    }
  ];

  const translation = {
    tokenSelect: t('common|Input'),
    initialPrice: t('liquidity|initialPrice'),
    feeRates: t('liquidity|feeRates'),
    create: t('common|Create')
  };

  const tokens = formik.values[eCreatePoolValues.tokens];
  const warningMessage =
    (isExist(token0) && isTezosToken(token0)) || (isExist(token1) && isTezosToken(token1))
      ? t('liquidity|v3PoolWithTezCreationWarning')
      : null;

  return {
    translation,
    radioButtonParams,
    tokensSelectData,
    tokens,
    disabled: !tokens || formik.isSubmitting,
    isSubmitting: formik.isSubmitting,
    initialPriceValue: formik.values[eCreatePoolValues.initialPrice],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialPriceError: getFormikError(formik as any, eCreatePoolValues.initialPrice),
    setInitialPriceValue,
    onSubmit: formik.handleSubmit,
    warningMessage
  };
};
