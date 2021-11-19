import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';
import memoizee from 'memoizee';

import { getReadOnlyTezos } from './getReadOnlyTezos';
import { KNOWN_LAMBDA_CONTRACTS } from '../defaults';

const loadChainId = memoizee((tezos: TezosToolkit) => tezos.rpc.getChainId(), {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl(),
});

// TODO: implement for liquidity
// const isLPToken = (contract: string) => false;

export const getAllowance = memoizee(
  async (
    tezos: TezosToolkit,
    contractAddress: string,
    owner: string,
    receiver: string,
  ) => {
    const newTezos = getReadOnlyTezos(tezos);
    const contract = await newTezos.contract.at(contractAddress);

    // if (isLPToken(contractAddress)) {
    //   const dexStorage = await contract.storage<any>();
    //   const ledgerValue = await dexStorage.storage.ledger.get(account);
    //
    //   return ledgerValue
    //     ? new BigNumber(ledgerValue.balance).plus(ledgerValue.frozen_balance)
    //     : new BigNumber(0);
    // }
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
