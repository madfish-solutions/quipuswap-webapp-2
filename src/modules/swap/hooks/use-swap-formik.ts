import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import { getTradeOpParams, parseTransferParamsToParamsWithKind, Trade } from 'swap-router-sdk';

import { getApproveParams } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { SECONDS_IN_MINUTE } from '@config/constants';
import { TOKEN_TO_TOKEN_DEX } from '@config/enviroment';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import {
  getTokenSlug,
  getTokenSymbol,
  getSwapMessage,
  getDollarEquivalent,
  defined,
  getTokenAddress
} from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { DexPair, SwapTabAction, TokenAddress, Undefined } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { SwapField, SwapFormValues } from '../utils/types';
import { useValidationSchema } from './use-validation-schema';

const initialErrors = {
  inputAmount: 'Required',
  outputAmount: 'Required'
};

export const useSwapFormik = (
  initialAction = SwapTabAction.SWAP,
  dexRoute: Undefined<DexPair[]>,
  trade: Nullable<Trade>,
  exchangeRates: Record<string, BigNumber>
) => {
  const validationSchema = useValidationSchema();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
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
      let tradeTransferParams = await getTradeOpParams(
        defined(trade),
        accountPkh,
        tezos,
        STABLESWAP_REFERRAL,
        recipient,
        transactionDeadline.toNumber()
      );

      for (const item of trade!) {
        if (item.aTokenSlug === 'tez') {
          continue;
        }

        const aTokenAddressRaw = getTokenAddress(item.aTokenSlug);
        const aTokenAddress: TokenAddress =
          item.aTokenStandard === 'FA1_2' ? { contractAddress: aTokenAddressRaw.contractAddress } : aTokenAddressRaw;

        const approveParams = await getApproveParams(
          tezos,
          item.dexAddress,
          aTokenAddress,
          accountPkh,
          item.aTokenAmount,
          tradeTransferParams
        );

        tradeTransferParams = approveParams;
      }

      const walletParamsWithKind = tradeTransferParams.map(tradeTransferParam =>
        parseTransferParamsToParamsWithKind(tradeTransferParam)
      );

      const walletOperation = await tezos.wallet.batch(walletParamsWithKind).send();

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
