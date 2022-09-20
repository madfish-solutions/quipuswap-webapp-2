import { useEffect, useState } from 'react';

import { batchify } from '@quipuswap/sdk';
import { ContractMethod, TransferParams, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';
import { useRootStore } from '@providers/root-store-provider';
import { getBlockchainTimestamp, isExist, isNull, isTezosToken, isUndefined } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { getDexOneRemoveLiquidityParams } from '../../api';
import { calculateAmountReceived, checkMigrationParams } from '../../helpers';
import { useNewLiquidityItemStore } from '../store';

export const useMigrateLiquidity = () => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const itemStore = useNewLiquidityItemStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { t } = useTranslation();
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
    const amountA = calculateAmountReceived(
      accordanceItem.aTokenAtomicTvl,
      dexOneBalanceLP,
      accordanceItem.totalLpSupply
    );
    const amountB = calculateAmountReceived(
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

    const dexTwoShares = lpBasedOnTokenA.isLessThan(lpBasedOnTokenB) ? lpBasedOnTokenA : lpBasedOnTokenB;

    return {
      amountA,
      amountB,
      dexTwoShares
    };
  };

  const getAddLiqParams = async (
    amountA: BigNumber,
    amountB: BigNumber,
    shares: BigNumber,
    transactionDeadline: string
  ) => {
    const dexTwoContract = await tezos!.wallet.at(itemStore.contractAddress);
    let addLiqParams: ContractMethod<Wallet> | TransferParams = dexTwoContract.methods.invest_liquidity(
      itemStore.id,
      amountA,
      amountB,
      shares,
      accountPkh,
      'tz1burnburnburnburnburnburnburjAYjjX',
      transactionDeadline
    );

    if (itemStore.item.tokensInfo.some(({ token }) => isTezosToken(token))) {
      addLiqParams = addLiqParams.toTransferParams({
        mutez: true,
        amount: amountB.toNumber()
      });
    } else {
      addLiqParams = addLiqParams.toTransferParams();
    }

    return addLiqParams;
  };

  const onMigrateLiquidity = async () => {
    if (!canMigrateLiquidity) {
      return;
    }
    const accordanceItem = itemStore.accordanceItem;

    if (isNull(accordanceItem) || isNull(tezos) || isNull(accountPkh) || isUndefined(accordanceItem)) {
      return;
    }

    const { amountA, amountB, dexTwoShares } = calculateTokensAmounts();

    const transactionDeadline = (await getBlockchainTimestamp(tezos, 36000)).toString();
    const removeLiqParams = await getDexOneRemoveLiquidityParams(
      tezos,
      accordanceItem.contractAddress,
      accordanceItem.type,
      amountA,
      amountB,
      dexOneBalanceLP,
      transactionDeadline,
      accordanceItem.id
    );

    const addLiqParams = await getAddLiqParams(amountA, amountB, dexTwoShares, transactionDeadline);

    try {
      const operation = await batchify(tezos.wallet.batch([]), [removeLiqParams, addLiqParams]).send();
      await confirmOperation(operation.opHash, { message: t('newLiquidity|assetsMigrated') });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error', error);
      showErrorToast(error as Error);
    }
  };

  return { canMigrateLiquidity, onMigrateLiquidity };
};
