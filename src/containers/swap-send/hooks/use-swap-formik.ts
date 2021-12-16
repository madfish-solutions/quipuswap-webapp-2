import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';

import { useFlowToasts } from '@hooks/use-flow-toasts';
import { useDexGraph } from '@hooks/useDexGraph';
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

export const useSwapFormik = () => {
  const validationSchema = useValidationSchema();
  const { t } = useTranslation(['common', 'swap']);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dexGraph } = useDexGraph();
  const network = useNetwork();
  const { showLoaderToast, showSuccessToast, showErrorToast } = useFlowToasts();

  const handleSubmit = async (formValues: Partial<SwapFormValues>) => {
    if (!tezos || !accountPkh) {
      return;
    }

    const { amount1, token1, token2, recipient, slippage, action } = formValues as SwapFormValues;

    showLoaderToast();
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
      showSuccessToast(t('swap|Swap completed!'));
    } catch (e) {
      showErrorToast(e);
      throw e;
    }
  };

  return useFormik({
    validationSchema,
    initialValues,
    initialErrors,
    onSubmit: handleSubmit,
    validateOnChange: true
  });
};
