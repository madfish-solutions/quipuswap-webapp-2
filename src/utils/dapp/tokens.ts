import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { MAINNET_TOKENS, SAVED_TOKENS_KEY, TESTNET_TOKENS, TEZOS_TOKEN } from '@utils/defaults';
import { ipfsToHttps, isTokenEqual } from '@utils/helpers';
import {
  WhitelistedToken,
  WhitelistedTokenPair,
  QSNetwork,
  TokenId,
  WhitelistedTokenWithQSNetworkType,
  QSMainNet
} from '@utils/types';
import { isValidContractAddress } from '@utils/validators';

import { getAllowance } from './getAllowance';
import { getContract } from './getStorageInfo';

export const getSavedTokens = (networkId?: QSMainNet) => {
  const allTokens: Array<WhitelistedTokenWithQSNetworkType> =
    typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]') : [];

  return allTokens.filter(({ network }) => !network || !networkId || network === networkId);
};

// TODO: remove either getContract or this method
export const getContractInfo = (address: string, tz: TezosToolkit) => getContract(tz, address);

export const getTokenType = memoizee(
  async (contractOrAddress: string | ContractAbstraction<ContractProvider>, tz: TezosToolkit) => {
    if (typeof contractOrAddress === 'string' && !isValidContractAddress(contractOrAddress)) {
      return undefined;
    }
    const contract =
      typeof contractOrAddress === 'string' ? await getContract(tz, contractOrAddress) : contractOrAddress;
    if (contract.methods.approve) {
      return 'fa1.2';
    }
    if (contract.methods.update_operators) {
      return 'fa2';
    }

    return undefined;
  },
  { promise: true }
);

export const isTokenFa2 = memoizee(
  async (address: string, tz: TezosToolkit) => {
    if (!isValidContractAddress(address)) return false;

    try {
      const type = await getContract(tz, address);

      return !!type.methods.update_operators;
    } catch (e) {
      return false;
    }
  },
  { promise: true }
);

export const isTokenFa12 = memoizee(
  async (address: string, tz: TezosToolkit) => {
    if (!isValidContractAddress(address)) return false;

    try {
      const type = await getContract(tz, address);

      return !!type.methods.approve;
    } catch (e) {
      return false;
    }
  },
  { promise: true }
);

export const getTokens = async (network: QSNetwork, addTokensFromLocalStorage?: boolean) =>
  fetch(ipfsToHttps(network.id === 'hangzhounet' ? TESTNET_TOKENS : MAINNET_TOKENS))
    .then(res => res.json())
    .then(json => {
      let tokens: Array<WhitelistedTokenWithQSNetworkType> = [];
      if (json.tokens?.length !== 0) {
        tokens = json.tokens;
      }
      if (!tokens.some(({ contractAddress }) => contractAddress === TEZOS_TOKEN.contractAddress)) {
        tokens.unshift({
          network: network.id,
          type: 'fa1.2',
          contractAddress: 'tez',
          metadata: {
            decimals: 6,
            name: 'Tezos',
            symbol: 'TEZ',
            thumbnailUri: 'https://ipfs.io/ipfs/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222'
          }
        });
      }
      if (addTokensFromLocalStorage) {
        tokens = getSavedTokens(network.id).concat(tokens);
      }

      return tokens;
    })
    .catch(() => []);

export const saveCustomToken = (token: WhitelistedTokenWithQSNetworkType) => {
  window.localStorage.setItem(
    SAVED_TOKENS_KEY,
    JSON.stringify([
      token,
      ...getSavedTokens().filter((x: WhitelistedTokenWithQSNetworkType) => !isTokenEqual(x, token))
    ])
  );
};

// generate cortege of uniq pairs of token1 repo and token2 repo
// export const mergeTokensToPair = (tokens1, tokens2) =>
// [{token1[0]:tokens2[0]},{token1[1]:tokens2[0]},{token1[2]:tokens2[0]},{token1[0]:tokens2[1]},...]

export const mergeTokensToPair = (tokens1: WhitelistedToken[], tokens2: WhitelistedToken[]): WhitelistedTokenPair[] => {
  const pair = { token1: tokens1[0], token2: tokens2[0] } as WhitelistedTokenPair;

  return [pair];
};

export const getWalletContract = memoizee((wallet: Wallet, address: string) => wallet.at(address), { promise: true });

export const getAllowanceTransferParams = async (
  tezos: TezosToolkit,
  token: TokenId,
  accountPkh: string,
  spender: string,
  amount: BigNumber
) => {
  if (token.type === 'fa2' || token.contractAddress === TEZOS_TOKEN.contractAddress) {
    return [];
  }
  const tokenContract = await getWalletContract(tezos.wallet, token.contractAddress);
  const allowance = await getAllowance(tezos, token.contractAddress, accountPkh, spender);
  const setAllowanceTransferParams = tokenContract.methods.approve(spender, amount).toTransferParams();
  if (allowance.gt(0)) {
    return [tokenContract.methods.approve(spender, 0).toTransferParams(), setAllowanceTransferParams];
  }

  return [setAllowanceTransferParams];
};

export const makeAddOperatorsTransferMethod = async (
  tezos: TezosToolkit,
  accountPkh: string,
  tokenAddress: string,
  tokensIdsOperators: Record<number, string[]>
) => {
  const tokenContract = await getWalletContract(tezos.wallet, tokenAddress);

  return tokenContract.methods.update_operators(
    Object.entries(tokensIdsOperators).flatMap(([tokenId, operators]) =>
      operators.map(operator => ({
        add_operator: {
          owner: accountPkh,
          operator,
          token_id: new BigNumber(tokenId)
        }
      }))
    )
  );
};

export const makeRemoveOperatorsTransferMethod = memoizee(
  async (
    tezos: TezosToolkit,
    accountPkh: string,
    tokenAddress: string,
    tokensIdsOperators: Record<number, string[]>
  ) => {
    const tokenContract = await getWalletContract(tezos.wallet, tokenAddress);

    return tokenContract.methods.update_operators(
      Object.entries(tokensIdsOperators).flatMap(([tokenId, operators]) =>
        operators.map(operator => ({
          remove_operator: {
            owner: accountPkh,
            operator,
            token_id: new BigNumber(tokenId)
          }
        }))
      )
    );
  }
);
