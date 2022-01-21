import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';

import { DEFAULT_DEADLINE_MINS, DEFAULT_SLIPPAGE_PERCENTAGE, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { useDexGraph } from '@hooks/use-dex-graph';
import { useToasts } from '@hooks/use-toasts';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { getTokenSlug, swap, toDecimals } from '@utils/helpers';
import { getRouteWithInput } from '@utils/routing';

import { SwapAction, SwapField, SwapFormValues } from '../utils/types';
import { useValidationSchema } from './use-validation-schema';

const initialErrors = {
  inputAmount: 'Required',
  outputAmount: 'Required'
};
const initialValues: Partial<SwapFormValues> = {
  [SwapField.ACTION]: SwapAction.SWAP,
  [SwapField.SLIPPAGE]: new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE),
  [SwapField.DEADLINE]: new BigNumber(DEFAULT_DEADLINE_MINS)
};

const SECS_IN_MIN = 60;

export const useSwapFormik = () => {
  const validationSchema = useValidationSchema();
  const { t } = useTranslation(['common', 'swap']);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dexGraph } = useDexGraph();
  const { showLoaderToast, showSuccessToast, showErrorToast } = useToasts();

  const handleSubmit = async (formValues: Partial<SwapFormValues>) => {
    if (!tezos || !accountPkh) {
      return;
    }

    const { inputAmount, inputToken, outputToken, recipient, slippage, action, deadline } =
      formValues as SwapFormValues;

    showLoaderToast();
    const rawInputAmount = toDecimals(inputAmount, inputToken);
    try {
      await swap(tezos, accountPkh, {
        deadlineTimespan: deadline.times(SECS_IN_MIN).integerValue(BigNumber.ROUND_HALF_UP).toNumber(),
        inputAmount: rawInputAmount,
        inputToken: inputToken,
        recipient: action === 'send' ? recipient : undefined,
        slippageTolerance: slippage.div(100),
        dexChain: getRouteWithInput({
          startTokenSlug: getTokenSlug(inputToken),
          endTokenSlug: getTokenSlug(outputToken),
          graph: dexGraph,
          inputAmount: rawInputAmount
        })!,
        ttDexAddress: TOKEN_TO_TOKEN_DEX
      });
      showSuccessToast(t('swap|Swap completed!'));
    } catch (e) {
      showErrorToast(e as Error);
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
