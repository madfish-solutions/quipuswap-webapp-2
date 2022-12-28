import { useCallback } from 'react';

import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';

import { TokenSelectProps } from '@shared/components/token-select';
import { getFormikError, isExist, operationAmountSchema } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { Token } from '@shared/types';
import { i18n, useTranslation } from '@translation';

import styles from './create-pool-form.module.scss';

const FEE_RATE_FIELD_NAME = 'feeRate';

interface CreatePoolValues {
  [FEE_RATE_FIELD_NAME]: number;
  initialPrice: string;
  tokens: Array<Token>;
}

export const feeRateRadioButtonOptions = [
  {
    radioName: FEE_RATE_FIELD_NAME,
    value: 0.01,
    label: i18n.t('liquidity|feeRates001')
  },
  {
    radioName: FEE_RATE_FIELD_NAME,
    value: 0.05,
    label: i18n.t('liquidity|feeRates005')
  },
  {
    radioName: FEE_RATE_FIELD_NAME,
    value: 0.3,
    label: i18n.t('liquidity|feeRates03')
  },
  {
    radioName: FEE_RATE_FIELD_NAME,
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
  [FEE_RATE_FIELD_NAME]: yup.number().required(),
  initialPrice: operationAmountSchema(null, true, 6, 'The value should be less than 6 decimals.'),
  tokens: yup
    .array()
    .length(2)
    .test('tokens', 'You should select 2 tokens', (tokens?: Array<Token>) => {
      if (!isExist(tokens)) {
        return false;
      }

      const [firstToken, secondToken] = tokens;

      return isExist(firstToken) && isExist(secondToken);
    })
});

const initialValues: CreatePoolValues = {
  [FEE_RATE_FIELD_NAME]: feeRateRadioButtonOptions[0].value,
  initialPrice: '',
  tokens: []
};

export const useCreatePoolFormViewModel = () => {
  const { t } = useTranslation();

  const handleSubmit = useCallback(async (values: CreatePoolValues, actions: FormikHelpers<CreatePoolValues>) => {
    // eslint-disable-next-line no-console
    console.log(values, actions);
  }, []);

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  const radioButtonParams = {
    onChange: (value: number) => {
      formik.setFieldValue(FEE_RATE_FIELD_NAME, Number(value));
    },
    value: formik.values[FEE_RATE_FIELD_NAME],
    values: feeRateRadioButtonOptions
  };

  const setInitialPriceValue = (value: string) => {
    formik.setFieldValue('initialPrice', value);
  };

  const tokensSelectData: Array<TokenSelectProps> = [
    {
      ...standardTokenSelectProps,
      token: formik.values.tokens[0],
      onTokenChange(token) {
        formik.setFieldValue('tokens', [token, formik.values.tokens[1]]);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: !formik.values.tokens[0] ? getFormikError(formik as any, 'tokens') : undefined,
      blackListedTokens: formik.values.tokens[1] ? [formik.values.tokens[1]] : []
    },
    {
      ...standardTokenSelectProps,
      token: formik.values.tokens[1],
      onTokenChange(token) {
        formik.setFieldValue('tokens', [formik.values.tokens[0], token]);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: !formik.values.tokens[1] ? getFormikError(formik as any, 'tokens') : undefined,
      blackListedTokens: formik.values.tokens[0] ? [formik.values.tokens[0]] : []
    }
  ];

  const translation = {
    tokenSelect: t('common|Input'),
    initialPrice: t('liquidity|initialPrice'),
    feeRates: t('liquidity|feeRates'),
    create: t('common|Create')
  };

  const tokens = formik.values.tokens;

  return {
    translation,
    radioButtonParams,
    tokensSelectData,
    tokens,
    disabled: !tokens,
    isSubmitting: false,
    initialPriceValue: formik.values.initialPrice,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialPriceError: getFormikError(formik as any, 'initialPrice'),
    setInitialPriceValue,
    onSubmit: formik.handleSubmit
  };
};
