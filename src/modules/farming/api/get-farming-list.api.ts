import { TezosToolkit } from '@taquito/taquito';

import { getUserBalance } from '@blockchain';
import { ZERO_AMOUNT_BN } from '@config/constants';
import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { isEmptyArray, isNull, retry, saveBigNumber } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getUserV1FarmingBalances, getUserYouvesFarmingBalances } from '../helpers';
import { FarmingContractStorageWrapper, FarmVersion } from '../interfaces';
import { FarmingListItemModel } from '../models';

interface FarmingBalances {
  depositBalance: string;
  earnBalance: string;
}

const injectBalance = async (list: Array<FarmingListItemModel>, accountPkh: string, tezos: TezosToolkit) => {
  const wrapStorage = await (
    await tezos.contract.at(FARMING_CONTRACT_ADDRESS)
  ).storage<FarmingContractStorageWrapper>();

  const v1FarmingStorage = wrapStorage.storage;

  const balances = await Promise.all(
    list.map(async item => {
      const { stakedToken, version, contractAddress, rewardToken } = item;

      const balanceBN = await retry(
        async () =>
          await getUserBalance(tezos, accountPkh, stakedToken.contractAddress, stakedToken.type, stakedToken.fa2TokenId)
      );
      const myBalance = saveBigNumber(balanceBN, ZERO_AMOUNT_BN);

      let farmingBalances: FarmingBalances;

      if (version === FarmVersion.v1) {
        farmingBalances = await getUserV1FarmingBalances(accountPkh, v1FarmingStorage, item);
      } else {
        const farmRewardTokenBalanceBN = await retry(
          async () =>
            await getUserBalance(
              tezos,
              contractAddress!,
              rewardToken.contractAddress,
              rewardToken.type,
              rewardToken.fa2TokenId
            )
        );
        const farmRewardTokenBalance = saveBigNumber(farmRewardTokenBalanceBN, ZERO_AMOUNT_BN);
        farmingBalances = await getUserYouvesFarmingBalances(accountPkh, item, farmRewardTokenBalance, tezos);
      }

      return {
        ...item,
        ...farmingBalances,
        myBalance
      };
    })
  );

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
