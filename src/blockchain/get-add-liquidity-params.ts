import { ContractAbstraction, ContractMethod, TransferParams, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { DUMMY_BAKER } from '@config/bakers';
import { LiquidityTokenInfo } from '@modules/new-liquidity/interfaces';
import { isTezosToken } from '@shared/helpers';

export const getAddLiquidityParams = async (
  accountPkh: string,
  dexTwoContract: ContractAbstraction<Wallet>,
  dexTwoId: BigNumber,
  amounts: { amountA: BigNumber; amountB: BigNumber; shares: BigNumber },
  deadline: string,
  tokensInfo: Array<LiquidityTokenInfo>
) => {
  let addLiqParams: ContractMethod<Wallet> | TransferParams = dexTwoContract.methods.invest_liquidity(
    dexTwoId,
    amounts.amountA,
    amounts.amountB,
    amounts.shares,
    accountPkh,
    DUMMY_BAKER,
    deadline
  );

  if (tokensInfo.some(({ token }) => isTezosToken(token))) {
    addLiqParams = addLiqParams.toTransferParams({
      mutez: true,
      amount: amounts.amountB.toNumber()
    });
  } else {
    addLiqParams = addLiqParams.toTransferParams();
  }

  return addLiqParams;
};
