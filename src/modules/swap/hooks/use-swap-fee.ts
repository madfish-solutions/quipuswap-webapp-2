import { useCallback } from 'react';

import { TEZOS_TOKEN } from '@config/tokens';
import { useAccountPkh, useEstimationToolkit } from '@providers/use-dapp';
import { defined, toReal, getTokenSlug, isEmptyArray } from '@shared/helpers';
import { useUpdateOnBlockSWR } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { Nullable, Undefined } from '@shared/types';

import { NoMediatorsSwapBlockchainApi, ThreeRouteBlockchainApi } from '../api';
import { getThreeRouteSwapSWRKey } from '../utils/get-three-route-swap-swr-key';
import { getTradeSWRKey } from '../utils/get-trade-swr-key';
import { SwapDetailsParams } from '../utils/types';
import { SwapFeeNotEnoughParametersError } from './use-swap-fee.errors';
import { useSwapStore } from './use-swap-store';

export const useRealSwapFee = ({
  inputToken,
  inputAmount,
  threeRouteSwap,
  noMediatorsTrade,
  recipient,
  outputToken
}: SwapDetailsParams) => {
  const accountPkh = useAccountPkh();
  const tezos = useEstimationToolkit();
  const {
    settings: { transactionDeadline, tradingSlippage }
  } = useSettingsStore();
  const swapStore = useSwapStore();

  const updateRealSwapFee = useCallback(
    async (_key: string, senderPkh: Nullable<string>, recipientPkh: Undefined<string>) => {
      const swapIsDefined = !isEmptyArray(threeRouteSwap?.chains ?? noMediatorsTrade);
      if (senderPkh && inputToken && swapIsDefined && inputAmount && outputToken) {
        try {
          const rawNewFee = isEmptyArray(threeRouteSwap?.chains ?? null)
            ? await NoMediatorsSwapBlockchainApi.estimateSwapFee(
                defined(tezos),
                senderPkh,
                defined(noMediatorsTrade),
                recipientPkh,
                transactionDeadline
              )
            : await ThreeRouteBlockchainApi.estimateSwapFee(
                defined(tezos),
                senderPkh,
                recipientPkh ?? senderPkh,
                inputToken,
                outputToken,
                swapStore.threeRouteTokens,
                defined(threeRouteSwap),
                tradingSlippage
              );

          return toReal(rawNewFee, TEZOS_TOKEN);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Estimate Fee Error:', error);
        }
      }

      throw new SwapFeeNotEnoughParametersError();
    },
    [
      inputToken,
      threeRouteSwap,
      noMediatorsTrade,
      inputAmount,
      tezos,
      swapStore,
      tradingSlippage,
      transactionDeadline,
      outputToken
    ]
  );

  return useUpdateOnBlockSWR(
    tezos,
    [
      'swap-fee',
      accountPkh,
      recipient,
      noMediatorsTrade && getTradeSWRKey(noMediatorsTrade),
      threeRouteSwap && getThreeRouteSwapSWRKey(threeRouteSwap),
      inputAmount?.toFixed(),
      inputToken && getTokenSlug(inputToken)
    ],
    updateRealSwapFee
  );
};
