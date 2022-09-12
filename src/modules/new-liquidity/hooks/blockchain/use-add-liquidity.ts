import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import { FISRT_INDEX, PERCENTAGE_100 } from '@config/constants';
import { addDexTwoLiquidityApi } from '@modules/new-liquidity/api/add-dex-two-liquidity.api';
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

import { useNewLiquidityItemStore } from '../store';

export const useAddLiquidity = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const { item } = useNewLiquidityItemStore();

  const addLiquidity = async (inputAmounts: FormikValues, candidate: string) => {
    if (isNull(tezos) || !isExist(item) || isNull(accountPkh) || !inputAmounts.every(isExist)) {
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

    if (isTezosToken(tokensAndAmounts[FISRT_INDEX].token)) {
      tokensAndAmounts.reverse();
    }

    const shares = atomicInputAmounts[FISRT_INDEX].multipliedBy(item.totalSupply)
      .dividedBy(item.tokensInfo[FISRT_INDEX].atomicTokenTvl)
      .decimalPlaces(LP_TOKEN.metadata.decimals);

    const sharesWithFee = shares
      .multipliedBy(PERCENTAGE_100.minus(item.feesRate))
      .dividedBy(PERCENTAGE_100)
      .integerValue(BigNumber.ROUND_DOWN);

    const sharesWithSlippage = decreaseBySlippage(sharesWithFee, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    try {
      const operation = await addDexTwoLiquidityApi(
        tezos,
        sharesWithSlippage,
        tokensAndAmounts,
        deadline,
        accountPkh,
        candidate,
        itemId
      );
      await confirmOperation(operation.opHash, { message: t('stableswap|successfullyAdded') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  };

  return { addLiquidity };
};
