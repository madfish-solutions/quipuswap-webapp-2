import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';

import { DEFAULT_DEADLINE_MINS, DEFAULT_SLIPPAGE_PERCENTAGE, TOKEN_TO_TOKEN_DEX } from '@config/config';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { getRouteWithInput, getTokenSlug, getTokenSymbol, toDecimals, getSwapMessage } from '@shared/helpers';
import { swap } from '@shared/helpers/swap';
import { useDexGraph } from '@shared/hooks';
import { SwapTabAction } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { SwapField, SwapFormValues } from '../utils/types';
import { useValidationSchema } from './use-validation-schema';

const initialErrors = {
  inputAmount: 'Required',
  outputAmount: 'Required'
};

const SECS_IN_MIN = 60;

export const useSwapFormik = (initialAction = SwapTabAction.SWAP) => {
  const validationSchema = useValidationSchema();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dexGraph } = useDexGraph();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();

  const initialValues: Partial<SwapFormValues> = {
    [SwapField.ACTION]: initialAction,
    [SwapField.SLIPPAGE]: new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE),
    [SwapField.DEADLINE]: new BigNumber(DEFAULT_DEADLINE_MINS)
  };

  const handleSubmit = async (formValues: Partial<SwapFormValues>) => {
    if (!tezos || !accountPkh) {
      return;
    }

    const { inputAmount, inputToken, outputToken, recipient, slippage, action, deadline } = formValues;

    const rawInputAmount = toDecimals(inputAmount!, inputToken!);
    try {
      const walletOperation = await swap(tezos, accountPkh, {
        deadlineTimespan: deadline!.times(SECS_IN_MIN).integerValue(BigNumber.ROUND_HALF_UP).toNumber(),
        inputAmount: rawInputAmount,
        inputToken: inputToken!,
        recipient: action === 'send' ? recipient : undefined,
        slippageTolerance: slippage!.div(100),
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
