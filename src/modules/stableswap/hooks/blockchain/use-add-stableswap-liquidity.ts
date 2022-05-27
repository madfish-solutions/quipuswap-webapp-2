import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { decreaseBySlippage, increaseBySlippage, isNull, toDecimals } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { AmountToken } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { addStableswapLiquidityApi } from '../../api';
import { extractTokens, getStableswapDeadline } from '../../helpers';
import { tokensAndAmountsMapper } from '../../mapping/tokens-and-amounts.map';
import { useStableswapItemStore, useStableswapItemFormStore } from '../store';
import { useCalcTokenAmountView } from '../use-calc-token-amount';
import { createAmountsMichelsonMap } from './../../helpers/create-amount-michelson-map';

const IS_DEPOSIT = true;

export const useAddStableswapLiquidity = () => {
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { calcTokenAmountView } = useCalcTokenAmountView(IS_DEPOSIT);

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
    if (isNull(tezos) || isNull(item) || isNull(accountPkh)) {
      return;
    }

    const { contractAddress, tokensInfo } = item;

    const tokens = extractTokens(tokensInfo);
    const amountsAtoms = inputAmounts.map((amount, index) =>
      amount.isNaN() ? new BigNumber('0') : toDecimals(amount, tokens[index])
    );
    const amountsAtomsWithSlippage = amountsAtoms.map(atom =>
      increaseBySlippage(atom, liquiditySlippage).integerValue(BigNumber.ROUND_UP)
    );

    const tokensAndAmounts: Array<AmountToken> = tokensAndAmountsMapper(tokens, amountsAtomsWithSlippage);

    const shares = await calculateShares(amountsAtomsWithSlippage);

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
    inputAmounts,
    accountPkh,
    calculateShares,
    liquiditySlippage,
    transactionDeadline,
    confirmOperation,
    t,
    showErrorToast
  ]);

  return { addStableswapLiquidity };
};
