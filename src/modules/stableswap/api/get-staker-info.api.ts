import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { getContract } from '@shared/dapp/get-storage-info';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { RawContractStakerInfo, RawStakerInfo, StableFarmItem } from '../types';

const DEFAULT_VALUE = new BigNumber('0');
const DEFAULT_USER_INFO_VALUE = null;

const callStakerInfoContractView = async (
  contract: ReturnType<TezosToolkit['contract']['at']>,
  accountPkh: string
): Promise<Nullable<Array<RawContractStakerInfo>>> => {
  const constractInstance = await Promise.resolve(contract);

  try {
    return await constractInstance.contractViews
      .get_staker_info([{ user: accountPkh, pool_id: DEFAULT_STABLESWAP_POOL_ID }])
      .executeView({ viewCaller: accountPkh });
  } catch (error) {
    return DEFAULT_USER_INFO_VALUE;
  }
};

export const getStakerInfo = async (
  tezos: Nullable<TezosToolkit>,
  stableFarmsList: Array<StableFarmItem>,
  accountPkh: Nullable<string>
): Promise<Array<RawStakerInfo>> => {
  if (isNull(tezos) || isNull(accountPkh)) {
    return stableFarmsList.map(() => ({ yourReward: null, yourDeposit: DEFAULT_VALUE }));
  }

  const contractsPromises = stableFarmsList.map(async ({ contractAddress }) => getContract(tezos, contractAddress));
  const userInfoPromises = contractsPromises.map(async contract => callStakerInfoContractView(contract, accountPkh));
  const userInfo = await Promise.all(userInfoPromises);

  return userInfo.map(item => {
    if (isNull(item)) {
      return {
        yourDeposit: DEFAULT_VALUE,
        yourReward: null
      };
    }

    const [{ info }] = item;

    return {
      yourDeposit: info.balance,
      yourReward: info.rewards
    };
  });
};
