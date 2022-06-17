import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { decreaseBySlippage, isExist, isNull, toDecimals } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { addStableswapLiquidityApi } from '../../api';
import { extractTokens, getStableswapDeadline, createAmountsMichelsonMap } from '../../helpers';
import { tokensAndAmountsMapper } from '../../mapping';
import { useStableswapItemStore, useStableswapItemFormStore } from '../store';
import { useCalcTokenAmountView } from '../use-calc-token-amount';

const IS_DEPOSIT = true;

export const useAddStableswapLiquidity = () => {
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const { calcTokenAmountView } = useCalcTokenAmountView(IS_DEPOSIT);
  const confirmOperation = useConfirmOperation();

  const { tezos } = useRootStore();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const { item } = useStableswapItemStore();
  const { inputAmounts } = useStableswapItemFormStore();

  const calculateShares = useCallback(
    async (amounts: Array<BigNumber>) => {
      const map = createAmountsMichelsonMap(amounts);

      return await calcTokenAmountView(map);
    },
    [calcTokenAmountView]
  );

  const addStableswapLiquidity = useCallback(async () => {
    if (isNull(tezos) || isNull(item) || isNull(accountPkh) || !inputAmounts.some(isExist)) {
      return;
    }

    const { contractAddress, tokensInfo } = item;

    const tokens = extractTokens(tokensInfo);
    const amountsAtoms = inputAmounts.map((amount, index) =>
      isNull(amount) || amount.isNaN() ? new BigNumber('0') : toDecimals(amount, tokens[index])
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, amountsAtoms);
    const shares = await calculateShares(amountsAtoms);
    const sharesWithSlippage = decreaseBySlippage(shares, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

    const deadline = getStableswapDeadline(transactionDeadline);

    try {
      const operation = await addStableswapLiquidityApi(
        tezos,
        contractAddress,
        sharesWithSlippage,
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
    accountPkh,
    inputAmounts,
    calculateShares,
    liquiditySlippage,
    transactionDeadline,
    confirmOperation,
    t,
    showErrorToast
  ]);

  return { addStableswapLiquidity };
};
