import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { fetchTezTokenPoolReserves } from './fetch-tez-token-pool-reserves';
import { fetchTokenTokenPoolReserves } from './fetch-token-token-pool-reserves';
import { PoolType } from '../../interfaces';

interface IAccordance {
  contractAddress: string;
  id: BigNumber;
  type: PoolType;
}

export const fetchCurrentPoolReserves = async (tezos: TezosToolkit, { contractAddress, id, type }: IAccordance) => {
  const accordanceInstance = await tezos.wallet.at(contractAddress);

  switch (type) {
    case PoolType.TEZ_TOKEN:
      return await fetchTezTokenPoolReserves(accordanceInstance);
    case PoolType.TOKEN_TOKEN:
      return await fetchTokenTokenPoolReserves(accordanceInstance, id);
    default:
      throw new Error('Unknown pool type');
  }
};
