import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import {
  decreaseBySlippage,
  getFirstElement,
  increaseBySlippage,
  isExist,
  isNull,
  isSingleElement,
  toDecimals
} from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { AmountToken } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import {
  removeStableswapLiquidityBalancedApi,
  removeStableswapLiquidityImbalancedApi,
  removeStableswapLiquiditySingleCoinApi
} from '../../api';
import { getStableswapDeadline } from '../../helpers';
import { tokensAndAmountsMapper } from '../../mapping';
import { useStableswapItemFormStore, useStableswapItemStore } from '../store';

const isWithdrawInOneCoin = (tokensAndAmounts: Array<AmountToken>) => {
  const filteredTokenAmounts = tokensAndAmounts
    .map((element, index) => ({ ...element, index }))
    .filter(({ amount }) => amount.isGreaterThan('0'));

  return { isSingle: isSingleElement(filteredTokenAmounts), tokensAmounts: filteredTokenAmounts };
};

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
  const { shares, inputAmounts, isBalancedProportion } = useStableswapItemFormStore();

  const removeStableswapLiquidity = useCallback(async () => {
    if (isNull(tezos) || isNull(item) || isNull(shares) || isNull(accountPkh) || !inputAmounts.some(isExist)) {
      return;
    }
    const { lpToken, contractAddress, tokensInfo } = item;

    const tokens = tokensInfo.map(({ token }) => token);
    const deadline = getStableswapDeadline(transactionDeadline);
    const tokensAndAmounts = tokensAndAmountsMapper(tokens, inputAmounts);
    const sharesAmountAtom = toDecimals(shares, lpToken);

    const message = t('stableswap|sucessfullyRemoved');

    if (isBalancedProportion) {
      const decreasedTokensAndAmounts = tokensAndAmounts.map(({ token, amount }) => {
        const decreasedAmount = decreaseBySlippage(amount, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

        return {
          token,
          amount: decreasedAmount
        };
      });

      try {
        const operation = await removeStableswapLiquidityBalancedApi(
          tezos,
          contractAddress,
          decreasedTokensAndAmounts,
          sharesAmountAtom,
          deadline,
          accountPkh
        );

        await confirmOperation(operation.opHash, { message });
      } catch (error) {
        showErrorToast(error as Error);
      }
    } else {
      const { isSingle, tokensAmounts } = isWithdrawInOneCoin(tokensAndAmounts);

      if (isSingle) {
        const tokenAmount = getFirstElement(tokensAmounts);
        const index = new BigNumber(tokenAmount.index);
        const decreasedAmount = decreaseBySlippage(tokenAmount.amount, liquiditySlippage).integerValue(
          BigNumber.ROUND_DOWN
        );
        try {
          const operation = await removeStableswapLiquiditySingleCoinApi(
            tezos,
            contractAddress,
            index,
            decreasedAmount,
            sharesAmountAtom,
            deadline,
            accountPkh
          );

          await confirmOperation(operation.opHash, { message });
        } catch (error) {
          showErrorToast(error as Error);
        }
      } else {
        try {
          //TODO: validate!!!
          const increasedLpInputAmountAtom = increaseBySlippage(sharesAmountAtom, liquiditySlippage).integerValue(
            BigNumber.ROUND_DOWN
          );

          const operation = await removeStableswapLiquidityImbalancedApi(
            tezos,
            contractAddress,
            tokensAmounts,
            increasedLpInputAmountAtom,
            deadline,
            accountPkh
          );

          await confirmOperation(operation.opHash, { message });
        } catch (error) {
          showErrorToast(error as Error);
        }
      }
    }
  }, [
    accountPkh,
    confirmOperation,
    inputAmounts,
    isBalancedProportion,
    item,
    liquiditySlippage,
    shares,
    showErrorToast,
    t,
    tezos,
    transactionDeadline
  ]);

  return { removeStableswapLiquidity };
};
