import {
  Token,
  findDex,
  batchify,
  removeLiquidity as getRemoveLiquidityParams,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { FACTORIES } from '@utils/defaults';
import { QSMainNet } from '@utils/types';
import BigNumber from 'bignumber.js';

export const removeLiquidity = async (
  tezos:TezosToolkit,
  networkId: QSMainNet,
  token:Token,
  lpTokenValue: BigNumber,
  slippageTolerance: BigNumber,
) => {
  try {
    const dex = await findDex(tezos, FACTORIES[networkId], token);

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

    console.info(walletOperation.opHash);
    await walletOperation.confirmation();
    console.info('Complete');
  } catch (e) {
    console.error(e);
  }
};
