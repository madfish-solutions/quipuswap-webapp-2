import { ChainIds, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { getReadOnlyTezos } from '@shared/dapp';
import { Nullable, Standard, TokenId } from '@shared/types';

const loadChainId = memoizee(async (tezos: TezosToolkit) => tezos.rpc.getChainId(), {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl()
});

export async function getUserBalance(
  tezos: TezosToolkit,
  account: string,
  token: TokenId
): Promise<Nullable<BigNumber>>;
export async function getUserBalance(
  tezos: TezosToolkit,
  account: string,
  contractAddress: string,
  type: Standard,
  tokenId?: number | string
): Promise<Nullable<BigNumber>>;
export async function getUserBalance(
  tezos: TezosToolkit,
  account: string,
  tokenOrTokenAddress: string | TokenId,
  type: Standard = Standard.Fa12,
  fa2TokenId?: number | string
) {
  const tokenAddress =
    typeof tokenOrTokenAddress === 'string' ? tokenOrTokenAddress : tokenOrTokenAddress.contractAddress;
  const tokenStandard = typeof tokenOrTokenAddress === 'string' ? type : tokenOrTokenAddress.type;
  const tokenId = typeof tokenOrTokenAddress === 'string' ? fa2TokenId : tokenOrTokenAddress.fa2TokenId;
  const newTezos = getReadOnlyTezos(tezos);

  if (tokenAddress === 'tez') {
    return newTezos.tz.getBalance(account);
  }
  const contract = await newTezos.contract.at(tokenAddress);

  const chainId = (await loadChainId(newTezos)) as ChainIds;

  let nat: BigNumber | undefined;

  if (tokenStandard === Standard.Fa2) {
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
}

export const getUserTokenBalance = async (tezos: TezosToolkit, account: string, token: TokenId) =>
  await getUserBalance(tezos, account, token.contractAddress, token.type, token.fa2TokenId);
