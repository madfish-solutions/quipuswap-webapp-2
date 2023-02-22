import { useCallback } from 'react';

import BigNumber from 'bignumber.js';
import { Trade } from 'swap-router-sdk';

import { SECONDS_IN_MINUTE, ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { TOKEN_TO_TOKEN_DEX } from '@config/environment';
import { useTezos } from '@providers/use-dapp';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import {
  getDollarEquivalent,
  getTokenSymbol,
  getTokenSlug,
  toFraction,
  isExist,
  getPercentageFromNumber
} from '@shared/helpers';
import { useTokensStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { Nullable } from '@shared/types';

import { getSumOfFees } from '../helpers/get-sum-of-fees';
import { getUserRouteFeesInDollars } from '../helpers/get-user-rote-fees-in-dollars';
import { getUserRouteFeesAndSlug } from '../helpers/get-user-route-fees-and-slug';
import { ThreeRouteSwapResponse } from '../types';
import { SwapFormValues } from '../utils/types';

const STUB_THREE_ROUTE_FEE_PERCENTAGE = 0.1;

export const useGetSwapSendLogData = () => {
  const tezos = useTezos();
  const exchangeRates = useNewExchangeRates();
  const { tokens } = useTokensStore();

  const {
    settings: { tradingSlippage, transactionDeadline }
  } = useSettingsStore();

  return useCallback(
    (
      formValues: Partial<SwapFormValues>,
      threeRouteSwap: Nullable<ThreeRouteSwapResponse>,
      swapRouterSdkTradeNoSlippage: Nullable<Trade>,
      swapRouterSdkTradeWithSlippage: Nullable<Trade>
    ) => {
      const { inputAmount, outputAmount, inputToken, outputToken, recipient, action } = formValues;
      const inputTokenSlug = getTokenSlug(inputToken!);
      const outputTokenSlug = getTokenSlug(outputToken!);

      let sumOfUserFees: Record<'sumOfFees' | 'sumOfDevFees' | 'sumOfTotalFees', BigNumber>;
      if (isExist(swapRouterSdkTradeNoSlippage)) {
        const userRouteFeesAndSlug = getUserRouteFeesAndSlug(tezos, swapRouterSdkTradeNoSlippage, tokens);
        const userRouteFeesInDollars = getUserRouteFeesInDollars(userRouteFeesAndSlug, exchangeRates);
        // eslint-disable-next-line no-console
        console.log('fuflo1', JSON.stringify(userRouteFeesInDollars), swapRouterSdkTradeNoSlippage);
        sumOfUserFees = getSumOfFees(userRouteFeesInDollars);
      } else {
        const sumOfFees = getPercentageFromNumber(inputAmount!, new BigNumber(STUB_THREE_ROUTE_FEE_PERCENTAGE));
        sumOfUserFees = { sumOfFees, sumOfDevFees: ZERO_AMOUNT_BN, sumOfTotalFees: sumOfFees };
      }
      const { sumOfFees, sumOfDevFees, sumOfTotalFees } = sumOfUserFees;

      return {
        swap: {
          action,
          deadlineTimespan: transactionDeadline
            .times(SECONDS_IN_MINUTE)
            .integerValue(BigNumber.ROUND_HALF_UP)
            .toNumber(),
          inputAmount: inputAmount?.toNumber(),
          outputAmount: outputAmount?.toNumber(),
          recipient: action === 'send' ? recipient : undefined,
          slippageTolerance: toFraction(tradingSlippage).toNumber(),
          inputToken: inputTokenSlug,
          outputToken: outputTokenSlug,
          inputTokenSymbol: getTokenSymbol(inputToken!),
          outputTokenSymbol: getTokenSymbol(outputToken!),
          inputTokenUsd: Number(getDollarEquivalent(inputAmount, exchangeRates[inputTokenSlug])),
          outputTokenUsd: Number(getDollarEquivalent(outputAmount, exchangeRates[outputTokenSlug])),
          ttDexAddress: TOKEN_TO_TOKEN_DEX,
          path:
            threeRouteSwap?.chains.map(({ hops }) => hops.map(({ dex }) => dex.toFixed())).flat() ??
            swapRouterSdkTradeWithSlippage?.map(({ dexAddress, dexId }) =>
              getTokenSlug({ contractAddress: dexAddress, fa2TokenId: dexId?.toNumber() })
            ),
          pathLength:
            threeRouteSwap?.chains.reduce<number>((sum, { hops }) => sum + hops.length, ZERO_AMOUNT) ??
            swapRouterSdkTradeWithSlippage?.length,
          sumOfFees: sumOfFees.toNumber(),
          sumOfDevFees: sumOfDevFees.toNumber(),
          sumOfTotalFees: sumOfTotalFees.toNumber()
        }
      };
    },
    [exchangeRates, tezos, tokens, tradingSlippage, transactionDeadline]
  );
};
