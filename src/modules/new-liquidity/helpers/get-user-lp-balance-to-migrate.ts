import { TezosToolkit } from '@taquito/taquito';

import { getUserLpBalanceInDex } from '@blockchain';
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

  return await getUserLpBalanceInDex(
    tezos,
    accountPkh,
    accordanceItem.contractAddress,
    accordanceItem.type,
    accordanceItem.id
  );
};
