import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { STABLESWAP_LP_DECIMALS } from '@config/constants';
import { getStableswapLiquidityLogData } from '@modules/stableswap/helpers/get-stableswap-liquidity-log-data';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import {
  decreaseBySlippage,
  toReal,
  isExist,
  isNull,
  toAtomic,
  extractTokens,
  getTransactionDeadline,
  determineTwoAssetsDexPoolTypeAmplitude
} from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { tokensAndAmountsMapper } from '@shared/mapping';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { addStableswapLiquidityApi } from '../../api';
import { createAmountsMichelsonMap, applyStableswapFee } from '../../helpers';
import { useStableswapItemStore } from '../store';
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

  const calculateShares = useCallback(
    async (amounts: Array<BigNumber>) => {
      const map = createAmountsMichelsonMap(amounts);

      return await calcTokenAmountView(map);
    },
    [calcTokenAmountView]
  );

  const addStableswapLiquidity = useCallback(
    async (inputAmounts: Nullable<BigNumber>[]) => {
      if (isNull(tezos) || isNull(item) || isNull(accountPkh) || !inputAmounts.some(isExist)) {
        return;
      }

      const { contractAddress, tokensInfo, providersFee, stakersFee, interfaceFee, devFee } = item;

      const tokens = extractTokens(tokensInfo);
      const poolType = determineTwoAssetsDexPoolTypeAmplitude(tokens);

      const atomicInputAmounts = inputAmounts.map((amount, index) =>
        isNull(amount) || amount.isNaN()
          ? new BigNumber('0')
          : toAtomic(amount, tokens[index]).integerValue(BigNumber.ROUND_DOWN)
      );

      const tokensAndAmounts = tokensAndAmountsMapper(tokens, atomicInputAmounts);
      const shares = await calculateShares(atomicInputAmounts);

      const sharesWithFee = applyStableswapFee(shares, [providersFee, stakersFee, interfaceFee, devFee]).integerValue(
        BigNumber.ROUND_DOWN
      );

      const sharesWithSlippage = decreaseBySlippage(sharesWithFee, liquiditySlippage).integerValue(
        BigNumber.ROUND_DOWN
      );

      const deadline = await getTransactionDeadline(tezos, transactionDeadline);

      const logData = {
        stableswapLiquidityAdd: getStableswapLiquidityLogData(
          tokensInfo,
          inputAmounts,
          toReal(sharesWithFee, STABLESWAP_LP_DECIMALS),
          liquiditySlippage,
          item,
          poolType
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

        await confirmOperation(operation.opHash, { message: t('stableswap|successfullyAdded') });
        amplitudeService.logEvent('STABLESWAP_LIQUIDITY_ADD_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('STABLESWAP_LIQUIDITY_ADD_FAILED', { ...logData, error });
      }
    },
    [
      tezos,
      item,
      accountPkh,
      calculateShares,
      liquiditySlippage,
      transactionDeadline,
      confirmOperation,
      t,
      showErrorToast
    ]
  );

  return { addStableswapLiquidity };
};
