import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { getStableswapLiquidityLogData } from '@modules/stableswap/helpers/get-stableswap-liquidity-log-data';
import { useRootStore } from '@providers/root-store-provider';
import {
  cloneArray,
  decreaseByPercentage,
  getTransactionDeadline,
  isExist,
  isNull,
  saveBigNumber,
  toAtomic
} from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { tokensAndAmountsMapper } from '@shared/mapping';
import { amplitudeService } from '@shared/services';
import { Nullable, Token } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { removeStableswapLiquidityBalancedApi, removeStableswapLiquidityImbalancedApi } from '../../api';
import { applyStableswapFee } from '../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../store';

export const useRemoveStableswapLiquidity = () => {
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();

  const { tezos } = useRootStore();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const { accountPkh } = useAuthStore();
  const { item } = useStableswapItemStore();
  const { shares, isBalancedProportion } = useStableswapItemFormStore();

  const decreaseAmount = useCallback(
    (token: Token, amount: BigNumber, fees: Array<BigNumber>) => {
      const decreasedAmount = decreaseByPercentage(amount, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

      const decreasedAmountWithFee = applyStableswapFee(decreasedAmount, fees).integerValue(BigNumber.ROUND_DOWN);

      return {
        token,
        amount: decreasedAmountWithFee
      };
    },
    [liquiditySlippage]
  );

  const removeStableswapLiquidity = useCallback(
    async (inputAmounts: Nullable<BigNumber>[]) => {
      if (isNull(tezos) || isNull(item) || isNull(shares) || isNull(accountPkh) || !inputAmounts.some(isExist)) {
        return;
      }
      const { lpToken, contractAddress, tokensInfo, providersFee, stakersFee, interfaceFee, devFee } = item;

      const fees = [providersFee, stakersFee, interfaceFee, devFee];

      const tokens = tokensInfo.map(({ token }) => token);
      const deadline = await getTransactionDeadline(tezos, transactionDeadline);

      const atomicInputAmounts = inputAmounts.map((amount, index) =>
        toAtomic(saveBigNumber(amount, new BigNumber('0')), tokens[index]).integerValue(BigNumber.ROUND_DOWN)
      );

      const tokensAndAmounts = tokensAndAmountsMapper(tokens, atomicInputAmounts);
      const atomicShares = toAtomic(shares, lpToken);

      const message = t('stableswap|successfullyRemoved');
      const decreasedTokensAndAmounts = tokensAndAmounts.map(({ token, amount }) =>
        decreaseAmount(token, amount, fees)
      );

      const inputAmountsFixed = cloneArray(inputAmounts);
      inputAmountsFixed.pop();

      const logData = {
        stableswapLiquidityRemove: getStableswapLiquidityLogData(
          tokensInfo,
          inputAmountsFixed,
          shares,
          liquiditySlippage,
          item
        )
      };

      try {
        amplitudeService.logEvent('STABLESWAP_LIQUIDITY_REMOVE', logData);
        const operation = isBalancedProportion
          ? await removeStableswapLiquidityBalancedApi(
              tezos,
              contractAddress,
              decreasedTokensAndAmounts,
              atomicShares,
              deadline,
              accountPkh
            )
          : await removeStableswapLiquidityImbalancedApi(
              tezos,
              contractAddress,
              decreasedTokensAndAmounts,
              atomicShares,
              deadline,
              accountPkh
            );

        await confirmOperation(operation.opHash, { message });
        amplitudeService.logEvent('STABLESWAP_LIQUIDITY_REMOVE_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('STABLESWAP_LIQUIDITY_REMOVE_FAILED', { ...logData, error });
      }
    },
    [
      accountPkh,
      confirmOperation,
      decreaseAmount,
      isBalancedProportion,
      liquiditySlippage,
      item,
      shares,
      showErrorToast,
      t,
      tezos,
      transactionDeadline
    ]
  );

  return { removeStableswapLiquidity };
};
