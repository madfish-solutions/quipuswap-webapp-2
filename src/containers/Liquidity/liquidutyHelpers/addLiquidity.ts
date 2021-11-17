import {
  Token,
  findDex,
  batchify,
  addLiquidity as getAddLiquidityParams,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { FACTORIES } from '@utils/defaults';
import { QSMainNet } from '@utils/types';
import BigNumber from 'bignumber.js';

export const addLiquidity = async (
  tezos:TezosToolkit,
  networkId: QSMainNet,
  token:Token,
  tezValue: BigNumber,
) => {
  try {
    const dex = await findDex(tezos, FACTORIES[networkId], token);
    const addLiquidityParams = await getAddLiquidityParams(tezos, dex, { tezValue });
    const walletOperation = await batchify(
      tezos.wallet.batch([]),
      addLiquidityParams,
    ).send();

    console.info(walletOperation.opHash);
    await walletOperation.confirmation();
    console.info('Complete');
  } catch (e) {
    console.error(e);
  }
};
