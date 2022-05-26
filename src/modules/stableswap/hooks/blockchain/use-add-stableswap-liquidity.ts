import { useCallback } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { decreaseBySlippage, isNull, toDecimals } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { AmountToken } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { addStableswapLiquidityApi } from '../../api';
import { getStableswapDeadline } from '../../helpers';
import { tokensAndAmountsMapper } from '../../mapping/tokens-and-amounts.map';
import { useStableswapItemStore, useStableswapItemFormStore } from '../store';

export const useAddStableswapLiquidity = () => {
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();

  const { tezos } = useRootStore();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const { item } = useStableswapItemStore();
  const { lpInputAmount, inputAmounts } = useStableswapItemFormStore();

  const addStableswapLiquidity = useCallback(async () => {
    if (isNull(tezos) || isNull(item) || isNull(lpInputAmount) || isNull(inputAmounts) || isNull(accountPkh)) {
      return;
    }

    const { lpToken, contractAddress, tokensInfo } = item;

    const tokens = tokensInfo.map(({ token }) => token);

    const deadline = getStableswapDeadline(transactionDeadline);

    const lpInputAmountAtom = toDecimals(lpInputAmount, lpToken);
    const lpInputAmountAtomWithSlippage = decreaseBySlippage(lpInputAmountAtom, liquiditySlippage);

    const tokensAndAmounts: Array<AmountToken> = tokensAndAmountsMapper(tokens, inputAmounts);

    try {
      const operation = await addStableswapLiquidityApi(
        tezos,
        contractAddress,
        lpInputAmountAtomWithSlippage,
        tokensAndAmounts,
        deadline,
        accountPkh
      );

      await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyAdded') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [
    tezos,
    item,
    lpInputAmount,
    inputAmounts,
    accountPkh,
    transactionDeadline,
    liquiditySlippage,
    confirmOperation,
    t,
    showErrorToast
  ]);

  return { addStableswapLiquidity };
};
