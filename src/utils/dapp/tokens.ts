import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { MAINNET_TOKENS, networksDefaultTokens, SAVED_TOKENS_KEY, TESTNET_TOKENS, TEZOS_TOKEN } from '@app.config';
import { Standard } from '@graphql';
import { getTokenSlug, ipfsToHttps, isNetworkMainnet, isTokenEqual } from '@utils/helpers';
import { getUniqArray } from '@utils/helpers/arrays';
import {
  WhitelistedToken,
  WhitelistedTokenPair,
  QSNetwork,
  TokenId,
  WhitelistedTokenWithQSNetworkType,
  QSNets
} from '@utils/types';
import { isValidContractAddress } from '@utils/validators';

import { getAllowance } from './getAllowance';
import { getContract } from './getStorageInfo';
import { InvalidTokensListError } from './tokens.errors';

interface RawWhitelistedTokenWithQSNetworkType extends Omit<WhitelistedTokenWithQSNetworkType, 'fa2TokenId'> {
  fa2TokenId?: string;
}

export const getSavedTokens = (networkId?: QSNets) => {
  const allRawTokens: Array<RawWhitelistedTokenWithQSNetworkType> =
    typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]') : [];

  const allTokens: WhitelistedTokenWithQSNetworkType[] = allRawTokens.map(({ fa2TokenId, ...restProps }) => ({
    ...restProps,
    fa2TokenId: fa2TokenId === undefined ? undefined : Number(fa2TokenId)
  }));

  return networkId
    ? allTokens.filter(({ network: tokenNetwork }) => !tokenNetwork || tokenNetwork === networkId)
    : allTokens;
};

export const getTokenType = memoizee(
  async (contractOrAddress: string | ContractAbstraction<ContractProvider>, tz: TezosToolkit) => {
    if (typeof contractOrAddress === 'string' && !isValidContractAddress(contractOrAddress)) {
      return undefined;
    }
    const contract =
      typeof contractOrAddress === 'string' ? await getContract(tz, contractOrAddress) : contractOrAddress;
    if (contract.methods.approve) {
      return Standard.Fa12;
    }
    if (contract.methods.update_operators) {
      return Standard.Fa2;
    }

    return undefined;
  },
  { promise: true }
);

export const isTokenFa2 = memoizee(
  async (address: string, tz: TezosToolkit) => {
    if (!isValidContractAddress(address)) {
      return false;
    }

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
    if (!isValidContractAddress(address)) {
      return false;
    }

    try {
      const type = await getContract(tz, address);

      return !!type.methods.approve;
    } catch (e) {
      return false;
    }
  },
  { promise: true }
);

export const getFallbackTokens = (network: QSNetwork, addTokensFromLocalStorage?: boolean) => {
  let tokens: Array<WhitelistedTokenWithQSNetworkType> = [
    {
      ...TEZOS_TOKEN,
      network: network.id
    },
    networksDefaultTokens[network.id]
  ];

  if (addTokensFromLocalStorage) {
    tokens = tokens.concat(getSavedTokens(network.id));
  }

  return getUniqArray(tokens, getTokenSlug);
};

export const getTokens = async (network: QSNetwork, addTokensFromLocalStorage?: boolean) => {
  let tokens = getFallbackTokens(network, addTokensFromLocalStorage);

  const response = await fetch(ipfsToHttps(isNetworkMainnet(network) ? MAINNET_TOKENS : TESTNET_TOKENS));
  const json = await response.json();
  if (json.tokens?.length) {
    tokens = tokens.concat(json.tokens);
  } else {
    throw new InvalidTokensListError(json);
  }

  return getUniqArray(tokens, getTokenSlug);
};

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

export const getWalletContract = memoizee(async (wallet: Wallet, address: string) => wallet.at(address), {
  promise: true
});

export const getAllowanceTransferParams = async (
  tezos: TezosToolkit,
  token: TokenId,
  accountPkh: string,
  spender: string,
  amount: BigNumber
) => {
  if (token.type === Standard.Fa2 || token.contractAddress === TEZOS_TOKEN.contractAddress) {
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
