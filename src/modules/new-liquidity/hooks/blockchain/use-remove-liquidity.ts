import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import { FISRT_INDEX } from '@config/constants';
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
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { tokensAndAmountsMapper } from '@shared/mapping';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { removeDexTwoLiquidityApi } from '../../api';
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

  const removeLiquidity = async (inputAmounts: FormikValues, shares: BigNumber) => {
    if (isNull(tezos) || !isExist(item) || isNull(accountPkh) || !inputAmounts.every(isExist)) {
      return;
    }
    const itemId = item.id;
    const tokens = extractTokens(item.tokensInfo);

    const atomicAndDecresedInputAmounts = inputAmounts.map((amount: BigNumber, index: number) =>
      decreaseBySlippage(toAtomic(amount, tokens[index]), liquiditySlippage).integerValue(BigNumber.ROUND_DOWN)
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, atomicAndDecresedInputAmounts).sort((a, b) =>
      sortTokens(a.token, b.token)
    );

    if (isTezosToken(tokensAndAmounts[FISRT_INDEX].token)) {
      tokensAndAmounts.reverse();
    }

    const atomicLpTokenBalance = toAtomic(shares, LP_TOKEN).integerValue(BigNumber.ROUND_DOWN);

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    try {
      const operation = await removeDexTwoLiquidityApi(
        tezos,
        atomicLpTokenBalance,
        tokensAndAmounts,
        deadline,
        accountPkh,
        item.currentDelegate,
        itemId
      );
      await confirmOperation(operation.opHash, { message: t('newLiquidity|successfullyRemoved') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  };

  return { removeLiquidity };
};
