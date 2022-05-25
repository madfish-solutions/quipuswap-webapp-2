import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { decreaseBySlippage, isNull, toDecimals } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { AmountToken } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { addStableswapLiquidityApi } from '../../api';
import { getStableswapDeadline } from '../../helpers';
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
  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const { item } = stableswapItemStore;
  const { lpInputAmount, inputAmounts } = stableswapItemFormStore;

  const addStableswapLiquidity = useCallback(async () => {
    if (isNull(tezos) || isNull(item) || isNull(lpInputAmount) || isNull(inputAmounts) || isNull(accountPkh)) {
      return;
    }

    const {
      lpToken: {
        metadata: { decimals }
      },
      contractAddress
    } = item;

    const deadline = getStableswapDeadline(transactionDeadline);
    const lpInputAmountFixed = decreaseBySlippage(lpInputAmount, decimals, liquiditySlippage);

    const tokensAndAmounts: Array<AmountToken> = item.tokensInfo.map(({ token }, index) => {
      const _amount = inputAmounts[index];
      const amount = isNull(_amount) ? new BigNumber('0') : toDecimals(_amount, token);

      return { token, amount };
    });

    try {
      const operation = await addStableswapLiquidityApi(
        tezos,
        contractAddress,
        lpInputAmountFixed,
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
