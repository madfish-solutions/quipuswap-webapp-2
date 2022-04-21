import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';

import { TOKEN_TO_TOKEN_DEX } from '@config/config';
import { SECONDS_IN_MINUTE } from '@config/constants';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import {
  getRouteWithInput,
  getTokenSlug,
  getTokenSymbol,
  toDecimals,
  getSwapMessage,
  getDollarEquivalent
} from '@shared/helpers';
import { swap } from '@shared/helpers/swap';
import { useDexGraph } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { DexPair, SwapTabAction } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { SwapField, SwapFormValues } from '../utils/types';
import { useValidationSchema } from './use-validation-schema';

const initialErrors = {
  inputAmount: 'Required',
  outputAmount: 'Required'
};

export const useSwapFormik = (
  initialAction = SwapTabAction.SWAP,
  dexRoute: DexPair[] | undefined,
  exchangeRates: Record<string, BigNumber>
) => {
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

    const { inputAmount, outputAmount, inputToken, outputToken, recipient, action } = formValues;

    const rawInputAmount = toDecimals(inputAmount!, inputToken!);

    const inputTokenSlug = getTokenSlug(inputToken!);
    const outputTokenSlug = getTokenSlug(outputToken!);
    const logData = {
      swap: {
        action,
        deadlineTimespan: transactionDeadline.times(SECONDS_IN_MINUTE).integerValue(BigNumber.ROUND_HALF_UP).toNumber(),
        inputAmount: Number(inputAmount?.toFixed()),
        outputAmount: Number(outputAmount?.toFixed()),
        recipient: action === 'send' ? recipient : undefined,
        slippageTolerance: Number(tradingSlippage.div(100).toFixed()),
        inputToken: inputTokenSlug,
        outputToken: outputTokenSlug,
        inputTokenSymbol: getTokenSymbol(inputToken!),
        outputTokenSymbol: getTokenSymbol(outputToken!),
        inputTokenUsd: Number(getDollarEquivalent(inputAmount, exchangeRates[inputTokenSlug])),
        outputTokenUsd: Number(getDollarEquivalent(outputAmount, exchangeRates[outputTokenSlug])),
        ttDexAddress: TOKEN_TO_TOKEN_DEX,
        path: dexRoute?.map(dex => dex.id),
        pathLength: dexRoute?.length
      }
    };

    try {
      amplitudeService.logEvent('SWAP_SEND', logData);
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
      amplitudeService.logEvent('SWAP_SEND_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('SWAP_SEND_FIELD', { ...logData, error });
      throw error;
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
