import React, { useCallback, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import { mixed as mixedSchema, object as objectSchema, string as stringSchema } from 'yup';

import { useDexGraph } from '@hooks/useDexGraph';
import { useInitialTokens } from '@hooks/useInitialTokens';
import useUpdateToast from '@hooks/useUpdateToast';
import { useBalances } from '@providers/BalancesProvider';
import { useTezos, useNetwork, useAccountPkh } from '@utils/dapp';
import { DEFAULT_SLIPPAGE_PERCENTAGE, MAX_SLIPPAGE_PERCENTAGE, TTDEX_CONTRACTS } from '@utils/defaults';
import { fromDecimals, getTokenSlug, swap, toDecimals } from '@utils/helpers';
import { getRouteWithInput } from '@utils/routing';
import { SwapFormValues, WhitelistedToken } from '@utils/types';
import { addressSchema, bigNumberSchema } from '@utils/validators';

import { useSwapLimits } from './hooks/useSwapLimits';
import { SwapForm } from './SwapForm';

const REQUIRE_FIELD_MESSAGE = 'common|This field is required';

interface SwapSendProps {
  className?: string;
  fromToSlug?: string;
}

const initialErrors = {
  amount1: 'Required',
  amount2: 'Required'
};
const initialValues: Partial<SwapFormValues> = {
  action: 'swap',
  slippage: new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE)
};

const getRedirectionUrl = (fromToSlug: string) => `/swap/${fromToSlug}`;

const OrdinarySwapSend: React.FC<SwapSendProps & WithRouterProps> = ({ className, fromToSlug, router }) => {
  const { t } = useTranslation(['common', 'swap']);
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dexGraph } = useDexGraph();
  const network = useNetwork();
  const { maxInputAmounts, maxOutputAmounts, updateSwapLimits } = useSwapLimits();
  const { balances } = useBalances();

  const initialTokens = useInitialTokens(fromToSlug, getRedirectionUrl);

  const validationSchema = useMemo(
    () =>
      objectSchema().shape({
        token1: objectSchema().required(t(REQUIRE_FIELD_MESSAGE)),
        token2: objectSchema().required(t(REQUIRE_FIELD_MESSAGE)),
        amount1: objectSchema().when(
          ['token1', 'token2'],
          // @ts-ignore
          (firstToken?: WhitelistedToken, secondToken?: WhitelistedToken) => {
            if (!firstToken) {
              return bigNumberSchema().required(t(REQUIRE_FIELD_MESSAGE));
            }
            const token1Balance = balances[getTokenSlug(firstToken)];
            let max: BigNumber | undefined = BigNumber.min(
              token1Balance ?? new BigNumber(Infinity),
              (secondToken && maxInputAmounts[getTokenSlug(firstToken)]?.[getTokenSlug(secondToken)]) ??
                new BigNumber(Infinity)
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
                  value => !(value instanceof BigNumber) || value.eq(0)
                )
                .required(t(REQUIRE_FIELD_MESSAGE));
            }

            return bigNumberSchema(min, max).required(t(REQUIRE_FIELD_MESSAGE));
          }
        ),
        amount2: objectSchema().when(
          ['token1', 'token2'],
          // @ts-ignore
          (firstToken?: WhitelistedToken, secondToken?: WhitelistedToken) => {
            if (!secondToken) {
              return bigNumberSchema().required(t(REQUIRE_FIELD_MESSAGE));
            }
            const max = firstToken && maxOutputAmounts[getTokenSlug(firstToken)]?.[getTokenSlug(secondToken)];

            return bigNumberSchema(fromDecimals(new BigNumber(1), secondToken.metadata.decimals), max).required(
              t(REQUIRE_FIELD_MESSAGE)
            );
          }
        ),
        recipient: mixedSchema().when('action', (currentAction: string) =>
          currentAction === 'swap' ? mixedSchema() : addressSchema().required(t(REQUIRE_FIELD_MESSAGE))
        ),
        slippage: bigNumberSchema(0, MAX_SLIPPAGE_PERCENTAGE).required(t(REQUIRE_FIELD_MESSAGE)),
        action: stringSchema().oneOf(['swap', 'send']).required()
      }),
    [balances, t, maxInputAmounts, maxOutputAmounts]
  );

  const handleTokensSelected = useCallback(
    (token1: WhitelistedToken, token2: WhitelistedToken) => {
      updateSwapLimits(token1, token2);
      const newRoute = `/swap/${getTokenSlug(token1)}-${getTokenSlug(token2)}`;
      if (router.asPath !== newRoute) {
        router.replace(newRoute);
      }
    },
    [router, updateSwapLimits]
  );

  const handleErrorToast = useCallback(
    err => {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`
      });
    },
    [updateToast]
  );

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: t('common|Loading')
    });
  }, [updateToast, t]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: t('swap|Swap completed!')
    });
  }, [updateToast, t]);

  const handleSubmit = useCallback(
    async (formValues: Partial<SwapFormValues>) => {
      if (!tezos) {
        return;
      }

      const { amount1, token1, token2, recipient, slippage, action } = formValues;

      handleLoader();
      const inputAmount = toDecimals(amount1!, token1!);
      try {
        await swap(tezos, accountPkh!, {
          inputAmount,
          inputToken: token1!,
          recipient: action === 'send' ? recipient : undefined,
          slippageTolerance: slippage!.div(100),
          dexChain: getRouteWithInput({
            startTokenSlug: getTokenSlug(token1!),
            endTokenSlug: getTokenSlug(token2!),
            graph: dexGraph,
            inputAmount
          })!,
          ttDexAddress: TTDEX_CONTRACTS[network.id]
        });
        handleSuccessToast();
      } catch (e) {
        handleErrorToast(e);
        throw e;
      }
    },
    [handleLoader, tezos, handleErrorToast, handleSuccessToast, accountPkh, dexGraph, network.id]
  );

  const formikProps = useFormik({
    validationSchema,
    initialValues,
    initialErrors,
    onSubmit: handleSubmit,
    validateOnChange: true
  });

  return (
    <SwapForm
      {...formikProps}
      className={className}
      initialFrom={initialTokens?.[0]}
      initialTo={initialTokens?.[1]}
      onTokensSelected={handleTokensSelected}
      updateSwapLimits={updateSwapLimits}
      maxInputAmounts={maxInputAmounts}
      maxOutputAmounts={maxOutputAmounts}
    />
  );
};

export const SwapSend = withRouter<SwapSendProps & WithRouterProps>(OrdinarySwapSend);
