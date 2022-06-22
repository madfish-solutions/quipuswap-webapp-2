import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { decreaseBySlippage, isExist, isNull, saveBigNumber, toDecimals } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { Token } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { removeStableswapLiquidityBalancedApi, removeStableswapLiquidityImbalancedApi } from '../../api';
import { apllyStableswapFee, getStableswapDeadline } from '../../helpers';
import { tokensAndAmountsMapper } from '../../mapping';
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
  const { shares, inputAmounts, isBalancedProportion } = useStableswapItemFormStore();

  const decreaseAmount = useCallback(
    (token: Token, amount: BigNumber, fees: Array<BigNumber>) => {
      const decreasedAmount = decreaseBySlippage(amount, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

      const decreasedAmountWithFee = apllyStableswapFee(decreasedAmount, fees).integerValue(BigNumber.ROUND_DOWN);

      return {
        token,
        amount: decreasedAmountWithFee
      };
    },
    [liquiditySlippage]
  );

  const removeStableswapLiquidity = useCallback(async () => {
    if (isNull(tezos) || isNull(item) || isNull(shares) || isNull(accountPkh) || !inputAmounts.some(isExist)) {
      return;
    }
    const { lpToken, contractAddress, tokensInfo, liquidityProvidersFee, stakersFee, interfaceFee, devFee } = item;

    const fees = [liquidityProvidersFee, stakersFee, interfaceFee, devFee];

    const tokens = tokensInfo.map(({ token }) => token);
    const deadline = getStableswapDeadline(transactionDeadline);

    const amountsAtoms = inputAmounts.map((amount, index) =>
      toDecimals(saveBigNumber(amount, new BigNumber('0')), tokens[index])
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, amountsAtoms);
    const sharesAmountAtom = toDecimals(shares, lpToken);

    const message = t('stableswap|sucessfullyRemoved');
    const decreasedTokensAndAmounts = tokensAndAmounts.map(({ token, amount }) => decreaseAmount(token, amount, fees));

    if (isBalancedProportion) {
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
      try {
        const operation = await removeStableswapLiquidityImbalancedApi(
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
    }
  }, [
    accountPkh,
    confirmOperation,
    decreaseAmount,
    inputAmounts,
    isBalancedProportion,
    item,
    shares,
    showErrorToast,
    t,
    tezos,
    transactionDeadline
  ]);

  return { removeStableswapLiquidity };
};
