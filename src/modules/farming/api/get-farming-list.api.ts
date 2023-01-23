import { TezosToolkit } from '@taquito/taquito';

import { getUserTokenBalance } from '@blockchain';
import { ZERO_AMOUNT_BN } from '@config/constants';
import { TokenDto } from '@shared/dto';
import { getBlockchainTimestamp, isEmptyArray, isNull, retry, saveBigNumber, toMilliseconds } from '@shared/helpers';
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
  tezos: TezosToolkit,
  timestampMs: number
): Promise<FarmingBalances> => {
  switch (item.version) {
    case FarmVersion.v1:
      return await getUserV1FarmingBalances(accountPkh, tezos, item, timestampMs);
    case FarmVersion.v2:
    case FarmVersion.v3:
      return await getUserYouvesFarmingBalances(accountPkh, item, tezos, timestampMs);
    default:
      throw new Error('Unknown farm version');
  }
};

// TODO: move to shared folder
const getMyBalances = async (token: TokenDto, accountPkh: string, tezos: TezosToolkit) => {
  const balanceBN = await retry(async () => await getUserTokenBalance(tezos, accountPkh, token));

  return saveBigNumber(balanceBN, ZERO_AMOUNT_BN);
};

const mapBalance =
  (accountPkh: string, tezos: TezosToolkit, timestampMs: number) => async (item: FarmingListItemModel) => {
    try {
      const myBalance = await getMyBalances(item.stakedToken, accountPkh, tezos);
      const farmingBalances: FarmingBalances = await getFarmingBalances(item, accountPkh, tezos, timestampMs);

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

const injectBalances = async (list: Array<FarmingListItemModel>, accountPkh: string, tezos: TezosToolkit) => {
  const blockTimestamp = await getBlockchainTimestamp(tezos);
  const balances = await Promise.all(list.map(mapBalance(accountPkh, tezos, toMilliseconds(blockTimestamp))));

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

  return await injectBalances(farmings, accountPkh, tezos);
};
