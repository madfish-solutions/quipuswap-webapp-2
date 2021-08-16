import {
  addLiquidity,
  estimateTezInShares,
  estimateTokenInShares,
  findDex,
  FoundDex,
  getLiquidityShare,
  initializeLiquidity,
  removeLiquidity,
  Token,
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FACTORIES } from '@utils/defaults';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import { slippageToNum } from '@utils/helpers';

type QSMainNet = 'mainnet' | 'florencenet';

export const asyncFindPairDex = async (
  pair:WhitelistedTokenPair,
  setTokenPair:(pair:WhitelistedTokenPair) => void,
  tezos:TezosToolkit,
  accountPkh:any,
  networkId: QSMainNet,
) => {
  try {
    const secondAsset = {
      contract: pair.token2.contractAddress,
      id: pair.token2.fa2TokenId,
    };
    const dex = await findDex(tezos, FACTORIES[networkId], secondAsset);
    const share = await getLiquidityShare(tezos, dex, accountPkh);
    const frozenBalance = share.frozen.div(
      new BigNumber(10)
        .pow(
          // new BigNumber(pair.token2.metadata.decimals),
          // NOT WORKING - CURRENT XTZ DECIMALS EQUALS 6!
          // CURRENT METHOD ONLY WORKS FOR XTZ -> TOKEN, so decimals = 6
          new BigNumber(6),
        ),
    ).toString();
    const totalBalance = share.total.div(
      new BigNumber(10)
        .pow(
          new BigNumber(6),
        ),
    ).toString();
    const res = {
      ...pair, frozenBalance, balance: totalBalance, dex,
    };
    setTokenPair(res);
    return res;
  } catch (err) {
    console.error(err);
  }
  return undefined;
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
  accountPkh: any,
  networkId: QSMainNet,
) => {
  let tokenPairValue = tokenPair;
  if (currentTab.id !== 'remove') {
    const attempt = await asyncFindPairDex(
      { token1, token2 } as WhitelistedTokenPair,
      setTokenPair,
      tezos,
      accountPkh,
      networkId,
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
    const balA1 = sharesTotalA.div(
      new BigNumber(10)
        .pow(
          new BigNumber(6),
        ),
    ).toString();
    const balA2 = sharesTotalB.div(
      new BigNumber(10)
        .pow(
          new BigNumber(6),
        ),
    ).toString();
    setValue(
      'balanceTotalA',
      +balA1,
    );

    setValue(
      'balanceTotalB',
      +balA2,
    );
  } catch (err) {
    console.error(err);
  }
};

export const asyncGetLiquidityShare = async (
  setDex: (dex:FoundDex) => void,
  setTokenPair:(pair:WhitelistedTokenPair) => void,
  setValue:(key:string, value: any) => void,
  setPoolShare: (share:any) => void,
  setRemoveLiquidityParams: (params: TransferParams[]) => void,
  setAddLiquidityParams: (params: TransferParams[]) => void,
  values: any,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  tokenPair: WhitelistedTokenPair,
  dex: FoundDex,
  currentTab:any,
  tezos: TezosToolkit,
  accountPkh: any,
  networkId: QSMainNet,
) => {
  try {
    const account = accountPkh;
    const slippageTolerance = slippageToNum(values.slippage) / 100;
    if (dex) {
      const share = await getLiquidityShare(tezos, dex, account);
      const lpTokenValue = share.total;
      const remParams = await removeLiquidity(
        tezos,
        dex,
        lpTokenValue,
        slippageTolerance,
      );
      const addParams = await addLiquidity(
        tezos,
        dex,
        { tezValue: values.balance1 },
      );
      setPoolShare(share);
      setRemoveLiquidityParams(remParams);
      setAddLiquidityParams(addParams);
      asyncGetShares(
        setTokenPair,
        setValue,
        token1,
        token2,
        tokenPair,
        share.total,
        currentTab,
        values,
        tezos,
        accountPkh,
        networkId,
      );
    } else {
      const toAsset = token2.contractAddress === 'tez' ? {
        contract: 'tez',
      } : {
        contract: token2.contractAddress,
        id: token2.fa2TokenId,
      };
      if (JSON.stringify(token1) !== JSON.stringify(token2)) {
        const tempDex = await findDex(tezos, FACTORIES[networkId], toAsset as Token);
        if (tempDex && tempDex !== dex) {
          setDex(tempDex);
        } else if (!tempDex) {
          const strictFactories = {
            fa1_2Factory: FACTORIES[networkId].fa1_2Factory[0],
            fa2Factory: FACTORIES[networkId].fa2Factory[0],
          };

          const initParams = await initializeLiquidity(
            tezos,
            strictFactories,
            toAsset,
            values.balance2,
            values.balance1,
          );
          setAddLiquidityParams(initParams);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};
