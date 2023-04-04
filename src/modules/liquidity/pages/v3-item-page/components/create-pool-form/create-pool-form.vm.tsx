import { useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { EMPTY_STRING, FIRST_INDEX, SECOND_TUPLE_INDEX } from '@config/constants';
import { TEZOS_TOKEN_DECIMALS, WTEZ_TOKEN } from '@config/tokens';
import { useGetLiquidityList } from '@modules/liquidity/hooks';
import { AssetSwitcher } from '@shared/components';
import { TokenSelectProps } from '@shared/components/token-select';
import {
  getFormikError,
  getInvertedValue,
  getTokenSymbol,
  isExist,
  isNull,
  operationAmountSchema,
  stringToBigNumber
} from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { Token } from '@shared/types';
import { i18n, useTranslation } from '@translation';

import { tezosTokenIsIncluded, tokenIsIncluded } from '../../helpers';
import styles from './create-pool-form.module.scss';
import { useHandleSubmit } from './use-handle-submit';

enum eCreatePoolValues {
  feeRate = 'feeRate',
  initialPrice = 'initialPrice',
  tokens = 'tokens',
  activeAssetIndex = 'activeAssetIndex'
}

interface CreatePoolValues {
  [eCreatePoolValues.feeRate]: number;
  [eCreatePoolValues.initialPrice]: string;
  [eCreatePoolValues.tokens]: Array<Token>;
  [eCreatePoolValues.activeAssetIndex]: number;
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

const DEFAULT_ALARM_MESSAGE_INFO = {
  poolExists: false,
  poolLink: EMPTY_STRING
};

const validationSchema = yup.object().shape({
  [eCreatePoolValues.feeRate]: yup.number().required(),
  [eCreatePoolValues.initialPrice]: operationAmountSchema(
    null,
    true,
    TEZOS_TOKEN_DECIMALS,
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
    }),
  [eCreatePoolValues.activeAssetIndex]: yup.number().required()
});

const initialValues: CreatePoolValues = {
  [eCreatePoolValues.feeRate]: feeRateRadioButtonOptions[0].value,
  [eCreatePoolValues.initialPrice]: '',
  [eCreatePoolValues.tokens]: [],
  [eCreatePoolValues.activeAssetIndex]: FIRST_INDEX
};

export const useCreatePoolFormViewModel = () => {
  const { t } = useTranslation();
  const { getLiquidityList } = useGetLiquidityList();
  const [alarmMessageInfo, setAlarmMessageInfo] = useState(DEFAULT_ALARM_MESSAGE_INFO);

  const handleSubmit = useHandleSubmit(setAlarmMessageInfo);

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  const radioButtonParams = {
    onChange: (value: number) => {
      setAlarmMessageInfo(DEFAULT_ALARM_MESSAGE_INFO);
      formik.setFieldValue(eCreatePoolValues.feeRate, Number(value));
    },
    value: formik.values[eCreatePoolValues.feeRate],
    values: feeRateRadioButtonOptions
  };

  const setInitialPriceValue = (value: string) => {
    formik.setFieldValue(eCreatePoolValues.initialPrice, value);
  };

  const handleAssetSwitch = async (index: number) =>
    formik.setValues(prevValues => {
      const prevInitialPrice = stringToBigNumber(prevValues[eCreatePoolValues.initialPrice]);

      return {
        ...prevValues,
        [eCreatePoolValues.activeAssetIndex]: index,
        [eCreatePoolValues.initialPrice]:
          prevInitialPrice.isZero() || !prevInitialPrice.isFinite()
            ? EMPTY_STRING
            : getInvertedValue(prevInitialPrice).decimalPlaces(TEZOS_TOKEN_DECIMALS, BigNumber.ROUND_DOWN).toFixed()
      };
    });

  const tokens = formik.values[eCreatePoolValues.tokens];
  const [token0, token1] = tokens;

  const tokensSelectData: Array<TokenSelectProps> = [
    {
      ...standardTokenSelectProps,
      token: token0,
      onTokenChange(token) {
        setAlarmMessageInfo(DEFAULT_ALARM_MESSAGE_INFO);
        formik.setFieldValue(eCreatePoolValues.tokens, [token, token1]);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: !token0 ? getFormikError(formik as any, eCreatePoolValues.tokens) : undefined,
      blackListedTokens: [token1].filter(isExist)
    },
    {
      ...standardTokenSelectProps,
      token: token1,
      onTokenChange(token) {
        setAlarmMessageInfo(DEFAULT_ALARM_MESSAGE_INFO);
        formik.setFieldValue(eCreatePoolValues.tokens, [token0, token]);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: !token1 ? getFormikError(formik as any, eCreatePoolValues.tokens) : undefined,
      blackListedTokens: [token0].filter(isExist)
    }
  ];

  const translation = {
    tokenSelect: t('common|Input'),
    feeRates: t('liquidity|feeRates'),
    create: t('common|Create')
  };

  const errorMessage =
    tezosTokenIsIncluded([token0, token1]) && tokenIsIncluded([token0, token1], WTEZ_TOKEN)
      ? t('liquidity|cannotCreatePoolError')
      : null;
  const warningMessage =
    tezosTokenIsIncluded([token0, token1]) && isNull(errorMessage) ? t('liquidity|v3PoolWithTezCreationWarning') : null;

  useEffect(() => {
    void getLiquidityList();
  }, [getLiquidityList]);

  const activeAssetIndex = formik.values[eCreatePoolValues.activeAssetIndex];
  const initialPriceLabel = useMemo(() => {
    const baseToken = tokens[SECOND_TUPLE_INDEX - activeAssetIndex];
    if (isExist(baseToken)) {
      return `${t('liquidity|initialPrice')}: 1 ${getTokenSymbol(baseToken)} =`;
    }

    return t('liquidity|initialPrice');
  }, [t, tokens, activeAssetIndex]);

  const tokensSwitcher = isExist(token0) && isExist(token1) && (
    <AssetSwitcher
      labels={[getTokenSymbol(token0), getTokenSymbol(token1)]}
      activeIndex={activeAssetIndex}
      handleButtonClick={handleAssetSwitch}
    />
  );

  return {
    alarmMessageInfo,
    translation,
    radioButtonParams,
    tokensSelectData,
    quoteToken: tokens[activeAssetIndex],
    disabled: !tokens || formik.isSubmitting || isExist(errorMessage) || alarmMessageInfo.poolExists,
    isSubmitting: formik.isSubmitting,
    initialPriceLabel,
    initialPriceValue: formik.values[eCreatePoolValues.initialPrice],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialPriceError: getFormikError(formik as any, eCreatePoolValues.initialPrice),
    setInitialPriceValue,
    onSubmit: formik.handleSubmit,
    tokensSwitcher,
    warningMessage,
    errorMessage
  };
};
