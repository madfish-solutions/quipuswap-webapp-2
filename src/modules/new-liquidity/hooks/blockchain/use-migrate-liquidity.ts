import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { migrateLiquidity } from '@blockchain';
import { ZERO_AMOUNT } from '@config/constants';
import { useRootStore } from '@providers/root-store-provider';
import { isExist, isNull, isUndefined } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { getUserTokensAmountByShares, checkMigrationParams } from '../../helpers';
import { useNewLiquidityItemStore } from '../store';

export const useMigrateLiquidity = () => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const itemStore = useNewLiquidityItemStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline }
  } = useSettingsStore();
  const [canMigrateLiquidity, setCanMigrateLiquidity] = useState(false);
  const [dexOneBalanceLP, setDexOneBalanceLP] = useState<BigNumber>(new BigNumber(ZERO_AMOUNT));

  useEffect(() => {
    (async () => {
      const migrationParams = await checkMigrationParams(tezos, accountPkh, itemStore);

      if (isExist(migrationParams)) {
        setCanMigrateLiquidity(migrationParams.canMigrateLiquidity);
        setDexOneBalanceLP(migrationParams.userLpBalance);
      }
    })();
  }, [canMigrateLiquidity, itemStore, accountPkh, tezos]);

  const calculateTokensAmounts = () => {
    const accordanceItem = itemStore.accordanceItem!;
    const amountA = getUserTokensAmountByShares(
      accordanceItem.aTokenAtomicTvl,
      dexOneBalanceLP,
      accordanceItem.totalLpSupply
    );
    const amountB = getUserTokensAmountByShares(
      accordanceItem.bTokenAtomicTvl,
      dexOneBalanceLP,
      accordanceItem.totalLpSupply
    );

    const lpBasedOnTokenA = amountA
      .multipliedBy(itemStore.totalLpSupply)
      .dividedBy(itemStore.aTokenAtomicTvl)
      .integerValue(BigNumber.ROUND_DOWN);
    const lpBasedOnTokenB = amountB
      .multipliedBy(itemStore.totalLpSupply)
      .dividedBy(itemStore.bTokenAtomicTvl)
      .integerValue(BigNumber.ROUND_DOWN);

    const shares = lpBasedOnTokenA.isLessThan(lpBasedOnTokenB) ? lpBasedOnTokenA : lpBasedOnTokenB;

    return {
      amountA,
      amountB,
      shares
    };
  };

  const onMigrateLiquidity = async () => {
    if (!canMigrateLiquidity) {
      return;
    }
    const accordanceItem = itemStore.accordanceItem;

    if (isNull(accordanceItem) || isNull(tezos) || isNull(accountPkh) || isUndefined(accordanceItem)) {
      return;
    }

    const amounts = calculateTokensAmounts();

    try {
      const operation = await migrateLiquidity(
        tezos,
        accountPkh,
        { contractAddress: itemStore.contractAddress, id: itemStore.item.id, tokensInfo: itemStore.item.tokensInfo },
        {
          contractAddress: accordanceItem.contractAddress,
          type: accordanceItem.type,
          id: accordanceItem.id,
          aToken: accordanceItem.aToken,
          bToken: accordanceItem.bToken
        },
        amounts,
        dexOneBalanceLP,
        transactionDeadline
      );
      await confirmOperation(operation.opHash, { message: t('newLiquidity|assetsMigrated') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  };

  return { canMigrateLiquidity, onMigrateLiquidity };
};
