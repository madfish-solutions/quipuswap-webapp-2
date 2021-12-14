import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { KNOWN_LAMBDA_CONTRACTS } from '../defaults';
import { getReadOnlyTezos } from './getReadOnlyTezos';

const loadChainId = memoizee((tezos: TezosToolkit) => tezos.rpc.getChainId(), {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl()
});

// TODO: implement for liquidity
// const isLPToken = (contract: string) => false;

export const getUserBalance = async (
  tezos: TezosToolkit,
  account: string,
  contractAddress: string,
  type: 'fa1.2' | 'fa2' = 'fa1.2',
  tokenId = 0
) => {
  const newTezos = getReadOnlyTezos(tezos);

  if (contractAddress === 'tez') {
    return newTezos.tz.getBalance(account);
  }
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

  let nat: BigNumber | undefined;

  if (type === 'fa2') {
    try {
      const response = await contract.views.balance_of([{ owner: account, token_id: tokenId }]).read(lambdaContract);
      nat = response[0].balance;
    } catch (e) {
      return null;
    }
  } else {
    try {
      nat = await contract.views.getBalance(account).read(lambdaContract);
    } catch {
      return null;
    }
  }

  if (!nat || nat.isNaN()) {
    return null;
  }

  return nat;
};
