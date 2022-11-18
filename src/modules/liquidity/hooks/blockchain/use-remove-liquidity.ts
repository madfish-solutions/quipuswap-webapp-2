import BigNumber from 'bignumber.js';

import { FISRT_INDEX, LP_TOKEN_DECIMALS } from '@config/constants';
import { LP_TOKEN } from '@modules/liquidity/pages/cpmm-item/components/forms/helpers/mock-lp-token';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import {
  decreaseBySlippage,
  extractTokens,
  getTransactionDeadline,
  isExist,
  isNull,
  isTezosToken,
  sortTokens,
  toAtomic,
  toReal
} from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { tokensAndAmountsMapper } from '@shared/mapping';
import { amplitudeService } from '@shared/services';
import { Nullable } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { removeDexTwoLiquidityApi } from '../../api';
import { makeLiquidityOperationLogData } from '../../helpers';
import { useLiquidityItemStore } from '../store';

export const useRemoveLiquidity = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const { item } = useLiquidityItemStore();

  const removeLiquidity = async (inputAmounts: Array<Nullable<BigNumber>>, shares: BigNumber) => {
    if (isNull(tezos) || !isExist(item) || isNull(accountPkh) || !inputAmounts.every(isExist)) {
      return;
    }
    const itemId = item.id;
    const tokens = extractTokens(item.tokensInfo);

    const atomicAndDecresedInputAmounts = inputAmounts.map((amount: BigNumber, index: number) =>
      decreaseBySlippage(toAtomic(amount, tokens[index]), liquiditySlippage).minus(1).integerValue(BigNumber.ROUND_DOWN)
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, atomicAndDecresedInputAmounts).sort((a, b) =>
      sortTokens(a.token, b.token)
    );

    if (isTezosToken(tokensAndAmounts[FISRT_INDEX].token)) {
      tokensAndAmounts.reverse();
    }

    const atomicLpTokenBalance = toAtomic(shares, LP_TOKEN).integerValue(BigNumber.ROUND_DOWN);

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    const logData = makeLiquidityOperationLogData(
      toReal(atomicLpTokenBalance, LP_TOKEN_DECIMALS),
      liquiditySlippage,
      item
    );

    try {
      amplitudeService.logEvent('DEX_TWO_LIQUIDITY_REMOVE', logData);
      const operation = await removeDexTwoLiquidityApi(
        tezos,
        atomicLpTokenBalance,
        tokensAndAmounts,
        deadline,
        accountPkh,
        item.currentDelegate,
        itemId
      );
      await confirmOperation(operation.opHash, { message: t('liquidity|successfullyRemoved') });
      amplitudeService.logEvent('DEX_TWO_LIQUIDITY_REMOVE_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('DEX_TWO__LIQUIDITY_REMOVE_FAILED', { ...logData, error });
    }
  };

  return { removeLiquidity };
};
