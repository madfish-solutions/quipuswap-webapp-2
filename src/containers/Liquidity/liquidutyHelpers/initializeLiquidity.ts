import {
  Token,
  batchify,
  initializeLiquidity as getInitializeLiquidityParams,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

const factories = {
  fa1_2Factory: 'KT1EmfR5bSZN7mWgapE8FZKdbJ3NLjDHGZmd',
  fa2Factory: 'KT1SZzW5BZ6aLmcK9i3Us36angwFB67HmsYT',
};

export const initializeLiquidity = async (
  tezos:TezosToolkit,
  token:Token,
  tokenValue:BigNumber,
  tezValue:BigNumber,
) => {
  try {
    const initializeLiquidityParams = await getInitializeLiquidityParams(
      tezos,
      factories,
      token,
      tokenValue,
      tezValue,
    );

    const walletOperation = await batchify(
      tezos.wallet.batch([]),
      initializeLiquidityParams,
    ).send();

    await walletOperation.confirmation();
  } catch (err) {
    console.error(err);
  }
};
