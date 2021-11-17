import {
  Token,
  findDex,
  batchify,
  getLiquidityShare,
  removeLiquidity as getRemoveLiquidityParams,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { FACTORIES } from '@utils/defaults';
import { QSMainNet } from '@utils/types';
import BigNumber from 'bignumber.js';

export const removeLiquidity = async (
  tezos:TezosToolkit,
  networkId: QSMainNet,
  accountPkh:string,
  slippageTolerance: BigNumber,
  token:Token,
) => {
  try {
    const dex = await findDex(tezos, FACTORIES[networkId], token);
    const share = await getLiquidityShare(tezos, dex, accountPkh);
    const lpTokenValue = share.total;

    const removeLiquidityParams = await getRemoveLiquidityParams(
      tezos,
      dex,
      lpTokenValue,
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
