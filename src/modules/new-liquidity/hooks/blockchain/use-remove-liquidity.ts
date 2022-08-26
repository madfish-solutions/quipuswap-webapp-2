import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import { removeDexTwoLiquidityApi } from '@modules/new-liquidity/api';
import { LP_TOKEN } from '@modules/new-liquidity/pages/item/components/forms/helpers/mock-lp-token';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { decreaseBySlippage, extractTokens, getTransactionDeadline, isExist, isNull, toAtomic } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { tokensAndAmountsMapper } from '@shared/mapping';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { useNewLiquidityItemStore } from '../store';

// const MOCK_SHARES = new BigNumber(1000000);

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

  const removeLiquidity = async (inputAmounts: FormikValues, lpTokenBalance: Nullable<BigNumber>) => {
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

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, atomicInputAmounts);
    const atomicLpTokenBalance = toAtomic(lpTokenBalance, LP_TOKEN);

    // TODO: Fees for shares

    const sharesWithSlippage = decreaseBySlippage(atomicLpTokenBalance, liquiditySlippage).integerValue(
      BigNumber.ROUND_DOWN
    ); // should be shares with fee

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    try {
      const operation = await removeDexTwoLiquidityApi(
        tezos,
        sharesWithSlippage,
        tokensAndAmounts,
        deadline,
        accountPkh,
        itemId
      );
      await confirmOperation(operation.opHash, { message: t('stableswap|successfullyRemoved') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  };

  return { removeLiquidity };
};
