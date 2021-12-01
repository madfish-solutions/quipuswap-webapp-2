import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';
import memoizee from 'memoizee';

import { getReadOnlyTezos } from './getReadOnlyTezos';
import { KNOWN_LAMBDA_CONTRACTS } from '../defaults';

const loadChainId = memoizee((tezos: TezosToolkit) => tezos.rpc.getChainId(), {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl(),
});

export const getAllowance = memoizee(
  async (
    tezos: TezosToolkit,
    contractAddress: string,
    owner: string,
    receiver: string,
  ) => {
    const newTezos = getReadOnlyTezos(tezos);
    const contract = await newTezos.contract.at(contractAddress);

    const chainId = await loadChainId(newTezos);
    const lambdaContract = KNOWN_LAMBDA_CONTRACTS.get(chainId);

    try {
      const value = await contract.views.getAllowance(owner, receiver).read(lambdaContract);

      if (!(value instanceof BigNumber) || !value.isFinite()) {
        return new BigNumber(0);
      }

      return value;
    } catch {
      return new BigNumber(0);
    }
  },
  { promise: true, maxAge: 10000 },
);
