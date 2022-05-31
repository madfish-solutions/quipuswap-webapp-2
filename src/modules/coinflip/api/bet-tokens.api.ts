import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { COINFLIP_CONTRACT_ADDRESS } from '@config/enviroment';
import { Token } from '@shared/types';

export const betTokens = async (
  tezos: TezosToolkit,
  token: Token,
  accountPkh: string,
  tokenAsset: number,
  formattedAmount: BigNumber,
  coinSide: string,
  fee: BigNumber
) => {
  const contract = await tezos.contract.at(COINFLIP_CONTRACT_ADDRESS);

  const userBet = contract.methods
    .bet(tokenAsset, formattedAmount, coinSide)
    .toTransferParams({ amount: Number(fee), mutez: true });

  return await withApproveApi(tezos, COINFLIP_CONTRACT_ADDRESS, token, accountPkh, formattedAmount, [userBet]);
};
