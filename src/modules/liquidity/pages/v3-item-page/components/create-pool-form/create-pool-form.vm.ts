import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { AppRootRoutes } from '@app.router';
import { DELAY_BEFORE_DATA_UPDATE, EMPTY_STRING, FEE_BASE_POINTS_PRECISION, SLASH } from '@config/constants';
import { useGetLiquidityList } from '@modules/liquidity/hooks';
import { LiquidityRoutes } from '@modules/liquidity/liquidity-routes.enum';
import { useTezos } from '@providers/use-dapp';
import { TokenSelectProps } from '@shared/components/token-select';
import { getFormikError, isExist, operationAmountSchema, sleep, sortTokens, toFraction } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { Token } from '@shared/types';
import { i18n, useTranslation } from '@translation';

import { findPool } from '../../helpers/find-pool';
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

const DEFAULT_ALARM_MESSAGE_INFO = {
  poolExists: false,
  poolLink: EMPTY_STRING
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
  const { getLiquidityList } = useGetLiquidityList();
  const tezos = useTezos();
  const { doCreatePool } = useDoCreateV3Pool();
  const [alarmMessageInfo, setAlarmMessageInfo] = useState(DEFAULT_ALARM_MESSAGE_INFO);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: CreatePoolValues, actions: FormikHelpers<CreatePoolValues>) => {
      actions.setSubmitting(true);
      const feeRate = new BigNumber(values[eCreatePoolValues.feeRate]);
      const [token0, token1] = values[eCreatePoolValues.tokens].sort(sortTokens);
      const initialPrice = new BigNumber(values[eCreatePoolValues.initialPrice]);
      const poolId = await findPool(
        tezos,
        toFraction(feeRate).multipliedBy(FEE_BASE_POINTS_PRECISION),
        values[eCreatePoolValues.tokens]
      );

      if (isExist(poolId)) {
        setAlarmMessageInfo({
          poolExists: true,
          poolLink: `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}${SLASH}${poolId}`
        });

        return;
      }

      await doCreatePool(feeRate, token0, token1, initialPrice);
      await sleep(DELAY_BEFORE_DATA_UPDATE);

      const newPoolId = await findPool(
        tezos,
        toFraction(feeRate).multipliedBy(FEE_BASE_POINTS_PRECISION),
        values[eCreatePoolValues.tokens]
      );

      navigate(`${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}${SLASH}${newPoolId}${LiquidityRoutes.create}`);

      actions.resetForm();
      actions.setSubmitting(false);
    },
    [tezos, doCreatePool, navigate]
  );

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

  const token0 = formik.values[eCreatePoolValues.tokens][0];
  const token1 = formik.values[eCreatePoolValues.tokens][1];

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
      blackListedTokens: token1 ? [token1] : []
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

  useEffect(() => {
    void getLiquidityList();
  }, [getLiquidityList]);

  return {
    alarmMessageInfo,
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
    onSubmit: formik.handleSubmit
  };
};
