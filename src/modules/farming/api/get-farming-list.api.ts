import { TezosToolkit } from '@taquito/taquito';

import { getUserTokenBalance } from '@blockchain';
import { ZERO_AMOUNT_BN } from '@config/constants';
import { TokenDto } from '@shared/dto';
import { defined, isEmptyArray, isNull, retry, saveBigNumber } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getUserV1FarmingBalances, getUserYouvesFarmingBalances } from '../helpers';
import { FarmVersion } from '../interfaces';
import { FarmingListItemModel } from '../models';

interface FarmingBalances {
  depositBalance: string;
  earnBalance: string;
}

const getFarmingBalances = async (
  item: FarmingListItemModel,
  accountPkh: string,
  tezos: TezosToolkit
): Promise<FarmingBalances> => {
  switch (item.version) {
    case FarmVersion.v1:
      return await getUserV1FarmingBalances(accountPkh, tezos, item);
    case FarmVersion.v2:
    case FarmVersion.v3:
      return await getUserYouvesFarmingBalances(
        accountPkh,
        item,
        defined(item.contractAddress),
        item.rewardToken,
        tezos
      );
    default:
      throw new Error('Unknown farm version');
  }
};

// TODO: move to shared folder
const getMyBalances = async (token: TokenDto, accountPkh: string, tezos: TezosToolkit) => {
  const balanceBN = await retry(async () => await getUserTokenBalance(tezos, accountPkh, token));

  return saveBigNumber(balanceBN, ZERO_AMOUNT_BN);
};

const mapBalance = (accountPkh: string, tezos: TezosToolkit) => async (item: FarmingListItemModel) => {
  try {
    const myBalance = await getMyBalances(item.stakedToken, accountPkh, tezos);
    const farmingBalances: FarmingBalances = await getFarmingBalances(item, accountPkh, tezos);

    return {
      ...item,
      ...farmingBalances,
      myBalance
    };
  } catch (e) {
    return {
      ...item,
      error: (e as Error).message
    };
  }
};

const injectBalance = async (list: Array<FarmingListItemModel>, accountPkh: string, tezos: TezosToolkit) => {
  const balances = await Promise.all(list.map(mapBalance(accountPkh, tezos)));

  return { balances };
};

export const getFarmingListUserBalances = async (
  accountPkh: Nullable<string>,
  tezos: Nullable<TezosToolkit>,
  farmings: Array<FarmingListItemModel>
) => {
  if (isNull(accountPkh) || isNull(tezos) || isEmptyArray(farmings)) {
    return { balances: [] };
  }

  return await injectBalance(farmings, accountPkh, tezos);
};
