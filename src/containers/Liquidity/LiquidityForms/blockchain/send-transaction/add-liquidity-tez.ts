import { batchify, FoundDex, addLiquidity as getAddLiquidityParams } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export const addLiquidityTez = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  tezValue: BigNumber,
  tokenValue: BigNumber
) => {
  const addLiquidityParams = await getAddLiquidityParams(tezos, dex, { tezValue, tokenValue });

  return await batchify(tezos.wallet.batch([]), addLiquidityParams).send();
};
