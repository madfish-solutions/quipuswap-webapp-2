import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { SECONDS_IN_MINUTE, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { useDexGraph } from '@hooks/use-dex-graph';
import { useBalances } from '@providers/BalancesProvider';
import { useAccountPkh, useEstimationToolkit } from '@utils/dapp';
import { estimateSwapFee, fromDecimals, getTokenSlug, isExist } from '@utils/helpers';
import { getRouteWithInput } from '@utils/routing';
import { WhitelistedToken } from '@utils/types';

const MIN_TEZOS_BALANCE_FOR_ESTIMATION = 2;
const TEZ_TO_LEAVE = '0.1';

interface TezosCapCalculationParams {
  inputToken?: WhitelistedToken;
  outputToken?: WhitelistedToken;
  deadlineTimespanMins?: BigNumber;
  slippagePercentage?: BigNumber;
  recipient?: string;
}

export const useEstimateTezosCap = () => {
  const { balances } = useBalances();
  const { dexGraph } = useDexGraph();
  const tezos = useEstimationToolkit();
  const accountPkh = useAccountPkh();

  return useCallback(
    async (params: TezosCapCalculationParams) => {
      const { inputToken, outputToken, deadlineTimespanMins, slippagePercentage, recipient } = params;

      const deadlineTimespan = deadlineTimespanMins
        ?.times(SECONDS_IN_MINUTE)
        .integerValue(BigNumber.ROUND_HALF_UP)
        .toNumber();
      const slippageTolerance = slippagePercentage?.dividedBy(100);

      try {
        const tezBalance = balances[getTokenSlug(TEZOS_TOKEN)];

        if (
          tezBalance?.gt(MIN_TEZOS_BALANCE_FOR_ESTIMATION) &&
          inputToken &&
          outputToken &&
          isExist(deadlineTimespan) &&
          slippageTolerance
        ) {
          const inputAmount = tezBalance.minus(1);

          const dexChain = getRouteWithInput({
            inputAmount,
            graph: dexGraph,
            startTokenSlug: getTokenSlug(TEZOS_TOKEN),
            endTokenSlug: getTokenSlug(outputToken)
          });

          if (dexChain && tezos && accountPkh) {
            const estimatedFee = await estimateSwapFee(tezos, accountPkh, {
              deadlineTimespan,
              inputToken,
              inputAmount,
              dexChain,
              slippageTolerance,
              ttDexAddress: TOKEN_TO_TOKEN_DEX,
              recipient
            });

            return new BigNumber(TEZ_TO_LEAVE).plus(fromDecimals(estimatedFee, TEZOS_TOKEN));
          }
        }
      } catch (_) {
        // return statement is below
      }

      return new BigNumber(TEZ_TO_LEAVE);
    },
    [accountPkh, balances, dexGraph, tezos]
  );
};
