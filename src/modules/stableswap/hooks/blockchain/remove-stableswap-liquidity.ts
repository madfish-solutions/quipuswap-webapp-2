/* eslint-disable no-console */
import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { decreaseBySlippage, isNull, toDecimals } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { AmountToken } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { removeStableswapLiquidityApi } from '../../api';
import { getStableswapDeadline } from '../../helpers';
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
  const { lpInputAmount, inputAmounts, isBalancedProportion } = useStableswapItemFormStore();

  const removeStableswapLiquidity = useCallback(async () => {
    if (isNull(tezos) || isNull(item) || isNull(lpInputAmount) || isNull(inputAmounts) || isNull(accountPkh)) {
      return;
    }

    const { lpToken, contractAddress, tokensInfo } = item;

    const tokens = tokensInfo.map(({ token }) => token);

    const deadline = getStableswapDeadline(transactionDeadline);

    const lpInputAmountAtom = toDecimals(lpInputAmount, lpToken);
    const lpInputAmountAtomWithSlippage = decreaseBySlippage(lpInputAmountAtom, liquiditySlippage).integerValue(
      BigNumber.ROUND_DOWN
    );
    const tokensAndAmounts: Array<AmountToken> = tokensAndAmountsMapper(tokens, inputAmounts);
    console.log({ tokensAndAmounts });
    try {
      const operation = await removeStableswapLiquidityApi(
        tezos,
        contractAddress,
        tokensAndAmounts,
        lpInputAmountAtomWithSlippage,
        deadline,
        accountPkh,
        isBalancedProportion
      );

      await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyRemoved') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [
    accountPkh,
    confirmOperation,
    inputAmounts,
    isBalancedProportion,
    item,
    liquiditySlippage,
    lpInputAmount,
    showErrorToast,
    t,
    tezos,
    transactionDeadline
  ]);

  return { removeStableswapLiquidity };
};
