import { TezosToolkit } from '@taquito/taquito';

import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { getContract } from '@shared/dapp/get-storage-info';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { StableFarmItem, StakerInfo } from '../types';

const DEFAULT_VALUE = null;

export const getStakerInfo = async (
  tezos: Nullable<TezosToolkit>,
  stableFarmsList: Array<StableFarmItem>,
  accountPkh: Nullable<string>
): Promise<{ [key: string]: StakerInfo }> => {
  const stakerInfo: { [key: string]: StakerInfo } = {};

  if (isNull(tezos) || isNull(accountPkh)) {
    for (const { contractAddress } of stableFarmsList) {
      stakerInfo[contractAddress] = { yourEarned: null, yourDeposit: null };
    }

    return stakerInfo;
  }

  for (const { contractAddress } of stableFarmsList) {
    const contract = await getContract(tezos, contractAddress);

    // Remove try/catch after updating contracts
    try {
      const [{ info }] = await contract.contractViews
        .get_staker_info([{ user: accountPkh, pool_id: DEFAULT_STABLESWAP_POOL_ID }])
        .executeView({ viewCaller: accountPkh });

      stakerInfo[contractAddress] = {
        yourEarned: info.rewards.get(DEFAULT_STABLESWAP_POOL_ID) ?? DEFAULT_VALUE,
        yourDeposit: info.balance
      };
    } catch (error) {
      stakerInfo[contractAddress] = { yourEarned: DEFAULT_VALUE, yourDeposit: DEFAULT_VALUE };
    }
  }

  return stakerInfo;
};
