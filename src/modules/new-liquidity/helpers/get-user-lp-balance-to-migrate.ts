import { TezosToolkit } from '@taquito/taquito';

import { getUserLpBalanceInDex } from '@blockchain';
import { ZERO_AMOUNT } from '@config/constants';
import { PoolType } from '@modules/new-liquidity/interfaces';
import { isExist, isNull, isUndefined } from '@shared/helpers';

import { NewLiquidityItemStore } from '../store';

export const getUserLpBalanceToMigrate = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  liquidityItem: NewLiquidityItemStore
) => {
  const isAccordanceSlug = isExist(liquidityItem.accordanceItem);
  const isDexTwo = liquidityItem.type === PoolType.DEX_TWO;
  const accordanceItem = liquidityItem.accordanceItem;

  if (isNull(tezos) || isNull(accountPkh) || !isDexTwo || !isAccordanceSlug || isUndefined(accordanceItem)) {
    return null;
  }

  const userLpBalance = await getUserLpBalanceInDex(
    tezos,
    accountPkh,
    accordanceItem.contractAddress,
    accordanceItem.type,
    accordanceItem.id
  );

  if (userLpBalance?.isGreaterThan(ZERO_AMOUNT)) {
    return {
      canMigrateLiquidity: true,
      userLpBalance
    };
  }

  return null;
};
