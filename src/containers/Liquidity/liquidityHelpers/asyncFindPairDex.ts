import { findDex, getLiquidityShare } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { FACTORIES } from '@utils/defaults';
import { QSMainNet, WhitelistedTokenPair } from '@utils/types';
import { fromDecimals } from '@utils/helpers';

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
  } catch (err: any) {
    updateToast(err);
    return pair;
  }
};
