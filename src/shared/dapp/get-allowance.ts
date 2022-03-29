import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { KNOWN_LAMBDA_CONTRACTS } from '@config';

import { getReadOnlyTezos } from './get-read-only-tezos';

const loadChainId = memoizee(async (tezos: TezosToolkit) => tezos.rpc.getChainId(), {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl()
});

export const getAllowance = async (tezos: TezosToolkit, contractAddress: string, owner: string, receiver: string) => {
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
};
