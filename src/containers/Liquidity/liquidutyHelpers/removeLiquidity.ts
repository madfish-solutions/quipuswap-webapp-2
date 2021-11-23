import {
  batchify,
  FoundDex,
  removeLiquidity as getRemoveLiquidityParams,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import BigNumber from 'bignumber.js';

export const removeLiquidity = async (
  tezos:TezosToolkit,
  dex: FoundDex,
  lpTokenValue: BigNumber,
  slippageTolerance: BigNumber,
) => {
  try {
    const removeLiquidityParams = await getRemoveLiquidityParams(
      tezos,
      dex,
      lpTokenValue.multipliedBy(1_000_000),
      slippageTolerance,
    );

    const walletOperation = await batchify(
      tezos.wallet.batch([]),
      removeLiquidityParams,
    ).send();

    await walletOperation.confirmation();
  } catch (e) {
    console.error(e);
  }
};
