import { TezosToolkit } from '@taquito/taquito';

import { getBlockchainTimestamp, isEmptyArray, isNull, toMilliseconds } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getUserV1FarmingsBalances, getUserYouvesFarmingBalances } from '../helpers';
import { FarmVersion } from '../interfaces';
import { FarmingListItemModel } from '../models';

interface FarmingBalances {
  depositBalance: string;
  earnBalance: string;
}

const getOneContractOneFarmBalances = async (
  item: FarmingListItemModel,
  accountPkh: string,
  tezos: TezosToolkit,
  timestampMs: number
): Promise<FarmingBalances> => {
  switch (item.version) {
    case FarmVersion.v2:
    case FarmVersion.v3:
      return await getUserYouvesFarmingBalances(accountPkh, item, tezos, timestampMs);
    default:
      throw new Error('Farm is of unknown version or it is not of "one contract - one farm" type');
  }
};

const mapOneContractOneFarmBalance =
  (accountPkh: string, tezos: TezosToolkit, timestampMs: number) => async (item: FarmingListItemModel) => {
    try {
      const farmingBalances: FarmingBalances = await getOneContractOneFarmBalances(
        item,
        accountPkh,
        tezos,
        timestampMs
      );

      return {
        ...item,
        ...farmingBalances
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
  const v1Farms = list.filter(({ version }) => version === FarmVersion.v1);
  const oneContractOneFarmFarms = list.filter(({ version }) => version !== FarmVersion.v1);

  const v1FarmingsBalances = await getUserV1FarmingsBalances(
    accountPkh,
    tezos,
    v1Farms,
    toMilliseconds(blockTimestamp)
  );
  const oneContractOneFarmFarmingsBalance = await Promise.all(
    oneContractOneFarmFarms.map(mapOneContractOneFarmBalance(accountPkh, tezos, toMilliseconds(blockTimestamp)))
  );

  return {
    balances: oneContractOneFarmFarmingsBalance.concat(
      v1FarmingsBalances.map((balance, index) => ({
        ...v1Farms[index],
        ...balance
      }))
    )
  };
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
