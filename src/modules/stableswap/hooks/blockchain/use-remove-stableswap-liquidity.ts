import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { getStableswapLiquidityLogData } from '@modules/stableswap/helpers/get-stableswap-liquidity-log-data';
import { useRootStore } from '@providers/root-store-provider';
import { decreaseBySlippage, isExist, isNull, saveBigNumber, toDecimals } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
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
    const deadline = await getStableswapDeadline(tezos, transactionDeadline);

    const amountsAtoms = inputAmounts.map((amount, index) =>
      toDecimals(saveBigNumber(amount, new BigNumber('0')), tokens[index]).integerValue(BigNumber.ROUND_DOWN)
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, amountsAtoms);
    const sharesAmountAtom = toDecimals(shares, lpToken);

    const message = t('stableswap|sucessfullyRemoved');
    const decreasedTokensAndAmounts = tokensAndAmounts.map(({ token, amount }) => decreaseAmount(token, amount, fees));

    const logData = {
      stableswapLiquidityRemove: getStableswapLiquidityLogData(
        tokensInfo,
        inputAmounts,
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
            sharesAmountAtom,
            deadline,
            accountPkh
          )
        : await removeStableswapLiquidityImbalancedApi(
            tezos,
            contractAddress,
            decreasedTokensAndAmounts,
            sharesAmountAtom,
            deadline,
            accountPkh
          );

      await confirmOperation(operation.opHash, { message });
      amplitudeService.logEvent('STABLESWAP_LIQUIDITY_REMOVE_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('STABLESWAP_LIQUIDITY_REMOVE_FAILED', { ...logData, error });
    }
  }, [
    accountPkh,
    confirmOperation,
    decreaseAmount,
    inputAmounts,
    isBalancedProportion,
    liquiditySlippage,
    item,
    shares,
    showErrorToast,
    t,
    tezos,
    transactionDeadline
  ]);

  return { removeStableswapLiquidity };
};
