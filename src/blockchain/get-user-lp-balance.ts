import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN_ID_BN } from '@config/constants';
import { PoolType } from '@modules/new-liquidity/interfaces';

import { getUserLpBalanceDexTwo } from './get-user-lp-balance-dex-two';
import { getUserLpBalanceTezToken } from './get-user-lp-balance-tez-token';
import { getUserLpBalanceTokenToken } from './get-user-lp-balance-token-token';

export const getUserLpBalance = async (
  tezos: TezosToolkit,
  accountPkh: string,
  contractAddress: string,
  type: PoolType,
  tokenId: BigNumber = DEFAULT_TOKEN_ID_BN
): Promise<Nullable<BigNumber>> => {
  const contractInstance = await tezos.contract.at(contractAddress);

  switch (type) {
    case PoolType.DEX_TWO:
      return await getUserLpBalanceDexTwo(contractInstance, accountPkh, tokenId);
    case PoolType.TEZ_TOKEN:
      return await getUserLpBalanceTezToken(contractInstance, accountPkh);
    case PoolType.TOKEN_TOKEN:
      return await getUserLpBalanceTokenToken(contractInstance, accountPkh, tokenId);
    default:
      throw Error('Invalid pool type');
  }
};
