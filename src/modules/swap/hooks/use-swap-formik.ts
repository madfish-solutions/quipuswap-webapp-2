import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';

import { TOKEN_TO_TOKEN_DEX } from '@config/config';
import { SECONDS_IN_MINUTE } from '@config/constants';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { getRouteWithInput, getTokenSlug, getTokenSymbol, toDecimals, getSwapMessage } from '@shared/helpers';
import { swap } from '@shared/helpers/swap';
import { useDexGraph } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { SwapTabAction } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { SwapField, SwapFormValues } from '../utils/types';
import { useValidationSchema } from './use-validation-schema';

const initialErrors = {
  inputAmount: 'Required',
  outputAmount: 'Required'
};

export const useSwapFormik = (initialAction = SwapTabAction.SWAP) => {
  const validationSchema = useValidationSchema();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dexGraph } = useDexGraph();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();

  const {
    settings: { tradingSlippage, transactionDeadline }
  } = useSettingsStore();

  const initialValues: Partial<SwapFormValues> = {
    [SwapField.ACTION]: initialAction
  };

  const handleSubmit = async (formValues: Partial<SwapFormValues>) => {
    if (!tezos || !accountPkh) {
      return;
    }

    const { inputAmount, inputToken, outputToken, recipient, action } = formValues;

    const rawInputAmount = toDecimals(inputAmount!, inputToken!);
    try {
      const walletOperation = await swap(tezos, accountPkh, {
        deadlineTimespan: transactionDeadline.times(SECONDS_IN_MINUTE).integerValue(BigNumber.ROUND_HALF_UP).toNumber(),
        inputAmount: rawInputAmount,
        inputToken: inputToken!,
        recipient: action === 'send' ? recipient : undefined,
        slippageTolerance: tradingSlippage.div(100),
        dexChain: getRouteWithInput({
          startTokenSlug: getTokenSlug(inputToken!),
          endTokenSlug: getTokenSlug(outputToken!),
          graph: dexGraph,
          inputAmount: rawInputAmount
        })!,
        ttDexAddress: TOKEN_TO_TOKEN_DEX
      });

      const inputTokenSymbol = getTokenSymbol(inputToken!);
      const outputTokenSymbol = getTokenSymbol(outputToken!);

      const swapMessage = getSwapMessage(inputTokenSymbol, outputTokenSymbol);

      await confirmOperation(walletOperation.opHash, {
        message: swapMessage
      });
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
