import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'next-i18next';
import { mixed as mixedSchema, object as objectSchema, string as stringSchema } from 'yup';

import { useDexGraph } from '@hooks/useDexGraph';
import useUpdateToast from '@hooks/useUpdateToast';
import { useInitialTokens } from '@hooks/useInitialTokens';
import { SwapFormValues, WhitelistedToken } from '@utils/types';
import {
  getUserBalance,
  useAccountPkh,
  useNetwork,
  useTezos,
} from '@utils/dapp';
import { TTDEX_CONTRACTS } from '@utils/defaults';
import {
  fromDecimals,
  getMaxTokenInput,
  getTokenOutput,
  getTokenSlug,
  swap,
  toDecimals,
} from '@utils/helpers';
import {
  getMaxInputRoute,
  getMaxOutputRoute,
  getRouteWithInput,
} from '@utils/routing';
import { addressSchema, bigNumberSchema } from '@utils/validators';

import { SwapForm } from './SwapForm';

type SwapSendProps = {
  className?: string;
  fromToSlug?: string;
};

const initialErrors = {
  amount1: 'Required',
  amount2: 'Required',
};
const initialValues: Partial<SwapFormValues> = {
  action: 'swap',
  slippage: new BigNumber(0.5),
};

const getRedirectionUrl = (fromToSlug: string) => `/swap/${fromToSlug}`;

