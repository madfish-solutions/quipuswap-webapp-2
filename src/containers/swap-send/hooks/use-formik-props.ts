import { useCallback } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';

import { useDexGraph } from '@hooks/useDexGraph';
import useUpdateToast from '@hooks/useUpdateToast';
import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { DEFAULT_SLIPPAGE_PERCENTAGE, TTDEX_CONTRACTS } from '@utils/defaults';
import { getTokenSlug, swap, toDecimals } from '@utils/helpers';
import { getRouteWithInput } from '@utils/routing';
import { SwapFormValues } from '@utils/types';

import { useValidationSchema } from './use-validation-schema';

const initialErrors = {
  amount1: 'Required',
  amount2: 'Required'
};
const initialValues: Partial<SwapFormValues> = {
  action: 'swap',
  slippage: new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE)
};

export const useFormikProps = () => {
  const validationSchema = useValidationSchema();
  const { t } = useTranslation(['common', 'swap']);
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dexGraph } = useDexGraph();
  const network = useNetwork();

  const handleErrorToast = useCallback(
    (err: Error) => {
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
      if (!tezos || !accountPkh) {
        return;
      }

      const { amount1, token1, token2, recipient, slippage, action } = formValues as SwapFormValues;

      handleLoader();
      const inputAmount = toDecimals(amount1, token1);
      try {
        await swap(tezos, accountPkh, {
          inputAmount,
          inputToken: token1,
          recipient: action === 'send' ? recipient : undefined,
          slippageTolerance: slippage.div(100),
          dexChain: getRouteWithInput({
            startTokenSlug: getTokenSlug(token1),
            endTokenSlug: getTokenSlug(token2),
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

  return useFormik({
    validationSchema,
    initialValues,
    initialErrors,
    onSubmit: handleSubmit,
    validateOnChange: true
  });
};
