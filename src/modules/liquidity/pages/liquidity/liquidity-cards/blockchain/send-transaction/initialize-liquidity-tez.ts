import { Token, batchify, initializeLiquidity as getInitializeLiquidityParams } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FACTORIES } from '@config/config';
import { SupportedNetworks } from '@shared/types';

const FIRST_FACTORY_INDEX = 0;

export const initializeLiquidityTez = async (
  tezos: TezosToolkit,
  networkId: SupportedNetworks,
  token: Token,
  tokenValue: BigNumber,
  tezValue: BigNumber
) => {
  const factories = {
    fa1_2Factory: FACTORIES[networkId].fa1_2Factory[FIRST_FACTORY_INDEX],
    fa2Factory: FACTORIES[networkId].fa2Factory[FIRST_FACTORY_INDEX]
  };

  const initializeLiquidityParams = await getInitializeLiquidityParams(tezos, factories, token, tokenValue, tezValue);

  return await batchify(tezos.wallet.batch([]), initializeLiquidityParams).send();
};
