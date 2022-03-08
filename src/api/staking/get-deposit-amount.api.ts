import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { StakedAmount, StakingStorate } from '@interfaces/staking-storage.interfaces';
import { getContract } from '@utils/dapp';

export const getDepositAmount = async (tezos: TezosToolkit, stakingId: BigNumber, accountPkh: string) => {
  const contract = await getContract(tezos, STAKING_CONTRACT_ADDRESS);
  const storage = await contract.storage<StakingStorate>();

  const stakedAmount = await storage.storage.users_info.get<StakedAmount>([stakingId, accountPkh]);

  return stakedAmount?.staked ?? null;
};
