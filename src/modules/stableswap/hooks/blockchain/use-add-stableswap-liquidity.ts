import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { STABLESWAP_LP_DECIMALS } from '@config/constants';
import { getStableswapLiquidityLogData } from '@modules/stableswap/helpers/get-stableswap-liquidity-log-data';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { decreaseBySlippage, fromDecimals, isExist, isNull, toDecimals } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { addStableswapLiquidityApi } from '../../api';
import { extractTokens, getStableswapDeadline, createAmountsMichelsonMap, apllyStableswapFee } from '../../helpers';
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

    const { contractAddress, tokensInfo, liquidityProvidersFee, stakersFee, interfaceFee, devFee } = item;

    const tokens = extractTokens(tokensInfo);
    const amountsAtoms = inputAmounts.map((amount, index) =>
      isNull(amount) || amount.isNaN()
        ? new BigNumber('0')
        : toDecimals(amount, tokens[index]).integerValue(BigNumber.ROUND_DOWN)
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, amountsAtoms);
    const shares = await calculateShares(amountsAtoms);

    const sharesWithFee = apllyStableswapFee(shares, [
      liquidityProvidersFee,
      stakersFee,
      interfaceFee,
      devFee
    ]).integerValue(BigNumber.ROUND_DOWN);

    const sharesWithSlippage = decreaseBySlippage(sharesWithFee, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

    const deadline = await getStableswapDeadline(tezos, transactionDeadline);

    const logData = {
      stableswapLiquidityAdd: getStableswapLiquidityLogData(
        tokensInfo,
        inputAmounts,
        fromDecimals(sharesWithFee, STABLESWAP_LP_DECIMALS),
        liquiditySlippage,
        item
      )
    };

    try {
      amplitudeService.logEvent('STABLESWAP_LIQUIDITY_ADD', logData);
      const operation = await addStableswapLiquidityApi(
        tezos,
        contractAddress,
        sharesWithSlippage,
        tokensAndAmounts,
        deadline,
        accountPkh
      );

      await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyAdded') });
      amplitudeService.logEvent('STABLESWAP_LIQUIDITY_ADD_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('STABLESWAP_LIQUIDITY_ADD_FAILED', { ...logData, error });
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