const OrdinarySwapSend: React.FC<SwapSendProps & WithRouterProps> = ({
  className,
  fromToSlug,
  router,
}) => {
  const { t } = useTranslation(['common', 'swap']);
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dexGraph } = useDexGraph();
  const network = useNetwork();
  const [
    knownTokensBalances,
    setKnownTokensBalances,
  ] = useState<Record<string, BigNumber>>({});
  const [
    knownMaxInputAmounts,
    setKnownMaxInputAmounts,
  ] = useState<Record<string, Record<string, BigNumber>>>({});
  const [
    knownMaxOutputAmounts,
    setKnownMaxOutputAmounts,
  ] = useState<Record<string, Record<string, BigNumber>>>({});

  const initialTokens = useInitialTokens(fromToSlug, getRedirectionUrl);

  useEffect(() => setKnownTokensBalances({}), [accountPkh]);

  const updateTokenBalance = useCallback((token: WhitelistedToken) => {
    const newTokenSlug = getTokenSlug(token);
    if (!accountPkh) {
      return;
    }
    getUserBalance(
      tezos!,
      accountPkh!,
      token.contractAddress,
      token.type,
      token.fa2TokenId,
    ).then(
      (balance) => {
        setKnownTokensBalances(
          (prevValue) => ({
            ...prevValue,
            [newTokenSlug]: fromDecimals(balance ?? new BigNumber(0), token.metadata.decimals),
          }),
        );
      },
    ).catch(console.error);
  }, [accountPkh, tezos]);

  const validationSchema = useMemo(() => objectSchema().shape({
    token1: objectSchema().required(t('common|This field is required')),
    token2: objectSchema().required(t('common|This field is required')),
    amount1: objectSchema().when(
      ['token1', 'token2'],
      // @ts-ignore
      (firstToken?: WhitelistedToken, secondToken?: WhitelistedToken) => {
        if (!firstToken) {
          return bigNumberSchema().required(t('common|This field is required'));
        }
        const token1Balance = knownTokensBalances[getTokenSlug(firstToken)];
        let max: BigNumber | undefined = BigNumber.min(
          token1Balance ?? new BigNumber(Infinity),
          (
            secondToken && knownMaxInputAmounts[
              getTokenSlug(firstToken)
            ]?.[getTokenSlug(secondToken)]
          ) ?? new BigNumber(Infinity),
        );
        if (!max.isFinite()) {
          max = undefined;
        }
        const min = fromDecimals(new BigNumber(1), firstToken.metadata.decimals);
        if (token1Balance?.eq(0)) {
          return bigNumberSchema(min)
            .test(
              'balance',
              () => t('common|Insufficient funds'),
              (value) => !(value instanceof BigNumber) || value.eq(0),
            )
            .required(t('common|This field is required'));
        }

        return bigNumberSchema(min, max).required(t('common|This field is required'));
      },
    ),
    amount2: objectSchema().when(
      ['token1', 'token2'],
      // @ts-ignore
      (firstToken?: WhitelistedToken, secondToken?: WhitelistedToken) => {
        if (!secondToken) {
          return bigNumberSchema().required(t('common|This field is required'));
        }
        const max = (firstToken && knownMaxOutputAmounts[
          getTokenSlug(firstToken)]?.[getTokenSlug(secondToken)]);

        return bigNumberSchema(fromDecimals(new BigNumber(1), secondToken.metadata.decimals), max)
          .required(t('common|This field is required'));
      },
    ),
    recipient: mixedSchema().when(
      'action',
      (currentAction: string) => (currentAction === 'swap'
        ? mixedSchema()
        : addressSchema().required(t('common|This field is required'))
      ),
    ),
    slippage: bigNumberSchema(0, 30).required(t('common|This field is required')),
    action: stringSchema().oneOf(['swap', 'send']).required(),
  }), [knownTokensBalances, t, knownMaxInputAmounts, knownMaxOutputAmounts]);

  const updateMaxInputAmount = useCallback(
    (token1: WhitelistedToken, token2: WhitelistedToken, amount: BigNumber) => {
      setKnownMaxInputAmounts((prevValue) => {
        const token1Slug = getTokenSlug(token1);
        const token2Slug = getTokenSlug(token2);

        return {
          ...prevValue,
          [token1Slug]: {
            ...(prevValue[token1Slug] ?? {}),
            [token2Slug]: amount,
          },
        };
      });
    },
    [],
  );

  const updateMaxOutputAmount = useCallback(
    (token1: WhitelistedToken, token2: WhitelistedToken, amount: BigNumber) => {
      setKnownMaxOutputAmounts((prevValue) => {
        const token1Slug = getTokenSlug(token1);
        const token2Slug = getTokenSlug(token2);

        return {
          ...prevValue,
          [token1Slug]: {
            ...(prevValue[token1Slug] ?? {}),
            [token2Slug]: amount,
          },
        };
      });
    },
    [],
  );

  const handleTokensSelected = useCallback(
    (token1: WhitelistedToken, token2: WhitelistedToken) => {
      try {
        const maxInputRoute = getMaxInputRoute({
          startTokenSlug: getTokenSlug(token1),
          endTokenSlug: getTokenSlug(token2),
          graph: dexGraph,
        });
        if (maxInputRoute) {
          updateMaxInputAmount(
            token1,
            token2,
            fromDecimals(getMaxTokenInput(token2, maxInputRoute), token1),
          );
        }
        const maxOutputRoute = getMaxOutputRoute({
          startTokenSlug: getTokenSlug(token1),
          endTokenSlug: getTokenSlug(token2),
          graph: dexGraph,
        });
        if (maxOutputRoute) {
          updateMaxOutputAmount(
            token1,
            token2,
            fromDecimals(
              getTokenOutput({
                inputToken: token1,
                inputAmount: getMaxTokenInput(token2, maxOutputRoute),
                dexChain: maxOutputRoute,
              }),
              token2,
            ),
          );
        }
        router.push(`/swap/${getTokenSlug(token1)}-${getTokenSlug(token2)}`);
      } catch (e) {
        console.error(e);
      }
    },
    [dexGraph, updateMaxInputAmount, updateMaxOutputAmount, router],
  );

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: t('common|Loading'),
    });
  }, [updateToast, t]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: t('swap|Swap completed!'),
    });
  }, [updateToast, t]);

  const handleSubmit = useCallback(async (formValues: Partial<SwapFormValues>) => {
    if (!tezos) {
      return;
    }

    const {
      amount1,
      token1,
      token2,
      recipient,
      slippage,
      action,
    } = formValues;

    handleLoader();
    const inputAmount = toDecimals(amount1!, token1!);
    try {
      await swap(
        tezos,
        accountPkh!,
        {
          inputAmount,
          inputToken: token1!,
          recipient: action === 'send' ? recipient : undefined,
          slippageTolerance: slippage!.div(100),
          dexChain: getRouteWithInput({
            startTokenSlug: getTokenSlug(token1!),
            endTokenSlug: getTokenSlug(token2!),
            graph: dexGraph,
            inputAmount,
          })!,
          ttDexAddress: TTDEX_CONTRACTS[network.id],
        },
      );
      handleSuccessToast();
    } catch (e) {
      handleErrorToast(e);
      throw e;
    }
  }, [
    handleLoader,
    tezos,
    handleErrorToast,
    handleSuccessToast,
    accountPkh,
    dexGraph,
    network.id,
  ]);

  const formikProps = useFormik({
    validationSchema,
    initialValues,
    initialErrors,
    onSubmit: handleSubmit,
    validateOnChange: true,
  });

  return (
    <SwapForm
      {...formikProps}
      className={className}
      initialFrom={initialTokens?.[0]}
      initialTo={initialTokens?.[1]}
      knownTokensBalances={knownTokensBalances}
      onTokensSelected={handleTokensSelected}
      updateTokenBalance={updateTokenBalance}
      knownMaxInputAmounts={knownMaxInputAmounts}
      knownMaxOutputAmounts={knownMaxOutputAmounts}
    />
  );
};

export const SwapSend = withRouter<SwapSendProps & WithRouterProps>(OrdinarySwapSend);
