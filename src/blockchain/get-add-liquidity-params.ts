import { ContractAbstraction, ContractMethod, TransferParams, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { DUMMY_BAKER } from '@config/bakers';
import { LiquidityTokenInfo } from '@modules/liquidity/interfaces';
import { isTezosToken } from '@shared/helpers';

export const getAddLiquidityParams = async (
  accountPkh: string,
  dexTwoContract: ContractAbstraction<Wallet>,
  dexTwoId: BigNumber,
  amounts: { amountA: BigNumber; amountB: BigNumber; shares: BigNumber },
  deadline: string,
  tokensInfo: Array<LiquidityTokenInfo>
) => {
  const addLiqParams: ContractMethod<Wallet> | TransferParams = dexTwoContract.methods.invest_liquidity(
    dexTwoId,
    amounts.amountA,
    amounts.amountB,
    amounts.shares,
    accountPkh,
    DUMMY_BAKER,
    deadline
  );

  const params = tokensInfo.some(({ token }) => isTezosToken(token))
    ? {
        mutez: true,
        amount: amounts.amountB.toNumber()
      }
    : undefined;

  return addLiqParams.toTransferParams(params);
};
