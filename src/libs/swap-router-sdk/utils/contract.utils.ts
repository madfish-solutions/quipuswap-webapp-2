import { ContractAbstraction, ContractProvider, TezosToolkit } from '@taquito/taquito';

import pMemoize from '../lib/p-memoize';

export const getContract = pMemoize(
  async <T extends ContractAbstraction<ContractProvider>>(address: string, tezos: TezosToolkit) =>
    tezos.contract.at<T>(address),
  {
    cacheKey: ([address]) => address
  }
);
