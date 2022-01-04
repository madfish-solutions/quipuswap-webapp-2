import { batchify, FoundDex, addLiquidity as getAddLiquidityParams } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export const addLiquidityTez = async (tezos: TezosToolkit, dex: FoundDex, tezValue: BigNumber) => {
  const addLiquidityParams = await getAddLiquidityParams(tezos, dex, { tezValue });
  const walletOperation = await batchify(tezos.wallet.batch([]), addLiquidityParams).send();

  return walletOperation.confirmation();
};
