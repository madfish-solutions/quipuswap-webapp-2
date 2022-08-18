import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import { addNewLiquidityApi } from '@modules/new-liquidity/api/add-liquidity.api';
import { extractTokens, getNewLiquidityDeadline } from '@modules/new-liquidity/helpers';
import { tokensAndAmountsMapper } from '@modules/new-liquidity/mapping';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { decreaseBySlippage, isExist, isNull, toAtomic } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
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
    const tokens = extractTokens(item);

    const atomicInputAmounts = inputAmounts.map((amount: BigNumber, index: number) =>
      toAtomic(amount, tokens[index]).integerValue(BigNumber.ROUND_DOWN)
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, atomicInputAmounts);
    const shares = atomicInputAmounts[0]
      .multipliedBy(item.totalSupply)
      .dividedToIntegerBy(item?.tokensInfo[0].atomicTokenTvl);

    // TODO: Fees for shares

    const sharesWithSlippage = decreaseBySlippage(shares, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN); // should be shares with fee

    const deadline = await getNewLiquidityDeadline(tezos, transactionDeadline);

    try {
      const operation = await addNewLiquidityApi(
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
