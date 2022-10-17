import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { getContract } from '@shared/dapp';

export const claimNewLiquidityBakerRewards = async (
  tezos: TezosToolkit,
  contractAddress: string,
  poolId: BigNumber,
  accountPkh: string
) => {
  const contract = await getContract(tezos, contractAddress);

  const params = contract.methodsObject
    .withdraw_profit({ pair_id: poolId, receiver: accountPkh, referral_code: QUIPUSWAP_REFERRAL_CODE })
    .toTransferParams();

  return await sendBatch(tezos, [params]);
};
