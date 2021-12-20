import { batchify, FoundDex, removeLiquidity as getRemoveLiquidityParams } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export const removeLiquidityTez = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  lpTokenValue: BigNumber,
  slippageTolerance: BigNumber
) => {
  const removeLiquidityParams = await getRemoveLiquidityParams(tezos, dex, lpTokenValue, slippageTolerance);

  const walletOperation = await batchify(tezos.wallet.batch([]), removeLiquidityParams).send();

  return walletOperation.confirmation();
};
