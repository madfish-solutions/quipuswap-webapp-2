import {
  estimateTezInShares,
  estimateTokenInShares,
  findDex,
  FoundDex,
  getLiquidityShare,
} from '@quipuswap/sdk';
import {TezosToolkit} from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {FACTORIES} from '@utils/defaults';
import {QSMainNet, WhitelistedToken, WhitelistedTokenPair} from '@utils/types';
import {fromDecimals} from '@utils/helpers';

export const hanldeTokenPairSelect = (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  handleTokenChange: (token: WhitelistedToken, tokenNum: 'first' | 'second') => void,
) => {
  handleTokenChange(pair.token1, 'first');
  handleTokenChange(pair.token2, 'second');
  setTokenPair(pair);
};

export const asyncFindPairDex = async (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  tezos: TezosToolkit,
  accountPkh: string,
  networkId: QSMainNet,
  updateToast: (err: Error) => void,
) => {
  try {
    const secondAsset = {
      contract: pair.token2.contractAddress,
      id: pair.token2.fa2TokenId,
    };
    const dex = await findDex(tezos, FACTORIES[networkId], secondAsset);
    const share = await getLiquidityShare(tezos, dex, accountPkh);
    const frozenBalance = fromDecimals(share.frozen, 6).toString();
    const totalBalance = fromDecimals(share.total, 6).toString();
    const res = {
      ...pair,
      frozenBalance,
      balance: totalBalance,
      dex,
    };
    setTokenPair(res);
    return res;
  } catch (err) {
    updateToast(err);
    return pair;
  }
};

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
  } catch (err) {
    updateToast(err);
  }
};

export const submitForm = async () =>
  // tezos:TezosToolkit,
  // values: LiquidityFormValues,
  // updateToast: (err:Error) => void,
  // handleSuccessToast: (text:string) => void,
  // currentTab: string,
  {
    // try {
    //   const dop = await batchify(
    //     tezos.wallet.batch([]),
    //     liquidityParams,
    //   );
    //   // console.log(dop);
    //   // dop.operations.filter(rm_first)
    //   const op = await dop.send();
    //   await op.confirmation();
    //   if (currentTab === 'remove') {
    //     handleSuccessToast('liquidity|Divest completed!');
    //   } else {
    //     handleSuccessToast('liquidity|Invest completed!');
    //   }
    // } catch (e) {
    //   updateToast(e);
    // }
  };
