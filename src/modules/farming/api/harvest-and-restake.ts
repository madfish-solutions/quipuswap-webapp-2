import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { FARM_ID_FOR_RESTAKE } from '@config/constants';
import { FARMING_CONTRACT_ADDRESS, FARMING_REFERRER_CONTRACT } from '@config/enviroment';
import { Token } from '@shared/types';

export const harvestAndRestake = async (
  tezos: TezosToolkit,
  farmingId: BigNumber,
  accountPkh: string,
  rewardsInToken: BigNumber,
  bakerAddress: string,
  token: Token
) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);

  const harvestParams = farmingContract.methods.harvest(farmingId, accountPkh).toTransferParams();
  const farmingParams = farmingContract.methods
    .deposit(FARM_ID_FOR_RESTAKE, rewardsInToken, FARMING_REFERRER_CONTRACT, accountPkh, bakerAddress)
    .toTransferParams();

  const operationParams = [harvestParams, farmingParams];

  return await withApproveApi(tezos, FARMING_CONTRACT_ADDRESS, token, accountPkh, rewardsInToken, operationParams);
};
