import { ChainIds, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { getReadOnlyTezos } from '@shared/dapp';

const loadChainId = memoizee(async (tezos: TezosToolkit) => tezos.rpc.getChainId(), {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl()
});

export const getAllowance = async (tezos: TezosToolkit, contractAddress: string, owner: string, receiver: string) => {
  const newTezos = getReadOnlyTezos(tezos);
  const contract = await newTezos.contract.at(contractAddress);
  const chainId = (await loadChainId(newTezos)) as ChainIds;

  try {
    const value = await contract.views.getAllowance(owner, receiver).read(chainId);

    if (!(value instanceof BigNumber) || !value.isFinite()) {
      return new BigNumber(0);
    }

    return value;
  } catch {
    return new BigNumber(0);
  }
};
