import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';

import { useDexGraph } from '@hooks/use-dex-graph';
import { useFlowToasts } from '@hooks/use-flow-toasts';
import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { DEFAULT_SLIPPAGE_PERCENTAGE, TTDEX_CONTRACTS } from '@utils/defaults';
import { getTokenSlug, swap, toDecimals } from '@utils/helpers';
import { getRouteWithInput } from '@utils/routing';

import { SwapAction, SwapFormValues } from '../utils/types';
import { useValidationSchema } from './use-validation-schema';

const initialErrors = {
  inputAmount: 'Required',
  outputAmount: 'Required'
};
const initialValues: Partial<SwapFormValues> = {
  action: SwapAction.SWAP,
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

    const { inputAmount, token1, token2, recipient, slippage, action } = formValues as SwapFormValues;

    showLoaderToast();
    const rawInputAmount = toDecimals(inputAmount, token1);
    try {
      await swap(tezos, accountPkh, {
        inputAmount: rawInputAmount,
        inputToken: token1,
        recipient: action === 'send' ? recipient : undefined,
        slippageTolerance: slippage.div(100),
        dexChain: getRouteWithInput({
          startTokenSlug: getTokenSlug(token1),
          endTokenSlug: getTokenSlug(token2),
          graph: dexGraph,
          inputAmount: rawInputAmount
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
