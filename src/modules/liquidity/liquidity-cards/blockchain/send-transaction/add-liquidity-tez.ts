import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { Token } from '@shared/types';

export const addLiquidityTez = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  token: Token,
  tezValue: BigNumber,
  tokenValue: BigNumber
) => {
  // eslint-disable-next-line no-console
  console.log('addLiquidityTez');

  return await withApproveApiForManyTokens(
    tezos,
    dex.contract.address,
    [{ token, amount: tokenValue }],
    await tezos.wallet.pkh(),
    [dex.contract.methods.investLiquidity(tokenValue).toTransferParams({ mutez: true, amount: tezValue.toNumber() })]
  );
};
