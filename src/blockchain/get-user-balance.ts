import { ChainIds, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { getReadOnlyTezos } from '@shared/dapp';
import { Standard, Token } from '@shared/types';

const loadChainId = memoizee(async (tezos: TezosToolkit) => tezos.rpc.getChainId(), {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl()
});

export const getUserBalance = async (
  tezos: TezosToolkit,
  account: string,
  contractAddress: string,
  type: Standard = Standard.Fa12,
  tokenId?: number | string
) => {
  const newTezos = getReadOnlyTezos(tezos);

  if (contractAddress === 'tez') {
    return newTezos.tz.getBalance(account);
  }
  const contract = await newTezos.contract.at(contractAddress);

  const chainId = (await loadChainId(newTezos)) as ChainIds;

  let nat: BigNumber | undefined;

  if (type === Standard.Fa2) {
    try {
      const response = await contract.views.balance_of([{ owner: account, token_id: tokenId }]).read(chainId);
      nat = response[0].balance;
    } catch (e) {
      return null;
    }
  } else {
    try {
      nat = await contract.views.getBalance(account).read(chainId);
    } catch {
      return null;
    }
  }

  if (!nat || nat.isNaN()) {
    return null;
  }

  return nat;
};

export const getUserTokenBalance = async (tezos: TezosToolkit, account: string, token: Token) =>
  await getUserBalance(tezos, account, token.contractAddress, token.type, token.fa2TokenId);
