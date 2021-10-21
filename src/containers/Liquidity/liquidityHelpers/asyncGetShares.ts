import {estimateTezInShares, estimateTokenInShares, FoundDex} from '@quipuswap/sdk';
import {TezosToolkit} from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {QSMainNet, WhitelistedToken, WhitelistedTokenPair} from '@utils/types';
import {fromDecimals} from '@utils/helpers';
import {asyncFindPairDex} from './asyncFindPairDex';

export const asyncGetShares = async (
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  setValue: (key: string, value: any) => void,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  tokenPair: WhitelistedTokenPair,
  shares: any,
  values: any,
  currentTab: any,
  tezos: TezosToolkit,
  accountPkh: string,
  networkId: QSMainNet,
  updateToast: (err: Error) => void,
) => {
  let tokenPairValue = tokenPair;
  if (currentTab.id !== 'remove') {
    const attempt = await asyncFindPairDex(
      {token1, token2} as WhitelistedTokenPair,
      setTokenPair,
      tezos,
      accountPkh,
      networkId,
      updateToast,
    );
    if (attempt) {
      tokenPairValue = attempt;
    }
  }
  try {
    const getMethod = async (token: WhitelistedToken, foundDex: FoundDex, value: BigNumber) =>
      token.contractAddress === 'tez'
        ? estimateTezInShares(foundDex.storage, value.toString())
        : estimateTokenInShares(foundDex.storage, value.toString());

    const balanceAB = shares;
    const sharesTotalA = await getMethod(
      tokenPairValue.token1,
      tokenPairValue.dex,
      balanceAB.integerValue(),
    );
    const sharesTotalB = await getMethod(
      tokenPairValue.token2,
      tokenPairValue.dex,
      balanceAB.integerValue(),
    );
    const balA1 = fromDecimals(sharesTotalA, 6).toString();
    const balA2 = fromDecimals(sharesTotalB, 6).toString();
    setValue('balanceTotalA', balA1);

    setValue('balanceTotalB', balA2);
  } catch (err: any) {
    updateToast(err);
  }
};
