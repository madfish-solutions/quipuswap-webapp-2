import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS, FARMING_REFERRER_CONTRACT } from '@config/enviroment';
import { Token } from '@shared/types';

import { getFarmIdForRestake } from '../helpers/get-farm-id-for-restake';
import { withApproveApiNew } from './with-approve-new.api';

const FARMING_ID_FOR_RESTAKING = getFarmIdForRestake();

export const harvestAndRestake = async (
  tezos: TezosToolkit,
  farmingId: BigNumber,
  accountPkh: string,
  rewardsInToken: BigNumber,
  bakerAddress: string,
  token: Token
) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);

  const harvestParams = farmingContract.methods.harvest(farmingId, accountPkh);
  const farmingParams = farmingContract.methods.deposit(
    FARMING_ID_FOR_RESTAKING,
    rewardsInToken,
    FARMING_REFERRER_CONTRACT,
    accountPkh,
    bakerAddress
  );

  const operationParams = [harvestParams, farmingParams];

  return await withApproveApiNew(tezos, FARMING_CONTRACT_ADDRESS, token, accountPkh, 1, operationParams);
};
