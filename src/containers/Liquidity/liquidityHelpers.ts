import {
  batchify,
  estimateTezInShares,
  estimateTokenInShares,
  findDex,
  FoundDex,
  getLiquidityShare,
  initializeLiquidity,
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FACTORIES } from '@utils/defaults';
import { QSNetworkType, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import {
  fromDecimals, isTokenEqual, toDecimals,
} from '@utils/helpers';

export const hanldeTokenPairSelect = (
  pair:WhitelistedTokenPair,
  setTokenPair: (pair:WhitelistedTokenPair) => void,
  handleTokenChange: (token:WhitelistedToken, tokenNum:'first' | 'second') => void,
) => {
  handleTokenChange(pair.token1, 'first');
  handleTokenChange(pair.token2, 'second');
  setTokenPair(pair);
};

export const asyncFindPairDex = async (
  pair:WhitelistedTokenPair,
  setTokenPair:(pair:WhitelistedTokenPair) => void,
  tezos:TezosToolkit,
  accountPkh: string,
  networkId: QSNetworkType,
  updateToast: (err:Error) => void,
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
      ...pair, frozenBalance, balance: totalBalance, dex,
    };
    setTokenPair(res);
    return res;
  } catch (err: any) {
    updateToast(err);
    return pair;
  }
};

export const asyncGetShares = async (
  setTokenPair:(pair:WhitelistedTokenPair) => void,
  setValue:(key:string, value: any) => void,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  tokenPair: WhitelistedTokenPair,
  shares:any,
  values: any,
  currentTab: any,
  tezos: TezosToolkit,
  accountPkh: string,
  networkId: QSNetworkType,
  updateToast: (err:Error) => void,
) => {
  let tokenPairValue = tokenPair;
  if (currentTab.id !== 'remove') {
    const attempt = await asyncFindPairDex(
      { token1, token2 } as WhitelistedTokenPair,
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
    const getMethod = async (
      token:WhitelistedToken,
      foundDex:FoundDex,
      value:BigNumber,
    ) => (token.contractAddress === 'tez'
      ? estimateTezInShares(foundDex.storage, value.toString())
      : estimateTokenInShares(foundDex.storage, value.toString()));

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
    setValue(
      'balanceTotalA',
      balA1,
    );

    setValue(
      'balanceTotalB',
      balA2,
    );
  } catch (err: any) {
    updateToast(err);
  }
};

type GetShareType = {
  setDex: (dex:FoundDex) => void,
  setAddLiquidityParams: (params: TransferParams[]) => void,
  values: any,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  dex: FoundDex,
  tezos: TezosToolkit,
  networkId: QSNetworkType,
  updateToast: (err:Error) => void,
};

export const asyncGetLiquidityShare = async ({
  setDex,
  setAddLiquidityParams,
  values,
  token1,
  token2,
  dex,
  tezos,
  networkId,
  updateToast,
} : GetShareType) => {
  try {
    if (!dex) {
      const toAsset = {
        contract: token2.contractAddress,
        id: token2.fa2TokenId ?? undefined,
      };
      if (!isTokenEqual(token1, token2)) {
        try {
          const tempDex = await findDex(tezos, FACTORIES[networkId], toAsset);
          if (tempDex && tempDex !== dex) {
            setDex(tempDex);
          }
        } catch (e: any) {
          if (e.name === 'DexNotFoundError') {
            if (values.balance1 && values.balance2) {
              const strictFactories = {
                fa1_2Factory: FACTORIES[networkId].fa1_2Factory[0],
                fa2Factory: FACTORIES[networkId].fa2Factory[0],
              };
              const tezVal = toDecimals(new BigNumber(values.balance1), 6);
              const tokenVal = new BigNumber(values.balance2);
              const initParams = await initializeLiquidity(
                tezos,
                strictFactories,
                toAsset,
                tokenVal,
                tezVal,
              );
              setAddLiquidityParams(initParams);
              return;
            }
            return;
          }
          updateToast(e);
        }
      }
    }
  } catch (e: any) {
    updateToast(e);
  }
};

export const submitForm = async (
  tezos:TezosToolkit,
  liquidityParams: TransferParams[],
  updateToast: (err:Error) => void,
  handleSuccessToast: (text:string) => void,
  currentTab: string,
) => {
  try {
    const op = await batchify(
      tezos.wallet.batch([]),
      liquidityParams,
    ).send();
    await op.confirmation();
    if (currentTab === 'remove') {
      handleSuccessToast('liquidity|Divest completed!');
    } else {
      handleSuccessToast('liquidity|Invest completed!');
    }
  } catch (e: any) {
    updateToast(e);
  }
};
