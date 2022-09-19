import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { FARMING_REFERRER_CONTRACT } from '@config/config';
import { DEFAULT_BAKER_FOR_NON_TEZ_LP, FARM_ID_FOR_RESTAKE } from '@config/constants';
import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { QUIPU_TOKEN } from '@config/tokens';

export const harvestAllAndRestake = async (
  tezos: TezosToolkit,
  farmingIds: BigNumber[],
  accountPkh: string,
  rewardsInToken: BigNumber
) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);

  const harvestParams = farmingIds.map(farmingId =>
    farmingContract.methods.harvest(farmingId, accountPkh).toTransferParams()
  );

  const farmingParams = farmingContract.methods
    .deposit(FARM_ID_FOR_RESTAKE, rewardsInToken, FARMING_REFERRER_CONTRACT, accountPkh, DEFAULT_BAKER_FOR_NON_TEZ_LP)
    .toTransferParams();

  const operationParams = [...harvestParams, farmingParams];

  return await withApproveApi(
    tezos,
    FARMING_CONTRACT_ADDRESS,
    QUIPU_TOKEN,
    accountPkh,
    rewardsInToken,
    operationParams
  );
};
