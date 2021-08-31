import {
  addLiquidity,
  batchify,
  estimateTezInShares,
  estimateTokenInShares,
  findDex,
  FoundDex,
  getLiquidityShare,
  initializeLiquidity,
  removeLiquidity,
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FACTORIES } from '@utils/defaults';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import {
  fromDecimals, isTokenEqual, slippageToBignum, toDecimals,
} from '@utils/helpers';

type QSMainNet = 'mainnet' | 'florencenet';

export const hanldeTokenPairSelect = (
  pair:WhitelistedTokenPair,
  setTokenPair: (pair:WhitelistedTokenPair) => void,
  handleTokenChange: (token:WhitelistedToken, tokenNum:'first' | 'second') => void,
  tezos:TezosToolkit | null,
  accountPkh:string | null,
  networkId?:QSMainNet,
) => {
  const asyncFunc = async () => {
    handleTokenChange(pair.token1, 'first');
    handleTokenChange(pair.token2, 'second');
    if (!tezos || !accountPkh || !networkId) {
      setTokenPair(pair);
      return;
    }
    try {
      const secondAsset = {
        contract: pair.token2.contractAddress,
        id: pair.token2.fa2TokenId,
      };
      const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);
      const share = await getLiquidityShare(tezos, foundDex, accountPkh!!);

      const frozenBalance = fromDecimals(share.frozen, 6).toString();
      const totalBalance = fromDecimals(share.total, 6).toString();
      const res = {
        ...pair, frozenBalance, balance: totalBalance, dex: foundDex,
      };
      setTokenPair(res);
    } catch (err) {
      console.error(err);
    }
  };
  asyncFunc();
};

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
    const frozenBalance = fromDecimals(share.frozen, 6).toString();
    const totalBalance = fromDecimals(share.total, 6).toString();
    const res = {
      ...pair, frozenBalance, balance: totalBalance, dex,
    };
    setTokenPair(res);
    return res;
  } catch (err) {
    console.error(err);
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
    const balA1 = fromDecimals(sharesTotalA, 6).toString();
    const balA2 = fromDecimals(sharesTotalB, 6).toString();

    console.log(balA1);
    setValue(
      'balanceTotalA',
      balA1,
    );

    setValue(
      'balanceTotalB',
      balA2,
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
    const slippageTolerance = slippageToBignum(values.slippage).div(100);
    if (dex) {
      const share = await getLiquidityShare(tezos, dex, account);
      try {
        if (values.balance3) {
          const lpTokenValue = toDecimals(new BigNumber(values.balance3), 6);
          const remParams = await removeLiquidity(
            tezos,
            dex,
            lpTokenValue,
            slippageTolerance,
          );
          setRemoveLiquidityParams(remParams);
        }
        setPoolShare(share);
        if (values.balance1) {
          const tezValue = toDecimals(new BigNumber(values.balance1), 6);
          const addParams = await addLiquidity(
            tezos,
            dex,
            { tezValue },
          );
          setAddLiquidityParams(addParams);
        }
        console.log('share', share);
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
      } catch (e) {
        console.error(e);
      }
    } else {
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
        } catch (e) {
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
          console.error(e);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const submitForm = async (
  tezos:TezosToolkit,
  liquidityParams: TransferParams[],
  updateToast: (err:string) => void,
  handleSuccessToast: any,
) => {
  try {
    const op = await batchify(
      tezos.wallet.batch([]),
      liquidityParams,
    ).send();
    await op.confirmation();
    handleSuccessToast();
  } catch (e) {
    updateToast(e);
  }
};
