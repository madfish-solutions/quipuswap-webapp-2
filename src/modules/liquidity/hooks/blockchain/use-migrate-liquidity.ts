import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { migrateLiquidity } from '@blockchain';
import { ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { useRootStore } from '@providers/root-store-provider';
import { getTokensNames, isExist, isNull, multipliedIfPossible, toReal } from '@shared/helpers';
import { useAuthStore, useTokenExchangeRate } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import {
  getUserTokensAmountByShares,
  getUserLpBalanceToMigrate,
  getLpBasedOnToken,
  fetchCurrentPoolReserves
} from '../../helpers';
import { useLiquidityItemStore } from '../store';

export const useMigrateLiquidity = () => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const itemStore = useLiquidityItemStore();
  const confirmOperation = useConfirmOperation();
  const { getTokenExchangeRate } = useTokenExchangeRate();
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

  const calculateTokensAmounts = async () => {
    const accordanceItem = itemStore.accordanceItem;
    if (!accordanceItem || isNull(tezos)) {
      return {
        amountA: ZERO_AMOUNT_BN,
        amountB: ZERO_AMOUNT_BN,
        shares: ZERO_AMOUNT_BN
      };
    }
    const { aTokenAtomicTvl, bTokenAtomicTvl, totalLpSupply } = await fetchCurrentPoolReserves(tezos, {
      id: accordanceItem.id,
      type: accordanceItem.type,
      contractAddress: accordanceItem.contractAddress
    });

    const amountA = getUserTokensAmountByShares(aTokenAtomicTvl, dexOneBalanceLP, totalLpSupply);
    const amountB = getUserTokensAmountByShares(bTokenAtomicTvl, dexOneBalanceLP, totalLpSupply);

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

    const amounts = await calculateTokensAmounts();

    const [aToken, bToken] = tokens;

    const amountA = toReal(amounts.amountA, aToken);
    const amountB = toReal(amounts.amountB, bToken);
    const logData = {
      fromVersion: 'v1',
      toVersion: 'v2',
      poolName: getTokensNames(tokens),
      amountA: amountA.toNumber(),
      amountB: amountB.toNumber(),
      amountAUsd: multipliedIfPossible(amountA, getTokenExchangeRate(aToken))?.toNumber(),
      amountBUsd: multipliedIfPossible(amountB, getTokenExchangeRate(bToken))?.toNumber()
    };

    try {
      amplitudeService.logEvent('MIGRATE', logData);
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
      await confirmOperation(operation.opHash, { message: t('liquidity|assetsMigrated') });
      await getMigrationParams();
      amplitudeService.logEvent('MIGRATE_SUCCESS', logData);
    } catch (error) {
      amplitudeService.logEvent('MIGRATE_ERROR', {
        ...logData,
        error
      });
      showErrorToast(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { canMigrateLiquidity, handleMigrateLiquidity, isSubmitting };
};
