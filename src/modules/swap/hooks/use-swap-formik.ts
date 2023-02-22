import { BatchWalletOperation } from '@taquito/taquito/dist/types/wallet/batch-operation';
import { useFormik } from 'formik';
import { getTradeOpParams, parseTransferParamsToParamsWithKind, Trade } from 'swap-router-sdk';

import { STABLESWAP_REFERRAL } from '@config/config';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { getTokenSymbol, getSwapMessage, defined, isExist } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { Nullable, SwapTabAction } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { doThreeRouteSwap } from '../api';
import { ThreeRouteSwapResponse } from '../types';
import { SwapField, SwapFormValues } from '../utils/types';
import { useGetSwapSendLogData } from './use-get-swap-send-log-data';
import { useSwapStore } from './use-swap-store';
import { useValidationSchema } from './use-validation-schema';

const initialErrors = {
  inputAmount: 'Required',
  outputAmount: 'Required'
};

export const useSwapFormik = (
  initialAction = SwapTabAction.SWAP,
  threeRouteSwap: Nullable<ThreeRouteSwapResponse>,
  swapRouterSdkTradeNoSlippage: Nullable<Trade>,
  swapRouterSdkTradeWithSlippage: Nullable<Trade>
) => {
  const validationSchema = useValidationSchema();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const getSwapSendLogData = useGetSwapSendLogData();
  const swapStore = useSwapStore();

  const {
    settings: { transactionDeadline, tradingSlippage }
  } = useSettingsStore();

  const initialValues: Partial<SwapFormValues> = {
    [SwapField.ACTION]: initialAction
  };

  const handleSubmit = async (formValues: Partial<SwapFormValues>) => {
    if (!tezos || !accountPkh) {
      return;
    }

    const { inputToken, outputToken, recipient } = formValues;

    const logData = getSwapSendLogData(
      formValues,
      threeRouteSwap,
      swapRouterSdkTradeNoSlippage,
      swapRouterSdkTradeWithSlippage
    );

    try {
      amplitudeService.logEvent('SWAP_SEND', logData);
      let walletOperation: BatchWalletOperation;

      if (isExist(threeRouteSwap)) {
        walletOperation = await doThreeRouteSwap(
          tezos,
          accountPkh,
          recipient ?? accountPkh,
          inputToken!,
          outputToken!,
          swapStore.threeRouteTokens,
          swapStore.threeRouteSwap,
          tradingSlippage
        );
      } else {
        const tradeTransferParams = await getTradeOpParams(
          defined(swapRouterSdkTradeWithSlippage),
          accountPkh,
          tezos,
          STABLESWAP_REFERRAL,
          recipient,
          transactionDeadline.toNumber(),
          QUIPUSWAP_REFERRAL_CODE.toNumber()
        );

        const walletParamsWithKind = tradeTransferParams.map(tradeTransferParam =>
          parseTransferParamsToParamsWithKind(tradeTransferParam)
        );

        walletOperation = await tezos.wallet.batch(walletParamsWithKind).send();
      }

      const inputTokenSymbol = getTokenSymbol(inputToken!);
      const outputTokenSymbol = getTokenSymbol(outputToken!);

      const swapMessage = getSwapMessage(inputTokenSymbol, outputTokenSymbol);

      await confirmOperation(walletOperation.opHash, {
        message: swapMessage
      });
      amplitudeService.logEvent('SWAP_SEND_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('SWAP_SEND_FAILED', { ...logData, error });
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
