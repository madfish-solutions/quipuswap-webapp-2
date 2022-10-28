import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { migrateLiquidity } from '@blockchain';
import { ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { useRootStore } from '@providers/root-store-provider';
import { isExist, isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { getUserTokensAmountByShares, getUserLpBalanceToMigrate, getLpBasedOnToken } from '../../helpers';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canMigrateLiquidity, setCanMigrateLiquidity] = useState(false);
  const [dexOneBalanceLP, setDexOneBalanceLP] = useState<BigNumber>(new BigNumber(ZERO_AMOUNT));

  const getMigrationParams = useCallback(async () => {
    const userLpBalanceToMigrate = await getUserLpBalanceToMigrate(tezos, accountPkh, itemStore);

    if (userLpBalanceToMigrate?.isGreaterThan(ZERO_AMOUNT)) {
      setCanMigrateLiquidity(true);
      setDexOneBalanceLP(userLpBalanceToMigrate);
    } else {
      setCanMigrateLiquidity(false);
    }
  }, [accountPkh, itemStore, tezos]);

  useEffect(() => {
    (async () => await getMigrationParams())();
  }, [getMigrationParams, itemStore, accountPkh, tezos]);

  const calculateTokensAmounts = () => {
    const accordanceItem = itemStore.accordanceItem;
    if (!accordanceItem) {
      return {
        amountA: ZERO_AMOUNT_BN,
        amountB: ZERO_AMOUNT_BN,
        shares: ZERO_AMOUNT_BN
      };
    }
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

    const lpBasedOnTokenA = getLpBasedOnToken(amountA, itemStore.totalLpSupply, itemStore.aTokenAtomicTvl);
    const lpBasedOnTokenB = getLpBasedOnToken(amountB, itemStore.totalLpSupply, itemStore.bTokenAtomicTvl);

    const shares = lpBasedOnTokenA.isLessThan(lpBasedOnTokenB) ? lpBasedOnTokenA : lpBasedOnTokenB;

    return {
      amountA,
      amountB,
      shares
    };
  };

  const handleMigrateLiquidity = async () => {
    setIsSubmitting(true);
    if (!canMigrateLiquidity) {
      return;
    }
    const { accordanceItem } = itemStore;

    if (!isExist(accordanceItem) || isNull(tezos) || isNull(accountPkh) || !isExist(itemStore.item)) {
      return;
    }

    const { tokens, contractAddress, type, id } = accordanceItem;

    const amounts = calculateTokensAmounts();
    const [aToken, bToken] = tokens;

    try {
      const operation = await migrateLiquidity(
        tezos,
        accountPkh,
        {
          contractAddress: itemStore.contractAddress,
          id: itemStore.item.id,
          tokensInfo: itemStore.item.tokensInfo,
          totalLpSupply: itemStore.item.totalSupply
        },
        {
          contractAddress,
          type,
          id,
          aToken,
          bToken
        },
        amounts,
        dexOneBalanceLP,
        transactionDeadline
      );
      await confirmOperation(operation.opHash, { message: t('newLiquidity|assetsMigrated') });
      await getMigrationParams();
    } catch (error) {
      showErrorToast(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { canMigrateLiquidity, handleMigrateLiquidity, isSubmitting };
};
