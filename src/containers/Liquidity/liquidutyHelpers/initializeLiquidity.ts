import { Token, batchify, initializeLiquidity as getInitializeLiquidityParams } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FACTORIES } from '@utils/defaults';
import { QSMainNet } from '@utils/types';

export const initializeLiquidity = async (
  tezos: TezosToolkit,
  networkId: QSMainNet,
  token: Token,
  tokenValue: BigNumber,
  tezValue: BigNumber
) => {
  const factories = {
    fa1_2Factory: FACTORIES[networkId].fa1_2Factory[0],
    fa2Factory: FACTORIES[networkId].fa2Factory[0]
  };

  const initializeLiquidityParams = await getInitializeLiquidityParams(tezos, factories, token, tokenValue, tezValue);

  const walletOperation = await batchify(tezos.wallet.batch([]), initializeLiquidityParams).send();

  return walletOperation.confirmation();
};
