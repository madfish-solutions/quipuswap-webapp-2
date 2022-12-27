import { useState } from 'react';

import { TokenSelectProps } from '@shared/components/token-select';
import { noopMap } from '@shared/mapping';
import { Token } from '@shared/types';
import { i18n, useTranslation } from '@translation';

import styles from './create-pool-form.module.scss';

const FEE_RATE_FIELD_NAME = 'feeRate';

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

const useV3CreateFormRadioButton = () => {
  const [value, setValue] = useState(feeRateRadioButtonOptions[0].value);

  const radioButtonParams = {
    onChange: (option: string) => setValue(Number(option)),
    value,
    values: feeRateRadioButtonOptions
  };

  return { radioButtonParams };
};

export const useCreatePoolFormViewModel = () => {
  const { t } = useTranslation();
  const { radioButtonParams } = useV3CreateFormRadioButton();

  const [token0, setToken0] = useState<Token>();
  const [token1, setToken1] = useState<Token>();

  const [initialPriceValue, setInitialPrice] = useState<string>('');

  const setInitialPriceValue = (value: string) => {
    setInitialPrice(value);
  };

  const tokensSelectData: Array<TokenSelectProps> = [
    {
      ...standardTokenSelectProps,
      token: token0,
      onTokenChange(token) {
        setToken0(token);
      },
      blackListedTokens: token1 ? [token1] : []
    },
    {
      ...standardTokenSelectProps,
      token: token1,
      onTokenChange(token) {
        setToken1(token);
      },
      blackListedTokens: token0 ? [token0] : []
    }
  ];

  const translation = {
    tokenSelect: t('common|Input'),
    initialPrice: t('liquidity|initialPrice'),
    feeRates: t('liquidity|feeRates'),
    create: t('common|Create')
  };

  const tokens = token0 && token1 ? [token0, token1] : null;

  return {
    translation,
    token0,
    setToken0,
    token1,
    setToken1,
    radioButtonParams,
    tokensSelectData,
    tokens,
    disabled: !tokens,
    isSubmitting: false,
    initialPriceValue,
    setInitialPriceValue
  };
};
