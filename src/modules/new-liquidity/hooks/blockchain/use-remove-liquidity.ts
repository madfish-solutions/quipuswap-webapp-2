import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import { PERCENTAGE_100 } from '@config/constants';
import { removeDexTwoLiquidityApi } from '@modules/new-liquidity/api';
import { LP_TOKEN } from '@modules/new-liquidity/pages/item/components/forms/helpers/mock-lp-token';
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
  toAtomic
} from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { tokensAndAmountsMapper } from '@shared/mapping';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { useNewLiquidityItemStore } from '../store';

export const useRemoveLiquidity = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const { item } = useNewLiquidityItemStore();
  const lpTokenBalance = useTokenBalance(LP_TOKEN) ?? null;

  const removeLiquidity = async (inputAmounts: FormikValues) => {
    if (
      isNull(tezos) ||
      !isExist(item) ||
      isNull(lpTokenBalance) ||
      isNull(accountPkh) ||
      !inputAmounts.every(isExist)
    ) {
      return;
    }
    const itemId = item.id;
    const tokens = extractTokens(item.tokensInfo);

    const atomicInputAmounts = inputAmounts.map((amount: BigNumber, index: number) =>
      toAtomic(amount, tokens[index]).integerValue(BigNumber.ROUND_DOWN)
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, atomicInputAmounts).sort((a, b) =>
      sortTokens(a.token, b.token)
    );

    if (isTezosToken(tokensAndAmounts[0].token)) {
      tokensAndAmounts.reverse();
    }

    const atomicLpTokenBalance = toAtomic(lpTokenBalance, LP_TOKEN);

    const atomicLpTokenBalanceWithFee = atomicLpTokenBalance
      .multipliedBy(PERCENTAGE_100.minus(item.feesRate))
      .dividedBy(PERCENTAGE_100)
      .integerValue(BigNumber.ROUND_DOWN);

    const sharesWithSlippage = decreaseBySlippage(atomicLpTokenBalanceWithFee, liquiditySlippage).integerValue(
      BigNumber.ROUND_DOWN
    );

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    try {
      const operation = await removeDexTwoLiquidityApi(
        tezos,
        sharesWithSlippage,
        tokensAndAmounts,
        deadline,
        accountPkh,
        item.currentDelegate,
        itemId
      );
      await confirmOperation(operation.opHash, { message: t('stableswap|successfullyRemoved') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  };

  return { removeLiquidity };
};
